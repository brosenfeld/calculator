$(function() {
    FastClick.attach(document.body);
});

window.onload = function() {
  new View(new Calc());
};

$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});