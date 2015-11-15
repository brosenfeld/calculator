# Status

## Interface
* Appropriate numerical buttons are made available for the base.
* Changes between signed and unsigned are reflected in the available operations.
* Changes in bit length are shown in the binary representation.
* Can use keyboard for input.
* Show accumulator, operand, and the active operator.

## Display
* Entering positive or negative numbers properly shows decimal, binary, and hex and does bounds checking.

## Calculator
* Handles changes in bit length.
* AC, C, DEL seem to be working properly.
* Control flow also seems to be working properly.
* For other operations, the calculator currently uses the BigInteger methods. I added additional logic for handling signed/unsigned and different bit lengths, and it seems to be working properly.