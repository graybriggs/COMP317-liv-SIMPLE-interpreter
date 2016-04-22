

//import {TokenType} from 'lexer.js'

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
    OP_GREATER_THAN : 22,
    OP_GREATER_THAN_EQUAL_TO : 23,
    OP_LESS_THAN_EQUAL_TO    : 24,
    OP_NOT        : 25,
    SCOPE_START   : 26,
    SCOPE_END     : 27,
    LINE_TERMINATOR : 28
}

function parser(tokenList) {
    
    var analyzer = new SyntaxAnalysis(tokenList);
    analyzer.test();
    analyzer.expression();
    
}

function SyntaxAnalysis(tokenList) {
    
    this.tokens = tokenList;
    this.currentSymbolNumber = 0;
    this.currentToken = this.tokens[this.currentSymbolNumber];
    
    this.test = function() {
        console.log("hi from the parser");
    }
}

SyntaxAnalysis.prototype.getCurrentToken = function() {
    return this.currentToken;
}

SyntaxAnalysis.prototype.getCurrentTokenType = function() {
    return this.currentToken.type;
}

SyntaxAnalysis.prototype.nextSymbol = function(sym) {
    var sym = this.tokens[this.currentSymbolNumber];
    this.currentSymbolNumber++;
    console.log("Cur sym: " + sym.type);
    this.currentToken = sym;
    //return sym;
}

SyntaxAnalysis.prototype.accept = function(symType) {
    
    if (this.getCurrentTokenType() === symType) {
        this.nextSymbol();
        return true;
    }
    else
        return false;
}


SyntaxAnalysis.prototype.factor = function() {
    
    if (this.accept(TokenType.INTEGER)) {
        console.log("INT");
    }
    else if (this.accept(TokenType.REAL)) {
        console.log("REAL");
    }
    else if (this.accept(TokenType.IDENTIFIER)) {
        console.log("IDENT");
    }
    else if (this.accept(TokenType.L_PAREN)) {
        console.log("L_PAREN");
        
        this.expression();
        
        this.accept(TokenType.R_PAREN);
        console.log("R_PAREN");
    }
    else {
        throw "Impossible...";
    }
    
    this.nextSymbol();
}

SyntaxAnalysis.prototype.term = function() {
    
    this.factor();
    
    
    if (this.getCurrentTokenType() === TokenType.MULTIPLICATION)
        console.log("MULT");
    else if (this.getCurrentTokenType() === TokenType.DIVISION)
        console.log("DIVISION");
    
    while (this.accept(TokenType.MULTIPLICATION) || this.accept(TokenType.DIVISION)) {
        this.factor();        
    }
}

SyntaxAnalysis.prototype.expression = function() {
    
    this.term();
    console.log(this.currentSymbolNumber);
    
    if (this.getCurrentTokenType() === TokenType.PLUS)
        console.log("PLUS");
    else if (this.getCurrentTokenType() === TokenType.MINUS)
        console.log("minus");
    
    while (this.accept(TokenType.PLUS) || this.accept(TokenType.MINUS)) {
        this.term();
    }
    
}

function variableAssignment() {
    
}

function ifElseStatement() {
    
}

function ifStatement() {
    
}

function whileStatement() {
    
}

function block() {
    
}
