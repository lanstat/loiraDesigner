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
var Box;
(function (Box_1) {
    var ColorOption = (function (_super) {
        __extends(ColorOption, _super);
        function ColorOption() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ColorOption;
    }(Loira.util.BaseOption));
    /**
     * Class for color square
     *
     * @memberof Box
     * @class Box
     * @augments Loira.Element
     */
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(options) {
            var _this = _super.call(this, options) || this;
            _this.width = 'width' in options ? options.width : 30;
            _this.height = 'height' in options ? options.height : 30;
            _this.color = 'color' in options ? options.color : 'rgba(0,0,0,0.3)';
            _this.baseType = 'box';
            return _this;
        }
        Box.prototype._render = function (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillText(this.text, this.x, this.y - 10);
        };
        Box.prototype.recalculateBorders = function () {
        };
        return Box;
    }(Loira.Element));
    Box_1.Box = Box;
})(Box || (Box = {}));
//# sourceMappingURL=box.js.map