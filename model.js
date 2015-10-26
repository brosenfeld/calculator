function Calc() {
  this.accumulator = 0;
  this.base = 16;
  this.operand = 0;
}

Calc.prototype.getOperand = function() {
  return this.operand;
};

Calc.prototype.numberEntered = function(button) {
  var num = parseInt("0x" + button);
  this.operand *= this.base;
  this.operand += num;
};

Calc.prototype.opEntered = function(op) {
  switch (op) {
    case "C":
      this.operand = 0;
      break;

    default:
      break;
  }
};

Calc.prototype.setBase = function(base) {
  this.base = base;
};
