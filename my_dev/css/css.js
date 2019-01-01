let isProduction;
const dir = "." + __dirname.replace(process.cwd(), "").replace(/\\/g, '/') + "/";

if (!process.env.css_dest)
    throw new Error("process.env.css_dest not defined");

let temp = process.env.css_dest.replace(/\\/g, '/') + "/";
if (!temp.endsWith('/'))
    temp = temp + "/";

const css_dest = temp;

const modeMap = {
    postcss: {
        css_src: dir+'pcss/*.pcss',
        css_dest,
        taskMaker: 'postcss-maker.js',
        watchDir() { return dir+'pcss/*.pcss'; }
    },
    bootstrap3: {
        scss: dir+'bootstrap3-compass/scss/',
        font: css_dest + 'fonts',
        scss_src: [dir+'bootstrap3-compass/scss/*.scss', `!${dir}bootstrap3-compass/scss/_*.scss`],
        css_dest,
        config_rb: dir+'bootstrap3-compass/config.rb',
        taskMaker: 'compass-maker.js',
        watchDir() { return this.scss_src; }
    },
    bootstrap4: {
        scss: dir+'bootstrap4-compass/',
        font: css_dest + 'fonts',
        scss_src: [dir+'bootstrap4-compass/*.scss', `!${dir}bootstrap4-compass/_*.scss`],
        css_dest,
        includePaths: ['node_modules'],

        taskMaker: 'libsass-maker.js',
        watchDir() { return this.scss_src; }
    },
    scss: {
        scss: dir+'scsss/',
        scss_src: dir+'scss/*.scss',
        css_dest,
        includePaths: ['node_modules'],

        taskMaker: 'libsass-maker.js',
        watchDir() { return this.scss_src; }
    },
    materialize: {
        scss: dir+'materialize-sass/',
        font: './dist/css/fonts',
        scss_src: [dir+'materialize-sass/*.scss'],
        css_dest,
        includePaths: ['node_modules/materialize-css/sass'],

        taskMaker: 'libsass-maker.js',
        watchDir() { return this.scss_src; }
    }
};

const fs = require('fs');

module.exports = function (data) {
    const config = modeMap[data.mode]
    data.config = config;
    
    return {
        watchDir: config.watchDir(),
        task: require(`./_configs/${config.taskMaker}`)(data),
        name: 'css'
    };
};
