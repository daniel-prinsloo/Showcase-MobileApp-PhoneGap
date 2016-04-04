/** 
 * Phonegap specific tasks and functions 
*/

var gulp = require('gulp');
var exec = require('child_process').exec;
var readJson = require('read-package-json');
var argv = require('yargs').argv;
var shell = require('gulp-shell');
var fs = require('fs');
var runSequence = require('run-sequence');

var conf = require('./conf');

function phonegapPlugin(plugin, command, jenkins) {
    var pluginCmd;
    pluginCmd = 'phonegap plugin ' + command + ' ';
    if (typeof plugin === 'string') {
        pluginCmd += plugin;
    } else {
        if (command === 'add') {
            pluginCmd += plugin.locator + ' ';
            if (plugin.variables) {
                Object.keys(plugin.variables).forEach(function (variable) {
                    pluginCmd += '--variable ' + variable + '="' + plugin.variables[variable] + '" ';
                });
            }
        } else {
            pluginCmd += plugin.id;
        }
    }
    return pluginCmd;
};

function phonegapPluginInstall(index, json, command, jenkins, items) {
    if (json.plugins) {
        if (index >= json.plugins.length) {
            console.info('Finished plugin installation');
            return items;
        }
        if (!items)
            items = "";
        var plugin = json.plugins[index];
        var pluginCommand = phonegapPlugin(plugin, command, jenkins);
        items = items + '\r\n' + pluginCommand;
        console.info('Running command: ' + pluginCommand);
        if (!jenkins) {
            exec(pluginCommand, function (err, stdout, stderr) {
                console.info(stdout);
                console.error(stderr);
            });
        }
        return phonegapPluginInstall(index + 1, json, command, jenkins, items);
    }
    else {
        return;
    }
};


gulp.task('add-plugins', function () {
    readJson('package.json', console.error, false, function (er, data) {
        var result = phonegapPluginInstall(0, data, 'add', argv.jenkins);
        if (result) {
            fs.writeFile('plugins.bat', result, 'utf-8', function (err) {
                if (err)
                    throw err;
                console.log('File Created');
            });
        }
    });
});

gulp.task('add-platform-android', function () {
    exec('phonegap platform add android -d', function (err, stdout, stderr) {
        console.info(stdout);
        console.error(stderr);
    });
});

gulp.task('setup:phonegap:android', function (callback) {
    return runSequence(
        'add-platform-android',
        'add-plugins',
        callback);
});