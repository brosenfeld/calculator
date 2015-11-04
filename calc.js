/**
 * A calculator that supports different numerical bases and bit lengths. 
 */
function Calc() {
  this.baseRepresentBits = true;  // Does the current base represent the bits?
  this.base = 16;                 // The calculator's current base.
  this.bitLength = 64;            // The calculator's current bit length.
  this.isSigned = true;

  this.clearAccumulator = true;
  this.clearOperand = true;
  this.clearOperation = true;
  this.hasOperand = false;

  // The max (and min) value an operand or the accumulator can take.
  this.setBounds = function() {
    this.sUpperBound = bigInt(2).pow(this.bitLength - 1).minus(1);
    this.sLowerBound = bigInt(2).pow(this.bitLength - 1).times(-1);
    this.usUpperBound = bigInt(2).pow(this.bitLength).minus(1);
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

  this.setBounds();
  this.updateState();
}

/**
 * Called when the user presses a numerical button that corresponds to entering
 * bits (for example, when the user is entering binary bits).
 * @param {string} The button pressed. The button's value should correspond
 * to a bit string (ex. FF or 0).
 */
Calc.prototype.bitsEntered = function(button) {
  this.hasOperand = true;

  // Leading bit is already set, so can't add new bits.
  if (this.operand.compare(bigInt.zero) < 0) return;

  // Basic bounds checking on input value.
  var value = parseInt("0x" + button);
  if (value >= Math.pow(this.base, button.length)) return;

  // Multiply the operand by the base raised to the number of digits added.
  // That is, 00 should be handled differently than 0.
  var newOperand = this.operand.times(Math.pow(this.base, button.length));
  newOperand = newOperand.plus(value);

  // Only update the operand if the new operand would be in bounds.
  if (newOperand.compare(this.usUpperBound) <= 0) {
    // If we're in the signed mode and the operand is greater than the signed
    // upper bound, convert it to a negative number.
    if (this.isSigned && newOperand.compare(this.sUpperBound) > 0) {
      this.operand = getEquivalentNegative(newOperand, this.bitLength);
    } else {
      this.operand = newOperand;
    }
  }
};

/**
 * Called when the user presses a numerical button representing a digit.
 * @param {number} The number entered. Expected to be a single digit in the
 *     calculator's base.
 */
Calc.prototype.digitEntered = function(number) {
  // Basic check that the number falls between 0 and the base.
  if (number < 0 || number > this.base) return;

  this.hasOperand = true;

  var newOperand = this.operand.times(this.base);

  // If the operand is zero or positive, add the button's value.
  // Otherwise, subtract the button's value.
  newOperand = (this.operand.compare(bigInt.zero) >= 0) ?
    newOperand.plus(number) :
    newOperand.minus(number);

  // Check bounds.
  if (this.isSigned) {
    if ((newOperand.compare(this.sLowerBound) >= 0) &&
      (newOperand.compare(this.sUpperBound) <= 0)) this.operand = newOperand;
  } else if (newOperand.compare(this.usUpperBound) <= 0) {
    this.operand = newOperand;
  }
};

/**
 * Called when the user presses a numerical button and updates the operand.
 * @param {string} The button the user pressed. Should correspond to a number
 *    that can be parsed into an integer.
 */
Calc.prototype.numberEntered = function(button) {
  if (this.baseRepresentsBits) {
    this.bitsEntered(button);
  } else {
    this.digitEntered(parseInt(button));
  }
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
    // TODO: Fix for binary and hex.
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
  else if (op == OpEnum.PLUS_MINUS) {
    if (this.hasOperand) {
      this.operand = this.operand.negate();
    } else {
      this.accumulator = this.accumulator.negate();
    }
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
  this.setBounds();
};