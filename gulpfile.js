const chalk = require( 'chalk' );
const Paths = require( 'path' );

process.env.TASK_ROOT = './my_dev/';
const dist_dir = './dist/';
process.env.dist_dir = dist_dir;
process.env.css_dest = dist_dir+'css/';
process.env.img_dir = dist_dir+'imgs/';
process.env.html_dir = dist_dir;

const TASK_ROOT = process.env.TASK_ROOT;

const modes = {
    scss: 'scss',
    postcss: 'postcss',
    bootstrap3: 'bootstrap3',
    bootstrap4: 'bootstrap4',
    materialize: 'materialize'
};

const passValues = require( TASK_ROOT+'current_config.json' );
const mode = modes[passValues['mode']];

if ( !mode ) {
    console.error( chalk.red( 'unknown mode' ) );
    console.error( passValues );
    process.exit( 0 );
}

passValues['mode'] = mode;
const taskName = process.argv[2] || 'default';

if ( taskName === 'config' ) {
    console.info( passValues );
    process.exit( 0 );
}

console.info( chalk.cyan( 'mode: ' ), passValues.mode );

function addTasks( tasksNames, watchTasksNames, names ) {
    if ( !( watchTasksNames.includes( taskName ) || tasksNames.includes( taskName ) ) )
        return;

    const loader = name => require( Paths.resolve( TASK_ROOT, name, name.concat( '.js' ) ) )( passValues );
    let task;

    if ( watchTasksNames.includes( taskName ) ) {
        task = function() {
            const {watch} = require( 'gulp' );

            if ( !Array.isArray( names ) )
              names = [names];

            for ( const s of names ) {
                const t = loader( s );
                watch( t.watchDir, t.task );
            }
        };
    } else {
        if ( Array.isArray( names ) ) {
            const {series} = require( 'gulp' );
            task = series( ...( names.map( loader ).map( t => t.task ) ) );
        } else {
            const t = loader( names );
            task = t.task;
        }
    }

    exports[taskName] = task;
}
addTasks( ['default', 'a', 'all'], ['wa', 'watch-all'], ['css', 'pug'] );
addTasks( ['css', 'c'], ['watch-css', 'wc'], 'css' );
addTasks( ['pug', 'p'], ['watch-pug', 'wp'], 'pug' );

/**
 * gulp.task( 'setmode', function() {
    const obj = Object.assign( {}, gulp_util.env );
    delete obj['_'];
    console.log( require( './.vscode/settings.json' ) );
    require( TASK_ROOT+'change-mode.js' )( obj );
} );

 */

