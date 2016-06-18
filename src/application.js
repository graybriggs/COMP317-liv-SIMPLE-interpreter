

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

	var intermediateCode = irgen.traverseAST(ast);

	//var asmcode = codegen.start(intermediateCode);

}

function updateLexerDiv(tokens) {

	var tbl = "<div><table><tr><td>ID:</td><td>TYPE:</td><td>ROW</td><td>COLUMN</td></tr>";
	for (var i = 0; i < tokens.length; i++) {
		var tok = "<tr><td>" + tokens[i].id + "</td><td>" + Tokens.TokenString.getTokenString(tokens[i].type)
		+ "</td><td>" + tokens[i].row + "</td><td>" + tokens[i].col + "</td></tr>";
		tbl += tok;
	}
	tbl += "</table><div>";
	document.getElementById("tokens").innerHTML = tbl;
}