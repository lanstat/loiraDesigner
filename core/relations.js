/**
 * Relation
 *
 * @namespace
 */
var Relation = {};

/**
 * Contiene las funciones para relacion de asociacion
 * 
 * @class
 * @memberof Relation
 */
Relation.Association = Loira.util.createClass(Common.Relation, {
	initialize : function(options){
		this.callSuper('initialize', options);
	}
});


/**
 * Contiene las funciones para relacion directa
 *
 * @class
 * @memberof Relation
 */
Relation.DirectAssociation = Loira.util.createClass(Common.Relation, {
	initialize : function(options){
        options['icon'] = 'spear.png';
		this.callSuper('initialize', options);
	}
});

/**
 * Contiene las funciones para relacion de generalizacion
 *
 * @class
 * @memberof Relation
 */
Relation.Generalization = Loira.util.createClass(Common.Relation, {
    initialize : function(options){
        options['icon'] = 'spear2.png';
        this.callSuper('initialize', options);
    }
});

/**
 * Contiene las funciones para relacion de realizacion
 *
 * @class
 * @memberof Relation
 */
Relation.Realization = Loira.util.createClass(Common.Relation, {
    initialize : function(options){
        options['icon'] = 'spear2.png';
        options['isDashed'] = true;
        this.callSuper('initialize', options);
    }
});

/**
 * Contiene las funciones para relacion de dependencia
 *
 * @class
 * @memberof Relation
 */
Relation.Dependency = Loira.util.createClass(Common.Relation, {
    initialize : function(options){
        options['icon'] = 'spear1.png';
        options['isDashed'] = true;
        this.callSuper('initialize', options);
    }
});
