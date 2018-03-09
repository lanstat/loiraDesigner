var createCanvas = function(){
    document.body.innerHTML = '';
    Loira.Config.assetsPath = '../../assets/glyphs.png';
    var _canvas = document.createElement('div');

    document.body.appendChild(_canvas);
    return new Loira.Canvas(_canvas, {width: 1800, height:1000, viewportWidth: 800, viewportHeight: 500});
};

var trigger = function(element, type, options){
    var e = jQuery.Event(type, options);
    element.trigger(e);
};

QUnit.test('Symbol\'s creation', function (assert) {
    var canvas = createCanvas();
    var actor = new Common.Actor({x:20, y:10, text:'Prueba'});

    canvas.add([actor]);

    assert.ok(actor._uid !== '', 'No se creo el objeto');
    assert.ok(canvas.items.length === 1, 'No se agrego el objeto');
});

QUnit.test('Eliminacion de simbolos', function (assert) {
    var canvas = createCanvas();

    var actor = new Common.Actor({x:20, y:10, text:'Administrador'});
    var actor2 = new Common.Actor({x:200, y:100, text:'Administrador2'});
    var actor3 = new Common.Actor({x:200, y:100, text:'Administrador3'});

    var relation  = new Relation.Association({start:actor, end:actor2});
    var relation2  = new Relation.Association({start:actor, end:actor3});

    canvas.add([actor, actor2, actor3 , relation, relation2]);

    canvas.remove([actor]);

    assert.ok(canvas.items.length === 2, 'No se elimino el objeto');
});

QUnit.test('Selected multiple symbols', function(assert){
    var done = assert.async(3);
    var canvas = createCanvas();
    var element = $('canvas');

    var actor = new Common.Actor({x:20, y:10, text:'Administrador'});
    var actor2 = new Common.Actor({x:200, y:100, text:'Administrador2'});

    canvas.add([actor, actor2]);

    var callback1 = function(item){
        if (actor2._uid === item.selected._uid){
            assert.ok(canvas.getSelected().length === 2, 'It doesn\'t select the object');
            done();
        }
    };

    var callback2 = function(){
        assert.ok(canvas.getSelected().length === 1, 'It doesn\'t release the object');
        done();
    };

    var callback3 = function(){
        assert.ok(canvas.getSelected().length === 0, 'It doesn\'t release all the objects');
        done();
    };

    trigger(element, 'mousedown', {pageX: 30, pageY:100});
    trigger(element, 'keydown', {keyCode: 16});

    canvas.on('object:selected', callback1);

    trigger(element, 'mousedown', {pageX: 230, pageY:130});

    canvas.fall('object:selected', callback1);
    canvas.on('object:unselected', callback2);

    trigger(element, 'mousedown', {pageX: 230, pageY:130});

    canvas.fall('object:unselected', callback2);
    canvas.on('object:unselected', callback3);

    trigger(element, 'mousedown', {pageX: 330, pageY:130});
});