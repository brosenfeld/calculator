var lastOpColor = "#FF8F00";

// Num classes -- Keep synced with css.
var numActive = "num_active";
var numInactive = "num_inactive";
var numEnabled = "num_enabled";
var numDisabled = "num_disabled";

// Op Classes -- Keep synced with css.
var opActive = "op_active";
var opInactive = "op_inactive";
var opEnabled = "op_enabled";
var opDisabled = "op_disabled";

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

/* KEYBOARD AND BUTTON UTILITIES */
var keyboard = {
  // Numbers.
  48 : $( "#zero" ),
  49 : $( "#one" ),
  50 : $( "#two" ),
  51 : $( "#three" ),
  52 : $( "#four" ),
  53 : $( "#five" ),
  54 : $( "#six" ),
  55 : $( "#seven" ),
  56 : $( "#eight" ),
  57 : $( "#nine" ),
  
  // Letters.
  65 : $( "#a" ),
  66 : $( "#b" ),
  67 : $( "#c" ),
  68 : $( "#d" ),
  69 : $( "#e" ),
  70 : $( "#f" ),
  
  // Keypad.
  96 : $( "#zero" ),
  97 : $( "#one" ),
  98 : $( "#two" ),
  99 : $( "#three" ),
  100 : $( "#four" ),
  101 : $( "#five" ),
  102 : $( "#six" ),
  103 : $( "#seven" ),
  104 : $( "#eight" ),
  105 : $( "#nine" ),

  // Operations.
  8 : $( "#DEL" ),
  13 : $( "#EQUALS" ),       // Enter
  27 : $( "#ALL_CLEAR" ),    // ESC
  88: $( "#TIMES" ),         // x
  106: $( "#TIMES" ),        // keypad multiply
  107: $( "#PLUS" ),         // keypad add
  109: $( "#MINUS" ),        // keypad subtraction
  111: $( "#DIVIDE" ),       // keypad divide
  187: $( "#EQUALS" ),
  188: $( "#LEFT_SHIFT" ),
  189: $( "#MINUS" ),
  190: $( "#RIGHT_SHIFT" ),
  191: $( "#DIVIDE" ),       // /
  220: $( "#OR" ),           // |

};

var shiftKeyboard = {
  48 : $( "#double_zero" ),  // 0
  49 : $( "#NOT" ),          // !
  53 : $( "#MOD" ),          // %
  54 : $( "#XOR" ),          // ^
  55 : $( "#AND" ),          // &
  56 : $( "#TIMES" ),        // *
  65 : $( "#ALL_CLEAR" ),    // a
  67 : $( "#CLEAR" ),        // c
  70 : $( "#double_f" ),     // f
  96 : $( "#double_zero" ),  // 0 keypad
  187: $( "#PLUS" ),
  190: $( "#LOGICAL_RIGHT_SHIFT" ),
  192: $( "#PLUS_MINUS" ),   // ~
};