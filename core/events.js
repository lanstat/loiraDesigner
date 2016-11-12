var Loira;
(function (Loira) {
    var event;
    (function (event) {
        /**
         * Objeto que encapsula un evento sobre el canvas
         *
         * @type object
         * @property {int} x - Posicion x del puntero
         * @property {int} y - Posicion y del puntero
         * @property {string} type - Tipo de evento
         */
        var mouseEvent = (function () {
            function mouseEvent(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type;
            }
            return mouseEvent;
        }());
        event.mouseEvent = mouseEvent;
        /**
         * Objeto que encapsula un click sobre un objeto
         *
         * @type object
         * @property {object} selected - Objeto seleccionado
         * @property {string} type - Tipo de evento
         */
        var objectEvent = (function () {
            function objectEvent(selected, type) {
                this.selected = selected;
                this.type = type;
            }
            return objectEvent;
        }());
        event.objectEvent = objectEvent;
        /**
         * Objeto que encapsula un evento sobre una relacion
         *
         * @type object
         * @property {object} selected - Relacion seleccionada
         * @property {string} type - Tipo de evento
         */
        var relationEvent = (function () {
            function relationEvent(selected, type) {
                this.selected = selected;
                this.type = type;
            }
            return relationEvent;
        }());
        event.relationEvent = relationEvent;
    })(event = Loira.event || (Loira.event = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=events.js.map