/**
 * Conjunto de relaciones comunes
 *
 * @namespace Relation
 * @license Apache-2.0
 */
module Relation{
    /**
     * Contiene las funciones para relacion de asociacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    export class Association extends Common.Relation{
        constructor(options: Loira.util.RelOption){
            super(options);

            this.type = 'association';
        }
    }

    /**
     * Contiene las funciones para relacion directa
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    export class DirectAssociation extends Common.Relation{
        constructor(options: Loira.util.RelOption){
            options.icon = 'spear';
            super(options);

            this.type = 'direct_association';
        }
    }

    /**
     * Contiene las funciones para relacion de generalizacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    export class Generalization extends Common.Relation{
        constructor(options: Loira.util.RelOption){
            options.icon = 'spear2';
            super(options);

            this.type = 'generalization';
        }
    }

    /**
     * Contiene las funciones para relacion de realizacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    export class Realization extends Common.Relation{
        constructor(options: Loira.util.RelOption){
            options.icon = 'spear2';
            options.isDashed = true;
            super(options);

            this.type = 'realization';
        }
    }

    /**
     * Contiene las funciones para relacion de dependencia
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    export class Dependency extends Common.Relation{
        constructor(options: Loira.util.RelOption){
            options.icon = 'spear1';
            options.isDashed = true;
            super(options);

            this.type = 'dependency';
        }
    }
}
