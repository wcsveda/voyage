const rename = require('gulp-rename'),
    print = require('gulp-print').default,
    sourcemaps = require('gulp-sourcemaps'),
    gulp_util = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass');
// cache = require('gulp-cached');

let isProduction, gulp, config;
module.exports = function (data) {
    ({ isProduction, gulp, config } = data);
    return maker;
};
function maker() {
    let stream = gulp.src(config.scss_src)
        // .pipe(cache())
        .pipe(sass({
                includePaths: config.includePaths
            })
            .on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.css_dest));

    if (isProduction) {
        return stream.pipe(print());
    } else {
        const cssnano = require('gulp-cssnano');

        return stream.pipe(sourcemaps.init())
            .pipe(cssnano())
            .pipe(rename(path => path.basename += '.min'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.css_dest))
            .pipe(print());
    }
};