const button = document.querySelector('#rebuild-eleventy')

button.addEventListener('click', function (e) {
  e.preventDefault
  require('eleventy/cmd.js')
}, false)