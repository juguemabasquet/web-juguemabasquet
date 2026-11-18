// Targeta "Col·laboradors" del bento d'inici: el número surt de les targetes de la
// secció (#colaboradors .colab-card), així s'actualitza sol quan n'entra un de nou.
document.addEventListener('DOMContentLoaded', function () {
  var num = document.querySelector('.bento-colabs-num');
  var total = document.querySelectorAll('#colaboradors .colab-card').length;
  if (num && total) num.textContent = total;
});
