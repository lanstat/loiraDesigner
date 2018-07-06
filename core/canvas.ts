/**
 * Plugin para diseño de diagramas
 * @namespace
 * @license Apache-2.0
 */
module Loira{
    import RelationEvent = Loira.event.RelationEvent;
    import ObjectEvent = Loira.event.ObjectEvent;
    import Point = Loira.util.Point;
    import Region = Loira.util.Region;

    export class VirtualCanvas {
        public x: number = 0;
        public y: number = 0;
        public width: number = 0;
        public height: number = 0;
        public viewportWidth: number = 0;
        public viewportHeight: number = 0;
        public area: number = 0;
    }

    export class CanvasConfig {
        public width: number = 0;
        public height: number = 0;
        public viewportWidth: number = 0;
        public viewportHeight: number = 0;
        public dragCanvas: boolean = false;
        public controller: Loira.BaseController = null;
        public readOnly: boolean = false;
    }

    export enum UserAgent {
        FIREFOX = 1,
        IE = 2,
        CHROME = 3,
        UNKNOWN = 4
    }

    class TmpData{
        public pointer:Point;
        public transform:string;
        public globalPointer: Point;
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
                this.scrollX = Math.floor(this._canvas.width/20);
                this.scrollY = Math.floor(this._canvas.height/20);
            }
        }
    }

    function checkUserAgent(): UserAgent{
        let agent;
        if (/firefox/i.test(navigator.userAgent)){
            agent = UserAgent.FIREFOX;
        } else {
            agent = UserAgent.UNKNOWN
        }

        util.logger(LogLevel.SYSTEM, navigator.userAgent);
        return agent;
    }

    export class Canvas {
        /**
         * @property {Object}  _selected - Objeto que se encuentra seleccionado
         */
        private _selected: Loira.Element[] = [];
        public get selected(): Loira.Element[] {
            return this._selected;
        }

        /**
         * @property {Object}  _tmp - Almacena datos temporales
         */
        public _tmp: TmpData = new TmpData();
        
        /**
         * @property { Loira.Element[] } items - Listado de objetos que posee el canvas
         */
        public items: Loira.Element[] = [];

        /**
         * @property {HTMLCanvasElement} _canvas - Puntero al objeto de renderizado de lienzo
         */
        public _canvas: HTMLCanvasElement = null;

        /**
         * @property {HTMLCanvasElement} _background - Imagen de fondo
         */
        public _background: HTMLCanvasElement = null;

        public _scrollBar: Common.ScrollBar;

        /**
         * @property {VirtualCanvas} virtualCanvas - Virtual canvas that contains all information of the size
         */
        public virtualCanvas: VirtualCanvas = null;

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

        public _zoom: ZoomData;

        public controller: BaseController;

        public userAgent: UserAgent;

        public width: number;

        public height: number;

        public viewportWidth: number;

        public viewportHeight: number;

        public dragCanvas: boolean;

        public contextMenu: HTMLUListElement;

        public tooltip: HTMLDivElement;

        private textEditor: HTMLTextAreaElement;

        public keyboard: Keyboard;

        public mouse: Mouse;

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

            this.readOnly = config.readOnly || false;
            this._tmp.pointer = {x: 0, y: 0};

            this._callbacks = {};
            this.items = [];

            this.width = config.width;
            this.height = config.height;
            this.viewportHeight = config.viewportHeight;
            this.viewportWidth = config.viewportWidth;
            this.dragCanvas = config.dragCanvas;

            this.defaultRelation = 'Relation.Association';

            this.keyboard = new Keyboard(this);
            this.mouse = new Mouse(this);

            this.refreshScreen();

            drawable.registerMap(Config.assetsPath, Config.regions, function(){
            });

            this._zoom = new ZoomData(this);

            this.controller = config.controller || null;
            if (this.controller){
                this.controller.bind(this);
            }

            this.userAgent = checkUserAgent();
            this.bindResizeWindow();

            this.initializeRefresher();
            this.createHtmlElements();
        }

        public iterateSelected(callback: (selected: Loira.Element) => void ): void {
            if (this._selected.length > 0) {
                for (let selected of this._selected){
                    callback(selected);
                }
            }
        }

        public clearSelected(element: Loira.Element = null): void {
            if (element){
                for (let iter: number = 0; iter < this._selected.length; iter++){
                    if (this._selected[iter]._uid === element._uid){
                        this._selected[iter].isSelected = false;
                        this._selected.splice(iter, 1);

                        break;
                    }
                }
            } else {
                for (let item of this._selected){
                    item.isSelected = false;
                }

                this._selected = [];
            }
        }

        public appendSelected(args: Loira.Element|Loira.Element[], replace: boolean = false): void {
            let argument: Loira.Element[] = null;
            if (Object.prototype.toString.call(args) !== '[object Array]'){
                argument = <Loira.Element[]>[args];
            } else {
                argument = <Loira.Element[]>args;
            }

            if (replace) {
                this.clearSelected();
            }

            for (let item of argument){
                if (!item.isSelected) {
                    item.isSelected = true;
                    this._selected.push(item);
                }
            }
        }

        refreshScreen() {
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
                }
            }

            this.bind();

            this._scrollBar = new Common.ScrollBar(this);
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
                    bsr = ctx['webkitBackingStorePixelRatio'] ||
                        ctx['mozBackingStorePixelRatio'] ||
                        ctx['msBackingStorePixelRatio'] ||
                        ctx['oBackingStorePixelRatio'] ||
                        ctx['backingStorePixelRatio'] || 1;

                dpr = dpr < 1? 1: dpr;

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

        updater(): void{
            util.logger(LogLevel.INFO, 'Draw');
            let _this = this;
            let showResizable: boolean = this._selected.length == 1;

            let ctx: CanvasRenderingContext2D = this._canvas.getContext('2d');

            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            for (let i:number = 0; i < this.items.length; i++) {
                if (this.items[i].isVisible(this.virtualCanvas)){
                    ctx.save();
                    this.items[i].render(ctx, this.virtualCanvas.x, this.virtualCanvas.y);
                    ctx.restore();
                }
            }

            this.iterateSelected(function (selected: Loira.Element) {
                if (!selected.selectable) { return }


                util.logger(LogLevel.INFO, 'Selected');
                ctx.save();
                selected.drawSelected(ctx, showResizable);
                ctx.restore();
                selected.renderButtons(ctx, _this.virtualCanvas.x, _this.virtualCanvas.y);
            });

            this._scrollBar.render(ctx);

            if (Loira.Config.showBanner){
                Loira.Canvas.drawBanner(ctx);
            }
        }

        /**
         * Dibuja las relaciones y simbolos dentro del canvas
         * @memberof Loira.Canvas#
         */
        renderAll(forceRender:boolean = false) {
            
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

                    if (!_this.emit(Loira.event.RELATION_PRE_ADD, new RelationEvent(relation))){ return; }

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
                    _this.emit(Loira.event.RELATION_ADDED, new RelationEvent(relation), fireEvent);
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
                    if (!_this.emit('object:pre-add', new ObjectEvent(item))){ return; }

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
                _this.emit(Loira.event.OBJECT_REMOVED, new ObjectEvent(item), fireEvent);
            }

            this.clearSelected();
        }

        removeSelected(fireEvent: boolean = true){
            this.remove(this._selected, fireEvent);
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
            this.clearSelected();
        }

        /**
         * Destruye el componente
         *
         * @memberof Loira.Canvas#
         */
        destroy() {
            if (this._canvas){
                this._canvas.onmousemove = null;
                this._canvas.onkeydown = null;
                this._canvas.onmousedown = null;
                this._canvas.onmouseup = null;
                this._canvas.ondblclick = null;
                this._canvas.onselectstart = null;
            }

            if (this.contextMenu){
                this.contextMenu.remove();
                this.contextMenu = null;
            }

            if (this.textEditor){
                this.textEditor.remove();
                this.textEditor = null;
            }

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

        private createHtmlElements(){
            this.contextMenu = document.createElement('ul');
            this.contextMenu.className = 'loira-context-menu';
            this.contextMenu.oncontextmenu = function(){return false;};
            document.getElementsByTagName('body')[0].appendChild(this.contextMenu);

            this.textEditor = document.createElement('textarea');
            this.textEditor.className = 'loira-text-editor';
            document.getElementsByTagName('body')[0].appendChild(this.textEditor);

            this.tooltip = document.createElement('div');
            this.tooltip.className = 'loira-tooltip';
            document.getElementsByTagName('body')[0].appendChild(this.tooltip);
        }

        /**
         * Enlaza los eventos del canvas al canvas propio del diseñador
         *
         * @memberof Loira.Canvas#
         * @private
         */
        private bind() {
            this.keyboard.bind();
            this.mouse.bind();

            this._canvas.onselectstart = function () {
                return false;
            };
        }

        private bindResizeWindow(){
            let resizeID: number = -1;
            let _this = this;

            let resizeHandler = function(){
                clearTimeout(resizeID);
                resizeID = setTimeout(function (){
                    _this.refreshScreen();
                }, 500);
            };

            window.removeEventListener('resize', resizeHandler);
            window.addEventListener('resize', resizeHandler);
        }

        /**
         * Emite un evento generado
         *
         * @memberof Loira.Canvas#
         * @param evt Nombre del evento a emitir
         * @param options Valores enviados junto al evento
         * @param fireEvent Should fire event
         */
        public emit(evt: string, options: Loira.event.Event, fireEvent: boolean = true): boolean {
            if (fireEvent && typeof this._callbacks[evt] !== 'undefined') {
                for (let item of this._callbacks[evt]) {
                    let respo = item.call(this, options);
                    if (respo === false){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * Obtiene la posicion del mouse relativa al canvas
         *
         * @memberof Loira.Canvas#
         * @param evt Evento de mouse
         * @returns {{x: number, y: number}} Posicion del mouse relativa
         */
        public _getMouse(evt: any): Point {
            let element: HTMLElement = <HTMLElement> this._canvas,
                offsetX: number = 0,
                offsetY: number = 0;

            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = <HTMLElement> element.offsetParent));

                element = <HTMLElement> this._canvas;
                do {
                    if (element.nodeName !== 'BODY'){
                        offsetY -= element.scrollTop;
                        offsetX -= element.scrollLeft;
                    }
                } while ((element = element.parentElement));
            }
            let border = this._border;
            offsetX += border.paddingLeft;
            offsetY += border.paddingTop;

            offsetX += border.borderLeft;
            offsetY += border.borderTop;

            let response: Point = {x: (evt.pageX - offsetX), y: (evt.pageY - offsetY)};

            response.x += this.virtualCanvas.x;
            response.y += this.virtualCanvas.y;

            return response;
        }

        private getGlobalPoint(x: number, y: number): Point {
            let element: HTMLElement = <HTMLElement> this._canvas,
                offsetX: number = 0,
                offsetY: number = 0;

            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = <HTMLElement> element.offsetParent));
                element = <HTMLElement> this._canvas;
                do {
                    if (element.nodeName !== 'BODY'){
                        offsetY -= element.scrollTop;
                        offsetX -= element.scrollLeft;
                    }
                } while ((element = element.parentElement));
            }
            let border = this._border;
            offsetX += border.paddingLeft;
            offsetY += border.paddingTop;

            offsetX += border.borderLeft;
            offsetY += border.borderTop;

            let response: Point = {x: (x + offsetX), y: (y + offsetY)};

            response.x -= this.virtualCanvas.x;
            response.y -= this.virtualCanvas.y;

            return response;
        }

        removeRelation(start: Loira.Element, end: Loira.Element){
            let relations: Common.Relation[] = this.getRelationsFromObject(start, false, true);
            let toDelete: Common.Relation[] = [];

            for (let relation of relations){
                if (relation.end == end){
                    toDelete.push(relation);
                }
            }

            if (toDelete.length > 0){
                this.remove(toDelete, false);
            }
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
            this._canvas.style.backgroundColor = 'transparent';

            if (resizeToImage) {
                this.virtualCanvas.width = image.width;
                this.virtualCanvas.height = image.height;

                this._scrollBar = new Common.ScrollBar(this);
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
            this._canvas.width = this.width;
            this._canvas.height = this.height;
            this.container.style.width = this.container.style.maxWidth = this.viewportWidth + 'px';
            this.container.style.height = this.container.style.maxHeight = this.viewportHeight + 'px';
            this._canvas.style.backgroundColor = Loira.Config.background;
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
            x = x - (this.virtualCanvas.viewportWidth / 2);
            y = y - (this.virtualCanvas.viewportHeight / 2);

            this._scrollBar.setPosition(x, y);
        }

        setSelectedElement(element: Element){
            this.appendSelected(element, true);
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
            let localItems: Loira.Element[] = this.items.slice(0);

            maxX = maxY = Number.MIN_VALUE;
            minX = minY = Number.MAX_VALUE;

            for (let element of localItems){
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

            for (let i:number = 0; i < localItems.length; i++) {
                ctx.save();

                localItems[i].render(ctx, offSetX, offSetY);

                ctx.restore();
            }
            return virtual.toDataURL("image/png");
        }

        getElementByPosition(x: number, y: number): Element {
            let item:Loira.Element;
            for (let i:number = this.items.length - 1; i >= 0; i--) {
                item = this.items[i];
                if (item.isVisible(this.virtualCanvas) && item.checkCollision(x, y)) {
                    return item;
                }
            }

            return null;
        }

        /**
         * Draw the banner of the library and the version
         * @param ctx Context of the canvas
         */
        static drawBanner(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, 114, 16);

            ctx.font = '12px Arial';
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText('loira-designer v0.5.7', 2, 12);
        }

        showEditor(region: Region, text: string, callback: (text: string)=> void){
            let point: Point = this.getGlobalPoint(region.x, region.y);

            this.textEditor.style.top = point.y + 'px';
            this.textEditor.style.left = point.x + 'px';
            this.textEditor.style.display = 'block';
            this.textEditor.style.width = region.width + 'px';
            this.textEditor.style.height = region.height + 'px';
            this.textEditor.focus();

            this.textEditor.value = text;
            let scope = this;

            let listener = this.on('mouse:down', function(){
                scope.textEditor.style.display = 'none';
                callback(scope.textEditor.value);
                scope.fall('mouse:down', listener);
            });
        }

        private restore(): void {

        }

        private save(step: number = 1): void {

        }

        public getSelected(): Loira.Element[] {
            return this._selected;
        }

        /**
         * Initialize the refresh screen loop
         */
        private initializeRefresher(): void {
            let animationFrame = (function(){
                return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window['mozRequestAnimationFrame'] ||
                        function(callback){
                            window.setTimeout(callback, 1000/60);
                        };
            })();

            let _this = this;

            let start = function(){
                _this.updater();
                animationFrame(start);
            }

            start();
        }
    }
}

