/* View */
function View(calc) {
  var model = calc;
  var view = this;
  
  function updateDisplay() {
    var operand = calc.getOperand();
    $( '#dec > .acc' ).text(operand.toString());
    $( '#hex > .acc' ).text(operand.toString(16).toUpperCase());
  }
  
  function numStartClickHandler() {
    setBackgroundColor($( this ), numActiveColor);
  }

  function numEndClickHandler() {
    setBackgroundColor($( this ), numBackgroundColor);
    calc.numberEntered($( this ).text());
    updateDisplay();
  }

  function opStartClickHandler() {
    setBackgroundColor($( this ), opActiveColor);
  }

  function opEndClickHandler() {
    setBackgroundColor($( this ), opBackgroundColor);
    calc.opEntered($( this ).text());
    updateDisplay();
  }

  function setupNumEvents() {
    // Clear the previous events (so they don't get duplicated).
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
    
    // Add the events.
    $( this ).mousedown(numStartClickHandler).mouseup(numEndClickHandler);
    $( this ).on("touchstart", numStartClickHandler);
    $( this ).on("touchend", numEndClickHandler);
  }

  function setupOpEvents() {
    // Clear the previous events (so they don't get duplicated).
    $( this ).off("mouseup").off("mousedown");
    $( this ).off("touchstart").off("touchend");
    
    // Add the events.
    $( this ).mousedown(opStartClickHandler).mouseup(opEndClickHandler);
    $( this ).on("touchstart", opStartClickHandler);
    $( this ).on("touchend", opEndClickHandler);
  }

  /* Handle mode changes for signed and unsigned. */
  $( ".sign" ).click(function() {
    $( ".sign" ).css("color", "white");
    $( this ).css("color", "#FF8F00");
    var signed = ($(this).text() == "signed");
    if (signed) {
      $( ".op_signed" ).css("color", enabledOpColor);
    } else {
      $( ".op_signed" ).css("color", disabledOpColor);
    }
  });

  /* Handle mode changes for bit length. */
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

  /* Set up the keypad buttons. */
  $(" .num ").each(setupNumEvents);
  $(" .op  ").each(setupOpEvents);

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

  /* Handle changes in the base. */
  $( ".base" ).click(function() {
    $( ".base" ).css("background-color", "white");
    $(this).css("background-color", "#FFD299");
    switch ($(this).attr('id')) {
      case "bin":
        disableAll(decClass);
        disableAll(hexClass);
        calc.setBase(2);
        break;
      case "dec":
        enableAll(decClass);
        disableAll(hexClass);
        calc.setBase(10);
        break;
      case "hex":
        enableAll(decClass);
        enableAll(hexClass);
        calc.setBase(16);
        break;
    }
  });

  /* SET INITIAL STATE: signed, hex, 64-bit */
  $( "#hex" ).click();
  $( "#signed" ).click();
  $( "#bit64" ).click();
  updateDisplay();
}

View.prototype.OnButtonClick = function(button) {
};
