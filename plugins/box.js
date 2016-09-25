/**
 * Diagrama de cajas para seleccion de regiones
 *
 * @namespace
 * @license Apache-2.0
 */
var Box = {};

/**
 * Clase base para los simbolos uml
 *
 * @memberof Box
 * @class Box
 * @augments Loira.Object
 */
Box.Box = (function(){
    'use strict';

    return Loira.util.createClass(Loira.Object, {
        /**
         * Funcion de preparacion de valores inciales (Es una funcion de ayuda sera borrada cuando se consiga solucionar
         * el problema con la recursion de funcion heradadas)
         *
         * @memberof Box.Box#
         * @protected
         * @param { object } options Datos con valores inciales
         */
        _prepare : function(options){
            this.width = 'width' in options ? options.width : 30;
            this.height = 'height' in options ? options.height : 30;
            this.color =  'color' in options ? options.color: 'rgba(0,0,0,0.3)';

            this.baseType = 'box';
        },
        _render: function(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";
        },
        /**
         * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
         *
         * @memberof Box.Box#
         * @param xm Delta x de la relacion
         * @param ym Delta y de la relacion
         * @returns {number} Distancia borde del simbolo
         */
        obtainBorderPos : function(xm, ym){
            return 0;
        }
    });
}());