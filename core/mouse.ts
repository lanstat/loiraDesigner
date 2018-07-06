module Loira{
    import Key = Loira.util.Key;
    import MouseEvent = Loira.event.MouseEvent;
    import ObjectEvent = Loira.event.ObjectEvent;
    import Point = Loira.util.Point;

    export class Mouse{
        /**
         * @property {Boolean}  isDragged - Determina si el usuario esta arrastrando un objeto
         */
        public isDragged: boolean = false;

        private stopTimeout: any;

        constructor(private canvas: Canvas){}

        bind(){
            let _this = this;

            this.canvas._canvas.onmousewheel = function(evt){
                _this.canvas.tooltip.style.display = 'none';
                _this.onWheel(evt);
            };

            this.canvas._canvas.onmousedown = function(evt){
                _this.onDown(evt);
            };

            this.canvas._canvas.onmousemove = function(evt){
                _this.onMove(evt);
            };

            this.canvas._canvas.onmouseup = function(evt){
                _this.onUp(evt);
            };

            this.canvas._canvas.onmouseleave = function(evt){
                _this.onLeave();
            };

            this.canvas._canvas.oncontextmenu = function(evt){
                _this.onContextMenu(evt);
                return false;
            }

            /**
             * Capture the global mouse move event for
             */
            document.addEventListener('mousemove', function(evt){
                _this.canvas.tooltip.style.display = 'none';
                _this.onMoveGlobal(evt);
            });

            document.addEventListener('mouseup', function(evt){
                _this.onUpGlobal();
            });
        }

        private onDownLocal(evt, isDoubleClick) {
            let canvas = this.canvas;
            let real:Point = canvas._getMouse(evt);
            canvas._tmp.pointer = real;

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
                canvas.emit('mouse:dblclick', new MouseEvent(real.x, real.y));
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
                canvas.emit('mouse:down', new MouseEvent(real.x, real.y));
            }

            if (!isDoubleClick && !canvas.readOnly) {
                this.isDragged = true;
                canvas._canvas.style.cursor = 'move';
            }

            if (canvas._scrollBar.checkCollision(real.x, real.y)){
                canvas._tmp.globalPointer = {x: evt.pageX, y: evt.pageY};
                this.isDragged = true;
                return;
            }

            if (canvas.selected.length == 1 && !canvas.readOnly) {
                let selected = canvas.selected[0];
                canvas._tmp.transform = selected.getSelectedCorner(real.x, real.y);
                if (canvas._tmp.transform || selected.callCustomButton(real.x, real.y)) {
                    switch (canvas._tmp.transform) {
                        case 'tc':
                        case 'bc':
                            canvas._canvas.style.cursor = 'ns-resize';
                            break;
                        case 'ml':
                        case 'mr':
                            canvas._canvas.style.cursor = 'ew-resize';
                            break;
                    }
                    return;
                } else {
                    if (canvas.keyboard.lastKey !== Key.SHIFT){
                        canvas.clearSelected();
                        canvas.emit('object:unselected', new MouseEvent(real.x, real.y));
                    }
                }
            }

            let item:Loira.Element;
            let atLeastOneSelected = false;
            for (let i:number = canvas.items.length - 1; i >= 0; i--) {
                item = canvas.items[i];
                if (item.checkCollision(real.x, real.y)) {
                    atLeastOneSelected = true;
                    if (item.isSelected){
                        if (canvas.keyboard.lastKey === Key.SHIFT){
                            canvas.clearSelected(item);
                            canvas.emit('object:unselected', new ObjectEvent(item));
                        }
                        break;
                    }

                    canvas.appendSelected(item, canvas.keyboard.lastKey !== Key.SHIFT);

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
                            canvas.emit('object:dblclick', new ObjectEvent(item));
                        } else {
                            util.logger(LogLevel.INFO, 'down');
                            /**
                             * Evento que encapsula un click sobre un objeto
                             *
                             * @event object:select
                             * @type { object }
                             * @property {object} selected - Objeto seleccionado
                             * @property {string} type - Tipo de evento
                             */
                            canvas.emit('object:selected', new ObjectEvent(item));
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
                            canvas.emit('relation:dblclick', new ObjectEvent(item));
                        } else {
                            /**
                             * Evento que encapsula un click sobre una relacion
                             *
                             * @event relation:select
                             * @type { object }
                             * @property {object} selected - Objeto seleccionado
                             * @property {string} type - Tipo de evento
                             */
                            canvas.emit('relation:selected', new ObjectEvent(item));
                        }
                        break;
                    }
                }
            }

            if (!atLeastOneSelected){
                canvas.clearSelected();
                canvas.emit('object:unselected', new ObjectEvent(null));
            }
        };

        private onDown(evt){
            util.logger(LogLevel.INFO,'Mouse');
            this.canvas.contextMenu.style.display = 'none';
            this.onDownLocal(evt, false);
        };

        private onMove(evt){
            let canvas = this.canvas;
            let _this = this;

            clearTimeout(this.stopTimeout);
            this.stopTimeout = setTimeout(function(){
                _this.onStop(evt);
            }, 500);

            if (this.canvas.readOnly && !this.canvas._scrollBar.isSelectable()){return;}
            if (this.isDragged) {
                let real:Point = canvas._getMouse(evt);
                let x:number = real.x - canvas._tmp.pointer.x;
                let y:number = real.y - canvas._tmp.pointer.y;

                if (!canvas._scrollBar.isSelectable()){
                    /**
                     * Evento que encapsula el movimiento del mouse sobre el canvas
                     *
                     * @event mouse:move
                     * @type { object }
                     * @property {int} x - Posicion x del puntero
                     * @property {int} y - Posicion y del puntero
                     * @property {string} type - Tipo de evento
                     */
                    canvas.emit('mouse:move', new MouseEvent(real.x, real.y));
                    if (canvas.selected) {
                        if (canvas._tmp.transform) {
                            if (canvas.selected[0].baseType !== 'relation') {
                                x = Math.floor(x);
                                y = Math.floor(y);
                                switch (canvas._tmp.transform) {
                                    case 'tc':
                                        canvas.selected[0].y += y;
                                        canvas.selected[0].height -= y;
                                        break;
                                    case 'bc':
                                        canvas.selected[0].height += y;
                                        break;
                                    case 'ml':
                                        canvas.selected[0].x += x;
                                        canvas.selected[0].width -= x;
                                        break;
                                    case 'mr':
                                        canvas.selected[0].width += x;
                                        break;
                                }
                            } else {
                                (<Common.Relation>canvas.selected[0]).movePoint(parseInt(canvas._tmp.transform), x, y);
                            }
                        } else {
                            canvas.iterateSelected(function(selected: Loira.Element){
                                if (selected.draggable){
                                    selected.x += x;
                                    selected.y += y;

                                    /**
                                     * Evento que encapsula el arrastre de un objeto
                                     *
                                     * @event object:dragging
                                     * @type { object }
                                     * @property {object} selected - Objeto seleccionado
                                     * @property {string} type - Tipo de evento
                                     */
                                    canvas.emit('object:dragging', new ObjectEvent(selected));
                                }
                            })
                        }
                    } else {
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
                    canvas._tmp.pointer = real;
                }
            }
        };

        private onUp(evt){
            let real = this.canvas._getMouse(evt);
            this.canvas._canvas.style.cursor = 'default';
            this.isDragged = false;

            /**
             * Evento que encapsula la liberacion del mouse sobre el canvas
             *
             * @event mouse:up
             * @type { object }
             * @property {int} x - Posicion x del puntero
             * @property {int} y - Posicion y del puntero
             * @property {string} type - Tipo de evento
             */
            this.canvas.emit('mouse:up', new MouseEvent(real.x, real.y));

            let _canvas = this.canvas;

            this.canvas.iterateSelected(function(selected: Loira.Element){
                /**
                 * Evento que encapsula la liberacion de un objeto
                 *
                 * @event object:released
                 * @type { object }
                 * @property {object} selected - Objeto seleccionado
                 * @property {string} type - Tipo de evento
                 */
                _canvas.emit('object:released', new ObjectEvent(selected));
                _canvas._tmp.transform = null;
                selected.recalculateBorders();
            });
        };

        private onLeave(){
            this.isDragged = false;
            this.canvas._canvas.style.cursor = 'default';
        }

        private onWheel(evt){
            if (evt.ctrlKey){
                this.canvas._zoom.update(evt.deltaY);
            }else {
                this.canvas._scrollBar.addMovementWheel(evt.shiftKey, (evt.deltaY/Math.abs(evt.deltaY)));
            }

            return false;
        }

        private onMoveGlobal(evt){
            if (this.canvas._scrollBar.isSelectable()){
                this.canvas._scrollBar.dragScroll(evt.pageX - this.canvas._tmp.globalPointer.x, evt.pageY - this.canvas._tmp.globalPointer.y);

                this.canvas._tmp.globalPointer = {x: evt.pageX, y: evt.pageY};
            }
        }

        private onUpGlobal(){
            this.canvas._scrollBar.selected = null;
        }

        private onStop(evt){
            let point: Point = this.canvas._getMouse(evt);
            let element = this.canvas.getElementByPosition(point.x, point.y);
            let canvas = this.canvas;
            
            if (element){
                let tmp = element.getTooltip(point.x, point.y);

                if (typeof tmp === 'string'){
                    canvas.tooltip.innerHTML = tmp;
                } else {
                    canvas.tooltip.appendChild(tmp);
                }

                canvas.tooltip.style.top = (evt.clientY + 30) + 'px';
                canvas.tooltip.style.left = evt.clientX + 'px';
                canvas.tooltip.style.display = 'block';

                canvas.tooltip.style.opacity = '1';
            }
        }

        private onContextMenu(evt){
            let canvas = this.canvas;

            canvas.contextMenu.style.display = 'none';
            let point: Point = canvas._getMouse(evt);
            let element: Element = canvas.getElementByPosition(point.x, point.y);

            if (element){
                let menu: MenuItem[] = element.getMenu(point.x, point.y);
                if (!menu){
                    return false;
                }
                let menuItem;
                canvas.contextMenu.innerHTML = '';

                for (let item of menu){
                    menuItem = document.createElement('li');
                    if (item){
                        menuItem.innerHTML = item.text;
                        menuItem.onclick = function(){
                            item.callback(this, element);
                            canvas.contextMenu.style.display = 'none';
                        };
                    } else {
                        menuItem.className = 'null-line';
                    }

                    canvas.contextMenu.appendChild(menuItem);
                }

                canvas.contextMenu.style.top = evt.clientY + 'px';
                canvas.contextMenu.style.left = evt.clientX + 'px';
                canvas.contextMenu.style.display = 'block';

                canvas.contextMenu.style.opacity = '1';
            }
        }
    }
}