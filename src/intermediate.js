
// Intermediate Representation Generator
// Graham Briggs
// June 2016

'use strict';

//var sequentialExpression = [];

Compiler.IRGenerator = function(ast) {

	console.log("--- Generating IR ---");

	this.sequentialExpression = [];
	
};

Compiler.IRGenerator.prototype = {

	constructor: Compiler.IRGenerator,

	traverseAST: function(ast) {

		var res = null;
		console.log(ast);
		this.block(ast);
	},

	addition: function(subTree) {

		var lhs = this.expression();
		var rhs = this.expression();
	},

	assignment: function(subTree) {

		console.log("in assignment");

		var id = this.identifier(subTree);
		console.log("LHS id = " + id);
		var res = this.expression(subTree.expr); // expr is an array - determine length
		
		
		console.log("-->" + res);

		console.log("sequentialExpression");
		console.log(this.sequentialExpression);

		this.formAssignmentIR(this.sequentialExpression);

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

					console.log(typeof(lhs));
					this.sequentialExpression.push("(+ " + lhs + " " + rhs + ")");


					//this.sequentialExpression.push("(+ " + lhs + " " + rhs + ")");

					break;
				case AST.Subtraction:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);

					this.sequentialExpression.push("(- " + lhs + " " + rhs + ")");

					break;
				case AST.Multiplication:
					//operands.push("MUL");
					var lhs = this.expression(subTree.lhs);
					//operands.push(lhs);
					var rhs = this.expression(subTree.rhs);
					//operands.push(rhs);
					this.sequentialExpression.push("(* " + lhs + " " + rhs + ")");
					break;
				case AST.Division:
					var lhs = this.expression(subTree.lhs);
					var rhs = this.expression(subTree.rhs);
					this.sequentialExpression.push("(/ " + lhs + " " + rhs + ")");
					break;
				case AST.Modulus:
					//operands.push("MOD");
					var lhs = this.expression(subTree.lhs);
					//operands.push(lhs);
					var rhs = this.expression(subTree.rhs);
					//operands.push(rhs);
					this.sequentialExpression.push("(% " + lhs + " " + rhs + ")");
					break;
			}
			//return operands;
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
					console.log("got assignment");
					console.log(sblock);
					this.assignment(sblock);
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

	formAssignmentIR: function(exp) {

		var expIR = [];
		var expNum = 0;


		for (var i = 0; i < exp.length; i++) {
			exp[i] = exp[i].replace("(", "");
			exp[i] = exp[i].replace(")", "");
		}

		console.log(exp);

		for (var i = 0; i < exp.length; i++) {

			var toks = exp[i].split(" ");

			console.log(toks);
			toks = this.removeDeadElements(toks)
			console.log(toks);

			if (toks.length === 3) {

				switch (toks[0]) {
				case '+':
					var irLine = "e" + expNum + " = " + toks[1] + " ADD " + toks[2];
					expIR.push(irLine);
					expNum++;
					break;
				case '-':
					var irLine = "e" + expNum + " = " + toks[1] + " SUB " + toks[2];
					expIR.push(irLine);
					expNum++;
					break;
				case '*':
					var irLine = "e" + expNum + " = " + toks[1] + " MUL " + toks[2];
					expIR.push(irLine);
					expNum++;
					break;
				case '/':
					var irLine = "e" + expNum + " = " + toks[1] + " DIV " + toks[2];
					expIR.push(irLine);
					expNum++;
					break;
				case '%':
					var irLine = "e" + expNum + " = " + toks[1] + " MOD " + toks[2];
					expIR.push(irLine);
					expNum++;
					break;
				}
			}
			else if (toks.length === 2) {
				switch (toks[0]) {
				case '+':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " ADD " + toks[1];
					expIR.push(irLine);
					expNum++;
					break;
				case '-':
					var irLine = "e" + expNum + " = " + (expNum - 1) + " SUB " + toks[1];
					expIR.push(irLine);
					expNum++;
					break;
				case '*':
					var irLine = "e" + expNum + " = " + (expNum - 1) + " MUL " + toks[1];
					expIR.push(irLine);
					expNum++;
					break;
				case '/':
					var irLine = "e" + expNum + " = " + (expNum - 1) + " DIV " + toks[1];
					expIR.push(irLine);
					expNum++;
					break;
				case '%':
					var irLine = "e" + expNum + " = " + (expNum - 1) + " MOD " + toks[1];
					expIR.push(irLine);
					expNum++;
					break;
				}
			}
			else if (toks.length === 1) {
				switch (toks[0]) {
				case '+':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " ADD e" + (expNum - 2);
					expIR.push(irLine);
					expNum++;
					break;
				case '-':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " SUB e" + (expNum - 2);
					expIR.push(irLine);
					expNum++;
					break;
				case '*':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " MUL e" + (expNum - 2);
					expIR.push(irLine);
					expNum++;
					break;
				case '/':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " DIV e" + (expNum - 2);
					expIR.push(irLine);
					expNum++;
					break;
				case '%':
					var irLine = "e" + expNum + " = e" + (expNum - 1) + " MOD e" + (expNum - 2);
					expIR.push(irLine);
					expNum++;
					break;
				}
			}
			else {
				throw "Empty tokens"
			}
		}

		console.log(expIR);
	},

	removeDeadElements(arr) {

		var result = []; 

		for (var i = 0; i < arr.length; i++) {
			if (arr[i] !== "") {
				result.push(arr[i]);
			}
		}
		return result;
	}

};


////


