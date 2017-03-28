/**
 * Created by juan.garson on 27/03/2017.
 */
var Loira;
(function (Loira) {
    var drawable;
    (function (drawable) {
        var regions;
        var image;
        function registerMap(path, regions, callback) {
            this.image = new Image();
            this.image.src = path;
            this.image.onload = function () {
                callback();
            };
            this.regions = regions;
        }
        drawable.registerMap = registerMap;
        function render(id, canvas, x, y) {
            var region = this.regions[id];
            canvas.drawImage(this.image, region.x, region.y, region.width, region.height, x, y, region.width, region.height);
        }
        drawable.render = render;
        function get(id) {
            return this.regions[id];
        }
        drawable.get = get;
    })(drawable = Loira.drawable || (Loira.drawable = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=drawable.js.map