# Loira Designer - Web based diagram designer

Loira Designer is a library that allows design diagrams directly in a web browser, with the power of JS canvas and HTML5.

[![Build Status](https://travis-ci.org/lanstat/loiraDesigner.svg?branch=master)](https://travis-ci.org/lanstat/loiraDesigner)
[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/lanstat/loiraDesigner/master/LICENSE)

## Getting Started

Clone this repo to your desktop and run `npm install` to install all the dependencies.

### Supported browsers

- Chrome
- Firefox
- IE (Until on testing)

### Installing

Npm
```
npm install loira-designer
```

Bower
```
bower install loira-designer
```


Basic example
```html
<div id="_canvas"></div>

<script type="text/javascript" src="../build/min/loira.min.js"></script>
```

```javascript
Loira.Config.assetsPath = '../build/assets/glyphs.png';

var canvas = new Loira.Canvas('_canvas');

canvas.add([new UseCase.UseCase({x:190,y:200, text:'Hello World'})]);
```

## Running the tests

```
npm test
```

## Authors

* **Javier Garson** - *Developer* - [lanstat](https://github.com/lanstat)

See also the list of [contributors](https://github.com/lanstat/loiraDesigner/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details