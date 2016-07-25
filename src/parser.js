
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
		//this.ast = this.globalScope(); 
		this.ast = this.block();
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
	        console.log("accepted a negative...");
	        var expr = this.expression();

	        return new AST.Negative(expr);
	    }
	    else if (this.accept(Tokens.Tokentype.INTEGER)) {
	        return new AST.Integer(parseInt(this.getPreviousToken()));
	    }
	    else if (this.accept(Tokens.Tokentype.REAL)) {
	        return new AST.Real(parseFloat(this.getPreviousToken()))
	    }
	    else if (this.accept(Tokens.Tokentype.IDENTIFIER)) {
	        
	        console.log("ident: " + this.getPreviousToken());
			console.log(IdentMap.dbgPrintIdentMap());
	        
	        var idVal = IdentMap.getIdentValue(this.getPreviousToken());
	        
			var idVal = this.getPreviousToken();
	        console.log("Idval: ");
	        console.log(idVal);
	        
	        return new AST.Identifier(idVal); 
	    }
	    else if (this.accept(Tokens.Tokentype.L_PAREN)) {

	        var exp = this.parseExpression();
	        this.accept(Tokens.Tokentype.R_PAREN);
	        return exp;
	    }
	    else if (this.accept(Tokens.Tokentype.EOF)) {
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
	        
	        while (this.expect(Tokens.Tokentype.PLUS) || this.expect(Tokens.Tokentype.MINUS)){
	            
	            if (this.accept(Tokens.Tokentype.PLUS)) {
	                var rhs = this.expression();
	                operator = new AST.Addition(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.MINUS)) {
	                var rhs = this.expression();
	                operator = new AST.Subtraction(lhs, rhs);
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

	// In this language logical binary operators result in expressions.
	// These logical operators have the lowest precedence of all operators thus
	// they are placed highest in the generated AST.

	logicalOperator: function() {

		var lhs = this.expression();
		var operator = null;

		if (!this.expect(Tokens.Tokentype.EOF)) {

			while (this.expect(Tokens.Tokentype.OP_EQUIVALENT)
		        	|| this.expect(Tokens.Tokentype.OP_NOT_EQUIVALENT)
		        	|| this.expect(Tokens.Tokentype.OP_LESS_THAN)
					|| this.expect(Tokens.Tokentype.OP_LESS_THAN_EQUAL_TO)
					|| this.expect(Tokens.Tokentype.OP_GREATER_THAN)
					|| this.expect(Tokens.Tokentype.OP_GREATER_THAN_EQUAL_TO)) {

				if (this.accept(Tokens.Tokentype.OP_EQUIVALENT)) {
	                var rhs = this.logicalOperator();
	                if (rhs === "undefined") {
	                	throw "Expected value or identifier at " + this.getCurrentToken().row + ", " + this.getCurrentToken().col;
	                }
	                operator = new AST.BoolOpEquivalent(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_NOT_EQUIVALENT)) {
	            	var rhs = this.logicalOperator();
	            	operator = new AST.BoolOpNotEquivalent(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_LESS_THAN)) {
	                var rhs = this.logicalOperator();
	                operator = new AST.BoolOpLessThan(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_LESS_THAN_EQUAL_TO)) {
	                var rhs = this.logicalOperator();
	                operator = new AST.BoolOpLessThanEqualTo(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_GREATER_THAN)) {
	                var rhs = this.logicalOperator();
	                operator = new AST.BoolOpGreaterThan(lhs, rhs);
	            }
	            else if (this.accept(Tokens.Tokentype.OP_GREATER_THAN_EQUAL_TO)) {
	                var rhs = this.logicalOperator();
	                operator = new AST.BoolOpGreaterThanEqualTo(lhs, rhs);
	            }
			}

			if (operator == null) {
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

	parseExpression: function() {
		return this.logicalOperator();
	},

	variableAssignment: function() {
		var variableAssignment = null;

	    if (this.accept(Tokens.Tokentype.IDENTIFIER)) {
	        var identTokenName = this.getPreviousToken();
	        
	        if (this.accept(Tokens.Tokentype.OP_ASSIGNMENT)) {
	            var expResult = this.parseExpression();
	            
	            if(!this.accept(Tokens.Tokentype.LINE_TERMINATOR)) {
	                Error.errorRowColumn(this, "Missing terminator at");
	            }
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
	        //errorRowColumn(this, "Missing terminator at");
	        throw "Missing terminator at " + row + "," + column;
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
	        var ifCond = this.parseExpression();
	        
	        this.accept(Tokens.Tokentype.R_PAREN);
	        
	        this.accept(Tokens.Tokentype.SCOPE_START);
	        
	        var ifBlock = this.block();
	        
	        this.accept(Tokens.Tokentype.SCOPE_END);
	        console.log("ACCEPTED IF STATEMENT");

	    
		    if (this.expect(Tokens.Tokentype.KEYWORD_ELSE)) {
		    	var elseStmt = this.elseStatement();
		        return new AST.IfElseStatement(ifCond, ifBlock, elseStmt);
		    }
		    else {
		    	return new AST.IfStatement(ifCond, ifBlock);
		    }
		}
	},

	elseStatement: function() {

		this.accept(Tokens.Tokentype.KEYWORD_ELSE);
    
	    this.accept(Tokens.Tokentype.SCOPE_START);
	    
	    var blk = this.block();
	    
	    this.accept(Tokens.Tokentype.SCOPE_END);
	    console.log("ACCEPTED ELSE STATEMENT");
	    return blk;
	},

	whileStatement: function() {
		var wLoop = null;

	    this.accept(Tokens.Tokentype.KEYWORD_WHILE);
	    this.accept(Tokens.Tokentype.L_PAREN);
	    
	    var wCond = this.parseExpression();
	    
	    this.accept(Tokens.Tokentype.R_PAREN);
	    
	    this.accept(Tokens.Tokentype.SCOPE_START);
	    
	    var wBlock = this.block();
	    
	    wLoop = new AST.WhileLoop(wCond, wBlock);

	    this.accept(Tokens.Tokentype.SCOPE_END);

	    return wLoop;
	},

	functionCall: function() {

		funcArgs = [];

		this.accept(Tokens.Tokentype.KEYWORD_CALL);

		if (this.expect(Tokens.Tokentype.IDENTIFIER)) {
			this.accept(Tokens.Tokentype.IDENTIFIER);
			this.accept(Tokens.Tokentype.LINE_TERMINATOR);
		}
		else if (this.expect(Tokens.Tokentype.L_PAREN)) {
			this.accept(Tokens.Tokentype.L_PAREN);

			while (this.expect(Tokens.Tokentype.INTEGER) || this.expect(Tokens.Tokentype.REAL)
				  || this.expect(Tokens.Tokentype.IDENTIFIER)) {

				var argRes = this.parseExpression();

				funcArgs.push(argRes);

				if (!this.expect(Tokens.L_PAREN))
					this.accept(Tokens.Tokentype.COMMA_SEPARATOR);
				else
					throw "Expected comma or )";
			}
			this.accept(Tokens.Tokentype.LINE_TERMINATOR);
		}
		else {
			throw "Syntax error - expected argument list";
		}

		//return call obj;
	},

	functionDeclaration: function() {

		var argList = [];
		var bodyBlock;

		this.accept(Tokens.Tokentype.KEYWORD_FUNCTION)
		this.accept(Tokens.Tokentype.IDENTIFIER)

		var ident = this.getPreviousToken();

		this.accept(Tokens.Tokentype.L_PAREN)

		while (this.expect(Tokens.Tokentype.IDENTIFIER)) {

			if (this.expect(Tokens.Tokentype.IDENTIFIER)) {
				this.accept(Tokens.Tokentype.IDENTIFIER);
				var arg = this.getPreviousToken();

				argList.push(new AST.Identifier(arg));
			}

			if (this.expect(Tokens.Tokentype.COMMA_SEPARATOR)) {
				this.accept(Tokens.Tokentype.COMMA_SEPARATOR);
			}
			else if (this.expect(Tokens.Tokentype.L_PAREN)) {
				this.accept(Tokens.Tokentype.L_PAREN);
			}
		}
		if (this.expect(Tokens.Tokentype.R_PAREN)) {
			this.accept(Tokens.Tokentype.R_PAREN);
		}
		else {
			throw "Missing ) on function argument list";
		}
		this.accept(Tokens.Tokentype.SCOPE_START);

		bodyBlock = this.block();

		this.accept(Tokens.Tokentype.SCOPE_END);

		return new AST.Function(ident, argList, bodyBlock);
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
	                                             || this.expect(Tokens.Tokentype.L_PAREN)
	                                             || this.expect(Tokens.Tokentype.CALL)
	                                             // this.expect(Tokens.Tokentype.SCOPE_START)
	                                             // this.expect(Tokens.Tokentype.SCOPE_END)
	                                             ) {
	                                                

	        if (this.expect(Tokens.Tokentype.IDENTIFIER) && this.tokenLookahead(1).type === Tokens.Tokentype.OP_ASSIGNMENT) {
	            console.log("Doing variable assignment");
	            var varAssignment = this.variableAssignment();
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
	        else if (this.expect(Tokens.Tokentype.KEYWORD_CALL)) {
	        	console.log("call");
	        	var fcResult = this.functionCall();
	        	console.log(fcResult);
	        }
	        // reserved for interpreter only
	        /*
	        else if (this.expect(Tokens.Tokentype.KEYWORD_SKIP)) {
	            this.accept(Tokens.Tokentype.KEYWORD_SKIP);
	        }
	        else {
	            var res = this.parseExpression();
	            console.log(res);
	        }
	        */
	    }
	    return block;
	},

	globalScope: function() {

		console.log("Global scope");

		var gScope = new AST.GlobalScope();

	    while (this.expect(Tokens.Tokentype.IDENTIFIER) || this.expect(Tokens.Tokentype.KEYWORD_IF)
                                         || this.expect(Tokens.Tokentype.KEYWORD_WHILE)
                                         || this.expect(Tokens.Tokentype.IDENTIFIER)
                                         || this.expect(Tokens.Tokentype.L_PAREN)
                                         || this.expect(Tokens.Tokentype.CALL)
                                         || this.expect(Tokens.Tokentype.SCOPE_START)
                                         || this.expect(Tokens.Tokentype.SCOPE_END)
                                         || this.expect(Tokens.Tokentype.KEYWORD_FUNCTION)) {

	    	if (this.expect(Tokens.Tokentype.IDENTIFIER) && this.tokenLookahead(1).type === Tokens.Tokentype.OP_ASSIGNMENT) {
	            console.log("global variable assignment");
	            var varAssignment = this.variableAssignment();
	            gScope.addGlobalVariable(varAssignment);
	        }
	        else if (this.expect(Tokens.Tokentype.KEYWORD_IF)) {
	            console.log("If statement");
	            var ifResult = this.ifStatement();
	            gScope.addSubBlock(ifResult);
	        }
	        else if (this.expect(Tokens.Tokentype.KEYWORD_WHILE)) {
	            console.log("while statement");
	            var whileResult = this.whileStatement();
	            gScope.addSubBlock(whileResult);
	        }
	        else if (this.expect(Tokens.Tokentype.KEYWORD_CALL)) {
	        	console.log("call");
	        	var fcResult = this.functionCall();
	        	console.log(fcResult);
	        }
	        else if (this.expect(Tokens.Tokentype.KEYWORD_FUNCTION)) {
	        	console.log("function declarations");

	        	var func = this.functionDeclaration();
	        	gScope.addFunctionDeclaration(func);
	        	console.log(func);
	        }
	    }
	    console.log(gScope);
	    return gScope;
	},
};