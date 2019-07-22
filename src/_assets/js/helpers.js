/**
  * The main helpers object
  */
let helpers = {}

/*!
 * Create an immutable clone of an array or object
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Array|Object} obj The array or object to copy
 * @return {Array|Object}     The clone of the array or object
 */
helpers.copy = function (obj) {
  //
  // Methods
  //

  /**
   * Create an immutable copy of an object
   * @return {Object}
   */
  var cloneObj = function () {
    // Create new object
    var clone = {}

    // Loop through each item in the original
    // Recursively copy it's value and add to the clone
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = helpers.copy(obj[key])
      }
    }

    return clone
  }

  /**
   * Create an immutable copy of an array
   * @return {Array}
   */
  var cloneArr = function () {
    return obj.map(function (item) {
      return helpers.copy(item)
    })
  }

  //
  // Inits
  //

  // Get object type
  var type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()

  // If an object
  if (type === 'object') {
    return cloneObj()
  }

  // If an array
  if (type === 'array') {
    return cloneArr()
  }

  // Otherwise, return it as-is
  return obj
}

/**
  * Gets value of selected radio button
  *
  * @param {string} form - ID attribute of the form
  * @param {string} name - Name attribute of the field
  * @return {string} val - Value of the selected radio button
  */
helpers.getRadioValue = function (form, name) {
  let val
  let formEl = document.getElementById(form)
  // get list of radio buttons with specified name
  // var radios = formEl.elements[name];
  let radios = formEl.elements.namedItem(name)

  if (radios !== null) {
    // loop through list of radio buttons
    for (let i = 0, len = radios.length; i < len; i++) {
      if (radios[i].checked) { // radio checked?
        val = radios[i].value // if so, hold its value in val
        break // and break out of for loop
      }
    }
  }
  return val // return value of checked radio or undefined if none checked
}

/**
  * Loops through an array of objects and removes object keys, optionally keeping keys specified as headers, and returns the array of objects
  *
  * @param {array} items
  * @param {array} headers - optional
  * @return {array}
  */
helpers.removeKeys = function (items, headers = []) {
  for (let item of items) {
    const keys = Object.keys(item)

    for (const key of keys) {
      if (!headers.includes(key)) {
        delete item[key]
      }
    }
  }

  return items
}

/**
  * Export the helpers object
  */
module.exports = helpers
