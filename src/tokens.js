
Tokens = {};

Tokens.Tokentype = {
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
    KEYWORD_CALL : 29,
    KEYWORD_FUNCTION : 30,
    KEYWORD_RETURN : 31,
    COMMA_SEPARATOR : 32,
    EOF : 33
};

Tokens.TokenString = {

    getTokenString: function(tokenID) {

        switch(tokenID) {

            case 0:
                return "Left parenthesis";
            case 1:
                return "Right parenthesis";
            case 2:
                return "Equals";
            case 3:
                return "Plus";
            case 4:
                return "Minus";
            case 5:
                return "Division";
            case 6:
                return "Multiplication";
            case 7:
                return "Modulus";
            case 8:
                return "Integer";
            case 9:
                return "Real";
            case 10:
                return "Identifier";
            case 11:
                return "If statement";
            case 12:
                return "Else statement";
            case 13:
                return "Then statement";
            case 14:
                return "While statement";
            case 15:
                return "True";
            case 16:
                return "False";
            case 17:
                return "Do statement";
            case 18:
                return "Skip";
            case 19:
                return "Assignment operator";
            case 20:
                return "Equivalent operator";
            case 21:
                return "Less then operator";
            case 22:
                return "Less than equal to operator";
            case 23:
                return "Greater than operator";
            case 24:
                return "Greater than equal to operator";
            case 25:
                return "Not operator"
            case 26:
                return "Scope start";
            case 27:
                return "Scope end";
            case 28:
                return "Line terminator";
            case 29:
                return "Function call keyword";
            case 30:
                return "Function keyword";
            case 31:
                return "return keyword"
            case 32:
                return "Comma separator";
            case 33:
                return "EOF";
        }
    }

};