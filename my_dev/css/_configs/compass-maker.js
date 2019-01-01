const rename = require('gulp-rename'),
    print = require('gulp-print')
    .default,
    sourcemaps = require('gulp-sourcemaps'),
    gulp_util = require('gulp-util'),
    filter = require('gulp-filter'),
    autoprefixer = require('gulp-autoprefixer'),
    compass = require('gulp-compass'),
    cache = require('gulp-cached'),
    plumber = require('gulp-plumber');

const img_dir = process.env.img_dir;

let isProduction, gulp, config;
module.exports = function (data) {
    ({ isProduction, gulp, config } = data);
    return maker;
};

function maker() {
        let stream = gulp.src(config.scss_src)
            .pipe(plumber({
                errorHandler(err) {
                    console.log(err + '');
                    this.emit('end');
                }
            }))
            .pipe(compass({
                config_file: config.config_rb,
                sass: config.scss,
                css: config.css_dest,
                font: config.font,
                generated_images_path: img_dir
            }))
            .pipe(plumber.stop())
            .pipe(filter('**/*.css'))
            .pipe(cache('compass'))
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