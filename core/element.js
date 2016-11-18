var Loira;
(function (Loira) {
    var BaseOption = Loira.util.BaseOption;
    /**
     * Clase base para la creacion de nuevos objetos dibujables
     *
     * @memberof Loira
     * @class Element
     */
    var Element = (function () {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Loira.Element#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        function Element(options) {
            this._uid = Loira.util.createRandom(8);
            if (typeof options === 'undefined') {
                options = new BaseOption();
            }
            this.x = 'x' in options ? options.x : 0;
            this.y = 'y' in options ? options.y : 0;
            this.width = 'width' in options ? options.width : 0;
            this.height = 'height' in options ? options.height : 0;
            this.centerObject = 'centerObject' in options ? options.centerObject : false;
            this.maxOutGoingRelation = 'maxOutGoingRelation' in options ? options.maxOutGoingRelation : 0;
            this.extras = 'extras' in options ? options.extras : {};
            this.text = options.text ? options.text : '';
            this._buttons = [];
            this._canvas = null;
            this.type = '';
            this.baseType = '';
        }
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        Element.prototype.checkCollision = function (x, y) {
            return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
        };
        /**
         * Agrega iconos laterales del objeto con sus respectivos escuchadores
         *
         * @memberof Loira.Object#
         * @param {Array.<Object>} args Iconos laterales a agregar
         */
        Element.prototype.on = function (args) {
            args = [].splice.call(arguments, 0);
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var button = args_1[_i];
                var img = document.createElement('IMG');
                img.src = button.icon;
                this._buttons.push({ 'icon': img, 'click': button.click });
            }
        };
        /**
         * Renderiza los iconos de los botones laterales
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        Element.prototype._renderButtons = function (ctx) {
            var x = this.x + this.width + 10;
            var y = this.y;
            if (this._buttons.length > 0) {
                this._buttons.forEach(function (item) {
                    ctx.drawImage(item.icon, x, y);
                    y += item.icon.height + 4;
                });
            }
        };
        /**
         * Ejecuta el escuchador de algun icono lateral encontrado por el punto
         *
         * @memberof Loira.Object#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         * @private
         */
        Element.prototype.callCustomButton = function (x, y) {
            var _x = this.x + this.width + 10;
            var _y = this.y;
            for (var _i = 0, _a = this._buttons; _i < _a.length; _i++) {
                var item = _a[_i];
                if (_x <= x && x <= _x + item.icon.width && _y <= y && y <= _y + item.icon.height) {
                    item.click.call(this);
                    return true;
                }
                _y += item.icon.height + 4;
            }
            return false;
        };
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Loira.Object#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        Element.prototype.drawSelected = function (ctx) {
            var x = this.x - 2, y = this.y - 2, w = this.width, h = this.height;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = Loira.Config.selected.color;
            ctx.rect(x, y, w + 4, h + 4);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = Loira.Config.selected.color;
            ctx.fillRect(x - 4, y - 4, 8, 8);
            ctx.fillRect(x + w, y + h, 8, 8);
            ctx.fillRect(x + w, y - 4, 8, 8);
            ctx.fillRect(x - 4, y + h, 8, 8);
            ctx.fillRect(x + w / 2, y - 4, 8, 8);
            ctx.fillRect(x + w / 2, y + h, 8, 8);
            ctx.fillRect(x - 4, y + h / 2, 8, 8);
            ctx.fillRect(x + w, y + h / 2, 8, 8);
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = '#000000';
        };
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Loira.Object#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {any}
         */
        Element.prototype.getSelectedCorner = function (pX, pY) {
            var x = this.x - 2, y = this.y - 2, w = this.width, h = this.height, mw = w / 2, mh = h / 2;
            if (x - 4 <= pX && pX <= x + 4 && y - 4 <= pY && pY <= y + 4)
                return 'tl';
            if (x + w <= pX && x + w + 8 >= pX && y - 4 <= pY && y + 4 >= pY)
                return 'tr';
            if (x + w <= pX && x + w + 8 >= pX && y + h <= pY && y + h + 8 >= pY)
                return 'br';
            if (x - 4 <= pX && x + 4 >= pX && y + h <= pY && y + h + 8 >= pY)
                return 'bl';
            if (x + mw <= pX && x + mw + 8 >= pX && y - 4 <= pY && y + 4 >= pY)
                return 'tc';
            if (x + mw <= pX && x + mw + 8 >= pX && y + h <= pY && y + h + 8 >= pY)
                return 'bc';
            if (x - 4 <= pX && x + 4 >= pX && y + mh <= pY && y + mh + 8 >= pY)
                return 'ml';
            if (x + w <= pX && x + w + 8 >= pX && y + mh <= pY && y + mh + 8 >= pY)
                return 'mr';
            return '';
        };
        /**
         * Muestra el objeto si el canvas se encuentra en un contenedor
         *
         * @memberof Loira.Object#
         */
        Element.prototype.show = function () {
            var _this = this;
            if (this._canvas && this._canvas._canvasContainer) {
                var pX = (_this.x + _this.width / 2) - this._canvas._canvasContainer.element.offsetWidth / 2;
                var pY = (_this.y + _this.height / 2) - this._canvas._canvasContainer.element.offsetHeight / 2;
                pX = pX >= 0 ? pX : 0;
                pY = pY >= 0 ? pY : 0;
                this._canvas._canvasContainer.x = pX;
                this._canvas._canvasContainer.y = pY;
                this._canvas._canvasContainer.element.scrollTop = pY;
                this._canvas._canvasContainer.element.scrollLeft = pX;
            }
        };
        return Element;
    }());
    Loira.Element = Element;
})(Loira || (Loira = {}));
//# sourceMappingURL=element.js.map