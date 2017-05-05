module Loira.event{
    /**
     * Objeto que encapsula un click sobre un objeto
     *
     * @type object
     * @property {object} selected - Objeto seleccionado
     * @property {string} type - Tipo de evento
     */
    export class Event{
    }

    /**
     * Objeto que encapsula un evento sobre el canvas
     *
     * @type object
     * @property {int} x - Posicion x del puntero
     * @property {int} y - Posicion y del puntero
     * @property {string} type - Tipo de evento
     */
    export class MouseEvent extends Event{
        public x: number;
        public y: number;

        constructor(x: number, y:number){
            super();
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Objeto que encapsula un click sobre un objeto
     *
     * @type object
     * @property {object} selected - Objeto seleccionado
     * @property {string} type - Tipo de evento
     */
    export class ObjectEvent extends Event{
        public selected: Loira.Element;
        public type: string;

        constructor(selected: Loira.Element) {
            super();
            this.selected = selected;
        }
    }

    /**
     * Objeto que encapsula un evento sobre una relacion
     *
     * @type object
     * @property {object} selected - Relacion seleccionada
     * @property {string} type - Tipo de evento
     */
    export class RelationEvent extends Event{
        public selected: Common.Relation;

        constructor(selectedRel: Common.Relation) {
            super();
            this.selected = selectedRel;
        }
    }
}
