/**
 * Plugin para diseño de diagramas
 * @namespace
 * @license Apache-2.0
 */
module Loira{
    import RelationEvent = Loira.event.RelationEvent;
    import ObjectEvent = Loira.event.ObjectEvent;
    import MouseEvent = Loira.event.MouseEvent;
    import Point = Loira.util.Point;

    export class CanvasContainer {
        public x: number = 0;
        public y: number = 0;
        public w: number = 0;
        public h: number = 0;
        public listener: () => boolean;
    }

    export class CanvasConfig {
        public width: number = 0;
        public height: number = 0;
        public viewportWidth: number = 0;
        public viewportHeight: number = 0;
        public fps: number;
        public dragCanvas: boolean = false;
        public controller: Loira.BaseController = null;
        public readOnly: boolean = false;
    }

    class FpsCounter {
        private _fps: number;
        private _elapsed: number;

        constructor(fps: number = 32){
            this._fps = 1000 / fps;
            this._elapsed = new Date().getTime();
        }

        passed(): boolean {
            let response: boolean = false;
            let time: number = new Date().getTime();

            if (time >= this._elapsed){
                this._elapsed = time + this._fps;
                response = true;
            }

            return response;
        }
    }

    class TmpData{
        public pointer:Point;
        public transform:string;
        public lastKey:number;
    }

    class ZoomData{
        public scrollX: number;
        public scrollY: number;
        private _scale: number;
        private _canvas: Canvas;

        constructor(canvas: Canvas){
            this._canvas = canvas;
            this._scale = 1;
            this.update(1);
        }

        update(delta:number){
            this._scale += delta / Math.abs(delta);
            if (this._scale < 9 && this._scale > 0){
                this.scrollX = Math.floor(this._canvas._config.width/20);
                this.scrollY = Math.floor(this._canvas._config.height/20);
            }
        }
    }

    export class Canvas {
        /**
         * @property {Object}  _selected - Objeto que se encuentra seleccionado
         */
        private _selected: Loira.Element = null;
        /**
         * @property {Boolean}  _isDragged - Determina si el usuario esta arrastrando un objeto
         */
        private _isDragged: boolean = false;
        /**
         * @property {Object}  _tmp - Almacena datos temporales
         */
        private _tmp: TmpData = new TmpData();
        /**
         * @property { Loira.Element[] } items - Listado de objetos que posee el canvas
         */
        public items: Loira.Element[] = [];
        /**
         * @property {HTMLCanvasElement} _canvas - Puntero al objeto de renderizado de lienzo
         */
        private _canvas: HTMLCanvasElement = null;
        /**
         * @property {HTMLCanvasElement} _background - Imagen de fondo
         */
        private _background: HTMLCanvasElement = null;
        /**
         * @property {Object} _canvasContainer - Contenedor del canvas
         */
        public _canvasContainer: CanvasContainer = null;
        /**
         * @property {String}  defaultRelation - Relacion que se usara por defecto cuando se agregue una nueva union
         */
        public defaultRelation: string = null;
        /**
         * @property {HTMLDivElement}  container - Canvas container
         */
        public container: HTMLDivElement = null;

        public _callbacks: any;

        public readOnly: boolean = false;

        private _border: any;

        public _config: CanvasConfig;

        private _fps: FpsCounter;

        private _zoom: ZoomData;

        public controller: BaseController;

        /**
         * Create a new instance of canvas
         *
         * @memberof Loira
         * @class Canvas
         * @param {object} container Id of the element container or pointer of the container
         * @param {CanvasConfig} config Canvas configurations
         */
        constructor(container: any, config?: CanvasConfig) {
            if (typeof container === 'string'){
                this.container = <HTMLDivElement> document.getElementById(container);
            } else {
                this.container = container;
            }

            if (!config){
                config = new CanvasConfig();
                config.width = this.container.parentElement.offsetWidth;
                config.height = this.container.parentElement.offsetHeight;
            }

            config.viewportWidth = config.viewportWidth || this.container.offsetWidth || this.container.parentElement.offsetWidth || config.width;
            config.viewportHeight = config.viewportHeight || this.container.offsetHeight || this.container.parentElement.offsetHeight || config.height;

            this._canvas = this.createHiDPICanvas(config.width, config.height);
            this._canvas.style.position = 'absolute';
            this._canvas.style.left = '0';
            this._canvas.style.top = '0';
            this._canvas.style.zIndex = '100';
            this._canvas.style.backgroundColor = Loira.Config.background;
            this._canvas.tabIndex = 99;

            this.container.style.width = this.container.style.maxWidth = config.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = config.viewportHeight + 'px';
            this.container.style.position = 'relative';
            this.container.style.overflow = 'auto';
            this.readOnly = config.readOnly || false;
            this._config = config;
            this._tmp.pointer = {x: 0, y: 0};

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
                }
            }

            let _this = this;
            drawable.registerMap(Config.assetsPath, Config.regions, function(){
                _this.renderAll();
            });

            this._bind();
            this._setScrollContainer();

            this._fps = new FpsCounter(config.fps);
            this._zoom = new ZoomData(this);

            this.controller = config.controller || null;
            if (this.controller){
                this.controller.bind(this);
            }
        }

        /**
         * Create a canvas with specific dpi for the screen
         * https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas/15666143#15666143
         * @param width Width of the canvas
         * @param height Height of the canvas
         * @param ratio Ratio of dpi
         * @returns {HTMLCanvasElement}
         */
        private createHiDPICanvas(width: number, height: number, ratio?: number) {
            let PIXEL_RATIO: number = (function(): number{
                let ctx: CanvasRenderingContext2D = document.createElement("canvas").getContext("2d"),
                    dpr = window.devicePixelRatio || 1,
                    bsr = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1;

                return dpr / bsr;
            })();

            if (!ratio) {
                ratio = PIXEL_RATIO;
            }
            let canvas : HTMLCanvasElement = document.createElement("canvas");
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            return canvas;
        }

        /**
         * Dibuja las relaciones y simbolos dentro del canvas
         * @memberof Loira.Canvas#
         */
        renderAll(forceRender:boolean = false) {
            if (this._fps.passed() || forceRender){
                let ctx: CanvasRenderingContext2D = this._canvas.getContext('2d');

                ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

                for (let i:number = 0; i < this.items.length; i++) {
                    ctx.save();
                    this.items[i].render(ctx);
                    ctx.restore();
                }

                if (this._selected && this._selected.selectable) {
                    ctx.save();
                    this._selected.drawSelected(ctx);
                    ctx.restore();
                    this._selected.renderButtons(ctx);
                }
            }
        }

        /**
         * Agrega uno o varios elementos al listado de objetos
         *
         * @memberof Loira.Canvas#
         * @param {Array.<Object>} args Elementos a agregar
         * @param fireEvent Should fire the events
         * @fires object:added
         */
        add(args: Loira.Element[]|Loira.Element, fireEvent: boolean = true) {
            if (this.readOnly){return;}

            let _items: Loira.Element[] = this.items;
            let _this = this;
            let relation: Common.Relation;
            let argument: Loira.Element[];

            if (Object.prototype.toString.call(args) !== '[object Array]'){
                argument = <Loira.Element[]>[args];
            } else {
                argument = <Loira.Element[]>args;
            }

            for (let item of argument){
                item.attach(_this);
                if (item.baseType === 'relation') {
                    relation = <Common.Relation>item;
                    let index:number = _items.indexOf(relation.start);
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
                    _this.emit('relation:added', new RelationEvent(relation), fireEvent);
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
                    _this.emit('container:added', new ObjectEvent(item), fireEvent);
                } else {
                    if (item.centerObject) {
                        if (_this._canvasContainer) {
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
                    _this.emit('object:added', new ObjectEvent(item), fireEvent);
                }
            }
        }

        /**
         * Elimina los objetos enviados como argumentos
         *
         * @memberof Loira.Canvas#
         * @fires object:removed
         */
        remove(args: Loira.Element[], fireEvent: boolean = true) {
            let _items:Loira.Element[] = this.items;
            let _this = this;

            for (let item of args){
                let toDelete:number[] = [];

                if (item == this._selected){
                    this._selected = null;
                }
                toDelete.push(_items.indexOf(item));

                for (let i:number = 0; i < _items.length; i++) {
                    if (_items[i].baseType === 'relation') {
                        let relation = <Common.Relation> _items[i];

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

                for (let i:number = toDelete.length - 1; i >= 0; i--) {
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
                _this.emit('object:removed', new ObjectEvent(item), fireEvent);
            }

            this.renderAll(true);

            this._selected = null;
        }

        /**
         * Elimina todos los objetos del canvas
         *
         * @memberof Loira.Canvas#
         */
        removeAll() {
            for (let i:number = 0; i < this.items.length; i++) {
                this.items[i].destroy();
            }
            this.items = [];
            this._selected = null;
        }

        /**
         * Destruye el componente
         *
         * @memberof Loira.Canvas#
         */
        destroy() {
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
            while(this.container.firstChild){
                this.container.removeChild(this.container.firstChild);
            }
        }

        /**
         * Agrega un nuevo escuchador al evento especifico
         *
         * @memberof Loira.Canvas#
         * @param { string } evt Nombre del evento que se desea capturar
         * @param { function } callback Funcion que escucha el evento
         * @returns { function } Funcion que escucha el evento
         */
        on(evt: any, callback: (evt: any) => void): (evt: any) => void {
            let name: string;

            if (typeof evt === 'string') {
                if (typeof this._callbacks[evt] === 'undefined') {
                    this._callbacks[evt] = [];
                }
                this._callbacks[evt].push(callback);
                return callback;
            } else if (typeof evt === 'object') {
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
        }

        /**
         * Unregister a event
         *
         * @param {string} evt - Event's name
         * @param {function} callback - Funcion a desregistrar
         */
        fall(evt: string, callback: (evt: any) => void) {
            let index = this._callbacks[evt].indexOf(callback);
            if (index > -1) {
                this._callbacks[evt].splice(index, 1);
            }
        }

        /**
         * Enlaza los eventos del canvas al canvas propio del diseñador
         *
         * @memberof Loira.Canvas#
         * @private
         */
        _bind() {
            let _this = this;

            let onKeyDown = function(evt, isGlobal){
                if (evt.keyCode == 18){return;}
                _this._tmp.lastKey = evt.keyCode;

                if (!isGlobal){
                    if (_this._tmp.lastKey === 46) {
                        if (_this._selected) {
                            _this.remove([_this._selected]);
                        }
                    }
                }
            };

            _this._canvas.onkeydown = function (evt) {
                if (_this.readOnly){return;}
                onKeyDown(evt, false);
            };

            document.addEventListener('keydown', function(evt){
                if (_this.readOnly){return;}
                onKeyDown(evt, true);
            });

            _this._canvas.onkeyup = function(){
                if (_this.readOnly){return;}
                _this._tmp.lastKey = null;
            };

            document.addEventListener('keyup', function(){
                if (_this.readOnly){return;}
                _this._tmp.lastKey = null;
            });

            _this._canvas.onmousewheel = function(evt){
                if (_this._tmp.lastKey == 17){
                    _this._zoom.update(evt.deltaY);
                    return false;
                }
            };

            let onDown = function (evt, isDoubleClick) {
                let real:Point = _this._getMouse(evt);
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
                } else {
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
                    } else {
                        _this._selected = null;
                        _this.emit('object:unselected', new MouseEvent(real.x, real.y));
                    }
                }

                let item:Loira.Element;
                for (let i:number = _this.items.length - 1; i >= 0; i--) {
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
                            } else {
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
                        } else {
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
                            } else {
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
                onDown(evt, false);
            };

            document.getElementsByTagName('body')[0].appendChild(function(){
                let div = document.createElement('ul');
                div.id = 'loira-context-menu';
                return div;
            }());
            _this._canvas.oncontextmenu = function(evt){
                let point: Point = _this._getMouse(evt);
                let element: Element = _this.getElementByPosition(point.x, point.y);
                if (element && element.menu){
                    let menuItem;
                    let container =document.getElementById('loira-context-menu');

                    for (let item of element.menu){
                        menuItem = document.createElement('li');
                        menuItem.innerHTML = item.item;
                        menuItem.onclick = function(){
                            item.callback();
                        };
                        container.appendChild(menuItem);
                    }

                    container.style.top = evt.screenY + 'px';
                    container.style.left = evt.screenX + 'px';

                    container.style.opacity = '1';
                }

                return false;
            };

            _this._canvas.onmousemove = function (evt) {
                if (_this.readOnly){return;}
                if (_this._isDragged) {
                    let real:Point = _this._getMouse(evt);
                    let x:number = real.x - _this._tmp.pointer.x;
                    let y:number = real.y - _this._tmp.pointer.y;

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

                            _this.renderAll();
                        } else {
                            if (_this._selected.draggable){
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
                    } else {
                        if (_this._config.dragCanvas){
                            if (_this._canvas && _this._canvasContainer) {
                                x = x === 0? x : x/Math.abs(x);
                                y =  y === 0? y : y/Math.abs(y);

                                _this.container.scrollLeft -= _this._zoom.scrollX*x;
                                _this.container.scrollTop -= _this._zoom.scrollY*y;

                                _this._canvasContainer.x = Math.floor(_this.container.scrollLeft);
                                _this._canvasContainer.y = Math.floor(_this.container.scrollTop);
                            }
                        }
                    }
                    _this._tmp.pointer = real;
                }
            };
            _this._canvas.onmouseup = function (evt) {
                if (_this.readOnly){return;}
                let real = _this._getMouse(evt);
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
                }
            };

            _this._canvas.onmouseenter = function(){
                _this.renderAll();
            };

            _this._canvas.onmouseleave =function(){
                _this._isDragged = false;
                _this._canvas.style.cursor = 'default';
            };

            _this._canvas.onselectstart = function () {
                return false;
            };
        }

        /**
         * Emite un evento generado
         *
         * @memberof Loira.Canvas#
         * @param evt Nombre del evento a emitir
         * @param options Valores enviados junto al evento
         * @param fireEvent Should fire event
         */
        public emit(evt: string, options: Loira.event.Event, fireEvent: boolean = true) {
            if (fireEvent && typeof this._callbacks[evt] !== 'undefined') {
                for (let item of this._callbacks[evt]) {
                    item.call(this, options);
                }
            }
        }

        /**
         * Obtiene la posicion del mouse relativa al canvas
         *
         * @memberof Loira.Canvas#
         * @param evt Evento de mouse
         * @returns {{x: number, y: number}} Posicion del mouse relativa
         */
        private _getMouse(evt: any): Point {
            let element: HTMLElement = <HTMLElement> this._canvas,
                offsetX: number = 0,
                offsetY: number = 0;

            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = <HTMLElement> element.offsetParent));
            }
            let border = this._border;
            offsetX += border.paddingLeft;
            offsetY += border.paddingTop;

            offsetX += border.borderLeft;
            offsetY += border.borderTop;

            let response: Point = {x: (evt.pageX - offsetX), y: (evt.pageY - offsetY)};

            if (this._canvasContainer) {
                response.x += this._canvasContainer.x;
                response.y += this._canvasContainer.y;
            }

            return response;
        }

        /**
         * Define the background for the canvas
         *
         * @param image Image to set as background
         * @param resizeToImage Define if the canvas should resize to image size
         */
        setBackground(image: HTMLImageElement, resizeToImage: boolean) {
            this._background = this.createHiDPICanvas(image.width, image.height);
            this._background.style.position = 'absolute';
            this._background.style.left = '0';
            this._background.style.top = '0';
            this._background.style.zIndex = '0';

            this._background.getContext('2d').drawImage(image, 0, 0);

            if (resizeToImage) {
                this._canvas.width = this._background.width;
                this._canvas.height = this._background.height;
                this._canvas.style.width = this._background.width + 'px';
                this._canvas.style.height = this._background.height + 'px';
                this._canvas.style.backgroundColor = 'transparent';
            }

            this.container.insertBefore(this._background, this._canvas);
        }

        trigger(evt: string, selected?: Loira.Element){
            this.emit(evt, new ObjectEvent(selected));
        }

        /**
         * Clean the background
         */
        cleanBackground() {
            this.container.removeChild(this.container.firstChild);
            this._canvas.width = this._config.width;
            this._canvas.height = this._config.height;
            this.container.style.width = this.container.style.maxWidth = this._config.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = this._config.viewportHeight + 'px';
            this._canvas.style.backgroundColor = Loira.Config.background;
        }

        /**
         * Define un elemento que contendra al canvas y servira de scroll
         */
        private _setScrollContainer() {
            let _this = this;

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
        }

        /**
         * Obtain the linked relations to a object
         *
         * @param object {Loira.Element} Objeto del que se obtendra las relaciones
         * @param onlyIncoming {boolean} Indica si solo se deben listar relaciones entrantes
         * @param onlyOutgoing {boolean} Indica si solo se deben listar relaciones salientes
         * @returns {Array}
         */
        getRelationsFromObject(object: Loira.Element, onlyIncoming: boolean, onlyOutgoing: boolean): Common.Relation[] {
            let relations = [];
            for (let item of this.items) {
                if (item.baseType === 'relation') {
                    let rel = <Common.Relation> item;
                    if (rel.start === object || rel.end === object) {
                        if (rel.start === object && onlyOutgoing) {
                            relations.push(item);
                        } else if (rel.end === object && onlyIncoming) {
                            relations.push(item);
                        } else if (!onlyIncoming && !onlyOutgoing) {
                            relations.push(item);
                        }
                    }
                }
            }

            return relations;
        }

        /**
         * Center the canvas at the given point
         *
         * @param x X position
         * @param y Y position
         */
        centerToPoint(x: number, y: number): void{
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
        }

        /**
         * Get context from the current canvas
         *
         * @returns {CanvasRenderingContext2D|null}
         */
        getContext(): CanvasRenderingContext2D {
            return this._canvas.getContext('2d');
        }

        getImage(padding: number = 0): string{
            let maxX, maxY, minX, minY, dX, dY: number;
            let offSetX, offSetY: number;

            maxX = maxY = Number.MIN_VALUE;
            minX = minY = Number.MAX_VALUE;

            for (let element of this.items){
                if (element.baseType !== 'relation'){
                    if (element.x < minX){
                        minX = element.x;
                    }
                    if (element.y < minY){
                        minY = element.y;
                    }

                    if (element.width + element.x > maxX){
                        maxX = element.width + element.x;
                    }

                    if (element.y + element.height > maxY){
                        maxY = element.y + element.height;
                    }
                }
            }

            dX = maxX - minX + 10 + (padding *2);
            dY = maxY - minY + 10 + (padding *2);

            let virtual: HTMLCanvasElement = this.createHiDPICanvas(dX, dY, 1);
            let ctx = virtual.getContext('2d');

            ctx.fillStyle = Config.background;
            ctx.fillRect(0, 0, dX, dY);

            offSetY = (minY - padding) - 5;
            offSetX = (minX - padding) - 5;

            for (let i:number = 0; i < this.items.length; i++) {
                if (this.items[i].baseType !== 'relation') {
                    this.items[i].x -= offSetX;
                    this.items[i].y -= offSetY;
                }
            }

            for (let i:number = 0; i < this.items.length; i++) {
                ctx.save();

                if (this.items[i].baseType !== 'relation') {
                    this.items[i].render(ctx);
                    this.items[i].x += offSetX;
                    this.items[i].y += offSetY;
                } else {
                    this.items[i].render(ctx);
                }
                ctx.restore();
            }
            return virtual.toDataURL("image/png");
        }

        getElementByPosition(x: number, y: number): Element {
            let item:Loira.Element;
            for (let i:number = this.items.length - 1; i >= 0; i--) {
                item = this.items[i];
                if (item.checkCollision(x, y)) {
                    return item;
                }
            }

            return null;
        }
    }
}

