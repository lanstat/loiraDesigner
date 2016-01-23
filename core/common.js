var Common = {};

Common.Relation = Loira.util.createClass(Loira.Object, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.start = options.start;
		this.end = options.end; 
	},
	_render: function(ctx) {
		var start = this.start,
			end = this.end,
			x1m = start.x + start.width/2,
			y1m = start.y + start.height/2,
			x2m = end.x + end.width/2,
			y2m = end.y + end.height/2;

		this.x = x1m < x2m? x1m : x2m;
		this.y = y1m < y2m? y1m : y2m;
		this.width = Math.abs(end.x - start.x);
		this.height = Math.abs(end.y - start.y);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(x1m, y1m);
		ctx.lineTo(x2m, y2m);
		ctx.stroke();
	}
});

/**
 * Clase base para los simbolos uml
 * 
 * @class Symbol
 */
Common.Symbol = Loira.util.createClass(Loira.Object, {
	_prepare : function(options){
		var link = this._linkSymbol;
		this.on({
			icon: '../assets/arrow.png', 
			click: link
		},{
			icon: '../assets/clean.png', 
			click: function(){
				console.log('clean');
			}
		});
	},
	_linkSymbol : function(){
		var _this = this;
		var  listener = this._canvas.on(
			'mouse:down', function(evt){
				var canvas = _this._canvas;
				for (var i = 0; i < canvas.items.length; i++) {
					var item = canvas.items[i];
					if(item.checkCollision(evt.x, evt.y)){
						canvas.addRelation(new Common.Relation({start:_this, end:item}))
						break;
					}
				};
				canvas.fall('mouse:down', listener);
			}
		);
	}
}, true);