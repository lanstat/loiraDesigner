Loira.util = {
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
				this[i] = obj[i];
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
	}
}