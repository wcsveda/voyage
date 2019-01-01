const paths = require('path');
const loc = paths.resolve(__dirname, "postcss-requires.txt");

 const pcssFunction = require('./postcss-requires.js')(null, loc);
 pcssFunction();


