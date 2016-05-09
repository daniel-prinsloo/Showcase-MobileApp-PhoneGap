/**
 *  Building and minification to dist folder
 */

var gulp = require('gulp'),
    //$.function calls are gulp plugins, converts gulp-ex-plugin to &.exPlugin
    $ = require('gulp-load-plugins')();

var argv = require('yargs').argv;
var path = require('path');
var exists = require('path-exists').sync;
var addStream = require('add-stream');
var del = require('del');
var runSequence = require('run-sequence');

// var requireDirectory = require('require-directory');
// var routes = requireDirectory(module, '../gulp');

/**
 * To see a list of all files in pipe with debugging
 * Use it in stream .pipe($.debug({title: 'debug:'}))
 */

var conf = require('./conf');

gulp.task('build-clean', function () {
    return del([
        path.join(conf.paths.tmp, '/**'),
        path.join(conf.paths.dist, '/**'),
        '!'+conf.paths.tmp,
        '!'+conf.paths.dist]);
});

gulp.task('build-partials', function () {
  return gulp.src(conf.sourceTemplateHtml())
    .pipe($.htmlhint({"doctype-first":false, "spec-char-escape":true}))
    .pipe($.htmlhint.reporter())
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'templates',
      root:'',
      standAlone: false     
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});


gulp.task('build-copy-maps', ['build-inject'], function () {
    if(argv.sourcemaps) {
        return gulp.src([
            path.join(conf.paths.tmp, 'css/vendor.css.map'),
            path.join(conf.paths.tmp, 'js/vendor.js.map'),
            path.join(conf.paths.tmp, 'css/src.css.map'),
            path.join(conf.paths.tmp, 'js/src.js.map')])
        .pipe(gulp.dest('./' + conf.paths.dist));
    }
});

gulp.task('build-inject-copy', function () {
    return  gulp.src([
        path.join(conf.paths.tmp, 'css/vendor.css'),
        path.join(conf.paths.tmp, 'js/vendor.js'),
        path.join(conf.paths.tmp, 'css/src.css'),
        path.join(conf.paths.tmp, 'js/src.js')
        ], {base: './' + conf.paths.tmp})
        .pipe(gulp.dest('./' + conf.paths.dist));
});

gulp.task('build-inject', ['build-inject-copy'], function () {
    var target = gulp.src(path.join(conf.paths.dist,'/index.html'));
    return target
        .pipe($.inject(gulp.src([path.join(conf.paths.tmp, 'js/vendor.js'),path.join(conf.paths.tmp, 'css/vendor.css')], {read: false}), {ignorePath: conf.paths.tmp, addRootSlash: false, name: 'bower'}))
        .pipe($.inject(gulp.src(path.join(conf.paths.tmp, 'css/src.css')), { ignorePath: conf.paths.tmp, addRootSlash: false }))
        .pipe($.inject(gulp.src(path.join(conf.paths.tmp, 'js/src.js')), { ignorePath: conf.paths.tmp, addRootSlash: false }))
        .pipe(gulp.dest('./' + conf.paths.dist));
});

gulp.task('build-bower', function(){
    return gulp.src(conf.sourceBower())
        .pipe($.sourcemaps.init())
        .pipe($.if('*.css', $.concat('temp_vendor.css')))
        .pipe($.if('*.js', $.concat('temp_vendor.js')))
        .pipe(gulp.dest(conf.paths.tmp))
        .pipe($.if('*.css', $.rename('css/vendor.css')))
        .pipe($.if('*.js', $.rename('js/vendor.js')))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('build-scripts', ['build-partials'], function() {
    return gulp.src(conf.sourceScripts())
        .pipe($.addSrc(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js')))
        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))
        .pipe($.sourcemaps.init())
        .pipe($.concat('temp_src.js'))
        .pipe(gulp.dest(conf.paths.tmp))
        .pipe($.rename('js/src.js'))
        .pipe($.ngAnnotate({add: true}))
        .pipe($.uglify({mangle: true}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('build-styles', function(){
    return gulp.src(conf.sourceStyles())
        .pipe($.sourcemaps.init())
        .pipe($.concat('temp_vendor.css'))
        .pipe(gulp.dest(conf.paths.tmp))
        .pipe($.rename('css/src.css'))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('build-html', function() {
  return gulp.src(conf.sourceIndex())
    .pipe($.htmlhint({"doctype-first":false, "spec-char-escape":true}))
    .pipe($.htmlhint.reporter())
    .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('build-copy-other', function () {
    return gulp.src([
            path.join(conf.paths.src, 'images/**/*'),
            path.join(conf.paths.src, 'fonts/**/*'),
            path.join(conf.paths.src, '/*'),
            //PhoneGap requirement
            path.join(conf.paths.src, '/cordova.js'),
            path.join('!' + conf.paths.src, '/*.html'),
            path.join('!' + conf.paths.src, '/~less'),
            path.join('!' + conf.paths.src, '/lib'),
            path.join('!' + conf.paths.src, '/css'),
            path.join('!' + conf.paths.src, '*.eslint')
        ], {base: './' + conf.paths.src})
        .pipe(gulp.dest('./' + conf.paths.dist));
});

gulp.task('build', function(buildCallback) {
    return runSequence(['build-clean', 'dev-setup'],
              ['build-partials', 'build-bower', 'build-scripts', 'build-styles', 'build-html', 'build-copy-other'],
              'build-inject',
              'build-copy-maps',
              buildCallback);
});

gulp.task('build-copy-debug', function () {
    var sourceToCopy = [];
    sourceToCopy = sourceToCopy.concat(conf.sourceHtml());
    sourceToCopy = sourceToCopy.concat(conf.sourceScripts());
    sourceToCopy = sourceToCopy.concat(conf.sourceStyles());
    sourceToCopy = sourceToCopy.concat(conf.sourceBower());
    return gulp.src(sourceToCopy, {base: './' + conf.paths.src})
        .pipe(gulp.dest('./' + conf.paths.dist));
});

/** 
 * Copy debug version to the dist path
*/
gulp.task('build:debug', function(buildDebugCallback) {
    runSequence(['build-clean','analyse', 'dev-setup'],
              'build-copy-debug',
              'build-copy-other',
              buildDebugCallback);
});

gulp.task('host:build', function () {
    gulp.src(conf.paths.dist)
        .pipe($.webserver({
            livereload: true,
            open: 'index.html'
    }));
});

gulp.task('serve:build:debug', function (serveBuildDebugCallback) {
    return runSequence('build:debug',
              'host:build',
              serveBuildDebugCallback);
});

gulp.task('serve:build', function (serveBuildCallback) {
    return runSequence('build',
              'host:build',
              serveBuildCallback);
});