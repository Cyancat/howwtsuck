'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    cleanCSS = require('gulp-clean-css');

gulp.task('inject', function(){
  return gulp.src('./src/base.js')
          .pipe(
            inject(gulp.src('./src/inc/**/*.js'), {
              starttag: '/* include:{{path}} */',
              endtag: '/* endinject */',
              relative: true,
              transform: function (filepath, file) {
                return file.contents.toString('utf8');
              }
            })
          )
          .pipe(
            inject(
              gulp.src('./src/style.styl')
                .pipe(stylus())
                .pipe(cleanCSS()),
              {
                starttag: '/* include:css */',
                endtag: '/* endinject */',
                relative: true,
                removeTags: true,
                transform: function(filepath, file) {
                  return file.contents.toString('utf8') + ' \\';
                }
              }
            )
          )
          .pipe(
            inject(gulp.src('./src/inc/**/*.html'),
              {
                starttag: '/* include:{{path}} */',
                endtag: '/* endinject */',
                relative: true,
                removeTags: true,
                transform: function(filepath, file) {
                  // If for windows, the split mark should be '\r\n'
                  var fileline = file.contents.toString('utf8').split('\n');
                  fileline.forEach(function(c, i){
                    fileline[i] = c + ' \\';
                  });
                  return fileline.join('\n');
                }
              }
            )
          )
          .pipe(rename("script.js"))
          .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch(
    ['./src/**/*.js', './src/**/*.styl', './src/**/*.html'],
    ['inject']
  );
});

gulp.task('default', ['inject', 'watch']);
