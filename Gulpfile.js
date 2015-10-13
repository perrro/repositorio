var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var minifyCSS   = require('gulp-minify-css');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var minifyHTML = require('gulp-minify-html');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var paths = {
  scripts: ['src/vendor/j*.js', 'src/vendor/*.js', 'src/js/*.js'],
  scss:    ['src/scss/*.scss', 'src/css/*.css']
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
      .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});


gulp.task('html', function() {
    // Minify and copy the html
    return gulp.src('_site/**/*.html')
        .pipe(minifyHTML({
            quotes: true
        }))
        .pipe(gulp.dest('_site/'));
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulp.dest('_site/dist/js'))
    .pipe(browserSync.reload({stream:true}));
});
/**
 * Compile files from _scss
 */

gulp.task('sass', function () {
    gulp.src('src/scss/*.scss')
        .pipe(sass({
          includePaths: ['scss', 'src/_sass'],
          onError: browserSync.notify
        }))
        .pipe(concat('main.min.css'))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('_site/dist/css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch('src/scss/*.scss', ['sass'], ['src/_sass/*']);
  gulp.watch(['src/js/*.js', 'src/vendor/*.js'], ['scripts']);
  gulp.watch(['index.html', '_layouts/*.html', '_includes/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['scripts', 'sass', 'html', 'browser-sync', 'watch']);
