module Loira{
    import BaseOption = Loira.util.BaseOption;
    import Region = Loira.util.Region;
    import Point = Loira.util.Point;
    import Animation = Loira.Animation;

    /**
     * Clase base para la creacion de nuevos objetos dibujables
     *
     * @memberof Loira
     * @class Element
     */
    export abstract class Element {
        public _uid: string;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public centerObject: boolean;
        public maxIncomingRelation: number;
        public maxOutGoingRelation: number;
        public _buttons: any[];
        protected _canvas: Loira.Canvas;
        public type: string;
        public baseType: string;
        public extras: any;
        public text: string;
        public selectable: boolean;
        public resizable: boolean;
        public draggable: boolean;
        public menu: MenuItem[];
        protected selectedArea: any;
        public isSelected: boolean;
        private destinationPoint: Point;

        /**
         * Inicializa los valores de la clase
         *
         * @memberof Loira.Element#
         * @protected
         * @param { BaseOption } options Conjunto de valores iniciales
         */
        constructor(options: BaseOption) {
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
            this.text = options.text? options.text : '';
            this.selectable = options.selectable? options.selectable: true;
            this.resizable = options.resizable? options.resizable: true;
            this.draggable = options.draggable? options.draggable: true;

            this._buttons = [];
            this._canvas = null;
            this.type = '';
            this.baseType = '';
            this.isSelected = false;
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
        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
        }

        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        checkCollision(x: number, y: number): boolean {
            return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
        }
        /**
         * Agrega iconos laterales del objeto con sus respectivos escuchadores
         *
         * @memberof Loira.Object#
         * @param {Array.<Object>} args Iconos laterales a agregar
         */
        on(args: any): void {
            if (args){
                args = [].splice.call(arguments, 0);
                this._buttons = args;
            } else {
                this._buttons = [];
            }
        }

        /**
         * Move the object to a position by animating the movement
         * @param x x pointer
         * @param y y pointer
         */
        moveTo(x: number, y: number, absolute: boolean = false): void {
            if (absolute){
                this.destinationPoint.x = x;
                this.destinationPoint.y = y;
            } else {
                this.destinationPoint.x = this.x + x;
                this.x += x;
                this.y += y;
            }
        }

        /**
         * Renderiza los iconos de los botones laterales
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @param { number } vX Virtual x pointer
         * @param { number } vY Virtual y pointer
         */
        public renderButtons(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            let x: number = this.x + this.width + 10;
            let y: number = this.y;

            x -= vX;
            y -= vY;

            if (this._buttons.length > 0) {
                this._buttons.forEach(function (item) {
                    drawable.render(item.icon, ctx, x, y);
                    y += drawable.get(item.icon).height + 4;
                });
            }
        }

        /**
         * Ejecuta el escuchador de algun icono lateral encontrado por el punto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         * @private
         */
        callCustomButton(x: number, y: number): boolean {
            let _x: number = this.x + this.width + 10;
            let _y: number = this.y;
            let region: Region;
            for (let item of this._buttons) {
                region = drawable.get(item.icon);
                if (_x <= x && x <= _x + region.width && _y <= y && y <= _y + region.height) {
                    item.click.call(this);
                    return true;
                }
                _y += item.icon.height + 4;
            }
            return false;
        }

        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @param { Boolean } showResizable Determines if should draw resizable boxes
         * @private
         */
        drawSelected(ctx: CanvasRenderingContext2D, showResizable: boolean = true) {
            let x: number = this.x - 2,
                y: number = this.y - 2,
                w: number = this.width,
                h: number = this.height;

            x -= this._canvas.virtualCanvas.x;
            y -= this._canvas.virtualCanvas.y;

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = Loira.Config.selected.color;
            ctx.rect(x, y, w + 4, h + 4);
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.resizable && showResizable){
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
        }

        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Loira.Object#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns
         */
        getSelectedCorner(pX: number, pY: number): string {
            if (!this.resizable) {return ''}
            let x: number = this.x - 2,
                y: number = this.y - 2,
                w: number = this.width,
                h: number = this.height,
                mw: number = w / 2,
                mh: number = h / 2;
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
        }

        /**
         * Muestra el objeto si el canvas se encuentra en un contenedor
         *
         * @memberof Loira.Element#
         */
        show(): void {
            this._canvas.centerToPoint((this.x + this.width / 2), (this.y + this.height / 2));
        }

        /**
         * Recalcula los bordes del objeto
         *
         * @memberof Loira.Element#
         * @abstract
         */
        abstract recalculateBorders(): void;

        attach(canvas: Loira.Canvas): void {
            this._canvas = canvas;
        }

        isVisible(virtual: VirtualCanvas): boolean{
            let p1: Point = null,
                p2: Point = null,
                a1: Point = null,
                a2: Point = null;

            if (virtual.area > this.width * this.height){
                p1 = {x: this.x, y: this.y};
                p2 = {x: this.x + this.width, y: this.y + this.height};
                a1 = {x: virtual.x, y: virtual.y};
                a2 = {x: virtual.x + virtual.viewportWidth, y: virtual.y + virtual.viewportHeight};
            } else {
                a1 = {x: this.x, y: this.y};
                a2 = {x: this.x + this.width, y: this.y + this.height};
                p1 = {x: virtual.x, y: virtual.y};
                p2 = {x: virtual.x + virtual.viewportWidth, y: virtual.y + virtual.viewportHeight};
            }

            if (p1.x > a1.x && p1.x < a2.x && p1.y > a1.y && p1.y <a2.y){
                return true;
            } else if (p1.x > a1.x && p1.x < a2.x && p2.y > a1.y && p2.y <a2.y){
                return true;
            } else if (p2.x > a1.x && p2.x < a2.x && p1.y > a1.y && p1.y <a2.y){
                return true;
            } else if (p2.x > a1.x && p2.x < a2.x && p2.y > a1.y && p2.y <a2.y){
                return true;
            }

            return false;
        }

        destroy(): void {
            this._canvas = null;
        }

        getMenu(x: number, y: number): MenuItem[]{
            return this.menu;
        }

        getTooltip(x: number, y: number): HTMLElement|string{
            return 'Tipo: <b>'+this.type+'</b>';
        }
    }
}