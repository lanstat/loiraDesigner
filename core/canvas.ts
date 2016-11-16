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

    class CanvasContainer {
        public x: number = 0;
        public y: number = 0;
        public w: number = 0;
        public h: number = 0;
        public element: HTMLElement;
        public listener: () => boolean;
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
        private _tmp: any = {};
        /**
         * @property { array } items - Listado de objetos que posee el canvas
         */
        private items: Loira.Element[] = [];
        /**
         * @property {Object} _canvas - Puntero al objeto de renderizado de lienzo
         */
        private _canvas: HTMLCanvasElement = null;
        /**
         * @property {Image} _background - Imagen de fondo
         */
        private _background: HTMLImageElement = null;
        /**
         * @property {HtmlElement} _canvasContainer - Contenedor del canvas
         */
        private _canvasContainer: CanvasContainer = null;
        /**
         * @property {String}  defaultRelation - Relacion que se usara por defecto cuando se agregue una nueva union
         */
        public defaultRelation: string = null;

        public _callbacks: any;

        private _border: any;

        /**
         * Crea una nueva instancia de canvas
         *
         * @memberof Loira
         * @class Canvas
         * @param {object} canvas Identificador o elemento canvas
         */
        constructor(canvas: any) {
            if (typeof canvas === 'string'){
                this._canvas = <HTMLCanvasElement> document.getElementById(canvas);
            } else {
                this._canvas = canvas;
            }

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
            this._bind();
        }

        /**
         * Dibuja las relaciones y simbolos dentro del canvas
         * @memberof Loira.Canvas#
         */
        renderAll() {
            let ctx: CanvasRenderingContext2D = this._canvas.getContext('2d');

            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            if (this._background) {
                ctx.drawImage(this._background, 0, 0);
            }

            for (var i = 0; i < this.items.length; i++) {
                this.items[i]._render(ctx);
            }

            if (this._selected) {
                this._selected.drawSelected(ctx);
                this._selected._renderButtons(ctx);
            }
        }

        /**
         * Agrega uno o varios elementos al listado de objetos
         *
         * @memberof Loira.Canvas#
         * @param {Array.<Object>} args Elementos a agregar
         * @fires object:added
         * @todo verificar que las relaciones se agreguen al final sino ocurre error de indices
         */
        add(args: any) {
            if (!args.length) {
                args = [].splice.call(arguments, 0);
            }
            let _items: Loira.Element[] = this.items;
            let _this = this;

            for (let item of args){
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
                    _this._emit('relation:added', new RelationEvent(item, 'relationadded'));
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
                    _this._emit('container:added', new ObjectEvent(item, 'objectadded'));
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
                    _this._emit('object:added', new ObjectEvent(item, 'objectadded'));
                }
            }
        }

        /**
         * Elimina los objetos enviados como argumentos
         *
         * @memberof Loira.Canvas#
         * @fires object:removed
         */
        remove(args: any) {
            args = [].splice.call(arguments, 0);
            let _items = this.items;
            let _this = this;

            for (let item of args){
                var toDelete = [];

                item._canvas = null;
                toDelete.push(_items.indexOf(item));

                for (var i = 0; i < _items.length; i++) {
                    if (_items[i].baseType === 'relation') {
                        let relation = <Common.Relation> _items[i];

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
                _this._emit('object:removed', new ObjectEvent(item, 'objectremoved'));
            }

            this._selected = null;
        }

        /**
         * Elimina todos los objetos del canvas
         *
         * @memberof Loira.Canvas#
         */
        removeAll() {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i]._canvas = null;
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
                this._canvasContainer.element.removeEventListener('scroll', this._canvasContainer.listener);
            }

            this._canvasContainer = null;

            this._canvas = null;
        }

        /**
         * Agrega un nuevo escuchador al evento especifico
         *
         * @memberof Loira.Canvas#
         * @param { string } evt Nombre del evento que se desea capturar
         * @param { function } callback Funcion que escucha el evento
         * @returns { function } Funcion que escucha el evento
         */
        on(evt: any, callback: () => void): () => void {
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
         * Desregistra un evento
         *
         * @param {string} evt - Nombre del evento
         * @param {function} callback - Funcion a desregistrar
         */
        fall(evt: string, callback: () => void) {
            var index = this._callbacks[evt].indexOf(callback);
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
                    _this._emit('mouse:dblclick', new MouseEvent(real.x, real.y, 'dblclick'));
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
                    _this._emit('mouse:down', new MouseEvent(real.x, real.y, 'mousedown'));
                }

                if (_this._selected) {
                    _this._tmp.transform = _this._selected.getSelectedCorner(real.x, real.y);
                    if (_this._tmp.transform || _this._selected.callCustomButton(real.x, real.y)) {
                        return;
                    } else {
                        _this._selected = null;
                    }
                }

                var item;
                for (var i = _this.items.length - 1; i >= 0; i--) {
                    item = _this.items[i];
                    if (item.checkCollision(real.x, real.y)) {
                        _this._selected = item;
                        if (!isDoubleClick) {
                            _this._isDragged = true;
                        }

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
                                _this._emit('object:dblclick', new ObjectEvent(item, 'objectdblclick'));
                            } else {
                                /**
                                 * Evento que encapsula un click sobre un objeto
                                 *
                                 * @event object:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('object:selected', new ObjectEvent(item, 'objectselected'));
                            }
                            break;
                        } else {
                            if (isDoubleClick) {
                                /**
                                 * Evento que encapsula doble click sobre una relacion
                                 *
                                 * @event relation:dblclick
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('relation:dblclick', new ObjectEvent(item, 'relationdblclick'));
                            } else {
                                /**
                                 * Evento que encapsula un click sobre una relacion
                                 *
                                 * @event relation:select
                                 * @type { object }
                                 * @property {object} selected - Objeto seleccionado
                                 * @property {string} type - Tipo de evento
                                 */
                                _this._emit('relation:selected', new ObjectEvent(item, 'relationselected'));
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
                _this._emit('mouse:move', new MouseEvent(real.x, real.y, 'mousemove'));

                if (_this._selected) {
                    if (_this._tmp.transform) {
                        if (_this._selected.baseType !== 'relation') {
                            switch (_this._tmp.transform) {
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
                            (<Common.Relation> _this._selected).movePoint(_this._tmp.transform, real.x - _this._tmp.pointer.x, real.y - _this._tmp.pointer.y);
                        }

                        _this.renderAll();
                    } else if (_this._isDragged) {
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
                        _this._emit('object:dragging', new ObjectEvent(_this._selected, 'objectdragging'));
                        _this.renderAll();
                    }
                    _this._tmp.pointer = real;
                }
            };
            _this._canvas.onmouseup = function (evt) {
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
                _this._emit('mouse:up', new MouseEvent(real.x, real.y, 'mouseup'));
                if (_this._selected) {
                    /**
                     * Evento que encapsula la liberacion de un objeto
                     *
                     * @event object:released
                     * @type { object }
                     * @property {object} selected - Objeto seleccionado
                     * @property {string} type - Tipo de evento
                     */
                    _this._emit('object:released', new ObjectEvent(_this._selected, 'objectreleased'));
                    _this._isDragged = false;
                    _this._tmp.transform = false;
                    _this._selected.recalculateBorders();
                }
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
         */
        private _emit(evt: string, options: any) {
            if (typeof this._callbacks[evt] !== 'undefined') {
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
            this._background = image;

            if (resizeToImage) {
                this._canvas.width = image.width;
                this._canvas.height = image.height;
            }
        }

        /**
         * Define un elemento que contendra al canvas y servira de scroll
         *
         * @param container Contenedor del canvas
         */
        setScrollContainer(container: string) {
            let _this = this;

            if (_this._canvasContainer) {
                _this._canvasContainer.element.removeEventListener('scroll', _this._canvasContainer.listener);
            }

            _this._canvasContainer = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                element: document.getElementById(container),
                listener: function () {
                    _this._canvasContainer.y = _this._canvasContainer.element.scrollTop;
                    _this._canvasContainer.x = _this._canvasContainer.element.scrollLeft;
                    return true;
                }
            };

            _this._canvasContainer.w = _this._canvasContainer.element.clientWidth;
            _this._canvasContainer.h = _this._canvasContainer.element.clientHeight;
            _this._canvasContainer.element.addEventListener('scroll', _this._canvasContainer.listener);
        }

        /**
         * Obtiene las relaciones vinculadas a un objeto
         *
         * @param object {Loira.Element} Objeto del que se obtendra las relaciones
         * @param onlyIncoming {boolean} Indica si solo se deben listar relaciones entrantes
         * @param onlyOutgoing {boolean} Indica si solo se deben listar relaciones salientes
         * @returns {Array}
         */
        getRelationsFromObject(object: Loira.Element, onlyIncoming: boolean, onlyOutgoing: boolean): Common.Relation[] {
            let relations = [];
            for (let item of this.items) {
                if (item.baseType == 'relation') {
                    let rel = <Common.Relation> item;
                    if (rel.start == object || rel.end == object) {
                        if (rel.start == object && onlyOutgoing) {
                            relations.push(item);
                        } else if (rel.end == object && onlyIncoming) {
                            relations.push(item);
                        } else if (!onlyIncoming && !onlyOutgoing) {
                            relations.push(item);
                        }
                    }
                }
            }

            return relations;
        }
    }
}
