

// Compiler entry point


function main(userCode) {

	console.log("Starting Compiler...");

	var lexer = new Compiler.Lexer;
	var parser = new Compiler.Parser;
	//var irgen = new Compiler.IRGenerator;
	//var codegen = new Compiler.CodeGenerator;

	lexer.scanner(userCode);
	var tokens = lexer.getTokens();

	parser.acceptTokens(tokens);
	parser.startParser();

	var ast = parser.getAbstractSyntaxTree();

	console.log(ast);

}