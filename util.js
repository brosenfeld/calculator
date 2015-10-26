/* MOUSE HANDLER UTILITIES */
var numBackgroundColor = "#FF8F00"; // Keep synced with CSS.
var numActiveColor = "#FFD299";
var numDisabledColor = "#E68100";

var opBackgroundColor = "black"; // Keep synced with CSS.
var opActiveColor = "gray";

function setBackgroundColor(button, color) {
  button.css("background-color", color);
}

/* SIGN AND BIT LENGTH UTILITIES */
var enabledBitsColor = "black";
var disabledBitsColor = "#C0C0C0";

var enabledOpColor = "white";
var disabledOpColor = "#333333";

function disableAllBits() {
  $( ".bin_row" ).css("color", disabledBitsColor);
}

function enableBits() {
  $( this ).css("color", enabledBitsColor);
}

/* BASE UTILITIES */
var decClass = ".dec";
var hexClass = ".hex";

// Map each hex digit to it's four digit binary representation.
var hexToBin = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  "A": "1010",
  "B": "1011",
  "C": "1100",
  "D": "1101",
  "E": "1110",
  "F": "1111",
};

// TODO: Should do bounds checking here.
function hexDigitToPaddedBin(digit) {
  return hexToBin[digit];
}