
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

//var sequentialExpression = [];

Compiler.IRGenerator = function(ast) {

	console.log("--- Generating IR ---");

	this.sequentialExpression = [];
	this.finalIR = [];
	
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
		var exp = this.expression(subTree.expr);

		console.log("lhs: " + lhsId);
		
		console.log(this.sequentialExpression);

		var assignIR  = this.formAssignmentIR(lhsId, this.sequentialExpression);

		console.log(assignIR);

		return assignIR;
	},

	identifier: function(subTree) {

		return subTree.identifier;
	},

	expression: function(subTree) {

		console.log("In expression");

		if (subTree instanceof AST.Integer) {
			//return [subTree.value];
			return subTree.value;
		}
		else if (subTree instanceof AST.Addition
			 	|| subTree instanceof AST.Subtraction
				|| subTree instanceof AST.Multiplication
				|| subTree instanceof AST.Division
				|| subTree instanceof AST.Modulus) {

			//var operands = [];

			switch (subTree.constructor) {
				case AST.Addition:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					this.sequentialExpression.push("(+ " + lhs + " " + rhs + ")");
					break;
				case AST.Subtraction:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					this.sequentialExpression.push("(- " + lhs + " " + rhs + ")");
					break;
				case AST.Multiplication:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					this.sequentialExpression.push("(* " + lhs + " " + rhs + ")");
					break;
				case AST.Division:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					this.sequentialExpression.push("(/ " + lhs + " " + rhs + ")");
					break;
				case AST.Modulus:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					this.sequentialExpression.push("(% " + lhs + " " + rhs + ")");
					break;
			}
			return "";
		}
	},


	block: function(subTree) {

		console.log("IR - here");

		if (subTree instanceof AST.Block) {
			console.log("IR - and here");
			console.log(subTree.subBlock);

			subTree.subBlock.forEach(function(sblock) {
				if (sblock instanceof AST.Assignment) {
					this.finalIR.push.apply(this.finalIR, this.assignment(sblock));
				}
				else if (sblock instanceof AST.WhileLoop) {
					// todo
				}
				else if (sblock instanceof AST.IfStatement) {
					// todo
				}
			}.bind(this));
		}
	},

	//////////////

	formAssignmentIR: function(lhs, exp) {

		var intRep = [];
		var expNum = 0;

		for (var i = 0; i < exp.length; i++) {
			exp[i] = exp[i].replace("(", "");
			exp[i] = exp[i].replace(")", "");
		}

		console.log("HERE");
		console.log(exp);

		for (var i = 0; i < exp.length; i++) {

			var toks = exp[i].split(" ");

			console.log(toks);

			// helper function
			var removeDeadElements = function(arr) {
				var result = []; 
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] !== "") {
						result.push(arr[i]);
					}
				}
				return result;
			};

			console.log(toks);
			toks = removeDeadElements(toks);
			console.log(toks);

			if (toks.length === 3) {

				switch (toks[0]) {
				case '+':
					var irLine = "e" + expNum + " = " + toks[1] + " ADD " + toks[2];
					intRep.push(irLine);
					expNum++;
					break;
				case '-':
					var irLine = "e" + expNum + " = " + toks[1] + " SUB " + toks[2];
					intRep.push(irLine);
					expNum++;
					break;
				case '*':
					var irLine = "e" + expNum + " = " + toks[1] + " MUL " + toks[2];
					intRep.push(irLine);
					expNum++;
					break;
				case '/':
					var irLine = "e" + expNum + " = " + toks[1] + " DIV " + toks[2];
					intRep.push(irLine);
					expNum++;
					break;
				case '%':
					var irLine = "e" + expNum + " = " + toks[1] + " MOD " + toks[2];
					intRep.push(irLine);
					expNum++;
					break;
				}
			}
			else if (toks.length === 2) {
				switch (toks[0]) {
				case '+':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " ADD " + toks[1];
					intRep.push(irLine);
					expNum++;
					break;
				case '-':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " SUB " + toks[1];
					intRep.push(irLine);
					expNum++;
					break;
				case '*':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " MUL " + toks[1];
					intRep.push(irLine);
					expNum++;
					break;
				case '/':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " DIV " + toks[1];
					intRep.push(irLine);
					expNum++;
					break;
				case '%':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " MOD " + toks[1];
					intRep.push(irLine);
					expNum++;
					break;
				}
			}
			else if (toks.length === 1) {
				switch (toks[0]) {
				case '+':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " ADD e" + (expNum - 2);
					intRep.push(irLine);
					expNum++;
					break;
				case '-':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " SUB e" + (expNum - 2);
					intRep.push(irLine);
					expNum++;
					break;
				case '*':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " MUL e" + (expNum - 2);
					intRep.push(irLine);
					expNum++;
					break;
				case '/':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " DIV e" + (expNum - 2);
					intRep.push(irLine);
					expNum++;
					break;
				case '%':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " MOD e" + (expNum - 2);
					intRep.push(irLine);
					expNum++;
					break;
				}
			}
			else {
				throw "Empty tokens"
			}
		}

		

		////////

		var assign;

		if (expNum > 0)
			assign = lhs + " ASSIGN e" + (expNum - 1);
			


		intRep.push(assign);

		return intRep;
	},

};


////


