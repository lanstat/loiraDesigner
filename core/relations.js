/**
 * Relation
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


/**
 * Crea un nuevo Objeto de Caso de uso
 *
 * @class
 * @memberof UseCase
 */
Relation.DirectAssociation = Loira.util.createClass(Common.Relation, {
	initialize : function(options){
		this.callSuper('initialize', options);
	},
	_render: function(ctx) {
		var start = this.start,
			end = this.end;

		this.x1 = start.x + start.width/2,
		this.y1 = start.y + start.height/2,
		this.x2 = end.x + end.width/2,
		this.y2 = end.y + end.height/2;

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
});
