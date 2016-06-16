
///
// Helper free functions

var Utility = {

	isAlphaNum: function(c) {
	    
	    c = c.charCodeAt(0);
	    
	    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c >= 48 && c <= 57))
	        return true;
	    else
	        return false;
	},

	isAlpha: function(c) {
	    
	    c = c.charCodeAt(0);
	    
	    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122))
	        return true;
	    else
	        return false;
	},

	isNum: function(c) {
	    
	    c = c.charCodeAt(0);
	    
	    if (c >= 48 && c <= 57)
	        return true;
	    else
	        return false;
	}
};