
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

//var sequentialExpression = [];

Compiler.IRGenerator = function(ast) {

	console.log("--- Generating IR ---");

	this.uniqueConditionalLabelId = 0;
	this.uniqueLoopLabelId = 0;
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
			this.finalIR.push(lhsId + " ASSIGN " + expRes);
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
		else if (subTree instanceof AST.Real) {
			return subTree.value;
		}
		else if (subTree instanceof AST.Identifier) {
			return subTree;
		}
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

// found identifiers
		if (lhs instanceof AST.Identifier && rhs instanceof AST.Identifier) {
			console.log("e" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs.name);
			irCode = "e" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs.name;
		}
		else if (lhs instanceof AST.Identifier) {
			if (typeof(rhs) === "number") {
				console.log("e" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs);
				irCode = "e" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs;
			}
			else if (typeof(rhs) === "string") {
				console.log("e" + this.irExprNum + " = " + lhs.name + " " + binop + " e" + (this.irExprNum - 1));
				irCode = "e" + this.irExprNum + " = " + lhs.name + " " + binop + " e" + (this.irExprNum - 1);
			}
		}
		else if (rhs instanceof AST.Identifier) {
			if (typeof(lhs) === "number") {
				console.log("e" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs.name);
				irCode = "e" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs.name;
			}
			else if (typeof(lhs) === "string") {
				console.log("e" + this.irExprNum + " = " + lhs + " " + binop + " e" + (this.irExprNum - 1));
				irCode = "e" + this.irExprNum + " = " + lhs + " " + binop + " e" + (this.irExprNum - 1);
			}
		}
		else {
			if (typeof(lhs) === "number" && typeof(rhs) === "number") {
				console.log("e" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs);
				irCode = "e" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs;
			}
			else if (typeof(lhs) === "number" && typeof(rhs) === "string") {
				console.log("e" + this.irExprNum + " = " + lhs + " " + binop + " " + "e" + (this.irExprNum - 1));
				irCode = "e" + this.irExprNum + " = " + lhs + " " + binop + " " + "e" + (this.irExprNum - 1);
			}
		}
		this.irExprNum++;
		return irCode;
	},

	block: function(subTree) {

		console.log("IR - here");

		if (subTree instanceof AST.Block) {
			console.log(subTree.subBlock);

			subTree.subBlock.forEach(function(subblock) {
				if (subblock instanceof AST.Assignment) {
					this.assignment(subblock);
				}
				else if (subblock instanceof AST.WhileLoop) {
					this.formWhileStatementIR(subblock);
				}
				else if (subblock instanceof AST.IfStatement) {
					this.formIfStatementIR(subblock);
				}
			}.bind(this));
		}
	},

	////////////////
	////////////////


	formIfStatementIR: function(subTree) {

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

		var tempUniqueLabelId = this.uniqueConditionalLabelId;
		this.uniqueConditionalLabelId++;
		var irLine;

		var exprRes = this.expression(subTree.condition);

		if (exprRes === "e") {
			irLine = "fjump e" + (this.irExprNum - 1) + " Label_" + tempUniqueLabelId;
			this.finalIR.push(irLine);
			console.log(irLine);
		}
		else {
			if (exprRes instanceof AST.Identifier)
				irLine = "fjump " + exprRes.name + " Label_" + tempUniqueLabelId;
			else
				irLine = "fjump " + exprRes + " Label_" + tempUniqueLabelId;
			
			this.finalIR.push(irLine);
			console.log(irLine);
		}

		this.block(subTree.body);

		irLine = "Label_" + tempUniqueLabelId;
		this.finalIR.push(irLine);
	},

	formWhileStatementIR: function(subTree) {

		var tempUniqueLabelId = this.uniqueLoopLabelId;
		this.uniqueLoopLabelId++;
		var irLine;

		irLine = "Label_Loop_Test_" + tempUniqueLabelId;
		this.finalIR.push(irLine);
		console.log(irLine);

		var exprRes = this.expression(subTree.condition);

		if (exprRes === "e") {
			irLine = "fjump e" + (this.irExprNum - 1) + " Label_Loop_End_" + tempUniqueLabelId;
			this.finalIR.push(irLine);
			console.log(irLine);
		}
		else {
			if (exprRes instanceof AST.Identifier)
				irLine = "fjump " + exprRes.name + " Label_Loop_End_" + tempUniqueLabelId;
			else
				irLine = "fjump " + exprRes + " Label_Loop_End_" + tempUniqueLabelId;
			
			this.finalIR.push(irLine);
			console.log(irLine);
		}

		this.block(subTree.body);

		irLine = "jump Label_Test_" + tempUniqueLabelId;
		this.finalIR.push(irLine);
		console.log(irLine);

		irLine = "Label_Loop_Test_End_" + tempUniqueLabelId;
		this.finalIR.push(irLine);
		console.log(irLine);
	}

};


////


