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
        labelId?: string;
    }

    export class Controller extends BaseController {
        private iteratorKey: number=0;
        private canvas: Loira.Canvas;

        bind(canvas: Loira.Canvas) {
            let scope = this;
            this.canvas = canvas;

            canvas.defaultRelation = 'Workflow.Association';

            canvas.on(Loira.event.OBJECT_PRE_ADD, function(evt){
                /*if (evt.selected.type === 'start_terminator'){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'Existe ya un inicio de flujo'});
                    return false;
                }*/
                if (evt.selected.type === 'parallel_start' ||
                    evt.selected.type === 'parallel_end' ||
                    evt.selected.type === 'mono_parallel_start' ||
                    evt.selected.type === 'mono_parallel_end'){
                    for (let item of canvas.items){
                        if (item.type == evt.selected.type && item['key'] == evt.selected.key){
                            canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'Existe un nodo con la misma llave en el diagrama.'});
                            return false;
                        }
                    }
                }
            });

            canvas.on(Loira.event.RELATION_PRE_ADD, function(evt){
                if ((evt.selected.end.type === 'parallel_start' ||
                    evt.selected.end.type === 'mono_parallel_start') &&
                    evt.selected.type === 'returns'){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'No es posible retornar a un nodo inicio de paralelismo.'});
                    return false;
                }

                if ((evt.selected.start.type === 'parallel_start' ||
                    evt.selected.start.type === 'parallel_end' ||
                    evt.selected.start.type === 'mono_parallel_start' ||
                    evt.selected.start.type === 'mono_parallel_end') &&
                    evt.selected.type === 'returns'){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'No es posible retornar desde un nodo de paralelismo.'});
                    return false;
                }

                if ((evt.selected.start.type === 'mono_parallel_start') &&
                    (evt.selected.end.type !== 'process' &&
                     evt.selected.end.type !== 'decision')){
                    canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'El siguiente estado de un nodo de paralelismo monotarea debe ser decisi\u00F3n o proceso.'});
                    return false;
                }

                if ((evt.selected.start.type === 'fork_parallel') &&
                    (evt.selected.type === 'workflow_fork_continuity')){

                    let relations: Common.Relation[] = canvas.getRelationsFromObject(evt.selected.start, false, true);

                    for (let relation of relations){
                        if (relation.type === 'workflow_fork_continuity'){
                            canvas.emit(Loira.event.ERROR_MESSAGE, {message: 'Ya existe una relaci\u00F3n de continuidad para el nodo de bifurcaci\u00F3n.'});
                            return false;
                        }
                    }
                }
            });

            canvas.on(Loira.event.OBJECT_ADDED, function(evt){
                if ((evt.selected.type === 'parallel_start' || evt.selected.type === 'mono_parallel_start') && !evt.selected.label){
                    scope.iteratorKey++;
                    evt.selected.label = scope.iteratorKey;
                }
            });
        };

        load(data: any) {
        };

        exportData(): any {
            return undefined;
        };

        defineLabelId(): void{
            let data = {};

            for (let item of this.canvas.items){
                if (item.type === 'parallel_start' || item.type === 'mono_parallel_start'){
                    if (!data[item['key']]){
                        data[item['key']] = item['label'];
                    }
                }
            }

            for (let item of this.canvas.items){
                if (item.type === 'parallel_end' || item.type === 'mono_parallel_end'){
                    item['label'] = data[item['key']];
                }
            }
        }
    }

    export abstract class Symbol extends Common.Symbol{
        protected startPoint: boolean;
        protected endPoint: boolean;

        constructor(options: WorkflowOption){
            super(options);

            this.startPoint = options.startPoint? options.startPoint: false;
            this.endPoint = options.endPoint? options.endPoint: false;
            let scope = this;

            this.menu = [
                {text: Loira.Config.workflow.menu.joinTo, callback: function(){
                    scope._linkSymbol();
                }},
                {text: Loira.Config.workflow.menu.deleteBtn, callback: function(){
                    scope._canvas.remove([scope]);
                }},
                /*null,
                {text: 'Editar texto', callback: function(){
                    scope._canvas.showEditor({x:scope.x, y: scope.y, width: scope.width, height: scope.height}, scope.text, function (text) {
                        scope.text = text;
                    });
                }},
                null,
                {text:Loira.Config.workflow.menu.property, callback: function(){
                    scope._canvas.emit(EVT_OPEN_PROPERTY, new ObjectEvent(scope));
                }}*/
            ];
        }

        protected _linkSymbol(defaultRelation?: string): void{
            let $this = this;
            const nextRelation: string = defaultRelation? defaultRelation : this._canvas.defaultRelation;
            let  listener = this._canvas.on(
                'mouse:down', function(evt){
                    let canvas:Loira.Canvas = $this._canvas;

                    if (!$this.maxOutGoingRelation || (canvas.getRelationsFromObject($this, false, true).length < $this.maxOutGoingRelation)){
                        for (let item of canvas.items) {
                            if (item.baseType !== 'relation' && !item['startPoint']){
                                if(item.checkCollision(evt.x, evt.y) && !$this.endPoint){
                                    let instance = Loira.util.stringToFunction(nextRelation);

                                    canvas.add(new instance({start: $this, end: item}));
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

            this.drawText(ctx, this.text, vX, vY);
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

            this.drawText(ctx, this.text, vX, vY);
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
            this.resizable = false;

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
            this.resizable = false;
        }
    }

    /**
     * Base symbol for terminators of workflow
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    export class ThreadTerminator extends Symbol{
        constructor(options: WorkflowOption){
            super(options);
            this.width = 70;
            this.height = 30;
            this.text = 'FIN';
            this.endPoint = true;
            this.type = 'end_thread_terminator';
            this.resizable = false;
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
            ctx.setLineDash([5, 5]);

            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
            ctx.fillStyle = "#000000";

            this.drawText(ctx, this.text, vX, vY);
        }

        recalculateBorders() {}

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

            this.drawText(ctx, this.text, vX, vY);
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

            this.drawText(ctx, this.text, vX, vY);
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
            options.text = options.text || '<<returns>>';
            options.isDashed = true;

            super(options);
            this.type = 'returns';
            let scope = this;

            this.menu = [
                {text:'Partir', callback: function(){
                    scope.addPoint();
                }},
                {text:'Borrar', callback: function(){
                    scope._canvas.remove([scope]);
                }}
            ];

            this.pointMenu = [
                {text:'Borrar punto', callback: function(){
                    scope.removePoint(scope.selectedArea);
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
                }}/*,
                null,
                {text:'Propiedades', callback: function(){
                    scope._canvas.emit(EVT_OPEN_PROPERTY, new ObjectEvent(scope));
                }}*/
            ];

            this.pointMenu = [
                {text:'Borrar punto', callback: function(){
                    scope.removePoint(scope.selectedArea);
                }}
            ]
        }
    }

    export abstract class ParallelBase extends Symbol{
        public label: string;
        public key: string;
        protected unDefined: string;

        constructor(options: WorkflowOption){
            options.width = options.width? options.width : 30;
            options.height = options.height? options.height : 30;
            super(options);

            this.unDefined  = 'No definido';
            this.resizable = false;
            this.key = options.key;
            this.label = options.labelId;
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
            ctx.font = 'bold ' + Loira.Config.fontSize + "px " + Loira.Config.fontType;

            let x = this.x - vX;
            let y = this.y - vY;
            Loira.shape.drawDiamond(ctx, x, y, this.width, this.height);

            this.renderCustom(ctx, x, y);
        }

        abstract renderCustom(ctx: CanvasRenderingContext2D, vX: number, vY: number): void;

        recalculateBorders() {
        }
    }

    export class ParallelStart extends ParallelBase{
        constructor(options: WorkflowOption){
            super(options);

            this.type = 'parallel_start';
            this.key = this.key || Loira.util.createRandom(5);
            let scope = this;

            this.menu.push(null);
            this.menu.push({
                text:'Agregar punto de fin', callback: function(){
                    scope._canvas.add([new Workflow.ParallelEnd({x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label})]);
                }}
            );
        }

        renderCustom(ctx: CanvasRenderingContext2D, x: number, y: number): void{
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
        }
    }

    export class ParallelEnd extends ParallelBase{
        constructor(options: WorkflowOption){
            super(options);

            this.type = 'parallel_end';
            this.maxOutGoingRelation = 1;
            let scope = this;

            this.menu.push(null);
            this.menu.push({
                text:'Agregar punto de inicio', callback: function(){
                    scope._canvas.add([new Workflow.ParallelStart({x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label})]);
                }}
            );
        }

        renderCustom(ctx: CanvasRenderingContext2D, x: number, y: number): void{
            ctx.beginPath();
            ctx.arc(x + 15, y + 15, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            ctx.fillStyle = '#FF0000';
            ctx.fillText(this.label || this.unDefined, x + 25, y + Loira.Config.fontSize - 5);
        }
    }

    export class MonoParallelStart extends ParallelBase{
        constructor(options: WorkflowOption){
            super(options);

            this.type = 'mono_parallel_start';
            this.key = this.key || Loira.util.createRandom(5);
            let scope = this;
            this.maxOutGoingRelation = 1;

            this.menu.push(null);
            this.menu.push({
                text:'Agregar punto de fin', callback: function(){
                    scope._canvas.add([new Workflow.MonoParallelEnd({x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label})]);
                }}
            );
        }

        renderCustom(ctx: CanvasRenderingContext2D, x: number, y: number): void{
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
        }
    }

    export class MonoParallelEnd extends ParallelBase{
        constructor(options: WorkflowOption){
            super(options);

            this.type = 'mono_parallel_end';
            this.maxOutGoingRelation = 1;
            let scope = this;

            this.menu.push(null);
            this.menu.push({
                text:'Agregar punto de inicio', callback: function(){
                    scope._canvas.add([new Workflow.MonoParallelStart({x: scope.x, y: scope.y + 50, key: scope.key, labelId: scope.label})]);
                }}
            );
        }

        renderCustom(ctx: CanvasRenderingContext2D, x: number, y: number): void{
            ctx.beginPath();
            ctx.rect(x + 10, y + 10, 10, 10);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            ctx.fillStyle = '#FF0000';
            ctx.fillText(this.label || this.unDefined, x + 25, y + Loira.Config.fontSize - 5);
        }
    }

    export class Fork extends ParallelBase{
        constructor(options: WorkflowOption){
            super(options);

            this.type = 'fork_parallel';
            this.key = this.key || Loira.util.createRandom(5);
            let scope = this;

            this.menu.push(null);
            this.menu.push({
                text:'Agregar via de continuidad', callback: function(){
                    scope._linkSymbol('Workflow.ForkContinuity');
                }}
            );
        }

        renderCustom(ctx: CanvasRenderingContext2D, x: number, y: number): void{
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(x + 15, y + 8);
            ctx.lineTo(x + 8, y + 20);
            ctx.moveTo(x + 15, y + 10);
            ctx.lineTo(x + 15, y + 20);
            ctx.moveTo(x + 15, y + 10);
            ctx.lineTo(x + 22, y + 20);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    }

    export class ForkContinuity extends Workflow.Association {
        constructor(options: RelOption){
            options.icon = 'arrow';
            options.isDashed = true;

            super(options);
            this.type = 'workflow_fork_continuity';
        }
    }
}
