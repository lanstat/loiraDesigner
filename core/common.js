var Common = {};

Common.Relation = Loira.util.createClass(Loira.Object, {
	_prepare : function(options){
        if(typeof options === 'undefined'){
			options = {};
		}
        
		this.start = options.start? options.start : null;
		this.end = options.end? options.end : null;
        this.text = options.text? options.text : '';
        this.isDashed = options.isDashed? options.isDashed : false;
        this.img = null;
        if (options.icon){
            this.img = document.createElement('IMG');
            this.img.src = '../assets/' + options.icon;
            this.img.onload = function() {}
        }
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

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this.x1, this.y1);

        if (this.isDashed)
            ctx.setLineDash([5, 5]);

        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.setLineDash([]);

        if (this.img){
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
        }

        if (this.text || this.text.length > 0){
            ctx.font = "10px " + Loira.Config.fontType;

            var textW = ctx.measureText(this.text).width;

            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(this.x1 + xm/2 - textW/2, this.y1 + ym/2 - 15, textW, 12);
            ctx.fillStyle = "#000000";

            ctx.fillText(this.text,
                this.x1 + xm/2 - textW/2,
                this.y1 + ym/2 - 5);

            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
        }
	},
    /**
     * @chainable
     */
    update: function(start, end){
      this.start = start;
      this.end = end;
      return this;
    },
	checkCollision: function(x, y){
		var r = Math.abs(y - this.y1);
		var t = Math.abs((this.y2 - this.y1) / (this.x2 - this.x1) * (x - this.x1));

		return (Math.abs(r - t) <= 5);
	},
	drawSelected: function(ctx){
		ctx.beginPath();

		ctx.fillStyle= Loira.Config.selected.color;

		ctx.fillRect(this.x1-4, this.y1-4, 8, 8);
		ctx.fillRect(this.x2-4, this.y2-4, 8, 8);

		ctx.strokeStyle= '#000000';
	},
}, true);

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
						canvas.addRelation(canvas.nextRelation.update(_this, item));
                        canvas.nextRelation = new Relation.Association();
						break;
					}
				};
				canvas.fall('mouse:down', listener);
			}
		);
	},
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
	obtainBorderPos : function(xm, ym){
        return 0;
    }
}, true);

/**
 * Clase base para los simbolos uml
 *
 * @class Symbol
 */
Common.Actor = Loira.util.createClass(Common.Symbol, {
    initialize : function(options){
		this.callSuper('initialize', options);

        this.img = document.createElement('IMG');
        this.img.src = '../assets/actor.png';
        this.img.onload = function() {}

        this.name = options.name? options.name: 'Actor1';
        this.width = 30;
		this.height = 62;
	},
	_render: function(ctx) {
        var textW = ctx.measureText(this.name).width;
        var _x = this.x + 15 - textW/2;

        ctx.fillStyle = Loira.Config.background;
        ctx.fillRect(this.x-5, this.y-5, this.width+10, this.height+20);
        ctx.fillRect(_x, this.y+70, textW, 10);
        ctx.fillStyle = "#000000";

        ctx.drawImage(this.img, this.x, this.y);
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
        ctx.fillStyle = "#000000";

        ctx.fillText(this.name, _x, this.y+80);
	}
});
