function Calc() {
  this.accumulator = bigInt.zero;
  this.base = 16;
  this.operand = bigInt.zero;
}

// Returns the calculator's operand.
Calc.prototype.getOperand = function() {
  return this.operand;
};

Calc.prototype.numberEntered = function(button) {
  // Multiply the operand by the base raised to the number of digits added.
  // That is, 00 should be handled differently than 0.
  this.operand = this.operand.times(Math.pow(this.base, button.length));
  this.operand = this.operand.plus(parseInt("0x" + button));
};

Calc.prototype.opEntered = function(op) {
  switch (op) {
    case "C":
      this.operand = bigInt.zero;
      break;

    default:
      break;
  }
};

Calc.prototype.setBase = function(base) {
  this.base = base;
};
