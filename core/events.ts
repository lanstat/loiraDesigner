module Loira.event{
    /**
     * Objeto que encapsula un evento sobre el canvas
     *
     * @type object
     * @property {int} x - Posicion x del puntero
     * @property {int} y - Posicion y del puntero
     * @property {string} type - Tipo de evento
     */
    export class mouseEvent{
        public x: number;
        public y: number;
        public type: string;

        constructor(x: number, y:number, type: string){
            this.x = x;
            this.y = y;
            this.type = type;
        }
    }

    /**
     * Objeto que encapsula un click sobre un objeto
     *
     * @type object
     * @property {object} selected - Objeto seleccionado
     * @property {string} type - Tipo de evento
     */
    export class objectEvent{
        public selected: Common.Symbol;
        public type: string;

        constructor(selected: Common.Symbol, type: string) {
            this.selected = selected;
            this.type = type;
        }
    }

    /**
     * Objeto que encapsula un evento sobre una relacion
     *
     * @type object
     * @property {object} selected - Relacion seleccionada
     * @property {string} type - Tipo de evento
     */
    export class relationEvent{
        public selected: Common.Relation;
        public type: string;

        constructor(selected: Common.Relation, type: string) {
            this.selected = selected;
            this.type = type;
        }
    }
}
