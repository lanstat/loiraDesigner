var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Loira;
(function (Loira) {
    var event;
    (function (event) {
        event.ERROR_MESSAGE = 'error:message';
        event.OBJECT_ADDED = 'object:added';
        event.OBJECT_PRE_ADD = 'object:pre-add';
        event.RELATION_PRE_ADD = 'relation:pre-add';
        event.RELATION_ADDED = 'relation:added';
        event.OBJECT_REMOVED = 'object:removed';
        /**
         * Objeto que encapsula un click sobre un objeto
         *
         * @type object
         * @property {object} selected - Objeto seleccionado
         * @property {string} type - Tipo de evento
         */
        var Event = (function () {
            function Event() {
            }
            return Event;
        }());
        event.Event = Event;
        /**
         * Objeto que encapsula un evento sobre el canvas
         *
         * @type object
         * @property {int} x - Posicion x del puntero
         * @property {int} y - Posicion y del puntero
         * @property {string} type - Tipo de evento
         */
        var MouseEvent = (function (_super) {
            __extends(MouseEvent, _super);
            function MouseEvent(x, y) {
                var _this = _super.call(this) || this;
                _this.x = x;
                _this.y = y;
                return _this;
            }
            return MouseEvent;
        }(Event));
        event.MouseEvent = MouseEvent;
        /**
         * Objeto que encapsula un click sobre un objeto
         *
         * @type object
         * @property {object} selected - Objeto seleccionado
         * @property {string} type - Tipo de evento
         */
        var ObjectEvent = (function (_super) {
            __extends(ObjectEvent, _super);
            function ObjectEvent(selected) {
                var _this = _super.call(this) || this;
                _this.selected = selected;
                return _this;
            }
            return ObjectEvent;
        }(Event));
        event.ObjectEvent = ObjectEvent;
        /**
         * Objeto que encapsula un evento sobre una relacion
         *
         * @type object
         * @property {object} selected - Relacion seleccionada
         * @property {string} type - Tipo de evento
         */
        var RelationEvent = (function (_super) {
            __extends(RelationEvent, _super);
            function RelationEvent(selectedRel) {
                var _this = _super.call(this) || this;
                _this.selected = selectedRel;
                return _this;
            }
            return RelationEvent;
        }(Event));
        event.RelationEvent = RelationEvent;
        var MessageEvent = (function (_super) {
            __extends(MessageEvent, _super);
            function MessageEvent(message) {
                var _this = _super.call(this) || this;
                _this.message = message;
                return _this;
            }
            return MessageEvent;
        }(Event));
        event.MessageEvent = MessageEvent;
    })(event = Loira.event || (Loira.event = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=events.js.map
/**
 * Created by juan.garson on 27/03/2017.
 */
var Loira;
(function (Loira) {
    var drawable;
    (function (drawable) {
        /**
         * Regions registered
         */
        var regions;
        var image;
        function registerMap(path, regions, callback) {
            this.image = new Image();
            this.image.src = path;
            this.image.onload = function () {
                callback();
            };
            this.regions = regions;
        }
        drawable.registerMap = registerMap;
        function render(id, canvas, x, y) {
            var region = this.regions[id];
            canvas.drawImage(this.image, region.x, region.y, region.width, region.height, x, y, region.width, region.height);
        }
        drawable.render = render;
        function get(id) {
            return this.regions[id];
        }
        drawable.get = get;
    })(drawable = Loira.drawable || (Loira.drawable = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=drawable.js.map
var Loira;
(function (Loira) {
    var shape;
    (function (shape) {
        var HorizontalAlign;
        (function (HorizontalAlign) {
            HorizontalAlign[HorizontalAlign["LEFT"] = 0] = "LEFT";
            HorizontalAlign[HorizontalAlign["CENTER"] = 1] = "CENTER";
            HorizontalAlign[HorizontalAlign["RIGHT"] = 2] = "RIGHT";
        })(HorizontalAlign = shape.HorizontalAlign || (shape.HorizontalAlign = {}));
        var VerticalAlign;
        (function (VerticalAlign) {
            VerticalAlign[VerticalAlign["TOP"] = 0] = "TOP";
            VerticalAlign[VerticalAlign["MIDDLE"] = 1] = "MIDDLE";
            VerticalAlign[VerticalAlign["BOTTOM"] = 2] = "BOTTOM";
        })(VerticalAlign = shape.VerticalAlign || (shape.VerticalAlign = {}));
        function drawRoundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
        shape.drawRoundRect = drawRoundRect;
        function drawDiamond(ctx, x, y, width, height) {
            var xm = x + width / 2, ym = y + height / 2, xw = x + width, yh = y + height;
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
        }
        shape.drawDiamond = drawDiamond;
        function drawText(ctx, text, position) {
        }
        shape.drawText = drawText;
    })(shape = Loira.shape || (Loira.shape = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=shape.js.map
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
    var VirtualCanvas = (function () {
        function VirtualCanvas() {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.viewportWidth = 0;
            this.viewportHeight = 0;
            this.area = 0;
        }
        return VirtualCanvas;
    }());
    Loira.VirtualCanvas = VirtualCanvas;
    var CanvasConfig = (function () {
        function CanvasConfig() {
            this.width = 0;
            this.height = 0;
            this.viewportWidth = 0;
            this.viewportHeight = 0;
            this.dragCanvas = false;
            this.controller = null;
            this.readOnly = false;
        }
        return CanvasConfig;
    }());
    Loira.CanvasConfig = CanvasConfig;
    var UserAgent;
    (function (UserAgent) {
        UserAgent[UserAgent["FIREFOX"] = 1] = "FIREFOX";
        UserAgent[UserAgent["IE"] = 2] = "IE";
        UserAgent[UserAgent["CHROME"] = 3] = "CHROME";
        UserAgent[UserAgent["UNKNOWN"] = 4] = "UNKNOWN";
    })(UserAgent = Loira.UserAgent || (Loira.UserAgent = {}));
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
    var TmpData = (function () {
        function TmpData() {
        }
        return TmpData;
    }());
    var ZoomData = (function () {
        function ZoomData(canvas) {
            this._canvas = canvas;
            this._scale = 1;
            this.update(1);
        }
        ZoomData.prototype.update = function (delta) {
            this._scale += delta / Math.abs(delta);
            if (this._scale < 9 && this._scale > 0) {
                this.scrollX = Math.floor(this._canvas.width / 20);
                this.scrollY = Math.floor(this._canvas.height / 20);
            }
        };
        return ZoomData;
    }());
    function checkUserAgent() {
        var agent;
        if (/firefox/i.test(navigator.userAgent)) {
            agent = UserAgent.FIREFOX;
        }
        else {
            agent = UserAgent.UNKNOWN;
        }
        Loira.util.logger(Loira.LogLevel.SYSTEM, navigator.userAgent);
        return agent;
    }
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
            this._tmp = new TmpData();
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
             * @property {VirtualCanvas} virtualCanvas - Virtual canvas that contains all information of the size
             */
            this.virtualCanvas = null;
            /**
             * @property {String}  defaultRelation - Relacion que se usara por defecto cuando se agregue una nueva union
             */
            this.defaultRelation = null;
            /**
             * @property {HTMLDivElement}  container - Canvas container
             */
            this.container = null;
            this.readOnly = false;
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
            config.viewportWidth = config.viewportWidth || this.container.offsetWidth || this.container.parentElement.offsetWidth || config.width;
            config.viewportHeight = config.viewportHeight || this.container.offsetHeight || this.container.parentElement.offsetHeight || config.height;
            this.readOnly = config.readOnly || false;
            this._tmp.pointer = { x: 0, y: 0 };
            this._callbacks = {};
            this.items = [];
            this.width = config.width;
            this.height = config.height;
            this.viewportHeight = config.viewportHeight;
            this.viewportWidth = config.viewportWidth;
            this.dragCanvas = config.dragCanvas;
            this.fps = config.fps;
            this.defaultRelation = 'Relation.Association';
            this.refreshScreen();
            var _this = this;
            Loira.drawable.registerMap(Loira.Config.assetsPath, Loira.Config.regions, function () {
                _this.renderAll();
            });
            this._fps = new FpsCounter(config.fps);
            this._zoom = new ZoomData(this);
            this.controller = config.controller || null;
            if (this.controller) {
                this.controller.bind(this);
            }
            this.userAgent = checkUserAgent();
            this.bindResizeWindow();
        }
        Canvas.prototype.refreshScreen = function () {
            this.destroy();
            this.container.style.width = this.container.style.maxWidth = this.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = this.viewportHeight + 'px';
            this.container.style.position = 'relative';
            this.container.style.overflow = 'hidden';
            this._canvas = this.createHiDPICanvas(this.viewportWidth, this.viewportHeight);
            this._canvas.style.position = 'absolute';
            this._canvas.style.left = '0';
            this._canvas.style.top = '0';
            this._canvas.style.zIndex = '100';
            this._canvas.style.backgroundColor = Loira.Config.background;
            this._canvas.tabIndex = 99;
            this.container.appendChild(this._canvas);
            this.virtualCanvas = {
                x: 0,
                y: 0,
                viewportWidth: this.viewportWidth,
                viewportHeight: this.viewportHeight,
                width: this.width,
                height: this.height,
                area: this.viewportHeight * this.viewportWidth
            };
            if (document.defaultView && document.defaultView.getComputedStyle) {
                this._border = {
                    paddingLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingLeft'], 10) || 0,
                    paddingTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingTop'], 10) || 0,
                    borderLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderLeftWidth'], 10) || 0,
                    borderTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderTopWidth'], 10) || 0
                };
            }
            this._bind();
            var _this = this;
            this._scrollBar = new Common.ScrollBar(this);
            setTimeout(function () {
                _this.renderAll(true);
            }, 200);
        };
        /**
         * Create a canvas with specific dpi for the screen
         * https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas/15666143#15666143
         * @param width Width of the canvas
         * @param height Height of the canvas
         * @param ratio Ratio of dpi
         * @returns {HTMLCanvasElement}
         */
        Canvas.prototype.createHiDPICanvas = function (width, height, ratio) {
            var PIXEL_RATIO = (function () {
                var ctx = document.createElement("canvas").getContext("2d"), dpr = window.devicePixelRatio || 1, bsr = ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio || 1;
                return dpr / bsr;
            })();
            if (!ratio) {
                ratio = PIXEL_RATIO;
            }
            var canvas = document.createElement("canvas");
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            return canvas;
        };
        /**
         * Dibuja las relaciones y simbolos dentro del canvas
         * @memberof Loira.Canvas#
         */
        Canvas.prototype.renderAll = function (forceRender) {
            if (forceRender === void 0) { forceRender = false; }
            Loira.util.logger(Loira.LogLevel.INFO, 'Draw');
            if (this._fps.passed() || forceRender) {
                var ctx = this._canvas.getContext('2d');
                ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].isVisible(this.virtualCanvas)) {
                        ctx.save();
                        this.items[i].render(ctx, this.virtualCanvas.x, this.virtualCanvas.y);
                        ctx.restore();
                    }
                }
                if (this._selected && this._selected.selectable) {
                    Loira.util.logger(Loira.LogLevel.INFO, 'Selected');
                    ctx.save();
                    this._selected.drawSelected(ctx);
                    ctx.restore();
                    this._selected.renderButtons(ctx, this.virtualCanvas.x, this.virtualCanvas.y);
                }
                this._scrollBar.render(ctx);
                if (Loira.Config.showBanner) {
                    Loira.Canvas.drawBanner(ctx);
                }
            }
        };
        /**
         * Agrega uno o varios elementos al listado de objetos
         *
         * @memberof Loira.Canvas#
         * @param {Array.<Object>} args Elementos a agregar
         * @param fireEvent Should fire the events
         * @fires object:added
         */
        Canvas.prototype.add = function (args, fireEvent) {
            if (fireEvent === void 0) { fireEvent = true; }
            if (this.readOnly) {
                return;
            }
            var _items = this.items;
            var _this = this;
            var relation;
            var argument;
            if (Object.prototype.toString.call(args) !== '[object Array]') {
                argument = [args];
            }
            else {
                argument = args;
            }
            for (var _i = 0, argument_1 = argument; _i < argument_1.length; _i++) {
                var item = argument_1[_i];
                item.attach(_this);
                if (item.baseType === 'relation') {
                    relation = item;
                    if (!_this.emit(Loira.event.RELATION_PRE_ADD, new RelationEvent(relation))) {
                        return;
                    }
                    var index = _items.indexOf(relation.start);
                    index = index < _items.indexOf(relation.end) ? index : _items.indexOf(relation.end);
                    _items.splice(index, 0, item);
                    /**
                     * Evento que encapsula la adicion de una relacion del canvas
                     *
                     * @event relation:added
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this.emit(Loira.event.RELATION_ADDED, new RelationEvent(relation), fireEvent);
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
                    _this.emit('container:added', new ObjectEvent(item), fireEvent);
                }
                else {
                    if (!_this.emit('object:pre-add', new ObjectEvent(item))) {
                        return;
                    }
                    if (item.centerObject) {
                        item.x = (_this.virtualCanvas.viewportWidth / 2) + _this.virtualCanvas.x - (item.width / 2);
                        item.y = (_this.virtualCanvas.viewportHeight / 2) + _this.virtualCanvas.y - (item.height / 2);
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
                    _this.emit('object:added', new ObjectEvent(item), fireEvent);
                }
            }
        };
        /**
         * Elimina los objetos enviados como argumentos
         *
         * @memberof Loira.Canvas#
         * @fires object:removed
         */
        Canvas.prototype.remove = function (args, fireEvent) {
            if (fireEvent === void 0) { fireEvent = true; }
            var _items = this.items;
            var _this = this;
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var item = args_1[_i];
                var toDelete = [];
                if (item == this._selected) {
                    this._selected = null;
                }
                toDelete.push(_items.indexOf(item));
                for (var i = 0; i < _items.length; i++) {
                    if (_items[i].baseType === 'relation') {
                        var relation = _items[i];
                        if (relation.start._uid === item._uid ||
                            relation.end._uid === item._uid) {
                            relation.destroy();
                            toDelete.push(i);
                        }
                    }
                }
                toDelete.sort(function (a, b) {
                    return a - b;
                });
                for (var i = toDelete.length - 1; i >= 0; i--) {
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
                _this.emit(Loira.event.OBJECT_REMOVED, new ObjectEvent(item), fireEvent);
            }
            this.renderAll(true);
            this._selected = null;
        };
        /**
         * Elimina todos los objetos del canvas
         *
         * @memberof Loira.Canvas#
         */
        Canvas.prototype.removeAll = function () {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].destroy();
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
            if (this._canvas) {
                this._canvas.onmousemove = null;
                this._canvas.onkeydown = null;
                this._canvas.onmousedown = null;
                this._canvas.onmouseup = null;
                this._canvas.ondblclick = null;
                this._canvas.onselectstart = null;
            }
            if (this.contextMenu) {
                this.contextMenu.remove();
                this.contextMenu = null;
            }
            if (this.textEditor) {
                this.textEditor.remove();
                this.textEditor = null;
            }
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
            this.contextMenu = document.createElement('ul');
            this.contextMenu.className = 'loira-context-menu';
            this.contextMenu.oncontextmenu = function () { return false; };
            document.getElementsByTagName('body')[0].appendChild(this.contextMenu);
            this.textEditor = document.createElement('textarea');
            this.textEditor.className = 'loira-text-editor';
            document.getElementsByTagName('body')[0].appendChild(this.textEditor);
            var onKeyDown = function (evt, isGlobal) {
                if (evt.keyCode == 18) {
                    return;
                }
                _this._tmp.lastKey = evt.keyCode;
                if (!isGlobal) {
                    if (_this._tmp.lastKey === 46) {
                        if (_this.readOnly) {
                            return;
                        }
                        if (_this._selected) {
                            _this.remove([_this._selected]);
                        }
                    }
                }
            };
            _this._canvas.onkeydown = function (evt) {
                onKeyDown(evt, false);
            };
            document.addEventListener('keydown', function (evt) {
                onKeyDown(evt, true);
            });
            _this._canvas.onkeyup = function () {
                _this._tmp.lastKey = null;
            };
            document.addEventListener('keyup', function () {
                if (_this.readOnly) {
                    return;
                }
                _this._tmp.lastKey = null;
            });
            _this._canvas.onmousewheel = function (evt) {
                if (_this._tmp.lastKey == 17) {
                    _this._zoom.update(evt.deltaY);
                }
                else {
                    _this._scrollBar.addMovementWheel(_this._tmp.lastKey === 16 ? 'H' : 'V', (evt.deltaY / Math.abs(evt.deltaY)));
                }
                _this.renderAll();
                return false;
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
                    _this.emit('mouse:dblclick', new MouseEvent(real.x, real.y));
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
                    _this.emit('mouse:down', new MouseEvent(real.x, real.y));
                }
                if (!isDoubleClick && !_this.readOnly) {
                    _this._isDragged = true;
                    _this._canvas.style.cursor = 'move';
                }
                if (_this._scrollBar.checkCollision(real.x, real.y)) {
                    _this._tmp.globalPointer = { x: evt.pageX, y: evt.pageY };
                    _this._isDragged = true;
                    return;
                }
                if (_this._selected && !_this.readOnly) {
                    _this._tmp.transform = _this._selected.getSelectedCorner(real.x, real.y);
                    if (_this._tmp.transform || _this._selected.callCustomButton(real.x, real.y)) {
                        switch (_this._tmp.transform) {
                            case 'tc':
                            case 'bc':
                                _this._canvas.style.cursor = 'ns-resize';
                                break;
                            case 'ml':
                            case 'mr':
                                _this._canvas.style.cursor = 'ew-resize';
                                break;
                        }
                        return;
                    }
                    else {
                        _this._selected = null;
                        _this.emit('object:unselected', new MouseEvent(real.x, real.y));
                    }
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
                                _this.emit('object:dblclick', new ObjectEvent(item));
                            }
                            else {
                                Loira.util.logger(Loira.LogLevel.INFO, 'down');
                                /**
                                 * Evento que encapsula un click sobre un objeto
                                 *
                                 * @event object:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this.emit('object:selected', new ObjectEvent(item));
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
                                 * @property {object} selected - Objeto seleccionadonpm
                                 * @property {string} type - Tipo de evento
                                 */
                                _this.emit('relation:dblclick', new ObjectEvent(item));
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
                                _this.emit('relation:selected', new ObjectEvent(item));
                            }
                            break;
                        }
                    }
                }
                _this.renderAll();
            };
            _this._canvas.onmousedown = function (evt) {
                Loira.util.logger(Loira.LogLevel.INFO, 'Mouse');
                _this.contextMenu.style.display = 'none';
                onDown(evt, false);
            };
            _this._canvas.oncontextmenu = function (evt) {
                _this.contextMenu.style.display = 'none';
                var point = _this._getMouse(evt);
                var element = _this.getElementByPosition(point.x, point.y);
                if (element) {
                    var menu = element.getMenu(point.x, point.y);
                    if (!menu) {
                        return false;
                    }
                    var menuItem = void 0;
                    _this.contextMenu.innerHTML = '';
                    var _loop_1 = function (item) {
                        menuItem = document.createElement('li');
                        if (item) {
                            menuItem.innerHTML = item.text;
                            menuItem.onclick = function () {
                                item.callback(this, element);
                                _this.contextMenu.style.display = 'none';
                            };
                        }
                        else {
                            menuItem.className = 'null-line';
                        }
                        _this.contextMenu.appendChild(menuItem);
                    };
                    for (var _i = 0, menu_1 = menu; _i < menu_1.length; _i++) {
                        var item = menu_1[_i];
                        _loop_1(item);
                    }
                    _this.contextMenu.style.top = evt.clientY + 'px';
                    _this.contextMenu.style.left = evt.clientX + 'px';
                    _this.contextMenu.style.display = 'block';
                    _this.contextMenu.style.opacity = '1';
                }
                return false;
            };
            _this._canvas.onmousemove = function (evt) {
                if (_this.readOnly && !_this._scrollBar.isSelected()) {
                    return;
                }
                if (_this._isDragged) {
                    var real = _this._getMouse(evt);
                    var x = real.x - _this._tmp.pointer.x;
                    var y = real.y - _this._tmp.pointer.y;
                    if (!_this._scrollBar.isSelected()) {
                        /**
                         * Evento que encapsula el movimiento del mouse sobre el canvas
                         *
                         * @event mouse:move
                         * @type { object }
                         * @property {int} x - Posicion x del puntero
                         * @property {int} y - Posicion y del puntero
                         * @property {string} type - Tipo de evento
                         */
                        _this.emit('mouse:move', new MouseEvent(real.x, real.y));
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
                                    _this._selected.movePoint(parseInt(_this._tmp.transform), x, y);
                                }
                                _this.renderAll();
                            }
                            else {
                                if (_this._selected.draggable) {
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
                                    _this.emit('object:dragging', new ObjectEvent(_this._selected));
                                    _this.renderAll();
                                }
                            }
                        }
                        else {
                            // TODO Verificar cuando se complete el canvas
                            /*if (_this._config.dragCanvas){
                             if (_this._canvas && _this._canvasContainer) {
                             x = x === 0? x : x/Math.abs(x);
                             y =  y === 0? y : y/Math.abs(y);

                             _this.container.scrollLeft -= _this._zoom.scrollX*x;
                             _this.container.scrollTop -= _this._zoom.scrollY*y;

                             _this._canvasContainer.x = Math.floor(_this.container.scrollLeft);
                             _this._canvasContainer.y = Math.floor(_this.container.scrollTop);
                             }
                             }*/
                        }
                        _this._tmp.pointer = real;
                    }
                }
            };
            _this._canvas.onmouseup = function (evt) {
                var real = _this._getMouse(evt);
                _this._canvas.style.cursor = 'default';
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
                _this.emit('mouse:up', new MouseEvent(real.x, real.y));
                if (_this._selected) {
                    /**
                     * Evento que encapsula la liberacion de un objeto
                     *
                     * @event object:released
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this.emit('object:released', new ObjectEvent(_this._selected));
                    _this._tmp.transform = null;
                    _this._selected.recalculateBorders();
                    _this.save();
                }
            };
            _this._canvas.onmouseenter = function () {
                _this.renderAll();
            };
            _this._canvas.onmouseleave = function () {
                _this._isDragged = false;
                _this._canvas.style.cursor = 'default';
            };
            _this._canvas.onselectstart = function () {
                return false;
            };
            /**
             * Capture the global mouse move event for
             */
            document.addEventListener('mousemove', function (evt) {
                if (_this._scrollBar.isSelected()) {
                    _this._scrollBar.dragScroll(evt.pageX - _this._tmp.globalPointer.x, evt.pageY - _this._tmp.globalPointer.y);
                    _this.renderAll();
                    _this._tmp.globalPointer = { x: evt.pageX, y: evt.pageY };
                }
            });
            document.addEventListener('mouseup', function () {
                _this._scrollBar.selected = null;
            });
        };
        Canvas.prototype.bindResizeWindow = function () {
            var resizeID = -1;
            var _this = this;
            var resizeHandler = function () {
                clearTimeout(resizeID);
                resizeID = setTimeout(function () {
                    _this.refreshScreen();
                }, 500);
            };
            window.removeEventListener('resize', resizeHandler);
            window.addEventListener('resize', resizeHandler);
        };
        /**
         * Emite un evento generado
         *
         * @memberof Loira.Canvas#
         * @param evt Nombre del evento a emitir
         * @param options Valores enviados junto al evento
         * @param fireEvent Should fire event
         */
        Canvas.prototype.emit = function (evt, options, fireEvent) {
            if (fireEvent === void 0) { fireEvent = true; }
            if (fireEvent && typeof this._callbacks[evt] !== 'undefined') {
                for (var _i = 0, _a = this._callbacks[evt]; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var respo = item.call(this, options);
                    if (respo === false) {
                        return false;
                    }
                }
            }
            return true;
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
                element = this._canvas;
                do {
                    if (element.nodeName !== 'BODY') {
                        offsetY -= element.scrollTop;
                        offsetX -= element.scrollLeft;
                    }
                } while ((element = element.parentElement));
            }
            var border = this._border;
            offsetX += border.paddingLeft;
            offsetY += border.paddingTop;
            offsetX += border.borderLeft;
            offsetY += border.borderTop;
            var response = { x: (evt.pageX - offsetX), y: (evt.pageY - offsetY) };
            response.x += this.virtualCanvas.x;
            response.y += this.virtualCanvas.y;
            return response;
        };
        Canvas.prototype.getGlobalPoint = function (x, y) {
            var element = this._canvas, offsetX = 0, offsetY = 0;
            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
                element = this._canvas;
                do {
                    if (element.nodeName !== 'BODY') {
                        offsetY -= element.scrollTop;
                        offsetX -= element.scrollLeft;
                    }
                } while ((element = element.parentElement));
            }
            var border = this._border;
            offsetX += border.paddingLeft;
            offsetY += border.paddingTop;
            offsetX += border.borderLeft;
            offsetY += border.borderTop;
            var response = { x: (x + offsetX), y: (y + offsetY) };
            response.x -= this.virtualCanvas.x;
            response.y -= this.virtualCanvas.y;
            return response;
        };
        Canvas.prototype.removeRelation = function (start, end) {
            var relations = this.getRelationsFromObject(start, false, true);
            var toDelete = [];
            for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
                var relation = relations_1[_i];
                if (relation.end == end) {
                    toDelete.push(relation);
                }
            }
            if (toDelete.length > 0) {
                this.remove(toDelete, false);
            }
        };
        /**
         * Define the background for the canvas
         *
         * @param image Image to set as background
         * @param resizeToImage Define if the canvas should resize to image size
         */
        Canvas.prototype.setBackground = function (image, resizeToImage) {
            this._background = this.createHiDPICanvas(image.width, image.height);
            this._background.style.position = 'absolute';
            this._background.style.left = '0';
            this._background.style.top = '0';
            this._background.style.zIndex = '0';
            this._background.getContext('2d').drawImage(image, 0, 0);
            this._canvas.style.backgroundColor = 'transparent';
            if (resizeToImage) {
                this.virtualCanvas.width = image.width;
                this.virtualCanvas.height = image.height;
                this._scrollBar = new Common.ScrollBar(this);
            }
            this.container.insertBefore(this._background, this._canvas);
        };
        Canvas.prototype.trigger = function (evt, selected) {
            this.emit(evt, new ObjectEvent(selected));
        };
        /**
         * Clean the background
         */
        Canvas.prototype.cleanBackground = function () {
            this.container.removeChild(this.container.firstChild);
            this._canvas.width = this.width;
            this._canvas.height = this.height;
            this.container.style.width = this.container.style.maxWidth = this.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = this.viewportHeight + 'px';
            this._canvas.style.backgroundColor = Loira.Config.background;
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
            x = x - (this.virtualCanvas.viewportWidth / 2);
            y = y - (this.virtualCanvas.viewportHeight / 2);
            this._scrollBar.setPosition(x, y);
            this.renderAll(true);
        };
        Canvas.prototype.setSelectedElement = function (element) {
            this._selected = element;
        };
        /**
         * Get context from the current canvas
         *
         * @returns {CanvasRenderingContext2D|null}
         */
        Canvas.prototype.getContext = function () {
            return this._canvas.getContext('2d');
        };
        Canvas.prototype.getImage = function (padding) {
            if (padding === void 0) { padding = 0; }
            var maxX, maxY, minX, minY, dX, dY;
            var offSetX, offSetY;
            maxX = maxY = Number.MIN_VALUE;
            minX = minY = Number.MAX_VALUE;
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element.baseType !== 'relation') {
                    if (element.x < minX) {
                        minX = element.x;
                    }
                    if (element.y < minY) {
                        minY = element.y;
                    }
                    if (element.width + element.x > maxX) {
                        maxX = element.width + element.x;
                    }
                    if (element.y + element.height > maxY) {
                        maxY = element.y + element.height;
                    }
                }
            }
            dX = maxX - minX + 10 + (padding * 2);
            dY = maxY - minY + 10 + (padding * 2);
            var virtual = this.createHiDPICanvas(dX, dY, 1);
            var ctx = virtual.getContext('2d');
            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(0, 0, dX, dY);
            offSetY = (minY - padding) - 5;
            offSetX = (minX - padding) - 5;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].baseType !== 'relation') {
                    this.items[i].x -= offSetX;
                    this.items[i].y -= offSetY;
                }
            }
            var x = this.virtualCanvas.x, y = this.virtualCanvas.y;
            for (var i = 0; i < this.items.length; i++) {
                ctx.save();
                if (this.items[i].baseType !== 'relation') {
                    this.items[i].render(ctx, x, y);
                    this.items[i].x += offSetX;
                    this.items[i].y += offSetY;
                }
                else {
                    this.items[i].render(ctx, x, y);
                }
                ctx.restore();
            }
            return virtual.toDataURL("image/png");
        };
        Canvas.prototype.getElementByPosition = function (x, y) {
            var item;
            for (var i = this.items.length - 1; i >= 0; i--) {
                item = this.items[i];
                if (item.isVisible(this.virtualCanvas) && item.checkCollision(x, y)) {
                    return item;
                }
            }
            return null;
        };
        /**
         * Draw the banner of the library and the version
         * @param ctx Context of the canvas
         */
        Canvas.drawBanner = function (ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, 114, 16);
            ctx.font = '12px Arial';
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText('loira-designer v0.5.7', 2, 12);
        };
        Canvas.prototype.showEditor = function (region, text, callback) {
            var point = this.getGlobalPoint(region.x, region.y);
            this.textEditor.style.top = point.y + 'px';
            this.textEditor.style.left = point.x + 'px';
            this.textEditor.style.display = 'block';
            this.textEditor.style.width = region.width + 'px';
            this.textEditor.style.height = region.height + 'px';
            this.textEditor.focus();
            this.textEditor.value = text;
            var scope = this;
            var listener = this.on('mouse:down', function () {
                scope.textEditor.style.display = 'none';
                callback(scope.textEditor.value);
                scope.fall('mouse:down', listener);
            });
        };
        Canvas.prototype.restore = function () {
        };
        Canvas.prototype.save = function (step) {
            if (step === void 0) { step = 1; }
        };
        return Canvas;
    }());
    Loira.Canvas = Canvas;
})(Loira || (Loira = {}));
//# sourceMappingURL=canvas.js.map
var Loira;
(function (Loira) {
    var BaseController = (function () {
        function BaseController() {
        }
        return BaseController;
    }());
    Loira.BaseController = BaseController;
})(Loira || (Loira = {}));
//# sourceMappingURL=controller.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Clase base para la creacion de nuevos objetos dibujables
 *
 * @memberof Loira
 * @namespace util
 */
var Loira;
(function (Loira) {
    var util;
    (function (util) {
        var BaseOption = (function () {
            function BaseOption() {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
                this.centerObject = false;
                this.maxOutGoingRelation = 0;
                this.extras = {};
                this.text = '';
                this.selectable = true;
                this.resizable = true;
                this.draggable = true;
            }
            return BaseOption;
        }());
        util.BaseOption = BaseOption;
        var RelOption = (function (_super) {
            __extends(RelOption, _super);
            function RelOption() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RelOption;
        }(BaseOption));
        util.RelOption = RelOption;
        var Line = (function () {
            function Line(x1, y1, x2, y2) {
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;
            }
            Line.prototype.xm = function () {
                return this.x2 - this.x1;
            };
            Line.prototype.ym = function () {
                return this.y2 - this.y1;
            };
            return Line;
        }());
        util.Line = Line;
        var Region = (function () {
            function Region() {
            }
            return Region;
        }());
        util.Region = Region;
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            return Point;
        }());
        util.Point = Point;
        var Rect = (function () {
            function Rect(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            return Rect;
        }());
        util.Rect = Rect;
        /**
         * Crea una cadena con caracteres aleatorios
         *
         * @param maxLength Longitud de la cadena
         * @returns {string}
         */
        function createRandom(maxLength) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < maxLength; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        util.createRandom = createRandom;
        function createRandomNumber(negative) {
            return Math.floor(Math.random() * 10000000);
        }
        util.createRandomNumber = createRandomNumber;
        /**
         * Determina la el punto de intereseccion entre 2 lineas
         *
         * @param line1 Linea 1
         * @param line2 Linea 2
         * @returns {*}
         */
        function intersectPointLine(line1, line2) {
            var den = ((line1.y2 - line1.y1) * (line2.x2 - line2.x1)) - ((line1.x2 - line1.x1) * (line2.y2 - line2.y1));
            if (den === 0) {
                return false;
            }
            var a = line2.y1 - line1.y1;
            var b = line2.x1 - line1.x1;
            var numerator1 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);
            a = numerator1 / den;
            return { x: line2.x1 + (a * (line2.x2 - line2.x1)), y: line2.y1 + (a * (line2.y2 - line2.y1)) };
        }
        util.intersectPointLine = intersectPointLine;
        /**
         * Instancia una clase tomando una cadena como base
         *
         * @param str Nombre de la clase, o espacio de nombre a instanciar
         * @returns {*}
         */
        function stringToFunction(str) {
            var arr = str.split(".");
            var fn = (window || this);
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var part = arr_1[_i];
                fn = fn[part];
            }
            if (typeof fn !== "function") {
                throw new Error("function not found");
            }
            return fn;
        }
        util.stringToFunction = stringToFunction;
        function removeWhole(indexes, vector) {
            indexes.sort(function (a, b) {
                return a - b;
            });
            for (var i = indexes.length - 1; i >= 0; i--) {
                vector.splice(indexes[i], 1);
            }
        }
        util.removeWhole = removeWhole;
        function logger(logLevel, message, data) {
            // let padStr = function(i){
            //     return (i < 10)? '0' + i : '' + i;
            // };
            if (Loira.Config.debug && logLevel <= Loira.Config.logLevel) {
                console.log('[Loira ' + new Date().getTime() + '] ' + message);
            }
        }
        util.logger = logger;
    })(util = Loira.util || (Loira.util = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=utils.js.map
var Loira;
(function (Loira) {
    var BaseOption = Loira.util.BaseOption;
    /**
     * Clase base para la creacion de nuevos objetos dibujables
     *
     * @memberof Loira
     * @class Element
     */
    var Element = (function () {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Loira.Element#
         * @protected
         * @param { BaseOption } options Conjunto de valores iniciales
         */
        function Element(options) {
            this._uid = Loira.util.createRandom(8);
            if (typeof options === 'undefined') {
                options = new BaseOption();
            }
            this.x = 'x' in options ? options.x : 0;
            this.y = 'y' in options ? options.y : 0;
            this.width = 'width' in options ? options.width : 0;
            this.height = 'height' in options ? options.height : 0;
            this.centerObject = 'centerObject' in options ? options.centerObject : false;
            this.maxOutGoingRelation = 'maxOutGoingRelation' in options ? options.maxOutGoingRelation : 0;
            this.extras = 'extras' in options ? options.extras : {};
            this.text = options.text ? options.text : '';
            this.selectable = options.selectable ? options.selectable : true;
            this.resizable = options.resizable ? options.resizable : true;
            this.draggable = options.draggable ? options.draggable : true;
            this._buttons = [];
            this._canvas = null;
            this.type = '';
            this.baseType = '';
            this.animation = new Animation(this);
        }
        /**
         * Renderiza el objeto
         *
         * @memberof Loira.Element#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @param { number } vX Virtual x pointer
         * @param { number } vY Virtual y pointer
         * @protected
         */
        Element.prototype.render = function (ctx, vX, vY) {
            this.animation.proccess();
        };
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        Element.prototype.checkCollision = function (x, y) {
            return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
        };
        /**
         * Agrega iconos laterales del objeto con sus respectivos escuchadores
         *
         * @memberof Loira.Object#
         * @param {Array.<Object>} args Iconos laterales a agregar
         */
        Element.prototype.on = function (args) {
            if (args) {
                args = [].splice.call(arguments, 0);
                this._buttons = args;
            }
            else {
                this._buttons = [];
            }
        };
        /**
         * Renderiza los iconos de los botones laterales
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @param { number } vX Virtual x pointer
         * @param { number } vY Virtual y pointer
         */
        Element.prototype.renderButtons = function (ctx, vX, vY) {
            var x = this.x + this.width + 10;
            var y = this.y;
            x -= vX;
            y -= vY;
            if (this._buttons.length > 0) {
                this._buttons.forEach(function (item) {
                    Loira.drawable.render(item.icon, ctx, x, y);
                    y += Loira.drawable.get(item.icon).height + 4;
                });
            }
        };
        /**
         * Ejecuta el escuchador de algun icono lateral encontrado por el punto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         * @private
         */
        Element.prototype.callCustomButton = function (x, y) {
            var _x = this.x + this.width + 10;
            var _y = this.y;
            var region;
            for (var _i = 0, _a = this._buttons; _i < _a.length; _i++) {
                var item = _a[_i];
                region = Loira.drawable.get(item.icon);
                if (_x <= x && x <= _x + region.width && _y <= y && y <= _y + region.height) {
                    item.click.call(this);
                    return true;
                }
                _y += item.icon.height + 4;
            }
            return false;
        };
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        Element.prototype.drawSelected = function (ctx) {
            var x = this.x - 2, y = this.y - 2, w = this.width, h = this.height;
            x -= this._canvas.virtualCanvas.x;
            y -= this._canvas.virtualCanvas.y;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = Loira.Config.selected.color;
            ctx.rect(x, y, w + 4, h + 4);
            ctx.stroke();
            ctx.setLineDash([]);
            if (this.resizable) {
                ctx.fillStyle = Loira.Config.selected.color;
                ctx.fillRect(x - 4, y - 4, 8, 8);
                ctx.fillRect(x + w, y + h, 8, 8);
                ctx.fillRect(x + w, y - 4, 8, 8);
                ctx.fillRect(x - 4, y + h, 8, 8);
                ctx.fillRect(x + w / 2, y - 4, 8, 8);
                ctx.fillRect(x + w / 2, y + h, 8, 8);
                ctx.fillRect(x - 4, y + h / 2, 8, 8);
                ctx.fillRect(x + w, y + h / 2, 8, 8);
            }
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = '#000000';
        };
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Loira.Object#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns
         */
        Element.prototype.getSelectedCorner = function (pX, pY) {
            if (!this.resizable) {
                return '';
            }
            var x = this.x - 2, y = this.y - 2, w = this.width, h = this.height, mw = w / 2, mh = h / 2;
            if (x - 4 <= pX && pX <= x + 4 && y - 4 <= pY && pY <= y + 4)
                return 'tl';
            if (x + w <= pX && x + w + 8 >= pX && y - 4 <= pY && y + 4 >= pY)
                return 'tr';
            if (x + w <= pX && x + w + 8 >= pX && y + h <= pY && y + h + 8 >= pY)
                return 'br';
            if (x - 4 <= pX && x + 4 >= pX && y + h <= pY && y + h + 8 >= pY)
                return 'bl';
            if (x + mw <= pX && x + mw + 8 >= pX && y - 4 <= pY && y + 4 >= pY)
                return 'tc';
            if (x + mw <= pX && x + mw + 8 >= pX && y + h <= pY && y + h + 8 >= pY)
                return 'bc';
            if (x - 4 <= pX && x + 4 >= pX && y + mh <= pY && y + mh + 8 >= pY)
                return 'ml';
            if (x + w <= pX && x + w + 8 >= pX && y + mh <= pY && y + mh + 8 >= pY)
                return 'mr';
            return '';
        };
        /**
         * Muestra el objeto si el canvas se encuentra en un contenedor
         *
         * @memberof Loira.Element#
         */
        Element.prototype.show = function () {
            this._canvas.centerToPoint((this.x + this.width / 2), (this.y + this.height / 2));
        };
        Element.prototype.attach = function (canvas) {
            this._canvas = canvas;
            this.animation.setFps(canvas.fps);
        };
        Element.prototype.isVisible = function (virtual) {
            var p1 = null, p2 = null, a1 = null, a2 = null;
            if (virtual.area > this.width * this.height) {
                p1 = { x: this.x, y: this.y };
                p2 = { x: this.x + this.width, y: this.y + this.height };
                a1 = { x: virtual.x, y: virtual.y };
                a2 = { x: virtual.x + virtual.viewportWidth, y: virtual.y + virtual.viewportHeight };
            }
            else {
                a1 = { x: this.x, y: this.y };
                a2 = { x: this.x + this.width, y: this.y + this.height };
                p1 = { x: virtual.x, y: virtual.y };
                p2 = { x: virtual.x + virtual.viewportWidth, y: virtual.y + virtual.viewportHeight };
            }
            if (p1.x > a1.x && p1.x < a2.x && p1.y > a1.y && p1.y < a2.y) {
                return true;
            }
            else if (p1.x > a1.x && p1.x < a2.x && p2.y > a1.y && p2.y < a2.y) {
                return true;
            }
            else if (p2.x > a1.x && p2.x < a2.x && p1.y > a1.y && p1.y < a2.y) {
                return true;
            }
            else if (p2.x > a1.x && p2.x < a2.x && p2.y > a1.y && p2.y < a2.y) {
                return true;
            }
            return false;
        };
        Element.prototype.animateTo = function (point, seconds) {
            if (seconds === void 0) { seconds = 1; }
            var time = this._canvas.fps * seconds;
        };
        Element.prototype.destroy = function () {
            this._canvas = null;
        };
        Element.prototype.getMenu = function (x, y) {
            return this.menu;
        };
        return Element;
    }());
    Loira.Element = Element;
})(Loira || (Loira = {}));
//# sourceMappingURL=element.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Common;
(function (Common) {
    var Point = Loira.util.Point;
    var Line = Loira.util.Line;
    var BaseOption = Loira.util.BaseOption;
    var Rect = Loira.util.Rect;
    var TypeLine;
    (function (TypeLine) {
        TypeLine[TypeLine["STRAIGHT"] = 1] = "STRAIGHT";
        TypeLine[TypeLine["CURVE"] = 2] = "CURVE";
        TypeLine[TypeLine["CARTESIAN"] = 3] = "CARTESIAN";
    })(TypeLine = Common.TypeLine || (Common.TypeLine = {}));
    var Relation = (function (_super) {
        __extends(Relation, _super);
        function Relation(options) {
            var _this = _super.call(this, options) || this;
            _this.start = options.start ? options.start : null;
            _this.end = options.end ? options.end : null;
            _this.isDashed = options.isDashed ? options.isDashed : false;
            _this.points = options.points ? options.points : [new Point(), new Point()];
            _this.icon = options.icon ? options.icon : '';
            _this.typeLine = options.typeLine ? options.typeLine : TypeLine.STRAIGHT;
            _this.baseType = 'relation';
            return _this;
        }
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @param { number } vX Virtual x pointer
         * @param { number } vY Virtual y pointer
         * @protected
         */
        Relation.prototype.render = function (ctx, vX, vY) {
            var start, end, tmp, init, last, xm, ym, line, delta = [], distance = 0;
            start = new Rect(this.start.x, this.start.y, this.start.width, this.start.height);
            end = new Rect(this.end.x, this.end.y, this.end.width, this.end.height);
            this.points[0] = { x: start.x + start.width / 2, y: start.y + start.height / 2 };
            this.points[this.points.length - 1] = { x: end.x + end.width / 2, y: end.y + end.height / 2 };
            init = this.points[0];
            last = this.points[1];
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(init.x - vX, init.y - vY);
            if (this.isDashed) {
                ctx.setLineDash([5, 5]);
            }
            for (var i = 0; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x - vX, this.points[i].y - vY);
                if (i > 0) {
                    delta[i - 1] = Math.sqrt(Math.pow((this.points[i].x - this.points[i - 1].x), 2) + Math.pow((this.points[i].y - this.points[i - 1].y), 2));
                    distance += delta[i - 1];
                }
            }
            ctx.stroke();
            ctx.setLineDash([]);
            if (this.icon) {
                init = this.points[this.points.length - 2];
                last = this.points[this.points.length - 1];
                xm = (last.x - init.x);
                ym = (last.y - init.y);
                tmp = Math.atan(ym / xm);
                if (xm < 0) {
                    tmp += Math.PI;
                }
                ctx.translate(last.x - vX, last.y - vY);
                ctx.rotate(tmp);
                line = new Line(init.x, init.y, last.x, last.y);
                var region = Loira.drawable.get(this.icon);
                var border = this.end.obtainBorderPos(line, ctx);
                Loira.drawable.render(this.icon, ctx, -(region.width + border), -Math.ceil(region.height / 2));
                ctx.rotate(-tmp);
                ctx.translate(-last.x - vX, -last.y - vY);
            }
            if (this.text || this.text.length > 0) {
                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
                var buffE = 0;
                var buffS = 0;
                var d = 0;
                /*
                 * Primero se obtiene el tamanho de la recta visible y se la divide a la mitad(c1), despues se usa como pivot
                 * el punto inicial y se usa la distancia cubierta por el elemento y se le suma la distancia visible(c1)
                 * Luego los puntos inicial y final se los trata como un triangulo rectangulo de catetos (a,b,c) y mediante
                 * interpolacion se obtiene el punto medio.
                 */
                if (this.points.length == 2) {
                    init = this.points[0];
                    last = this.points[1];
                    line = new Line(init.x, init.y, last.x, last.y);
                    buffE = this.end.obtainBorderPos(line, ctx);
                    buffS = this.start.obtainBorderPos(line, ctx);
                }
                else {
                    buffS = this.start.obtainBorderPos(new Line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y), ctx);
                    buffE = this.end.obtainBorderPos(new Line(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y), ctx);
                    d = ((distance - buffS - buffE) / 2) + buffS;
                    var i = 0;
                    while (d - delta[i] > 0) {
                        d -= delta[i];
                        i++;
                    }
                    init = this.points[i];
                    last = this.points[i + 1];
                    if (i !== 0) {
                        buffS = 0;
                    }
                    if (i !== this.points.length - 2) {
                        buffE = 0;
                    }
                }
                var a = last.x - init.x;
                var b = last.y - init.y;
                var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
                var c1 = ((this.points.length == 2) ? ((c - buffE - buffS) / 2) + buffS : d);
                var b1 = Math.floor(b / c * c1);
                var a1 = Math.floor(a / c * c1);
                tmp = ctx.measureText(this.text).width;
                ctx.fillStyle = Loira.Config.background;
                ctx.fillRect(init.x + vX + a1 - tmp / 2, init.y + vY + b1 - 13, tmp, 12);
                ctx.fillStyle = "#000000";
                ctx.fillText(this.text, init.x + vX + a1 - tmp / 2, init.y + vY + b1 - 3);
                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            }
        };
        Relation.prototype.recalculateBorders = function () {
        };
        /**
         * Actualiza los objeto de origen y objetivo de la relacion
         *
         * @memberof Common.Relation#
         * @param { Object } start Objeto origen
         * @param { Object } end Objeto objetivo
         * @chainable
         * @returns {Common.Relation}
         */
        Relation.prototype.update = function (start, end) {
            this.start = start;
            this.end = end;
            return this;
        };
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Common.Relation#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        Relation.prototype.checkCollision = function (x, y) {
            var init = null, last = null;
            var xd = 0, yd = 0;
            var point1 = { x: 0, y: 0 };
            var point2 = { x: 0, y: 0 };
            var m;
            var px = 0, py = 0;
            for (var i = 1; i < this.points.length; i++) {
                init = this.points[i - 1];
                last = this.points[i];
                point1.x = init.x;
                point1.y = init.y;
                point2.y = last.y;
                point2.x = last.x;
                if (init.x > last.x) {
                    point1.x = last.x;
                    point2.x = init.x;
                }
                if (init.y > last.y) {
                    point1.y = last.y;
                    point2.y = init.y;
                }
                if (x > point1.x - 5 && x < point2.x + 5 && y > point1.y - 5 && y < point2.y + 5) {
                    yd = Math.abs(last.y - init.y);
                    xd = Math.abs(last.x - init.x);
                    px = Math.abs(x - init.x);
                    py = Math.abs(y - init.y);
                    if (xd > yd) {
                        m = Math.abs((yd / xd) * px);
                        if ((m === 0 && (py > point1.y && py < point2.y)) || (m > py - 8 && m < py + 8)) {
                            return true;
                        }
                    }
                    else {
                        m = Math.abs((xd / yd) * py);
                        if ((m === 0 && (px > point1.x && px < point2.x)) || (m > px - 8 && m < px + 8)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        Relation.prototype.drawSelected = function (ctx) {
            ctx.beginPath();
            ctx.fillStyle = Loira.Config.selected.color;
            var x = this._canvas.virtualCanvas.x;
            var y = this._canvas.virtualCanvas.y;
            for (var i = 0; i < this.points.length; i++) {
                ctx.fillRect(this.points[i].x - 4 - x, this.points[i].y - 4 - y, 8, 8);
            }
            ctx.strokeStyle = '#000000';
        };
        Relation.prototype.addPoint = function () {
            var last = this.points[1], init = this.points[0];
            var x = Math.round((last.x - init.x) / 2) + init.x;
            var y = Math.round((last.y - init.y) / 2) + init.y;
            this.points.splice(1, 0, { x: x, y: y });
        };
        Relation.prototype.removePoint = function (index) {
            this.points.splice(index, 1);
        };
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Common.Relation#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {string}
         */
        Relation.prototype.getSelectedCorner = function (pX, pY) {
            for (var i = 1; i < this.points.length - 1; i++) {
                var x = this.points[i].x - 4, y = this.points[i].y - 4, w = x + 8, h = y + 8;
                if (pX > x && pX < w && pY > y && pY < h) {
                    return i;
                }
            }
            return false;
        };
        /**
         * Mueve un punto de la relacion
         *
         * @memberof Common.Relation#
         * @param point Indice del punto a mover
         * @param x Delta de x
         * @param y Delta de y
         */
        Relation.prototype.movePoint = function (point, x, y) {
            this.points[point].x += x;
            this.points[point].y += y;
        };
        Relation.prototype.isVisible = function (virtual) {
            return true;
        };
        Relation.prototype.getMenu = function (x, y) {
            this.selectedArea = this.getSelectedCorner(x, y);
            return this.selectedArea ? this.pointMenu || this.menu : this.menu;
        };
        return Relation;
    }(Loira.Element));
    Common.Relation = Relation;
    var Symbol = (function (_super) {
        __extends(Symbol, _super);
        function Symbol(options) {
            var _this = _super.call(this, options) || this;
            var link = _this._linkSymbol;
            _this.on({
                icon: 'arrow',
                click: link
            });
            _this.baseType = 'symbol';
            return _this;
        }
        /**
         * Evento que se ejecuta cuando se realiza una relacion entre simbolos
         *
         * @memberof Common.Symbol#
         * @protected
         */
        Symbol.prototype._linkSymbol = function () {
            var $this = this;
            var listener = this._canvas.on('mouse:down', function (evt) {
                var canvas = $this._canvas;
                var countRel = canvas.getRelationsFromObject($this, false, true).length;
                if (!$this.maxOutGoingRelation || (countRel < $this.maxOutGoingRelation)) {
                    for (var _i = 0, _a = canvas.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.baseType !== 'relation') {
                            if (item.checkCollision(evt.x, evt.y)) {
                                var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                canvas.add(new instance({}).update($this, item));
                                break;
                            }
                        }
                    }
                }
                canvas.fall('mouse:down', listener);
            });
        };
        Symbol.prototype.splitText = function (ctx, text, padding) {
            if (padding === void 0) { padding = 10; }
            var words = text.split(' ');
            var buff = '';
            var lines = [];
            for (var i = 0; i < words.length; i++) {
                if (ctx.measureText(buff + words[i]).width > this.width - padding) {
                    lines.push(buff);
                    buff = words[i] + ' ';
                }
                else {
                    buff = buff + ' ' + words[i];
                }
            }
            lines.push(buff);
            return lines;
        };
        Symbol.prototype.drawText = function (ctx, line) {
            var y, xm = (this.x - this._canvas.virtualCanvas.x) + this.width / 2, ym = (this.y - this._canvas.virtualCanvas.y) + this.height / 2, lines;
            lines = this.splitText(ctx, line);
            y = ym + 3 - ((6 * lines.length + 3 * lines.length) / 2);
            for (var i = 0; i < lines.length; i++) {
                var textW = ctx.measureText(lines[i]).width;
                ctx.fillText(lines[i], xm - textW / 2, y + 3);
                y = y + Loira.Config.fontSize + 3;
            }
        };
        return Symbol;
    }(Loira.Element));
    Common.Symbol = Symbol;
    var Actor = (function (_super) {
        __extends(Actor, _super);
        function Actor(options) {
            var _this = _super.call(this, options) || this;
            _this.text = options.text ? options.text : 'Actor1';
            _this.width = 30;
            _this.height = 85;
            _this.type = 'actor';
            return _this;
        }
        Actor.prototype.obtainBorderPos = function (points, ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var textW = ctx.measureText(this.text).width, xm = points.x2 - points.x1, ym = points.y2 - points.y1;
            if (textW > this.width) {
                this.x = this.x + this.width / 2 - textW / 2;
                this.width = textW;
            }
            var angle = Math.atan(ym / xm);
            if (xm < 0) {
                angle += Math.PI;
            }
            var result = null;
            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)) {
                result = Loira.util.intersectPointLine(points, new Line(this.x, -100, this.x, 100));
            }
            else {
                result = Loira.util.intersectPointLine(points, new Line(-100, this.y, 100, this.y));
            }
            return Math.sqrt(Math.pow((result.x - (this.x + this.width / 2)), 2) + Math.pow((result.y - (this.y + this.height / 2)), 2));
        };
        Actor.prototype.render = function (ctx, vX, vY) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width) {
                this.x = this.x + this.width / 2 - textW / 2;
                this.width = textW;
            }
            var x = this.x - vX;
            var y = this.y - vY;
            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(x, y, this.width, this.height);
            ctx.fillStyle = "#000000";
            Loira.drawable.render('actor', ctx, x + this.width / 2 - 15, y);
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#000000";
            ctx.fillText(this.text, x, y + 80);
        };
        Actor.prototype.recalculateBorders = function () {
        };
        return Actor;
    }(Common.Symbol));
    Common.Actor = Actor;
    var ScrollBar = (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(canvas) {
            var _this = _super.call(this, new BaseOption()) || this;
            _this.type = 'scrollBar';
            _this.width = canvas.virtualCanvas.viewportWidth;
            _this.height = canvas.virtualCanvas.viewportHeight;
            _this._horPos = canvas.virtualCanvas.x;
            _this._verPos = canvas.virtualCanvas.y;
            _this._horSize = Math.floor(_this.width * (_this.width / canvas.virtualCanvas.width));
            _this._verSize = Math.floor(_this.height * (_this.height / canvas.virtualCanvas.height));
            _this._virtual = canvas.virtualCanvas;
            _this._canvas = canvas;
            return _this;
        }
        ScrollBar.prototype.render = function (ctx) {
            var config = Loira.Config.scrollBar;
            if (this._virtual.width > this._virtual.viewportWidth) {
                ctx.fillStyle = config.background;
                ctx.fillRect(0, this.height - config.size, this._virtual.viewportWidth, config.size);
                ctx.fillStyle = config.color;
                ctx.fillRect(this._horPos, this.height - config.size, this._horSize, config.size);
            }
            if (this._virtual.height > this._virtual.viewportHeight) {
                ctx.fillStyle = config.background;
                ctx.fillRect(this.width - config.size, 0, config.size, this._virtual.viewportHeight);
                ctx.fillStyle = config.color;
                ctx.fillRect(this.width - config.size, this._verPos, config.size, this._verSize);
            }
            ctx.fillStyle = "#000000";
        };
        ScrollBar.prototype.recalculateBorders = function () {
        };
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        ScrollBar.prototype.checkCollision = function (x, y) {
            var virtual = this._virtual;
            var _x = x - virtual.x, _y = y - virtual.y;
            if (_x > this._horPos && _x < (this._horPos + this._horSize)
                && _y > (virtual.viewportHeight - Loira.Config.scrollBar.size) && _y < virtual.viewportHeight) {
                this.selected = 'H';
                return true;
            }
            if (_x > (virtual.viewportWidth - Loira.Config.scrollBar.size) && _x < virtual.viewportWidth
                && _y > this._verPos && _y < (this._verPos + this._verSize)) {
                this.selected = 'V';
                return true;
            }
            this.selected = null;
            return false;
        };
        ScrollBar.prototype.addMovement = function (dir, delta, inc) {
            if (inc === void 0) { inc = 30; }
            var tmp;
            var virtual = this._virtual;
            var background = this._canvas._background;
            if (dir === 'H') {
                tmp = this._horPos + delta * inc;
                if (tmp < 0) {
                    this._horPos = 0;
                }
                else if (tmp + this._horSize > virtual.viewportWidth) {
                    this._horPos = virtual.viewportWidth - this._horSize;
                }
                else {
                    this._horPos = tmp;
                }
                virtual.x = Math.floor(virtual.width * (this._horPos / virtual.viewportWidth));
                if (background) {
                    background.style.marginLeft = '-' + virtual.x + 'px';
                }
            }
            else if (dir === 'V') {
                tmp = this._verPos + delta * inc;
                if (tmp < 0) {
                    this._verPos = 0;
                }
                else if (tmp + this._verSize > virtual.viewportHeight) {
                    this._verPos = virtual.viewportHeight - this._verSize;
                }
                else {
                    this._verPos = tmp;
                }
                virtual.y = Math.floor(virtual.height * (this._verPos / virtual.viewportHeight));
                if (background) {
                    background.style.marginTop = '-' + virtual.y + 'px';
                }
            }
        };
        ScrollBar.prototype.addMovementWheel = function (dir, delta, inc) {
            if (inc === void 0) { inc = 30; }
            var tmp;
            var virtual = this._virtual;
            var background = this._canvas._background;
            var realTmp = 1;
            if (dir === 'H') {
                //realTmp =
                tmp = this._horPos + Math.round(delta * virtual.viewportWidth * (inc / virtual.width));
                if (tmp < 0) {
                    this._horPos = 0;
                }
                else if (tmp + this._horSize > virtual.viewportWidth) {
                    this._horPos = virtual.viewportWidth - this._horSize;
                }
                else {
                    this._horPos = tmp;
                }
                virtual.x = Math.floor(virtual.width * (this._horPos / virtual.viewportWidth));
                if (background) {
                    background.style.marginLeft = '-' + virtual.x + 'px';
                }
            }
            else if (dir === 'V') {
                tmp = this._verPos + Math.round(delta * virtual.viewportHeight * (inc / virtual.height));
                if (tmp < 0) {
                    this._verPos = 0;
                }
                else if (tmp + this._verSize > virtual.viewportHeight) {
                    this._verPos = virtual.viewportHeight - this._verSize;
                }
                else {
                    this._verPos = tmp;
                }
                virtual.y = Math.floor(virtual.height * (this._verPos / virtual.viewportHeight));
                if (background) {
                    background.style.marginTop = '-' + virtual.y + 'px';
                }
            }
        };
        ScrollBar.prototype.setPosition = function (x, y) {
            var virtual = this._virtual;
            var background = this._canvas._background;
            x = x < 0 ? 0 : x;
            y = y < 0 ? 0 : y;
            virtual.x = x;
            virtual.y = y;
            this._horPos = Math.floor((virtual.x * virtual.viewportWidth) / virtual.width);
            this._verPos = Math.floor((virtual.y * virtual.viewportHeight) / virtual.height);
            if (background) {
                background.style.marginTop = '-' + virtual.y + 'px';
                background.style.marginLeft = '-' + virtual.x + 'px';
            }
        };
        ScrollBar.prototype.isSelected = function () {
            return !!this.selected;
        };
        ScrollBar.prototype.dragScroll = function (x, y) {
            this.addMovement(this.selected, this.selected === 'H' ? x : y, 1);
        };
        return ScrollBar;
    }(Loira.Element));
    Common.ScrollBar = ScrollBar;
})(Common || (Common = {}));
//# sourceMappingURL=common.js.map
var Loira;
(function (Loira) {
    var _fontSize = 12;
    var _fontType = 'Arial';
    var _selected = {
        color: '#339966'
    };
    var _showBanner = true;
    var _background = '#aacccc';
    var _assetsPath = '../assets/glyphs.png';
    var _regions = {
        'actor': { x: 0, y: 30, width: 30, height: 60 },
        'spear': { x: 0, y: 0, width: 14, height: 15 },
        'spear1': { x: 0, y: 15, width: 15, height: 15 },
        'spear2': { x: 15, y: 0, width: 15, height: 15 },
        'spear3': { x: 30, y: 15, width: 15, height: 15 },
        'arrow': { x: 15, y: 15, width: 15, height: 15 },
        'start1': { x: 30, y: 15, width: 15, height: 15 },
        'end1': { x: 30, y: 30, width: 15, height: 15 },
        'start2': { x: 30, y: 45, width: 15, height: 15 },
        'end2': { x: 30, y: 60, width: 15, height: 15 }
    };
    var _scrollBar = {
        size: 10,
        color: 'rgba(255, 255, 255, 0.85)',
        background: 'rgba(0, 0, 0, 0.15)'
    };
    var _orgchart = {
        roleWidth: 150
    };
    var _workflow = {
        menu: {
            joinTo: 'Unir a...',
            deleteBtn: 'Borrar',
            property: 'Propiedades'
        }
    };
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["INFO"] = 99] = "INFO";
        LogLevel[LogLevel["SYSTEM"] = 2] = "SYSTEM";
        LogLevel[LogLevel["WARNING"] = 1] = "WARNING";
        LogLevel[LogLevel["DANGER"] = 0] = "DANGER";
    })(LogLevel = Loira.LogLevel || (Loira.LogLevel = {}));
    var Config;
    (function (Config) {
        Config.fontSize = _fontSize;
        Config.fontType = _fontType;
        Config.selected = _selected;
        Config.background = _background;
        Config.assetsPath = _assetsPath;
        Config.regions = _regions;
        Config.debug = false;
        Config.logLevel = LogLevel.SYSTEM;
        Config.scrollBar = _scrollBar;
        Config.orgChart = _orgchart;
        Config.showBanner = _showBanner;
        Config.workflow = _workflow;
    })(Config = Loira.Config || (Loira.Config = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=config.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Conjunto de relaciones comunes
 *
 * @namespace Relation
 * @license Apache-2.0
 */
var Relation;
(function (Relation) {
    /**
     * Contiene las funciones para relacion de asociacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Association = (function (_super) {
        __extends(Association, _super);
        function Association(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'association';
            return _this;
        }
        return Association;
    }(Common.Relation));
    Relation.Association = Association;
    /**
     * Contiene las funciones para relacion directa
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var DirectAssociation = (function (_super) {
        __extends(DirectAssociation, _super);
        function DirectAssociation(options) {
            var _this = this;
            options.icon = 'spear';
            _this = _super.call(this, options) || this;
            _this.type = 'direct_association';
            return _this;
        }
        return DirectAssociation;
    }(Common.Relation));
    Relation.DirectAssociation = DirectAssociation;
    /**
     * Contiene las funciones para relacion de generalizacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Generalization = (function (_super) {
        __extends(Generalization, _super);
        function Generalization(options) {
            var _this = this;
            options.icon = 'spear2';
            _this = _super.call(this, options) || this;
            _this.type = 'generalization';
            return _this;
        }
        return Generalization;
    }(Common.Relation));
    Relation.Generalization = Generalization;
    /**
     * Contiene las funciones para relacion de realizacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Realization = (function (_super) {
        __extends(Realization, _super);
        function Realization(options) {
            var _this = this;
            options.icon = 'spear2';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'realization';
            return _this;
        }
        return Realization;
    }(Common.Relation));
    Relation.Realization = Realization;
    /**
     * Contiene las funciones para relacion de dependencia
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Dependency = (function (_super) {
        __extends(Dependency, _super);
        function Dependency(options) {
            var _this = this;
            options.icon = 'spear1';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'dependency';
            return _this;
        }
        return Dependency;
    }(Common.Relation));
    Relation.Dependency = Dependency;
})(Relation || (Relation = {}));
//# sourceMappingURL=relations.js.map
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Diagrama de Caso de uso
 *
 * @namespace
 */
var UseCase;
(function (UseCase_1) {
    /**
     * Simbolo de Caso de uso
     *
     * @class
     * @memberof UseCase
     * @augments Common.Symbol
     */
    var UseCase = (function (_super) {
        __extends(UseCase, _super);
        function UseCase(options) {
            var _this = _super.call(this, options) || this;
            _this.width = 100;
            _this.height = 70;
            _this.text = options.text;
            _this.type = 'use_case';
            return _this;
        }
        UseCase.prototype.obtainBorderPos = function (points, ctx) {
            var a = this.width / 2, b = this.height / 2, xm = points.xm(), ym = points.ym();
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        UseCase.prototype.render = function (ctx, vX, vY) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            if (this.text) {
                var x = this.x - vX, y = this.y - vY;
                var kappa = .5522848, ox = (this.width / 2) * kappa, oy = (this.height / 2) * kappa, xe = x + this.width, ye = y + this.height, xm = x + this.width / 2, ym = y + this.height / 2;
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(x, ym);
                ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                ctx.stroke();
                ctx.fillStyle = "#fcf5d9";
                ctx.fill();
                ctx.fillStyle = "#000000";
                this.drawText(ctx, this.text);
            }
        };
        UseCase.prototype.recalculateBorders = function () {
        };
        return UseCase;
    }(Common.Symbol));
    UseCase_1.UseCase = UseCase;
    /**
     * Contiene las funciones para relacion de extension
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    var Extends = (function (_super) {
        __extends(Extends, _super);
        function Extends(options) {
            var _this = this;
            options.icon = 'spear1';
            options.text = '<< extends >>';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'extends';
            return _this;
        }
        return Extends;
    }(Common.Relation));
    UseCase_1.Extends = Extends;
    /**
     * Contiene las funciones para relacion de inclusion
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    var Include = (function (_super) {
        __extends(Include, _super);
        function Include(options) {
            var _this = this;
            options.icon = 'spear1';
            options.text = '<< include >>';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'include';
            return _this;
        }
        return Include;
    }(Common.Relation));
    UseCase_1.Include = Include;
})(UseCase || (UseCase = {}));
//# sourceMappingURL=usecase.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Box;
(function (Box_1) {
    var ColorOption = (function (_super) {
        __extends(ColorOption, _super);
        function ColorOption() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ColorOption;
    }(Loira.util.BaseOption));
    Box_1.ColorOption = ColorOption;
    /**
     * Class for color square
     *
     * @memberof Box
     * @class Box
     * @augments Loira.Element
     */
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(options) {
            var _this = _super.call(this, options) || this;
            _this.width = 'width' in options ? options.width : 30;
            _this.height = 'height' in options ? options.height : 30;
            _this.color = 'color' in options ? options.color : 'rgba(0,0,0,0.3)';
            _this.baseType = 'box';
            return _this;
        }
        Box.prototype.render = function (ctx, vX, vY) {
            ctx.fillStyle = this.color;
            var x = this.x - vX, y = this.y - vY;
            ctx.fillRect(x, y, this.width, this.height);
            ctx.fillText(this.text, x, y - 10);
        };
        Box.prototype.recalculateBorders = function () {
        };
        return Box;
    }(Loira.Element));
    Box_1.Box = Box;
})(Box || (Box = {}));
//# sourceMappingURL=box.js.map
var Animation = (function () {
    function Animation(element) {
        this._registers = [];
        this._element = element;
    }
    Animation.prototype.moveTo = function (x, y, seconds) {
        if (seconds === void 0) { seconds = 1; }
        var times = this._fps * seconds;
        this._isRunning = true;
    };
    Animation.prototype.setFps = function (fps) {
        this._fps = fps;
    };
    Animation.prototype.proccess = function () {
        if (this._isRunning) {
            if (this._registers.length == 0) {
                this._isRunning = false;
            }
        }
    };
    return Animation;
}());
//# sourceMappingURL=animation.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Diagrama de flujo de trabajo
 *
 * @namespace
 */
var Workflow;
(function (Workflow) {
    var BaseOption = Loira.util.BaseOption;
    var Point = Loira.util.Point;
    var Line = Loira.util.Line;
    var BaseController = Loira.BaseController;
    var EVT_OPEN_PROPERTY = 'workflow:open-property';
    var WorkflowOption = (function (_super) {
        __extends(WorkflowOption, _super);
        function WorkflowOption() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WorkflowOption;
    }(BaseOption));
    Workflow.WorkflowOption = WorkflowOption;
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.iteratorKey = 0;
            return _this;
        }
        Controller.prototype.bind = function (canvas) {
            var scope = this;
            this.canvas = canvas;
            canvas.defaultRelation = 'Workflow.Association';
            canvas.on(Loira.event.OBJECT_PRE_ADD, function (evt) {
                /*if (evt.selected.type === 'start_terminator'){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'Existe ya un inicio de flujo'});
                    return false;
                }*/
                if (evt.selected.type === 'parallel_start' ||
                    evt.selected.type === 'parallel_end' ||
                    evt.selected.type === 'mono_parallel_start' ||
                    evt.selected.type === 'mono_parallel_end') {
                    for (var _i = 0, _a = canvas.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.type == evt.selected.type && item['key'] == evt.selected.key) {
                            canvas.emit(Loira.event.ERROR_MESSAGE, { message: 'Existe un nodo con la misma llave en el diagrama.' });
                            return false;
                        }
                    }
                }
            });
            canvas.on(Loira.event.RELATION_PRE_ADD, function (evt) {
                if ((evt.selected.end.type === 'parallel_start' ||
                    evt.selected.end.type === 'mono_parallel_start') &&
                    evt.selected.type === 'returns') {
                    canvas.emit(Loira.event.ERROR_MESSAGE, { message: 'No es posible retornar a un nodo inicio de paralelismo.' });
                    return false;
                }
                if ((evt.selected.start.type === 'parallel_start' ||
                    evt.selected.start.type === 'parallel_end' ||
                    evt.selected.start.type === 'mono_parallel_start' ||
                    evt.selected.start.type === 'mono_parallel_end') &&
                    evt.selected.type === 'returns') {
                    canvas.emit(Loira.event.ERROR_MESSAGE, { message: 'No es posible retornar desde un nodo de paralelismo.' });
                    return false;
                }
                if ((evt.selected.start.type === 'mono_parallel_start') &&
                    (evt.selected.end.type !== 'process' &&
                        evt.selected.end.type !== 'decision')) {
                    canvas.emit(Loira.event.ERROR_MESSAGE, { message: 'El siguiente estado de un nodo de paralelismo monotarea debe ser decisi\u00F3n o proceso.' });
                    return false;
                }
            });
            canvas.on(Loira.event.OBJECT_ADDED, function (evt) {
                if ((evt.selected.type === 'parallel_start' || evt.selected.type === 'mono_parallel_start') && !evt.selected.label) {
                    scope.iteratorKey++;
                    evt.selected.label = scope.iteratorKey;
                }
            });
        };
        ;
        Controller.prototype.load = function (data) {
        };
        ;
        Controller.prototype.exportData = function () {
            return undefined;
        };
        ;
        Controller.prototype.defineLabelId = function () {
            var data = {};
            for (var _i = 0, _a = this.canvas.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.type === 'parallel_start' || item.type === 'mono_parallel_start') {
                    if (!data[item['key']]) {
                        data[item['key']] = item['label'];
                    }
                }
            }
            for (var _b = 0, _c = this.canvas.items; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.type === 'parallel_end' || item.type === 'mono_parallel_end') {
                    item['label'] = data[item['key']];
                }
            }
        };
        return Controller;
    }(BaseController));
    Workflow.Controller = Controller;
    var Symbol = (function (_super) {
        __extends(Symbol, _super);
        function Symbol(options) {
            var _this = _super.call(this, options) || this;
            _this.startPoint = options.startPoint ? options.startPoint : false;
            _this.endPoint = options.endPoint ? options.endPoint : false;
            var scope = _this;
            _this.menu = [
                { text: Loira.Config.workflow.menu.joinTo, callback: function () {
                        scope._linkSymbol();
                    } },
                { text: Loira.Config.workflow.menu.deleteBtn, callback: function () {
                        scope._canvas.remove([scope]);
                    } },
            ];
            return _this;
        }
        Symbol.prototype._linkSymbol = function () {
            var $this = this;
            var listener = this._canvas.on('mouse:down', function (evt) {
                var canvas = $this._canvas;
                if (!$this.maxOutGoingRelation || (canvas.getRelationsFromObject($this, false, true).length < $this.maxOutGoingRelation)) {
                    for (var _i = 0, _a = canvas.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.baseType !== 'relation' && !item['startPoint']) {
                            if (item.checkCollision(evt.x, evt.y) && !$this.endPoint) {
                                var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                var points = null;
                                if ($this._uid == item._uid) {
                                    var widthLeft = $this.x + $this.width + 30;
                                    var heightHalf = $this.y + $this.height / 2;
                                    points = [];
                                    points.push(new Point());
                                    points.push(new Point(widthLeft, heightHalf));
                                    points.push(new Point(widthLeft, $this.y - 30));
                                    points.push(new Point($this.x + $this.width / 2, $this.y - 30));
                                    points.push(new Point());
                                }
                                canvas.add(new instance({ points: points }).update($this, item));
                                break;
                            }
                        }
                    }
                }
                canvas.fall('mouse:down', listener);
            });
        };
        return Symbol;
    }(Common.Symbol));
    Workflow.Symbol = Symbol;
    /**
     * Process symbol
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    var Process = (function (_super) {
        __extends(Process, _super);
        function Process(options) {
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = options.text;
            _this.type = 'process';
            _this.borders = {
                bottomLeft: 0,
                topLeft: 0,
                topRight: 0,
                bottomRight: 0
            };
            _this.recalculateBorders();
            _this.maxOutGoingRelation = 1;
            return _this;
        }
        Process.prototype.obtainBorderPos = function (points, ctx) {
            var xm = points.x2 - points.x1, ym = points.y2 - points.y1;
            var angle = Math.atan(ym / xm);
            if (xm < 0) {
                angle += Math.PI;
            }
            var result = { x: 100, y: this.y - 10 };
            if ((angle > this.borders.bottomLeft && angle < this.borders.topLeft) || (angle > this.borders.topRight && angle < this.borders.bottomRight)) {
                result = Loira.util.intersectPointLine(points, new Line(this.x, -100, this.x, 100));
            }
            else {
                result = Loira.util.intersectPointLine(points, new Line(-100, this.y, 100, this.y));
            }
            var x = result.x - (this.x + this.width / 2);
            var axis = result.y - (this.y + this.height / 2);
            return Math.sqrt(Math.pow(x, 2) + Math.pow(axis, 2));
        };
        Process.prototype.render = function (ctx, vX, vY) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.rect(this.x - vX, this.y - vY, this.width, this.height);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
            ctx.fillStyle = "#000000";
            this.drawText(ctx, this.text);
        };
        Process.prototype.recalculateBorders = function () {
            var xm = Math.round(this.width / 2), ym = Math.round(this.height / 2);
            this.borders.bottomLeft = Math.atan(-ym / xm);
            this.borders.topLeft = Math.atan(ym / xm);
            this.borders.topRight = Math.atan(ym / -xm) + Math.PI;
            this.borders.bottomRight = Math.atan(-ym / -xm) + Math.PI;
        };
        return Process;
    }(Symbol));
    Workflow.Process = Process;
    /**
     * Base symbol for terminators of workflow
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    var Terminator = (function (_super) {
        __extends(Terminator, _super);
        function Terminator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Terminator.prototype.obtainBorderPos = function (points, ctx) {
            var xm = points.x2 - points.x1, ym = points.y2 - points.y1;
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        Terminator.prototype.render = function (ctx, vX, vY) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x - vX;
            var y = this.y - vY;
            var xw = x + this.width - 20;
            var yh = y + this.height;
            x += 20;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(x, y);
            ctx.lineTo(xw, y);
            ctx.bezierCurveTo(xw + 30, y, xw + 30, yh, xw, yh);
            ctx.lineTo(x, yh);
            ctx.bezierCurveTo(x - 30, yh, x - 30, y, x, y);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
            ctx.fillStyle = "#000000";
            this.drawText(ctx, this.text);
        };
        Terminator.prototype.recalculateBorders = function () { };
        return Terminator;
    }(Symbol));
    Workflow.Terminator = Terminator;
    var StartTerminator = (function (_super) {
        __extends(StartTerminator, _super);
        function StartTerminator(options) {
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 30;
            _this = _super.call(this, options) || this;
            _this.text = 'INICIO';
            _this.startPoint = true;
            _this.maxOutGoingRelation = 1;
            _this.resizable = false;
            _this.type = 'start_terminator';
            return _this;
        }
        return StartTerminator;
    }(Terminator));
    Workflow.StartTerminator = StartTerminator;
    var EndTerminator = (function (_super) {
        __extends(EndTerminator, _super);
        function EndTerminator(options) {
            var _this = _super.call(this, options) || this;
            _this.width = 70;
            _this.height = 30;
            _this.text = 'FIN';
            _this.endPoint = true;
            _this.type = 'end_terminator';
            _this.resizable = false;
            return _this;
        }
        return EndTerminator;
    }(Terminator));
    Workflow.EndTerminator = EndTerminator;
    /**
     * Data symbol
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    var Data = (function (_super) {
        __extends(Data, _super);
        function Data(options) {
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = options.text;
            _this.type = 'data';
            return _this;
        }
        Data.prototype.obtainBorderPos = function (points, ctx) {
            var xm = points.x2 - points.x1, ym = points.y2 - points.y1;
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        Data.prototype.render = function (ctx, vX, vY) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x - vX;
            var y = this.y - vY;
            var xw = x + this.width;
            var yh = y + this.height;
            x += 20;
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
            this.drawText(ctx, this.text);
        };
        Data.prototype.recalculateBorders = function () {
        };
        return Data;
    }(Symbol));
    Workflow.Data = Data;
    var Decision = (function (_super) {
        __extends(Decision, _super);
        function Decision(options) {
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = options.text;
            _this.type = 'decision';
            return _this;
        }
        Decision.prototype.obtainBorderPos = function (points, ctx) {
            var xm = points.x2 - points.x1, ym = points.y2 - points.y1;
            var x = this.x, y = this.y, xP = this.x + this.width / 2, yP = this.y + this.height / 2, xw = this.x + this.width, yh = this.y + this.height;
            var angle = Math.atan(yP / xm);
            var result;
            if (xm < 0) {
                angle += Math.PI;
            }
            ym = ym / Math.abs(ym);
            if (angle > 0 && angle < 1.6) {
                if (ym > 0) {
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, y));
                }
                else {
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, yh));
                }
            }
            else {
                if (ym > 0) {
                    result = Loira.util.intersectPointLine(points, new Line(xP, y, xw, yP));
                }
                else {
                    result = Loira.util.intersectPointLine(points, new Line(xP, yh, xw, yP));
                }
            }
            x = result.x - (this.x + this.width / 2);
            y = result.y - (this.y + this.height / 2);
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        };
        Decision.prototype.render = function (ctx, vX, vY) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x - vX;
            var y = this.y - vY;
            Loira.shape.drawDiamond(ctx, x, y, this.width, this.height);
            ctx.fillStyle = "#000000";
            this.drawText(ctx, this.text);
        };
        Decision.prototype.recalculateBorders = function () {
        };
        return Decision;
    }(Symbol));
    Workflow.Decision = Decision;
    /**
     * Contiene las funciones para relacion de extension
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    var Returns = (function (_super) {
        __extends(Returns, _super);
        function Returns(options) {
            var _this = this;
            options.icon = 'spear1';
            options.text = options.text || '<<returns>>';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'returns';
            var scope = _this;
            _this.menu = [
                { text: 'Partir', callback: function () {
                        scope.addPoint();
                    } },
                { text: 'Borrar', callback: function () {
                        scope._canvas.remove([scope]);
                    } }
            ];
            _this.pointMenu = [
                { text: 'Borrar punto', callback: function () {
                        scope.removePoint(scope.selectedArea);
                    } }
            ];
            return _this;
        }
        return Returns;
    }(Common.Relation));
    Workflow.Returns = Returns;
    var Association = (function (_super) {
        __extends(Association, _super);
        function Association(options) {
            var _this = this;
            options.icon = 'spear';
            _this = _super.call(this, options) || this;
            _this.type = 'workflow_association';
            var scope = _this;
            _this.menu = [
                { text: 'Partir', callback: function () {
                        scope.addPoint();
                    } },
                { text: 'Borrar', callback: function () {
                        scope._canvas.remove([scope], true);
                    } } /*,
                null,
                {text:'Propiedades', callback: function(){
                    scope._canvas.emit(EVT_OPEN_PROPERTY, new ObjectEvent(scope));
                }}*/
            ];
            _this.pointMenu = [
                { text: 'Borrar punto', callback: function () {
                        scope.removePoint(scope.selectedArea);
                    } }
            ];
            return _this;
        }
        return Association;
    }(Common.Relation));
    Workflow.Association = Association;
    var ParallelBase = (function (_super) {
        __extends(ParallelBase, _super);
        function ParallelBase(options) {
            var _this = this;
            options.width = options.width ? options.width : 30;
            options.height = options.height ? options.height : 30;
            _this = _super.call(this, options) || this;
            _this.unDefined = 'No definido';
            _this.resizable = false;
            _this.key = options.key;
            _this.label = options.labelId;
            return _this;
        }
        ParallelBase.prototype.obtainBorderPos = function (points, ctx) {
            var xm = points.x2 - points.x1, ym = points.y2 - points.y1;
            var x = this.x, y = this.y, xP = this.x + this.width / 2, yP = this.y + this.height / 2, xw = this.x + this.width, yh = this.y + this.height;
            var angle = Math.atan(yP / xm);
            var result;
            if (xm < 0) {
                angle += Math.PI;
            }
            ym = ym / Math.abs(ym);
            if (angle > 0 && angle < 1.6) {
                if (ym > 0) {
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, y));
                }
                else {
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, yh));
                }
            }
            else {
                if (ym > 0) {
                    result = Loira.util.intersectPointLine(points, new Line(xP, y, xw, yP));
                }
                else {
                    result = Loira.util.intersectPointLine(points, new Line(xP, yh, xw, yP));
                }
            }
            x = result.x - (this.x + this.width / 2);
            y = result.y - (this.y + this.height / 2);
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        };
        ParallelBase.prototype.render = function (ctx, vX, vY) {
            ctx.font = 'bold ' + Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x - vX;
            var y = this.y - vY;
            Loira.shape.drawDiamond(ctx, x, y, this.width, this.height);
            this.renderCustom(ctx, x, y);
        };
        ParallelBase.prototype.recalculateBorders = function () {
        };
        return ParallelBase;
    }(Symbol));
    Workflow.ParallelBase = ParallelBase;
    var ParallelStart = (function (_super) {
        __extends(ParallelStart, _super);
        function ParallelStart(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'parallel_start';
            _this.key = _this.key || Loira.util.createRandom(5);
            var scope = _this;
            _this.menu.push(null);
            _this.menu.push({
                text: 'Agregar punto de fin', callback: function () {
                    scope._canvas.add([new Workflow.ParallelEnd({ x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label })]);
                }
            });
            return _this;
        }
        ParallelStart.prototype.renderCustom = function (ctx, x, y) {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + 15, y + 15, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            ctx.fillStyle = '#FF0000';
            ctx.fillText(this.label || this.unDefined, x + 25, y + Loira.Config.fontSize - 5);
        };
        return ParallelStart;
    }(ParallelBase));
    Workflow.ParallelStart = ParallelStart;
    var ParallelEnd = (function (_super) {
        __extends(ParallelEnd, _super);
        function ParallelEnd(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'parallel_end';
            _this.maxOutGoingRelation = 1;
            var scope = _this;
            _this.menu.push(null);
            _this.menu.push({
                text: 'Agregar punto de inicio', callback: function () {
                    scope._canvas.add([new Workflow.ParallelStart({ x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label })]);
                }
            });
            return _this;
        }
        ParallelEnd.prototype.renderCustom = function (ctx, x, y) {
            ctx.beginPath();
            ctx.arc(x + 15, y + 15, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            ctx.fillStyle = '#FF0000';
            ctx.fillText(this.label || this.unDefined, x + 25, y + Loira.Config.fontSize - 5);
        };
        return ParallelEnd;
    }(ParallelBase));
    Workflow.ParallelEnd = ParallelEnd;
    var MonoParallelStart = (function (_super) {
        __extends(MonoParallelStart, _super);
        function MonoParallelStart(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'mono_parallel_start';
            _this.key = _this.key || Loira.util.createRandom(5);
            var scope = _this;
            _this.maxOutGoingRelation = 1;
            _this.menu.push(null);
            _this.menu.push({
                text: 'Agregar punto de fin', callback: function () {
                    scope._canvas.add([new Workflow.MonoParallelEnd({ x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label })]);
                }
            });
            return _this;
        }
        MonoParallelStart.prototype.renderCustom = function (ctx, x, y) {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.rect(x + 10, y + 10, 10, 10);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            ctx.fillStyle = '#FF0000';
            ctx.fillText(this.label || this.unDefined, x + 25, y + Loira.Config.fontSize - 5);
        };
        return MonoParallelStart;
    }(ParallelBase));
    Workflow.MonoParallelStart = MonoParallelStart;
    var MonoParallelEnd = (function (_super) {
        __extends(MonoParallelEnd, _super);
        function MonoParallelEnd(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'mono_parallel_end';
            _this.maxOutGoingRelation = 1;
            var scope = _this;
            _this.menu.push(null);
            _this.menu.push({
                text: 'Agregar punto de inicio', callback: function () {
                    scope._canvas.add([new Workflow.MonoParallelStart({ x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label })]);
                }
            });
            return _this;
        }
        MonoParallelEnd.prototype.renderCustom = function (ctx, x, y) {
            ctx.beginPath();
            ctx.rect(x + 10, y + 10, 10, 10);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            ctx.fillStyle = '#FF0000';
            ctx.fillText(this.label || this.unDefined, x + 25, y + Loira.Config.fontSize - 5);
        };
        return MonoParallelEnd;
    }(ParallelBase));
    Workflow.MonoParallelEnd = MonoParallelEnd;
})(Workflow || (Workflow = {}));
//# sourceMappingURL=workflow.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var OrgChart;
(function (OrgChart) {
    var BaseController = Loira.BaseController;
    var RelOption = Loira.util.RelOption;
    var Rect = Loira.util.Rect;
    var levelColor = ['#124FFD', '#FF4FFD', '#12003D'];
    var levelHeight;
    var RoleOption = (function (_super) {
        __extends(RoleOption, _super);
        function RoleOption() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RoleOption;
    }(Loira.util.BaseOption));
    OrgChart.RoleOption = RoleOption;
    var Group = (function () {
        function Group(role) {
            this.children = [];
            this.role = role;
            this.height = 40;
        }
        Group.prototype.recalculate = function (level) {
            if (level === void 0) { level = 0; }
            this.width = 0;
            this.level = level;
            var nextLevel = level + 1;
            if (levelHeight.length <= level) {
                levelHeight.push(this.role.height);
            }
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                child.x = this.x + this.width;
                child.recalculate(nextLevel);
                this.width += child.width;
            }
            if (this.width === 0) {
                this.width = this.role.width + 10;
            }
            this.role.x = Math.floor(this.width / 2 - this.role.width / 2) + this.x;
            if (!this.role.isDuplicate) {
                this.role.color = levelColor[level];
            }
            this.role.level = level;
            if (levelHeight[level] < this.role.height) {
                levelHeight[level] = this.role.height;
            }
        };
        Group.prototype.getAllChildren = function () {
            var children = [];
            if (this.children.length > 0) {
                for (var i = 0; i < this.children.length; i++) {
                    var records = this.children[i].getAllChildren();
                    children.push(this.children[i]);
                    for (var j = 0; j < records.length; j++) {
                        children.push(records[j]);
                    }
                }
            }
            return children;
        };
        Group.prototype.getAllParent = function () {
            var parent = [];
            var gr = this;
            while (gr.parent) {
                parent.push(gr.parent);
                gr = gr.parent;
            }
            return parent;
        };
        return Group;
    }());
    OrgChart.Group = Group;
    /**
     * Controller that manage the events for the organization chart
     */
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(colors, autoRefresh) {
            if (colors === void 0) { colors = null; }
            if (autoRefresh === void 0) { autoRefresh = true; }
            var _this = _super.call(this) || this;
            _this.roots = [];
            _this.elements = [];
            if (colors) {
                levelColor = colors;
            }
            _this.autoRefresh = autoRefresh;
            return _this;
        }
        Controller.prototype.bind = function (canvas) {
            var $this = this;
            this.canvas = canvas;
            canvas.defaultRelation = 'OrgChart.Relation';
            canvas.on('object:added', function (evt) {
                var group = new Group(evt.selected);
                $this.roots.push(group);
                $this.elements.push(group);
                if ($this.autoRefresh) {
                    $this.reorderElements();
                }
            });
            canvas.on('relation:pre-add', function (evt) {
                var relations = canvas.getRelationsFromObject(evt.selected.start, false, true);
                for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
                    var relation = relations_1[_i];
                    if (relation.end == evt.selected.end) {
                        return false;
                    }
                }
                var child = $this.getGroup(evt.selected.end, $this.elements).item;
                if (child) {
                    var listChild = child.getAllChildren();
                    listChild.push(child);
                    for (var i = 0; i < listChild.length; i++) {
                        if (listChild[i].role.id === evt.selected.start.id && listChild[i].role != evt.selected.start) {
                            return false;
                        }
                    }
                }
            });
            canvas.on('object:selected', function (evt) {
                var role = evt.selected;
                if (role.isDuplicate) {
                    canvas.centerToPoint(role.rolePrimary.x, role.rolePrimary.y);
                    canvas.setSelectedElement(role.rolePrimary);
                    setTimeout(function () {
                        canvas.trigger('object:selected', role.rolePrimary);
                    }, 300);
                }
            });
            canvas.on('relation:added', function (evt) {
                var index = $this.getGroup(evt.selected.end, $this.roots).index;
                var child = $this.getGroup(evt.selected.end, $this.elements).item;
                var item = $this.getGroup(evt.selected.start, $this.elements).item;
                if (index >= 0) {
                    $this.roots.splice(index, 1);
                    if (item.parent == child) {
                        $this.roots.push(item);
                    }
                }
                else {
                    var children = child.parent.children;
                    index = $this.getGroup(child.role, children).index;
                    children.splice(index, 1);
                    var relations = canvas.getRelationsFromObject(evt.selected.end, true, false);
                    var toDelete = [];
                    for (var _i = 0, relations_2 = relations; _i < relations_2.length; _i++) {
                        var relation = relations_2[_i];
                        if (relation.start != item.role) {
                            toDelete.push(relation);
                        }
                    }
                    if (toDelete.length > 0) {
                        canvas.remove(toDelete, false);
                    }
                }
                if (item.parent == child) {
                    item.parent = child.parent;
                    index = $this.getGroup(item.role, child.children).index;
                    child.children.splice(index, 1);
                    if (item.parent) {
                        item.parent.children.push(item);
                        var option = new RelOption();
                        option.start = item.parent.role;
                        option.end = item.role;
                        var relation = new OrgChart.Relation(option);
                        canvas.add([relation], false);
                    }
                    canvas.removeRelation(child.role, item.role);
                }
                child.parent = item;
                item.children.push(child);
                if ($this.autoRefresh) {
                    $this.reorderElements();
                    canvas.renderAll(true);
                }
            });
            canvas.on('object:removed', function (evt) {
                var relation;
                var group;
                var index;
                if (evt.selected.baseType === 'relation') {
                    relation = evt.selected;
                    group = $this.getGroup(relation.end, $this.elements).item;
                }
                else {
                    index = $this.getGroup(evt.selected, $this.elements).index;
                    group = $this.elements[index];
                    $this.elements.splice(index, 1);
                    var children = group.getAllChildren();
                    var roles = [];
                    var toDelete = [];
                    for (var i = 0; i < children.length; i++) {
                        toDelete.push($this.elements.indexOf(children[i]));
                        roles.push(children[i].role);
                    }
                    Loira.util.removeWhole(toDelete, $this.elements);
                    canvas.remove(roles, false);
                }
                if (group.parent) {
                    index = $this.getGroup(group.role, group.parent.children).index;
                    group.parent.children.splice(index, 1);
                }
                else {
                    index = $this.getGroup(group.role, $this.roots).index;
                    $this.roots.splice(index, 1);
                }
                if (relation) {
                    group.parent = null;
                    $this.roots.push(group);
                }
                if ($this.autoRefresh) {
                    $this.reorderElements();
                }
            });
        };
        Controller.prototype.load = function (data) {
            var option;
            var group;
            var optionRel;
            var elements = [];
            var relations = [];
            var readOnly = this.canvas.readOnly;
            this.canvas.readOnly = false;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var record = data_1[_i];
                option = new RoleOption();
                option.id = record.id ? record.id.toString() : '';
                option.personName = record.personName ? record.personName.toString() : null;
                option.title = record.title ? record.title.toString() : null;
                if (this.getGroupById(option.id).item) {
                    option.isDuplicate = true;
                }
                group = new Group(new Role(option));
                if (readOnly) {
                    group.role.on(null);
                }
                if (record.parent) {
                    var parent_1 = this.getGroupById(record.parent ? record.parent.toString() : '').item;
                    parent_1.children.push(group);
                    group.parent = parent_1;
                    optionRel = new RelOption();
                    optionRel.start = parent_1.role;
                    optionRel.end = group.role;
                    relations.push(new Relation(optionRel));
                }
                else {
                    this.roots.push(group);
                }
                this.elements.push(group);
                elements.push(group.role);
            }
            this.canvas.add(elements, false);
            this.canvas.add(relations, false);
            this.canvas.readOnly = readOnly;
        };
        Controller.prototype.exportData = function () {
            var data = [];
            for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                var parent_2 = element.parent;
                data.push({ id: element.role.id, level: element.role.level, parent: (parent_2 ? parent_2.role.id : null) });
            }
            return data;
        };
        Controller.prototype.reorderElements = function () {
            var x = 0;
            levelHeight = [];
            for (var _i = 0, _a = this.roots; _i < _a.length; _i++) {
                var root = _a[_i];
                root.x = x;
                root.recalculate();
                x += root.width;
            }
            levelHeight[0] += 30;
            for (var i = 1; i < levelHeight.length; i++) {
                levelHeight[i] += levelHeight[i - 1] + 30;
            }
            for (var i = 0; i < this.elements.length; i++) {
                var group = this.elements[i];
                group.role.y = (group.level === 0) ? 10 : levelHeight[group.level - 1];
            }
        };
        /**
         * Get a group by a role
         * @param role Role to search
         * @param groups List of groups to search
         * @returns {{item: Group, index: number}}
         */
        Controller.prototype.getGroup = function (role, groups) {
            if (!groups) {
                groups = this.elements;
            }
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].role == role) {
                    return { item: groups[i], index: i };
                }
            }
            return { item: null, index: -1 };
        };
        /**
         * Get a group by a role
         * @param id Role to search
         * @param groups List of groups to search
         * @returns {object}
         */
        Controller.prototype.getGroupById = function (id, groups) {
            if (!groups) {
                groups = this.elements;
            }
            id = id.trim();
            for (var i = 0; i < groups.length; i++) {
                if (id !== '' && groups[i].role.id == id) {
                    return { item: groups[i], index: i };
                }
            }
            return { item: null, index: -1 };
        };
        return Controller;
    }(BaseController));
    OrgChart.Controller = Controller;
    /**
     * Class for organization chart
     *
     * @memberof OrgChart
     * @class Role
     * @augments Loira.Element
     */
    var Role = (function (_super) {
        __extends(Role, _super);
        function Role(options) {
            var _this = _super.call(this, options) || this;
            _this.width = Loira.Config.orgChart.roleWidth;
            _this.height = 20;
            _this.parent = options.parent;
            _this.title = options.title;
            _this.resizable = false;
            _this.draggable = false;
            _this.id = options.id;
            _this.personName = options.personName ? options.personName : '';
            _this.isDuplicate = options.isDuplicate ? options.isDuplicate : false;
            _this.type = 'role';
            return _this;
        }
        Role.prototype.render = function (ctx, vX, vY) {
            _super.prototype.render.call(this, ctx, vX, vY);
            var pX = this.x - vX, pY = this.y - vY;
            var y, xm = pX + this.width / 2, height = 0;
            var personData, titleData;
            if (this.personName) {
                personData = {
                    fontSize: Loira.Config.fontSize,
                    lines: _super.prototype.splitText.call(this, ctx, this.personName)
                };
                height = (personData.fontSize + 3) * personData.lines.length + 5;
            }
            if (this.title) {
                titleData = {
                    fontSize: Loira.Config.fontSize - (personData ? 3 : 0),
                    lines: _super.prototype.splitText.call(this, ctx, this.title)
                };
                height += (titleData.fontSize + 3) * titleData.lines.length + 5;
            }
            y = pY + Loira.Config.fontSize;
            this.height = height;
            var radius = 5;
            var shadowColor;
            var shadowBlur;
            ctx.fillStyle = this.isDuplicate ? '#000000' : this.color;
            ctx.lineWidth = 4;
            if (!this.isSelected) {
                shadowColor = '#000000';
                shadowBlur = 10;
                ctx.strokeStyle = '#000000';
            }
            else {
                shadowColor = '#00c0ff';
                shadowBlur = 20;
                ctx.strokeStyle = '#00c0ff';
                this.isSelected = false;
            }
            // Blocked to Firefox because performance leaks
            if (this._canvas.userAgent != Loira.UserAgent.FIREFOX) {
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = shadowBlur;
            }
            Loira.shape.drawRoundRect(ctx, pX, pY, this.width, this.height, radius);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            if (personData) {
                for (var i = 0; i < personData.lines.length; i++) {
                    var textW = ctx.measureText(personData.lines[i]).width;
                    ctx.fillText(personData.lines[i], xm - textW / 2, y + 3);
                    y = y + titleData.fontSize + 3;
                }
                y += 5;
                ctx.font = 'bold ' + titleData.fontSize + 'px ' + Loira.Config.fontType;
            }
            if (titleData) {
                for (var i = 0; i < titleData.lines.length; i++) {
                    var textW = ctx.measureText(titleData.lines[i]).width;
                    ctx.fillText(titleData.lines[i], xm - textW / 2, y + 3);
                    y = y + titleData.fontSize + 3;
                }
            }
        };
        Role.prototype.recalculateBorders = function () {
        };
        Role.prototype.obtainBorderPos = function (points, ctx) {
            return 0;
        };
        Role.prototype.drawSelected = function (ctx) {
            this.isSelected = true;
            this.render(ctx, this._canvas.virtualCanvas.x, this._canvas.virtualCanvas.y);
        };
        Role.prototype.attach = function (canvas) {
            _super.prototype.attach.call(this, canvas);
            var ctx = canvas.getContext();
            var height = 0;
            if (this.personName) {
                height += (Loira.Config.fontSize + 3) * _super.prototype.splitText.call(this, ctx, this.personName).length + 5;
            }
            if (this.title) {
                height += (Loira.Config.fontSize + 3 - (this.personName ? 3 : 0)) * _super.prototype.splitText.call(this, ctx, this.title).length + 5;
            }
            this.height = height;
            if (canvas.readOnly) {
                this.on(null);
            }
            if (this.isDuplicate) {
                this.setDuplicate();
            }
        };
        Role.prototype.setDuplicate = function () {
            var elements = this._canvas.controller.elements;
            var cursor = this._canvas.controller.getGroup(this).item;
            var listing = cursor.getAllParent();
            var passed = true;
            for (var i = 0; i < listing.length; i++) {
                if (this.id && listing[i].role.id === this.id) {
                    this.title = ' ';
                    this.id = '';
                    passed = false;
                    break;
                }
            }
            if (passed) {
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].role !== this && elements[i].role.id == this.id.trim() && !elements[i].role.isDuplicate) {
                        this.isDuplicate = true;
                        this.on(null);
                        this.rolePrimary = elements[i].role;
                        break;
                    }
                }
            }
        };
        Role.prototype.update = function (data) {
            this.title = data.title;
            this.id = data.id.trim();
            this.setDuplicate();
        };
        return Role;
    }(Common.Symbol));
    OrgChart.Role = Role;
    /**
     * Class for relation between roles
     *
     * @memberof OrgChart
     * @class Relation
     * @augments Common.Relation
     */
    var Relation = (function (_super) {
        __extends(Relation, _super);
        function Relation(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'orgchart:relation';
            return _this;
        }
        Relation.prototype.render = function (ctx, vX, vY) {
            var start = new Rect(this.start.x - vX, this.start.y - vY, this.start.width, this.start.height), end = new Rect(this.end.x - vX, this.end.y - vY, this.end.width, this.end.height), middleLine, init;
            middleLine = end.y - 10;
            init = { x: start.x + start.width / 2, y: start.y + start.height / 2 };
            this.points[0] = init;
            this.points[1] = { x: init.x, y: middleLine };
            this.points[2] = { x: end.x + end.width / 2, y: middleLine };
            this.points[3] = { x: end.x + end.width / 2, y: end.y + end.height / 2 };
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.moveTo(init.x, init.y);
            ctx.lineJoin = 'round';
            for (var i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
        };
        return Relation;
    }(Common.Relation));
    OrgChart.Relation = Relation;
})(OrgChart || (OrgChart = {}));
//# sourceMappingURL=orgchart.js.map