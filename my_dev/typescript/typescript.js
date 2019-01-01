let tsc, is_production;
const configdir = './pug/general/config/',
    basedir = './pug/general/';

let gulp;

module.exports = function ( isProduction, _gulp ) {
    is_production = isProduction;
    gulp = _gulp;

    return {
        watchDir: [basedir + '**/*', basedir + '*'],
        task: task
    };
};

const gulp_util = require( 'gulp-util' );

function initTsc() {
    if ( tsc )
        return;
    console.log( gulp_util.colors.gray( 'init-tsc' ) );
    tsc = require( 'gulp-typescript' )
        .createProject( 'tsconfig.json' );
}

function task() {
    initTsc();

    return tsc.src()
        .pipe( print() )
        .pipe( tsc() )
        .pipe( gulp.dest( '.' ) )
        .pipe( print() );
}