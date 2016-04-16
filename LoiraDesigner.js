//Esta clase es solo para uso en desarrollo 

var classes = [
	"../core/canvas.js",
	"../core/events.js",
	"../core/utils.js",
	"../core/objects.js",
	"../core/common.js",
    "../core/relations.js",
	"../plugins/usecase.js",
	"../config.js"
];


window.autoload = function(iter){
	if (iter >= classes.length){
		return;
	}
	var script = document.createElement('script');
	script.onload = function(){
		window.autoload(iter+1);
	}
	script.src = classes[iter];
	document.getElementsByTagName('head')[0].appendChild(script);
}

autoload(0);