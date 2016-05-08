/**
 * Plugin para diseño de diagramas UML
 * @module Loira
 * @license Apache-2.0
 */
var Loira = {};

 /**
  * Crea una nueva instancia de canvas
  * 
  * @constructs Canvas
  * @param {string} canvasId Identificador del elemento canvas
  */
Loira.Canvas = function(canvasId){
    this.initialize(canvasId);
}

Loira.Canvas.prototype = 
/** @lends Canvas.prototype */
{
    /**
     * @memberof Canvas#
     * @property {Object}  _selected - Objeto que se encuentra seleccionado
     */
    _selected: null,
    /**
     * @memberof Canvas#
     * @property {Boolean}  _isDragged - Determina si el usuario esta arrastrando un objeto
     */
    _isDragged: false,
    /**
     * @memberof Canvas#
     * @property {Object}  _tmp - Almacena datos temporales
     */
    _tmp: {},
    /**
     * Inicializa las variables y calcula los bordes del canvas
     * @memberof Canvas#
     * @param {string} canvasId Identificador del elemento canvas
     * @private
     */
    initialize: function(canvasId){
        this.relations = [];
        this.items = [];
        this._canvas = document.getElementById(canvasId);
        this._callbacks = {};

        /**
         * @property {Relation}  nextRelation - Relacion que se usara cuando se agregue una nueva union
         */
        this.nextRelation = new Relation.Association();
        if (document.defaultView && document.defaultView.getComputedStyle) {
            this._border = {
                paddingLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingLeft'], 10)      || 0,
                paddingTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingTop'], 10)       || 0,
                borderLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderLeftWidth'], 10)  || 0,
                borderTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderTopWidth'], 10)   || 0
            }
        }
        this._bind();
    },
    /**
     * Dibuja las relaciones y simbolos dentro del canvas
     * @memberof Canvas#
     */
    renderAll: function(){
        var ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        for (var i = 0; i < this.relations.length; i++) {
            this.relations[i]._render(ctx);
        }
        for (var i = 0; i < this.items.length; i++) {
            this.items[i]._render(ctx);
        }

        if(this._selected){
            this._selected.drawSelected(ctx);   
            this._selected._renderButtons(ctx);
        }
    },
    /**
     * Agrega uno o varios elementos al listado de simbolos
     * @memberof Canvas#
     * @param {Array.<Object>} args Elementos a agregar
     * @fires object:added
     */
    add: function(){
        var args = [].splice.call(arguments, 0);
        var _items = this.items;
        var _this = this;
        args.forEach(function(item){
            item._canvas = _this;
            _items.push(item);
            /**
             * Evento que encapsula la agregacion de un objeto del canvas
             * 
             * @event object:added
             * @type { object }
             * @property {object} selected - Objeto seleccionado
             * @property {string} type - Tipo de evento
             */
            _this._emit('object:added', new objectEvent({selected:item, type: 'objectadded'}));
        });
    },
    /**
     * Agrega una o varias relaciones al listado de relaciones
     * @memberof Canvas#
     * @param {Array.<Object>} args Elementos a agregar
     * @fires relation:added
     */
    addRelation: function(){
        var args = [].splice.call(arguments, 0);
        var _relations = this.relations;
        var _this = this;
        args.forEach(function(item){
            item._canvas = _this;
            _relations.push(item);
            /**
             * Evento que encapsula la agregacion de una relacion del canvas
             * 
             * @event object:added
             * @type { object }
             * @property {object} selected - Objeto seleccionado
             * @property {string} type - Tipo de evento
             */
            _this._emit('relation:added', new relationEvent({selected:item, type: 'relationadded'}));
        }); 
    },
    /**
     * Elimina los objetos enviados como argumentos
     * @memberof Canvas#
     * @fires object:removed
     */
    remove: function(){
        var args = [].splice.call(arguments, 0);
        var _items = this.items;
        var _this = this;
        args.forEach(function(item){
            var index = _items.indexOf(item);

            var rels = [];

            for (var i = 0; i < _this.relations.length; i++){
                if (_this.relations[i].start._uid != item._uid &&
                    _this.relations[i].end._uid != item._uid){
                    rels.push(_this.relations[i]);
                }
            }

            _this.relations = rels;

            _items = _items.splice(index, 1);
            /**
             * Evento que encapsula la eliminacion de un objeto del canvas
             * 
             * @event object:removed
             * @type { object }
             * @property {object} selected - Objeto seleccionado
             * @property {string} type - Tipo de evento
             */
            _this._emit('object:removed', new objectEvent({selected:item, type: 'objectremoved'}));
        });

        this._selected = null;
        this.renderAll();
    },
	/**
	 * Agrega un nuevo escuchador al evento especifico
	 *
	 * @memberof Canvas#
	 * @param { string } evt Nombre del evento que se desea capturar
	 * @param { function } callback Funcion que escucha el evento
	 * @returns { function } Funcion que escucha el evento
     */
    on: function(evt, callback){
        if(typeof evt === 'string'){
            if (typeof this._callbacks[evt] === 'undefined'){
                this._callbacks[evt] = [];
            }
            this._callbacks[evt].push(callback);
            return callback;
        }else if(typeof evt === 'object'){
            for (var name in evt){
                if (typeof this._callbacks[name] === 'undefined'){
                    this._callbacks[name] = [];
                }
                this._callbacks[name].push(evt[name]);
            }
        }
    },
    /**
     * Desregistra un evento
     *
     * @memberof Canvas#
     * @param {string} evt - Nombre del evento
     * @param {function} callback - Funcion a desregistrar
     */
    fall: function(evt, callback){
        var index  = this._callbacks[evt].indexOf(callback);
        if (index > -1){
            this._callbacks[evt].splice(index, 1);
        }
    },
    /**
     * Enlaza los eventos del canvas al canvas propio del diseñador
     *
     * @memberof Canvas#
     * @private
     */
    _bind: function(){
        var _this = this;
        this._canvas.onkeydown = function(evt){
            var code = evt.keyCode;
            if (code == 46){
                if (_this._selected){
                    _this.remove(_this._selected);
                }
            }
        };
        this._canvas.onmousedown = function(evt){
            var real = _this._getMouse(evt);
            _this._tmp.pointer =  real;
            /**
             * Evento que encapsula un click sobre el canvas
             * 
             * @event mouse:down
             * @type { object }
             * @property {integer} x - Posicion x del puntero
             * @property {integer} y - Posicion y del puntero
             * @property {string} type - Tipo de evento
             */
            _this.emit('mouse:down', new mouseEvent({x:real.x, y:real.y, type: 'mousedown'}));

            if (_this._selected){
                _this._tmp.transform = _this._selected.getSelectedCorner(real.x, real.y)
                if(_this._tmp.transform){
                    return;
                }else if(_this._selected.callCustomButton(real.x, real.y)){
                    return;
                }else{
                    _this._selected = null;
                }
            }
            for (var i = _this.items.length - 1; i >= 0; i--) {
                var item = _this.items[i];
                if(item.checkCollision(real.x, real.y)){
                    /**
                     * Evento que encapsula un click sobre un objeto
                     * 
                     * @event object:select
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('object:selected', new objectEvent({selected:item, type: 'objectselected'}));
                    _this._selected = item;
                    _this._isDragged = true;
                    break;
                }
            }
            if (!_this._selected){
                for (var i = _this.relations.length - 1; i >= 0; i--) {
                    var item = _this.relations[i];
                    if(item.checkCollision(real.x, real.y)){
                        /**
                         * Evento que encapsula un click sobre una relacion
                         *
                         * @event relation:select
                         * @type { object }
                         * @property {object} selected - Objeto seleccionado
                         * @property {string} type - Tipo de evento
                         */
                        _this._emit('relation:selected', new objectEvent({selected:item, type: 'relationselected'}));
                        _this._selected = item;
                        _this._isDragged = true;
                        break;
                    }
                }
            }

            _this.renderAll();
        };
        this._canvas.onmousemove = function(evt){
            var real = _this._getMouse(evt);
            /**
             * Evento que encapsula el movimiento del mouse sobre el canvas
             * 
             * @event mouse:move
             * @type { object }
             * @property {integer} x - Posicion x del puntero
             * @property {integer} y - Posicion y del puntero
             * @property {string} type - Tipo de evento
             */
            _this._emit('mouse:move', new mouseEvent({x:real.x, y:real.y, type: 'mousemove'}));
            
            if(_this._selected){
                if(_this._tmp.transform){
                    switch(_this._tmp.transform){
                        case 'tc':
                            _this._selected.y += real.y - _this._tmp.pointer.y;     
                            _this._selected.height -= real.y - _this._tmp.pointer.y;
                            break;
                        case 'bc':
                            _this._selected.height += real.y - _this._tmp.pointer.y;
                            break;
                        case 'ml':
                            _this._selected.x += real.x - _this._tmp.pointer.x;
                            _this._selected.width -= real.x - _this._tmp.pointer.x;
                            break;
                        case 'mr':
                            _this._selected.width += real.x - _this._tmp.pointer.x;
                            break;
                    }
                    _this.renderAll();
                }else if(_this._isDragged){
                    _this._selected.x += real.x - _this._tmp.pointer.x;
                    _this._selected.y += real.y - _this._tmp.pointer.y;
                    /**
                     * Evento que encapsula el arrastre de un objeto
                     * 
                     * @event object:dragging
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('object:dragging', new objectEvent({selected:_this._selected, type: 'objectdragging'}));
                    _this.renderAll();
                }
                _this._tmp.pointer = real;
            }
        };
        this._canvas.onmouseup = function(evt){
            var real = _this._getMouse(evt);

            /**
             * Evento que encapsula la liberacion del mouse sobre el canvas
             * 
             * @event mouse:up
             * @type { object }
             * @property {integer} x - Posicion x del puntero
             * @property {integer} y - Posicion y del puntero
             * @property {string} type - Tipo de evento
             */
            _this._emit('mouse:up', new mouseEvent({x:real.x, y:real.y, type: 'mouseup'}));
            if (_this._selected){
                /**
                 * Evento que encapsula la liberacion de un objeto
                 * 
                 * @event object:released
                 * @type { object }
                 * @property {object} selected - Objeto seleccionado
                 * @property {string} type - Tipo de evento
                 */
                _this._emit('object:released', new mouseEvent({selected:_this.selected, type: 'objectreleased'}));
                _this._isDragged = false;
                _this._tmp.transform = false;
            }
        }
    },
    /**
     * Emite un evento generado
     *
     * @memberof Canvas#
     * @param evt Nombre del evento a emitir
     * @param options Valores enviados junto al evento
     * @private
     */
    _emit: function(evt, options){
        if(typeof this._callbacks[evt] !== 'undefined'){
            for (var i = 0; i < this._callbacks[evt].length; i++) {
                var item = this._callbacks[evt][i];
                item.call(this, options);
            }
        }
    },
    /**
     * Obtiene la posicion del mouse relativa al canvas
     *
     * @memberof Canvas#
     * @param evt Evento de mouse
     * @returns {{x: number, y: number}} Posicion del mouse relativa
     * @private
     */
    _getMouse: function(evt){
        var element = this._canvas, offsetX = 0, offsetY = 0;
        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }
        var border = this._border;
        offsetX += border.paddingLeft;
        offsetY += border.paddingTop;

        offsetX += border.borderLeft;
        offsetY += border.borderTop;

        return {x: (evt.pageX - offsetX), y: (evt.pageY - offsetY)};
    }
};
