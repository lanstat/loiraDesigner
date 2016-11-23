module Loira.event{
    /**
     * Objeto que encapsula un evento sobre el canvas
     *
     * @type object
     * @property {int} x - Posicion x del puntero
     * @property {int} y - Posicion y del puntero
     * @property {string} type - Tipo de evento
     */
    export class MouseEvent{
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
    export class ObjectEvent{
        public selected: Loira.Element;
        public type: string;

        constructor(selected: Loira.Element, type: string) {
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
    export class RelationEvent{
        public selected: Common.Relation;
        public type: string;

        constructor(selectedRel: Common.Relation, typeRel: string) {
            this.selected = selectedRel;
            this.type = typeRel;
        }
    }
}
