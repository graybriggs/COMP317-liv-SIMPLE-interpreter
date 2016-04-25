

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
    LINE_TERMINATOR : 28,
    EOF : 29
}

function parser(tokenList) {
    
    var analyzer = new SyntaxAnalysis(tokenList);
    analyzer.test();
    // start
    //analyzer.block();
    analyzer.expression();
    console.log(analyzer.tokens);
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
    var sym = this.tokens[this.currentSymbolNumber++];
    
    this.currentToken = sym;
    
    if (sym === TokenType.EOF) {
        console.log("EOF");
        throw "end.";
    }        
}

SyntaxAnalysis.prototype.accept = function(symType) {
    
    if (this.getCurrentToken().type === symType) {
        console.log("ACCEPTED: " + this.getCurrentTokenType());
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


SyntaxAnalysis.prototype.factor = function() {
    
    console.log("Getting FACTOR");
    
    // optional
    if (this.expect(TokenType.MINUS)) {
        console.log("minus");
        this.accept(TokenType.MINUS);

        this.factor();
    }
    
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
    else if (this.accept(TokenType.EOF)) {
        throw "Reached EOF";
    }
    else {
        throw "Impossible...";
    }
    
    this.nextSymbol();
}

SyntaxAnalysis.prototype.term = function() {
    
    this.factor();
    
    while (this.accept(TokenType.MULTIPLICATION) || this.accept(TokenType.DIVISION)
                                                 || this.accept(TokenType.MODULUS)) {
        this.factor();        
    }
}

SyntaxAnalysis.prototype.expression = function() {
    
    this.term();
    
    while (this.accept(TokenType.PLUS) || this.accept(TokenType.MINUS)) {
        this.term();
    }
    
}

SyntaxAnalysis.prototype.variableAssignment = function() {
    
    console.log("In var assignment");
    
    if (this.accept(TokenType.IDENTIFIER)) {
        
        if (this.accept(TokenType.OP_ASSIGNMENT)) {
            
            this.expression();
            
            this.accept(TokenType.LINE_TERMINATOR);
            console.log("Well formed variable assignment.");
        }
    }
    
}

SyntaxAnalysis.prototype.booleanExpression = function() {
    
}

SyntaxAnalysis.prototype.ifStatement = function() {
    
    /*
     *  if (a > b) {
     *     // block ...
     *  }
     */
    
    console.log("Doing if statement");
    
    if (this.accept(TokenType.KEYWORD_IF)) {
        this.accept(TokenType.L_PAREN);
        
        //this.booleanExpression();
        this.expression();
        //        this.nextSymbol();
        
        this.accept(TokenType.R_PAREN);
        
        this.accept(TokenType.SCOPE_START);
        
        this.block();
        
        this.accept(TokenType.SCOPE_END);
        console.log("ACCEPTED IF STATEMENT");
    }
    
    if (this.expect(TokenType.KEYWORD_ELSE)) {
        
        elseStatement();
    }
}

SyntaxAnalysis.prototype.elseStatement = function() {
    
    this.accept(TokenType.KEYWORD_ELSE);
    
    this.accept(TokenType.SCOPE_START);
    
    this.block();
    
    this.accept(TokenType.SCOPE_END);
    console.log("ACCEPTED ELSE STATEMENT");
}

SyntaxAnalysis.prototype.whileStatement = function() {
    

}

SyntaxAnalysis.prototype.block = function() {
    
    console.log("In BLOCK");
    
    var tok = this.getCurrentTokenType();
    while (this.expect(TokenType.IDENTIFIER) || this.expect(TokenType.KEYWORD_IF)
                                             || this.expect(TokenType.KEYWORD_WHILE)) {
        if (this.accept(TokenType.IDENTIFIER)) {
            console.log("Doing variable assignment");
            this.variableAssignment();
        }
        else if (this.accept(TokenType.KEYWORD_IF)) {
            console.log("If statement");
            this.ifStatement();
        }
        else if (this.accept(TokenType.KEYWORD_WHILE)) {
            console.log("while statement");
            this.whileStatement();
        }                                     
    }
    
}
