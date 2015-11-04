/**
 * Given a negative BigInteger, return the positive integer that has the
 * equivalent binary representation.
 * @param {number} A negative BigInteger
 * @param {length} An int representing the max bit length for a number.
 * @return {BigInteger} A BigInteger with an equivalent unsigned bit
 * representation.
 */
function getEquivalentPositive(number, length) {
  return bigInt(2).pow(length).plus(number);
}

/**
 * Given a positive BigInteger, return the negative integer that has the
 * equivalent binary representation.
 * @param {number} A positive BigInteger
 * @param {length} An int representing the max bit length for a number.
 * @return {BigInteger} A BigInteger with an equivalent signed bit
 * representation.
 */
function getEquivalentNegative(number, length) {
  return number.minus(bigInt(2).pow(length));
}