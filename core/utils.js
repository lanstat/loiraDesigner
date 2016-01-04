drawable.util = {
	createClass: function(base, child){
		return function(options){
			for (var i in child) {
				if (child.hasOwnProperty(i)) {
					this[i] = child[i];
				}
			}
			for (var i in base) {
				if (base.hasOwnProperty(i)) {
					if (this.hasOwnProperty(i)){
						this['spr_'+i] = base[i];
					}else{
						this[i] = base[i];		
					}
				}
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