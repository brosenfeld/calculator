# Status

## Interface
* Appropriate numerical buttons are made available for the base.
* Changes between signed and unsigned are reflected in the available operations.
* Changes in bit length are shown in the binary representation.
* TODO: May want to highlight the active operation.

## Display
* Entering positive numbers properly shows decimal, binary, and hex and limits the number to a max size.
* Entering negative numbers properly shows decimal, binary, and hex but does not do proper bounds checking.

## Calculator
* AC, C, DEL seem to be working properly.
* Control flow also seems to be working properly.
* For other operations, the calculator currently uses the BigInteger methods. Because this library doesn't account for signed/unsigned or bit length those features are not yet handled.