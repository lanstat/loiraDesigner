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

var case1 = new UseCase.UseCase({x:200,y:200, text:'Registrar usuario'});
var case2 = new UseCase.UseCase({x:300,y:300, text:'Iniciar sesion'});
var actor = new Common.Actor({x:20, y:10, name:'Administrador'});

canvas.on('relation:selected', function(event){
   console.log(event.selected) 
});

canvas.add(case1, case2, actor);

//Se le da un timeout para q carguen las imagenes, se mantiene hasta encontrar otra forma
//solo es en la primera renderizacion
setTimeout(function(){
    canvas.renderAll();
}, 50);
```

