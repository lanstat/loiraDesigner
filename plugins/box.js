var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Box;
(function (Box_1) {
    var ColorOption = (function (_super) {
        __extends(ColorOption, _super);
        function ColorOption() {
            _super.apply(this, arguments);
        }
        return ColorOption;
    }(Loira.util.BaseOption));
    /**
     * Class for color square
     *
     * @memberof Box
     * @class Box
     * @augments Loira.Object
     */
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(options) {
            _super.call(this, options);
            this.width = 'width' in options ? options.width : 30;
            this.height = 'height' in options ? options.height : 30;
            this.color = 'color' in options ? options.color : 'rgba(0,0,0,0.3)';
            this.baseType = 'box';
        }
        Box.prototype._render = function (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";
        };
        Box.prototype.recalculateBorders = function () {
        };
        return Box;
    }(Loira.Element));
    Box_1.Box = Box;
})(Box || (Box = {}));
//# sourceMappingURL=box.js.map