
// Intermediate Representation Generator
// Graham Briggs June 2016


function IRGenerator(ast) {

	console.log("--- Generating IR ---");
	
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
	console.log(subTree.identifier);

	var id = this.identifier(subTree);
	var expr = this.expression(subTree.expression);
}

IR.prototype.identifier = function(subTree) {

	console.log("ID is: " + subTree.identifier);
	return subTree.identifier;
}

IR.prototype.expression = function(subTree) {

	console.log("exp");
	console.log(subTree);

	if (subTree.expression instanceof ASTInteger) {
		console.log("found int: " + subTree.expression.value);
		return subTree.expression.value;
	}
	else if (subTree.expression instanceof ASTAddition) {
		console.log("add");
		var lhs = this.expression(subTree.expression.lhs);
		var rhs = this.expression(subTree.expression.rhs);
		console.log("lhs: " + lhs + " rhs: " + rhs);
	}
	return null;
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