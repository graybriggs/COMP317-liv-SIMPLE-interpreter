
// Test code - not even close to final.

var data = [
"x ASSIGN <integer,5>",       // 1
"y ASSIGN x",                 // 2
"t0 = x ADD <integer, 1>",    // 3
"z ASSIGN t0",                // 4
"t1 = z ADD y",               // 5
"foo ASSIGN t1",              // 6
"fjump t1 Label_End_0:",      // 7
"t2 = foo ADD <integer, 1>",  // 8
"foo ASSIGN t2",              // 9
"z ASSIGN <integer, 7>",      // 10
"Label_End_0",                // 11
"t4 = a Bool_EQ b",           // 12
"fjump t4 Label_4",           // 13
"Label_4:",                    // 14
"foo ASSIGN <integer, 0>"
];

console.log(data);

// gen is an array of arrays. The inner array contains [nodeNumber, variableName]
// if the node does not generate then the element is given null
var gen = []; 

// kill is
var kill = [];

function scanIntermediateRepresentation() {
  for (var i = 0; i < data.length; i++) {
    determineOperation(data[i][1]);
    console.log(data[i]);
  }
}

function determineOperation(d) {

  var tokens = d.split(" ");

  if (d.search("ASSIGN") !== -1 || d.search("=") !== -1) {
    return [0, tokens[0]]; // 0 represents an assignment (can generate)
  }
  else if (d.search("ADD") !== -1 || d.search("SUB") !== -1 || d.search("MUL") !== -1 || d.search("DIV") !== -1
    || d.search("MOD") !== -1) {
    return [1, tokens[0]];
  }
  else if (d.search("Bool_LT") !== -1 || d.search("Bool_LTET") !== -1 || d.search("Bool_GT") !== -1
        || d.search("Bool_GTET") !== -1 || d.search("Bool_EQ")) {
    return [2, tokens[0]];
  }
  else if (d.search("fjump") !== -1) {
    return [3, tokens[0]];
  }

}

// gen can kill elements are a array type of length two
// element [0] holds the node number the elemet represents
// element [1] holds the variable name that the node assigns to


// find gen values

function genNodes() {

  for (var i = 0; i < data.length; i++) {
    var op = determineOperation(data[i]);
    // if the operation is an assignment and thus gens.
    if (op[0] === 0) {
      gen.push(op);
    }
    else {
      gen.push(null);
    }
  }
}

function showGenNodes() {
    for (var i = 0; i < gen.length; i++) {
      if (gen[i] === null)
        console.log(i + ": --");
      else
        console.log(i + ": " + gen[i][1]);
  }
}


function initKillNodes() {

  // find kill values
  // the kill data array holds for multiple possible kill variables at a given node

  // init kill array. This is the same lengh as the gen array
  for (var i = 0; i < gen.length; i++) {
    if (gen[i] === null)
      kill.push(null);
    else
      kill.push([]);
  }
}

function killNodes() {

  initKillNodes();

  for (var i = 0; i < gen.length; i++) {

    if (gen[i] !== null) {
      var name = gen[i][1];

      for (var j = 0; j < gen.length; j++) {

        if (gen[j] !== null) {
          if (i !== j) {
            var curName = gen[j][1]
            if (curName === name) {
              kill[i].push([j,gen[j][1]]);
            }
          }
        }
      }
    }
  }
}

function showKillNodes() {

  for (var i = 0; i < kill.length; i++) {
    if (kill[i] === null)
      console.log(i + ": -- ");
    else if (kill[i].length === 0)
      console.log(i + ": --");
    else {
      var str = i + ": ";
      for (var j = 0; j < kill[i].length; j++) {
        str = str + kill[i][j] + ", ";
      }
      console.log(str);
    }
  }
}



var numNodes = data.length;





function inMinusKill(inSet, killSet) {
  inSet.difference(killSet);
  return inSet;
}


////////////////////////////


console.log("-- Gen Nodes --");
genNodes();
showGenNodes();
console.log("-- Kill Nodes --");
killNodes();
showKillNodes();


////////////////////////////



/// Testing ///

/*

var s1 = new Utility.Set;
s1.addElement(1);
s1.addElement(2);
s1.addElement(3);
s1.addElement(4);
s1.addElement(7);
s1.addElement(69);
var s2 = new Utility.Set;
s2.addElement(3);
s2.addElement(2);
s2.addElement(5);
s2.addElement(1);

var s3 = inMinusKill(s1,s2);
console.log(s3);


*/