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
 * Clase base para la creacion de nuevos objetos dibujables
 *
 * @memberof Loira
 * @namespace util
 */
var Loira;
(function (Loira) {
    var util;
    (function (util) {
        var BaseOption = (function () {
            function BaseOption() {
            }
            return BaseOption;
        }());
        util.BaseOption = BaseOption;
        var RelOption = (function (_super) {
            __extends(RelOption, _super);
            function RelOption() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RelOption;
        }(BaseOption));
        util.RelOption = RelOption;
        var Line = (function () {
            function Line() {
            }
            return Line;
        }());
        util.Line = Line;
        var Region = (function () {
            function Region() {
            }
            return Region;
        }());
        util.Region = Region;
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            return Point;
        }());
        util.Point = Point;
        /**
         * Crea una cadena con caracteres aleatorios
         *
         * @param maxLength Longitud de la cadena
         * @returns {string}
         */
        function createRandom(maxLength) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < maxLength; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        util.createRandom = createRandom;
        /**
         * Determina la el punto de intereseccion entre 2 lineas
         *
         * @param line1 Linea 1
         * @param line2 Linea 2
         * @returns {*}
         */
        function intersectPointLine(line1, line2) {
            var den = ((line1.y2 - line1.y1) * (line2.x2 - line2.x1)) - ((line1.x2 - line1.x1) * (line2.y2 - line2.y1));
            if (den === 0) {
                return false;
            }
            var a = line2.y1 - line1.y1;
            var b = line2.x1 - line1.x1;
            var numerator1 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);
            a = numerator1 / den;
            return { x: line2.x1 + (a * (line2.x2 - line2.x1)), y: line2.y1 + (a * (line2.y2 - line2.y1)) };
        }
        util.intersectPointLine = intersectPointLine;
        /**
         * Instancia una clase tomando una cadena como base
         *
         * @param str Nombre de la clase, o espacio de nombre a instanciar
         * @returns {*}
         */
        function stringToFunction(str) {
            var arr = str.split(".");
            var fn = (window || this);
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var part = arr_1[_i];
                fn = fn[part];
            }
            if (typeof fn !== "function") {
                throw new Error("function not found");
            }
            return fn;
        }
        util.stringToFunction = stringToFunction;
    })(util = Loira.util || (Loira.util = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=utils.js.map