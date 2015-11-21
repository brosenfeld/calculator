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

QUnit.test("Plus Minus on operand", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.hasOperand = true;
  calc.operand = bigInt(10);
  calc.accumulator = bigInt(5);
  calc.opEntered(OpEnum.PLUS_MINUS);
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
  assert.equal(calc.operand.valueOf(), -10, "Operand is negated");
  calc.opEntered(OpEnum.PLUS_MINUS);
  assert.equal(calc.operand.valueOf(), 10, "Operand was negated again.");
});

QUnit.test("Plus Minus on accumulator", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.hasOperand = false;
  calc.operand = 0;
  calc.accumulator = bigInt(5);
  calc.opEntered(OpEnum.PLUS_MINUS);
  assert.equal(calc.accumulator.valueOf(), -5, "Accumulator is negated");
  calc.opEntered(OpEnum.PLUS_MINUS);
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator was negated again.");
});

QUnit.test("Plus Minus on unsigned", function(assert) {
  var calc = setup(10, false, 8, false);
  calc.hasOperand = true;
  calc.operand = bigInt(10);
  calc.accumulator = bigInt(5);
  calc.opEntered(OpEnum.PLUS_MINUS);
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
  assert.equal(calc.operand.valueOf(), 10, "Operand is unchanged");
});

QUnit.test("Plus Minus with operator but no operand", function(assert) {
  var calc = setup(10, false, 8, true);
  calc.hasOperand = false;
  calc.accumulator = bigInt(5);
  calc.operation = OpEnum.PLUS;
  calc.opEntered(OpEnum.PLUS_MINUS);
  assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
  assert.ok(calc.hasOperand, "Has an operand");
  assert.ok(calc.operand.isZero() && calc.operand.sign,"Operand is minus zero");
});



QUnit.module("Number Utilities");
QUnit.test("Get equivalent positive already positive", function(assert) {
  assert.equal(getEquivalentPositive(bigInt(5), 8).valueOf(), 5, "Passed");
});

QUnit.test("Get equivalent positive for negative", function(assert) {
  assert.equal(getEquivalentPositive(bigInt(-1), 8).valueOf(), 255, "Passed");
  assert.equal(getEquivalentPositive(bigInt(-128), 8).valueOf(), 128, "Passed");
});

QUnit.test("Get equivalent negative already negative", function(assert) {
  assert.equal(getEquivalentNegative(bigInt(-5), 8).valueOf(), -5, "Passed");
});

QUnit.test("Get equivalent negative for positive", function(assert) {
  assert.equal(getEquivalentNegative(bigInt(255), 8).valueOf(), -1, "Passed");
  assert.equal(getEquivalentNegative(bigInt(128), 8).valueOf(), -128, "Passed");
});

QUnit.test("Unsigned to signed", function(assert) {
    assert.equal(unsignedToSigned(bigInt(5), 8).valueOf(), 5,
      "Small positive number unchanged");
    assert.equal(unsignedToSigned(bigInt(255), 8).valueOf(), -1,
      "255 becomes -1");
});

QUnit.test("Truncate signed", function(assert) {
    assert.equal(truncateSigned(bigInt(5), 16, 8).valueOf(), 5,
      "Small positive number unchanged");
    assert.equal(truncateSigned(bigInt(-1), 16, 8).valueOf(), -1,
      "Small negative number unchanged");
    assert.equal(truncateSigned(bigInt(255), 16, 8).valueOf(), -1,
      "0xFF becomes -1 in 8");
    assert.equal(truncateSigned(bigInt(256), 16, 8).valueOf(), 0,
      "0x100 becomes 0 in 8");
    assert.equal(truncateSigned(bigInt("FF01", 16), 16, 8).valueOf(), 1,
      "0xFF01 becomes 1 in 8");
    assert.equal(truncateSigned(bigInt("FF01", 16), 16, 8).valueOf(), 1,
      "0xFF01 becomes 1 in 8");
});



QUnit.module("Unary operations");
QUnit.test("Not on operand without operator replaces accumulator",
  function(assert) {
    var calc = setup(16, true, 8, true);
    calc.hasOperand = true;
    calc.operand = bigInt(0);
    calc.accumulator = bigInt(5);
    calc.opEntered(OpEnum.NOT);
    assert.equal(calc.accumulator.valueOf(), -1, "Accumulator is replaced");
    assert.ok(!calc.hasOperand, "No longer has operand");
    assert.equal(calc.operand, bigInt.zero, "Operand cleared");
  });

QUnit.test("Not on operand with operator updates operand",
  function(assert) {
    var calc = setup(16, true, 8, true);
    calc.hasOperand = true;
    calc.operand = bigInt(0);
    calc.accumulator = bigInt(5);
    calc.operation = OpEnum.PLUS;
    calc.opEntered(OpEnum.NOT);
    assert.equal(calc.accumulator.valueOf(), 5, "Accumulator is unchanged");
    assert.ok(calc.hasOperand, "Still has operand");
    assert.equal(calc.operand.valueOf(), -1, "Operand updated");
    assert.equal(calc.operation, OpEnum.PLUS, "Operator unchanged");
  });

QUnit.test("Not with operator but no operand updates accumulator",
function(assert) {
  var calc = setup(16, true, 8, true);
  calc.hasOperand = false;
  calc.operand = bigInt.zero;
  calc.accumulator = bigInt(1);
  calc.opEntered(OpEnum.NOT);
  assert.equal(calc.accumulator.valueOf(), -2, "Accumulator correct");
  assert.equal(calc.operand.valueOf(), 0, "Operand unchanged");
  calc.opEntered(OpEnum.NOT);
  assert.equal(calc.accumulator.valueOf(), 1, "Accumulator correct.");
});

QUnit.test("Not on accumulator updates accumulator", function(assert) {
  var calc = setup(16, true, 8, false);
  calc.hasOperand = false;
  calc.accumulator = bigInt(255);
  calc.opEntered(OpEnum.NOT);
  assert.equal(calc.accumulator.valueOf(), 0, "Accumulator correct");
  calc.opEntered(OpEnum.NOT);
  assert.equal(calc.accumulator.valueOf(), 255, "Accumulator correct.");
});

QUnit.module("Binary operations");
QUnit.test("Binop with operand and no previous operator", function(assert) {
  var calc = setup(16, true, 8, false);
  calc.hasOperand = true;
  calc.operand = bigInt(10);
  calc.accumulator = bigInt(5);
  calc.opEntered(OpEnum.PLUS);
  assert.equal(calc.accumulator.valueOf(), 10, "Accumulator is replaced");
  assert.ok(!calc.hasOperand, "Operand cleared");
  assert.equal(calc.operation, OpEnum.PLUS, "Operator updated");
});

QUnit.test("Binop with operand and previous operator", function(assert) {
  var calc = setup(16, true, 8, false);
  calc.hasOperand = true;
  calc.operand = bigInt(5);
  calc.accumulator = bigInt(15);
  calc.operation = OpEnum.MINUS;
  calc.opEntered(OpEnum.PLUS);
  assert.equal(calc.accumulator.valueOf(), 10, "Previous operation done");
  assert.ok(!calc.hasOperand, "Operand cleared");
  assert.equal(calc.operation, OpEnum.PLUS, "Operator updated");
});

QUnit.test("Binop without operand replaces previous operation",
  function(assert) {
    var calc = setup(16, true, 8, false);
    calc.hasOperand = false;
    calc.accumulator = bigInt(15);
    calc.operation = OpEnum.MINUS;
    calc.opEntered(OpEnum.PLUS);
    assert.equal(calc.accumulator.valueOf(), 15, "Accumulator unchanged");
    assert.ok(!calc.hasOperand, "Operand cleared");
    assert.equal(calc.operation, OpEnum.PLUS, "Operator updated");
  });

QUnit.test("Binop kept in bounds", function(assert) {
  var calc = setup(16, true, 8, false);
  calc.hasOperand = true;
  calc.accumulator = bigInt(255);
  calc.operand = bigInt(255);
  calc.operation = OpEnum.PLUS;
  calc.evalBinop();
  assert.equal(calc.accumulator.valueOf(), 254, "Accumulator kept in bounds");
});

// Only need to test logical right shift and rotate left. Other binary
// operations are directly from BigInteger.
QUnit.test("Logical right shift", function(assert) {
  var lrs = binaryOperations[OpEnum.LOGICAL_RIGHT_SHIFT];
  assert.equal(lrs(bigInt(7), bigInt(1), 8).valueOf(), 3,
    "Shift without leading one");
  assert.equal(lrs(bigInt(-1), bigInt(4), 8).valueOf(), 15,
    "Shift with leading ones");
  assert.throws(function() {lrs(bigInt(-1), bigInt(-1), 8);},
    RangeError,
    "Negative length throws range error");
  assert.throws(function() {lrs(bigInt(-1), bigInt(9), 8);},
    RangeError,
    "Length greater than number of bits throws range error");
});

QUnit.test("Rotate left", function(assert) {
  var rol = binaryOperations[OpEnum.ROTATE_LEFT];
  assert.equal(rol(bigInt("F0", 16), bigInt(4), 8).valueOf(), 15);
  assert.ok(rol(bigInt("AA", 16), bigInt(1), 8).equals(bigInt("55", 16)));
  assert.ok(rol(bigInt("0F", 16), bigInt(-3), 8).equals(bigInt("E1", 16)));
  assert.ok(rol(bigInt("0F", 16), bigInt(-11), 8).equals(bigInt("E1", 16)));
});

// TODO: Test error handling.

QUnit.module("Changing modes");