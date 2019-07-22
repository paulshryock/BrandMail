'use strict'

/**
  * The main browser object
  *
  */
let browser = {}

/**
  * Initializes the main browser object
  *
  */
browser.init = function () {
  browser.swapHTMLClasses()
  browser.addSmoothScrolling()
}

/**
  * Swaps html element classes: `.no-js` to `.js`
  *
  */
browser.swapHTMLClasses = function () {
  const el = document.querySelector('html')
  if (el.classList.contains('no-js')) el.classList.replace('no-js', 'js')
}

/**
  * Adds smooth scrolling to ID links
  *
  */
browser.addSmoothScrolling = function () {
  const anchors = document.querySelectorAll('a[href^="#"]')

  for (const anchor of anchors) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const target = this.getAttribute('href')
      const el = document.querySelector(target)

      el.scrollIntoView({ behavior: 'smooth' })
    })
  }
}

/**
  * Initialize the main browser object
  *
  */
browser.init()
