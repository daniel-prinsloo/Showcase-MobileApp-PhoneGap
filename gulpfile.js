/** 
 * Gulp tasks split into files under /gulp/
 * conf.js - Configuration of paths to use as well as source of files used with scripts
 * debug.js - Preparing and running debug version from src folder
 * analysis.js - HTML validator and eslint checks
 * build.js - Building and minification to dist folder
 * phonegap.js - Phonegap specific tasks and functions 
*/
var gulp = require('gulp'),
    //$.function calls are gulp plugins, converts gulp-ex-plugin to &.exPlugin
    $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

//Load in sepereate gulp script files as decribed above
var requireDirectory = require('require-directory');
var routes = requireDirectory(module, './gulp');
var conf = require('./gulp/conf');

gulp.task('serve', function (callback) {
    runSequence(
        'dev-setup',
        ['host', 'watch', 'watchfiles'],
        callback);
});

gulp.task('default', ['serve'], function () {

});