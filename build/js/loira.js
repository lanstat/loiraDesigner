/**
 * Plugin para diseño de diagramas
 * @namespace
 * @license Apache-2.0
 */
var Loira = {};

Loira.Canvas = (function(){
    'use strict';

    /**
     * Crea una nueva instancia de canvas
     *
     * @memberof Loira
     * @class Canvas
     * @param {object} canvas Identificador o elemento canvas
     */
    var my = function(canvas){
        this.initialize(canvas);
    };

    my.prototype =
        /** @lends Loira.Canvas.prototype */
    {
        /**
         * @property {Object}  _selected - Objeto que se encuentra seleccionado
         */
        _selected: null,
        /**
         * @property {Boolean}  _isDragged - Determina si el usuario esta arrastrando un objeto
         */
        _isDragged: false,
        /**
         * @property {Object}  _tmp - Almacena datos temporales
         */
        _tmp: {},
        /**
         * @property { array } items - Listado de objetos que posee el canvas
         */
        items: [],
        /**
         * @property {Object} _canvas - Puntero al objeto de renderizado de lienzo
         */
        _canvas: null,
        /**
         * @property {Image} _background - Imagen de fondo
         */
        _background: null,
        /**
         * @property {HtmlElement} _canvasContainer - Contenedor del canvas
         */
        _canvasContainer: null,
        /**
         * @property {String}  defaultRelation - Relacion que se usara por defecto cuando se agregue una nueva union
         */
        defaultRelation: null,
        /**
         * Inicializa las variables y calcula los bordes del canvas
         *
         * @memberof Loira.Canvas#
         * @param {object} canvas Identificador o elemento canvas
         * @private
         */
        initialize: function(canvas){
            if (typeof canvas === 'string'){
                this._canvas = document.getElementById(canvas);
            }else{
                this._canvas = canvas;
            }

            this._callbacks = {};
            this.items = [];

            this.defaultRelation = 'Relation.Association';
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
         * @memberof Loira.Canvas#
         */
        renderAll: function(){
            var ctx = this._canvas.getContext('2d');

            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            if (this._background){
                ctx.drawImage(this._background, 0, 0);
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
         * Agrega uno o varios elementos al listado de objetos
         *
         * @memberof Loira.Canvas#
         * @param {Array.<Object>} args Elementos a agregar
         * @fires object:added
         * @todo verificar que las relaciones se agreguen al final sino ocurre error de indices
         */
        add: function(args){
            if (!args.length){
                args = [].splice.call(arguments, 0);
            }
            var _items = this.items;
            var _this = this;

            args.forEach(function(item) {
                item._canvas = _this;
                if (item.baseType === 'relation') {
                    var index = _items.indexOf(item.start);
                    index = index < _items.indexOf(item.end) ? index : _items.indexOf(item.end);

                    _items.splice(index, 0, item);
                    /**
                     * Evento que encapsula la adicion de una relacion del canvas
                     *
                     * @event relation:added
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('relation:added', new relationEvent({selected:item, type: 'relationadded'}));
                } else if (item.baseType === 'container') {
                    _items.splice(0, 0, item);
                    /**
                     * Evento que encapsula la agregacion de un objeto del canvas
                     *
                     * @event object:added
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('container:added', new objectEvent({selected: item, type: 'objectadded'}));
                } else {
                    if (item.centerObject){
                        if (_this._canvasContainer){
                            item.x = (_this._canvasContainer.w / 2) + _this._canvasContainer.x - (item.width / 2);
                            item.y = (_this._canvasContainer.h / 2) + _this._canvasContainer.y - (item.height / 2);
                        } else {
                            item.x = _this._canvas.width / 2;
                            item.y = _this._canvas.height / 2;
                        }
                    }

                    _items.push(item);
                    /**
                     * Evento que encapsula la agregacion de un objeto del canvas
                     *
                     * @event object:added
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('object:added', new objectEvent({selected: item, type: 'objectadded'}));
                }
            });
       },
        /**
         * Elimina los objetos enviados como argumentos
         *
         * @memberof Loira.Canvas#
         * @fires object:removed
         */
        remove: function(){
            var args = [].splice.call(arguments, 0);
            var _items = this.items;
            var _this = this;
            args.forEach(function(item){
                var toDelete = [];

                item._canvas = null;
                toDelete.push(_items.indexOf(item));

                for (var i = 0; i < _items.length; i++){
                    if (_items[i].baseType === 'relation'){
                        if (_items[i].start._uid === item._uid ||
                            _items[i].end._uid === item._uid){
                            _items[i]._canvas = null;

                            toDelete.push(i);
                        }
                    }
                }

                toDelete.sort();

                for (i = toDelete.length - 1; i >= 0; i--){
                    _items.splice(toDelete[i], 1);
                }

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
        },
        /**
         * Elimina todos los objetos del canvas
         *
         * @memberof Loira.Canvas#
         */
        removeAll: function(){
            for (var i = 0; i < this.items.length; i++){
                this.items[i]._canvas = null;
            }
            this.items = [];
            this._selected = null;
        },
        /**
         * Destruye el componente
         *
         * @memberof Loira.Canvas#
         */
        destroy: function(){
            this._canvas.onmousemove = null;
            this._canvas.onkeydown = null;
            this._canvas.onmousedown = null;
            this._canvas.onmouseup = null;
            this._canvas.ondblclick = null;
            this._canvas.onselectstart = null;

            if (this._canvasContainer){
                this._canvasContainer.element.removeEventListener('scroll', this._canvasContainer.listener);
            }

            this._canvasContainer = null;

            this._canvas = null;
        },
        /**
         * Agrega un nuevo escuchador al evento especifico
         *
         * @memberof Loira.Canvas#
         * @param { string } evt Nombre del evento que se desea capturar
         * @param { function } callback Funcion que escucha el evento
         * @returns { function } Funcion que escucha el evento
         */
        on: function(evt, callback){
            var name;

            if(typeof evt === 'string'){
                if (typeof this._callbacks[evt] === 'undefined'){
                    this._callbacks[evt] = [];
                }
                this._callbacks[evt].push(callback);
                return callback;
            }else if(typeof evt === 'object'){
                for (name in evt){
                    if (evt.hasOwnProperty(name)){
                        if (typeof this._callbacks[name] === 'undefined'){
                            this._callbacks[name] = [];
                        }
                        this._callbacks[name].push(evt[name]);
                    }
                }
            }
        },
        /**
         * Desregistra un evento
         *
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
         * @memberof Loira.Canvas#
         * @private
         */
        _bind: function(){
            var _this = this;

            _this._canvas.onkeydown = function(evt){
                var code = evt.keyCode;
                if (code === 46){
                    if (_this._selected && _this._selected.baseType !== 'relation' ){
                        _this.remove(_this._selected);
                    }
                }
            };

            var onDown = function(evt, isDoubleClick){
                var real = _this._getMouse(evt);
                _this._tmp.pointer =  real;

                if (isDoubleClick) {
                    /**
                     * Evento que encapsula doble click sobre el canvas
                     *
                     * @event mouse:dblclick
                     * @type { object }
                     * @property {int} x - Posicion x del puntero
                     * @property {int} y - Posicion y del puntero
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('mouse:dblclick', new mouseEvent({x:real.x, y:real.y, type: 'dblclick'}));
                }else{
                    /**
                     * Evento que encapsula un click sobre el canvas
                     *
                     * @event mouse:down
                     * @type { object }
                     * @property {int} x - Posicion x del puntero
                     * @property {int} y - Posicion y del puntero
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('mouse:down', new mouseEvent({x:real.x, y:real.y, type: 'mousedown'}));
                }

                if (_this._selected){
                    _this._tmp.transform = _this._selected.getSelectedCorner(real.x, real.y);
                    if(_this._tmp.transform || _this._selected.callCustomButton(real.x, real.y)){
                        return;
                    }else{
                        _this._selected = null;
                    }
                }

                var item;
                for (var i = _this.items.length - 1; i >= 0; i--) {
                    item = _this.items[i];
                    if(item.checkCollision(real.x, real.y)){
                        _this._selected = item;
                        if (!isDoubleClick){
                            _this._isDragged = true;
                        }

                        if (item.baseType !== 'relation'){
                            if (isDoubleClick){
                                /**
                                 * Evento que encapsula doble click sobre un objeto
                                 *
                                 * @event object:dblclick
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('object:dblclick', new objectEvent({selected:item, type: 'objectdblclick'}));
                            }else{
                                /**
                                 * Evento que encapsula un click sobre un objeto
                                 *
                                 * @event object:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('object:selected', new objectEvent({selected:item, type: 'objectselected'}));
                            }
                            break;
                        } else if (!_this._selected){
                            if (isDoubleClick){
                                /**
                                 * Evento que encapsula doble click sobre una relacion
                                 *
                                 * @event relation:dblclick
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('relation:dblclick', new objectEvent({selected:item, type: 'relationdblclick'}));
                            }else{
                                /**
                                 * Evento que encapsula un click sobre una relacion
                                 *
                                 * @event relation:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('relation:selected', new objectEvent({selected:item, type: 'relationselected'}));
                            }
                            break;
                        } else {
                            _this._isDragged = false;
                        }
                    }
                }

                _this.renderAll();
            };

            _this._canvas.onmousedown = function(evt){
                onDown(evt, false);
            };
            _this._canvas.onmousemove = function(evt){
                var real = _this._getMouse(evt);
                /**
                 * Evento que encapsula el movimiento del mouse sobre el canvas
                 *
                 * @event mouse:move
                 * @type { object }
                 * @property {int} x - Posicion x del puntero
                 * @property {int} y - Posicion y del puntero
                 * @property {string} type - Tipo de evento
                 */
                _this._emit('mouse:move', new mouseEvent({x:real.x, y:real.y, type: 'mousemove'}));

                if(_this._selected){
                    if(_this._tmp.transform){
                        if (_this._selected.baseType !== 'relation'){
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
                        } else {
                            _this._selected.movePoint(_this._tmp.transform, real.x - _this._tmp.pointer.x, real.y - _this._tmp.pointer.y);
                        }

                        _this.renderAll();
                    }else if(_this._isDragged){
                        _this._selected.x += real.x - _this._tmp.pointer.x;
                        _this._selected.y += real.y - _this._tmp.pointer.y;

                        _this._canvas.style.cursor = 'move';
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
            _this._canvas.onmouseup = function(evt){
                var real = _this._getMouse(evt);
                _this._canvas.style.cursor = 'default';

                /**
                 * Evento que encapsula la liberacion del mouse sobre el canvas
                 *
                 * @event mouse:up
                 * @type { object }
                 * @property {int} x - Posicion x del puntero
                 * @property {int} y - Posicion y del puntero
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
                    _this._selected.recalculateBorders();
                }
            };

            _this._canvas.onselectstart = function() {return  false;};
        },
        /**
         * Emite un evento generado
         *
         * @memberof Loira.Canvas#
         * @param evt Nombre del evento a emitir
         * @param options Valores enviados junto al evento
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
         * @memberof Loira.Canvas#
         * @param evt Evento de mouse
         * @returns {{x: number, y: number}} Posicion del mouse relativa
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

            var response = {x: (evt.pageX - offsetX), y: (evt.pageY - offsetY)};

            if (this._canvasContainer){
                response.x += this._canvasContainer.x;
                response.y += this._canvasContainer.y;
            }

            return response;
        },
        /**
         * Define un fondo para
         *
         * @param image Imagen a colocar de fondo
         * @param resizeToImage Determina si el canvas se redimensionara al tamaño de la imagen
         */
        setBackground: function(image, resizeToImage){
            this._background = image;

            if (resizeToImage){
                this._canvas.width = image.width;
                this._canvas.height = image.height;
            }
        },
        /**
         * Define un elemento que contendra al canvas y servira de scroll
         *
         * @param container Contenedor del canvas
         */
        setScrollContainer: function(container){
            var _this = this;

            if (_this._canvasContainer){
                _this._canvasContainer.element.removeEventListener('scroll', _this._canvasContainer.listener);
            }

            _this._canvasContainer = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                element: document.getElementById(container),
                listener: function(evt){
                    _this._canvasContainer.y = _this._canvasContainer.element.scrollTop;
                    _this._canvasContainer.x = _this._canvasContainer.element.scrollLeft;
                    return true;
                }
            };

            _this._canvasContainer.w = _this._canvasContainer.element.clientWidth;
            _this._canvasContainer.h = _this._canvasContainer.element.clientHeight;
            _this._canvasContainer.element.addEventListener('scroll', _this._canvasContainer.listener);
        },
        /**
         * Obtiene las relaciones vinculadas a un objeto
         *
         * @param object {Loira.Object} Objeto del que se obtendra las relaciones
         * @param onlyIncoming {boolean} Indica si solo se deben listar relaciones entrantes
         * @param onlyOutgoing {boolean} Indica si solo se deben listar relaciones salientes
         * @returns {Array}
         */
        getRelationsFromObject: function(object, onlyIncoming, onlyOutgoing){
            var relations = [];
            for (var i = 0; i < this.items.length; i++){
                var item = this.items[i];

                if (item.baseType == 'relation'){
                    if (item.start == object || item.end == object){
                        if (item.start == object && onlyOutgoing){
                            relations.push(item);
                        }else if (item.end == object && onlyIncoming){
                            relations.push(item);
                        }else if (!onlyIncoming && !onlyOutgoing) {
                            relations.push(item);
                        }
                    }
                }
            }

            return relations;
        }
    };

    return my;
}());

/**
 * Objeto que encapsula un evento sobre el canvas
 * 
 * @type object
 * @property {int} x - Posicion x del puntero
 * @property {int} y - Posicion y del puntero
 * @property {string} type - Tipo de evento
 */
var mouseEvent = function(options){
	this.x = 'x' in options? options.x : -1;
	this.y = 'y' in options? options.y : -1;
	this.type = 'type' in options? options.type : '';
};

/**
 * Objeto que encapsula un click sobre un objeto
 * 
 * @type object
 * @property {object} selected - Objeto seleccionado
 * @property {string} type - Tipo de evento
 */
var objectEvent = function(options){
	this.selected = 'selected' in options? options.selected : null;
	this.type = 'type' in options? options.type : '';
};

/**
 * Objeto que encapsula un evento sobre una relacion
 *
 * @type object
 * @property {object} selected - Relacion seleccionada
 * @property {string} type - Tipo de evento
 */
var relationEvent = function(options){
	this.selected = 'selected' in options? options.selected : null;
	this.type = 'type' in options? options.type : '';
};

/**
 * Clase base para la creacion de nuevos objetos dibujables
 *
 * @memberof Loira
 * @namespace util
 */
Loira.util = (function(){
    return {
        /**
         * Crea un objeto o funcion que extiende la base con los metodos del hijo
         *
         * @param base Objeto base a extender
         * @param child Objecto que agregara sus funciones a la base
         * @param isAbstract Determina si lo que se retornara es un objeto (abstracto) o un funcion (clase instanciable)
         * @returns {*} Retorna un objeto o funcion instanciable
         */
        createClass: function(base, child, isAbstract){
            var obj = {};
            var i;

            for (i in child) {
                if (child.hasOwnProperty(i)) {
                    obj[i] = child[i];
                }
            }
            for (i in base) {
                if (base.hasOwnProperty(i)) {
                    if (obj.hasOwnProperty(i)){
                        obj['$'+i] = base[i];
                    }else{
                        obj[i] = base[i];
                    }
                }
            }
            if(isAbstract){
                return obj;
            }
            return function(options){
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)){
                        this[i] = obj[i];
                    }
                }

                this.initialize(options);
            }
        },
        /**
         * Crea una cadena con caracteres aleatorios
         *
         * @param maxLength Longitud de la cadena
         * @returns {string}
         */
        createRandom: function (maxLength){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < maxLength; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        /**
         * Determina la el punto de intereseccion entre 2 lineas
         *
         * @param line1 Linea 1
         * @param line2 Linea 2
         * @returns {*}
         */
        intersectPointLine : function (line1, line2){
            var den = ((line1.y2 - line1.y1) * (line2.x2 - line2.x1)) - ((line1.x2 - line1.x1) * (line2.y2 - line2.y1));
            if (den === 0) {
                return false;
            }
            var a = line2.y1 - line1.y1;
            var b = line2.x1 - line1.x1;
            var numerator1 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);
            var numerator2 = ((line2.x2 - line2.x1) * a) - ((line2.y2 - line2.y1) * b);
            a = numerator1 / den;
            b = numerator2 / den;

            return {x: line2.x1 + (a * (line2.x2 - line2.x1)), y: line2.y1 + (a * (line2.y2 - line2.y1))};
        },
        /**
         * Instancia una clase tomando una cadena como base
         *
         * @param str Nombre de la clase, o espacio de nombre a instanciar
         * @returns {Function}
         */
        stringToFunction: function(str) {
            var arr = str.split(".");

            var fn = (window || this);
            for (var i = 0, len = arr.length; i < len; i++) {
                fn = fn[arr[i]];
            }

            if (typeof fn !== "function") {
                throw new Error("function not found");
            }

            return  fn;
        }
    };
}());
/**
 * Clase base para la creacion de nuevos objetos dibujables
 *
 * @memberof Loira
 * @class Object
 */
Loira.Object = (function(){
    'use strict';

    return {
        /**
         * @property {Loira.Canvas}  _canvas - Canvas al que pertenece el objeto
         */
        _canvas: null,
        _buttons: [],
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Loira.Object#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        initialize: function(options){
            this._uid = Loira.util.createRandom(8);

            if(typeof options === 'undefined'){
                options = {};
            }

            this.x = 'x' in options ? options.x : 0;
            this.y = 'y' in options ? options.y : 0;
            this.width = 'width' in options ? options.width : 0;
            this.height = 'height' in options ? options.height : 0;
            this.centerObject = 'centerObject' in options ? options.centerObject : false;
            this.startPoint = 'startPoint' in options ? options.startPoint : false;
            this.endPoint = 'endPoint' in options ? options.endPoint : false;
            this.maxOutGoingRelation = 'maxOutGoingRelation' in options? options.maxOutGoingRelation : false;
            this.extras = 'extras' in options? options.extras : {};

            this._buttons = [];
            this._canvas = null;
            this.type = '';
            this.baseType = '';
            this._prepare(options);
        },
        /**
         * Ejecuta un metodo de la clase padre
         *
         * @memberof Loira.Object#
         * @protected
         * @param { string } funcName Nombre de la funcion a ejecutar
         * @param {Array.<Object>} args Parametros de la funcion
         * @returns {*} Valores de retorno de la funcion ejecutada
         */
        callSuper: function(funcName, args){
            args = [].splice.call(arguments, 0);
            funcName = '$'+ funcName;

            args = args.length > 1? args.splice(1, args.length): [];

            return this[funcName].apply(this, args);
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         * @abstract
         */
        _render: function(ctx){},
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Loira.Object#
         * @param { object } options Datos con valores inciales
         * @protected
         * @abstract
         */
        _prepare: function(options){},
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        checkCollision: function(x, y){
            return (x>= this.x && x<= this.x + this.width && y>=this.y && y<=this.y + this.height);
        },
        /**
         * Agrega iconos laterales del objeto con sus respectivos escuchadores
         *
         * @memberof Loira.Object#
         * @param {Array.<Object>} args Iconos laterales a agregar
         */
        on: function(args){
            args = [].splice.call(arguments, 0);
            for (var i = 0; i < args.length; i++) {
                var button = args[i];
                var img = document.createElement('IMG');
                img.src = button.icon;
                this._buttons.push({'icon':img, 'click': button.click});
            }
        },
        /**
         * Renderiza los iconos de los botones laterales
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        _renderButtons: function(ctx){
            var x = this.x + this.width + 10;
            var y = this.y;
            if(this._buttons.length>0){
                this._buttons.forEach(function (item){
                    ctx.drawImage(item.icon, x, y);
                    y += item.icon.height + 4;
                });
            }
        },
        /**
         * Ejecuta el escuchador de algun icono lateral encontrado por el punto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         * @private
         */
        callCustomButton: function(x, y){
            var _x = this.x + this.width + 10;
            var _y = this.y;
            for (var i = 0; i < this._buttons.length; i++) {
                var item = this._buttons[i];
                if(_x <= x && x <= _x + item.icon.width && _y <= y && y <= _y + item.icon.height){
                    item.click.call(this);
                    return true;
                }
                _y += item.icon.height + 4;
            }
            return false;
        },
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        drawSelected: function(ctx){
            var x = this.x-2,
                y = this.y-2,
                w = this.width,
                h = this.height;

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle= Loira.Config.selected.color;
            ctx.rect(x, y, w+4, h+4);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle= Loira.Config.selected.color;

            ctx.fillRect(x-4, y-4, 8, 8);
            ctx.fillRect(x+w, y+h, 8, 8);
            ctx.fillRect(x+w, y-4, 8, 8);
            ctx.fillRect(x-4, y+h, 8, 8);
            ctx.fillRect(x+w/2, y-4, 8, 8);
            ctx.fillRect(x+w/2, y+h, 8, 8);
            ctx.fillRect(x-4, y+h/2, 8, 8);
            ctx.fillRect(x+w, y+h/2, 8, 8);

            ctx.strokeStyle= '#000000';
            ctx.fillStyle= '#000000';
        },
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Loira.Object#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {*}
         */
        getSelectedCorner: function(pX, pY){
            var x = this.x-2,
                y = this.y-2,
                w = this.width,
                h = this.height,
                mw = w/2,
                mh = h/2;
            if(x-4 <= pX && pX <= x+4  && y-4 <= pY && pY <= y+4)
                return 'tl';
            if(x+w <= pX && x+w+8 >= pX && y-4 <= pY && y+4 >= pY)
                return 'tr';
            if(x+w <= pX && x+w+8 >= pX && y+h <= pY && y+h+8 >= pY)
                return 'br';
            if(x-4 <= pX && x+4 >= pX && y+h <= pY && y+h+8 >= pY)
                return 'bl';
            if(x+mw <= pX && x+mw+8 >= pX && y-4 <= pY && y+4 >= pY)
                return 'tc';
            if(x+mw <= pX && x+mw+8 >= pX && y+h <= pY && y+h+8 >= pY)
                return 'bc';
            if(x-4 <= pX && x+4 >= pX && y+mh <= pY && y+mh+8 >= pY)
                return 'ml';
            if(x+w <= pX && x+w+8 >= pX && y+mh <= pY && y+mh+8 >= pY)
                return 'mr';
            return false;
        },
        /**
         * Muestra el objeto si el canvas se encuentra en un contenedor
         *
         * @memberof Loira.Object#
         */
        show: function(){
            var _this = this;
            if (this._canvas && this._canvas._canvasContainer){
                var pX = (_this.x + _this.width/2) - this._canvas._canvasContainer.element.offsetWidth / 2;
                var pY = (_this.y + _this.height/2) - this._canvas._canvasContainer.element.offsetHeight / 2;

                pX = pX >= 0? pX : 0;
                pY = pY >= 0? pY : 0;

                this._canvas._canvasContainer.x = pX;
                this._canvas._canvasContainer.y = pY;
                this._canvas._canvasContainer.element.scrollTop = pY;
                this._canvas._canvasContainer.element.scrollLeft = pX;
            }
        },
        /**
         * Recalcula los bordes del objeto
         *
         * @memberof Loira.Object#
         */
        recalculateBorders: function(){}
    };
}());
/**
 * Conjunto de simbolos y objetos comunes
 *
 * @namespace
 * @license Apache-2.0
 */
var Common = {};

/**
 * Clase base para la creacion de relaciones
 *
 * @memberof Common
 * @class Relation
 * @augments Loira.Object
 */
Common.Relation = (function(){
    'use strict';

    return Loira.util.createClass(Loira.Object, {
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Common.Relation#
         * @protected
         * @param { object } options Datos con valores inciales
         */
        _prepare : function(options){
            if(typeof options === 'undefined'){
                options = {};
            }

            this.start = options.start? options.start : null;
            this.end = options.end? options.end : null;
            this.text = options.text? options.text : '';
            this.isDashed = options.isDashed? options.isDashed : false;
            this.points = [{}, {}];

            this.img = null;
            if (options.icon){
                this.img = document.createElement('IMG');
                this.img.src = Loira.Config.assetsPath + options.icon;
                this.img.onload = function() {}
            }

            this.baseType = 'relation';
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        _render: function(ctx) {
            var start = this.start,
                end = this.end,
                tmp,
                init,
                last,
                xm,
                ym;

            this.points[0] = {x: start.x + start.width/2, y: start.y + start.height/2};
            this.points[this.points.length - 1] = {x: end.x + end.width/2, y: end.y + end.height/2};
            init = this.points[0];
            last = this.points[1];

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(init.x, init.y);

            if (this.isDashed){
                ctx.setLineDash([5, 5]);
            }

            for (var i = 1; i < this.points.length; i++){
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.img){
                init = this.points[this.points.length - 2];
                last = this.points[this.points.length - 1];

                xm = last.x - init.x;
                ym = last.y - init.y;

                tmp = Math.atan(ym / xm);

                if (xm<0){
                    tmp += Math.PI;
                }

                ctx.translate(last.x, last.y);
                ctx.rotate(tmp);
                ctx.drawImage(this.img, -(15+end.obtainBorderPos(xm, ym, {x1:init.x, y1: init.y, x2:last.x, y2:last.y}, ctx)), -7);
                ctx.rotate(-tmp);
                ctx.translate(-last.x, -last.y);
            }

            if (this.text || this.text.length > 0){
                ctx.font = "10px " + Loira.Config.fontType;

                init = this.points[0];
                last = this.points[1];

                xm = last.x - init.x;
                ym = last.y - init.y;

                tmp = ctx.measureText(this.text).width;

                ctx.fillStyle = Loira.Config.background;
                ctx.fillRect(init.x + xm/2 - tmp/2, init.y + ym/2 - 15, tmp, 12);
                ctx.fillStyle = "#000000";

                ctx.fillText(this.text,
                    init.x + xm/2 - tmp/2,
                    init.y + ym/2 - 5);

                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            }
        },
        /**
         * Actualiza los objeto de origen y objetivo de la relacion
         *
         * @memberof Common.Relation#
         * @param { Object } start Objeto origen
         * @param { Object } end Objeto objetivo
         * @chainable
         * @returns {Common.Relation}
         */
        update: function(start, end){
            this.start = start;
            this.end = end;
            return this;
        },
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Common.Relation#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        checkCollision: function(x, y){
            var init = null,
                last = null;
            var x1 = 0,
                x2 = 0;
            var y1 = 0,
                y2 = 0;
            var xd = 0,
                yd = 0;
            var m;

            for (var i = 1; i < this.points.length; i++){
                init = this.points[i - 1];
                last = this.points[i];
                x1 = init.x;
                y1 = init.y;
                y2 = last.y;
                x2 = last.x;


                if (init.x > last.x){
                    x1 = last.x;
                    x2 = init.x;
                }

                if (init.y > last.y){
                    y1 = last.y;
                    y2 = init.y;
                }

                if (x > x1 - 5 && x < x2 + 5 && y > y1 - 5 && y < y2 + 5){
                    yd = Math.abs(last.y - init.y);
                    xd = Math.abs(last.x - init.x);

                    x = Math.abs(x - init.x);
                    y = Math.abs(y - init.y);

                    if (xd > yd){
                        m = Math.abs((yd / xd) * x);

                        if ((m == 0 && (y > y1 && y < y2)) || (m > y - 8 && m < y + 8)){
                            return true;
                        }
                    } else {
                        m = Math.abs((xd / yd) * y);

                        if ((m == 0 && (x > x1 && x < x2)) || (m > x - 8 && m < x + 8)){
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        drawSelected: function(ctx){
            ctx.beginPath();

            ctx.fillStyle= Loira.Config.selected.color;

            for (var i = 0; i < this.points.length; i++){
                ctx.fillRect(this.points[i].x-4, this.points[i].y-4, 8, 8);
            }

            ctx.strokeStyle= '#000000';
        },
        addPoint: function(){
            var _this = this;
            var last = _this.points[1],
                init = _this.points[0];

            var x = Math.round((last.x - init.x)/ 2) + init.x;
            var y = Math.round((last.y - init.y)/ 2) + init.y;

            _this.points.splice(1, 0, {x: x, y: y});
        },
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Common.Relation#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {*}
         */
        getSelectedCorner: function(pX, pY){
            for (var i = 1; i < this.points.length - 1; i++){
                var x = this.points[i].x-4,
                    y = this.points[i].y-4,
                    w = x + 8,
                    h = y + 8;
                if (pX > x && pX < w && pY > y && pY < h){
                    return i;
                }
            }
            return false;
        },
        /**
         * Mueve un punto de la relacion
         *
         * @memberof Common.Relation#
         * @param point Indice del punto a mover
         * @param x Delta de x
         * @param y Delta de y
         */
        movePoint: function(point, x, y){
            this.points[point].x += x;
            this.points[point].y += y;
        }
    }, true);
}());

/**
 * Clase base para los simbolos uml
 *
 * @memberof Common
 * @class Symbol
 * @augments Loira.Object
 */
Common.Symbol = (function(){
    'use strict';

    return Loira.util.createClass(Loira.Object, {
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Common.Symbol#
         * @protected
         * @param { object } options Datos con valores inciales
         */
        _prepare : function(options){
            var link = this._linkSymbol;
            this.on({
                icon: Loira.Config.assetsPath + 'arrow.png',
                click: link
            });
            this.baseType = 'symbol';
        },
        /**
         * Evento que se ejecuta cuando se realiza una relacion entre simbolos
         *
         * @memberof Common.Symbol#
         * @private
         */
        _linkSymbol : function(){
            var _this = this;
            var  listener = this._canvas.on(
                'mouse:down', function(evt){
                    var canvas = _this._canvas;
                    var relations = canvas.getRelationsFromObject(_this, false, true);

                    if (!_this.maxOutGoingRelation || (relations.length < _this.maxOutGoingRelation)){
                        for (var i = 0; i < canvas.items.length; i++) {
                            var item = canvas.items[i];

                            if (item.baseType != 'relation' && !item.startPoint){
                                if(item.checkCollision(evt.x, evt.y) && !_this.endPoint){
                                    var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                    canvas.add(new instance({}).update(_this, item));
                                    break;
                                }
                            }
                        }
                    }

                    canvas.fall('mouse:down', listener);
                }
            );
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Symbol#
         * @param xm {number} Delta x de la relacion
         * @param ym {number} Delta y de la relacion
         * @param points Puntos que forman la recta
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points, ctx){
            return 0;
        }
    }, true);
}());

/**
 * Clase para generacion de actores uml
 *
 * @memberof Common
 * @class Actor
 * @augments Common.Symbol
 */
Common.Actor = (function(){
    'use strict';

    return Loira.util.createClass(Common.Symbol, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Common.Actor#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);

            this.img = document.createElement('IMG');
            this.img.src = Loira.Config.assetsPath + 'actor.png';
            this.img.onload = function() {};

            this.text = options.text? options.text: 'Actor1';
            this.width = 30;
            this.height = 85;
            this.type = 'actor';
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Actor#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        _render: function(ctx) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";

            ctx.drawImage(this.img, this.x + this.width/2 - 15, this.y);
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#000000";

            ctx.fillText(this.text, this.x, this.y+80);
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Actor#
         * @param { number } xm Delta x de la relacion
         * @param { number } ym Delta y de la relacion
         * @param points Puntos que forman la linea de relacion
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points, ctx){
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            var angle = Math.atan(ym / xm);

            if (xm<0){
                angle += Math.PI;
            }

            var result = {x:100, y:this.y-10};

            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)){
                result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
            }else{
                result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
            }

            var x = result.x - (this.x + this.width/2);
            var y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        }
    });
}());

Common.Container = (function(){
    'use strict';

    return Loira.util.createClass(Common.Symbol, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Common.Container#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);

            this.text = options.text? options.text: 'Contenedor';
            this.width = 100;
            this.height = 100;
            this.type = 'container';
            this.baseType = 'container';
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Container#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        _render: function(ctx) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            ctx.rect(this.x, this.y, this.width, this.height);

            ctx.fillText('<< ' + this.text + ' >>', this.x, this.y+10);
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Container#
         * @param { int } xm Delta x de la relacion
         * @param { int } ym Delta y de la relacion
         * @param points Puntos que forman la linea de relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points){

            var angle = Math.atan(ym / xm);

            if (xm<0){
                angle += Math.PI;
            }

            var result = {x:100, y:this.y-10};

            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)){
                result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
            }else{
                result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
            }

            var x = result.x - (this.x + this.width/2);
            var y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        }
    });
}());

/**
 * Clase para generacion de tablas de datos
 *
 * @memberof Common
 * @class Table
 * @augments Common.Symbol
 */
Common.Table = (function(){
    'use strict';

    return Loira.util.createClass(Common.Symbol, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Common.Table#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);

            this.text = options.text? options.text: 'Tabla';
            this.width = 100;
            this.height = 100;
            this.type = 'table';
            this.baseType = 'table';
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Table#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        _render: function(ctx) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            ctx.rect(this.x, this.y, this.width, this.height);

            ctx.fillText('<< ' + this.text + ' >>', this.x, this.y+10);
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Table#
         * @param { int } xm Delta x de la relacion
         * @param { int } ym Delta y de la relacion
         * @param points Puntos que forman la linea de relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points){

            var angle = Math.atan(ym / xm);

            if (xm<0){
                angle += Math.PI;
            }

            var result = {x:100, y:this.y-10};

            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)){
                result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
            }else{
                result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
            }

            var x = result.x - (this.x + this.width/2);
            var y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        }
    });
}());
/**
 * Conjunto de relaciones comunes
 *
 * @namespace Relation
 * @license Apache-2.0
 */
var Relation = {};

/**
 * Contiene las funciones para relacion de asociacion
 * 
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Association = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Association#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);
            this.type = 'association';
        }
    });
}());


/**
 * Contiene las funciones para relacion directa
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.DirectAssociation = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.DirectAssociation#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear.png';
            this.callSuper('initialize', options);
            this.type = 'direct_association';
        }
    });
}());

/**
 * Contiene las funciones para relacion de generalizacion
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Generalization = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Generalization#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear2.png';
            this.callSuper('initialize', options);
            this.type = 'generalization';
        }
    });
}());

/**
 * Contiene las funciones para relacion de realizacion
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Realization = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Realization#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear2.png';
            options['isDashed'] = true;
            this.callSuper('initialize', options);
            this.type = 'realization';
        }
    });
}());

/**
 * Contiene las funciones para relacion de dependencia
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Dependency = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Dependency#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear1.png';
            options['isDashed'] = true;
            this.callSuper('initialize', options);
            this.type = 'dependency';
        }
    });
}());
Loira.XmiParser = {
    load : function(data, canvas){
        var xmlDoc = null;
        var element;
        var key;

        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(data);
        }
        var elements = this._parse(xmlDoc);
        var symbols = {};

        for (key in elements.symbols){
            if (elements.symbols.hasOwnProperty(key)){
                element = elements.symbols[key];
                if (element.type === 'UML:UseCase'){
                    symbols[element.id] = new UseCase.UseCase({text: element.name});
                } else if (element.type === 'UML:Actor'){
                    symbols[element.id] = new Common.Actor({text: element.name});
                }
                canvas.add(symbols[element.id]);
            }
        }

        for (key in elements.relations){
            if (elements.relations.hasOwnProperty(key)){
                element = elements.relations[key];
                if (element.type === 'UML:Association'){
                    var options = {};
                    for (var i = 0; i < element.connection.length; i++){
                        if (element.connection[i]['taggedValues']['ea_end'] === 'source'){
                            options['start'] = symbols[element.connection[i]['type']];
                        } else if (element.connection[i]['taggedValues']['ea_end'] === 'target'){
                            options['end'] = symbols[element.connection[i]['type']];
                        }
                    }

                    canvas.addRelation(new Relation.Association(options));
                }
            }
        }

        setTimeout(function(){
            canvas.renderAll();
        }, 50);
    },
    _parse : function(data){
        var root = this._xmlToJson(data);
        var items = root['XMI']['XMI.content']['UML:Model']['UML:Namespace.ownedElement']['UML:Package']['UML:Namespace.ownedElement'];
        var symbols = {};
        var relations = {};

        for (var key in items){
            if(items.hasOwnProperty(key)){
                if (typeof items[key] !== 'string'){
                    var id = items[key]['@attributes']['xmi.id'];

                    if(typeof items[key]['UML:Association.connection'] !== 'undefined'){
                        relations[id] = {
                            isAbstract: items[key]['@attributes']['isAbstract'] === 'true',
                            isLeaf: items[key]['@attributes']['isLeaf'] === 'true',
                            isRoot: items[key]['@attributes']['isRoot'] === 'true',
                            visibility: items[key]['@attributes']['visibility'],
                            id: items[key]['@attributes']['xmi.id'],
                            type: key,
                            connection: []
                        };

                        for (var i = 0; i < items[key]['UML:Association.connection']['UML:AssociationEnd'].length; i++){
                            var end = items[key]['UML:Association.connection']['UML:AssociationEnd'][i];

                            var connection = {
                                aggregation : end['@attributes']['aggregation'],
                                changeable : end['@attributes']['changeable'],
                                isNavigable : end['@attributes']['isNavigable'] === 'true',
                                isOrdered : end['@attributes']['isOrdered'] === 'true',
                                targetScope : end['@attributes']['targetScope'],
                                type :  end['@attributes']['type'],
                                visibility : end['@attributes']['visibility'],
                                taggedValues : {}
                            };

                            for (var j = 0; j < end['UML:ModelElement.taggedValue']['UML:TaggedValue'].length; j++){
                                var tagged = end['UML:ModelElement.taggedValue']['UML:TaggedValue'][j]['@attributes'];
                                connection.taggedValues[tagged['tag']] = tagged['value'];
                            }

                            relations[id]['connection'].push(connection);
                        }
                    } else {
                        symbols[id] = {
                            isAbstract: items[key]['@attributes']['isAbstract'] === 'true',
                            isLeaf: items[key]['@attributes']['isLeaf'] === 'true',
                            isRoot: items[key]['@attributes']['isRoot'] === 'true',
                            name: items[key]['@attributes']['name'],
                            namespace: items[key]['@attributes']['namespace'],
                            visibility: items[key]['@attributes']['visibility'],
                            id: items[key]['@attributes']['xmi.id'],
                            type: key
                        };
                    }
                }
            }
        }

        return {symbols: symbols, relations: relations};
    },
    _xmlToJson : function (xml) {
        var obj = {};

        if (xml.nodeType === 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) === "undefined") {
                    obj[nodeName] = this._xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this._xmlToJson(item));
                }
            }
        }
        return obj;
    }
};
/**
 * Diagrama de Caso de uso
 *
 * @namespace
 */
var UseCase = {};

/**
 * Simbolo de Caso de uso
 * 
 * @class
 * @memberof UseCase
 * @augments Common.Symbol
 */
UseCase.UseCase = Loira.util.createClass(Common.Symbol, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.width = 100;
		this.height = 70;
		this.text = options.text;
        this.type = 'use_case';
	},
	_render: function(ctx) {
		ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
		if (this.text){
			var kappa = .5522848,
			    ox = (this.width / 2) * kappa, 
			    oy = (this.height / 2) * kappa, 
			    xe = this.x + this.width,           
			    ye = this.y + this.height,           
			    xm = this.x + this.width / 2,       
			    ym = this.y + this.height / 2;       

			ctx.beginPath();
			ctx.lineWidth = 2;

			ctx.moveTo(this.x, ym);
			ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
			ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
			ctx.stroke();
			ctx.fillStyle = "#fcf5d9";
			ctx.fill();
			ctx.fillStyle = "#000000";

			this._drawText(ctx, this._splitText(ctx, this.text));
		}
	},
	_splitText: function(ctx, text){
		var words = text.split(' ');
		var buff = '';
		var lines = [];

		for (var i = 0; i < words.length; i++) {
			if (ctx.measureText(buff + words[i]).width > this.width -10){
				lines.push(buff);
				buff = words[i] + ' ';
			}else{
				buff = buff + ' ' + words[i];
			}
		}
		lines.push(buff);

		return lines;
	},
	_drawText : function(ctx, lines, horiAlign, vertAlign){
		var x = this.x,
			y = this.y,
			xm = this.x + this.width / 2,       
		    ym = this.y + this.height / 2;
		if (typeof lines === 'string'){
			var tmp = lines;
			lines = [tmp];
		}

		y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

		for (var i = 0; i < lines.length; i++){
			var textW = ctx.measureText(lines[i]).width;
			ctx.fillText(lines[i], xm - textW/2, y+3);
			y = y + Loira.Config.fontSize + 3;
		}
	},
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
	obtainBorderPos : function(xm, ym){
		var a = this.width/2;
		var b = this.height/2;
		var ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

		return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
	}
});
/**
 * Contiene las funciones para relacion de extension
 *
 * @class
 * @memberof UseCase
 * @augments Common.Relation
 */
UseCase.Extends = Loira.util.createClass(Common.Relation, {
    initialize : function(options){
        options['icon'] = 'spear1.png';
        options['text'] = '<< extends >>';
        options['isDashed'] = true;

        this.callSuper('initialize', options);
        this.type = 'extends';
    }
});
/**
 * Contiene las funciones para relacion de inclusion
 *
 * @class
 * @memberof UseCase
 * @augments Common.Relation
 */
UseCase.Include = Loira.util.createClass(Common.Relation, {
    initialize : function(options){
        options['icon'] = 'spear1.png';
        options['text'] = '<< include >>';
        options['isDashed'] = true;

        this.callSuper('initialize', options);
        this.type = 'include';
    }
});

/**
 * Diagrama de cajas para seleccion de regiones
 *
 * @namespace
 * @license Apache-2.0
 */
var Box = {};

/**
 * Clase base para los simbolos uml
 *
 * @memberof Box
 * @class Box
 * @augments Loira.Object
 */
Box.Box = (function(){
    'use strict';

    return Loira.util.createClass(Loira.Object, {
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Box.Box#
         * @protected
         * @param { object } options Datos con valores inciales
         */
        _prepare : function(options){
            this.width = 'width' in options ? options.width : 30;
            this.height = 'height' in options ? options.height : 30;
            this.color =  'color' in options ? options.color: 'rgba(0,0,0,0.3)';

            this.baseType = 'box';
        },
        _render: function(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Box.Box#
         * @param xm Delta x de la relacion
         * @param ym Delta y de la relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym){
            return 0;
        }
    });
}());
/**
 * Diagrama de flujo de trabajo
 *
 * @namespace
 */
var Workflow = {};

/**
 * Simbolo de proceso
 *
 * @class
 * @memberof Workflow
 * @augments Common.Symbol
 */
Workflow.Process = Loira.util.createClass(Common.Symbol, {
    /**
     *
     * @memberof Workflow.Process#
     * @param options
     */
    initialize : function(options){
        this.callSuper('initialize', options);
        
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'process';
        this.borders = {
            bottomLeft: 0,
            topLeft: 0,
            topRight: 0,
            bottomRight: 0
        };

        this.recalculateBorders();

        this.maxOutGoingRelation = 1;
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @memberof Workflow.Process#
     * @param xm {number} Delta x de la relacion
     * @param ym {number} Delta y de la relacion
     * @param points Puntos que forman la recta
     * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym, points, ctx){
        var angle = Math.atan(ym / xm);

        if (xm<0){
            angle += Math.PI;
        }

        var result = {x:100, y:this.y-10};

        if ((angle > this.borders.bottomLeft && angle < this.borders.topLeft) || (angle > this.borders.topRight && angle < this.borders.bottomRight)){
            result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
        }else{
            result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
        }

        var x = result.x - (this.x + this.width/2);
        var y = result.y - (this.y + this.height/2);

        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },
    /**
     * Recalcula los bordes del objeto
     *
     * @memberof Workflow.Process#
     */
    recalculateBorders: function(){
        var xm = Math.round(this.width /2),
            ym = Math.round(this.height /2);

        this.borders.bottomLeft = Math.atan(-ym / xm);
        this.borders.topLeft = Math.atan(ym / xm);
        this.borders.topRight = Math.atan(ym / -xm) + Math.PI;
        this.borders.bottomRight = Math.atan(-ym / -xm) + Math.PI;
    }
});

/**
 * Simbolo base para terminadores de flujo de trabajo
 *
 * @class
 * @memberof Workflow
 * @augments Common.Symbol
 */
Workflow.Terminator = Loira.util.createClass(Common.Symbol, {
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        var x = this.x +20;
        var y = this.y;
        var xw = this.x + this.width - 20;
        var yh = this.y + this.height;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(x, y);

        ctx.lineTo(xw, y);

        ctx.bezierCurveTo(xw + 30, y, xw + 30, yh, xw, yh);

        ctx.lineTo(x, yh);

        ctx.bezierCurveTo(x - 30, yh, x -30, y, x, y);

        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym){
        var a = this.width/2;
        var b = this.height/2;
        var ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

        return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
    }
}, true);

Workflow.StartTerminator = Loira.util.createClass(Workflow.Terminator, {
    initialize : function(options){
        this.callSuper('initialize', options);

        this.width = 70;
        this.height = 30;
        this.text = 'INICIO';
        this.startPoint = true;
        this.maxOutGoingRelation = 1;

        this.type = 'start_terminator';
    }
});

Workflow.EndTerminator = Loira.util.createClass(Workflow.Terminator, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 70;
        this.height = 30;
        this.text = 'FIN';
        this.endPoint = true;
        this.type = 'end_terminator';
    }
});

/**
 * Simbolo de datos de flujo de trabajo
 *
 * @class
 * @memberof Workflow
 * @augments Common.Symbol
 */
Workflow.Data = Loira.util.createClass(Common.Symbol, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'data';
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        var x = this.x +20;
        var y = this.y;
        var xw = this.x + this.width;
        var yh = this.y + this.height;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(x, y);

        ctx.lineTo(xw, y);
        ctx.lineTo(xw - 20, yh);
        ctx.lineTo(x - 20, yh);
        ctx.lineTo(x, y);

        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym){
        var a = this.width/2;
        var b = this.height/2;
        var ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

        return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
    }
});

Workflow.Decision = Loira.util.createClass(Common.Symbol, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'decision';
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        var x = this.x;
        var y = this.y;
        var xm = this.x + this.width/2;
        var ym = this.y + this.height/2;
        var xw = this.x + this.width;
        var yh = this.y + this.height;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(xm, y);

        ctx.lineTo(xw, ym);
        ctx.lineTo(xm, yh);
        ctx.lineTo(x, ym);
        ctx.lineTo(xm, y);

        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xP Delta x de la relacion
     * @param yP Delta y de la relacion
     * @param points Puntos
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xP, yP, points){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width/2,
            ym = this.y + this.height/2,
            xw = this.x + this.width;

        var angle = Math.atan(yP / xP);
        var result;

        if (xP<0){
            angle += Math.PI;
        }

        if ((angle > 0 && angle < 1.6) || (angle > 3.15 && angle < 4.7)){
            result = Loira.util.intersectPointLine(points, {x1: x, y1: ym, x2: xm, y2: y});
        } else {
            result = Loira.util.intersectPointLine(points, {x1: xm, y1: y, x2: xw, y2: ym});
        }

        x = result.x - (this.x + this.width/2);
        y = result.y - (this.y + this.height/2);

        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }
});

Loira.Config = {
	fontSize : 12,
	fontType : 'Arial',
	selected : {
		color: '#339966'
	},
	background : '#aacccc',
	assetsPath : '../assets/'
};