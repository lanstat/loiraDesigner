test('Creacion de simbolos', function () {
    Loira.Config.assetsPath = '../../build/assets/';

    var _canvas = document.createElement('canvas');

    var canvas = new Loira.Canvas(_canvas);
    var actor = new Common.Actor({x:20, y:10, text:'Prueba'});

    canvas.add(actor);

    ok(actor._uid != '', 'No se creo el objeto');
    ok(canvas.items.length == 1, 'No se agrego el objeto');
});

test('Eliminacion de simbolos', function () {
    Loira.Config.assetsPath = '../../build/assets/';

    var _canvas = document.createElement('canvas');

    var canvas = new Loira.Canvas(_canvas);

    var actor = new Common.Actor({x:20, y:10, text:'Administrador'});
    var actor2 = new Common.Actor({x:200, y:100, text:'Administrador2'});
    var actor3 = new Common.Actor({x:200, y:100, text:'Administrador3'});

    var relation  = new Relation.Association({start:actor, end:actor2});
    var relation2  = new Relation.Association({start:actor, end:actor3});

    canvas.add(actor, actor2, actor3 , relation, relation2);

    canvas.remove(actor);

    ok(canvas.items.length == 2, 'No se elimino el objeto');
});