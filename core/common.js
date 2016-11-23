var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common;
(function (Common) {
    var Point = Loira.util.Point;
    var Relation = (function (_super) {
        __extends(Relation, _super);
        function Relation(options) {
            _super.call(this, options);
            this.start = options.start ? options.start : null;
            this.end = options.end ? options.end : null;
            this.isDashed = options.isDashed ? options.isDashed : false;
            this.points = options.points ? options.points : [new Point(), new Point()];
            this.img = null;
            if (options.icon) {
                this.img = document.createElement('IMG');
                this.img.src = Loira.Config.assetsPath + options.icon;
            }
            this.baseType = 'relation';
        }
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        Relation.prototype._render = function (ctx) {
            var start = this.start, end = this.end, tmp, init, last, xm, ym;
            this.points[0] = { x: start.x + start.width / 2, y: start.y + start.height / 2 };
            this.points[this.points.length - 1] = { x: end.x + end.width / 2, y: end.y + end.height / 2 };
            init = this.points[0];
            last = this.points[1];
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(init.x, init.y);
            if (this.isDashed) {
                ctx.setLineDash([5, 5]);
            }
            for (var i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
            if (this.img) {
                init = this.points[this.points.length - 2];
                last = this.points[this.points.length - 1];
                xm = last.x - init.x;
                ym = last.y - init.y;
                tmp = Math.atan(ym / xm);
                if (xm < 0) {
                    tmp += Math.PI;
                }
                ctx.translate(last.x, last.y);
                ctx.rotate(tmp);
                ctx.drawImage(this.img, -(15 + end.obtainBorderPos(xm, ym, { x1: init.x, y1: init.y, x2: last.x, y2: last.y }, ctx)), -7);
                ctx.rotate(-tmp);
                ctx.translate(-last.x, -last.y);
            }
            if (this.text || this.text.length > 0) {
                ctx.font = "10px " + Loira.Config.fontType;
                init = this.points[0];
                last = this.points[1];
                xm = last.x - init.x;
                ym = last.y - init.y;
                tmp = ctx.measureText(this.text).width;
                ctx.fillStyle = Loira.Config.background;
                ctx.fillRect(init.x + xm / 2 - tmp / 2, init.y + ym / 2 - 15, tmp, 12);
                ctx.fillStyle = "#000000";
                ctx.fillText(this.text, init.x + xm / 2 - tmp / 2, init.y + ym / 2 - 5);
                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            }
        };
        Relation.prototype.recalculateBorders = function () {
        };
        /**
         * Actualiza los objeto de origen y objetivo de la relacion
         *
         * @memberof Common.Relation#
         * @param { Object } start Objeto origen
         * @param { Object } end Objeto objetivo
         * @chainable
         * @returns {Common.Relation}
         */
        Relation.prototype.update = function (start, end) {
            this.start = start;
            this.end = end;
            return this;
        };
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Common.Relation#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        Relation.prototype.checkCollision = function (x, y) {
            var init = null, last = null;
            var xd = 0, yd = 0;
            var point1 = { x: 0, y: 0 };
            var point2 = { x: 0, y: 0 };
            var m;
            for (var i = 1; i < this.points.length; i++) {
                init = this.points[i - 1];
                last = this.points[i];
                point1.x = init.x;
                point1.y = init.y;
                point2.y = last.y;
                point2.x = last.x;
                if (init.x > last.x) {
                    point1.x = last.x;
                    point2.x = init.x;
                }
                if (init.y > last.y) {
                    point1.y = last.y;
                    point2.y = init.y;
                }
                if (x > point1.x - 5 && x < point2.x + 5 && y > point1.y - 5 && y < point2.y + 5) {
                    yd = Math.abs(last.y - init.y);
                    xd = Math.abs(last.x - init.x);
                    x = Math.abs(x - init.x);
                    y = Math.abs(y - init.y);
                    if (xd > yd) {
                        m = Math.abs((yd / xd) * x);
                        if ((m === 0 && (y > point1.y && y < point2.y)) || (m > y - 8 && m < y + 8)) {
                            return true;
                        }
                    }
                    else {
                        m = Math.abs((xd / yd) * y);
                        if ((m === 0 && (x > point1.x && x < point2.x)) || (m > x - 8 && m < x + 8)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        Relation.prototype.drawSelected = function (ctx) {
            ctx.beginPath();
            ctx.fillStyle = Loira.Config.selected.color;
            for (var i = 0; i < this.points.length; i++) {
                ctx.fillRect(this.points[i].x - 4, this.points[i].y - 4, 8, 8);
            }
            ctx.strokeStyle = '#000000';
        };
        Relation.prototype.addPoint = function () {
            var _this = this;
            var last = _this.points[1], init = _this.points[0];
            var x = Math.round((last.x - init.x) / 2) + init.x;
            var y = Math.round((last.y - init.y) / 2) + init.y;
            _this.points.splice(1, 0, { x: x, y: y });
        };
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Common.Relation#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {string}
         */
        Relation.prototype.getSelectedCorner = function (pX, pY) {
            for (var i = 1; i < this.points.length - 1; i++) {
                var x = this.points[i].x - 4, y = this.points[i].y - 4, w = x + 8, h = y + 8;
                if (pX > x && pX < w && pY > y && pY < h) {
                    return i;
                }
            }
            return false;
        };
        /**
         * Mueve un punto de la relacion
         *
         * @memberof Common.Relation#
         * @param point Indice del punto a mover
         * @param x Delta de x
         * @param y Delta de y
         */
        Relation.prototype.movePoint = function (point, x, y) {
            this.points[point].x += x;
            this.points[point].y += y;
        };
        return Relation;
    }(Loira.Element));
    Common.Relation = Relation;
    var Symbol = (function (_super) {
        __extends(Symbol, _super);
        function Symbol(options) {
            _super.call(this, options);
            var link = this._linkSymbol;
            this.on({
                icon: Loira.Config.assetsPath + 'arrow.png',
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
        Symbol.prototype._linkSymbol = function () {
            var _this = this;
            var listener = this._canvas.on('mouse:down', function (evt) {
                var canvas = _this._canvas;
                var relations = canvas.getRelationsFromObject(_this, false, true);
                if (!_this.maxOutGoingRelation || (relations.length < _this.maxOutGoingRelation)) {
                    for (var _i = 0, _a = canvas.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.baseType !== 'relation') {
                            if (item.checkCollision(evt.x, evt.y)) {
                                var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                canvas.add(new instance({}).update(_this, item));
                                break;
                            }
                        }
                    }
                }
                canvas.fall('mouse:down', listener);
            });
        };
        Symbol.prototype._splitText = function (ctx, text, padding) {
            if (padding === void 0) { padding = 10; }
            var words = text.split(' ');
            var buff = '';
            var lines = [];
            for (var i = 0; i < words.length; i++) {
                if (ctx.measureText(buff + words[i]).width > this.width - padding) {
                    lines.push(buff);
                    buff = words[i] + ' ';
                }
                else {
                    buff = buff + ' ' + words[i];
                }
            }
            lines.push(buff);
            return lines;
        };
        Symbol.prototype.drawText = function (ctx, line, horiAlign, vertAlign) {
            var y, xm = this.x + this.width / 2, ym = this.y + this.height / 2, lines;
            lines = this._splitText(ctx, line);
            y = ym + 3 - ((6 * lines.length + 3 * lines.length) / 2);
            for (var i = 0; i < lines.length; i++) {
                var textW = ctx.measureText(lines[i]).width;
                ctx.fillText(lines[i], xm - textW / 2, y + 3);
                y = y + Loira.Config.fontSize + 3;
            }
        };
        return Symbol;
    }(Loira.Element));
    Common.Symbol = Symbol;
    var Actor = (function (_super) {
        __extends(Actor, _super);
        function Actor(options) {
            _super.call(this, options);
            this.img = document.createElement('IMG');
            this.img.src = Loira.Config.assetsPath + 'actor.png';
            this.img.onload = function () { };
            this.text = options.text ? options.text : 'Actor1';
            this.width = 30;
            this.height = 85;
            this.type = 'actor';
        }
        Actor.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width) {
                this.x = this.x + this.width / 2 - textW / 2;
                this.width = textW;
            }
            var angle = Math.atan(ym / xm);
            if (xm < 0) {
                angle += Math.PI;
            }
            var result = { x: 100, y: this.y - 10 };
            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)) {
                result = Loira.util.intersectPointLine(points, { x1: this.x, y1: -100, x2: this.x, y2: 100 });
            }
            else {
                result = Loira.util.intersectPointLine(points, { x1: -100, y1: this.y, x2: 100, y2: this.y });
            }
            var x = result.x - (this.x + this.width / 2);
            var y = result.y - (this.y + this.height / 2);
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        };
        Actor.prototype._render = function (ctx) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width) {
                this.x = this.x + this.width / 2 - textW / 2;
                this.width = textW;
            }
            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";
            ctx.drawImage(this.img, this.x + this.width / 2 - 15, this.y);
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#000000";
            ctx.fillText(this.text, this.x, this.y + 80);
        };
        Actor.prototype.recalculateBorders = function () {
        };
        return Actor;
    }(Common.Symbol));
    Common.Actor = Actor;
})(Common || (Common = {}));
//# sourceMappingURL=common.js.map