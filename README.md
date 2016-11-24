[Loira Designer](http://lanstat.net) - Libreria de diseño de diagramas UML
=========
Loira Designer is a library that allows design directly diagrams in a web browser, with the help of JS canvas and HTML5.

[![Build Status](https://travis-ci.org/lanstat/loiraDesigner.svg?branch=master)](https://travis-ci.org/lanstat/loiraDesigner) [![Code Climate](https://codeclimate.com/github/lanstat/loiraDesigner/badges/gpa.svg)](https://codeclimate.com/github/lanstat/loiraDesigner) [![Issue Count](https://codeclimate.com/github/lanstat/loiraDesigner/badges/issue_count.svg)](https://codeclimate.com/github/lanstat/loiraDesigner)

Supported browsers
--------------------------------------

- Chrome
- Firefox
- IE (Until on testing)

Plugins / Diagrams
--------------------------------------

- Use case
- Workflow
- Box

Implementation
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

##### Scroll container and background #####

```html
<div id="container" style="width: 85%; height: 500px; float: left; overflow: auto">
    <canvas style="background-color:#aacccc" id="_canvas" width="800" height="500" tabindex="999"></canvas>
</div>
```

```javascript
var canvas = new Loira.Canvas('_canvas');

var image = new Image();
image.src = 'test.jpg';
image.onload = function () {
    canvas.setBackground(image, true);
    canvas.renderAll();
};

canvas.setScrollContainer('container');
```