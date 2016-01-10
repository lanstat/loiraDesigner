/**
 * Clase base para la creacion de nueos objetos dibujables
 * 
 * @class Object
 */
Loira.Object = {
	initialize: function(options){
		this._uid = Loira.util.createRandom(8);

		if(typeof options === 'undefined'){
			options = {};
		}
		this.x = 'x' in options ? options.x : 0;
		this.y = 'y' in options ? options.y : 0;
		this.width = 'width' in options ? options.width : 0;
		this.height = 'height' in options ? options.height : 0;
	},
	callSuper: function(funcName){
		var args = [].splice.call(arguments, 0);
		funcName = '$'+ funcName;

		args = args.length > 1? args.splice(1, args.length): []; 

		return this[funcName].apply(this, args);
	},
	_render: function(context){},
	checkCollision: function(x, y){
		return (x>= this.x && x<= this.x + this.width && y>=this.y && y<=this.y + this.height);
	}
}

Loira.SelectedSquare = {
	draw: function(ctx, selected){
		var x = selected.x-2,
		    y = selected.y-2,
		    w = selected.width,
		    h = selected.height;

		ctx.beginPath();
		ctx.lineWidth=2;
		ctx.strokeStyle= '#339966';
		ctx.rect(x, y, w+4, h+4); 
		ctx.stroke();

		ctx.fillStyle= '#339966';

		ctx.fillRect(x-4, y-4, 8, 8);
		ctx.fillRect(x+w, y+h, 8, 8);
		ctx.fillRect(x+w, y-4, 8, 8);
		ctx.fillRect(x-4, y+h, 8, 8);
		ctx.fillRect(x+w/2, y-4, 8, 8);
		ctx.fillRect(x+w/2, y+h, 8, 8);
		ctx.fillRect(x-4, y+h/2, 8, 8);
		ctx.fillRect(x+w, y+h/2, 8, 8);

		ctx.strokeStyle= '#000000';
	},
	getSelectedCorner: function(pX, pY, selected){
		var x = selected.x-2,
		    y = selected.y-2,
		    w = selected.width,
		    h = selected.height,
			mw = w/2,
			mh = h/2;
		if(x-4 <= pX && pX <= x+4  && y-4 <= pY && pY <= y+4)
			return 'tl';
		if(x+w <= pX && x+w+8 >= pX && y-4 <= pY && y+4 >= pY)
			return 'tr';
		if(x+w <= pX && x+w+8 >= pX && y+h <= pY && y+h+8 >= pY)
			return 'br';
		if(x-4 <= pX && x+4 >= pX && y+h <= pY && y+h+8 >= pY)
			return 'bl';
		if(x+mw <= pX && x+mw+8 >= pX && y-4 <= pY && y+4 >= pY)
			return 'tc';
		if(x+mw <= pX && x+mw+8 >= pX && y+h <= pY && y+h+8 >= pY)
			return 'bc';
		if(x-4 <= pX && x+4 >= pX && y+mh <= pY && y+mh+8 >= pY)
			return 'ml';
		if(x+w <= pX && x+w+8 >= pX && y+mh <= pY && y+mh+8 >= pY)
			return 'mr';
		return false;
	}
}

var Common = {};

Common.Relation = Loira.util.createClass(Loira.Object, {
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