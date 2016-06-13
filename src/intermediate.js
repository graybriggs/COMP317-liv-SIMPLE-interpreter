
// Intermediate Representation Generator
// Graham Briggs
// June 2016

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
	console.log("res: " + res);

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

		var operands = [];

		switch (subTree.constructor) {
			case ASTAddition:
				operands.push("ADD");
				var lhs = this.expression(subTree.lhs);
				operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				operands.push(rhs);
				break;
			case ASTSubtraction:
				operands.push("SUB");
				var lhs = this.expression(subTree.lhs);
				operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				operands.push(rhs);
				break;
			case ASTMultiplication:
				operands.push("MUL");
				var lhs = this.expression(subTree.lhs);
				operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				operands.push(rhs);
				break;
			case ASTDivision:
				operands.push("DIV");
				var lhs = this.expression(subTree.lhs);
				operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				operands.push(rhs);
				break;
			case ASTModulus:
				operands.push("MOD");
				var lhs = this.expression(subTree.lhs);
				operands.push(lhs);
				var rhs = this.expression(subTree.rhs);
				operands.push(rhs);
				break;
		}
		return operands;
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


function flattenMultiDimensionalArray(multiArray) {

	var done = false;
	var stack = [];

	var current = multiArray;
	var flatArray = [];

	console.log(current[0]);

	while (!done) {

		if (current[0] !== undefined) {
			stack.push(current[0]);
			current = current[1];  // lhs
		}
		else {
			if (stack.length !== 0) {
				//console.log("pop: " + stack[stack.length]);
				flatArray.push(stack[stack.length]);
				stack.pop();
				current = current[2]; // rhs
			}
			else {
				done = true;
			}
		}
	}
	return flatArray;
}