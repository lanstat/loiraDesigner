[Loira Designer](http://lanstat.net) - Libreria de diseño de diagramas UML
=========
Loira Designer is a library that allows design diagrams directly in a web browser, with the help of JS canvas and HTML5.

[![Build Status](https://travis-ci.org/lanstat/loiraDesigner.svg?branch=master)](https://travis-ci.org/lanstat/loiraDesigner)
[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/lanstat/loiraDesigner/master/LICENSE)

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
- Organization Chart

Implementation
--------------------------------------

```javascript
Loira.Config.assetsPath = '../../assets/glyphs.png';

var canvas = new Loira.Canvas('_canvas', {width: 1800, height:1000});

var case1 = new UseCase.UseCase({x:100,y:200, text:'Registrar usuario'});
var case2 = new UseCase.UseCase({x:500,y:200, text:'Iniciar sesion'});
var actor = new Common.Actor({x:20, y:10, text:'Administrador'});

canvas.on('relation:selected', function(event){
   console.log(event.selected);
});

canvas.add(case1, case2, actor);

canvas.add(new Relation.Dependency({start:case1, end:case2}));

document.getElementById('addObject').addEventListener('click', function(){
    var case1 = new UseCase.UseCase({x:140,y:140, text:'Mostrar evento'});
    canvas.add(case1);
    canvas.renderAll();
});
document.getElementById('setDirectRelation').addEventListener('click', function(){
    canvas.defaultRelation = 'Relation.DirectAssociation';
});
```

##### Scroll container and background #####

```html
<div id="container" style="width: 85%; height: 500px; float: left; overflow: auto">
    <div id="_canvas"></div>
</div>
```

```javascript
var canvas = new Loira.Canvas('_canvas', {height: 500, width: 800});

var image = new Image();
image.src = 'test.jpg';
image.onload = function () {
    canvas.setBackground(image, true);
    canvas.renderAll();
};
```