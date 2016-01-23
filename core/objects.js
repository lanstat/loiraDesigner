/**
 * Clase base para la creacion de nueos objetos dibujables
 * 
 * @class Object
 */
Loira.Object = {
	_canvas: null,
	_buttons: [],
	initialize: function(options){
		this._uid = Loira.util.createRandom(8);

		if(typeof options === 'undefined'){
			options = {};
		}
		this.x = 'x' in options ? options.x : 0;
		this.y = 'y' in options ? options.y : 0;
		this.width = 'width' in options ? options.width : 0;
		this.height = 'height' in options ? options.height : 0;
		this._buttons = [];
		this._canvas = null;
		this._prepare();
	},
	callSuper: function(funcName){
		var args = [].splice.call(arguments, 0);
		funcName = '$'+ funcName;

		args = args.length > 1? args.splice(1, args.length): []; 

		return this[funcName].apply(this, args);
	},
	_render: function(ctx){},
	_prepare: function(){},
	checkCollision: function(x, y){
		return (x>= this.x && x<= this.x + this.width && y>=this.y && y<=this.y + this.height);
	},
	on: function(){
		var args = [].splice.call(arguments, 0);
		for (var i = 0; i < args.length; i++) {
			var button = args[i];
			var img = document.createElement('IMG');
			img.src = button.icon;
			this._buttons.push({'icon':img, 'click': button.click});
		};
	},
	_renderButtons: function(ctx){
		var x = this.x + this.width + 10;
		var y = this.y;
		if(this._buttons.length>0)
			this._buttons.forEach(function (item){
				ctx.drawImage(item.icon, x, y);
				y += item.icon.height + 4;
			});
	},
	callCustomButton: function(x, y){
		var _x = this.x + this.width + 10;
		var _y = this.y;
		for (var i = 0; i < this._buttons.length; i++) {
			var item = this._buttons[i];
			if(_x <= x && x <= _x + item.icon.width && _y <= y && y <= _y + item.icon.height){
				item.click.call(this);
				return true;
			} 
			_y += item.icon.height + 4;
		};
		return false;
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
		ctx.setLineDash([5, 5]);
		ctx.strokeStyle= '#339966';
		ctx.rect(x, y, w+4, h+4); 
		ctx.stroke();
		ctx.setLineDash([]);

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