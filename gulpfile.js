var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var karmaServer = require('karma').Server;
var path = require('path');

var paths = {
    js: [
        './core/events.js',
        './core/canvas.js',
        './core/utils.js',
        './core/element.js',
        './core/common.js',
        './core/relations.js',
        './plugins/xmiparser.js',
        './plugins/usecase.js',
        './plugins/box.js',
        './plugins/workflow.js',
        './core/config.js'
    ],
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
    console.log('Empaquetando, minificando, y copiando los JS');

    return gulp
        .src(paths.js)
        .pipe(plug.concat('loira.min.js'))
        .pipe(plug.uglify({}))
        .pipe(gulp.dest(paths.build+'/js'));
});

gulp.task('js', function() {
    console.log('Empaquetando, minificando, y copiando los JS');

    return gulp
        .src(paths.js)
        .pipe(plug.concat('loira.js'))
        .pipe(gulp.dest(paths.build+'/js'));
});

gulp.task('eslint', function() {
    console.log('Realizando verificaciones de calidad de codigo');

    return gulp
        .src(paths.js)
        .pipe(plug.eslint())
        .pipe(plug.eslint.format())
        .pipe(plug.eslint.failAfterError());
});

gulp.task('copyAssets', function(){
    console.log('Copiando assets');
    return gulp
        .src('assets/**')
        .pipe(gulp.dest(paths.build+'/assets'));
});

gulp.task('build', ['jsmin', 'js', 'copyAssets']);

/**
 * Ejecuta las pruebas de la aplicacion
 *
 * @todo Agregar las pruebas respectivas con karma y qunit o jasmine
 * @return {Stream}
 */
gulp.task('test', ['build'], function(done) {
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
        singleRun: !!singleRun
    }, done).start();
}
