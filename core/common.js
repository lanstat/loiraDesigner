var Common = {};

Common.Relation = Loira.util.createClass(Loira.Object, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.start = options.start;
		this.end = options.end; 
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
	},
	checkCollision: function(x, y){
		var r = Math.abs(y - this.y1);
		var t = Math.abs((this.y2 - this.y1) / (this.x2 - this.x1) * (x - this.x1));

		return (Math.abs(r - t) <= 5);
	},
	drawSelected: function(ctx){
		var x = this.x-2,
		    y = this.y-2,
		    w = this.width,
		    h = this.height;

		ctx.beginPath();

		ctx.fillStyle= Loira.Config.selected.color;

		ctx.fillRect(this.x1-4, this.y1-4, 8, 8);
		ctx.fillRect(this.x2-4, this.y2-4, 8, 8);

		ctx.strokeStyle= '#000000';
	},
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
						canvas.addRelation(new Common.Relation({start:_this, end:item}));
						break;
					}
				};
				canvas.fall('mouse:down', listener);
			}
		);
	}
}, true);
