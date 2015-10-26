function Calc() {
  this.accumulator = bigInt.zero;
  this.base = 16;
  this.operand = bigInt.zero;
}

Calc.prototype.getOperand = function() {
  return this.operand;
};

Calc.prototype.numberEntered = function(button) {
  var num = parseInt("0x" + button);
  this.operand = this.operand.times(this.base);
  this.operand = this.operand.plus(num);
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
