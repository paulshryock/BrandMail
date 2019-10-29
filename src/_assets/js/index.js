const config = require('./config')
const helpers = require('./helpers')
const Papa = require('papaparse')
const { ipcRenderer } = require('electron')

/**
  * The main index object
  */
let index = {}

/**
  * Initializes the index
  */
index.init = function () {
  index.addEventListeners()
  index.setDisabled()
}

/**
  * Verifies the SendGrid API Key
  */
index.verifyApiKey = function () {
  if (config.sendGrid.apiKey === null || undefined === config.sendGrid.apiKey || config.sendGrid.apiKey === '') {
    window.alert('Error: Missing SendGrid API Key. BrandMail will now close.')
    ipcRenderer.send('close-app', true)
  }
}

/**
  * Configures test mode
  */
index.setTesting = function () {
  const testing = helpers.getRadioValue('emailForm', 'testing')
  const bool = (testing === 'true')

  config.setTesting(bool)
}

/**
  * Configures the sender
  */
index.setSender = function () {
  const first = document.getElementById('firstName').value
  const last = document.getElementById('lastName').value
  const team = document.getElementById('teamName').value
  const email = document.getElementById('email').value

  if (team) {
    config.sender.name.setTeam(team)
  } else {
    config.sender.name.setFirst(first)
    config.sender.name.setLast(last)
  }

  config.sender.setEmail(email)
}

/**
  * Configures the recipients
  */
index.setRecipients = function () {
  const recipients = document.getElementById('recipients')
  const file = recipients.files[0]
  const message = document.getElementById('message').value
  const headers = config.headers[message]

  Papa.parse(file, {
    header: true,
    complete: function (results) {
      const recipients = helpers.removeKeys(results.data, headers)

      // Update filteredRecipients' empty EmailAddresses to their User_Principal_Names
      for (const recipient of recipients) {
        if (recipient.EmailAddress === '') {
          recipient.EmailAddress = recipient.User_Principal_Name
        }
      }

      console.log(`Total recipients: ${recipients.length}`)

      const uniqueRecipients = [...new Set(recipients)]

      console.log(`Total unique recipients: ${uniqueRecipients.length}`)

      const filteredRecipients = uniqueRecipients.filter((recipient) => {
        if (
          recipient.EmailAddress.substring(0, 1) === '!' ||
          recipient.EmailAddress.substring(0, 1) === '~' ||
          recipient.EmailAddress.substring(0, 1) === '.' ||
          recipient.EmailAddress.substring(0, 1) === '_' ||
          recipient.EmailAddress === 'not applicable' ||
          recipient.EmailAddress === '' ||
          recipient.EmailAddress === null ||
          recipient.EmailAddress === undefined
        ) {
          return false
        }

        return true
      })

      console.log(`Total filtered recipients: ${filteredRecipients.length}`)

      const count = filteredRecipients.length

      config.setRecipientsCount(count)
      config.setRecipients(filteredRecipients)
    }
  })
}

/**
  * Configures the subject
  */
index.setSubject = function () {
  const line = document.getElementById('subject').value

  config.setSubject(line)
}

/**
  * Configures the message
  */
index.setMessage = function () {
  const message = document.getElementById('message').value

  if (message) {
    const text = message + '.txt'
    const html = message + '.html'

    config.message.setText(text)
    config.message.setHtml(html)
  }
}

/**
  * Confirms that emails should be sent
  */
index.setConfirm = function () {
  const sender = {
    email: config.sender.email
  }

  const count = config.recipientsCount
  const testOrLive = (config.testing === true) ? 'test' : 'live'
  const pluralizeEmail = count === 1 ? 'email' : 'emails'
  const toOrFrom = (config.testing === true) ? 'to' : 'from'

  if (config.sender.name.team) {
    sender.name = config.sender.name.team
  } else {
    sender.name = `${config.sender.name.first} ${config.sender.name.last}`
  }

  if (sender.name) {
    sender.from = `${sender.name} <${sender.email}>`
  } else {
    sender.from = sender.email
  }

  const bool = window.confirm(`Are you sure you want to send ${count} ${testOrLive} ${pluralizeEmail} ${toOrFrom} ${sender.from}?`)

  config.setConfirm(bool)
}

/**
  * Sends emails
  */
index.sendEmails = function () {
  require('./mailer.js')
}

/**
  * Sets the disabled attribute
  */
index.setDisabled = function () {
  const emailForm = document.getElementById('emailForm')
  const inputs = emailForm.getElementsByTagName('input')
  const selects = emailForm.getElementsByTagName('select')
  const textareas = emailForm.getElementsByTagName('textarea')
  const optionalFields = [
    document.getElementById('firstName'),
    document.getElementById('lastName'),
    document.getElementById('teamName')
  ]
  const button = document.getElementById('sendEmails')
  let fields = []
  let disabled = false

  // Build fields array from all form elements
  Array.prototype.push.apply(fields, inputs)
  Array.prototype.push.apply(fields, selects)
  Array.prototype.push.apply(fields, textareas)

  const requiredFields = fields.filter((field) => {
    return !optionalFields.includes(field)
  })

  for (const field of requiredFields) {
    const value = field.value
    const empty = (value === undefined || value === '')

    if (empty === true) {
      disabled = true
      break
    }
  }

  if (disabled) {
    button.setAttribute('disabled', 'disabled')
  } else {
    button.removeAttribute('disabled')
  }
}

/**
  * Submits the form
  *
  * param {event} e
  */
index.submitForm = function (e) {
  e.preventDefault()

  index.verifyApiKey()
  index.setTesting()
  index.setSender()
  index.setRecipients()
  index.setSubject()
  index.setMessage()

  setTimeout(function () {
    index.setConfirm()
    if (config.confirm === true) index.sendEmails()
  }, 500
  )
}

/**
  * Adds event listeners
  */
index.addEventListeners = function () {
  const emailForm = document.getElementById('emailForm')
  const inputs = emailForm.getElementsByTagName('input')

  for (const input of inputs) {
    input.addEventListener('input', index.setDisabled, false)
  }

  emailForm.addEventListener('submit', index.submitForm, false)
}

/**
  * Adds a UI status
  *
  * param {string} status
  */
index.addUiStatus = function (status, element = 'p', attribute, value) {
  const text = document.createTextNode(status)
  const el = document.createElement(element)
  const form = document.getElementById('emailFormSetup')

  if (attribute && value) {
    el.setAttribute(attribute, value)
  }

  el.appendChild(text)
  form.appendChild(el)
}

/**
  * Initialize the index
  */
index.init()

module.exports = index
