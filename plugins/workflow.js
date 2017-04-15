var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WorkflowOption;
    }(BaseOption));
    var Symbol = (function (_super) {
        __extends(Symbol, _super);
        function Symbol(options) {
            var _this = _super.call(this, options) || this;
            _this.startPoint = options.startPoint ? options.startPoint : false;
            _this.endPoint = options.endPoint ? options.endPoint : false;
            return _this;
        }
        Symbol.prototype._linkSymbol = function () {
            var $this = this;
            var listener = this._canvas.on('mouse:down', function (evt) {
                var canvas = $this._canvas;
                if (!$this.maxOutGoingRelation || (canvas.getRelationsFromObject($this, false, true).length < $this.maxOutGoingRelation)) {
                    for (var _i = 0, _a = canvas.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.baseType !== 'relation' && !item['startPoint']) {
                            if (item.checkCollision(evt.x, evt.y) && !$this.endPoint) {
                                var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                var points = null;
                                if ($this._uid == item._uid) {
                                    var widthLeft = $this.x + $this.width + 30;
                                    var heightHalf = $this.y + $this.height / 2;
                                    points = [];
                                    points.push(new Point());
                                    points.push(new Point(widthLeft, heightHalf));
                                    points.push(new Point(widthLeft, $this.y - 30));
                                    points.push(new Point($this.x + $this.width / 2, $this.y - 30));
                                    points.push(new Point());
                                }
                                canvas.add(new instance({ points: points }).update($this, item));
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
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = options.text;
            _this.type = 'process';
            _this.borders = {
                bottomLeft: 0,
                topLeft: 0,
                topRight: 0,
                bottomRight: 0
            };
            _this.recalculateBorders();
            _this.maxOutGoingRelation = 1;
            return _this;
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
        Process.prototype.render = function (ctx) {
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
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Terminator.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        Terminator.prototype.render = function (ctx) {
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
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = 'INICIO';
            _this.startPoint = true;
            _this.maxOutGoingRelation = 1;
            _this.type = 'start_terminator';
            return _this;
        }
        return StartTerminator;
    }(Terminator));
    Workflow.StartTerminator = StartTerminator;
    var EndTerminator = (function (_super) {
        __extends(EndTerminator, _super);
        function EndTerminator(options) {
            var _this = _super.call(this, options) || this;
            _this.width = 70;
            _this.height = 30;
            _this.text = 'FIN';
            _this.endPoint = true;
            _this.type = 'end_terminator';
            return _this;
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
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = options.text;
            _this.type = 'data';
            return _this;
        }
        Data.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        Data.prototype.render = function (ctx) {
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
            var _this = this;
            options.width = options.width ? options.width : 100;
            options.height = options.height ? options.height : 70;
            _this = _super.call(this, options) || this;
            _this.text = options.text;
            _this.type = 'decision';
            return _this;
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
        Decision.prototype.render = function (ctx) {
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