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
UseCase.UseCase = Loira.util.createClass(Loira.Object, {
	initialize : function(options){
		this.callSuper('initialize', options);
		this.width = 200;
		this.height = 100;
	},
	_render: function(ctx) {
		var kappa = .5522848,
		    ox = (this.width / 2) * kappa, 
		    oy = (this.height / 2) * kappa, 
		    xe = this.x + this.width,           
		    ye = this.y + this.height,           
		    xm = this.x + this.width / 2,       
		    ym = this.y + this.height / 2;       

		ctx.beginPath();
		ctx.moveTo(this.x, ym);
		ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
		ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
		ctx.stroke();
		ctx.fillStyle = "#fcf5d9";
		ctx.fill();
	}
});