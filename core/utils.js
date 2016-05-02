Loira.util = {
	/**
	 * Crea un objeto o funcion que extiende la base con los metodos del hijo
     *
	 * @param base Objeto base a extender
	 * @param child Objecto que agregara sus funciones a la base
	 * @param isAbstract Determina si lo que se retornara es un objeto (abstracto) o un funcion (clase instanciable)
     * @returns {*} Retorna un objeto o funcion instanciable
     */
	createClass: function(base, child, isAbstract){
		var obj = {};
		for (var i in child) {
			if (child.hasOwnProperty(i)) {
				obj[i] = child[i];
			}
		}
		for (var i in base) {
			if (base.hasOwnProperty(i)) {
				if (obj.hasOwnProperty(i)){
					obj['$'+i] = base[i];
				}else{
					obj[i] = base[i];		
				}
			}
		}
		if(isAbstract){
			return obj;
		}
		return function(options){
			for (var i in obj) {
                if (obj.hasOwnProperty(i)){
                    this[i] = obj[i];
                }
			}
			
			this.initialize(options);
		}
	},
	createRandom: function (maxLength){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < maxLength; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	},
	intersectPointLine : function (line1, line2){
		var den = ((line1.y2 - line1.y1) * (line2.x2 - line2.x1)) - ((line1.x2 - line1.x1) * (line2.y2 - line2.y1));
		if (den == 0) {
			return 0;
		}
		var a = line2.y1 - line1.y1;
		var b = line2.x1 - line1.x1;
		var numerator1 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);
		var numerator2 = ((line2.x2 - line2.x1) * a) - ((line2.y2 - line2.y1) * b);
		a = numerator1 / den;
		b = numerator2 / den;

		return {x: line2.x1 + (a * (line2.x2 - line2.x1)), y: line2.y1 + (a * (line2.y2 - line2.y1))};
	}
};