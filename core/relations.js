/**
 * Relation
 *
 * @namespace
 */
var Relation = {};

/**
 * Contiene las funciones para relacion de asociacion
 * 
 * @class
 * @memberof Relation
 */
Relation.Association = Loira.util.createClass(Common.Relation, {
	initialize : function(options){
		this.callSuper('initialize', options);
	}
});


/**
 * Contiene las funciones para relacion directa
 *
 * @class
 * @memberof Relation
 */
Relation.DirectAssociation = Loira.util.createClass(Common.Relation, {
	initialize : function(options){
		this.callSuper('initialize', options);

        this.img = document.createElement('IMG');
        this.img.src = '../assets/spear.png';
        this.img.onload = function() {}
	},
	_render: function(ctx) {
		var start = this.start,
			end = this.end;

		this.x1 = start.x + start.width/2;
		this.y1 = start.y + start.height/2;
		this.x2 = end.x + end.width/2;
		this.y2 = end.y + end.height/2;

        var xm = this.x2 - this.x1;
        var ym = this.y2 - this.y1;

        var angle = Math.atan(ym / xm);

        if (xm<0){
            angle += Math.PI;
        }

        var h = end.obtainBorderPos(xm, ym);

        ctx.translate(this.x2, this.y2);
        ctx.rotate(angle);
        ctx.drawImage(this.img, -(15+h), -7);
        ctx.rotate(-angle);
        ctx.translate(-this.x2, -this.y2);

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
});
