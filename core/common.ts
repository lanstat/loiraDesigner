module Common{
    import RelOption = Loira.util.RelOption;
    import Point = Loira.util.Point;
    import Line = Loira.util.Line;
    import Region = Loira.util.Region;
    import BaseOption = Loira.util.BaseOption;
    import VirtualCanvas = Loira.VirtualCanvas;
    import Rect = Loira.util.Rect;

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
        public pointMenu: MenuItem[];

        constructor(options: RelOption){
            super(options);

            this.start = options.start? options.start : null;
            this.end = options.end? options.end : null;
            this.isDashed = options.isDashed? options.isDashed : false;
            this.points = options.points? options.points : [new Point(), new Point()];
            this.icon = options.icon? options.icon: '';
            this.typeLine = options.typeLine? options.typeLine: TypeLine.STRAIGHT;

            this.baseType = 'relation';

            if (this.start._uid === this.end._uid){
                this.selfRelated();
            }
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
        public render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            let start:Rect,
                end:Rect,
                tmp: number,
                init: Point,
                last: Point,
                xm: number,
                ym: number,
                line: Line,
                delta: number[] = [],
                distance: number = 0;

            start = new Rect(this.start.x, this.start.y, this.start.width, this.start.height);
            end = new Rect(this.end.x, this.end.y, this.end.width, this.end.height);

            this.points[0] = {x: start.x + start.width/2, y: start.y + start.height/2};
            this.points[this.points.length - 1] = {x: end.x + end.width/2, y: end.y + end.height/2};
            init = this.points[0];
            last = this.points[1];

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(init.x - vX, init.y - vY);

            if (this.isDashed){
                ctx.setLineDash([5, 5]);
            }

            for (let i:number = 0; i < this.points.length; i++){
                ctx.lineTo(this.points[i].x - vX, this.points[i].y - vY);
                if (i>0){
                    delta[i-1] = Math.sqrt(Math.pow((this.points[i].x - this.points[i-1].x), 2) + Math.pow((this.points[i].y - this.points[i-1].y), 2));
                    distance += delta[i-1];
                }
            }

            ctx.stroke();
            ctx.setLineDash([]);

            if (this.icon){
                init = this.points[this.points.length - 2];
                last = this.points[this.points.length - 1];

                xm = (last.x - init.x);
                ym = (last.y - init.y);

                tmp = Math.atan(ym/xm);

                if (xm<0){
                    tmp += Math.PI;
                }

                ctx.translate(last.x - vX, last.y - vY);
                ctx.rotate(tmp);
                line = new Line(init.x, init.y, last.x, last.y);

                let region:Region = Loira.drawable.get(this.icon);
                let border:number = this.end.obtainBorderPos(line, ctx);

                Loira.drawable.render(this.icon, ctx, -(region.width + border), -Math.ceil(region.height/2));

                ctx.rotate(-tmp);
                ctx.translate(-last.x - vX, -last.y -vY);
            }

            if (this.text || this.text.length > 0){
                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
                let buffE: number = 0;
                let buffS: number = 0;
                let d: number = 0;

                /*
                 * Primero se obtiene el tamanho de la recta visible y se la divide a la mitad(c1), despues se usa como pivot
                 * el punto inicial y se usa la distancia cubierta por el elemento y se le suma la distancia visible(c1)
                 * Luego los puntos inicial y final se los trata como un triangulo rectangulo de catetos (a,b,c) y mediante
                 * interpolacion se obtiene el punto medio.
                 */
                if (this.points.length == 2){
                    init = this.points[0];
                    last = this.points[1];

                    line = new Line(init.x, init.y, last.x, last.y);

                    buffE = this.end.obtainBorderPos(line, ctx);
                    buffS = this.start.obtainBorderPos(line, ctx);
                } else {
                    buffS = this.start.obtainBorderPos(new Line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y), ctx);
                    buffE = this.end.obtainBorderPos(new Line(this.points[this.points.length-2].x, this.points[this.points.length-2].y, this.points[this.points.length-1].x, this.points[this.points.length-1].y), ctx);

                    d = ((distance - buffS - buffE) / 2) + buffS;
                    let i: number = 0;

                    while(d - delta[i] > 0){
                        d -= delta[i];
                        i++;
                    }

                    init = this.points[i];
                    last = this.points[i+1];

                    if(i!==0){
                        buffS = 0;
                    }

                    if(i!==this.points.length -2){
                        buffE = 0;
                    }
                }
                let a: number = last.x - init.x;
                let b: number = last.y - init.y;
                let c: number = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

                let c1: number = ((this.points.length == 2)? ((c - buffE - buffS)/2) + buffS: d);

                let b1: number = Math.floor(b/c*c1);
                let a1: number = Math.floor(a/c*c1);

                tmp = ctx.measureText(this.text).width;

                ctx.fillStyle = Loira.Config.background;
                ctx.fillRect(init.x + vX + a1 - tmp/2, init.y + vY + b1 - 13, tmp, 12);
                ctx.fillStyle = "#000000";

                ctx.fillText(this.text,
                    init.x + vX + a1 - tmp/2,
                    init.y + vY + b1 - 3);

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
            let px: number = 0,
                py: number = 0;

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

                    px = Math.abs(x - init.x);
                    py = Math.abs(y - init.y);

                    if (xd > yd){
                        m = Math.abs((yd / xd) * px);

                        if ((m === 0 && (py > point1.y && py < point2.y)) || (m > py - 8 && m < py + 8)){
                            return true;
                        }
                    } else {
                        m = Math.abs((xd / yd) * py);

                        if ((m === 0 && (px > point1.x && px < point2.x)) || (m > px - 8 && m < px + 8)){
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

            let x: number = this._canvas.virtualCanvas.x;
            let y: number = this._canvas.virtualCanvas.y;

            for (let i:number = 0; i < this.points.length; i++){
                ctx.fillRect(this.points[i].x-4 - x, this.points[i].y-4 -y, 8, 8);
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

        removePoint(index: number): void{
            this.points.splice(index, 1);
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

        isVisible(virtual: VirtualCanvas): boolean{
            return true;
        }

        public getMenu(x: number, y: number): MenuItem[]{
            this.selectedArea = this.getSelectedCorner(x, y);
            return this.selectedArea? this.pointMenu || this.menu : this.menu;
        }

        move(x: number, y: number): void{
            if (this.points.length > 2){
                for (let i=1; i < this.points.length-1; i++){
                    this.points[i].x += x;
                    this.points[i].y += y;
                }
            }
        }

        private selfRelated(): void {
            let widthLeft: number = this.start.x + this.start.width + 30;
            let heightHalf: number = this.start.y + this.start.height/2;

            this.points = [];

            this.points.push(new Point());
            this.points.push(new Point(widthLeft, heightHalf));
            this.points.push(new Point(widthLeft, this.start.y - 30));
            this.points.push(new Point(this.start.x + this.start.width/2, this.start.y - 30));
            this.points.push(new Point());
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
         * @param points Puntos que forman la recta
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @returns {number} Distancia borde del simbolo
         */
        abstract obtainBorderPos(points: Line, ctx: CanvasRenderingContext2D): number;

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

        protected drawText(ctx: CanvasRenderingContext2D, line: string, vX: number, vY: number) {
            let y,
                xm = (this.x - vX) + this.width / 2,
                ym = (this.y - vY) + this.height / 2,
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

        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            let textW: number = ctx.measureText(this.text).width,
                xm: number = points.x2 - points.x1,
                ym: number = points.y2 - points.y1;

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
                result = Loira.util.intersectPointLine(points, new Line(this.x, -100, this.x, 100));
            }else{
                result = Loira.util.intersectPointLine(points, new Line(-100, this.y, 100, this.y));
            }

            return Math.sqrt(Math.pow((result.x - (this.x + this.width/2)), 2) + Math.pow((result.y - (this.y + this.height/2)), 2));
        }

        public render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            let textW:number = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            let x: number= this.x - vX;
            let y: number= this.y - vY;

            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(x, y, this.width, this.height);
            ctx.fillStyle = "#000000";

            Loira.drawable.render('actor', ctx, x + this.width/2 - 15, y);

            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#000000";

            ctx.fillText(this.text, x, y+80);
        }

        recalculateBorders() {
        }
    }

    export class ScrollBar extends Loira.Element{
        private _horPos: number;
        private _verPos: number;
        private _horSize: number;
        private _verSize: number;
        private _virtual: Loira.VirtualCanvas;
        public selected: string;

        constructor(canvas: Loira.Canvas){
            super(new BaseOption());
            this.type = 'scrollBar';

            this.width = canvas.virtualCanvas.viewportWidth;
            this.height = canvas.virtualCanvas.viewportHeight;

            this._horPos = canvas.virtualCanvas.x;
            this._verPos = canvas.virtualCanvas.y;
            this._horSize = Math.floor(this.width*(this.width / canvas.virtualCanvas.width));
            this._verSize = Math.floor(this.height*(this.height / canvas.virtualCanvas.height));

            this._virtual = canvas.virtualCanvas;
            this._canvas = canvas;
        }

        public render(ctx: CanvasRenderingContext2D): void {
            let config: any = Loira.Config.scrollBar;

            if (this._virtual.width > this._virtual.viewportWidth){
                ctx.fillStyle = config.background;
                ctx.fillRect(0, this.height - config.size, this._virtual.viewportWidth, config.size);
                ctx.fillStyle = config.color;
                ctx.fillRect(this._horPos, this.height - config.size, this._horSize, config.size);
            }

            if (this._virtual.height > this._virtual.viewportHeight){
                ctx.fillStyle = config.background;
                ctx.fillRect(this.width - config.size, 0, config.size, this._virtual.viewportHeight);
                ctx.fillStyle = config.color;
                ctx.fillRect(this.width - config.size, this._verPos, config.size, this._verSize);
            }

            ctx.fillStyle = "#000000";
        }

        recalculateBorders() {
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
            let virtual: Loira.VirtualCanvas = this._virtual;
            let _x: number = x - virtual.x,
                _y: number = y - virtual.y;

            if (_x > this._horPos && _x < (this._horPos + this._horSize)
                && _y > (virtual.viewportHeight - Loira.Config.scrollBar.size) && _y < virtual.viewportHeight){
                this.selected = 'H';

                return true;
            }

            if (_x > (virtual.viewportWidth - Loira.Config.scrollBar.size) && _x < virtual.viewportWidth
                && _y > this._verPos && _y < (this._verPos + this._verSize)){
                this.selected = 'V';

                return true;
            }

            this.selected = null;
            return false;
        }

        addMovement(dir: string, delta: number, inc: number = 30): void{
            let tmp: number;
            let virtual: Loira.VirtualCanvas = this._virtual;
            let background = this._canvas._background;

            if (dir === 'H'){
                tmp = this._horPos + delta * inc;
                if (tmp < 0) {
                    this._horPos = 0;
                } else if (tmp + this._horSize > virtual.viewportWidth){
                    this._horPos = virtual.viewportWidth - this._horSize;
                } else {
                    this._horPos = tmp;
                }

                virtual.x = Math.floor(virtual.width * (this._horPos / virtual.viewportWidth));

                if(background){
                    background.style.marginLeft = '-'+virtual.x+'px';
                }
            } else if(dir === 'V') {
                tmp = this._verPos + delta * inc;
                if (tmp < 0) {
                    this._verPos = 0;
                } else if (tmp + this._verSize > virtual.viewportHeight){
                    this._verPos = virtual.viewportHeight - this._verSize;
                } else {
                    this._verPos = tmp;
                }
                virtual.y = Math.floor(virtual.height * (this._verPos / virtual.viewportHeight));
                if(background){
                    background.style.marginTop = '-'+virtual.y+'px';
                }
            }
        }

        addMovementWheel(dir: string, delta: number, inc: number = 30): void{
            let tmp: number;
            let virtual: Loira.VirtualCanvas = this._virtual;
            let background = this._canvas._background;
            let realTmp: number = 1;

            if (dir === 'H'){
                //realTmp =
                tmp = this._horPos + Math.round(delta * virtual.viewportWidth * (inc / virtual.width));
                if (tmp < 0) {
                    this._horPos = 0;
                } else if (tmp + this._horSize > virtual.viewportWidth){
                    this._horPos = virtual.viewportWidth - this._horSize;
                } else {
                    this._horPos = tmp;
                }

                virtual.x = Math.floor(virtual.width * (this._horPos / virtual.viewportWidth));

                if(background){
                    background.style.marginLeft = '-'+virtual.x+'px';
                }
            } else if(dir === 'V') {
                tmp = this._verPos + Math.round(delta * virtual.viewportHeight * (inc / virtual.height));
                if (tmp < 0) {
                    this._verPos = 0;
                } else if (tmp + this._verSize > virtual.viewportHeight){
                    this._verPos = virtual.viewportHeight - this._verSize;
                } else {
                    this._verPos = tmp;
                }
                virtual.y = Math.floor(virtual.height * (this._verPos / virtual.viewportHeight));
                if(background){
                    background.style.marginTop = '-'+virtual.y+'px';
                }
            }
        }

        setPosition(x: number, y: number): void{
            let virtual: Loira.VirtualCanvas = this._virtual;
            let background = this._canvas._background;

            x = x<0? 0: x;
            y = y<0? 0: y;

            virtual.x = x;
            virtual.y = y;
            this._horPos = Math.floor((virtual.x * virtual.viewportWidth)/ virtual.width);
            this._verPos  = Math.floor((virtual.y * virtual.viewportHeight)/ virtual.height);

            if(background){
                background.style.marginTop = '-'+virtual.y+'px';
                background.style.marginLeft = '-'+virtual.x+'px';
            }
        }

        isSelectable(): boolean{
            return !!this.selected;
        }

        dragScroll(x: number, y: number): void{
            this.addMovement(this.selected, this.selected === 'H'? x:y, 1);
        }
    }
}
