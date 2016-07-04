var IdentType = {
    TYPE_INT : 0,
    TYPE_REAL : 1,
};

var IdentMap = (function(){
    var identifiers = [];
    
    return {
        dbgPrintIdentMap() {
            console.log(identifiers);
        },
        addIdent: function(name, type, value) {
            identifiers[name] = [type : value];
        },
        getIdentValue: function(name) {
            return identifiers[name];
        },
        getType: function(name) {
            return identifiers[name][0];
        },
        getValue: function(name) {
            return identifiers[name][1];
        },
    }
}());