'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename');

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
          .pipe(rename("howwtsucks.js"))
          .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch('./src/**/*.js', ['inject']);
});

gulp.task('default', ['inject', 'watch']);
