
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

Compiler.IRGenerator = function() {

	console.log("--- Generating IR ---");

	this.uniqueConditionalLabelId = 0;
	this.uniqueLoopLabelId = 0;
	this.sequentialExpression = [];
	this.finalIR = [];

	this.irNodeNumber = 0;
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

		if (expRes === "$")	 {
			console.log(lhsId + " ASSIGN $" + (this.irExprNum - 1));
			//this.finalIR.push(lhsId + " ASSIGN $" + (this.irExprNum - 1));

			var rhs = "$" + (this.irExprNum - 1);

			var assignmentObject = new IR.Assignment(this.irNodeNumber, lhsId, rhs);

			this.finalIR.push(assignmentObject);
		}
		else {
			console.log(lhsId + " ASSIGN " + expRes);

			var assignmentObject = new IR.Assignment(this.irNodeNumber++, lhsId, expRes);

			//this.finalIR.push(lhsId + " ASSIGN " + expRes);
			this.finalIR.push(assignmentObject);
		}

		return null;
	},

	identifier: function(subTree) {

		return subTree.identifier;
	},

	expression: function(subTree) {

		console.log(subTree);

		if (subTree instanceof AST.Integer) {
			//return subTree.value;
			return "&lt;integer, " + subTree.value + "&gt";
		}
		else if (subTree instanceof AST.Real) {
			//return subTree.value;
			return "&lt;real, " + subTree.value + "&gt";
		}
		else if (subTree instanceof AST.Identifier) {
			return subTree.name;
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
			return "$";
		}
		return this.exprNum;
	},

	produceExpressionIR: function(lhs, rhs, binop) {

		// if an identifier is found then get its name
		var lhsRes;
		var rhsRes;

		//////

		if (lhs instanceof AST.Identifier) {
			lhsRes = lhs.name;
		}
		else {
				lhsRes = lhs;
		}

		if (rhs instanceof AST.Identifier) {
			rhsRes = rhs.name;
		}
		else {
			rhsRes = rhs;
		}

		// handle compound expressions by breaking them into triples and keep track using temporary variables.
		// all temporaries are a number preceded by $.

		var formedIR;
		if (lhs === "$" && rhs === "$") {
			formedIR = "$" + this.irExprNum + " = " + lhsRes + (this.irExprNum - 1) + " " + binop + " " + rhsRes + (this.irExprNum - 2);
		}
		else if (lhs === "$") {
			formedIR = "$" + this.irExprNum + " = " + lhsRes + (this.irExprNum - 1) + " " + binop + " " + rhsRes;
		}
		else if (rhs === "$") {
			formedIR = "$" + this.irExprNum + " = " + lhsRes + " " + binop + " " + rhsRes + (this.irExprNum - 1);
		}
		else {
			formedIR = "$" + this.irExprNum + " = " + lhsRes + " " + binop + " " + rhsRes;
		}

		var expObj = new IR.Expression(this.irNodeNumber++, formedIR);

		this.irExprNum++;
		//return formedIR;
		return expObj;
	},


	block: function(subTree) {

		console.log("IR - In Block");

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

			if (exprRes === "$") {
				irLine = "fjump $" + (this.irExprNum - 1) + " Label_" + tempUniqueLabelId;
				//this.finalIR.push(irLine);
				var jumpObj = new IR.Jump(irLine);
				this.finalIR.push(jumpObj);
			}
			else {
				if (exprRes instanceof AST.Identifier) {
					irLine = "fjump " + exprRes.name + " Label_" + tempUniqueLabelId;
				}
				else {
					irLine = "fjump " + exprRes + " Label_" + tempUniqueLabelId;
					var jumpObj = new IR.Jump(this.irNodeNumber++, irLine);
					this.finalIR.push(jumpObj);
				}
			}

			this.block(subTree.body);

			var labelIR = "Label_" + tempUniqueLabelId + ":";
			var labelObj = new IR.Label(this.irNodeNumber++, labelIR);
			this.finalIR.push(labelObj);
		}
		else if (subTree instanceof AST.IfElseStatement) {
			
			var exprRes = this.expression(subTree.condition);

			var ifElseEndUID = tempUniqueLabelId;

			if (exprRes === "$") {
				irLine = "fjump $" + (this.irExprNum - 1) + " Label_Else_" + tempUniqueLabelId;
				var jumpObj = new IR.Jump(this.irNodeNumber++, irLine);
				this.finalIR.push(jumpObj);
			}
			else {
				if (exprRes instanceof AST.Identifier)
					irLine = "fjump " + exprRes.name + " Label_Else_" + tempUniqueLabelId;
				else
					irLine = "fjump " + exprRes + " Label_Else_" + tempUniqueLabelId;
				
				var jmpObj = new IR.Jump(this.irNodeNumber++, irLine);
				this.finalIR.push(jmpObj);
			}

			this.block(subTree.bodyIf);

			irLine = "jump Label_End_" + ifElseEndUID + ":";
			var jmpObj = new IR.Jump(this.irNodeNumber++, irLine);
			this.finalIR.push(jmpObj);

			irLine = "Label_Else_" + tempUniqueLabelId + ":";
			var lblObj = new IR.Label(this.irNodeNumber++, irLine);
			this.finalIR.push(lblObj);

			this.block(subTree.bodyElse);

			lblObj = new IR.Label(this.irNodeNumber++, "Label_End_" + ifElseEndUID + ":")
			this.finalIR.push(lblObj);
		}

	},

	formWhileStatementIR: function(subTree) {

		var tempUniqueLabelId = this.uniqueLoopLabelId;
		this.uniqueLoopLabelId++;
		var irLine;

		irLine = "Label_Loop_Test_" + tempUniqueLabelId + ":";
		var lblObj = new IR.Label(this.irNodeNumber++, irLine);
		this.finalIR.push(lblObj);
		
		console.log(irLine);

		var exprRes = this.expression(subTree.condition);

		if (exprRes === "$") {
			irLine = "fjump $" + (this.irExprNum - 1) + " Label_Loop_End_" + tempUniqueLabelId;
			var lblObj = new IR.Label(this.irNodeNumber++, irLine);
			this.finalIR.push(lblObj);
			console.log(irLine);
		}
		else {
			if (exprRes instanceof AST.Identifier)
				irLine = "fjump " + exprRes.name + " Label_Loop_End_" + tempUniqueLabelId;
			else
				irLine = "fjump " + exprRes + " Label_Loop_End_" + tempUniqueLabelId;
			
			var jmpObj = new IR.Jump(this.irNodeNumber++, irLine);

			this.finalIR.push(jmpObj);
			console.log(irLine);
		}

		this.block(subTree.body);

		irLine = "jump Label_Loop_Test_" + tempUniqueLabelId + ":";
		var jumpObj = new IR.Jump(this.irNodeNumber++, irLine);
		this.finalIR.push(jumpObj);

		irLine = "Label_Loop_End_" + tempUniqueLabelId + ":";
		var lblEndObj = new IR.Label(this.irNodeNumber++, irLine);
		this.finalIR.push(lblEndObj);

		console.log(irLine);
	}

};


////


