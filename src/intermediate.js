
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

//var sequentialExpression = [];

Compiler.IRGenerator = function() {

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
			     subTree instanceof AST.BoolOpNotEquivalent ||
			     subTree instanceof AST.BoolOpLessThan ||
			     subTree instanceof AST.BoolOpLessThanEqualTo ||
			     subTree instanceof AST.BoolOpGreaterThan ||
			     subTree instanceof AST.BoolOpGreaterThanEqualTo) {

			switch(subTree.constructor) {
				case AST.Addition:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "ADD");
					this.finalIR.push(irRes);

					break;
				case AST.Subtraction:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "SUB");
					this.finalIR.push(irRes);

					break;
				case AST.Multiplication:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "MUL");
					this.finalIR.push(irRes);

					break;
				case AST.Division:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "DIV");
					this.finalIR.push(irRes);

					break;
				case AST.Modulus:

					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					var irRes = this.produceExpressionIR(lhs, rhs, "MOD");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpEquivalent:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "Bool_EQ");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpNotEquivalent:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "BOOL_NOT_EQ");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpLessThan:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "Bool_LT");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpLessThanEqualTo:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "Bool_LTET");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpGreaterThan:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "Bool_GT");
					this.finalIR.push(irRes);

					break;
				case AST.BoolOpGreaterThanEqualTo:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					var irRes = this.produceExpressionIR(lhs, rhs, "Bool_GTET");
					this.finalIR.push(irRes);

					break;
				
			}
			return "t";
		}
		return this.exprNum;
	},

	produceExpressionIR: function(lhs, rhs, binop) {

		// if an identifier is found then get its name
		var lhsRes;
		if (lhs instanceof AST.Identifier) {
			lhsRes = lhs.name;
		}
		else {
			lhsRes = lhs;
		}
		var rhsRes;
		if (rhs instanceof AST.Identifier) {
			rhsRes = rhs.name;
		}
		else {
			rhsRes = rhs;
		}

		// handle compound expressions by breaking them into triples and keep track using temporary variables.

		var formedIR;
		if (lhs === "t" && rhs === "t") {
			formedIR = "t" + this.irExprNum + " = " + lhsRes + (this.irExprNum - 1) + " " + binop + " " + rhsRes + (this.irExprNum - 2);
		}
		else if (lhs === "t") {
			formedIR = "t" + this.irExprNum + " = " + lhsRes + (this.irExprNum - 1) + " " + binop + " " + rhsRes;
		}
		else if (rhs === "t") {
			formedIR = "t" + this.irExprNum + " = " + lhsRes + " " + binop + " " + rhsRes + (this.irExprNum - 1);
		}
		else {
			formedIR = "t" + this.irExprNum + " = " + lhsRes + " " + binop + " " + rhsRes;
		}

		this.irExprNum++;
		return formedIR;
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
				else if (subblock instanceof AST.IfStatement || subblock instanceof AST.IfElseStatement) {
					this.formIfElseStatementIR(subblock);
				}
			}.bind(this));
		}
	},

	////////////////
	////////////////

	formIfElseStatementIR: function(subTree) {

		// if (true) {
		//    // foo
		// else
		//   // bar
		//---------------
		//
		// e1 = expr
		// fjump el L1
		// {if instructions}
		// LabelElse1:
		// {else instructions}


		var tempUniqueLabelId = this.uniqueConditionalLabelId;
		this.uniqueConditionalLabelId++;
		var irLine;

		if (subTree instanceof AST.IfStatement) {

			var exprRes = this.expression(subTree.condition);

			if (exprRes === "t") {
				irLine = "fjump t" + (this.irExprNum - 1) + " Label_" + tempUniqueLabelId;
				this.finalIR.push(irLine);
			}
			else {
				if (exprRes instanceof AST.Identifier)
					irLine = "fjump " + exprRes.name + " Label_" + tempUniqueLabelId;
				else
					irLine = "fjump " + exprRes + " Label_" + tempUniqueLabelId;
				
				this.finalIR.push(irLine);
			}

			this.block(subTree.body);

			this.finalIR.push("Label_" + tempUniqueLabelId + ":");
		}
		else if (subTree instanceof AST.IfElseStatement) {
			
			var exprRes = this.expression(subTree.condition);

			if (exprRes === "t") {
				irLine = "fjump t" + (this.irExprNum - 1) + " Label_Else_" + tempUniqueLabelId;
				this.finalIR.push(irLine);
			}
			else {
				if (exprRes instanceof AST.Identifier)
					irLine = "fjump " + exprRes.name + " Label_Else_" + tempUniqueLabelId;
				else
					irLine = "fjump " + exprRes + " Label_Else" + tempUniqueLabelId;
				
				this.finalIR.push(irLine);
			}

			this.block(subTree.bodyIf);

			this.finalIR.push("Label_Else_" + tempUniqueLabelId + ":");

			this.block(subTree.bodyElse)
		}

	},

	formWhileStatementIR: function(subTree) {

		var tempUniqueLabelId = this.uniqueLoopLabelId;
		this.uniqueLoopLabelId++;
		var irLine;

		irLine = "Label_Loop_Test_" + tempUniqueLabelId + ":";
		this.finalIR.push(irLine);
		console.log(irLine);

		var exprRes = this.expression(subTree.condition);

		if (exprRes === "t") {
			irLine = "fjump t" + (this.irExprNum - 1) + " Label_Loop_End_" + tempUniqueLabelId;
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
		irLine = "jump Label_Loop_Test_" + tempUniqueLabelId + ":";
		this.finalIR.push(irLine);
		irLine = "Label_Loop_End_" + tempUniqueLabelId + ":";
		this.finalIR.push(irLine);
		console.log(irLine);
	}

};


////


