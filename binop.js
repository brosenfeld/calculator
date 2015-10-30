/**
 * A mapping of binary operations to functions that take an accumulator and
 * operand (each a BigInteger).
 */
var binaryOperations = {};

binaryOperations[OpEnum.PLUS] = function(accumulator, operand) {
  return accumulator.plus(operand);
};

binaryOperations[OpEnum.MINUS] = function(accumulator, operand) {
  return accumulator.minus(operand);
};

binaryOperations[OpEnum.TIMES] = function(accumulator, operand) {
  return accumulator.times(operand);
};
  
binaryOperations[OpEnum.DIVIDE] = function(accumulator, operand) {
  return accumulator.divide(operand);
};
  
binaryOperations[OpEnum.AND] = function(accumulator, operand) {
  return accumulator.and(operand);
};
  
binaryOperations[OpEnum.OR] = function(accumulator, operand) {
  return accumulator.or(operand);
};
  
binaryOperations[OpEnum.XOR] = function(accumulator, operand) {
  return accumulator.xor(operand);
};

binaryOperations[OpEnum.MOD] = function(accumulator, operand) {
  return accumulator.mod(operand);
};