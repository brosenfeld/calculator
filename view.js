/* SET UP MOUSE HANDLERS */
var numBackgroundColor = "#FF8F00"; // Keep synced with CSS.
var numActiveColor = "#FFD299";

var opBackgroundColor = "black"; // Keep synced with CSS.
var opActiveColor = "gray";

function setBackgroundColor(button, color) {
  button.css("background-color", color);
}

function numMousedownHandler() {
  setBackgroundColor($( this ), numActiveColor);
}

function numMouseupHandler() {
  setBackgroundColor($( this ), numBackgroundColor);
}

function opMousedownHandler() {
  setBackgroundColor($( this ), opActiveColor);
}

function opMouseupHandler() {
  setBackgroundColor($( this ), opBackgroundColor());
}

function setupNumMouseEvents() {
  $( this ).mousedown(numMousedownHandler).mouseup(numMouseupHandler);
}

function setupOpMouseEvents() {
  $( this ).mousedown(opMousedownHandler).mouseup(opMouseupHandler);
}

$(" .num ").each(setupNumMouseEvents);
$(" .op  ").each(setupOpMouseEvents);


/* SET UP SIGN AND BIT LENGTH MODES */
$( ".sign" ).click(function() {
  $( ".sign" ).css("color", "white");
  $( this ).css("color", "#FF8F00");
  // var signed = ($(this).text() == "signed");
});

$( ".bit_length" ).click(function() {
  $( ".bit_length" ).css("color", "white");
  $( this ).css("color", "#FF8F00");
  // var mode = parseInt($(this).text());
});


/* SET UP BASES */
function disableNumber() {
    $( this ).css("color", numBackgroundColor);
    $( this ).off("mouseup").off("mousedown");
}

function enableNumber() {
    $( this ).css("color", "black");
    $( this ).each(setupNumMouseEvents);
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