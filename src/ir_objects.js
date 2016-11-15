
// Graham Briggs
// November 2016

// Objects for intermediate representation.
// Each IR triple instruction has an object wrapping it.
// The objects each have their own unique id.
// This is used for flow graph formation in static analysis
// and reaching definitions. As well as variable in/out values,
// the operations are also requred to be known in order to produce
// compiler optimisations.

var IR = {};

IR.Assignment = function(nodeNum, lhs, rhs) {
  
  this.nodeNum = nodeNum;
  this.lhs = lhs;
  this.rhs = rhs;

  this.getNodeNumber = function() {
    return this.nodeNum;
  }

  this.getIR = function() {
    return this.lhs + " ASSIGN " + this.rhs;
  }
}

IR.Expression = function(nodeNum, exp) {
  this.nodeNum = nodeNum;
  this.expression = exp;

  this.getNodeNumber = function() {
    return this.nodeNum;
  }

  this.getIR = function() {
    return this.expression;
  }
}

IR.BinaryExpression = function(nodeNum, lhs, rhs, op) {

  this.nodeNum = nodeNum;
  this.lhs = lhs;
  this.rhs = rhs;
  this.op = op;

  this.getNodeNumber = function() {
    return this.nodeNum;
  }

  this.getIR = function() {
    return null; // update
  }
}

IR.BooleanObject = function() {

}

IR.Jump = function(nodeNum, jmp) {

  this.nodeNum = nodeNum;
  this.jump = jmp;

  this.getNodeNumber = function() {
    return this.nodeNum;
  }

  this.getIR = function() {
    return this.jump;
  }
}

IR.Label = function(nodeNum, lbl) {

  this.nodeNum = nodeNum;
  this.label = lbl;

  this.getNodeNumber = function() {
    return this.nodeNum;
  }

  this.getIR = function() {
    return this.label;
  }
}
