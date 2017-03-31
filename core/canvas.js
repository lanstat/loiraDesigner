/**
 * Plugin para diseño de diagramas
 * @namespace
 * @license Apache-2.0
 */
var Loira;
(function (Loira) {
    var RelationEvent = Loira.event.RelationEvent;
    var ObjectEvent = Loira.event.ObjectEvent;
    var MouseEvent = Loira.event.MouseEvent;
    var CanvasContainer = (function () {
        function CanvasContainer() {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
        }
        return CanvasContainer;
    }());
    var CanvasConfig = (function () {
        function CanvasConfig() {
            this.width = 0;
            this.height = 0;
            this.viewportWidth = 0;
            this.viewportHeight = 0;
        }
        return CanvasConfig;
    }());
    var FpsCounter = (function () {
        function FpsCounter(fps) {
            if (fps === void 0) { fps = 32; }
            this._fps = 1000 / fps;
            this._elapsed = new Date().getTime();
        }
        FpsCounter.prototype.passed = function () {
            var response = false;
            var time = new Date().getTime();
            if (time >= this._elapsed) {
                this._elapsed = time + this._fps;
                response = true;
            }
            return response;
        };
        return FpsCounter;
    }());
    var Canvas = (function () {
        /**
         * Create a new instance of canvas
         *
         * @memberof Loira
         * @class Canvas
         * @param {object} container Id of the element container or pointer of the container
         * @param {CanvasConfig} config Canvas configurations
         */
        function Canvas(container, config) {
            /**
             * @property {Object}  _selected - Objeto que se encuentra seleccionado
             */
            this._selected = null;
            /**
             * @property {Boolean}  _isDragged - Determina si el usuario esta arrastrando un objeto
             */
            this._isDragged = false;
            /**
             * @property {Object}  _tmp - Almacena datos temporales
             */
            this._tmp = {};
            /**
             * @property { Loira.Element[] } items - Listado de objetos que posee el canvas
             */
            this.items = [];
            /**
             * @property {HTMLCanvasElement} _canvas - Puntero al objeto de renderizado de lienzo
             */
            this._canvas = null;
            /**
             * @property {HTMLCanvasElement} _background - Imagen de fondo
             */
            this._background = null;
            /**
             * @property {Object} _canvasContainer - Contenedor del canvas
             */
            this._canvasContainer = null;
            /**
             * @property {String}  defaultRelation - Relacion que se usara por defecto cuando se agregue una nueva union
             */
            this.defaultRelation = null;
            /**
             * @property {HTMLDivElement}  container - Canvas container
             */
            this.container = null;
            if (typeof container === 'string') {
                this.container = document.getElementById(container);
            }
            else {
                this.container = container;
            }
            if (!config) {
                config = new CanvasConfig();
                config.width = this.container.parentElement.offsetWidth;
                config.height = this.container.parentElement.offsetHeight;
            }
            config.viewportWidth = config.viewportWidth || this.container.parentElement.offsetWidth || config.width;
            config.viewportHeight = config.viewportHeight || this.container.parentElement.offsetHeight || config.height;
            this._canvas = document.createElement('canvas');
            this._canvas.width = config.width;
            this._canvas.height = config.height;
            this._canvas.style.position = 'absolute';
            this._canvas.style.left = '0';
            this._canvas.style.top = '0';
            this._canvas.style.zIndex = '100';
            this._canvas.style.backgroundColor = Loira.Config.background;
            this.container.style.width = this.container.style.maxWidth = config.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = config.viewportHeight + 'px';
            this.container.style.position = 'relative';
            this.container.style.overflow = 'auto';
            this._config = config;
            this._tmp.pointer = { x: 0, y: 0 };
            this.container.appendChild(this._canvas);
            this._callbacks = {};
            this.items = [];
            this.defaultRelation = 'Relation.Association';
            if (document.defaultView && document.defaultView.getComputedStyle) {
                this._border = {
                    paddingLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingLeft'], 10) || 0,
                    paddingTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingTop'], 10) || 0,
                    borderLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderLeftWidth'], 10) || 0,
                    borderTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderTopWidth'], 10) || 0
                };
            }
            var _this = this;
            Loira.drawable.registerMap(Loira.Config.assetsPath, Loira.Config.regions, function () {
                _this.renderAll();
            });
            this._fps = new FpsCounter(config.fps);
            this._bind();
            this._setScrollContainer();
        }
        /**
         * Dibuja las relaciones y simbolos dentro del canvas
         * @memberof Loira.Canvas#
         */
        Canvas.prototype.renderAll = function (forceRender) {
            if (forceRender === void 0) { forceRender = false; }
            if (this._fps.passed() || forceRender) {
                var ctx = this._canvas.getContext('2d');
                ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                for (var i = 0; i < this.items.length; i++) {
                    ctx.save();
                    this.items[i]._render(ctx);
                    ctx.restore();
                }
                if (this._selected) {
                    ctx.save();
                    this._selected.drawSelected(ctx);
                    ctx.restore();
                    this._selected._renderButtons(ctx);
                }
            }
        };
        /**
         * Agrega uno o varios elementos al listado de objetos
         *
         * @memberof Loira.Canvas#
         * @param {Array.<Object>} args Elementos a agregar
         * @fires object:added
         * @todo verificar que las relaciones se agreguen al final sino ocurre error de indices
         */
        Canvas.prototype.add = function (args) {
            if (!args.length) {
                args = [].splice.call(arguments, 0);
            }
            var _items = this.items;
            var _this = this;
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var item = args_1[_i];
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
                    _this.emit('relation:added', new RelationEvent(item, 'relationadded'));
                }
                else if (item.baseType === 'container') {
                    _items.splice(0, 0, item);
                    /**
                     * Evento que encapsula la agregacion de un objeto del canvas
                     *
                     * @event object:added
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this.emit('container:added', new ObjectEvent(item, 'objectadded'));
                }
                else {
                    if (item.centerObject) {
                        if (_this._canvasContainer) {
                            item.x = (_this._canvasContainer.w / 2) + _this._canvasContainer.x - (item.width / 2);
                            item.y = (_this._canvasContainer.h / 2) + _this._canvasContainer.y - (item.height / 2);
                        }
                        else {
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
                    _this.emit('object:added', new ObjectEvent(item, 'objectadded'));
                }
            }
        };
        /**
         * Elimina los objetos enviados como argumentos
         *
         * @memberof Loira.Canvas#
         * @fires object:removed
         */
        Canvas.prototype.remove = function (args) {
            args = [].splice.call(arguments, 0);
            var _items = this.items;
            var _this = this;
            for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
                var item = args_2[_i];
                var toDelete = [];
                item._canvas = null;
                toDelete.push(_items.indexOf(item));
                for (var i = 0; i < _items.length; i++) {
                    if (_items[i].baseType === 'relation') {
                        var relation = _items[i];
                        if (relation.start._uid === item._uid ||
                            relation.end._uid === item._uid) {
                            relation._canvas = null;
                            toDelete.push(i);
                        }
                    }
                }
                toDelete.sort();
                for (i = toDelete.length - 1; i >= 0; i--) {
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
                _this.emit('object:removed', new ObjectEvent(item, 'objectremoved'));
            }
            this._selected = null;
        };
        /**
         * Elimina todos los objetos del canvas
         *
         * @memberof Loira.Canvas#
         */
        Canvas.prototype.removeAll = function () {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i]._canvas = null;
            }
            this.items = [];
            this._selected = null;
        };
        /**
         * Destruye el componente
         *
         * @memberof Loira.Canvas#
         */
        Canvas.prototype.destroy = function () {
            this._canvas.onmousemove = null;
            this._canvas.onkeydown = null;
            this._canvas.onmousedown = null;
            this._canvas.onmouseup = null;
            this._canvas.ondblclick = null;
            this._canvas.onselectstart = null;
            if (this._canvasContainer) {
                this.container.removeEventListener('scroll', this._canvasContainer.listener);
            }
            this._canvasContainer = null;
            this._canvas = null;
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        };
        /**
         * Agrega un nuevo escuchador al evento especifico
         *
         * @memberof Loira.Canvas#
         * @param { string } evt Nombre del evento que se desea capturar
         * @param { function } callback Funcion que escucha el evento
         * @returns { function } Funcion que escucha el evento
         */
        Canvas.prototype.on = function (evt, callback) {
            var name;
            if (typeof evt === 'string') {
                if (typeof this._callbacks[evt] === 'undefined') {
                    this._callbacks[evt] = [];
                }
                this._callbacks[evt].push(callback);
                return callback;
            }
            else if (typeof evt === 'object') {
                for (name in evt) {
                    if (evt.hasOwnProperty(name)) {
                        if (typeof this._callbacks[name] === 'undefined') {
                            this._callbacks[name] = [];
                        }
                        this._callbacks[name].push(evt[name]);
                    }
                }
            }
            return null;
        };
        /**
         * Unregister a event
         *
         * @param {string} evt - Event's name
         * @param {function} callback - Funcion a desregistrar
         */
        Canvas.prototype.fall = function (evt, callback) {
            var index = this._callbacks[evt].indexOf(callback);
            if (index > -1) {
                this._callbacks[evt].splice(index, 1);
            }
        };
        /**
         * Enlaza los eventos del canvas al canvas propio del diseñador
         *
         * @memberof Loira.Canvas#
         * @private
         */
        Canvas.prototype._bind = function () {
            var _this = this;
            _this._canvas.onkeydown = function (evt) {
                var code = evt.keyCode;
                if (code === 46) {
                    if (_this._selected && _this._selected.baseType !== 'relation') {
                        _this.remove(_this._selected);
                    }
                }
            };
            var onDown = function (evt, isDoubleClick) {
                var real = _this._getMouse(evt);
                _this._tmp.pointer = real;
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
                    _this.emit('mouse:dblclick', new MouseEvent(real.x, real.y, 'dblclick'));
                }
                else {
                    /**
                     * Evento que encapsula un click sobre el canvas
                     *
                     * @event mouse:down
                     * @type { object }
                     * @property {int} x - Posicion x del puntero
                     * @property {int} y - Posicion y del puntero
                     * @property {string} type - Tipo de evento
                     */
                    _this.emit('mouse:down', new MouseEvent(real.x, real.y, 'mousedown'));
                }
                if (_this._selected) {
                    _this._tmp.transform = _this._selected.getSelectedCorner(real.x, real.y);
                    if (_this._tmp.transform || _this._selected.callCustomButton(real.x, real.y)) {
                        return;
                    }
                    else {
                        _this._selected = null;
                    }
                }
                if (!isDoubleClick) {
                    _this._isDragged = true;
                    _this._canvas.style.cursor = '-moz-grabbing;-webkit-grabbing;grabbing';
                }
                var item;
                for (var i = _this.items.length - 1; i >= 0; i--) {
                    item = _this.items[i];
                    if (item.checkCollision(real.x, real.y)) {
                        _this._selected = item;
                        if (item.baseType !== 'relation') {
                            if (isDoubleClick) {
                                /**
                                 * Evento que encapsula doble click sobre un objeto
                                 *
                                 * @event object:dblclick
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this.emit('object:dblclick', new ObjectEvent(item, 'objectdblclick'));
                            }
                            else {
                                /**
                                 * Evento que encapsula un click sobre un objeto
                                 *
                                 * @event object:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this.emit('object:selected', new ObjectEvent(item, 'objectselected'));
                            }
                            break;
                        }
                        else {
                            if (isDoubleClick) {
                                /**
                                 * Evento que encapsula doble click sobre una relacion
                                 *
                                 * @event relation:dblclick
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this.emit('relation:dblclick', new ObjectEvent(item, 'relationdblclick'));
                            }
                            else {
                                /**
                                 * Evento que encapsula un click sobre una relacion
                                 *
                                 * @event relation:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this.emit('relation:selected', new ObjectEvent(item, 'relationselected'));
                            }
                            break;
                        }
                    }
                }
                _this.renderAll();
            };
            _this._canvas.onmousedown = function (evt) {
                onDown(evt, false);
            };
            _this._canvas.onmousemove = function (evt) {
                if (_this._isDragged) {
                    var real = _this._getMouse(evt);
                    var x = real.x - _this._tmp.pointer.x;
                    var y = real.y - _this._tmp.pointer.y;
                    /**
                     * Evento que encapsula el movimiento del mouse sobre el canvas
                     *
                     * @event mouse:move
                     * @type { object }
                     * @property {int} x - Posicion x del puntero
                     * @property {int} y - Posicion y del puntero
                     * @property {string} type - Tipo de evento
                     */
                    _this.emit('mouse:move', new MouseEvent(real.x, real.y, 'mousemove'));
                    if (_this._selected) {
                        if (_this._tmp.transform) {
                            if (_this._selected.baseType !== 'relation') {
                                x = Math.floor(x);
                                y = Math.floor(y);
                                switch (_this._tmp.transform) {
                                    case 'tc':
                                        _this._selected.y += y;
                                        _this._selected.height -= y;
                                        break;
                                    case 'bc':
                                        _this._selected.height += y;
                                        break;
                                    case 'ml':
                                        _this._selected.x += x;
                                        _this._selected.width -= x;
                                        break;
                                    case 'mr':
                                        _this._selected.width += x;
                                        break;
                                }
                            }
                            else {
                                _this._selected.movePoint(_this._tmp.transform, x, y);
                            }
                            _this.renderAll();
                        }
                        else {
                            _this._selected.x += x;
                            _this._selected.y += y;
                            /**
                             * Evento que encapsula el arrastre de un objeto
                             *
                             * @event object:dragging
                             * @type { object }
                             * @property {object} selected - Objeto seleccionado
                             * @property {string} type - Tipo de evento
                             */
                            _this.emit('object:dragging', new ObjectEvent(_this._selected, 'objectdragging'));
                            _this.renderAll();
                        }
                    }
                    else {
                        if (_this._canvas && _this._canvasContainer) {
                            x = x === 0 ? x : x / Math.abs(x);
                            y = y === 0 ? y : y / Math.abs(y);
                            _this.container.scrollLeft -= 5 * x;
                            _this.container.scrollTop -= 5 * y;
                            _this._canvasContainer.x = Math.floor(_this.container.scrollLeft);
                            _this._canvasContainer.y = Math.floor(_this.container.scrollTop);
                        }
                    }
                    _this._tmp.pointer = real;
                }
            };
            _this._canvas.onmouseup = function (evt) {
                var real = _this._getMouse(evt);
                //_this._canvas.style.cursor = 'default';
                _this._isDragged = false;
                /**
                 * Evento que encapsula la liberacion del mouse sobre el canvas
                 *
                 * @event mouse:up
                 * @type { object }
                 * @property {int} x - Posicion x del puntero
                 * @property {int} y - Posicion y del puntero
                 * @property {string} type - Tipo de evento
                 */
                _this.emit('mouse:up', new MouseEvent(real.x, real.y, 'mouseup'));
                if (_this._selected) {
                    /**
                     * Evento que encapsula la liberacion de un objeto
                     *
                     * @event object:released
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this.emit('object:released', new ObjectEvent(_this._selected, 'objectreleased'));
                    _this._tmp.transform = false;
                    _this._selected.recalculateBorders();
                }
            };
            _this._canvas.onmouseleave = function (evt) {
                _this._isDragged = false;
            };
            _this._canvas.onselectstart = function () {
                return false;
            };
        };
        /**
         * Emite un evento generado
         *
         * @memberof Loira.Canvas#
         * @param evt Nombre del evento a emitir
         * @param options Valores enviados junto al evento
         * @param element Element that fire event
         */
        Canvas.prototype.emit = function (evt, options, element) {
            if (typeof element !== 'undefined') {
                var type = element.baseType === 'relation' ? 'relation' : 'object';
                evt = type + ':' + evt;
            }
            if (typeof this._callbacks[evt] !== 'undefined') {
                for (var _i = 0, _a = this._callbacks[evt]; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.call(this, options);
                }
            }
        };
        /**
         * Obtiene la posicion del mouse relativa al canvas
         *
         * @memberof Loira.Canvas#
         * @param evt Evento de mouse
         * @returns {{x: number, y: number}} Posicion del mouse relativa
         */
        Canvas.prototype._getMouse = function (evt) {
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
            var response = { x: (evt.pageX - offsetX), y: (evt.pageY - offsetY) };
            if (this._canvasContainer) {
                response.x += this._canvasContainer.x;
                response.y += this._canvasContainer.y;
            }
            return response;
        };
        /**
         * Define the background for the canvas
         *
         * @param image Image to set as background
         * @param resizeToImage Define if the canvas should resize to image size
         */
        Canvas.prototype.setBackground = function (image, resizeToImage) {
            this._background = document.createElement('canvas');
            this._background.width = image.width;
            this._background.height = image.height;
            this._background.style.position = 'absolute';
            this._background.style.left = '0';
            this._background.style.top = '0';
            this._background.style.zIndex = '0';
            this._background.getContext('2d').drawImage(image, 0, 0);
            if (resizeToImage) {
                this._canvas.width = image.width;
                this._canvas.height = image.height;
                this._canvas.style.backgroundColor = 'transparent';
            }
            this.container.insertBefore(this._background, this._canvas);
        };
        /**
         * Clean the background
         */
        Canvas.prototype.cleanBackground = function () {
            this.container.removeChild(this.container.firstChild);
            this._canvas.width = this._config.width;
            this._canvas.height = this._config.height;
            this.container.style.width = this.container.style.maxWidth = this._config.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = this._config.viewportHeight + 'px';
            this._canvas.style.backgroundColor = Loira.Config.background;
        };
        /**
         * Define un elemento que contendra al canvas y servira de scroll
         */
        Canvas.prototype._setScrollContainer = function () {
            var _this = this;
            if (_this._canvasContainer) {
                _this.container.removeEventListener('scroll', _this._canvasContainer.listener);
            }
            _this._canvasContainer = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                listener: function () {
                    _this._canvasContainer.y = _this.container.scrollTop;
                    _this._canvasContainer.x = _this.container.scrollLeft;
                    return true;
                }
            };
            _this._canvasContainer.w = _this.container.clientWidth;
            _this._canvasContainer.h = _this.container.clientHeight;
            _this.container.addEventListener('scroll', _this._canvasContainer.listener);
        };
        /**
         * Obtain the linked relations to a object
         *
         * @param object {Loira.Element} Objeto del que se obtendra las relaciones
         * @param onlyIncoming {boolean} Indica si solo se deben listar relaciones entrantes
         * @param onlyOutgoing {boolean} Indica si solo se deben listar relaciones salientes
         * @returns {Array}
         */
        Canvas.prototype.getRelationsFromObject = function (object, onlyIncoming, onlyOutgoing) {
            var relations = [];
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.baseType === 'relation') {
                    var rel = item;
                    if (rel.start === object || rel.end === object) {
                        if (rel.start === object && onlyOutgoing) {
                            relations.push(item);
                        }
                        else if (rel.end === object && onlyIncoming) {
                            relations.push(item);
                        }
                        else if (!onlyIncoming && !onlyOutgoing) {
                            relations.push(item);
                        }
                    }
                }
            }
            return relations;
        };
        /**
         * Center the canvas at the given point
         *
         * @param x X position
         * @param y Y position
         */
        Canvas.prototype.centerToPoint = function (x, y) {
            if (this._canvas && this._canvasContainer) {
                x = x - this.container.offsetWidth / 2;
                y = y - this.container.offsetHeight / 2;
                x = x >= 0 ? x : 0;
                y = y >= 0 ? y : 0;
                this._canvasContainer.x = x;
                this._canvasContainer.y = y;
                this.container.scrollTop = y;
                this.container.scrollLeft = x;
            }
        };
        return Canvas;
    }());
    Loira.Canvas = Canvas;
})(Loira || (Loira = {}));
//# sourceMappingURL=canvas.js.map