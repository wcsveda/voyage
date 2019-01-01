/*
icon of postcss must be specified as @icon: md-home;
(space between : and icon-name is nessary)

*/

const { resolve } = require('path'),
	{ readFileSync } = require('fs');

function postcss_icon_material_design(data) {
    const output = {
        inline: ["woff2"],
        path: resolve(process.cwd(), data.config.css_dest, 'postcss-icons'),
        formats: ["woff2", "woff" /*, "ttf", "svg", "eot"*/ ],
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
	"autoprefixer": { browsers: ['last 1 versions'] },
	"postcss-utilities": {centerMethod:'flexbox'}
}

let loc, data;

function maker() {
        let ret = [];
        let strings = [];

		for(line of readFileSync(loc, 'utf-8').split(/\r?\n/)){
            line = line.trim();
            if (!line || line.startsWith("//"))
                continue;
            let n = line.indexOf(' ');
            let n2 = line.indexOf('//');
            let n3;

            if (n > 0 && n2 > 0)
                n3 = Math.min(n, n2);
            else if (n > 0)
                n3 = n;
            else
                n3 = n2;

            if (n3 > 0)
                line = line.substring(0, n3);

            
            const config = configs[line];
            strings.push(config ? `${line}(${JSON.stringify(config)}) ` : line);
            ret.push(config ? require(line)(config) : require(line));
        }
		console.log("postcss-requires: ", strings);
        return ret;
    }

module.exports = function (dt, loc2) {
    data = dt;
    loc = loc2;
    return maker;
};