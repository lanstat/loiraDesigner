var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var paths = {
    js: ['./core/*.js', './plugins/*.js'],
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
gulp.task('js', function() {
    console.log('Empaquetando, minificando, y copiando los JS');

    return gulp
        .src(paths.js)
        .pipe(plug.concat('loira.min.js'))
        .pipe(plug.uglify({}))
        .pipe(gulp.dest(paths.build));
});

/**
 * Ejecuta las pruebas de la aplicacion
 *
 * @todo Agregar las pruebas respectivas con karma y qunit o jasmine
 * @return {Stream}
 */
gulp.task('test', function() {

    return gulp
        .src(paths.js)
        .pipe(plug.concat('loira.min.js'))
        .pipe(plug.uglify({}))
        .pipe(gulp.dest(paths.build));
});