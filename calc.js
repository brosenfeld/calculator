/**
 * A calculator that supports different numerical bases and bit lengths. 
 */
function Calc() {
  this.base = 16;                 // The calculator's current base.
  this.bitLength = 64;            // The calculator's current bit length.

  this.clearAccumulator = true;
  this.clearOperand = true;
  this.clearOperation = true;

  // The max value an operand or the accumulator can take.
  this.setBound = function() {
    this.bound = bigInt(2).pow(this.bitLength).minus(1);
  };

  // Updates the state of the calculator.
  this.updateState = function() {
    if (this.clearAccumulator) {
      this.accumulator = bigInt.zero;
      this.clearAccumulator = false;
    }

    if (this.clearOperand) {
      this.operand = bigInt.zero;
      this.clearOperand = false;
    }

    if (this.clearOperation) {
      this.operation = null;
      this.clearOperation = false;
    }
  };

  this.setBound();
  this.updateState();
}

/**
 * Called when the user presses a numerical button and updates the operand.
 * @param {string} The text of the button. Should correspond to a number
 *     in the range 0-F or one of 00 or FF.
 */
Calc.prototype.numberEntered = function(button) {
  // Multiply the operand by the base raised to the number of digits added.
  // That is, 00 should be handled differently than 0.
  var new_operand = this.operand.times(Math.pow(this.base, button.length));
  new_operand = new_operand.plus(parseInt("0x" + button));

  // Only update the operand if the new operand would be in bounds.
  if (new_operand.compare(this.bound) <= 0) this.operand = new_operand;
};

/**
 * Called when the user presses a button corresponding to an operation.
 * @param {string} The text of the button. Represents an operation.
 *
 * TODO: Handle other operations.
 *
 * An operator requires some combination of the following: clearing the
 * accumulator, clearing the operand, doing an operation, and setting a
 * new operation.
 */
Calc.prototype.opEntered = function(op) {
  // Clear all of the calculator's state.
  if (op == "AC") {
    this.clearAccumulator = true;
    this.clearOperand = true;
    this.clearOperator = true;
  }
  // Clear the operand.
  else if (op == "C") {
    this.clearOperand = true;
  }
  // Delete the last digit entered.
  else if (op == "DEL") {
    // TODO: Should DEL only be active visually when there is an operand.
    this.operand = this.operand.divide(this.base);
  }
  // If there is a pending operator, execute the operation.
  else if (op == "=" && this.operator !== null) {
    if (this.operator in binaryOperators) {
      this.accumulator =
        binaryOperators[this.operator](this.accumulator, this.operand);
    }
    this.clearOperand = true;
    this.clearOperator = true;
  }
  // Handle binary operations.
  else if (op in binaryOperators) {
    // If there is no pending operator, then replace the accumulator with
    // the current operand. Otherwise, execute the old operation on the
    // accumulator and operand.
    this.accumulator = (this.operator === null) ?
      this.operand :
      binaryOperators[op](this.accumulator, this.operand);

    this.operator = op;
    this.clearOperand = true;
  }

  this.updateState();
  /*
  // Check unsigned overflow. Reduce modulo bound + 1.
  if (this.accumulator.compare(this.bound) > 0) {
    this.accumulator = this.accumulator.mod(this.bound.plus(1));
  } */
};

/**
 * Update the max bit length. To insure proper behavior, this method should
 * be used rather than directly setting the bit length.
 * @param {number} The new bit length. Should be an integer.
 *
 * TODO: Cast the accumulator and operand.
 */
Calc.prototype.setBitLength = function(bitLength) {
  this.bitLength = bitLength;
  this.setBound();
};