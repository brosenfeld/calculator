/**
 * The view for a calculator that supports different numerical bases
 * and bit lengths. This view exposes no fields or methods.
 * @param {Calc} A calculator model.
 */
function View(calc) {
  var BIT_DISPLAY_LENGTH = 64;

  /**
   * Displays the binary representation of a number.
   * @param {string} A string representation of a hexidecimal number.
   *
   * TODO: Check that the length of the given string is less than the
   * bitLength / 4.
   */
  function displayBin(hexString) {
    var length = hexString.length;
    // Start from the least significant digit of the hex string and set the
    // bits.
    for (i = 0; i < length; i++) {
      var hexDigit = hexString.charAt(length - 1 - i);
      $( "#hex" + i ).text(hexDigitToPaddedBin(hexDigit));
    }

    // Set the remaining bits to 0.
    for (i = length; i < (BIT_DISPLAY_LENGTH / 4); i++) {
      $( "#hex" + i ).text(hexDigitToPaddedBin("0"));
    }
  }

  /**
   * Given a negaive BigInteger returns the appropriate hex representation.
   * @param {number} A negative BigInteger
   * @param {length} An int representing the max bit length for a number.
   * @return {String} A hex string representing the number.
   */
  function getHexNegative(number, length) {
    return getEquivalentPositive(number, length).toString(16).toUpperCase();
  }

  /**
   * Updates the display to reflect the given value.
   * @param {BigInteger} The value to show in the display.
   */
  function updateDisplay(value) {
    $( "#dec > .acc" ).text(value.toString(10));
    var hexString = (value < 0) ?
      getHexNegative(value, calc.bitLength) :
      value.toString(16).toUpperCase();
    $( "#hex > .acc" ).text(hexString);
    displayBin(hexString);
  }

  /**
   * Handles the start of a click or touch on a number button.
   */
  function numStartClickHandler() {
    setBackgroundColor($( this ), numActiveColor);
  }

  /**
   * Handles the end of a click or touch on a number button. This is where we
   * pass the value to the model and update the display.
   */
  function numEndClickHandler() {
    setBackgroundColor($( this ), numBackgroundColor);
    calc.numberEntered($( this ).text());
    updateDisplay(calc.operand);
  }

  /**
   * Handles the start of a click or touch on an operation button.
   */
  function opStartClickHandler() {
    setBackgroundColor($( this ), opActiveColor);
  }

  /**
   * Handles the end of a click or touch on an operation button. This is where
   * we trigger the operation on the calculator and update the display.
   */
  function opEndClickHandler() {
    setBackgroundColor($( this ), opBackgroundColor);
    var op = $( this ).attr('id');
    calc.opEntered(op);

    // Depending on the operation either show the operand or accumulator.
    if (op == OpEnum.ALL_CLEAR || op == OpEnum.CLEAR || op == OpEnum.DEL) {
      updateDisplay(calc.operand);
    } else if (op in binaryOperations || op == OpEnum.EQUALS) {
      updateDisplay(calc.accumulator);
    } else if (op in unaryOperations) {
      if (calc.hasOperand) updateDisplay(calc.operand);
      else updateDisplay(calc.accumulator);
    }
  }

  /**
   * Sets up the events for a number button.
   */
  function setupNumEvents() {
    // Clear the previous events (so they don't get duplicated).
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
    
    // Add the events.
    $( this ).mousedown(numStartClickHandler).mouseup(numEndClickHandler);
    $( this ).on("touchstart", numStartClickHandler);
    $( this ).on("touchend", numEndClickHandler);
  }

  /**
   * Sets up the events for an operation button.
   */
  function setupOpEvents() {
    // Clear the previous events (so they don't get duplicated).
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
    
    // Add the events.
    $( this ).mousedown(opStartClickHandler).mouseup(opEndClickHandler);
    $( this ).on("touchstart", opStartClickHandler);
    $( this ).on("touchend", opEndClickHandler);
  }

  /**
   * Enable an operation button.
   */
  function enableOp() {
     $( this ).css("color", enabledOpColor);
     $( this ).each(setupOpEvents);
  }

  /**
   * Disables an operation button.
   */
  function disableOp() {
    $( this ).css("color", disabledOpColor);
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
  }

  /**
   * Handle mode changes for signed and unsigned.
   */
  $( ".sign" ).click(function() {
    // Highlight the new mode.
    $( ".sign" ).css("color", "white");
    $( this ).css("color", "#FF8F00");
    
    // Enable or disable the appropriate operations.
    var signed = ($(this).text() == "signed");
    if (signed) {
      $( ".op_signed" ).each(enableOp);
    } else {
      $( ".op_signed" ).each(disableOp);
    }

    // TODO: Switch this to using a setter.
    calc.isSigned = signed;
  });

  /**
   * Handle mode changes for bit length.
   */
  $( ".bit_length" ).click(function() {
    // Highlight the new mode.
    $( ".bit_length" ).css("color", "white");
    $( this ).css("color", "#FF8F00");

    // Update which bits are displayed.
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

    calc.setBitLength(mode);
    
    // TODO: Should show what is already being shown.
    updateDisplay(calc.operand);
  });

  /* Set up the keypad buttons. */
  $(" .num ").each(setupNumEvents);
  $(" .op  ").each(setupOpEvents);

  /**
   * Disables a number button.
   */
  function disableNumber() {
    $( this ).css("color", numDisabledColor);
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
  }

  /**
   * Enables a number button.
   */
  function enableNumber() {
      $( this ).css("color", "black");
      $( this ).each(setupNumEvents);
  }

  /**
   * Disables all number button for a certain base.
   * @param {string} The html class for the base.
   */
  function disableAll(base) {
    $(base).each(disableNumber);
  }

  /**
   * Enables all number button for a certain base.
   * @param {string} The html class for the base.
   */
  function enableAll(base) {
    $(base).each(enableNumber);
  }

  /**
   * Handle changes in the base.
   */
  $( ".base" ).click(function() {
    // Highlight the active mode.
    $( ".base" ).css("background-color", "white");
    $(this).css("background-color", "#FFD299");

    // Enable and disable the appropriate numerical buttons and update the
    // calculator's base.
    switch ($(this).attr('id')) {
      case "bin":
        disableAll(decClass);
        disableAll(hexClass);
        calc.setBase(2, true);
        break;
      case "dec":
        enableAll(decClass);
        disableAll(hexClass);
        calc.setBase(10, false);
        break;
      case "hex":
        enableAll(decClass);
        enableAll(hexClass);
        calc.setBase(16, true);
        break;
    }
  });

  /* SET INITIAL STATE: signed, hex, 64-bit */
  $( "#hex" ).click();
  $( "#signed" ).click();
  $( "#bit64" ).click();
  updateDisplay(calc.accumulator);
}
