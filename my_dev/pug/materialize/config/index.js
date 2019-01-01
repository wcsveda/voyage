const im = require( './default.json' );

im.title = 'services-grid';

// stylesheets

[
    'css/styles.css'
].forEach( s => im.stylesheets.push( s ) );

[
    // 'js/index-browserify.js'
].forEach( s => im.scripts.push( s ) );

// im.nojs = true;
// im.offline = false;

module.exports = im;