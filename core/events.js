/**
 * Objeto que encapsula un evento sobre el canvas
 * 
 * @type object
 * @property {integer} x - Posicion x del puntero
 * @property {integer} y - Posicion y del puntero
 * @property {string} type - Tipo de evento
 */
var mouseEvent = function(options){
	this.x = 'x' in options? options.x : -1;
	this.y = 'y' in options? options.y : -1;
	this.type = 'type' in options? options.type : '';
};

/**
 * Objeto que encapsula un click sobre un objeto
 * 
 * @type object
 * @property {object} selected - Objeto seleccionado
 * @property {string} type - Tipo de evento
 */
var objectEvent = function(options){
	this.selected = 'selected' in options? options.selected : null;
	this.type = 'type' in options? options.type : '';
}