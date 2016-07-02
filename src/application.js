

// Compiler entry point
// Graham Briggs
// June 2016


function main(userCode) {

	console.log("Starting Compiler...");

	var lexer = new Compiler.Lexer;
	var parser = new Compiler.Parser;
	var irgen = new Compiler.IRGenerator;
	var codegen = new Compiler.CodeGenerator;

////////////
	lexer.scanner(userCode);
	var tokens = lexer.getTokens();
	updateLexerDiv(tokens);
/////////

//////////
	parser.acceptTokens(tokens);
	parser.startParser();
	var ast = parser.getAbstractSyntaxTree();
	console.log(ast);
//////////

//////////
	irgen.traverseAST(ast);
	var intermediateCode = irgen.getFinalIntermediateRepresentation();
	console.log("IR:");
	console.log(intermediateCode);
	updateIRDiv(intermediateCode);
//////////

//////////
	codegen.startCodeGen(intermediateCode);
	var asmcode = codegen.getGeneratedASM();
	updateASMCodeDiv(asmcode);
//////////
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

////////////////////////

function prettyfyIR(ir) {
	console.log(ir);
	for (var i = 0; i < ir.length; i++) {
		if (ir[i].indexOf(":") > -1) {
			var line = ir[i];
			line = "<b>" + line + "</b>";
			console.log(line);
			ir[i] = line;
		}
	}
	return ir;
}

function updateIRDiv(ir) {

	ir = prettyfyIR(ir);
	console.log(ir);
	var tbl = "<div><center><table>";
	for (var i = 0; i < ir.length; i++) {
		tbl += "<tr><td>" + ir[i] + "</td></tr>";
	}
	tbl += "</table></center></div>";

	document.getElementById("ir").innerHTML = tbl;
}

///////////////////////

function prettyfyASM(asmcode) {
	
	for (var i = 0; i < asmcode.length; i++) {
		var pos = asmcode[i].indexOf(" ");
		var line = asmcode[i].split(" ");

		var updatedLine = "<font color=blue>" + line[0] + "</font>";

		var ss = line.slice(pos, asmcode[i].length);
		console.log(ss);
		asmcode[i] = updatedLine + " " + ss;
	}
	return asmcode;
}	

function updateASMCodeDiv(generatedASM) {

	//generatedASM = prettyfyASM(generatedASM);

	var tbl = "<div><center><table>";
	for (var i = 0; i < generatedASM.length; i++) {
		tbl += "<tr><td>" + generatedASM[i] + "</td></tr>";
	}
	tbl += "</table></center></div>";

	document.getElementById("codegen").innerHTML = tbl;
}
