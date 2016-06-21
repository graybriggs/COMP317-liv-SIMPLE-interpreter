
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

//var sequentialExpression = [];

Compiler.IRGenerator = function(ast) {

	console.log("--- Generating IR ---");

	this.labelCounter = 0;
	this.sequentialExpression = [];
	this.finalIR = [];

	this.irExprNum = 0;
};

Compiler.IRGenerator.prototype = {

	constructor: Compiler.IRGenerator,

	traverseAST: function(ast) {

		var res = null;
		console.log(ast);
		this.block(ast);
	},

	getFinalIntermediateRepresentation: function() {
		return this.finalIR;
	},

	addition: function(subTree) {

		var lhs = this.expression();
		var rhs = this.expression();
	},

	assignment: function(subTree) {
		var id = this.identifier(subTree);
		var lhsId = this.identifier(subTree);
		var expRes = this.expression(subTree.expr);

		if (expRes === "e")	 {
			console.log(lhsId + " ASSIGN e" + (this.irExprNum - 1));
			this.finalIR.push(lhsId + " ASSIGN e" + (this.irExprNum - 1));
		}
		else {
			console.log(lhsId + " ASSIGN " + expRes);
			this.finalIR.push(lhsId + "ASSIGN " + expRes);
		}

		return null;
	},

	identifier: function(subTree) {

		return subTree.identifier;
	},

	expression: function(subTree) {

		console.log(subTree);

		if (subTree instanceof AST.Integer) {
			return subTree.value;
		}
		// else if AST.Real else if AST.Identifier
		else if (subTree instanceof AST.Addition || subTree instanceof AST.Multiplication ||
			     subTree instanceof AST.Subtraction || subTree instanceof AST.Division ||
			     subTree instanceof AST.Modulus) {

			switch(subTree.constructor) {
				case AST.Addition:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "ADD");
					this.finalIR.push(irRes);

					break;
				case AST.Subtraction:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "SUB");
					this.finalIR.push(irRes);

					break;
				case AST.Multiplication:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "MUL");
					this.finalIR.push(irRes);

					break;
				case AST.Division:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "DIV");
					this.finalIR.push(irRes);

					break;
				case AST.Modulus:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "MOD");
					this.finalIR.push(irRes);

					break;
			}
			return "e";
		}
		return this.exprNum;
	},

	// helper for expression, avoiding code bloat
	produceExprIRHelper: function(lhs, rhs, binop) {

		var irCode;

		if (typeof(lhs) === "number" && typeof(rhs) === "number") {
			console.log("e" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs);
			irCode = "e" + this.irExprNum + "= " + lhs + " " + binop + " " + rhs;
			this.irExprNum++;
		}
		else if (typeof(lhs) === "number" && typeof(rhs) === "string") {
			console.log("e" + this.irExprNum + " = " + lhs + " " + binop + " " + "e" + (this.irExprNum - 1));
			irCode = "e" + this.irExprNum + " = " + lhs + " " + binop + " " + "e" + (this.irExprNum - 1);
			this.irExprNum++;
		}
		return irCode;
	},

	block: function(subTree) {

		console.log("IR - here");

		if (subTree instanceof AST.Block) {
			console.log(subTree.subBlock);

			subTree.subBlock.forEach(function(subblock) {
				if (subblock instanceof AST.Assignment) {
					//this.finalIR.push.apply(this.finalIR, this.assignment(subblock));
					
					this.assignment(subblock);
					//var r = this.test(subblock.expr); // assignment expr
					//console.log(r);
				}
				else if (subblock instanceof AST.WhileLoop) {
					// todo
				}
				else if (subblock instanceof AST.IfStatement) {
					this.finalIR.push.apply(this.finalIR, this.formIfStatementIR(subblock));
				}
			}.bind(this));
		}
	},

	////////////////
	////////////////


	formIfStatementIR: function() {

		// if (true) {
		//    // foo
		// else
		//   // bar
		//---------------
		//
		// e1 = expr
		// fjump L1
		// 
		//
		// L1

		var intRep = [];

		var storedLabelCounter = this.labelCounter;

		var expr = this.expression();
		this.finalIR.push.apply(this.finalIR, expr);

		var irLine = "fjump Label" + storedLabelCounter;
		this.finalIR.push(irLine);

		this.block();

		irLine = "Label" + storedLabelCounter;
		this.finalIR.push(irLine);

		this.labelCounter++;

		return 

	}

};


////


