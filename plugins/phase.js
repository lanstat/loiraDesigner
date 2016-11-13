var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Diagrama de estados
 *
 * @namespace
 */
var Phase;
(function (Phase_1) {
    /**
     * Crea un nuevo Objeto de Estado
     *
     * @class
     * @memberof Phase
     */
    var Phase = (function (_super) {
        __extends(Phase, _super);
        function Phase(options) {
            _super.call(this, options);
            this.width = 200;
            this.height = 100;
        }
        Phase.prototype.obtainBorderPos = function (xm, ym, points, ctx) {
            return undefined;
        };
        Phase.prototype._render = function (ctx) {
            var kappa = .5522848, ox = this.width * kappa, oy = this.height * kappa, xe = this.x + this.width, ye = this.y + this.height, xm = this.x + this.width / 2, ym = this.y + this.height / 2;
            ctx.beginPath();
            ctx.moveTo(this.x, ym);
            ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
            ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
        };
        Phase.prototype.recalculateBorders = function () {
        };
        return Phase;
    }(Common.Symbol));
    Phase_1.Phase = Phase;
})(Phase || (Phase = {}));
//# sourceMappingURL=phase.js.map