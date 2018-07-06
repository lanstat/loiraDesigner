//Esta clase es solo para uso en desarrollo 

var classes = [
	"../../core/events.js",
	"../../core/canvas.js",
	"../../core/utils.js",
	"../../core/mouse.js",
	"../../core/keyboard.js",
    "../../core/shape.js",
	"../../core/controller.js",
	"../../core/animation.js",
	"../../core/element.js",
	"../../core/common.js",
    "../../core/relations.js",
	"../../plugins/xmiparser.js",
	"../../plugins/usecase.js",
	"../../plugins/box.js",
	"../../plugins/workflow.js",
    "../../plugins/orgchart.js",
	"../../core/drawable.js",
	"../../core/config.js"
];

var styles = [
	'../../styles/context-menu.css',
	'../../styles/text-editor.css',
	'../../styles/tooltip.css'
];


window.autoload = function(iter){
	if (iter >= classes.length){
		return;
	}
	var script = document.createElement('script');
	script.onload = function(){
		window.autoload(iter+1);
	};
	script.src = classes[iter];
	document.getElementsByTagName('head')[0].appendChild(script);
};

var autoStyles = function(){
	for (var i=0; i<styles.length; i++){
		var style = document.createElement('link');
		style.href = styles[i];
		style.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(style);
	}
};

autoStyles();
autoload(0);

