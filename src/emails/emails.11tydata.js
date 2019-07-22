'use strict'

module.exports = function () {
  return {
    permalink: './email/{{ slug }}/index.html',
    contentType: 'email',
    layout: 'email'
  }
}
