/**
 * Caso de uso
 *
 * @namespace
 */
var UseCase = {};

/**
 * Crea un nuevo Objeto de Caso de uso
 * 
 * @class
 * @memberof UseCase
 */
UseCase.UseCase = Loira.util.createClass(Common.Symbol, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.width = 100;
		this.height = 70;
		this.text = options.text;
	},
	_render: function(ctx) {
		ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
		if (this.text){
			var kappa = .5522848,
			    ox = (this.width / 2) * kappa, 
			    oy = (this.height / 2) * kappa, 
			    xe = this.x + this.width,           
			    ye = this.y + this.height,           
			    xm = this.x + this.width / 2,       
			    ym = this.y + this.height / 2;       

			ctx.beginPath();
			ctx.lineWidth = 2;

			ctx.moveTo(this.x, ym);
			ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
			ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
			ctx.stroke();
			ctx.fillStyle = "#fcf5d9";
			ctx.fill();
			ctx.fillStyle = "#000000";

			this._drawText(ctx, this._splitText(ctx, this.text));
		}
	},
	_splitText: function(ctx, text){
		var words = text.split(' ');
		var buff = '';
		var lines = [];

		for (var i = 0; i < words.length; i++) {
			if (ctx.measureText(buff + words[i]).width > this.width -10){
				lines.push(buff);
				buff = words[i] + ' ';
			}else{
				buff = buff + ' ' + words[i];
			}
		};
		lines.push(buff);

		return lines;
	},
	_drawText : function(ctx, lines, horiAlign, vertAlign){
		var x = this.x,
			y = this.y,
			xm = this.x + this.width / 2,       
		    ym = this.y + this.height / 2;
		if (typeof lines === 'string'){
			var tmp = lines;
			lines = [tmp];
		}

		var y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

		for (var i = 0; i < lines.length; i++){
			var textW = ctx.measureText(lines[i]).width;
			ctx.fillText(lines[i], xm - textW/2, y+3);
			y = y + Loira.Config.fontSize + 3;
		}
	}
});
