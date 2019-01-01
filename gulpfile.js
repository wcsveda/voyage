const chalk = require('chalk');
const Paths = require('path');

process.env.TASK_ROOT = "./my_dev/";
const dist_dir = "./dist/";
process.env.dist_dir = dist_dir;
process.env.css_dest = dist_dir+"css/"
process.env.img_dir = dist_dir+"imgs/"
process.env.html_dir = dist_dir;

const TASK_ROOT = process.env.ROOT;

const modes = {
    scss: 'scss',
    postcss: 'postcss',
    bootstrap3: 'bootstrap3',
    bootstrap4: 'bootstrap4',
    materialize: 'materialize'
};

const passValues = require(TASK_ROOT+'current_config.json');
const mode =  modes[passValues['mode']];

if(!mode){
    console.error(chalk.red("unknown mode"));
    console.error(passValues);
    process.exit(0);
}

passValues['mode'] = mode;

if(process.argv[2] == 'config') {
    console.info(passValues);
    process.exit(0);
}

const gulp = require('gulp');
passValues["gulp"] = gulp;

const common =  name => require(Paths.resolve(TASK_ROOT, name, name.concat('.js')))(passValues); 
const css = () => common('css');
const pug = () => common('pug');

console.info(chalk.cyan('mode: '), passValues.mode);

const taskName = process.argv[2] || 'default';

function addTasks(tasksNames, watchTasksNames, tasksFuncs) {
    if (!tasksNames.concat(watchTasksNames).includes(taskName))
        return;

    tasksFuncs = tasksFuncs.map(f => f());
    const tasks = tasksFuncs.map(f => {
        gulp.task(f.name, f.task);
        return f.name;
    });

    if (watchTasksNames.includes(taskName)) {
        const watchDirs = require('array-flatten')(tasksFuncs.map(f => f.watchDir));
        console.info(chalk.cyan('watching-dirs:\n '), watchDirs.join('\n  '), '\n');

        gulp.task(taskName, function () {
            tasksFuncs.map(f => gulp.watch(f.watchDir, [f.name]));
        });
    } else if (!tasksFuncs.some(f => f.name === taskName)) {
        gulp.task(taskName, tasks);
    }
}
addTasks(['default', 'a', 'all'], ['wa', 'watch-all'], [css, pug]);
addTasks(['css', 'c'], ['watch-css', 'wc'], [css]);
addTasks(['pug', 'p'], ['watch-pug', 'wp'], [pug]);

gulp.task("toast", function() {
	console.log(pug());
})