
'use strict';

Compiler.Parser = function() {

	console.log("Creating parser object...");

}

Compiler.Parser.prototype = function() {

	constructor: Compiler.Parser,

	getCurrentToken: function() {
		return this.currentToken;
	},

	getCurrentTokenType: function() {
		return this.getCurrentToken.type;
	},

	nextSymbol: function() {
		this.currentSymbolNumber++;
	    var sym = this.tokens[this.currentSymbolNumber];
	    
	    this.currentToken = sym;
	    
	    console.log("CURRENT SYMBOL: " + this.getCurrentToken().id);      
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
	   if (this.getCurrentTokenType() === symType) {
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
	    if (this.expect(TokenType.MINUS)) {
	        this.accept(TokenType.MINUS);

	        this.factor();
	    }
	    
	    if (this.accept(TokenType.INTEGER)) {
	        return new AST.Integer(parseInt(this.getPreviousToken()));
	    }
	    else if (this.accept(TokenType.REAL)) {
	        return new AST.Real(parseFloat(this.getPreviousToken()))
	    }
	    else if (this.accept(TokenType.IDENTIFIER)) {
	        
	        console.log("ident: " + this.getPreviousToken());
	        
	        console.log("IDENT");
	        console.log(identMap.dbgPrintIdentMap());
	        
	        //var idVal = getIdentValue(this.getPreviousToken());
	        var idVal = identMap.getIdentValue(this.getPreviousToken());
	        console.log("Idval: ");
	        console.log(idVal);
	        
	        return new AST.Integer(idVal); 
	    }
	    else if (this.accept(TokenType.L_PAREN)) {
	        console.log("L_PAREN");
	        
	        var exp = this.expression();
	        
	        this.accept(TokenType.R_PAREN);
	        console.log("R_PAREN");
	        return exp;
	    }
	    else if (this.accept(TokenType.EOF)) {
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
	    
	    if (!this.expect(TokenType.EOF)) {
	        
	        while (this.expect(TokenType.MULTIPLICATION) || this.expect(TokenType.DIVISION)
	                                                     || this.expect(TokenType.MODULUS)) {
	                                                        
	            if (this.accept(TokenType.MULTIPLICATION)) {
	                var rhs = this.term();
	                operator = new AST.Multiplication(lhs, rhs);
	            }
	            else if (this.accept(TokenType.DIVISION)) {
	                var rhs = this.term();
	                
	                operator = new AST.Division(lhs, rhs);
	            }
	            else if (this.accept(TokenType.MODULUS)) {
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
	    
	    if (!this.expect(TokenType.EOF)) {
	        
	        while (this.expect(TokenType.PLUS) || this.expect(TokenType.MINUS)) {
	            
	            if (this.accept(TokenType.PLUS)) {
	                var rhs = this.expression();

	                operator = new AST.Addition(lhs, rhs);
	            }
	            else if (this.accept(TokenType.MINUS)) {
	                var rhs = this.expression();
	                operator = new AST.Subtraction(lhs, rhs);
	            }
	        }
	           
	        while (this.expect(TokenType.OP_EQUIVALENT) || this.expect(TokenType.OP_LESS_THAN)
	                                                    || this.expect(TokenType.OP_LESS_THAN_EQUAL_TO)
	                                                    || this.expect(TokenType.OP_GREATER_THAN)
	                                                    || this.expect(TokenType.OP_GREATER_THAN_EQUAL_TO)) {
	            if (this.accept(TokenType.OP_EQUIVALENT)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorEquivalent(lhs, rhs);
	            }
	            else if (this.accept(TokenType.OP_LESS_THAN)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorLessThan(lhs, rhs);
	            }
	            else if (this.accept(TokenType.OP_LESS_THAN_EQUAL_TO)) {
	                var rhs = this.expression()
	                operator = new AST.BoolOperatorLessThanEqualTo(lhs, rhs);
	            }
	            else if (this.accept(TokenType.OP_GREATER_THAN)) {
	                var rhs = this.expression();
	                operator = new AST.BoolOperatorGreaterThan(lhs, rhs);
	            }
	            else if (this.accept(TokenType.OP_GREATER_THAN_EQUAL_TO)) {
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

	    if (this.accept(TokenType.IDENTIFIER)) {
	        console.log("var lhs is: " + this.getPreviousToken());
	        var identTokenName = this.getPreviousToken();
	        
	        if (this.accept(TokenType.OP_ASSIGNMENT)) {
	            var expResult = this.expression();
	            
	            if(!this.accept(TokenType.LINE_TERMINATOR)) {
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

	    if (this.accept(TokenType.KEYWORD_IF)) {
	        this.accept(TokenType.L_PAREN);
	        
	        //this.booleanExpression();
	        var ifCond = this.expression();
	        
	        this.accept(TokenType.R_PAREN);
	        
	        this.accept(TokenType.SCOPE_START);
	        
	        var ifBlock = this.block();
	        
	        this.accept(TokenType.SCOPE_END);
	        console.log("ACCEPTED IF STATEMENT");
	        ifStmt = new AST.IfStatement(ifCond, ifBlock);
	    }
	    
	    if (this.expect(TokenType.KEYWORD_ELSE)) {
	        this.elseStatement();
	    }
	    return ifStmt;
	},

	elseStatement: function() {

		this.accept(TokenType.KEYWORD_ELSE);
    
	    this.accept(TokenType.SCOPE_START);
	    
	    this.block();
	    
	    this.accept(TokenType.SCOPE_END);
	    console.log("ACCEPTED ELSE STATEMENT");
	},

	whileStatement: function() {
		var wLoop = null;

	    this.accept(TokenType.KEYWORD_WHILE);
	    this.accept(TokenType.L_PAREN);
	    
	    //this.booleanExpression();
	    var wCond = this.expression();
	    
	    this.accept(TokenType.R_PAREN);
	    
	    this.accept(TokenType.SCOPE_START);
	    
	    var wBlock = this.block();
	    
	    wLoop = new AST.WhileLoop(wCond, wBlock);

	    this.accept(TokenType.SCOPE_END);

	    return wLoop;
	},

	skipStatement: function() {
		this.accept(TokenType.KEYWORD_SKIP);
    	
    	if (!this.accept(TokenType.LINE_TERMINATOR))
        	errorRowColumn(this, "Expected terminator after skip");
	},

	block: function() {

		console.log("In BLOCK");

	    var block = new AST.Block();
	    
	    while (this.expect(TokenType.IDENTIFIER) || this.expect(TokenType.KEYWORD_IF)
	                                             || this.expect(TokenType.KEYWORD_WHILE)
	                                             || this.expect(TokenType.KEYWORD_SKIP)
	                                             || this.expect(TokenType.INTEGER)
	                                             || this.expect(TokenType.REAL)
	                                             || this.expect(TokenType.IDENTIFIER)
	                                             || this.expect(TokenType.L_PAREN)) {
	                                                 
	        if (this.expect(TokenType.IDENTIFIER) && this.tokenLookahead(1).type === TokenType.OP_ASSIGNMENT) {
	            console.log("Doing variable assignment");
	            var varAssignment = this.variableAssignment();
	            //block.addBlock(assTokenId, identMap.getIdentValue(assTokenId));
	            block.addBlock(varAssignment);

	        }
	        else if (this.expect(TokenType.KEYWORD_IF)) {
	            console.log("If statement");
	            var ifResult = this.ifStatement();
	            block.addBlock(ifResult);
	        }
	        else if (this.expect(TokenType.KEYWORD_WHILE)) {
	            console.log("while statement");
	            var whileResult = this.whileStatement();
	            block.addBlock(whileResult);
	        }
	        // reserved for interpreter only
	        /*
	        else if (this.expect(TokenType.KEYWORD_SKIP)) {
	            this.accept(TokenType.KEYWORD_SKIP);
	        }
	        else {
	            var res = this.expression();
	            console.log(res);
	        }
	        */
	    }
	    return block;
	}

}