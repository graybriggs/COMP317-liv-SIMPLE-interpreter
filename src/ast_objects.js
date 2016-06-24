

/*
 * AST objects
 */
// The fundamental types store the raw values of the data
// the operations execute the behaviour of those raw values.


AST = {};



AST.Integer = function(val) {
    
    this.value = val;

}

AST.Real = function(val) {
    
    this.value = val;
}

AST.Addition = function(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
    
}

AST.Subtraction = function(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
}

AST.Multiplication = function(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;

}

AST.Division = function(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
    
}

AST.Modulus = function(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
}

/////////////////

AST.Expression = function(expr) {

    this.expr = expr;
}

AST.BoolOpEquivalent = function(lhs, rhs) {

    this.lhs = lhs;
    this.rhs = rhs;
}

AST.BoolOpNotEquivalent = function(lhs, rhs) {

    this.lhs = lhs;
    this.rhs = rhs;
}

AST.BoolOpLessThan = function(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
}

AST.BoolOpLessThanEqualTo = function(lhs, rhs) {

    this.lhs = lhs;
    this.rhs = rhs;
}

 AST.BoolOpGreaterThan = function(lhs, rhs) {

    this.lhs = lhs;
    this.rhs = rhs;
}

AST.BoolOpGreaterThanEqualTo = function(lhs, rhs) {

    this.lhs = lhs;
    this.rhs = rhs;
}

/////////////////

AST.Identifier = function(name) {
    this.name = name;
    
    this.result = function() {
        
    }
}

////////////////

AST.Assignment = function(id, expr) {

	this.identifier = id;
	this.expr = expr;
}


////////////////

AST.WhileLoop = function(cond, body) {

	this.condition = cond; // boolExpr
	this.body = body;
}

////////////////

AST.IfStatement = function(cond, body) {

	this.condition = cond; // boolExpr
	this.body = body;
}

////////////////

AST.IfElseStatement = function(cond, body1, body2) {

	this.condition = cond; // boolExpr

	this.bodyIf = body1;
	this.bodyElse = body2;
}

///////////////

AST.Function = function(ident, args, body) {

    this.funcIdentifier = ident; // string
    this.funcArgs = args; // array
    this.body = body;     // AST.Block

}

///////////////

AST.Block = function() {
    this.subBlock = [];
}

AST.Block.prototype.addBlock = function(block) {
    this.subBlock.push(block);
}

//////////////

AST.GlobalScope = function() {

    this.functionDeclarations = [];
    this.blocks = [];
    this.globalVars = [];
}

AST.GlobalScope.prototype.addFunctionDeclaration = function(funcDecl) {
    this.functionDeclarations.push(funcDecl);
}

AST.GlobalScope.prototype.addSubBlock = function(subBlk) {
    this.blocks.push(subBlk);
}

AST.GlobalScope.prototype.addGlobalVariable = function(globalVar) {
    this.globalVars.push(globalVar);
}

///////////////