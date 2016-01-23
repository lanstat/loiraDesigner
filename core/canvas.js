var Loira = {};

/**
 * Clase que prepara el canvas para su uso
 * 
 * @class Canvas
 */
Loira.Canvas = function(canvasId){
	this.items = [];
	this._canvas = document.getElementById(canvasId);
	this._callbacks = {};
	this.initialize();
}

Loira.Canvas.prototype = {
	_selected: null,
	_isDragged: false,
	_tmp: {},
	renderAll: function(){
		var ctx = this._canvas.getContext('2d');
		ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this.items.forEach(function(item){
			item._render(ctx);
		});
		if(this._selected){
			Loira.SelectedSquare.draw(ctx, this._selected);	
			this._selected._renderButtons(ctx);
		}
	},
	add: function(){
		var args = [].splice.call(arguments, 0);
		var _items = this.items;
		var _this = this;
		args.forEach(function(item){
			item._canvas = _this;
			_items.push(item);
			/**
			 * Evento que encapsula la agregacion de un objeto del canvas
			 * 
			 * @event object:added
			 * @type { object }
			 * @property {object} selected - Objeto seleccionado
			 * @property {string} type - Tipo de evento
			 */
			_this.emit('object:added', new objectEvent({selected:item, type: 'objectadded'}));
		});
	},
	addRelation: function(){
		var args = [].splice.call(arguments, 0);
		var _items = this.items;
		var _this = this;
		args.forEach(function(item){
			item._canvas = _this;
			_items.unshift(item);
			/**
			 * Evento que encapsula la agregacion de un objeto del canvas
			 * 
			 * @event object:added
			 * @type { object }
			 * @property {object} selected - Objeto seleccionado
			 * @property {string} type - Tipo de evento
			 */
			_this.emit('object:added', new objectEvent({selected:item, type: 'objectadded'}));
		});	
	},
	remove: function(){
		var args = [].splice.call(arguments, 0);
		var _items = this.items;
		var _this = this;
		args.forEach(function(item){
			var index = _items.indexOf(item);
			_items = _items.splice(index, 1);
			/**
			 * Evento que encapsula la eliminacion de un objeto del canvas
			 * 
			 * @event object:removed
			 * @type { object }
			 * @property {object} selected - Objeto seleccionado
			 * @property {string} type - Tipo de evento
			 */
			_this.emit('object:removed', new objectEvent({selected:item, type: 'objectremoved'}));
		});
	},
	on: function(evt, callback){
		var objCallback;
		if(typeof evt === 'string'){
			if (typeof this._callbacks[evt] === 'undefined'){
				this._callbacks[evt] = [];
			}
			this._callbacks[evt].push(callback);
			return callback;
		}else if(typeof evt === 'object'){
			for (var name in evt){
				if (typeof this._callbacks[name] === 'undefined'){
					this._callbacks[name] = [];
				}
				this._callbacks[name].push(evt[name]);
			}
		}
	},
	fall: function(evt, callback){
		var index  = this._callbacks[evt].indexOf(callback);
		if (index > -1){
			this._callbacks[evt].splice(index, 1);
		}
	},
	bind: function(){
		var _this = this;
		var _callbacks = this._callbacks;
		this._canvas.onmousedown = function(evt){
			var real = _this._getMouse(evt);
			_this._tmp.pointer =  real;
			/**
			 * Evento que encapsula un click sobre el canvas
			 * 
			 * @event mouse:down
			 * @type { object }
			 * @property {integer} x - Posicion x del puntero
			 * @property {integer} y - Posicion y del puntero
			 * @property {string} type - Tipo de evento
			 */
			_this.emit('mouse:down', new mouseEvent({x:real.x, y:real.y, type: 'mousedown'}));
			if (_this._selected){
				_this._tmp.transform = Loira.SelectedSquare.getSelectedCorner(real.x, real.y, _this._selected)
				if(_this._tmp.transform){
					return;
				}else if(_this._selected.callCustomButton(real.x, real.y)){
					return;
				}else{
					_this._selected = null;
				}
			}
			for (var i = 0; i < _this.items.length; i++) {
				var item = _this.items[i];
				if(item.checkCollision(real.x, real.y)){
					/**
					 * Evento que encapsula un click sobre un objeto
					 * 
					 * @event object:select
					 * @type { object }
					 * @property {object} selected - Objeto seleccionado
					 * @property {string} type - Tipo de evento
					 */
					_this.emit('object:selected', new objectEvent({selected:item, type: 'objectselected'}));
					_this._selected = item;
					_this._isDragged = true;
					break;
				}
			};

			_this.renderAll();
		};
		this._canvas.onmousemove = function(evt){
			var real = _this._getMouse(evt);
			/**
			 * Evento que encapsula el movimiento del mouse sobre el canvas
			 * 
			 * @event mouse:move
			 * @type { object }
			 * @property {integer} x - Posicion x del puntero
			 * @property {integer} y - Posicion y del puntero
			 * @property {string} type - Tipo de evento
			 */
			_this.emit('mouse:move', new mouseEvent({x:real.x, y:real.y, type: 'mousemove'}));
			
			if(_this._selected){
				if(_this._tmp.transform){
					switch(_this._tmp.transform){
						case 'tc':
							_this._selected.y += real.y - _this._tmp.pointer.y;		
							_this._selected.height -= real.y - _this._tmp.pointer.y;
							break;
						case 'bc':
							_this._selected.height += real.y - _this._tmp.pointer.y;
							break;
						case 'ml':
							_this._selected.x += real.x - _this._tmp.pointer.x;
							_this._selected.width -= real.x - _this._tmp.pointer.x;
							break;
						case 'mr':
							_this._selected.width += real.x - _this._tmp.pointer.x;
							break;
					}
				}else if(_this._isDragged){
					_this._selected.x += real.x - _this._tmp.pointer.x;
					_this._selected.y += real.y - _this._tmp.pointer.y;
					/**
					 * Evento que encapsula el arrastre de un objeto
					 * 
					 * @event object:dragging
					 * @type { object }
					 * @property {object} selected - Objeto seleccionado
					 * @property {string} type - Tipo de evento
					 */
					_this.emit('object:dragging', new objectEvent({selected:_this._selected, type: 'objectdragging'}));
				}
				_this.renderAll();
				_this._tmp.pointer = real;
			}
		}
		this._canvas.onmouseup = function(evt){
			var real = _this._getMouse(evt);
			/**
			 * Evento que encapsula la liberacion del mouse sobre el canvas
			 * 
			 * @event mouse:up
			 * @type { object }
			 * @property {integer} x - Posicion x del puntero
			 * @property {integer} y - Posicion y del puntero
			 * @property {string} type - Tipo de evento
			 */
			_this.emit('mouse:up', new mouseEvent({x:real.x, y:real.y, type: 'mouseup'}));
			if (_this._selected){
				/**
				 * Evento que encapsula la liberacion de un objeto
				 * 
				 * @event object:released
				 * @type { object }
				 * @property {object} selected - Objeto seleccionado
				 * @property {string} type - Tipo de evento
				 */
				_this.emit('object:released', new mouseEvent({selected:_this.selected, type: 'objectreleased'}));
				_this._isDragged = false;
				_this._tmp.transform = false;
			}
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
			for (var i = 0; i < this._callbacks[evt].length; i++) {
				var item = this._callbacks[evt][i];
				item.call(this, options);
			};
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