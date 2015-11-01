# Status

## Interface
* Appropriate numerical buttons are made available for the base.
* Changes between signed and unsigned are reflected in the available operations.
* Changes in bit length are shown in the binar representation.
* TODO: May want to highlight the active operation.

## Display
* Entering positive numbers properly shows decimal, binary, hex and limits the number to a max size.
* Negative numbers use the hex and binary representation for the positive number that corresponds to the magnitude. This is a function of how the BigInteger library returns hex strings and requires additional custom logic to fix.

## Calculator
* AC, C, DEL seem to be working properly.
* Control flow also seems to be working properly.
* For other operations, just using the BigInteger methods. Because this library doesn't account for signed/unsigned or bit length those features are not yet handled.