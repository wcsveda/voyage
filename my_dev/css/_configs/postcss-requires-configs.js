'use strict'

/*
icon of postcss must be specified as @icon: md-home;
(space between : and icon-name is nessary)

*/

function postcss_icon_material_design(data) {
    const output = {
        inline: ["woff2"],
        path: resolve(process.cwd(), data.config.css_dest, 'postcss-icons'),
        formats: ["woff2", "woff" /*, "ttf", "svg", "eot"*/],
        url({ cssFile, fontName, hash }) { return `postcss-icons/${fontName}`; }
    }
    return require('postcss-icon')({
        "postcss-icon.material-design": {
            /* required when using multiple Icon data sets */
            prefix: 'md-',
            output
        },
        "postcss-icon.OtherSetName": { /* Options */ }
    });
}

const configs = {
    // "autoprefixer": { browserslist: ['last 1 versions'] },
  //  "postcss-utilities": { centerMethod: 'flexbox' }
}

let loc, data;
const path = './postcss-requires-list.js';
const chalk = require('chalk');

function maker() {
    delete require.cache[require.resolve(path)];
    const list = require(path);

    let ret = [];
    let strings = [];

    for (const line of list) {
        const config = configs[line];
        strings.push(config ? `${line}(${JSON.stringify(config)}) ` : line);
        ret.push(config ? require(line)(config) : require(line));
    }
    console.log(chalk.yellow('-----------------------------------'));
    console.log(chalk.cyan("postcss-requires: "), "\n  "+strings.join("\n  "));
    console.log(chalk.yellow('-----------------------------------'));
    return ret;
}

module.exports = function (dt, loc2) {
    data = dt;
    loc = loc2;
    return maker;
};