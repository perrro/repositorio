var gulp = require('gulp'),
shell = require('gulp-shell'),
minifyHTML = require('gulp-minify-html'),
nodeSass = require('node-sass')
sass = require('gulp-sass'),
importCss = require('gulp-import-css'),
autoprefixer = require('gulp-autoprefixer'),
uncss = require('gulp-uncss'),
minifyCss = require('gulp-minify-css'),
rename = require('gulp-rename'),
glob = require('glob'),
uglify = require('gulp-uglify');

gulp.task('jekyll', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      'jekyll build'
  ]));
});

gulp.task('html', ['jekyll'], function() {
    return gulp.src('_site/**/*.html')
        .pipe(minifyHTML({
            quotes: true
        }))
        .pipe(gulp.dest('_site/'));
});

gulp.task('css', ['jekyll'], function() {
   return gulp.src('css/**/*.scss')
   		.pipe(sass({ includePaths: ['./_sass'], errLogToConsole: true }))
       .pipe(sass())
       .pipe(importCss())
       .pipe(autoprefixer())
       .pipe(minifyCss({keepBreaks:false}))
       .pipe(rename('style.min.css'))
       .pipe(gulp.dest('_site/style/'));
});

gulp.task('javascript', ['jekyll'], function() {
  return gulp.src('scripts/**/*.js')
    .pipe(rename('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/javascripts'));
});

gulp.task('build', ['javascript', 'css', 'html']);