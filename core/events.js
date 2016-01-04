/**
 * Evento que encapsula un click sobre el canvas
 * 
 * @event canvas:click
 * @type object
 * @property {integer} x - Posicion x del puntero
 * @property {integer} y - Posicion y del puntero
 */
var canvasClick = function(options){
	this.x = 'x' in options? options.x : -1;
	this.y = 'y' in options? options.y : -1;
};

/**
 * Evento que encapsula un click sobre un objeto
 * 
 * @event object:select
 * @type object
 * @property {object} selected - Objeto seleccionado
 */
var objectSelect = function(options){
	this.selected = 'selected' in options? options.selected : null;
}