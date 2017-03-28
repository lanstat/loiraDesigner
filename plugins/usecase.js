var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Diagrama de Caso de uso
 *
 * @namespace
 */
var UseCase;
(function (UseCase_1) {
    /**
     * Simbolo de Caso de uso
     *
     * @class
     * @memberof UseCase
     * @augments Common.Symbol
     */
    var UseCase = (function (_super) {
        __extends(UseCase, _super);
        function UseCase(options) {
            _super.call(this, options);
            this.width = 100;
            this.height = 70;
            this.text = options.text;
            this.type = 'use_case';
        }
        UseCase.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            var a = this.width / 2;
            var b = this.height / 2;
            var ee = a * b / Math.sqrt(a * a * ym * ym + b * b * xm * xm);
            return Math.sqrt(Math.pow(ee * ym, 2) + Math.pow(ee * xm, 2));
        };
        UseCase.prototype._render = function (ctx) {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            if (this.text) {
                var kappa = .5522848, ox = (this.width / 2) * kappa, oy = (this.height / 2) * kappa, xe = this.x + this.width, ye = this.y + this.height, xm = this.x + this.width / 2, ym = this.y + this.height / 2;
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(this.x, ym);
                ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
                ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
                ctx.stroke();
                ctx.fillStyle = "#fcf5d9";
                ctx.fill();
                ctx.fillStyle = "#000000";
                this.drawText(ctx, this.text);
            }
        };
        UseCase.prototype.recalculateBorders = function () {
        };
        return UseCase;
    }(Common.Symbol));
    UseCase_1.UseCase = UseCase;
    /**
     * Contiene las funciones para relacion de extension
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    var Extends = (function (_super) {
        __extends(Extends, _super);
        function Extends(options) {
            options.icon = 'spear1';
            options.text = '<< extends >>';
            options.isDashed = true;
            _super.call(this, options);
            this.type = 'extends';
        }
        return Extends;
    }(Common.Relation));
    UseCase_1.Extends = Extends;
    /**
     * Contiene las funciones para relacion de inclusion
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    var Include = (function (_super) {
        __extends(Include, _super);
        function Include(options) {
            options.icon = 'spear1';
            options.text = '<< include >>';
            options.isDashed = true;
            _super.call(this, options);
            this.type = 'include';
        }
        return Include;
    }(Common.Relation));
    UseCase_1.Include = Include;
})(UseCase || (UseCase = {}));
//# sourceMappingURL=usecase.js.map