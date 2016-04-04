/**
 *  HTML validator and eslint checks
 */

var gulp = require("gulp"),
    //$.function calls are gulp plugins, converts gulp-ex-plugin to &.exPlugin
    $ = require('gulp-load-plugins')();
var path = require("path");
var runSequence = require('run-sequence');

var conf = require('./conf');

gulp.task('validate-html', function () {
   gulp.src(conf.sourceHtml())
        .pipe($.htmlhint({"doctype-first":false}))
        .pipe($.htmlhint.reporter());
});

gulp.task('eslint-js', function () {
  gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size())
});

gulp.task('analyse', function (callback) {
    return runSequence('eslint-js',
              'validate-html',
              callback);  
});