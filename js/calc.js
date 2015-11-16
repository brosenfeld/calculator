/**
 * A calculator that supports different numerical bases and bit lengths. 
 */
function Calc() {
  this.baseRepresentsBits = true; // Does the current base represent the bits?
  this.base = 16;                 // The calculator's current base.
  this.bitLength = 64;            // The calculator's current bit length.
  this.isSigned = true;

  this.clearAccumulator = true;
  this.clearOperand = true;
  this.clearOperation = true;

  // The max (and min) value an operand or the accumulator can take.
  this.setBounds = function() {
    this.sUpperBound = bigInt(2).pow(this.bitLength - 1).minus(1);
    this.sLowerBound = bigInt(2).pow(this.bitLength - 1).times(-1);
    this.usUpperBound = bigInt(2).pow(this.bitLength).minus(1);
  };

  // Updates the state of the calculator.
  this.updateState = function() {
    if (this.clearOperand) {
      this.operand = bigInt.zero;
      this.clearOperand = false;
      this.hasOperand = false;
    }

    if (this.clearAccumulator) {
      this.accumulator = bigInt.zero;
      this.clearAccumulator = false;
    }

    if (this.clearOperation) {
      this.operation = null;
      this.clearOperation = false;
    }
  };

  // Keeps a number in the calculator's bounds.
  this.keepInBounds = function(number) {
    return this.isSigned ?
      truncateSigned(number, this.bitLength) :
      number.and(this.usUpperBound);
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
 * @return {boolean} True if the operation was processed.
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
    this.operand = bigInt.zero;
  }
  // Delete the last digit entered.
  else if (op == OpEnum.DEL) {
    // If the number represents bits, but the operand is negative,
    // convert to the positive number.
    this.operand = (this.baseRepresentsBits && this.operand.compare(0) < 0 ?
        getEquivalentPositive(this.operand, this.bitLength) :
        this.operand)
      .divide(this.base);
  }
  // If there is a pending operation, execute the operation.
  else if (op == OpEnum.EQUALS && this.operation !== null) {
    if (this.operation in binaryOperations) {
      var binop = binaryOperations[this.operation];
      this.accumulator =
        this.keepInBounds(binop(this.accumulator, this.operand, this.bitLength));
    }
    this.clearOperand = true;
    this.clearOperation = true;
  }
  else if (op == OpEnum.PLUS_MINUS && this.isSigned) {
    if (this.hasOperand) {
      this.operand = this.operand.negate();
    } else {
      this.accumulator = this.accumulator.negate();
    }
  }
  // Handle binary operations.
  else if (op in binaryOperations) {
    var binop = binaryOperations[this.operation];

    // If the user has entered a number, proceed with processing the operation.
    // Otherwise, replace any pending operation with the new one.
    if (this.hasOperand) {
      // If there is no pending operation, then replace the accumulator with
      // the current operand. Otherwise, execute the old operation on the
      // accumulator and operand.
      this.accumulator = (this.operation === null) ?
        this.operand :
        this.keepInBounds(binop(this.accumulator, this.operand, this.bitLength));
    }

    this.operation = op;
    this.operand = bigInt.zero;
  }
  // Handle unary operations.
  else if (op in unaryOperations) {
    if (this.operation === null) {
      var argument = this.hasOperand ? this.operand : this.accumulator;
      this.accumulator = this.keepInBounds(unaryOperations[op](argument));
      this.clearOperand = true;
    } else if (this.hasOperand) {
        this.operand = this.keepInBounds(unaryOperations[op](this.operand));
    } else {
      // Replace the binary operation.
      this.accumulator =
        this.keepInBounds(unaryOperations[op](this.accumulator));
      this.clearOperation = true;
    }
  }

  this.updateState();
};

/**
 * Updates the calculator's base. To insure proper behavior, this method should
 * be used rather than directly setting the base.
 * @param {number} The new base. Should be an integer.
 * @param {boolean} Does the new base correspond to a bit representation?
 *     For hex, this would be true. For decimal this would be false.
 */
Calc.prototype.setBase = function(base, representsBits) {
  this.base = base;
  this.baseRepresentsBits = representsBits;
};

/**
 * Update the max bit length. To insure proper behavior, this method should
 * be used rather than directly setting the bit length.
 * @param {number} The new bit length. Should be an integer.
 */
Calc.prototype.setBitLength = function(bitLength) {
  var oldBitLength = this.bitLength;
  this.bitLength = bitLength;
  this.setBounds();

  if (this.isSigned) {
    // Will implicitly sign extend.
    if (this.bitLength < oldBitLength) {
      this.accumulator = truncateSigned(this.accumulator, this.bitLength);
      this.operand = truncateSigned(this.operand, this.bitLength);
    }
  } else {
    // Check accumulator and operand and cut them down to the right bit length.
    this.accumulator = this.accumulator.and(this.usUpperBound);
    this.operand = this.operand.and(this.usUpperBound);
  }
};

/**
 * Update the mode for signed or unsigned. To insure proper behavior, this
 * method should be used rather than directly setting isSigned.
 * @param {boolean} Should the calculator be signed?
 */
Calc.prototype.setIsSigned = function(isSigned) {
  if (this.isSigned == isSigned) return;

  if (isSigned) {
    this.accumulator = unsignedToSigned(this.accumulator, this.bitLength);
    this.operand = unsignedToSigned(this.operand, this.bitLength);
  }
  else {
    this.accumulator = getEquivalentPositive(this.accumulator, this.bitLength);
    this.operand = getEquivalentPositive(this.operand, this.bitLength);
  }
  this.isSigned = isSigned;
};