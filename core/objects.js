/**
 * Clase base para la creacion de nueos objetos dibujables
 * 
 * @class Object
 */
drawable.Object = {
	initialize: function(options){
		this._uid = drawable.util.createRandom(8);
		this.x = 'x' in options ? options.x : 0;
		this.y = 'y' in options ? options.y : 0;
		this.width = 'width' in options ? options.width : 0;
		this.height = 'height' in options ? options.height : 0;
	},
	callSuper: function(funcName){
		var args = [].splice.call(arguments, 0);
		funcName = 'spr_'+ funcName;

		args = args.length > 1? args.splice(1, args.length): []; 

		return this[funcName].apply(this, args);
	},
	_render: function(context){},
	checkCollision: function(x, y){
		return (x>= this.x && x<= this.x + this.width && y>=this.y && y<=this.y + this.height);
	}
}

var Relation = drawable.util.createClass(drawable.Object, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.width = 100;
		this.height = 100;
	},
	_render: function(ctx) {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x+this.width, this.y+this.height);
		ctx.stroke();
	}
});