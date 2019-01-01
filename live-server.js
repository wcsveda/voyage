const liveServer = require( 'live-server' ),
    fs = require( 'fs' ),
    Path = require( 'path' ),
    module_exists = require( 'module-exists' ),
    chalk = require( 'chalk' ),
    stream = require( 'stream' ),
    execution_time = require( 'execution-time' )(),
    Optional = require( 'optional-js' ),
    browserify = require( 'browserify' );

const params = {
    port: 8181, // Set the server port. Defaults to 8080.
    host: 'localhost', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: './dist', // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    ignore: 'scss,pug,vendor', // comma-separated string for paths to ignore
    // file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    wait: 500, // Waits for all changes, before reloading. Defaults to 0 sec.
    // mount: [['/components', './node_modules']], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [handleLibraryRequests] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

const packageCache = {};

function loadScript( name ) {
    if ( packageCache[name] )
        return;

    let pathname = require.resolve( name ),
        base = Path.basename( pathname );

    function walk( root ) {
        let s = Path.normalize( root + '/' + name + '.js' );

        if ( fs.existsSync( s ) )
            return s;
        s = Path.normalize( root + '/' + name + '.min.js' );
        if ( fs.existsSync( s ) )
            return s;

        for ( let f of fs.readdirSync( root ) ) {
            let f2 = Path.normalize( root + '/' + f );
            if ( fs.statSync( f2 ).isDirectory() ) {
                let result = walk( f2 );
                if ( result )
                    return result;
            }
        }
    }
    if ( base === 'index.js' ) {
        pathname = walk( Path.dirname( pathname ) );
    }
    if ( !pathname ) {
        console.log( chalk.red( name ), '  ', require.resolve( name ), ' no path name' );
        return;
    }
    packageCache[name] = fs.readFileSync( pathname );
    return pathname.substring( pathname.indexOf( 'node_modules' ) );
}

function handleLibraryRequests( req, res, next ) {
    const URL = req.url;

    let name = Optional.of( URL )
        .filter( s => req.method === 'GET' )
        .filter( s => s.startsWith( '/node=' ) || s.startsWith( 'node=' ) )
        .map( s => s.substring( s.indexOf( '=' ) + 1 ) )
        .filter( s => packageCache[s] || module_exists( s ) );

    if ( name.isPresent() ) {
        name = name.get();
        execution_time.start();
        let ppp = loadScript( name );

        let strm = new stream.PassThrough();
        strm.end( packageCache[name] );
        strm.pipe( res );
        console.log( chalk.yellow( 'GET ' ), URL, ' ', execution_time.stop().time.toFixed( 3 ), 'ms ', chalk.yellow( ppp ) );
        return;
    }

    if ( URL.endsWith( '-browserify.js' ) ) {
        execution_time.start();
        const b = browserify();
        console.log( params.root + URL );
        b.add( params.root + URL );
        b.bundle().pipe( res );
        console.log( chalk.cyan( 'GET ' ), URL, ' -> ', chalk.yellow( 'browserified' ), '   ', execution_time.stop().time.toFixed( 3 ), 'ms  ' );
        return;
    }
    console.log( chalk.gray( URL ) );
    next();
}

liveServer.start( params );