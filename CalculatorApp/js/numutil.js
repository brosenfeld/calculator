/**
 * Given a negative BigInteger, return the positive integer that has the
 * equivalent binary representation.
 * @param {BigInteger} A negative BigInteger
 * @param {number} An int representing the max bit length for a number.
 * @return {BigInteger} A BigInteger with an equivalent unsigned bit
 * representation.
 */
function getEquivalentPositive(number, length) {
  // Check if already positive.
  if (number.compare(0) >= 0) return number;
  return bigInt(2).pow(length).plus(number);
}

/**
 * Given a positive BigInteger, return the negative integer that has the
 * equivalent binary representation.
 * @param {BigInteger} A positive BigInteger
 * @param {number} An int representing the max bit length for a number.
 * @return {BigInteger} A BigInteger with an equivalent signed bit
 * representation.
 */
function getEquivalentNegative(number, length) {
  // Check if already negative.
  if (number.compare(0) < 0) return number;
  return number.minus(bigInt(2).pow(length));
}

/**
 * Truncates a signed integer.
 * @param {BigInteger} A signed BigInteger.
 * @param {number} An int representing the old max bit length for a number.
 * @param {number} An int representing the new max bit length for a number.
 * @return {BigInteger}
 */
function truncateSigned(number, oldLength, newLength) {
  var unsignedBound = bigInt(2).pow(newLength).minus(1);
  var positive = getEquivalentPositive(number, oldLength);
  var truncated = positive.and(unsignedBound);
  return unsignedToSigned(truncated, newLength);
}

/**
 * Casts an unsigned integer to a signed integer.
 * @param {BigInteger} An unsigned BigInteger.
 * @param {number} An int representing the max bit length for a number.
 * @return {BigInteger}
 */
function unsignedToSigned(number, length) {
  var signedBound = bigInt(2).pow(length - 1).minus(1);
  return number.compare(signedBound) > 0 ?
    getEquivalentNegative(number, length) :
    number;
}

function checkShiftDistance(operand, bitLength) {
  if (operand.isNegative() || operand.compare(bitLength) > 0) {
    throw new RangeError("Shift out of range");
  }
}