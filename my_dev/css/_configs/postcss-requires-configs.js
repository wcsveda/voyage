'use strict';

/*
icon of postcss must be specified as @icon: md-home;
(space between : and icon-name is nessary)

*/

const { resolve } = require( 'path' );

function postcss_icon( data ) {
    /**
     * const output = {
        path: resolve( process.cwd(), data.config.css_dest, 'postcss-icons' ),
        formats: ['woff2', 'woff'],
        url( { cssFile, fontName, hash } ) {return `postcss-icons/${fontName}`;}
    };
     */
    return {
        'postcss-icon.font-awesome-v4': {
            prefix: 'fa-', /* required when using multiple Icon data sets */
            output: {
                inline: ['woff2'],
                path: resolve( process.cwd(), data.config.css_dest, 'postcss-icons' ),
                formats: ['woff2', 'woff'],
                url( { cssFile, fontName, hash } ) {return `postcss-icons/${fontName}`;}
            }

        }
    };
}

const configs = {
    // "autoprefixer": { browserslist: ['last 1 versions'] },
    //  "postcss-utilities": { centerMethod: 'flexbox' },
    'postcss-icon': postcss_icon

};

let data;
const path = './postcss-requires-list.js';
const chalk = require( 'chalk' );

function maker() {
    delete require.cache[require.resolve( path )];
    const list = require( path );

    const ret = [];
    const strings = [];

    for ( const line of list ) {
        let config = configs[line];

        if ( typeof config === 'function' )
            config = config( data );

        strings.push( config ? `${line}(${JSON.stringify( config, null, '  ' )}) ` : line );
        ret.push( config ? require( line )( config ) : require( line ) );
    }
    console.log( chalk.yellow( '-----------------------------------' ) );
    console.log( chalk.cyan( 'postcss-requires: ' ), '\n  ' + strings.join( '\n  ' ) );
    console.log( chalk.yellow( '-----------------------------------' ) );
    return ret;
}

module.exports = function ( dt, loc2 ) {
    data = dt;
    return maker;
};