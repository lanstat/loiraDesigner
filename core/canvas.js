var drawable = {};

/**
 * Clase que prepara el canvas para su uso
 * 
 * @class object
 */
drawable.Canvas = function(canvasId){
	this.items = [];
	this._canvas = document.getElementById(canvasId);
	this.initialize();
	this._callbacks = {};
}

drawable.Canvas.prototype = {
	renderAll: function(){
		var context = this._canvas.getContext('2d');
		this.items.forEach(function(item){
			item._render(context);
		});
	},
	add: function(){
		var args = [].splice.call(arguments, 0);
		var _items = this.items;
		args.forEach(function(item){
			_items.push(item);
		});
	},
	on: function(evt, callback){
		if (typeof this._callbacks[evt] === 'undefined'){
			this._callbacks[evt] = [];
		}
		this._callbacks[evt].push(callback);
	},
	bind: function(){
		var _this = this;
		this._canvas.onmousedown = function(evt){
			var real = _this._getMouse(evt);
			_this.emit('canvas:click', new canvasClick({x:real.x, y:real.y}));
			_this.items.forEach(function(item){
				if(item.checkCollision(real.x, real.y))
					_this.emit('object:select', new objectSelect({selected:item}));
			});
		}
	},
	initialize: function(){
		if (document.defaultView && document.defaultView.getComputedStyle) {
			this._border = {
				paddingLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingLeft'], 10)      || 0,
				paddingTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['paddingTop'], 10)       || 0,
				borderLeft: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderLeftWidth'], 10)  || 0,
				borderTop: parseInt(document.defaultView.getComputedStyle(this._canvas, null)['borderTopWidth'], 10)   || 0
			}
		}
		this.bind();
	},
	emit: function(evt, options){
		if(typeof this._callbacks[evt] !== 'undefined'){
			this._callbacks[evt].forEach(function (item){
				item.call(this, options);
			});
		}
	},
	_getMouse: function(evt){
		var element = this._canvas, offsetX = 0, offsetY = 0;
		if (element.offsetParent) {
			do {
				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
			} while ((element = element.offsetParent));
		}
		var border = this._border;
		offsetX += border.paddingLeft;
		offsetY += border.paddingTop;

		offsetX += border.borderLeft;
		offsetY += border.borderTop;

		return {x: (evt.pageX - offsetX), y: (evt.pageY - offsetY)};
	}
}