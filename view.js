$( ".sign" ).click(function() {
  $( ".sign" ).css("color", "white");
  $(this).css("color", "#FF8F00");
  // var signed = ($(this).text() == "signed");
});

$( ".bit_length" ).click(function() {
  $( ".bit_length" ).css("color", "white");
  $(this).css("color", "#FF8F00");
  // var mode = parseInt($(this).text());
});

$( ".base" ).click(function() {
  $( ".base" ).css("background-color", "white");
  $(this).css("background-color", "#FFD299");
  /*
  switch ($(this).attr('id')) {
    case "bin":
      break;
    case "dec":
      break;
    case "hex":
      break;
  }*/
});