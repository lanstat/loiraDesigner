module Common{
    import RelOption = Loira.util.RelOption;
    import Point = Loira.util.Point;
    import Line = Loira.util.Line;
    import Region = Loira.util.Region;

    export enum TypeLine{
        STRAIGHT = 1,
        CURVE = 2,
        CARTESIAN = 3
    }

    export abstract class Relation extends Loira.Element{
        public start: Symbol;
        public end: Symbol;
        public isDashed: boolean;
        public points: Point[];
        public icon: string;
        public typeLine: TypeLine;

        constructor(options: RelOption){
            super(options);

            this.start = options.start? options.start : null;
            this.end = options.end? options.end : null;
            this.isDashed = options.isDashed? options.isDashed : false;
            this.points = options.points? options.points : [new Point(), new Point()];
            this.icon = options.icon? options.icon: '';
            this.typeLine = options.typeLine? options.typeLine: TypeLine.STRAIGHT;

            this.baseType = 'relation';
        }

        /**
         * Renderiza el objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        public render(ctx: CanvasRenderingContext2D): void {
            let start:Symbol = this.start,
                end:Symbol = this.end,
                tmp: number,
                init: Point,
                last: Point,
                xm: number,
                ym: number;

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

            for (let i:number = 1; i < this.points.length; i++){
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.icon){
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

                let region:Region = Loira.drawable.get(this.icon);
                let border:number = end.obtainBorderPos(xm, ym, {x1:init.x, y1: init.y, x2:last.x, y2:last.y}, ctx);

                Loira.drawable.render(this.icon, ctx, -(region.width + border), -Math.ceil(region.height/2));
                ctx.rotate(-tmp);
                ctx.translate(-last.x, -last.y);
            }

            if (this.text || this.text.length > 0){
                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

                let pivot: number = Math.round(this.points.length / 2);

                init = this.points[pivot - 1];
                last = this.points[pivot];

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
        }

        recalculateBorders() {
        }

        /**
         * Actualiza los objeto de origen y objetivo de la relacion
         *
         * @memberof Common.Relation#
         * @param { Object } start Objeto origen
         * @param { Object } end Objeto objetivo
         * @chainable
         * @returns {Common.Relation}
         */
        update(start, end):Common.Relation{
            this.start = start;
            this.end = end;
            return this;
        }

        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Common.Relation#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        checkCollision(x, y): boolean{
            let init = null,
                last = null;
            let xd:number = 0,
                yd:number = 0;
            let point1: Point = {x: 0, y: 0};
            let point2: Point = {x: 0, y: 0};
            let m:number;

            for (let i:number = 1; i < this.points.length; i++){
                init = this.points[i - 1];
                last = this.points[i];
                point1.x = init.x;
                point1.y = init.y;
                point2.y = last.y;
                point2.x = last.x;


                if (init.x > last.x){
                    point1.x = last.x;
                    point2.x = init.x;
                }

                if (init.y > last.y){
                    point1.y = last.y;
                    point2.y = init.y;
                }

                if (x > point1.x - 5 && x < point2.x + 5 && y > point1.y - 5 && y < point2.y + 5){
                    yd = Math.abs(last.y - init.y);
                    xd = Math.abs(last.x - init.x);

                    x = Math.abs(x - init.x);
                    y = Math.abs(y - init.y);

                    if (xd > yd){
                        m = Math.abs((yd / xd) * x);

                        if ((m === 0 && (y > point1.y && y < point2.y)) || (m > y - 8 && m < y + 8)){
                            return true;
                        }
                    } else {
                        m = Math.abs((xd / yd) * y);

                        if ((m === 0 && (x > point1.x && x < point2.x)) || (m > x - 8 && m < x + 8)){
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        drawSelected(ctx: CanvasRenderingContext2D): void{
            ctx.beginPath();

            ctx.fillStyle= Loira.Config.selected.color;

            for (let i:number = 0; i < this.points.length; i++){
                ctx.fillRect(this.points[i].x-4, this.points[i].y-4, 8, 8);
            }

            ctx.strokeStyle= '#000000';
        }

        addPoint(): void{
            let last:Point = this.points[1],
                init: Point = this.points[0];

            let x: number = Math.round((last.x - init.x)/ 2) + init.x;
            let y: number = Math.round((last.y - init.y)/ 2) + init.y;

            this.points.splice(1, 0, {x: x, y: y});
        }

        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Common.Relation#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {string}
         */
        getSelectedCorner(pX: number, pY: number): any{
            for (let i:number = 1; i < this.points.length - 1; i++){
                let x = this.points[i].x-4,
                    y = this.points[i].y-4,
                    w = x + 8,
                    h = y + 8;
                if (pX > x && pX < w && pY > y && pY < h){
                    return i;
                }
            }
            return false;
        }

        /**
         * Mueve un punto de la relacion
         *
         * @memberof Common.Relation#
         * @param point Indice del punto a mover
         * @param x Delta de x
         * @param y Delta de y
         */
        movePoint(point: number, x: number, y: number): void{
            this.points[point].x += x;
            this.points[point].y += y;
        }
    }

    export abstract class Symbol extends Loira.Element{

        constructor(options: Loira.util.BaseOption){
            super(options);

            let link = this._linkSymbol;
            this.on({
                icon: 'arrow',
                click: link
            });
            this.baseType = 'symbol';
        }

        /**
         * Evento que se ejecuta cuando se realiza una relacion entre simbolos
         *
         * @memberof Common.Symbol#
         * @protected
         */
        protected _linkSymbol(): void{
            let $this = this;
            let  listener = this._canvas.on(
                'mouse:down', function(evt){
                    let canvas:Loira.Canvas = $this._canvas;
                    let countRel:number = canvas.getRelationsFromObject($this, false, true).length;

                    if (!$this.maxOutGoingRelation || (countRel < $this.maxOutGoingRelation)){
                        for (let item of canvas.items) {
                            if (item.baseType !== 'relation'){
                                if(item.checkCollision(evt.x, evt.y)){
                                    let instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                    canvas.add(new instance({}).update($this, item));
                                    break;
                                }
                            }
                        }
                    }
                    canvas.fall('mouse:down', listener);
                }
            );
        }

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
        abstract obtainBorderPos(xm: number, ym: number, points: Line, ctx: CanvasRenderingContext2D): number;

        protected splitText(ctx: CanvasRenderingContext2D, text: string, padding: number = 10) {
            let words:string[] = text.split(' ');
            let buff:string = '';
            let lines:string[] = [];

            for (let i:number = 0; i < words.length; i++) {
                if (ctx.measureText(buff + words[i]).width > this.width - padding) {
                    lines.push(buff);
                    buff = words[i] + ' ';
                } else {
                    buff = buff + ' ' + words[i];
                }
            }
            lines.push(buff);

            return lines;
        }

        protected drawText(ctx: CanvasRenderingContext2D, line: string) {
            let y,
                xm = this.x + this.width / 2,
                ym = this.y + this.height / 2,
                lines: string[];

            lines = this.splitText(ctx, line);

            y = ym + 3 - ((6 * lines.length + 3 * lines.length) / 2);

            for (let i:number = 0; i < lines.length; i++) {
                let textW: number = ctx.measureText(lines[i]).width;
                ctx.fillText(lines[i], xm - textW / 2, y + 3);
                y = y + Loira.Config.fontSize + 3;
            }
        }
    }

    export class Actor extends Common.Symbol{
        constructor(options: Loira.util.BaseOption){
            super(options);

            this.text = options.text? options.text: 'Actor1';
            this.width = 30;
            this.height = 85;
            this.type = 'actor';
        }

        obtainBorderPos(xm: number, ym: number, points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            let textW: number = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            let angle:number = Math.atan(ym / xm);

            if (xm<0){
                angle += Math.PI;
            }

            let result:Point = null;

            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)){
                result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
            }else{
                result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
            }

            return Math.sqrt(Math.pow((result.x - (this.x + this.width/2)), 2) + Math.pow((result.y - (this.y + this.height/2)), 2));
        }

        public render(ctx: CanvasRenderingContext2D): void {
            let textW:number = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";

            Loira.drawable.render('actor', ctx, this.x + this.width/2 - 15, this.y);

            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#000000";

            ctx.fillText(this.text, this.x, this.y+80);
        }

        recalculateBorders() {
        }
    }
}
