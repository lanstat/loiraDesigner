var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var karmaServer = require('karma').Server;
var path = require('path');

var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    build: './build'
};

/**
 * Lista las tareas gulp habilitadas
 */
gulp.task('help', plug.taskListing);

/**
 * Minifica y empaqueta la aplicacion JavaScript
 * @return {Stream}
 */
gulp.task('jsmin', function() {
    console.log('Packing, minifying, and copying the scripts');

    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(plug.concat('loira.min.js'))
        .pipe(plug.uglify({}))
        .pipe(gulp.dest(paths.build+'/scripts'));
});

gulp.task('js', function() {
    console.log('Packing the scripts');

    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(plug.concat('loira.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build+'/scripts'));
});

gulp.task('copyAssets', function(){
    console.log('Copying assets');
    return gulp
        .src('assets/**')
        .pipe(gulp.dest(paths.build+'/assets'));
});

gulp.task('copyStyles', function(){
    console.log('Copying styles');
    return gulp
        .src('styles/**')
        .pipe(plug.concat('loira.min.css'))
        .pipe(gulp.dest(paths.build+'/styles'));
});

gulp.task('default', ['js', 'copyAssets', 'copyStyles']);

gulp.task('dist', ['jsmin', 'copyAssets', 'copyStyles']);

/**
 * Ejecuta las pruebas de la aplicacion
 *
 * @return {Stream}
 */
gulp.task('testBuild', ['build'], function(done) {
    startTests(true, done);
});

/**
 * Ejecuta las pruebas de la aplicacion
 *
 * @return {Stream}
 */
gulp.task('test', function(done) {
    startTests(true, done);
});


/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    new karmaServer({
        configFile: path.join(__dirname, '/karma.conf.js'),
        singleRun: singleRun
    }, done).start();
}
