

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

AST.BoolOperatorEquivalent = function(lhs, rhs) {

    this.boolEquivLHS = lhs;
    this.boolEquivRHS = rhs;
}

AST.BoolOperatorLessThan = function(lhs, rhs) {
    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

AST.BoolOperatorLessThanEqualTo = function(lhs, rhs) {

    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

 AST.BoolOperatorGreaterThan = function(lhs, rhs) {

    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

AST.BoolOperatorGreaterThanEqualTo = function(lhs, rhs) {

    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
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

AST.Block = function() {
	this.subBlock = [];
}

AST.Block.prototype.addBlock = function(block) {
	this.subBlock.push(block);
}


///////////////