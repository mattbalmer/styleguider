var gulp = require('gulp'),
    config = require('./config'),
    path = require('path'),
    stylus = require('gulp-stylus'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    stream = require('event-stream');

gulp.task('stylus-all', function() {
    var stylusStream = gulp.src(path.join(config('cwd'), config('styleDir'), '**', '*.styl'))
        .pipe(stylus());

    return stream.merge(stylusStream, gulp.src(path.join(config('cwd'), config('styleDir'), '**', '*.css')))
        .pipe(concat('styleguide.css'))
        .pipe(gulp.dest(config('cwd')));
});

gulp.task('stylus', function() {
    config('cwd', './../../example');
    return gulp.src(path.join(config('cwd'), config('styleDir'), 'index.styl'))
        .pipe(stylus())
        .pipe(gulp.dest(config('cwd')));
});

gulp.task('sass', function() {
    config('cwd', './../../sass-example');
    return gulp.src(path.join(config('cwd'), 'styleguide.sass'))
        .pipe(sass())
        .pipe(gulp.dest(config('cwd')));
});