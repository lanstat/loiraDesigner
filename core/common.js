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
            this.points = [{}, {}];

            this.img = null;
            if (options.icon){
                this.img = document.createElement('IMG');
                this.img.src = Loira.Config.assetsPath + options.icon;
                this.img.onload = function() {}
            }

            this.baseType = 'relation';
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
                end = this.end,
                tmp,
                init,
                last;

            this.points[0] = {x: start.x + start.width/2, y: start.y + start.height/2};
            this.points[this.points.length - 1] = {x: end.x + end.width/2, y: end.y + end.height/2};
            init = this.points[0];
            last = this.points[1];

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(init.x, init.y);

            if (this.isDashed){
                ctx.setLineDash([5, 5]);
            }

            for (var i = 1; i < this.points.length; i++){
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.img){
                init = this.points[this.points.length - 2];
                last = this.points[this.points.length - 1];

                var xm = last.x - init.x;
                var ym = last.y - init.y;

                tmp = Math.atan(ym / xm);

                if (xm<0){
                    tmp += Math.PI;
                }

                ctx.translate(last.x, last.y);
                ctx.rotate(tmp);
                ctx.drawImage(this.img, -(15+end.obtainBorderPos(xm, ym, {x1:init.x, y1: init.y, x2:last.x, y2:last.y}, ctx)), -7);
                ctx.rotate(-tmp);
                ctx.translate(-last.x, -last.y);
            }

            /*if (this.text || this.text.length > 0){
                ctx.font = "10px " + Loira.Config.fontType;

                tmp = ctx.measureText(this.text).width;

                ctx.fillStyle = Loira.Config.background;
                ctx.fillRect(this.x1 + xm/2 - tmp/2, this.y1 + ym/2 - 15, tmp, 12);
                ctx.fillStyle = "#000000";

                ctx.fillText(this.text,
                    this.x1 + xm/2 - tmp/2,
                    this.y1 + ym/2 - 5);

                ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            }*/
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
            var init = null,
                last = null;
            var x1 = 0,
                x2 = 0;
            var y1 = 0,
                y2 = 0;

            for (var i = 1; i < this.points.length; i++){
                init = this.points[i - 1];
                last = this.points[i];
                x1 = init.x;
                y1 = init.y;
                y2 = last.y;
                x2 = last.x;


                if (init.x > last.x){
                    x1 = last.x;
                    x2 = init.x;
                }

                if (init.y > last.y){
                    y1 = last.y;
                    y2 = init.y;
                }

                if (x > x1 - 5 && x < x2 + 5 && y > y1 - 5 && y < y2 + 5){
                    y2 = last.y - init.y;
                    x2 = last.x - init.x;

                    x = x - init.x;
                    y = y - init.y;

                    var m = (y2 / x2) * x;

                    if (m > y - 8 && m < y + 8){
                        return true;
                    }
                }
            }

            return false;
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

            for (var i = 0; i < this.points.length; i++){
                ctx.fillRect(this.points[i].x-4, this.points[i].y-4, 8, 8);
            }

            ctx.strokeStyle= '#000000';
        },
        addPoint: function(){
            var _this = this;
            var last = _this.points[1],
                init = _this.points[0];

            var x = Math.round((last.x - init.x)/ 2) + init.x;
            var y = Math.round((last.y - init.y)/ 2) + init.y;

            _this.points.splice(1, 0, {x: x, y: y});
        },
        /**
         * Verifica si el punto se encuentra en alguno de los cuadrados de redimension
         *
         * @memberof Common.Relation#
         * @param pX Posicion x del punto
         * @param pY Posicion y del punto
         * @returns {*}
         */
        getSelectedCorner: function(pX, pY){
            for (var i = 1; i < this.points.length - 1; i++){
                var x = this.points[i].x-4,
                    y = this.points[i].y-4,
                    w = x + 8,
                    h = y + 8;
                if (pX > x && pX < w && pY > y && pY < h){
                    return i;
                }
            }
            return false;
        },
        /**
         * Mueve un punto de la relacion
         *
         * @memberof Common.Relation#
         * @param point Indice del punto a mover
         * @param x Delta de x
         * @param y Delta de y
         */
        movePoint: function(point, x, y){
            this.points[point].x += x;
            this.points[point].y += y;
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
            this.baseType = 'symbol';
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

                        if (item.baseType != 'relation'){
                            if(item.checkCollision(evt.x, evt.y) && !_this.noEndPoint){
                                var instance = Loira.util.stringToFunction(canvas.defaultRelation);
                                canvas.add(new instance({}).update(_this, item));
                                break;
                            }
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

Common.Container = (function(){
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

            this.text = options.text? options.text: 'Contenedor';
            this.width = 100;
            this.height = 100;
            this.type = 'container';
            this.baseType = 'container';
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

            ctx.rect(this.x, this.y, this.width, this.height);

            ctx.fillText('<< ' + this.text + ' >>', this.x, this.y+10);
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Symbol#
         * @param { int } xm Delta x de la relacion
         * @param { int } ym Delta y de la relacion
         * @param points Puntos que forman la linea de relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points){

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

/**
 * Clase para generacion de tablas de datos
 *
 * @memberof Common
 * @class Table
 * @augments Common.Symbol
 */
Common.Table = (function(){
    'use strict';

    return Loira.util.createClass(Common.Symbol, {
        /**
         * Inicializa los valores de la clase
         *
         * @memberof Common.Table#
         * @protected
         * @param { object } options Conjunto de valores iniciales
         */
        initialize : function(options){
            this.callSuper('initialize', options);

            this.text = options.text? options.text: 'Tabla';
            this.width = 100;
            this.height = 100;
            this.type = 'table';
            this.baseType = 'table';
        },
        /**
         * Renderiza el objeto
         *
         * @memberof Common.Table#
         * @param { CanvasRenderingContext2D } ctx Context 2d de canvas
         * @protected
         */
        _render: function(ctx) {
            var textW = ctx.measureText(this.text).width;
            if (textW > this.width){
                this.x = this.x + this.width/2 - textW/2;
                this.width = textW;
            }

            ctx.rect(this.x, this.y, this.width, this.height);

            ctx.fillText('<< ' + this.text + ' >>', this.x, this.y+10);
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Common.Table#
         * @param { int } xm Delta x de la relacion
         * @param { int } ym Delta y de la relacion
         * @param points Puntos que forman la linea de relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym, points){

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