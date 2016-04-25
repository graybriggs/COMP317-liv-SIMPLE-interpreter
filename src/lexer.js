
// Web based assembly language generator for a BASIC-like programming language
// Graham Briggs
// April 2016
//


/////////////////////////
// Lexical analysis
/////////////////////////



function lexer(data) {
    
    var scan = new Scanner(data);
    
    scan.extractTokens();
  
    scan.tokens.forEach(printTokens);
 
    return scan.tokens;
}

function printTokens(cur_val, index, array) {
    
    console.log(cur_val);
}

///
// Helper free functions


function isAlphaNum(c) {
    
    c = c.charCodeAt(0);
    
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c >= 48 && c <= 57))
        return true;
    else
        return false;
}

function isAlpha(c) {
    
    c = c.charCodeAt(0);
    
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122))
        return true;
    else
        return false;
}

function isNum(c) {
    
    c = c.charCodeAt(0);
    
    if (c >= 48 && c <= 57)
        return true;
    else
        return false;
}


///


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

function Token(id, tt, row, col) {
    
    this.id = id;
    this.type = tt;
    this.row = row;
    this.column = col;
}

function Scanner(data) {
    
    this.originalString = data;
    this.tokens = []
    
    this.extractTokens = function() {
        
        var row = 0;
        var column = 0;
        
        var i = 0;
        while (i < this.originalString.length) {
            console.log(this.originalString.substr(i));
            if (this.originalString[i] == '\n') {
                i++;
                row++;
                column = 0;
                continue;
            }
      
            switch (this.originalString[i]) {
                case ' ':
                    console.log("whitespace");
                    column++;
                    i++;
                    break;
                case ')':
                    console.log(")");
                    this.tokens.push(new Token(')', TokenType.R_PAREN, row, column));
                    column++;
                    i++;
                    break;
                case '(':
                    console.log(")");
                    this.tokens.push(new Token('(', TokenType.L_PAREN, row, column));
                    column++;
                    i++;
                    break;
                case '+':
                    console.log("+");
                    this.tokens.push(new Token('+', TokenType.PLUS, row, column));
                    column++;
                    i++;
                    break;
                case '-':
                    console.log("-");
                    this.tokens.push(new Token('-', TokenType.MINUS, row, column));                    
                    column++;
                    i++;
                    break;
                case '*':
                    console.log("*");
                    this.tokens.push(new Token('*', TokenType.MULTIPLICATION, row, column));
                    column++;
                    i++;
                    break;
                case '/':
                    console.log("/");
                    this.tokens.push(new Token('/', TokenType.DIVISION, row, column));
                    column++;
                    i++;
                    break;
                case '%':
                    console.log("%");
                    this.tokens.push(new Token('%', TokenType.MODULUS, row, column));
                    column++;
                    i++;
                    break;
                case '{':
                    console.log("{");
                    this.tokens.push(new Token('{', TokenType.SCOPE_START, row, column));
                    column++;
                    i++;
                    break;
                case '}':
                    console.log("}");
                    this.tokens.push(new Token('}', TokenType.SCOPE_END, row, column));
                    column++;
                    i++;
                    break;
                case ';':
                    console.log(";");
                    this.tokens.push(new Token(';', TokenType.LINE_TERMINATOR, row, column));
                    column++;
                    i++;
                    break;
                default:
                    console.log("in default");
                    var a = this.getAtom(this.originalString, i);       
                    console.log("a is: " + a);
                    
                    if (a === "") {
                        console.log("something is fucked up.");
                        throw "Bad things have happened.";
                    }
                    else if (this.isAssignmentOperator(a)) {
                        this.tokens.push(new Token(a, TokenType.OP_ASSIGNMENT, row, column));
                    }
                    else if (this.isEquivalenceOperator(a)) {
                        this.tokens.push(new Token(a, TokenType.OP_EQUIVALENT, row, column));
                    }
                    else if (this.isReal(a)) {
                        this.tokens.push(new Token(a, TokenType.REAL, row, column));
                    }
                    else if (this.isInteger(a)) {
                        this.tokens.push(new Token(a, TokenType.INTEGER, row, column));
                    }
                    else if (this.isKeyword(a)) {
                        if (a === "if")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_IF, row, column));
                        else if (a === "else")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_ELSE, row, column));
                        else if (a === "then")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_THEN, row, column));
                        else if (a === "while")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_WHILE, row, column));
                        else if (a === "true")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_TRUE, row, column));
                        else if (a === "false")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_ELSE, row, column));
                        else if (a === "do")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_ELSE, row, column));
                        else if (a === "skip")
                            this.tokens.push(new Token(a, TokenType.KEYWORD_SKIP, row, column));
                        else 
                            throw "Uhh...";
                        
                    }
                    else if (this.isIdentifier(a)) {
                        this.tokens.push(new Token(a, TokenType.IDENTIFIER, row, column));
                    }
                    else if (this.isGreaterThanOperator(a)) {
                        this.tokens.push(new Token(a, TokenType.OP_GREATER_THAN, row, column));
                    }
                    else if (this.isLessThanOperator(a)) {
                        this.tokens.push(new Token(a, TokenType.OP_LESS_THAN, row, column));
                    }   
                    else if (this.isGreaterThanEqualToOperator(a)) {
                        this.tokens.push(new Token(a, TokenType.OP_GREATER_THAN_EQUAL_TO, row, column));
                    }
                    else if (this.isLessThanEqualToOperator(a)) {
                        this.tokens.push(new Token(a, TokenType.OP_LESS_THAN_EQUAL_TO, row, column));
                    }         
                    else {
                        throw "Unidentified token: " + column + "," + row;
                    }
                    column += a.length;
                    i += a.length;
                    console.log(i);       
            }
            
        }
        this.tokens.push(new Token("EOF", TokenType.EOF, 0, 0));
    }
    
    this.getAtom = function(syntax, pos) {
        
        var atomLength = 0;
        
        for (var i = pos; i < syntax.length; i++) {
            if (isAlphaNum(syntax[i]) || syntax[i] === '_' || syntax[i] === '>'
                                      || syntax[i] === '<' || syntax[i] === '.'
                                      || syntax[i] === ':' || syntax[i] === '=') {
                atomLength++;                
            }
            else {
                break;
            }
        }
        return syntax.substring(pos, pos + atomLength);
    }
    
    this.isInteger = function(syntax) {
        
        for (var i = 0; i < syntax.length; i++) {
            if (!isNum(syntax[i]))
                return false;
        }
        return true;
    }
    
    this.isReal = function(syntax) {
       
        for (var i = 0; i < syntax.length; i++) {
            if (syntax[i] === ".") {
               
                var lhs = syntax.substring(0, i);
                var rhs = syntax.substring(i + 1, syntax.length);
                if (this.isInteger(lhs) && this.isInteger(rhs)) {
                    return true;
                }
                else
                    return false;
            }
        }
        return false;
    }
    
    this.isKeyword = function(syntax) {
        
        switch (syntax) {
        case "if":
            return true;
        case "else":
            return true;
        case "then":
            return true;
        case "while":
            return true;
        case "true":
            return true;
        case "false":
            return true;
        case "do":
            return true;
        case "skip":
            return true;
        default:
            break;
            
        }
        return false;
    }
    
    this.isIdentifier = function(syntax) {
        
        if (isAlpha(syntax[0]) || syntax[0] === '_') {
            for (var i = 1; i < syntax.length; i++) {
                if (!isAlphaNum(syntax[i]) && syntax[i] !== '_') {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        return true;
    }
    
    this.isAssignmentOperator = function(syntax) {
        
        if (syntax[0] === ':' && syntax[1] === '=')
            return true;
        else
            return false;
    }
    
    this.isEquivalenceOperator = function(syntax) {
        if (syntax[0] === '=' && syntax[1] === '=')
            return true;
        else
            return false;
    }
    
    this.isGreaterThanOperator = function(syntax) {
        if (syntax[0] === '>')
            return true;
        else
            return false;
    }
    
    this.isLessThanOperator = function(syntax) {
        if (syntax[0] === '<')
            return true;
        else
            return false;
    }
    
    this.isGreaterThanEqualToOperator = function(syntax) {
        if (syntax[0] === '>' && syntax[1] === '=')
            return true;
        else
            return false;
    }
    
    this.isLessThanEqualToOperator = function(syntax) {
        if (syntax[0] === '<' && syntax[1] === '=')
            return true;
        else
            return false;
    }
}

