/**
 * The view for a calculator that supports different numerical bases
 * and bit lengths. This view exposes no fields or methods.
 * @param {Calc} A calculator model.
 */
function View(calc) {
  var BIT_DISPLAY_LENGTH = 64;
  var enableEqualsOnNumberEntered = false;
  var areOperandClearsEnabled = false;
  var lastOp = null;

  /**
   * Displays the binary representation of a number.
   * @param {string} A string representation of a hexidecimal number.
   */
  function displayBin(hexString) {
    var length = Math.min(hexString.length, calc.bitLength / 4);
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
   * Updates the display to reflect the state of the calculator.
   */
  function updateDisplay() {
    var value = calc.hasOperand ? calc.operand : calc.accumulator;
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
    $( this ).removeClass(numInactive);
    $( this ).addClass(numActive);  }

  /**
   * Handles the end of a click or touch on a number button. This is where we
   * pass the value to the model and update the display.
   */
  function numEndClickHandler() {
    $( this ).removeClass(numActive);
    $( this ).addClass(numInactive);
    calc.numberEntered($( this ).text());
    updateDisplay();
    if (calc.hasOperand) {
      // Check if delete and clear should be enabled.
      if (!areOperandClearsEnabled) {
        areOperandClearsEnabled = true;
        $( "#CLEAR" ).each(enableOp);
        $( "#DEL" ).each(enableOp);
      }
      // Check if equals should be enabled.
      if (enableEqualsOnNumberEntered) {
        $( "#EQUALS").each(enableOp);
        enableEqualsOnNumberEntered = false;
      }
    }
  }

  /**
   * Handles the start of a click or touch on an operation button.
   */
  function opStartClickHandler() {
    $( this ).removeClass(opInactive);
    $( this ).addClass(opActive);
  }

  /**
   * Handles the end of a click or touch on an operation button. This is where
   * we trigger the operation on the calculator and update the display.
   */
  function opEndClickHandler() {
    $( this ).removeClass(opActive);
    $( this ).addClass(opInactive);
    var op = $( this ).attr('id');
    var recognized = calc.opEntered(op);
    if (recognized && lastOp !== null) {
      lastOp.css("color", "white"); // Keep synced with CSS.
      lastOp = null;
    }

    // Depending on the operation either show the operand or accumulator and
    // potentially enable or disable the equals operaiton.
    switch (op) {
      case OpEnum.ALL_CLEAR:
        $( "#EQUALS").each(disableOp);
        break;
      case OpEnum.EQUALS:
        $( "#EQUALS").each(disableOp);
        break;
      default:
        if (op in binaryOperations) {
          lastOp = $( this );
          lastOp.css("color", lastOpColor);
          enableEqualsOnNumberEntered = true;
        } else if (op in unaryOperations) {
          // Check if the operation cleared the last binary operation.
          if (calc.operation === null) enableEqualsOnNumberEntered = false;
        }
    }

    // Check if delete and clear should be disabled.
    if (areOperandClearsEnabled && !calc.hasOperand) {
      areOperandClearsEnabled = false;
      $( "#CLEAR" ).each(disableOp);
      $( "#DEL" ).each(disableOp);
    }

    updateDisplay();
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
     $( this ).removeClass(opDisabled);
     $( this ).addClass(opEnabled);
     $( this ).each(setupOpEvents);
  }

  /**
   * Disables an operation button.
   */
  function disableOp() {
    $( this ).removeClass(opEnabled);
    $( this ).addClass(opDisabled);
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

    calc.setIsSigned(signed);
    updateDisplay();
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
    updateDisplay();
  });

  /* Set up the keypad buttons. */
  $(" .num_inactive ").each(setupNumEvents);
  $(" .op_inactive  ").each(setupOpEvents);

  /**
   * Disables a number button.
   */
  function disableNumber() {
    $( this ).removeClass(numEnabled);
    $( this ).addClass(numDisabled);
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
  }

  /**
   * Enables a number button.
   */
  function enableNumber() {
    $( this ).removeClass(numDisabled);
    $( this ).addClass(numEnabled);
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

  /**
   * Handle keyboard inputs by redirecting them to the mouse events.
   */
  $( document ).keydown(function(e) {
    if (e.shiftKey && e.which in shiftKeyboard) {
      this.shiftWasActive = true;
      shiftKeyboard[e.which].trigger("mousedown");
    } else if (e.which in keyboard) {
      keyboard[e.which].trigger("mousedown");
    }
  });

  $( document ).keyup(function(e) {
    if ((e.shiftKey || this.shiftWasActive) && e.which in shiftKeyboard) {
      shiftKeyboard[e.which].trigger("mouseup");
      this.shiftWasActive = false;
    } else if (e.which in keyboard) {
      keyboard[e.which].trigger("mouseup");
    }
  });

  /* SET INITIAL STATE: signed, hex, 64-bit */
  $( "#hex" ).click();
  $( "#signed" ).click();
  $( "#bit64" ).click();
  $( '#EQUALS').each(disableOp);
  updateDisplay();
}
