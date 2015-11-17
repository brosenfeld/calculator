/**
 * A mapping of binary operations to functions that take an accumulator and
 * operand (each a BigInteger) and the bit length.
 */
var binaryOperations = {};

binaryOperations[OpEnum.PLUS] = function(accumulator, operand, length) {
  return accumulator.plus(operand);
};

binaryOperations[OpEnum.MINUS] = function(accumulator, operand, length) {
  return accumulator.minus(operand);
};

binaryOperations[OpEnum.TIMES] = function(accumulator, operand, length) {
  return accumulator.times(operand);
};
  
binaryOperations[OpEnum.DIVIDE] = function(accumulator, operand, length) {
  return accumulator.divide(operand);
};
  
binaryOperations[OpEnum.AND] = function(accumulator, operand, length) {
  return accumulator.and(operand);
};
  
binaryOperations[OpEnum.OR] = function(accumulator, operand, length) {
  return accumulator.or(operand);
};
  
binaryOperations[OpEnum.XOR] = function(accumulator, operand, length) {
  return accumulator.xor(operand);
};

binaryOperations[OpEnum.MOD] = function(accumulator, operand, length) {
  return accumulator.mod(operand);
};

binaryOperations[OpEnum.LEFT_SHIFT] = function(accumulator, operand, length) {
  checkShiftDistance(operand, length);
  return accumulator.shiftLeft(operand);
};

binaryOperations[OpEnum.RIGHT_SHIFT] = function(accumulator, operand, length) {
  checkShiftDistance(operand, length);
  return accumulator.shiftRight(operand);
};

binaryOperations[OpEnum.LOGICAL_RIGHT_SHIFT] = function(accumulator, operand,
    length) {
  checkShiftDistance(operand, length);
  
  // Use a bit mask to get rid of the leading ones.
  var mask = bigInt(2).pow(length - operand).minus(1);
  return accumulator.shiftRight(operand).and(mask);
};

binaryOperations[OpEnum.ROTATE_LEFT] = function(accumulator, operand, length) {
  var left = operand.mod(length).plus(length).mod(length).valueOf();
  var right = length - left;
  var highOrder = accumulator.shiftLeft(left);
  var lowOrder =
    binaryOperations[OpEnum.LOGICAL_RIGHT_SHIFT](accumulator, right, length);
  return highOrder.or(lowOrder);
};