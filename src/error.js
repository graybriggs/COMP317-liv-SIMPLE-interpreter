

var Error = {

	errorRowColumn: function(obj, msg) {
	    throw msg + ": " + obj.getCurrentToken().column + "," + obj.getCurrentToken().row;
	}
};