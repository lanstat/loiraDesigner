/**
 * Created by juan.garson on 27/03/2017.
 */
var Loira;
(function (Loira) {
    var Drawable = (function () {
        function Drawable(path, regions, callback) {
            this.image = new Image();
            this.image.src = path;
            this.image.onload = function () {
                callback();
            };
            this.regions = regions;
        }
        Drawable.prototype.render = function (id, canvas, x, y) {
            var region = this.regions[id];
            canvas.drawImage(this.image, region.x, region.y, region.width, region.height, x, y, region.width, region.height);
        };
        return Drawable;
    }());
    Loira.Drawable = Drawable;
})(Loira || (Loira = {}));
//# sourceMappingURL=drawable.js.map