/**
 * Conjunto de simbolos y objetos comunes
 *
 * @namespace
 * @license Apache-2.0
 */
var Common = {};

/**
 * Clase base para la creacion de relaciones
 *
 * @memberof Common
 * @class Relation
 * @augments Loira.Object
 */
Common.Relation = (function(){
    'use strict';

    return Loira.util.createClass(Loira.Object, {
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Common.Relation#
         * @protected
         * @param { object } options Datos con valores inciales
         */
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
                this.img.src = Loira.Config.assetsPath + options.icon;
                this.img.onload = function() {}
            }
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
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

                var h = end.obtainBorderPos(xm, ym, {x1:this.x1, y1: this.y1, x2:this.x2, y2:this.y2}, ctx);

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
         * Actualiza los objeto de origen y objetivo de la relacion
         *
         * @memberof Common.Relation#
         * @param { Object } start Objeto origen
         * @param { Object } end Objeto objetivo
         * @chainable
         * @returns {Common.Relation}
         */
        update: function(start, end){
          this.start = start;
          this.end = end;
          return this;
        },
        /**
         * Verifica si el punto dado se encuentra dentro de los limites del objeto
         *
         * @memberof Common.Relation#
         * @param x Posicion x del punto
         * @param y Posicion y del punto
         * @returns {boolean}
         */
        checkCollision: function(x, y){
            var r = Math.abs(y - this.y1);
            var t = Math.abs((this.y2 - this.y1) / (this.x2 - this.x1) * (x - this.x1));

            return (Math.abs(r - t) <= 5);
        },
        /**
         * Dibuja el cuadro punteado que contornea al objeto
         *
         * @memberof Common.Relation#
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @private
         */
        drawSelected: function(ctx){
            ctx.beginPath();

            ctx.fillStyle= Loira.Config.selected.color;

            ctx.fillRect(this.x1-4, this.y1-4, 8, 8);
            ctx.fillRect(this.x2-4, this.y2-4, 8, 8);

            ctx.strokeStyle= '#000000';
        }
    }, true);
}());

/**
 * Clase base para los simbolos uml
 *
 * @memberof Common
 * @class Symbol
 * @augments Loira.Object
 */
Common.Symbol = (function(){
    'use strict';

    return Loira.util.createClass(Loira.Object, {
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Common.Symbol#
         * @protected
         * @param { object } options Datos con valores inciales
         */
        _prepare : function(options){
            var link = this._linkSymbol;
            this.on({
                icon: Loira.Config.assetsPath + 'arrow.png',
                click: link
            },{
                icon: Loira.Config.assetsPath + 'clean.png',
                click: function(){
                    console.log('clean');
                }
            });
        },
        /**
         * Evento que se ejecuta cuando se realiza una relacion entre simbolos
         *
         * @memberof Common.Symbol#
         * @private
         */
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
                    }
                    canvas.fall('mouse:down', listener);
                }
            );
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Symbol#
         * @param xm Delta x de la relacion
         * @param ym Delta y de la relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym){
            return 0;
        }
    }, true);
}());

/**
 * Clase para generacion de actores uml
 *
 * @memberof Common
 * @class Actor
 * @augments Common.Symbol
 */
Common.Actor = (function(){
    'use strict';

    return Loira.util.createClass(Common.Symbol, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Common.Actor#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);

            this.img = document.createElement('IMG');
            this.img.src = Loira.Config.assetsPath + 'actor.png';
            this.img.onload = function() {};

            this.text = options.text? options.text: 'Actor1';
            this.width = 30;
            this.height = 85;
            this.type = 'actor';
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Actor#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        _render: function(ctx) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            ctx.fillStyle = Loira.Config.background;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";

            ctx.drawImage(this.img, this.x + this.width/2 - 15, this.y);
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#000000";

            ctx.fillText(this.text, this.x, this.y+80);
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Symbol#
         * @param { int } xm Delta x de la relacion
         * @param { int } ym Delta y de la relacion
         * @param points Puntos que forman la linea de relacion
         * @param { CanvasRenderingContext2D } ctx Contexto 2d del canvas
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points, ctx){
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            var angle = Math.atan(ym / xm);

            if (xm<0){
                angle += Math.PI;
            }

            var result = {x:100, y:this.y-10};

            if ((angle > -0.80 && angle < 0.68) || (angle > 2.46 && angle < 4)){
                result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
            }else{
                result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
            }

            var x = result.x - (this.x + this.width/2);
            var y = result.y - (this.y + this.height/2);

            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        }
    });
}());
