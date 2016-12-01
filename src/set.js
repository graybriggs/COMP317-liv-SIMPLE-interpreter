'use strict';

Utility.Set = function() {

  this.set = [];
};

Utility.Set.prototype = {

  constructor: Utility.Set,

  // A set does does not have duplicates by nature.
  // Elements must be added to the set using this addElement function.
  // If elements are added to 'this.set' array directly then integrity of
  // set will be compromised and behaviour is not guaranteed.
  addElement: function(element) {

    for (var i = 0; i < this.set.length; i++) {
      if (this.set[i] === element) {
        return;
      }
    }
    this.set.push(element);
  },

  addArray: function(arr) {
    
    if (Array.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        this.addElement(arr[i]);
      }
    }
    else {
      console.log("Array not found");
    }
  },

  getElement: function(index) {
    return this.set[index];
  },

  getSet: function() {
    return this.set;
  },

  removeElement: function(element) {

    for (var i = this.size() - 1; i > 0; i--) {
      if (this.set[i] === element) {
        this.set.splice(i,1);
      }
    }
  },

  size: function() {
    return this.set.length;
  },

  union: function(otherSet) {

    var newSet = new Utility.Set;

    for (var i = 0; i < this.set.length; i++) {
      newSet.addElement(otherSet.getElement(i));
    }
    return newSet;
  },

  intersection: function(other) {

    var newSet = new Utility.Set;

    for (var i = 0; i < this.set.length; i++) {
      for (var j = 0; j < other.set.length; j++) {
        if (this.getElement(i) === other.getElement(j)) {
          newSet.addElement(this.getElement(i));
        }
      }
    }
    return newSet;
  },


  difference: function(other) {

    console.log(this.set + ", " + other.set);

    for (var i = 0; i < this.size(); i++) {
      for (var j = 0; j < other.size(); j++) {
        if (this.getElement(i) === other.getElement(j)) {
          this.set[i] = null;
        }
      }
    }

    var newSet = new Utility.Set;
    for (var i = 0; i < this.size(); i++) {
      if (this.set[i] !== null) {
        newSet.addElement(this.set[i]);
      }
    }
    this.set = newSet;
  }
}
