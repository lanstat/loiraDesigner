[Loira Designer](http://lanstat.net) - Libreria de diseño de diagramas UML
=========
Loira Designer es una libreria que permite diseñar diagramas UML directamente en un browser, con la ayuda de canvas
y HTML5.

Navegadores soportados
--------------------------------------

- Chrome
- Firefox
- IE (Todavia en pruebas)

Implementacion
--------------------------------------

```javascript
var canvas = new Loira.Canvas('_canvas');

var r2 = new UseCase.UseCase({x:200,y:200});
r2.on({
	icon: '../assets/clean.png', 
	click: function(){
	}
});

canvas.add(r2);
canvas.renderAll();

canvas.on({
	'object:selected': function(evt){
		console.log(evt);
	},
	'mouse:down': function(evt){
		console.log(evt);
	}
});
```

