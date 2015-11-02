/**
 * A calculator that supports different numerical bases and bit lengths. 
 */
function Calc() {
  this.base = 16;                 // The calculator's current base.
  this.bitLength = 64;            // The calculator's current bit length.

  this.clearAccumulator = true;
  this.clearOperand = true;
  this.clearOperation = true;
  this.hasOperand = false;

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
  this.hasOperand = true;
  
  // Multiply the operand by the base raised to the number of digits added.
  // That is, 00 should be handled differently than 0.
  var new_operand = this.operand.times(Math.pow(this.base, button.length));
  new_operand = new_operand.plus(parseInt("0x" + button));

  // Only update the operand if the new operand would be in bounds.
  if (new_operand.compare(this.bound) <= 0) this.operand = new_operand;
};

/**
 * Called when the user presses a button corresponding to an operation.
 * @param {OpEnum} The operation.
 *
 * TODO: Handle other operations.
 *
 * An operation requires some combination of the following: clearing the
 * accumulator, clearing the operand, doing an operation, and setting a
 * new operation.
 */
Calc.prototype.opEntered = function(op) {
  // Clear all of the calculator's state.
  if (op == OpEnum.ALL_CLEAR) {
    this.clearAccumulator = true;
    this.clearOperand = true;
    this.clearOperation = true;
  }
  // Clear the operand.
  else if (op == OpEnum.CLEAR) {
    this.clearOperand = true;
  }
  // Delete the last digit entered.
  else if (op == OpEnum.DEL) {
    // TODO: Should DEL only be active visually when there is an operand.
    this.operand = this.operand.divide(this.base);
  }
  // If there is a pending operation, execute the operation.
  else if (op == OpEnum.EQUALS && this.operation !== null) {
    if (this.operation in binaryOperations) {
      this.accumulator =
        binaryOperations[this.operation](this.accumulator, this.operand);
    }
    this.clearOperand = true;
    this.clearOperation = true;
    this.hasOperand = false;
  }
  // Handle binary operations.
  else if (op in binaryOperations) {
    // If the user has entered a number, proceed with processing the operation.
    // Otherwise, replace any pending operation with the new one.
    if (this.hasOperand) {
      // If there is no pending operation, then replace the accumulator with
      // the current operand. Otherwise, execute the old operation on the
      // accumulator and operand.
      this.accumulator = (this.operation === null) ?
        this.operand :
        binaryOperations[this.operation](this.accumulator, this.operand);
    }

    this.operation = op;
    this.clearOperand = true;
  }
  // Handle unary operations.
  else if (op in unaryOperations) {
    if (this.operation === null) {
      var argument = this.hasOperand ? this.operand : this.accumulator;
      this.accumulator = unaryOperations[op](argument);
      this.clearOperand = true;
      this.hasOperand = false;
    } else {
      this.operand = unaryOperations[op](this.operand);
    }
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