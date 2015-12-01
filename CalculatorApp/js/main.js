$(function() {
    FastClick.attach(document.body);
});

window.onload = function() {
  new View(new Calc());
};
