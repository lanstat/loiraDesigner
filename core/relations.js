/**
 * Relaciones
 *
 * @namespace
 */
var Relation = {};

/**
 * Crea un nuevo Objeto de Caso de uso
 * 
 * @class
 * @memberof UseCase
 */
Relation.Association = Loira.util.createClass(Common.Relation, {
	initialize : function(options){
		this.callSuper('initialize', options);
	}
});