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
        var MouseEvent = (function () {
            function MouseEvent(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type;
            }
            return MouseEvent;
        }());
        event.MouseEvent = MouseEvent;
        /**
         * Objeto que encapsula un click sobre un objeto
         *
         * @type object
         * @property {object} selected - Objeto seleccionado
         * @property {string} type - Tipo de evento
         */
        var ObjectEvent = (function () {
            function ObjectEvent(selected, type) {
                this.selected = selected;
                this.type = type;
            }
            return ObjectEvent;
        }());
        event.ObjectEvent = ObjectEvent;
        /**
         * Objeto que encapsula un evento sobre una relacion
         *
         * @type object
         * @property {object} selected - Relacion seleccionada
         * @property {string} type - Tipo de evento
         */
        var RelationEvent = (function () {
            function RelationEvent(selected, type) {
                this.selected = selected;
                this.type = type;
            }
            return RelationEvent;
        }());
        event.RelationEvent = RelationEvent;
    })(event = Loira.event || (Loira.event = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=events.js.map