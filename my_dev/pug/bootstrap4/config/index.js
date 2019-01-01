const im = require('./default.json');

im.title = 'materlize-gradients';

// stylesheets

[
    'css/styles.css'
].forEach(s => im.stylesheets.push(s));

[
    //   "vender/jquery.easypiechart.js",

    // "vender/highcharts/highcharts.js",
    // "vender/highcharts/highcharts-more.js",

    // "vender/Switchery/switchery.css",
    // "vender/Switchery/switchery.js",

     'js/index-browserify.js'
].forEach(s => im.scripts.push(s));

// im.nojs = true;
// im.offline = false;
module.exports = im;