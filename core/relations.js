/**
 * Conjunto de relaciones comunes
 *
 * @namespace Relation
 * @license Apache-2.0
 */
var Relation = {};

/**
 * Contiene las funciones para relacion de asociacion
 * 
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Association = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Association#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);
            this.type = 'association';
        }
    });
}());


/**
 * Contiene las funciones para relacion directa
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.DirectAssociation = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.DirectAssociation#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear.png';
            this.callSuper('initialize', options);
            this.type = 'direct_association';
        }
    });
}());

/**
 * Contiene las funciones para relacion de generalizacion
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Generalization = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Generalization#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear2.png';
            this.callSuper('initialize', options);
            this.type = 'generalization';
        }
    });
}());

/**
 * Contiene las funciones para relacion de realizacion
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Realization = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Realization#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear2.png';
            options['isDashed'] = true;
            this.callSuper('initialize', options);
            this.type = 'realization';
        }
    });
}());

/**
 * Contiene las funciones para relacion de dependencia
 *
 * @class
 * @memberof Relation
 * @augments Common.Relation
 */
Relation.Dependency = (function(){
    return Loira.util.createClass(Common.Relation, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Relation.Dependency#
         * @private
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            options['icon'] = 'spear1.png';
            options['isDashed'] = true;
            this.callSuper('initialize', options);
            this.type = 'dependency';
        }
    });
}());