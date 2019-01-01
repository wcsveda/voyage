let isProduction;
const dir = "." + __dirname.replace(process.cwd(), "").replace(/\\/g, '/') + "/";

const baseDirs = {
    postcss: dir+'general/',
    scss: dir+'general/',
    bootstrap3: dir+'bootstrap3/',
    bootstrap4: dir+'bootstrap4/',
    materialize: dir+'materialize/'
};

let gulp, basedir;

module.exports = function ( data ) {
    ( { isProduction, gulp } = data );
    basedir = baseDirs[data.mode];

    console.log( 'pug baseDir: ', basedir );
    
    return {
        watchDir: [basedir + '**/*', basedir + '*'],
        task: task,
        name: 'pug'
    };
};

const gulp_util = require( 'gulp-util' ),
    PATH = require( 'path' ),
    fs = require( 'fs' ),
    pug = require( 'gulp-pug' ),
    plumber = require( 'gulp-plumber' ),
    open = require( 'gulp-open' ),
    gulpif = require( 'gulp-if' ),
    html_prettify = require( 'gulp-html-prettify' ),
    print = require( 'gulp-print' ).default;

function join_normalize( ...paths ) {
    const c = './' + PATH.win32.normalize( paths.join( '/' ) );
    return c;
}

function getPugConfigPath() {
    const configdir = basedir + 'config/';

    if ( gulp_util.env.config )
        return join_normalize( configdir, gulp_util.env.config );

    let temp = join_normalize( configdir, filename );

    if ( fs.existsSync( temp + '.json' ) ) return temp + '.json';
    if ( fs.existsSync( temp + '.js' ) ) return temp + '.js';

    return join_normalize( configdir, 'default.json' );
}

let filename, file, pugConfig;

function initPug() {
    if ( filename )
        return;

    console.log( gulp_util.colors.gray( 'init-pug' ) );
    filename = gulp_util.env.file || 'index';
    file = join_normalize( basedir, filename + '.pug' );
    pugConfig = require( PATH.resolve( getPugConfigPath() ) );
    if ( !pugConfig.loremIpsum )
        pugConfig.lorem = require( 'lorem-ipsum' );
}

function task() {
    // --file [common file name of .pug and .json/js file (without extension)]
    // if --file is specified 'index is is used by default'
    // --config [full name of the config file] 

    initPug();

    return gulp.src( file )
        .pipe( plumber( {
            errorHandler( err ) {
                console.log( err + '' );
                this.emit( 'end' );
            }
        } ) )
        .pipe( pug( {
            basedir: basedir,
            data: pugConfig,
            doctype: 'html'
        } ) )
        .pipe( plumber.stop() )
        .pipe( gulpif( isProduction, html_prettify( {
            indent_char: ' ',
            indent_size: 4
        } ) ) )
        .pipe( gulp.dest( process.env.html_dir ) )
        .pipe( print() )
        .pipe( gulpif( gulp_util.env.hasOwnProperty( 'open' ), open() ) );
}