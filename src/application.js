

// Compiler entry point
// Graham Briggs
// June 2016


function main(userCode) {

	console.log("Starting Compiler...");

	var lexer = new Compiler.Lexer;
	var parser = new Compiler.Parser;
	var irgen = new Compiler.IRGenerator;

	//var codegen = new Compiler.CodeGenerator;

	lexer.scanner(userCode);
	var tokens = lexer.getTokens();

	updateLexerDiv(tokens);

	parser.acceptTokens(tokens);
	parser.startParser();

	var ast = parser.getAbstractSyntaxTree();

	console.log(ast);

	irgen.traverseAST(ast);
	var intermediateCode = irgen.getFinalIntermediateRepresentation();
	console.log("IR:");
	console.log(intermediateCode);
	updateIRDiv(intermediateCode);
	//var asmcode = codegen.start(intermediateCode);

}

function updateLexerDiv(tokens) {

	var tbl = "<div><table><tr><td>TOKEN DATA </td><td>TOKEN TYPE </td><td>ROW </td><td>COLUMN </td></tr>";
	for (var i = 0; i < tokens.length; i++) {
		var tok = "<tr><td>" + tokens[i].id + "</td><td>" + Tokens.TokenString.getTokenString(tokens[i].type)
		+ "</td><td>" + tokens[i].row + "</td><td>" + tokens[i].col + "</td></tr>";
		tbl += tok;
	}
	tbl += "</table></div>";
	document.getElementById("tokens").innerHTML = tbl;
}

function updateIRDiv(ir) {

	var tbl = "<div><table>";
	for (var i = 0; i < ir.length; i++) {
		tbl += "<tr><td>" + ir[i] + "</td></tr>";
	}
	tbl += "</table></div>";

	console.log(tbl);

	document.getElementById("ir").innerHTML = tbl;
}