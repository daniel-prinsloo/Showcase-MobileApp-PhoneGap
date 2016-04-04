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

gulp.task('list-dir', function () {
    gulp.src(path.join(conf.paths.src,'app/views/*.html'))
        .pipe($.directoryMap({
            filename: 'urls.json'
        })).pipe(gulp.dest(path.join(conf.paths.src,'app/constants'))).on('finish', function () {
            gulp.start('url');
        });
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

gulp.task('url', function () {
    fs.readFile(path.join(conf.paths.src,'app/constants/urls.json'), 'utf-8', function (err, data) {
        if (err)
            throw err;
        if (data.indexOf("var urls = ") < 0) {
            var output = [data.slice(0, 0), "var urls = ", data.slice(0)].join('');
            output += '; //eslint-disable-line no-unused-vars';
            fs.writeFile(path.join(conf.paths.src,'app/constants/urls.js'), output, 'utf-8', function (err) {
                if (err)
                    throw err;
                console.log('File updated');
            });
        }
    });
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
    if (argv.addplugins === undefined) {
        gulp.watch('./' + conf.paths.src + '/~less/*.less', ['less']);
    }
});

gulp.task('watchfiles', function () {
    if (argv.addplugins === undefined) {
        $.watch(path.join(conf.paths.src,'app/**/*.js'), function () {
            gulp.start('inject');
        });
        $.watch(path.join(conf.paths.src,'app/views/*.html'), function () {
            gulp.start('list-dir');
        });
    }
});

gulp.task('host', function () {
    if (argv.addplugins === undefined) {
        gulp.src(conf.paths.src)
            .pipe($.webserver({
                livereload: true,
                open: 'index.html'
            }));
    }
});

gulp.task('dev-setup', function (callback) {
    return runSequence(
        'less',
        ['copy-bower-fonts', 'inject', 'list-dir'],
        'analyse',
        callback);
});
