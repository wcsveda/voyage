const im = require( './default.json' );

im.stylesheets.push( 'css/vendor/normalize.css' );
im.stylesheets.push( 'css/styles.css' );


const fromNode = [
	//    "dat.gui",
    //    "stats.js",
    //    "seedrandom",
    // "holderjs",
    // "three"
].map( name => 'node=' + name );

const fromDist = [
	// "js/vendor/redom.min.js",
    // "js/index-browserify.js"
    'https://redom.js.org/redom.min.js',
    'js/index.js'
	];

im.scripts = [...im.scripts, ...fromNode, ...fromDist];
module.exports = im;