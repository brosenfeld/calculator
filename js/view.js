/**
 * The view for a calculator that supports different numerical bases
 * and bit lengths. This view exposes no fields or methods.
 * @param {Calc} A calculator model.
 */
function View(calc) {
  var BIT_DISPLAY_LENGTH = 64;

  var activeBase = "#hex";
  var activeSignMode = "#signed";
  var areOperandClearsEnabled = false;
  var enableEqualsOnNumberEntered = false;
  var inErrorMode = false;
  var lastOp = null;

  /**
   * Displays the binary representation of a number.
   * @param {String} A string representation of a hexidecimal number.
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
   * @param {number} An int representing the max bit length for a number.
   * @return {String} A hex string representing the number.
   */
  function getHexNegative(number, length) {
    return getEquivalentPositive(number, length).toString(16).toUpperCase();
  }

  /**
   * Display a new number.
   * @param {BigInteger} A value to display
   * @param {String} The class of the fields to display the number in.
   * @param {boolean} Whether or not to update the bit display.
   */
  function displayNumber(value, type, shouldDisplayBin) {
    // Handle -0 specially.
    var decString = (value.isZero() && value.sign) ? "-0" : value.toString(10);
    $( "#dec > .values > ." + type).text(decString);
    var hexString = (value < 0) ?
      getHexNegative(value, calc.bitLength) :
      value.toString(16).toUpperCase();
    $( "#hex > .values > ." + type).text(hexString);
    if (shouldDisplayBin) displayBin(hexString);
  }

  /**
   * @param {String} The class of the fields to clear the number from.
   */
  function clearFields(type) {
    $( "#dec > .values > ." + type).text("");
    $( "#hex > .values > ." + type).text("");
  }

  /**
   * @param {String} The error message to display.
   */
  function displayError(error) {
    // Display the error message in the error fields.
    $( "." + errorClass ).text(error);

    // Clear all other fields.
    clearFields(accumulatorClass);
    clearFields(operandClass);
    clearFields(operatorClass);

    // Make text big for accumulator
    $( "." + operandClass ).removeClass("only");
    $( "." + accumulatorClass ).addClass("only");

    // Show zeros for binary
    displayBin("0");

    // Disable all keys
    $( "." + numEnabled).each(disableNumber);
    $( "." + opEnabled).each(disableOp);

    lastOp = null;
    $( "#ALL_CLEAR").each(enableOp);
    inErrorMode = true;
  }

  /**
   * Take the view out of error mode.
   */
  function exitErrorMode() {
    inErrorMode = false;
    $( "." + numDisabled ).each(enableNumber); // Re-enable the number buttons.
    $( "." + opDisabled ).each(enableOp);      // Re-enable the operations.
    $( activeBase ).click();                   // Reset the correct base.
    $( activeSignMode ).click();               // Reset the correct sign mode.
    disableDelAndClear();
  }

  /**
   * Updates the display to reflect the state of the calculator.
   */
  function updateDisplay() {
    clearFields(errorClass);

    // First priority is to display error.
    if (calc.error !== null) {
      displayError(calc.error);
    }
    // Operation in progress: display accumulator, display operand, and show
    // operand bits.
    else if (calc.operation !== null && calc.hasOperand) {
      displayNumber(calc.accumulator, accumulatorClass, false);
      displayNumber(calc.operand, operandClass, true);
      $( "." + operatorClass ).text(lastOp.text());
      $( "." + operandClass ).removeClass("only");
      $( "." + accumulatorClass ).removeClass("only");
    }

    // No operand: clear operand, display accumulator, show accumulator bits.
    else if (!calc.hasOperand) {
      clearFields(operandClass);
      clearFields(operatorClass);
      displayNumber(calc.accumulator, accumulatorClass, true);
      $( "." + accumulatorClass ).addClass("only");
    }

    // Operand replacing accumulator: clear accumulator, display opearnd,
    // show operand bits.
    else {
      clearFields(accumulatorClass);
      clearFields(operatorClass);
      displayNumber(calc.operand, operandClass, true);
      $( "." + operandClass ).addClass("only");
    }
  }

  /**
   * Clear the last operation if it existed.
   */
  function clearLastOp() {
    if (lastOp !== null) {
      lastOp.css("color", "white"); // Keep synced with CSS.
      lastOp = null;
    }
  }

  /**
   * Handles the start of a click or touch on a number button.
   */
  function numStartClickHandler(event) {
    event.preventDefault();
    $( this ).removeClass(numInactive);
    $( this ).addClass(numActive);  }

  /**
   * Handles the end of a click or touch on a number button. This is where we
   * pass the value to the model and update the display.
   */
  function numEndClickHandler(event) {
    event.preventDefault();
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
  function opStartClickHandler(event) {
    event.preventDefault();
    $( this ).removeClass(opInactive);
    $( this ).addClass(opActive);
  }

  /**
   * Handles the end of a click or touch on an operation button. This is where
   * we trigger the operation on the calculator and update the display.
   */
  function opEndClickHandler(event) {
    event.preventDefault();
    $( this ).removeClass(opActive);
    $( this ).addClass(opInactive);
    var op = $( this ).attr('id');
    var wasSuccess = calc.opEntered(op);

    // Depending on the operation potentially enable or disable the equals
    // operaiton and update the last operation.
    if (wasSuccess) {
      if (op == OpEnum.ALL_CLEAR) {
        if (inErrorMode) exitErrorMode();
        enableEqualsOnNumberEntered = false;
        $( "#EQUALS").each(disableOp);
        clearLastOp();
      } else if (op == OpEnum.EQUALS) {
        $( "#EQUALS").each(disableOp);
        clearLastOp();
      } else if (op in binaryOperations) {
        clearLastOp();
        lastOp = $( this );
        lastOp.css("color", lastOpColor);
        enableEqualsOnNumberEntered = true;
      } else if (op in unaryOperations) {
        // If there was no operand, the operation was on the accumulator, so
        // clear any active binary operation.
        if (!calc.hasOperand) clearLastOp();
      }
    }

    // Check if delete and clear should be disabled.
    if (areOperandClearsEnabled && !calc.hasOperand) {
      disableDelAndClear();
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
     $( this ).css("color", "");       // Remove added colors.
     $( this ).removeClass(opDisabled);
     $( this ).addClass(opEnabled);
     $( this ).each(setupOpEvents);
  }

  /**
   * Disables an operation button.
   */
  function disableOp() {
    $( this ).css("color", "");        // Remove added colors.
    $( this ).removeClass(opEnabled);
    $( this ).addClass(opDisabled);
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
  }

  /**
   * Disables the delete and clear buttons.
   */
  function disableDelAndClear() {
    areOperandClearsEnabled = false;
    $( "#CLEAR" ).each(disableOp);
    $( "#DEL" ).each(disableOp);
  }

  /**
   * Handle mode changes for signed and unsigned.
   */
  $( ".sign" ).click(function() {
    if (inErrorMode) return;
    activeSignMode = "#" + $(this).attr("id");

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
    if (inErrorMode) return;

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
    if (inErrorMode) return;

    // Highlight the active mode.
    $( ".base" ).css("background-color", "white");
    $(this).css("background-color", "#FFD299");
    
    activeBase = "#" + $(this).attr("id");

    // Enable and disable the appropriate numerical buttons and update the
    // calculator's base.
    switch ($(this).attr("id")) {
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
