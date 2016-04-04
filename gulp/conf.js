/**
 *  Configuration of paths to use as well as source of files used with scripts
 */

var gulp = require('gulp'),
    //$.function calls are gulp plugins, converts gulp-ex-plugin to &.exPlugin
    $ = require('gulp-load-plugins')();
var path = require('path');
var mainBowerFiles = require('main-bower-files');
var exists = require('path-exists').sync;

/**
 *  Main paths of projects
 */
exports.paths = {
  src: 'src',
  dist: 'www',
  tmp: '.tmp',
  e2e: 'e2e'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

exports.sourceHtml = function() {
    return [
        path.join(exports.paths.src, '/**/*.html'),
        path.join('!' + exports.paths.src, '/lib/**/*.html')
    ];
};

exports.sourceIndex = function() {
    return path.join(exports.paths.src, '/index.html');
};

exports.sourceTemplateHtml = function() {
    return [
        path.join(exports.paths.src, '/**/*.html'),
        path.join('!' + exports.paths.src, '/index.html'),
        path.join('!' + exports.paths.src, '/lib/**/*.html')        
    ];
};

exports.sourceScripts = function() {
    return [
        path.join(exports.paths.src, '/app/**/*.module.js'),
        path.join(exports.paths.src, '/app/**/*.js'),
        path.join('!' + exports.paths.src, '/app/**/*.spec.js'),
        path.join('!' + exports.paths.src, '/app/**/*.mock.js')
    ];
};

exports.sourceStyles = function() {
    return [
        path.join(exports.paths.src, '/css/*.css'),
        path.join('!' + exports.paths.src, '/app/lib/*.css')];
};

exports.sourceBower = function(filter) {
    return mainBowerFiles(filter).map( function(path, index, arr) {
        var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
        return exists( newPath ) ? newPath : path;
    });
};