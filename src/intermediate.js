
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

		if (expRes === "t")	 {
			console.log(lhsId + " ASSIGN t" + (this.irExprNum - 1));
			this.finalIR.push(lhsId + " ASSIGN t" + (this.irExprNum - 1));
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
		else if (subTree instanceof AST.Addition ||
				 subTree instanceof AST.Multiplication ||
			     subTree instanceof AST.Subtraction ||
			     subTree instanceof AST.Division ||
			     subTree instanceof AST.Modulus ||
			     subTree instanceof AST.BoolOpEquivalent ||
			     subTree instanceof AST.BoolOpLessThan ||
			     subTree instanceof AST.BoolOpLessThanEqualTo ||
			     subTree instanceof AST.BoolOpGreaterThan ||
			     subTree instanceof AST.BoolOpGreaterThanEqualTo) {

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
				case AST.BoolOpEquvalent:
					console.log("GOT BOOL OP ==");
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "Bool_EQ");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpLessThan:
					console.log("GOT BOOL OP < ");
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "Bool_LT");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpLessThanEqualTo:
					console.log("GOT BOOL OP <=");
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "Bool_LTET");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpGreaterThan:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "Bool_GT");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpGreaterThanEqualTo:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExprIRHelper(lhs, rhs, "Bool_GTET");
					this.finalIR.push(irRes);

					break;
			}
			return "t";
		}
		return this.exprNum;
	},

	// helper for expression, avoiding code bloat
	produceExprIRHelper: function(lhs, rhs, binop) {

		var irCode;

// found identifiers
		if (lhs instanceof AST.Identifier && rhs instanceof AST.Identifier) {
			console.log("t" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs.name);
			irCode = "t" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs.name;
		}
		else if (lhs instanceof AST.Identifier) {
			if (typeof(rhs) === "number") {
				console.log("t" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs);
				irCode = "t" + this.irExprNum + " = " + lhs.name + " " + binop + " " + rhs;
			}
			else if (typeof(rhs) === "string") {
				console.log("t" + this.irExprNum + " = " + lhs.name + " " + binop + " t" + (this.irExprNum - 1));
				irCode = "t" + this.irExprNum + " = " + lhs.name + " " + binop + " t" + (this.irExprNum - 1);
			}
		}
		else if (rhs instanceof AST.Identifier) {
			if (typeof(lhs) === "number") {
				console.log("t" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs.name);
				irCode = "t" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs.name;
			}
			else if (typeof(lhs) === "string") {
				console.log("t" + this.irExprNum + " = " + lhs + " " + binop + " t" + (this.irExprNum - 1));
				irCode = "t" + this.irExprNum + " = " + lhs + " " + binop + " t" + (this.irExprNum - 1);
			}
		}
		else {
			if (typeof(lhs) === "number" && typeof(rhs) === "number") {
				console.log("t" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs);
				irCode = "t" + this.irExprNum + " = " + lhs + " " + binop + " " + rhs;
			}
			else if (typeof(lhs) === "number" && typeof(rhs) === "string") {
				console.log("t" + this.irExprNum + " = " + lhs + " " + binop + " " + "t" + (this.irExprNum - 1));
				irCode = "t" + this.irExprNum + " = " + lhs + " " + binop + " " + "t" + (this.irExprNum - 1);
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

		if (exprRes === "t") {
			irLine = "fjump t" + (this.irExprNum - 1) + " Label_" + tempUniqueLabelId;
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

		if (exprRes === "t") {
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


