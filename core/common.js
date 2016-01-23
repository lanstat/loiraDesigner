var Common = {};

Common.Relation = Loira.util.createClass(Loira.Object, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.start = options.start;
		this.end = options.end; 
		this.x = this.start.x < this.end.x? this.start.x : this.end.x;
		this.y = this.start.y < this.end.y? this.start.y : this.end.y;
		this.width = Math.abs(this.end.x - this.start.x);
		this.height = Math.abs(this.end.y - this.start.y);
	},
	_render: function(ctx) {
		var start = this.start;
		var end = this.end;

		this.x = start.x < end.x? start.x : end.x;
		this.y = start.y < end.y? start.y : end.y;
		this.width = Math.abs(end.x - start.x);
		this.height = Math.abs(end.y - start.y);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(start.x + start.width/2, start.y + start.height/2);
		ctx.lineTo(end.x + end.width/2, end.y + end.height/2);
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