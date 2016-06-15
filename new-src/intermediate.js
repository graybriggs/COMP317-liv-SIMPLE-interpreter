
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

var sequentialExpression = [];

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
}

IR.prototype.addition = function(subTree) {

	var lhs = this.expression();
	var rhs = this.expression();
}

IR.prototype.assignment = function(subTree) {

	console.log("in assignment");

	var id = this.identifier(subTree);
	console.log("LHS id = " + id);
	var res = this.expression(subTree.expr); // expr is an array - determine length
	

	//iterativeTraverse(subTree.expr);


	//var res = this.exp(subTree.expr);
	/*
	console.log("res: " + res);
	console.log(res);
	var r = f(res);
	console.log(r);
	*/
	console.log("sequentialExpression");
	console.log(sequentialExpression);

}

IR.prototype.identifier = function(subTree) {

	return subTree.identifier;
}

IR.prototype.expression = function(subTree) {

	console.log("In expression");

	if (subTree instanceof ASTInteger) {
		//return [subTree.value];
		return subTree.value;
	}
	else if (subTree instanceof ASTAddition
		 	|| subTree instanceof ASTSubtraction
			|| subTree instanceof ASTMultiplication
			|| subTree instanceof ASTDivision
			|| subTree instanceof ASTModulus) {

		//var operands = [];

		switch (subTree.constructor) {
			case ASTAddition:
				//operands.push("ADD");
				var lhs = this.expression(subTree.lhs);
				//operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				//operands.push(rhs);

				sequentialExpression.push("(ADD " + lhs + " " + rhs + ")");

				break;
			case ASTSubtraction:
				//operands.push("SUB");
				var lhs = this.expression(subTree.lhs);
				//operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				//operands.push(rhs);
				sequentialExpression.push("(SUB " + lhs + " " + rhs + ")");
				break;
			case ASTMultiplication:
				//operands.push("MUL");
				var lhs = this.expression(subTree.lhs);
				//operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				//operands.push(rhs);
				sequentialExpression.push("(MUL " + lhs + " " + rhs + ")");
				break;
			case ASTDivision:
				var lhs = this.expression(subTree.lhs);
				var rhs = this.expression(subTree.rhs);
				sequentialExpression.push("(DIV " + lhs + " " + rhs + ")");
				break;
			case ASTModulus:
				//operands.push("MOD");
				var lhs = this.expression(subTree.lhs);
				//operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				//operands.push(rhs);
				sequentialExpression.push("(MOD " + lhs + " " + rhs + ")");
				break;
		}
		//return operands;
		return "";
	}
}

// in-order interative traversal of expression tree
IR.prototype.exp = function(subTree) {

	var current = subTree;

	var stack = [];
	var flatArray = [];

	var done = false;

	console.log("Current:");
	console.log(current);

	while (!done) {

		if (current !== undefined) {
			if (current instanceof ASTAddition) {
				stack.push("ADD");
			}
			else if (current instanceof ASTSubtraction) {
				stack.push("SUB");
			}
			else if (current instanceof ASTMultiplication) {
				stack.push("MUL");
			}
		}

		if (current !== undefined) {
			stack.push(current.value);
			current = current.lhs;  // lhs
		}
		else {
			if (stack.length !== 0) {
				flatArray.push(stack.pop());
				current = current;
			}
			else {
				done = true;
			}
		}
	}
}

IR.prototype.block = function(subTree) {

	console.log("IR - here");

	if (subTree instanceof ASTBlock) {
		console.log("IR - and here");
		console.log(subTree.subBlock);

		subTree.subBlock.forEach(function(sblock) {
			if (sblock instanceof ASTAssignment) {
				console.log("got assignment");
				console.log(sblock);
				this.assignment(sblock);
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


////


