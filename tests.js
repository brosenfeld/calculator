function setup(base, representsBits, length, isSigned) {
  var calc = new Calc();
  calc.setBase(base, representsBits);
  calc.setBitLength(length);
  calc.setIsSigned(isSigned);
  return calc;
}

function enterNumbers(calc, numbers) {
  for (var i = 0; i < numbers.length; i++) {
    calc.numberEntered(numbers[i]);
  }
}

QUnit.test("Initial conditions", function(assert) {
  var calc = new Calc();
  assert.ok(!calc.hasOperand, "Calc does not have operand");
  assert.equal(calc.operand, bigInt.zero, "Operand is zero");
  assert.equal(calc.accumulator, bigInt.zero, "Accumulator is zero");
});

QUnit.module("Entering numbers");
QUnit.test("Entering digits", function(assert) {
  var calc = setup(10, false, 64, true);
  enterNumbers(calc, ["1", "2", "3", "4"]);
  assert.equal(calc.operand.valueOf(), 1234, "Passed");

  calc = setup(10, false, 64, true);
  enterNumbers(calc, ["1", "0", "3", "4"]);
  assert.equal(calc.operand.valueOf(), 1034, "Passed");

  calc = setup(10, false, 64, true);
  enterNumbers(calc, ["0", "0", "3"]);
  assert.equal(calc.operand.valueOf(), 3, "Passed");
});

QUnit.test("Entering digits on negative number", function(assert) {
  var calc = setup(10, false, 64, true);
  calc.operand = bigInt(-1);
  enterNumbers(calc, ["0", "1"]);
  assert.equal(calc.operand.valueOf(), -101, "Passed");
});

QUnit.test("Entering digit out of range", function(assert) {
  var calc = setup(10, false, 64, true);
  enterNumbers(calc, ["1", "0", "11", "-1", "0"]);
  assert.equal(calc.operand.valueOf(), 100, "Passed");
});

QUnit.test("Entering bits", function(assert) {
  var calc = setup(16, true, 64, true);
  enterNumbers(calc, ["FF"]);
  assert.equal(calc.operand.valueOf(), 255, "Passed");

  calc = setup(16, true, 64, true);
  enterNumbers(calc, ["1", "00"]);
  assert.equal(calc.operand.valueOf(), 256, "Passed");

  calc = setup(2, true, 64, true);
  enterNumbers(calc, ["1", "0", "0", "1"]);
  assert.equal(calc.operand.valueOf(), 9, "Passed");
});

QUnit.test("Entering digit out of range", function(assert) {
  var calc = setup(2, true, 64, true);
  enterNumbers(calc, ["1", "F", "0"]);
  assert.equal(calc.operand.valueOf(), 2, "Passed");  
});

QUnit.test("Mixing digits and bits and changing base", function(assert) {
  var calc = setup(10, false, 64, true);
  enterNumbers(calc, ["1", "5"]);
  calc.setBase(16, true);
  enterNumbers(calc, ["2"]); // F2
  assert.equal(calc.operand.valueOf(), 242, "Passed"); 
});

QUnit.test("Hitting unsigned limit", function(assert) {
  var calc = setup(10, false, 8, false);
  enterNumbers(calc, ["2", "5", "6"]); // Shouldn't be able to put the 6 in.
  assert.equal(calc.operand.valueOf(), 25, "Passed"); 
});

QUnit.test("Above signed upper bound becomes negative", function(assert) {
  var calc = setup(16, true, 8, true);
  enterNumbers(calc, ["F", "F"]);
  assert.equal(calc.operand.valueOf(), -1, "Passed");
});

QUnit.test("Hitting signed limits", function(assert) {
  var calc = setup(10, false, 8, true);
  enterNumbers(calc, ["1", "2", "9"]); // Shouldn't be able to put the 0 in.
  assert.equal(calc.operand.valueOf(), 12, "Passed upper limit"); 

  calc = setup(10, false, 8, true);
  calc.operand = bigInt(-1);
  enterNumbers(calc, ["2", "9"]); // Shouldn't be able to put the 0 in.
  assert.equal(calc.operand.valueOf(), -12, "Passed lower limit"); 
});

QUnit.module("Entering operations");

QUnit.test("All Clear", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.operand = bigInt(10);
  calc.hasOperand = true;
  calc.accumulator = bigInt(5);
  calc.operation = OpEnum.PLUS;
  calc.opEntered(OpEnum.ALL_CLEAR);
  assert.ok(!calc.hasOperand, "Calc does not have operand");
  assert.equal(calc.operand, bigInt.zero, "Operand is zero");
  assert.equal(calc.accumulator, bigInt.zero, "Accumulator is zero");
  assert.deepEqual(calc.operation, null, "No operation.");
});

QUnit.test("Clear", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.operand = bigInt(10);
  calc.hasOperand = true;
  calc.accumulator = bigInt(5);
  calc.operation = OpEnum.PLUS;
  calc.opEntered(OpEnum.CLEAR);
  assert.ok(calc.hasOperand, "Calc has operand");
  assert.equal(calc.operand, bigInt.zero, "Operand is zero");
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
  assert.deepEqual(calc.operation, OpEnum.PLUS, "Operation unchanged.");
});

QUnit.test("Delete", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.operand = bigInt(10);
  calc.hasOperand = true;
  calc.accumulator = bigInt(5);
  calc.operation = OpEnum.PLUS;
  calc.opEntered(OpEnum.DEL);
  assert.ok(calc.hasOperand, "Calc has operand");
  assert.equal(calc.operand.valueOf(), 1, "Digit deleted");
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
  assert.equal(calc.operation, OpEnum.PLUS, "Operation unchanged.");
});

QUnit.test("Delete on negative bits", function(assert) {
  var calc = setup(16, true, 8, true);
  calc.operand = bigInt(-1);
  calc.opEntered(OpEnum.DEL);
  assert.equal(calc.operand.valueOf(), 15, "Now a positive number");
});

QUnit.test("Equals with no operation", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.accumulator = bigInt(5);
  calc.opEntered(OpEnum.EQUALS);
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
});

QUnit.test("Equals", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.operand = bigInt(10);
  calc.accumulator = bigInt(5);
  calc.operation = OpEnum.PLUS;
  calc.opEntered(OpEnum.EQUALS);
  assert.equal(calc.accumulator.valueOf(), 15, "Accumulator is updated");
  assert.ok(!calc.hasOperand, "Calc does not have operand");
  assert.equal(calc.operand, bigInt.zero, "Operand is zero");
  assert.deepEqual(calc.operation, null, "Operation is cleared");
});

// Test plus minus.
// Test plus minus doesn't do anything in unsigned mode.

QUnit.module("Binary operations");
QUnit.module("Unary operations");
QUnit.module("Changing modes");