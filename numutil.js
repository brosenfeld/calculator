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