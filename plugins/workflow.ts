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
    import BaseController = Loira.BaseController;
    import ObjectEvent = Loira.event.ObjectEvent;
    import RelationEvent = Loira.event.RelationEvent;

    const EVT_OPEN_PROPERTY = 'workflow:open-property';

    export class WorkflowOption extends BaseOption{
        startPoint?: boolean;
        endPoint?: boolean;
        key?: string;
    }

    export class Controller extends BaseController {
        private startId: number = null;

        private getLevel(canvas: Loira.Canvas, parentId: number): Loira.Element[] {
            let elements: Loira.Element[] = [];
            let initial: Common.Relation;

            for (let i: number = 0; i<canvas.items.length;i++){
                let item: Loira.Element = canvas.items[i];
                if (item.baseType === 'relation'){}
            }

            let exploration = function(id: number){

            };

            exploration(parentId);

            return elements;
        }

        bind(canvas: Loira.Canvas) {
            let scope = this;

            canvas.defaultRelation = 'Workflow.Association';

            canvas.on(Loira.event.OBJECT_PRE_ADD, function(evt){
                if (evt.selected.type === 'start_terminator' && scope.startId){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'Existe ya un inicio de flujo'});
                    return false;
                }
            });

            canvas.on(Loira.event.OBJECT_ADDED, function(evt){
                if (evt.selected.type === 'start_terminator'){
                    scope.startId = evt.selected.uniqueId;
                }
            });

            canvas.on(Loira.event.RELATION_PRE_ADD, function(evt){
                if (evt.selected.start.parentId && evt.selected.end.parentId && evt.selected.start.parentId != evt.selected.end.parentId){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'No pertenecen al mismo padre'});
                    return false;
                }
            });

            canvas.on(Loira.event.RELATION_ADDED, function(evt){
                if (evt.selected.start.type === 'parallel_start' || evt.selected.start.type === 'start_terminator'){
                    evt.selected.end.parentId = evt.selected.start.uniqueId;
                } else {
                    if (evt.selected.start.parentId){
                        evt.selected.end.parentId = evt.selected.start.parentId;
                    } else {
                        evt.selected.start.parentId = evt.selected.end.parentId;
                    }
                }
            });

            canvas.on(Loira.event.OBJECT_REMOVED, function(evt: ObjectEvent){
                if (evt.selected.baseType === 'relation'){

                }
            });
        }

        load(data: any) {
        }

        exportData(): any {
            return undefined;
        }
    }

    export abstract class Symbol extends Common.Symbol{
        protected startPoint: boolean;
        protected endPoint: boolean;
        public uniqueId: number;
        public parentId: number;

        constructor(options: WorkflowOption){
            super(options);

            this.uniqueId = Loira.util.createRandomNumber(true);
            this.startPoint = options.startPoint? options.startPoint: false;
            this.endPoint = options.endPoint? options.endPoint: false;
            let scope = this;

            this.menu = [
                {text: Loira.Config.workflow.menu.joinTo, callback: function(){
                    scope._linkSymbol();
                }},
                {text: Loira.Config.workflow.menu.deleteBtn, callback: function(){
                    scope._canvas.remove([scope], true);
                }},
                null,
                {text: 'Editar texto', callback: function(){
                    scope._canvas.showEditor({x:scope.x, y: scope.y, width: scope.width, height: scope.height}, scope.text, function (text) {
                        scope.text = text;
                    });
                }},
                null,
                {text:Loira.Config.workflow.menu.property, callback: function(){
                    scope._canvas.emit(EVT_OPEN_PROPERTY, new ObjectEvent(scope));
                }}
            ];
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
                xw = this.x + this.width,
                yh = this.y + this.height;

            let angle = Math.atan(yP / xm);
            let result:Point;

            if (xm<0){
                angle += Math.PI;
            }

            ym = ym/Math.abs(ym);

            if (angle > 0 && angle < 1.6){
                if (ym > 0){
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, y));
                } else {
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, yh));
                }
            } else {
                if (ym > 0){
                    result = Loira.util.intersectPointLine(points, new Line(xP, y, xw, yP));
                } else {
                    result = Loira.util.intersectPointLine(points, new Line(xP, yh, xw, yP));
                }
            }

            x = result.x - (this.x + this.width/2);
            y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            Loira.shape.drawDiamond(ctx, x, y, this.width, this.height);
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
            let scope = this;

            this.menu = [
                {text:'Partir', callback: function(){
                    scope.addPoint();
                }},
                {text:'Borrar', callback: function(evt, item){
                    console.log(item);
                }},
                null,
                {text:'Propiedades', callback: function(){
                    scope._canvas.emit(EVT_OPEN_PROPERTY, new ObjectEvent(scope));
                }}
            ];
        }
    }

    export class Association extends Common.Relation {
        constructor(options: RelOption){
            options.icon = 'spear';

            super(options);
            this.type = 'workflow_association';
            let scope = this;

            this.menu = [
                {text:'Partir', callback: function(){
                    scope.addPoint();
                }},
                {text:'Borrar', callback: function(){
                    scope._canvas.remove([scope], true);
                }},
                null,
                {text:'Propiedades', callback: function(){
                    scope._canvas.emit(EVT_OPEN_PROPERTY, new ObjectEvent(scope));
                }}
            ];

            this.pointMenu = [
                {text:'Borrar punto', callback: function(){
                    scope.removePoint(scope.selectedArea);
                }}
            ]
        }
    }

    export class ParallelStart extends Symbol{
        protected key: string;

        constructor(options: WorkflowOption){
            options.width = options.width? options.width : 30;
            options.height = options.height? options.height : 30;
            super(options);

            this.type = 'parallel_start';
            this.resizable = false;
            this.key = options.key;
        }

        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            let xm: number = points.x2 - points.x1,
                ym: number = points.y2 - points.y1;
            let x = this.x,
                y = this.y,
                xP = this.x + this.width/2,
                yP = this.y + this.height/2,
                xw = this.x + this.width,
                yh = this.y + this.height;

            let angle = Math.atan(yP / xm);
            let result:Point;

            if (xm<0){
                angle += Math.PI;
            }

            ym = ym/Math.abs(ym);

            if (angle > 0 && angle < 1.6){
                if (ym > 0){
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, y));
                } else {
                    result = Loira.util.intersectPointLine(points, new Line(x, yP, xP, yh));
                }
            } else {
                if (ym > 0){
                    result = Loira.util.intersectPointLine(points, new Line(xP, y, xw, yP));
                } else {
                    result = Loira.util.intersectPointLine(points, new Line(xP, yh, xw, yP));
                }
            }

            x = result.x - (this.x + this.width/2);
            y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            Loira.shape.drawDiamond(ctx, x, y, this.width, this.height);

            ctx.fillStyle = "#000000";

            ctx.beginPath();
            ctx.moveTo(x + 12, y + 10);
            ctx.lineTo(x + 12, y + 18);
            ctx.moveTo(x + 18, y + 10);
            ctx.lineTo(x + 18, y + 18);
            ctx.moveTo(x + 12, y + 8);
            ctx.lineTo(x + 18, y + 8);
            ctx.stroke();

            this.drawText(ctx, this.key);
        }

        recalculateBorders() {
        }
    }

    export class ParallelEnd extends ParallelStart{
        constructor(options: WorkflowOption){
            super(options);
            this.type = 'parallel_end';
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            Loira.shape.drawDiamond(ctx, x, y, this.width, this.height);

            ctx.fillStyle = "#000000";

            ctx.beginPath();
            ctx.moveTo(x + 12, y + 10);
            ctx.lineTo(x + 12, y + 18);
            ctx.moveTo(x + 18, y + 10);
            ctx.lineTo(x + 18, y + 18);
            ctx.moveTo(x + 12, y + 20);
            ctx.lineTo(x + 18, y + 20);
            ctx.stroke();

            ctx.fillText(this.key, x + 25, y + Loira.Config.fontSize - 5);
        }

        recalculateBorders() {
        }
    }
}
