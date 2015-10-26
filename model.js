/**
 * A calculator that supports different numerical bases and bit lengths. 
 */
function Calc() {
  this.accumulator = bigInt.zero; // The current state of the calc.
  this.base = 16;                 // The calculator's current base.
  this.operand = bigInt.zero;     // The current operand being entered.
}

/**
 * Called when the user presses a numerical button and updates the operand.
 * @param {string} The text of the button. Should correspond to a number
 *     in the range 0-F or one of 00 or FF.
 *
 * TODO: Check that the operand has not exceeded the max allowed value.
 */
Calc.prototype.numberEntered = function(button) {
  // Multiply the operand by the base raised to the number of digits added.
  // That is, 00 should be handled differently than 0.
  this.operand = this.operand.times(Math.pow(this.base, button.length));
  this.operand = this.operand.plus(parseInt("0x" + button));
};

/**
 * Called when the user presses a button corresponding to an operation.
 * @param {string} The text of the button. Represents an operation.
 *
 * TODO: Handle other operations.
 */
Calc.prototype.opEntered = function(op) {
  switch (op) {
    case "C":
      this.operand = bigInt.zero;
      break;

    default:
      break;
  }
};
