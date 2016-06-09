
// Parser for syntatic analysis that builds an ast and evaluates code
// Web based assembly language generator for a BASIC-like programming language
// Graham Briggs
// April 2016


//import {TokenType} from 'lexer.js'

function errorRowColumn(obj, msg) {
    throw msg + ": " + obj.getCurrentToken().column + "," + obj.getCurrentToken().row;
}


var TokenType = {
    L_PAREN : 0,
    R_PAREN : 1,
    EQUALS  : 2,
    PLUS    : 3,
    MINUS   : 4,
    DIVISION: 5,
    MULTIPLICATION: 6,
    MODULUS : 7,
    INTEGER : 8,
    REAL    : 9,
    IDENTIFIER : 10,
    KEYWORD_IF    : 11,
    KEYWORD_ELSE  : 12,
    KEYWORD_THEN  : 13,
    KEYWORD_WHILE : 14,
    KEYWORD_TRUE  : 15,
    KEYWORD_FALSE : 16,
    KEYWORD_DO    : 17,
    KEYWORD_SKIP  : 18,
    OP_ASSIGNMENT : 19,
    OP_EQUIVALENT : 20,
    OP_LESS_THAN  : 21,
    OP_LESS_THAN_EQUAL_TO : 22,
    OP_GREATER_THAN : 23,
    OP_GREATER_THAN_EQUAL_TO : 24,
    OP_NOT        : 25,
    SCOPE_START   : 26,
    SCOPE_END     : 27,
    LINE_TERMINATOR : 28,
    EOF : 29
}

/////////////////////////////////////
/////////////////////////////////////

// Identifier binding

'use strict';

var identMap = (function(){
    var identifiers = {};
    
    return {
        dbgPrintIdentMap() {
            console.log(identifiers);
        },
        addIdent: function(name, value) {
            identifiers[name] = value;
        },
        getIdentValue: function(name) {
            return identifiers[name];
        }
    }
}());

////////////////////////////////////
////////////////////////////////////

// Parser

function parser(tokenList) {
    
    console.log("--- Parsing ---");
    var analyzer = new SyntaxAnalysis(tokenList);
    // start
    var ast = analyzer.block();

    console.log("-- Block result --");
    console.log(ast);
    
    /*
    var expRes = analyzer.expression();
    console.log("-- expression() result: ");
    console.log(expRes);
    */
    return ast;
}

function SyntaxAnalysis(tokenList) {
    
    this.tokens = tokenList;
    this.currentSymbolNumber = 0;
    this.currentToken = this.tokens[this.currentSymbolNumber];
    console.log("Starting SYMBOL: " + this.tokens[0].id);
}

SyntaxAnalysis.prototype.getCurrentToken = function() {
    return this.currentToken;
}

SyntaxAnalysis.prototype.getCurrentTokenType = function() {
    return this.currentToken.type;
}

SyntaxAnalysis.prototype.nextSymbol = function(sym) {
    
    this.currentSymbolNumber++;
    var sym = this.tokens[this.currentSymbolNumber];
    
    this.currentToken = sym;
    
    console.log("CURRENT SYMBOL: " + this.getCurrentToken().id);
           
}

SyntaxAnalysis.prototype.accept = function(symType) {
    
    if (this.getCurrentToken().type === symType) {
        this.nextSymbol();
        return true;
    }
    else
        return false;
}

SyntaxAnalysis.prototype.expect = function(symType) {
    
    if (this.getCurrentTokenType() === symType) {
        return true;
    }
    else {
        return false;
    }
}

SyntaxAnalysis.prototype.getPreviousToken = function() {
    
    return this.tokens[this.currentSymbolNumber - 1].id;
}

SyntaxAnalysis.prototype.tokenLookahead = function(howMany) {
    return this.tokens[this.currentSymbolNumber + howMany];
}

SyntaxAnalysis.prototype.factor = function() {
    
    // optional
    if (this.expect(TokenType.MINUS)) {
        this.accept(TokenType.MINUS);

        this.factor();
    }
    
    if (this.accept(TokenType.INTEGER)) {
        return new ASTInteger(parseInt(this.getPreviousToken()));
    }
    else if (this.accept(TokenType.REAL)) {
        return new ASTReal(parseFloat(this.getPreviousToken()))
    }
    else if (this.accept(TokenType.IDENTIFIER)) {
        
        console.log("ident: " + this.getPreviousToken());
        
        console.log("IDENT");
        console.log(identMap.dbgPrintIdentMap());
        
        //var idVal = getIdentValue(this.getPreviousToken());
        var idVal = identMap.getIdentValue(this.getPreviousToken());
        console.log("Idval: ");
        console.log(idVal);
        
        return new ASTInteger(idVal); 
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
    
}

SyntaxAnalysis.prototype.term = function() {
    
    var lhs = this.factor();
    var operator = null;
    
    if (!this.expect(TokenType.EOF)) {
        
        while (this.expect(TokenType.MULTIPLICATION) || this.expect(TokenType.DIVISION)
                                                     || this.expect(TokenType.MODULUS)) {
                                                        
            if (this.accept(TokenType.MULTIPLICATION)) {
                var rhs = this.term();
                operator = new ASTMultiplication(lhs, rhs);
            }
            else if (this.accept(TokenType.DIVISION)) {
                var rhs = this.term();
                
                operator = new ASTDivision(lhs, rhs);
            }
            else if (this.accept(TokenType.MODULUS)) {
                var rhs = this.term();
                
                operator = new ASTModulus(lhs, rhs);
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
}

SyntaxAnalysis.prototype.expression = function() {
    
    var lhs = this.term();
    var operator = null;
    
    if (!this.expect(TokenType.EOF)) {
        
        while (this.expect(TokenType.PLUS) || this.expect(TokenType.MINUS)) {
            
            if (this.accept(TokenType.PLUS)) {
                var rhs = this.expression();

                operator = new ASTAddition(lhs, rhs);
            }
            else if (this.accept(TokenType.MINUS)) {
                var rhs = this.expression();
                operator = new ASTSubtraction(lhs, rhs);
            }
        }
           
        while (this.expect(TokenType.OP_EQUIVALENT) || this.expect(TokenType.OP_LESS_THAN)
                                                    || this.expect(TokenType.OP_LESS_THAN_EQUAL_TO)
                                                    || this.expect(TokenType.OP_GREATER_THAN)
                                                    || this.expect(TokenType.OP_GREATER_THAN_EQUAL_TO)) {
            if (this.accept(TokenType.OP_EQUIVALENT)) {
                var rhs = this.expression();
                operator = new ASTBoolOperatorEquivalent(lhs, rhs);
            }
            else if (this.accept(TokenType.OP_LESS_THAN)) {
                var rhs = this.expression();
                operator = new ASTBoolOperatorLessThan(lhs, rhs);
            }
            else if (this.accept(TokenType.OP_LESS_THAN_EQUAL_TO)) {
                var rhs = this.expression()
                operator = new ASTBoolOperatorLessThanEqualTo(lhs, rhs);
            }
            else if (this.accept(TokenType.OP_GREATER_THAN)) {
                var rhs = this.expression();
                operator = new ASTBoolOperatorGreaterThan(lhs, rhs);
            }
            else if (this.accept(TokenType.OP_GREATER_THAN_EQUAL_TO)) {
                var rhs = this.expression();
                operator = new ASTBoolOperatorGreaterThanEqualTo(lhs, rhs);
            }
        }

        if (operator === null) {
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
}


SyntaxAnalysis.prototype.variableAssignment = function() {
    
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

        variableAssignment = new ASTAssignment(identTokenName, expResult);
        console.log("var assignment: ");
        console.log(variableAssignment);
    }
    else {
        errorRowColumn(this, "Missing terminator at");
    }

    //return identTokenName;
    return variableAssignment;
}



SyntaxAnalysis.prototype.ifStatement = function() {
    
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
        ifStmt = new ASTIfStatement(ifCond, ifBlock);
    }
    
    if (this.expect(TokenType.KEYWORD_ELSE)) {
        this.elseStatement();
    }
    return ifStmt;
}

SyntaxAnalysis.prototype.elseStatement = function() {
    
    this.accept(TokenType.KEYWORD_ELSE);
    
    this.accept(TokenType.SCOPE_START);
    
    this.block();
    
    this.accept(TokenType.SCOPE_END);
    console.log("ACCEPTED ELSE STATEMENT");
}

SyntaxAnalysis.prototype.whileStatement = function() {
    
    var wLoop = null;

    this.accept(TokenType.KEYWORD_WHILE);
    this.accept(TokenType.L_PAREN);
    
    //this.booleanExpression();
    var wCond = this.expression();
    
    this.accept(TokenType.R_PAREN);
    
    this.accept(TokenType.SCOPE_START);
    
    var wBlock = this.block();
    
    wLoop = new ASTWhileLoop(wCond, wBlock);

    this.accept(TokenType.SCOPE_END);

    return wLoop;
}

SyntaxAnalysis.prototype.skipStatement = function() {
    
    this.accept(TokenType.KEYWORD_SKIP);
    if (!this.accept(TokenType.LINE_TERMINATOR))
        errorRowColumn(this, "Expected terminator after skip");
}

SyntaxAnalysis.prototype.block = function() {
    
    console.log("In BLOCK");

    var block = new ASTBlock();
    
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


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

/*
 * AST objects
 */
// The fundamental types store the raw values of the data
// the operations execute the behaviour of those raw values.

function ASTInteger(val) {
    
    this.value = val;

}

function ASTReal(val) {
    
    this.value = val;
}

function ASTAddition(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
    
}

function ASTSubtraction(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
}

function ASTMultiplication(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;

}

function ASTDivision(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
    
}

function ASTModulus(lhs, rhs) {
    
    this.lhs = lhs;
    this.rhs = rhs;
}

/////////////////

function ASTExpression(expr) {

    this.expr = expr;
}

function ASTBoolOperatorEquivalent(lhs, rhs) {

    this.boolEquivLHS = lhs;
    this.boolEquivRHS = rhs;
}

function ASTBoolOperatorLessThan(lhs, rhs) {
    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

function ASTBoolOperatorLessThanEqualTo(lhs, rhs) {

    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

function ASTBoolOperatorGreaterThan(lhs, rhs) {

    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

function ASTBoolOperatorGreaterThanEqualTo(lhs, rhs) {

    this.boolExprLHS = lhs;
    this.boolExprRHS = rhs;
}

/////////////////

function ASTIdentifier(name) {
    this.name = name;
    
    this.result = function() {
        
    }
}

////////////////

function ASTAssignment(id, expr) {

	this.identifier = id;
	this.expr = expr;
}


////////////////

function ASTWhileLoop(cond, body) {

	this.condition = cond; // boolExpr
	this.body = body;
}

////////////////

function ASTIfStatement(cond, body) {

	this.condition = cond; // boolExpr
	this.body = body;
}

////////////////

function ASTIfElseStatement(cond, body1, body2) {

	this.condition = cond; // boolExpr

	this.bodyIf = body1;
	this.bodyElse = body2;
}

///////////////

function ASTBlock() {
	this.subBlock = [];
}

ASTBlock.prototype.addBlock = function(block) {
	this.subBlock.push(block);
}


///////////////
