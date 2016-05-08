/**
 * Clase base para la creacion de nuevos objetos dibujables
 * 
 * @class Object
 */
Loira.Object = {
	_canvas: null,
	_buttons: [],
	/**
	 * Inicializa los valores de la clase
     *
     * @memberof Object#
     * @private
	 * @param { object } options Conjunto de valores iniciales
     */
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
        this.type = '';
		this._prepare(options);
	},
    /**
     * Ejecuta un metodo de la clase padre
     *
     * @memberof Object#
     * @private
     * @param { string } funcName Nombre de la funcion a ejecutar
     * @param {Array.<Object>} args Parametros de la funcion
     * @returns {*} Valores de retorno de la funcion ejecutada
     */
	callSuper: function(funcName){
		var args = [].splice.call(arguments, 0);
		funcName = '$'+ funcName;

		args = args.length > 1? args.splice(1, args.length): []; 

		return this[funcName].apply(this, args);
	},
    /**
     * Renderiza el objeto
     *
     * @memberof Object#
     * @param ctx Context 2d de canvas
     * @private
     * @abstract
     */
	_render: function(ctx){},
    /**
     * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
     * el problema con la recursion de funcion heradadas)
     *
     * @memberof Object#
     * @param { object } options Datos con valores inciales
     * @private
     * @abstract
     */
	_prepare: function(options){},
    /**
     * Verifica si el punto dado se encuentra dentro de los limites del objeto
     *
     * @memberof Object#
     * @param x Posicion x del punto
     * @param y Posicion y del punto
     * @returns {boolean}
     */
	checkCollision: function(x, y){
		return (x>= this.x && x<= this.x + this.width && y>=this.y && y<=this.y + this.height);
	},
    /**
     * Agrega iconos laterales del objeto con sus respectivos escuchadores
     *
     * @memberof Object#
     * @param {Array.<Object>} args Iconos laterales a agregar
     */
	on: function(){
		var args = [].splice.call(arguments, 0);
		for (var i = 0; i < args.length; i++) {
			var button = args[i];
			var img = document.createElement('IMG');
			img.src = button.icon;
			this._buttons.push({'icon':img, 'click': button.click});
		}
	},
    /**
     * Renderiza los iconos de los botones laterales
     *
     * @memberof Object#
     * @param ctx Contexto 2d del canvas
     * @private
     */
	_renderButtons: function(ctx){
		var x = this.x + this.width + 10;
		var y = this.y;
		if(this._buttons.length>0){
			this._buttons.forEach(function (item){
				ctx.drawImage(item.icon, x, y);
				y += item.icon.height + 4;
			});
        }
	},
    /**
     * Ejecuta el escuchador de algun icono lateral encontrado por el punto
     *
     * @memberof Object#
     * @param x Posicion x del punto
     * @param y Posicion y del punto
     * @returns {boolean}
     * @private
     */
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
		}
		return false;
	},
    /**
     * Dibuja el cuadro punteado que contornea al objeto
     *
     * @memberof Object#
     * @param { Canvas2D } ctx Contexto 2d del canvas
     * @private
     */
	drawSelected: function(ctx){
		var x = this.x-2,
		    y = this.y-2,
		    w = this.width,
		    h = this.height;

		ctx.beginPath();
		ctx.lineWidth=2;
		ctx.setLineDash([5, 5]);
		ctx.strokeStyle= Loira.Config.selected.color;
		ctx.rect(x, y, w+4, h+4); 
		ctx.stroke();
		ctx.setLineDash([]);

		ctx.fillStyle= Loira.Config.selected.color;

		ctx.fillRect(x-4, y-4, 8, 8);
		ctx.fillRect(x+w, y+h, 8, 8);
		ctx.fillRect(x+w, y-4, 8, 8);
		ctx.fillRect(x-4, y+h, 8, 8);
		ctx.fillRect(x+w/2, y-4, 8, 8);
		ctx.fillRect(x+w/2, y+h, 8, 8);
		ctx.fillRect(x-4, y+h/2, 8, 8);
		ctx.fillRect(x+w, y+h/2, 8, 8);

		ctx.strokeStyle= '#000000';
		ctx.fillStyle= '#000000';
	},
	getSelectedCorner: function(pX, pY){
		var x = this.x-2,
		    y = this.y-2,
		    w = this.width,
		    h = this.height,
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
};