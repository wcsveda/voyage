let isProduction, gulp, config,
    postcss, pcssFunction, cssnano;

const loc = require('path').resolve(__dirname, "postcss-requires-list.js");

module.exports = function (data) {
    ({ isProduction, gulp, config } = data);

    console.log(chalk.gray('init-postcss'));
    postcss = require('gulp-postcss');
    cssnano = isProduction ? undefined : require('cssnano');
    pcssFunction = require('./postcss-requires-configs.js')(data, loc);

    return maker;
};

let time = null,
    pcssRequires;
const fs = require('fs');

function pcss() {
    const s = fs.statSync(loc);
    if (time !== s.mtimeMs){
        pcssRequires = pcssFunction();
        time = s.mtimeMs;
    }
    return pcssRequires;
}

const rename = require('gulp-rename'),
    print = require('gulp-print').default,
    sourcemaps = require('gulp-sourcemaps'),
    chalk = require('chalk');

function maker() {
    const plumber = require('gulp-plumber');

    let stream = gulp.src(config.css_src)
        .pipe(plumber({
            errorHandler(err) {
                console.log(err + '');
                this.emit('end');
            }
        }))
        .pipe(print())
        .pipe(rename(path => path.extname = '.css'));

    if (isProduction) {
        stream = stream
            .pipe(postcss(pcss()))
            .pipe(gulp.dest(config.css_dest));
    } else {
        stream = stream
            .pipe(sourcemaps.init())
            .pipe(postcss(pcss()))
            .pipe(gulp.dest(config.css_dest))
            .pipe(print())
            .pipe(postcss([cssnano]))
            .pipe(rename(path => path.basename += '.min'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.css_dest));
    }
    return stream
        .pipe(print())
        .pipe(plumber.stop());
}