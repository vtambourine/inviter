var gulp = require('gulp');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var prettify = require('gulp-prettify');
var del = require('del');

var browserSync = require('browser-sync').create();

gulp.task('templates', function () {
    gulp.src('./index.html')
        .pipe(gulp.dest('./build'))
});

gulp.task('styles', function () {
    gulp.src([
        'styles/index.scss',
        'node_modules/normalize.css/normalize.css'
    ])
        .pipe(sass())
        .pipe(gulp.dest('./build'));
});

gulp.task('scripts', function () {
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery/dist/jquery.min.map',
        'scripts/index.js'
    ]).pipe(gulp.dest('build'));
});

gulp.task('build', ['styles', 'scripts', 'templates']);

gulp.task('sync', ['build'], function () {
    browserSync.init({
        files: ['./build/*.*'],
        server: {
            baseDir: ['build', './']
        },
        open: false,
        notify: false
    });

    gulp.watch('index.html', ['templates']);
    gulp.watch('styles/**/*.scss', ['styles']);
    gulp.watch('scripts/**/*.js', ['scripts']);
    gulp.watch('build/index.html').on('change', browserSync.reload);
});

gulp.task('clean', function () {
    del('build');
});

gulp.task('default', ['build']);
