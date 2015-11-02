/**
 * A mapping of unary operations to functions that take a BigInteger value.
 */
var unaryOperations = {};

unaryOperations[OpEnum.PLUS_MINUS] = function(value) {
  return value.negate();
};

unaryOperations[OpEnum.NOT] = function(value) {
  return value.not();
};

unaryOperations[OpEnum.LEFT_SHIFT] = function(value) {
  return value.shiftLeft(1);
};

unaryOperations[OpEnum.RIGHT_SHIFT] = function(value) {
  return value.shiftRight(1);
};