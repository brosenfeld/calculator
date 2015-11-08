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