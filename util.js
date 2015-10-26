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