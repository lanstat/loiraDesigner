var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Diagrama de flujo de trabajo
 *
 * @namespace
 */
var Workflow;
(function (Workflow) {
    var BaseOption = Loira.util.BaseOption;
    var Point = Loira.util.Point;
    var WorkflowOption = (function (_super) {
        __extends(WorkflowOption, _super);
        function WorkflowOption() {
            _super.apply(this, arguments);
        }
        return WorkflowOption;
    }(BaseOption));
    var Symbol = (function (_super) {
        __extends(Symbol, _super);
        function Symbol(options) {
            _super.call(this, options);
            this.startPoint = options.startPoint ? options.startPoint : false;
            this.endPoint = options.endPoint ? options.endPoint : false;
        }
        Symbol.prototype._linkSymbol = function () {
            var _this = this;
            var listener = this._canvas.on('mouse:down', function (evt) {
                var canvas = _this._canvas;
                var relations = canvas.getRelationsFromObject(_this, false, true);
                if (!_this.maxOutGoingRelation || (relations.length < _this.maxOutGoingRelation)) {
                    for (var _i = 0, _a = canvas.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.baseType !== 'relation' && !item['startPoint']) {
                            if (item.checkCollision(evt.x, evt.y) && !_this.endPoint) {
                                var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                var points = null;
                                if (_this._uid == item._uid) {
                                    var widthLeft = _this.x + _this.width + 30;
                                    var heightHalf = _this.y + _this.height / 2;
                                    points = [];
                                    points.push(new Point());
                                    points.push(new Point(widthLeft, heightHalf));
                                    points.push(new Point(widthLeft, _this.y - 30));
                                    points.push(new Point(_this.x + _this.width / 2, _this.y - 30));
                                    points.push(new Point());
                                }
                                canvas.add(new instance({ points: points }).update(_this, item));
                                break;
                            }
                        }
                    }
                }
                canvas.fall('mouse:down', listener);
            });
        };
        return Symbol;
    }(Common.Symbol));
    /**
     * Process symbol
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    var Process = (function (_super) {
        __extends(Process, _super);
        function Process(options) {
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _super.call(this, options);
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
        Process.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var angle = Math.atan(ym / xm);
            if (xm < 0) {
                angle += Math.PI;
            }
            var result = { x: 100, y: this.y - 10 };
            if ((angle > this.borders.bottomLeft && angle < this.borders.topLeft) || (angle > this.borders.topRight && angle < this.borders.bottomRight)) {
                result = Loira.util.intersectPointLine(points, { x1: this.x, y1: -100, x2: this.x, y2: 100 });
            }
            else {
                result = Loira.util.intersectPointLine(points, { x1: -100, y1: this.y, x2: 100, y2: this.y });
            }
            var x = result.x - (this.x + this.width / 2);
            var axis = result.y - (this.y + this.height / 2);
            return Math.sqrt(Math.pow(x, 2) + Math.pow(axis, 2));
        };
        Process.prototype._render = function (ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
            ctx.fillStyle = "#000000";
            this.drawText(ctx, this.text);
        };
        Process.prototype.recalculateBorders = function () {
            var xm = Math.round(this.width / 2), ym = Math.round(this.height / 2);
            this.borders.bottomLeft = Math.atan(-ym / xm);
            this.borders.topLeft = Math.atan(ym / xm);
            this.borders.topRight = Math.atan(ym / -xm) + Math.PI;
            this.borders.bottomRight = Math.atan(-ym / -xm) + Math.PI;
        };
        return Process;
    }(Symbol));
    Workflow.Process = Process;
    /**
     * Base symbol for terminators of workflow
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    var Terminator = (function (_super) {
        __extends(Terminator, _super);
        function Terminator() {
            _super.apply(this, arguments);
        }
        Terminator.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        Terminator.prototype._render = function (ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x + 20;
            var y = this.y;
            var xw = this.x + this.width - 20;
            var yh = this.y + this.height;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(x, y);
            ctx.lineTo(xw, y);
            ctx.bezierCurveTo(xw + 30, y, xw + 30, yh, xw, yh);
            ctx.lineTo(x, yh);
            ctx.bezierCurveTo(x - 30, yh, x - 30, y, x, y);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
            ctx.fillStyle = "#000000";
            this.drawText(ctx, this.text);
        };
        Terminator.prototype.recalculateBorders = function () { };
        return Terminator;
    }(Symbol));
    var StartTerminator = (function (_super) {
        __extends(StartTerminator, _super);
        function StartTerminator(options) {
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _super.call(this, options);
            this.text = 'INICIO';
            this.startPoint = true;
            this.maxOutGoingRelation = 1;
            this.type = 'start_terminator';
        }
        return StartTerminator;
    }(Terminator));
    Workflow.StartTerminator = StartTerminator;
    var EndTerminator = (function (_super) {
        __extends(EndTerminator, _super);
        function EndTerminator(options) {
            _super.call(this, options);
            this.width = 70;
            this.height = 30;
            this.text = 'FIN';
            this.endPoint = true;
            this.type = 'end_terminator';
        }
        return EndTerminator;
    }(Terminator));
    Workflow.EndTerminator = EndTerminator;
    /**
     * Data symbol
     *
     * @class
     * @memberof Workflow
     * @augments Common.Symbol
     */
    var Data = (function (_super) {
        __extends(Data, _super);
        function Data(options) {
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _super.call(this, options);
            this.text = options.text;
            this.type = 'data';
        }
        Data.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        Data.prototype._render = function (ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x + 20;
            var y = this.y;
            var xw = this.x + this.width;
            var yh = this.y + this.height;
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
        };
        Data.prototype.recalculateBorders = function () {
        };
        return Data;
    }(Symbol));
    Workflow.Data = Data;
    var Decision = (function (_super) {
        __extends(Decision, _super);
        function Decision(options) {
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _super.call(this, options);
            this.text = options.text;
            this.type = 'decision';
        }
        Decision.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var x = this.x, y = this.y, xP = this.x + this.width / 2, yP = this.y + this.height / 2, xw = this.x + this.width;
            var angle = Math.atan(yP / xm);
            var result;
            if (xm < 0) {
                angle += Math.PI;
            }
            if ((angle > 0 && angle < 1.6) || (angle > 3.15 && angle < 4.7)) {
                result = Loira.util.intersectPointLine(points, { x1: x, y1: yP, x2: xP, y2: y });
            }
            else {
                result = Loira.util.intersectPointLine(points, { x1: xP, y1: y, x2: xw, y2: yP });
            }
            x = result.x - (this.x + this.width / 2);
            y = result.y - (this.y + this.height / 2);
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        };
        Decision.prototype._render = function (ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var x = this.x;
            var y = this.y;
            var xm = this.x + this.width / 2;
            var ym = this.y + this.height / 2;
            var xw = this.x + this.width;
            var yh = this.y + this.height;
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
        };
        Decision.prototype.recalculateBorders = function () {
        };
        return Decision;
    }(Symbol));
    Workflow.Decision = Decision;
})(Workflow || (Workflow = {}));
//# sourceMappingURL=workflow.js.map