
// Intermediate Representation Generator
// Graham Briggs June 2016

'use strict';

function IRGenerator(ast) {

	console.log("--- Generating IR ---");
	
	console.log("The AST: ");
	console.log(ast);

	var ir = new IR();
	ir.traverse(ast);
}

function IR() {
}

IR.prototype.traverse = function(ast) {

	var res = null;
	console.log(ast);
	this.block(ast);
	//res = this.expression(this.ast);
}

IR.prototype.addition = function(subTree) {

	var lhs = this.expression();
	var rhs = this.expression();
}

IR.prototype.assignment = function(subTree) {

	console.log("in assignment");

	var id = this.identifier(subTree);
	console.log("LHS id = " + id);
	var expr = this.expression(subTree.expr); // expr is an array - determine length
	console.log("Retrived from subtree: ");
	if (expr.length === 3)
		console.log(expr[1] + " " + expr[0] + " " + expr[2]);
	else if (expr.length === 1)
		console.log(expr[0]);
}

IR.prototype.identifier = function(subTree) {

	return subTree.identifier;
}

IR.prototype.expression = function(subTree) {

	console.log("In expression");

	if (subTree instanceof ASTInteger) {
		console.log("found int: " + subTree.value);
		return subTree.value;
	}
	else if (subTree instanceof ASTAddition || subTree instanceof ASTSubtraction
		  || subTree instanceof ASTMultiplication || subTree instanceof ASTDivision
		  || subTree instanceof ASTModulus) {

		console.log("Got: " + subTree.constructor);

		var operands = [];

		switch (subTree.constructor) {
			case ASTAddition:
				operands.push("ADD");
				break;
			case ASTSubtraction:
				operands.push("SUB");
				break;
			case ASTMultiplication:
				operands.push("MUL");
				break;
			case ASTDivision:
				operands.push("DIV");
				break;
			case ASTModulus:
				operands.push("MOD");
				break;
		}

		var lhs = this.expression(subTree.lhs);
		var rhs = this.expression(subTree.rhs);

		operands.push(lhs);
		operands.push(rhs);

		console.log("lhs: " + lhs + " rhs: " + rhs);

		return operands;
	}
}

IR.prototype.block = function(subTree) {

	console.log("IR - here");

	if (subTree instanceof ASTBlock) {
		console.log("IR - and here");
		console.log(subTree.subBlock);

		subTree.subBlock.forEach(function(sb) {
			if (sb instanceof ASTAssignment) {
				console.log("got assignment");
				this.assignment(sb);
			}
			else if (sb instanceof ASTWhileLoop) {
				// todo
			}
			else if (sb instanceof ASTIfStatement) {
				// todo
			}
		}.bind(this));
	}
}