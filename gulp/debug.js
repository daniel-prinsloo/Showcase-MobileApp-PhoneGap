/**
 *  Preparing and running debug version from src folder
 */

var gulp = require('gulp'),
    //$.function calls are gulp plugins, converts gulp-ex-plugin to &.exPlugin
    $ = require('gulp-load-plugins')();
var exec = require('child_process').exec;
var readJson = require('read-package-json');
var argv = require('yargs').argv;
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var path = require('path');
var es = require('event-stream');
var mainBowerFiles = require('main-bower-files');
var exists = require('path-exists').sync;
var angularTemplateCache = require('gulp-angular-templatecache');
var addStream = require('add-stream');
var del = require('del');
var runSequence = require('run-sequence');

var conf = require('./conf');

//To see a list of all files in pipe use this in the pipe
//.pipe($.debug({title: 'debug:'}))

gulp.task('debug-clean', function () {
    return del([
        path.join(conf.paths.src, '/css/**'),
        '!'+conf.paths.src + '/css']);
});

gulp.task('copy-bower-fonts', function () {
    var target = gulp.src(conf.sourceBower());
    target
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe(gulp.dest('./' + conf.paths.src + '/fonts'));
});

gulp.task('inject', function () {
    var target = gulp.src(path.join(conf.paths.src,'/index.html'));
    target
        .pipe($.inject(gulp.src(conf.sourceBower()), {ignorePath: conf.paths.src, addRootSlash: false, name: 'bower'}))
        .pipe($.inject(gulp.src(conf.sourceStyles()), { ignorePath: conf.paths.src, addRootSlash: false }))
        .pipe($.inject(
                gulp.src(conf.sourceScripts())
                .pipe($.angularFilesort().on('error', conf.errorHandler('AngularFilesort'))), 
                {ignorePath: conf.paths.src, addRootSlash: false }))
        .pipe(gulp.dest('./' + conf.paths.src));
});

gulp.task('less', function () {
    gulp.src(['./' + conf.paths.src + '/~less/*.less', '!**/*.*.less'])
    .pipe($.less())
    .pipe($.rename({
        suffix: '.less'
    }))
    .pipe($.sourcemaps.init())
    .pipe($.postcss([autoprefixer({ browsers: ['last 2 versions'] })]))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./' + conf.paths.src + '/css'));
});

gulp.task('watch', function () {
    gulp.watch('./' + conf.paths.src + '/~less/*.less', ['less']);
});

gulp.task('watchfiles', function () {
    $.watch(path.join(conf.paths.src,'app/**/*.js'), function () {
		gulp.start('inject');
	});
});

gulp.task('host', function () {
    gulp.src(conf.paths.src)
		.pipe($.webserver({
			livereload: true,
			open: 'index.html'
		}));
});

gulp.task('dev-setup', function (callback) {
    return runSequence(
        'debug-clean',
        'less',
        ['copy-bower-fonts', 'inject'],
        'analyse',
        callback);
});
