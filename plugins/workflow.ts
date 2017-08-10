/**
 * Diagrama de flujo de trabajo
 *
 * @namespace
 */
module Workflow{
    import BaseOption = Loira.util.BaseOption;
    import Point = Loira.util.Point;
    import RelOption = Loira.util.RelOption;
    import Line = Loira.util.Line;

    export class WorkflowOption extends BaseOption{
        startPoint: boolean;
        endPoint: boolean;
    }

    export abstract class Symbol extends Common.Symbol{
        protected startPoint: boolean;
        protected endPoint: boolean;

        constructor(options: WorkflowOption){
            super(options);

            this.startPoint = options.startPoint? options.startPoint: false;
            this.endPoint = options.endPoint? options.endPoint: false;
        }

        protected _linkSymbol(): void{
            let $this = this;
            let  listener = this._canvas.on(
                'mouse:down', function(evt){
                    let canvas:Loira.Canvas = $this._canvas;

                    if (!$this.maxOutGoingRelation || (canvas.getRelationsFromObject($this, false, true).length < $this.maxOutGoingRelation)){
                        for (let item of canvas.items) {
                            if (item.baseType !== 'relation' && !item['startPoint']){
                                if(item.checkCollision(evt.x, evt.y) && !$this.endPoint){
                                    let instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                    let points: Point[] = null;

                                    if ($this._uid == item._uid){
                                        let widthLeft: number = $this.x + $this.width + 30;
                                        let heightHalf: number = $this.y + $this.height/2;

                                        points = [];
                                        points.push(new Point());
                                        points.push(new Point(widthLeft, heightHalf));
                                        points.push(new Point(widthLeft, $this.y - 30));
                                        points.push(new Point($this.x + $this.width/2, $this.y - 30));
                                        points.push(new Point());
                                    }

                                    canvas.add(new instance({points: points}).update($this, item));
                                    break;
                                }
                            }
                        }
                    }
                    canvas.fall('mouse:down', listener);
                }
            );
        }
    }

    /**
     * Process symbol
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    export class Process extends Symbol{
        borders: any;

        constructor(options: WorkflowOption){
            options.width = options.width? options.width : 100;
            options.height = options.height? options.height : 70;

            super(options);
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
        }

        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            let xm: number = points.x2 - points.x1,
                ym: number = points.y2 - points.y1;
            let angle = Math.atan(ym / xm);

            if (xm<0){
                angle += Math.PI;
            }

            let result = {x:100, y:this.y-10};

            if ((angle > this.borders.bottomLeft && angle < this.borders.topLeft) || (angle > this.borders.topRight && angle < this.borders.bottomRight)){
                result = Loira.util.intersectPointLine(points, new Line(this.x, -100, this.x, 100));
            }else{
                result = Loira.util.intersectPointLine(points, new Line(-100, this.y, 100, this.y));
            }

            let x = result.x - (this.x + this.width/2);
            let axis = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(axis, 2));
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            ctx.beginPath();
            ctx.lineWidth = 2;

            ctx.rect(this.x - vX, this.y - vY, this.width, this.height);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
            ctx.fillStyle = "#000000";

            this.drawText(ctx, this.text);
        }

        recalculateBorders() {
            let xm = Math.round(this.width /2),
                ym = Math.round(this.height /2);

            this.borders.bottomLeft = Math.atan(-ym / xm);
            this.borders.topLeft = Math.atan(ym / xm);
            this.borders.topRight = Math.atan(ym / -xm) + Math.PI;
            this.borders.bottomRight = Math.atan(-ym / -xm) + Math.PI;
        }
    }

    /**
     * Base symbol for terminators of workflow
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    export class Terminator extends Symbol{
        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            let xm: number = points.x2 - points.x1,
                ym: number = points.y2 - points.y1;

            let a = this.width/2;
            let b = this.height/2;
            let ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

            return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            let xw = x + this.width - 20;
            let yh = y + this.height;

            x += 20;

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

            this.drawText(ctx, this.text);
        }

        recalculateBorders() {}

    }

    export class StartTerminator extends Terminator {

        constructor(options: WorkflowOption){
            options.width = options.width? options.width : 100;
            options.height = options.height? options.height : 30;

            super(options);

            this.text = 'INICIO';
            this.startPoint = true;
            this.maxOutGoingRelation = 1;

            this.type = 'start_terminator';
        }
    }

    export class EndTerminator extends Terminator {

        constructor(options: WorkflowOption){
            super(options);
            this.width = 70;
            this.height = 30;
            this.text = 'FIN';
            this.endPoint = true;
            this.type = 'end_terminator';
        }
    }

    /**
     * Data symbol
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    export class Data extends Symbol{
        constructor(options: WorkflowOption){
            options.width = options.width? options.width : 100;
            options.height = options.height? options.height : 70;

            super(options);
            this.text = options.text;
            this.type = 'data';
        }

        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            let xm: number = points.x2 - points.x1,
                ym: number = points.y2 - points.y1;
            let a = this.width/2;
            let b = this.height/2;
            let ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

            return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            let xw = x + this.width;
            let yh = y + this.height;

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
        }

        recalculateBorders() {
        }
    }

    export class Decision extends Symbol{
        constructor(options: WorkflowOption){
            options.width = options.width? options.width : 100;
            options.height = options.height? options.height : 70;

            super(options);
            this.text = options.text;
            this.type = 'decision';
        }

        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            let xm: number = points.x2 - points.x1,
                ym: number = points.y2 - points.y1;
            let x = this.x,
                y = this.y,
                xP = this.x + this.width/2,
                yP = this.y + this.height/2,
                xw = this.x + this.width;

            let angle = Math.atan(yP / xm);
            let result:Point;

            if (xm<0){
                angle += Math.PI;
            }

            if ((angle > 0 && angle < 1.6) || (angle > 3.15 && angle < 4.7)){
                result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, y));
            } else {
                result = Loira.util.intersectPointLine(points, new Line(xP, y, xw, yP));
            }

            x = result.x - (this.x + this.width/2);
            y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            let xm = x + this.width/2;
            let ym = y + this.height/2;
            let xw = x + this.width;
            let yh = y + this.height;

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

            this.drawText(ctx, this.text);
        }

        recalculateBorders() {
        }
    }

    /**
     * Contiene las funciones para relacion de extension
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    export class Returns extends Common.Relation{
        constructor(options: RelOption){
            options.icon = 'spear1';
            options.text = '<<returns>>';
            options.isDashed = true;

            super(options);
            this.type = 'returns';
        }
    }
}
