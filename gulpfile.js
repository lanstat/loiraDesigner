var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var karmaServer = require('karma').Server;
var path = require('path');

var paths = {
    js: [
        './core/events.js',
        './core/drawable.js',
        './core/shape.js',
        './core/canvas.js',
        './core/animation.js',
        './core/controller.js',
        './core/utils.js',
        './core/element.js',
        './core/common.js',
        './core/config.js',
        './core/relations.js',
        './plugins/xmiparser.js',
        './plugins/usecase.js',
        './plugins/box.js',
        './plugins/workflow.js',
        './plugins/orgchart.js'

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
        .pipe(gulp.dest(paths.build+'/min'));
});

gulp.task('js', function() {
    console.log('Empaquetando, minificando, y copiando los JS');

    return gulp
        .src(paths.js)
        .pipe(plug.concat('loira.js'))
        .pipe(gulp.dest(paths.build+'/min'));
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

gulp.task('copyStyles', function(){
    console.log('Copiando estilos');
    return gulp
        .src('styles/**')
        .pipe(plug.concat('loira.min.css'))
        .pipe(gulp.dest(paths.build+'/styles'));
});

gulp.task('copyJs', function(){
    console.log('Copiando js');
    return gulp
        .src(['./core/*.js', './plugins/*.js'])
        .pipe(gulp.dest(paths.build+'/js'));
});

gulp.task('buildAll', ['jsmin', 'js', 'copyAssets', 'copyStyles']);

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
