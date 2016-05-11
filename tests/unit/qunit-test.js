test('Creacion de simbolos', function () {
    Loira.Config.assetsPath = '../../build/assets/';

    var _canvas = document.createElement('canvas');

    var canvas = new Loira.Canvas(_canvas);
    var actor = new Common.Actor({x:20, y:10, name:'Administrador'});

    canvas.add(actor);

    ok(actor._uid != '', 'No se creo el objeto');
    ok(canvas.items.length == 1, 'No se agrego el objeto');
});