
'use strict';

Compiler.Parser = function() {

	console.log("Starting parser...");

	// set these variables up upon receiving tokens - in acceptTokens function.

	this.tokens = null;
	this.currentSymbolNumber = 0;
	this.currentToken = null;

	///

	this.ast = null;

};

Compiler.Parser.prototype = {

	constructor: Compiler.Parser,

//////////////////
//// Interface ///
//////////////////

/// Accept tokens from lexer, begin the parsing of the tokens with startParser
/// get the parsed AST using getAbstractSyntaxTree

	acceptTokens: function(tokens) {
		this.tokens = tokens;
		this.currentSymbolNumber = 0;
		this.currentToken = this.tokens[this.currentSymbolNumber];
		console.log("Starting symbol: " + this.tokens[0].id);
	},

	startParser: function() {
		this.ast = this.block(); 
		//this.ast = this.expression();
	},

	getAbstractSyntaxTree: function() {
		return this.ast;
	},

/////////////////////////

	getCurrentToken: function() {
		return this.currentToken;
	},


	nextSymbol: function() {
		this.currentSymbolNumber++;
	    var sym = this.tokens[this.currentSymbolNumber];
	    
	    this.currentToken = sym;
	    
	    console.log("CURRENT SYMBOL: " + Tokens.TokenString.getTokenString(this.getCurrentToken().type) + ": " + this.getCurrentToken().id);      
	},

	accept: function(symType) {
		if (this.getCurrentToken().type === symType) {
        	this.nextSymbol();
        	return true;
	    }
	    else
	        return false;
	},

	expect: function(symType) {
		if (this.getCurrentToken().type === symType) {
			return true;
		}
		else {
			return false;
		}
	},

	getPreviousToken: function() {
		return this.tokens[this.currentSymbolNumber - 1].id;
	},

	tokenLookahead: function(howMany) {
		return this.tokens[this.currentSymbolNumber + howMany];
	},

	factor: function() {

	    // optional
	    if (this.expect(Tokens.Tokentype.MINUS)) {
	        this.accept(Tokens.Tokentype.MINUS);

	        this.factor();
	    }
	    
	    if (this.accept(Tokens.Tokentype.INTEGER)) {
	        return new AST.Integer(parseInt(this.getPreviousToken()));
	    }
	    else if (this.accept(Tokens.Tokentype.REAL)) {
	        return new AST.Real(parseFloat(this.getPreviousToken()))
	    }
	    else if (this.accept(Tokens.Tokentype.IDENTIFIER)) {
	        
	        console.log("ident: " + this.getPreviousToken());
	        
	        console.log("IDENT");
	        //console.log(identMap.dbgPrintIdentMap());
	        
	        //var idVal = getIdentValue(this.getPreviousToken());
	        //var idVal = identMap.getIdentValue(this.getPreviousToken());
	        
			var idVal = this.getPreviousToken();
	        console.log("Idval: ");
	        console.log(idVal);
	        
	        return new AST.Identifier(idVal); 
	    }
	    else if (this.accept(Tokens.Tokentype.L_PAREN)) {
	        console.log("L_PAREN");
	        
	        var exp = this.expression();
	        
	        this.accept(Tokens.Tokentype.R_PAREN);
	        console.log("R_PAREN");
	        return exp;
	    }
	    else if (this.accept(Tokens.Tokentype.EOF)) {
	        //throw "Reached EOF";
	        console.log("Reached EOF");
	        return;
	    }
	    else {
	        throw "Impossible...";
	    }
	},

	term: function() {

		var lhs = this.factor();
	    var operator = null;
	    
	    if (!this.expect(Tokens.Tokentype.EOF)) {
	        
	        while (this.expect(Tokens.Tokentype.MULTIPLICATION) || this.expect(Tokens.Tokentype.DIVISION)
	                                                     || this.expect(Tokens.Tokentype.MODULUS)) {
	                                                        
	            if (this.accept(Tokens.Tokentype.MULTIPLICATION)) {
	                var rhs = this.term();
	                operator = new AST.Multiplication(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.DIVISION)) {
	                var rhs = this.term();
	                
	                operator = new AST.Division(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.MODULUS)) {
	                var rhs = this.term();
	                
	                operator = new AST.Modulus(lhs, rhs);
	            }                                                                
	        }
	        
	        if (operator === null) {
	            return lhs;
	        }
	        else {
	            return operator;
	        }
	    }
	    else {
	        return lhs;
	    }

	},

	expression: function() {

	    var lhs = this.term();
	    var operator = null;
	    
	    if (!this.expect(Tokens.Tokentype.EOF)) {
	        
	        while (this.expect(Tokens.Tokentype.PLUS) || this.expect(Tokens.Tokentype.MINUS)) {
	            
	            if (this.accept(Tokens.Tokentype.PLUS)) {
	                var rhs = this.expression();

	                operator = new AST.Addition(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.MINUS)) {
	                var rhs = this.expression();
	                operator = new AST.Subtraction(lhs, rhs);
	            }
	        }
	           
	        while (this.expect(Tokens.Tokentype.OP_EQUIVALENT) || this.expect(Tokens.Tokentype.OP_LESS_THAN)
	                                                    || this.expect(Tokens.Tokentype.OP_LESS_THAN_EQUAL_TO)
	                                                    || this.expect(Tokens.Tokentype.OP_GREATER_THAN)
	                                                    || this.expect(Tokens.Tokentype.OP_GREATER_THAN_EQUAL_TO)) {
	            if (this.accept(Tokens.Tokentype.OP_EQUIVALENT)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorEquivalent(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_LESS_THAN)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorLessThan(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_LESS_THAN_EQUAL_TO)) {
	                var rhs = this.expression()
	                operator = new AST.BoolOperatorLessThanEqualTo(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_GREATER_THAN)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorGreaterThan(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_GREATER_THAN_EQUAL_TO)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorGreaterThanEqualTo(lhs, rhs);
	            }
	        }

	        if (operator === null) {
	            console.log("Returning expr lhs: ");
	            console.log(lhs);
	            return lhs;
	        }
	        else {
	            console.log("expression result [operator]: " + operator);
	            return operator;
	        }
	    }
	    else {
	        console.log("expression result [return]: " + lhs);
	        return lhs;
	    }
	},

	variableAssignment: function() {
		var variableAssignment = null;

	    if (this.accept(Tokens.Tokentype.IDENTIFIER)) {
	        console.log("var lhs is: " + this.getPreviousToken());
	        var identTokenName = this.getPreviousToken();
	        
	        if (this.accept(Tokens.Tokentype.OP_ASSIGNMENT)) {
	            var expResult = this.expression();
	            
	            if(!this.accept(Tokens.Tokentype.LINE_TERMINATOR)) {
	                errorRowColumn(this, "Missing terminator at");
	            }
	            console.log("Well formed variable assignment.");
	            //identMap.addIdent(identTokenName, expResult);
	        }
	        else {
	            errorRowColumn(this, "Expected assignment at");
	        }

	        variableAssignment = new AST.Assignment(identTokenName, expResult);
	        console.log("var assignment: ");
	        console.log(variableAssignment);
	    }
	    else {
	        errorRowColumn(this, "Missing terminator at");
	    }

	    //return identTokenName;
	    return variableAssignment;
	},

	ifStatement: function() {
		/*
	     *  if (a > b) {
	     *     // block ...
	     *  }
	     *  // optional
	     *  else {
	     *     // block ...
	     *  }
	     */
    
    	var ifStmt = null;

	    if (this.accept(Tokens.Tokentype.KEYWORD_IF)) {
	        this.accept(Tokens.Tokentype.L_PAREN);
	        
	        //this.booleanExpression();
	        var ifCond = this.expression();
	        
	        this.accept(Tokens.Tokentype.R_PAREN);
	        
	        this.accept(Tokens.Tokentype.SCOPE_START);
	        
	        var ifBlock = this.block();
	        
	        this.accept(Tokens.Tokentype.SCOPE_END);
	        console.log("ACCEPTED IF STATEMENT");
	        ifStmt = new AST.IfStatement(ifCond, ifBlock);
	    }
	    
	    if (this.expect(Tokens.Tokentype.KEYWORD_ELSE)) {
	        this.elseStatement();
	    }
	    return ifStmt;
	},

	elseStatement: function() {

		this.accept(Tokens.Tokentype.KEYWORD_ELSE);
    
	    this.accept(Tokens.Tokentype.SCOPE_START);
	    
	    this.block();
	    
	    this.accept(Tokens.Tokentype.SCOPE_END);
	    console.log("ACCEPTED ELSE STATEMENT");
	},

	whileStatement: function() {
		var wLoop = null;

	    this.accept(Tokens.Tokentype.KEYWORD_WHILE);
	    this.accept(Tokens.Tokentype.L_PAREN);
	    
	    //this.booleanExpression();
	    var wCond = this.expression();
	    
	    this.accept(Tokens.Tokentype.R_PAREN);
	    
	    this.accept(Tokens.Tokentype.SCOPE_START);
	    
	    var wBlock = this.block();
	    
	    wLoop = new AST.WhileLoop(wCond, wBlock);

	    this.accept(Tokens.Tokentype.SCOPE_END);

	    return wLoop;
	},

	skipStatement: function() {
		this.accept(Tokens.Tokentype.KEYWORD_SKIP);
    	
    	if (!this.accept(Tokens.Tokentype.LINE_TERMINATOR))
        	errorRowColumn(this, "Expected terminator after skip");
	},

	block: function() {

		console.log("In BLOCK");

	    var block = new AST.Block();

	    console.log("this here block");
	    console.log(block);
	    
	    while (this.expect(Tokens.Tokentype.IDENTIFIER) || this.expect(Tokens.Tokentype.KEYWORD_IF)
	                                             || this.expect(Tokens.Tokentype.KEYWORD_WHILE)
	                                             || this.expect(Tokens.Tokentype.KEYWORD_SKIP)
	                                             || this.expect(Tokens.Tokentype.INTEGER)
	                                             || this.expect(Tokens.Tokentype.REAL)
	                                             || this.expect(Tokens.Tokentype.IDENTIFIER)
	                                             || this.expect(Tokens.Tokentype.L_PAREN)) {
	                                                 
	    	console.log("here?");

	        if (this.expect(Tokens.Tokentype.IDENTIFIER) && this.tokenLookahead(1).type === Tokens.Tokentype.OP_ASSIGNMENT) {
	            console.log("Doing variable assignment");
	            var varAssignment = this.variableAssignment();
	            //block.addBlock(assTokenId, identMap.getIdentValue(assTokenId));
	            block.addBlock(varAssignment);

	        }
	        else if (this.expect(Tokens.Tokentype.KEYWORD_IF)) {
	            console.log("If statement");
	            var ifResult = this.ifStatement();
	            block.addBlock(ifResult);
	        }
	        else if (this.expect(Tokens.Tokentype.KEYWORD_WHILE)) {
	            console.log("while statement");
	            var whileResult = this.whileStatement();
	            block.addBlock(whileResult);
	        }
	        // reserved for interpreter only
	        /*
	        else if (this.expect(Tokens.Tokentype.KEYWORD_SKIP)) {
	            this.accept(Tokens.Tokentype.KEYWORD_SKIP);
	        }
	        else {
	            var res = this.expression();
	            console.log(res);
	        }
	        */
	    }
	    return block;
	}
};