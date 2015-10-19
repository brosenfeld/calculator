/* SET UP MOUSE HANDLERS */
var numBackgroundColor = "#FF8F00"; // Keep synced with CSS.
var numActiveColor = "#FFD299";
var numDisabledColor = "#E68100";

var opBackgroundColor = "black"; // Keep synced with CSS.
var opActiveColor = "gray";

function setBackgroundColor(button, color) {
  button.css("background-color", color);
}

function numStartClickHandler() {
  setBackgroundColor($( this ), numActiveColor);
}

function numEndClickHandler() {
  setBackgroundColor($( this ), numBackgroundColor);
}

function opStartClickHandler() {
  setBackgroundColor($( this ), opActiveColor);
}

function opEndClickHandler() {
  setBackgroundColor($( this ), opBackgroundColor);
}

function setupNumEvents() {
  $( this ).mousedown(numStartClickHandler).mouseup(numEndClickHandler);
  $( this ).on("touchstart", numStartClickHandler);
  $( this ).on("touchend", numEndClickHandler);
}

function setupOpEvents() {
  $( this ).mousedown(opStartClickHandler).mouseup(opEndClickHandler);
  $( this ).on("touchstart", opStartClickHandler);
  $( this ).on("touchend", opEndClickHandler);
}

$(" .num ").each(setupNumEvents);
$(" .op  ").each(setupOpEvents);


/* SET UP SIGN AND BIT LENGTH MODES */
var enabledBitsColor = "black";
var disabledBitsColor = "#C0C0C0";

$( ".sign" ).click(function() {
  $( ".sign" ).css("color", "white");
  $( this ).css("color", "#FF8F00");
  // var signed = ($(this).text() == "signed");
});

function disableAllBits() {
  $( ".bin_row" ).css("color", disabledBitsColor);
}

function enableBits() {
  $( this ).css("color", enabledBitsColor);
}

$( ".bit_length" ).click(function() {
  $( ".bit_length" ).css("color", "white");
  $( this ).css("color", "#FF8F00");
  var mode = parseInt($(this).text());
  switch (mode) {
    case 8:
      disableAllBits();
      $( "#bin_label16 ").each(enableBits);
      $( "#bits0-7 ").each(enableBits);
      break;
    case 16:
      disableAllBits();
      $( "#bin16 ").each(enableBits);
      break;
    case 32:
      disableAllBits();
      $( "#bin16 ").each(enableBits);
      $( "#bin32 ").each(enableBits);
      break;
    default:
      $( ".bin_row" ).each(enableBits);
      break;
  }
});


/* SET UP BASES */
function disableNumber() {
    $( this ).css("color", numDisabledColor);
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
}

function enableNumber() {
    $( this ).css("color", "black");
    $( this ).each(setupNumEvents);
}

function disableAll(base) {
  $(base).each(disableNumber);
}

function enableAll(base) {
  $(base).each(enableNumber);
}

var decClass = ".dec";
var hexClass = ".hex";

$( ".base" ).click(function() {
  $( ".base" ).css("background-color", "white");
  $(this).css("background-color", "#FFD299");
  switch ($(this).attr('id')) {
    case "bin":
      disableAll(decClass);
      disableAll(hexClass);
      break;
    case "dec":
      enableAll(decClass);
      disableAll(hexClass);
      break;
    case "hex":
      enableAll(decClass);
      enableAll(hexClass);
      break;
  }
});

/* SET INITIAL STATE: signed, hex, 64-bit */
$( "#hex" ).click();
$( "#signed" ).click();
$( "#bit64" ).click();