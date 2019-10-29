const index = require('./index')
const config = require('./config')
const helpers = require('./helpers')
const fs = require('fs')
const sgMail = require('@sendgrid/mail')
const { remote, ipcRenderer } = require('electron')
const path = require('path')
const appPath = remote.app.getAppPath()

// Set SendGrid API key
sgMail.setApiKey(config.sendGrid.apiKey)

// Define email parameters
const sender = {
  email: config.sender.email
}
const recipients = config.recipients
const limit = config.sendGrid.limit
const segments = recipients.map((recipient, index) => {
  return (index % limit === 0) ? recipients.slice(index, index + limit) : null
}).filter(recipient => recipient)
const interval = config.sendGrid.interval.seconds * 1000
const subject = (config.testing === true) ? `[test] ${config.subject}` : config.subject
const message = {
  text: fs.readFileSync(path.resolve(appPath, 'build', 'app') + '/' + config.message.text, 'utf-8'),
  html: fs.readFileSync(path.resolve(appPath, 'build', 'app') + '/' + config.message.html, 'utf-8')
}

let sent = []
let errors = []

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

/**
  * Sends the emails
  *
  * param {object} sender
  * param {object} recipients
  * param {string} subject
  * param {object} message
  */
const sendEmails = function (sender, recipients, subject, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const person of recipients) {
        /**
          * Define the dynamic values for this person
          */
        const to = {
          name: person.User_Principal_Name,
          email: person.EmailAddress,
          domain: person.Domain_File
        }

        const types = [ 'text', 'html' ]

        /*
        Below, the variables `params` and `body` use template string
        expressions inside strings.

        This is unusual but intentional, because we're looking for actual
        strings in the HTML markup, in order to later replace them with
        variables from template string expressions during the `splice`.

        The comment `eslint-disable-line` prevents our JavaScript linter
        from throwing an error.
        */

        const params = [
          [ '${to.email}', to.email ], // eslint-disable-line
          [ '${to.domain}', to.domain ] // eslint-disable-line
        ]

        let files = []

        for (const type of types) {
          let body = message[type].split('${to.name}') // eslint-disable-line
          body.splice(1, 0, to.name)
          body = body.join('')

          for (const param of params) {
            body = body.split(param[0]) // to array
            body.splice(1, 0, param[1]) // add name
            body = body.join('') // to string
          }
          files.push(body)
        }

        /**
          * Setup the email message for this person
          */
        const msg = {
          from: sender.from,
          subject: subject,
          text: files[0],
          html: files[1]
        }

        msg.to = (config.testing === true) ? sender.from : `${to.name} <${to.email}>`

        /**
          * Send the email message to this person
          */
        sgMail
          .send(msg)
          .then(() => {
            console.log(`Sending to ${msg.to}`)
          })
          .catch(error => {
            errors.push(error.toString())
            reject(error.toString())
          })

        sent.push(msg.to)
      }

      resolve(true)
    }, interval)
  })
}

/**
  * Segments and initiates sending the emails
  */
async function segmentEmails () {
  for (var i = 0; i < segments.length; i++) {
    const today = new Date()
    const time = today.getHours() + ':' +
                  today.getMinutes() + ':' +
                  today.getSeconds()

    const status = `Sending segment ${i + 1} of ${segments.length} at ${time}`

    await console.log(status)
    await index.addUiStatus(status)
    await sendEmails(sender, segments[i], subject, message)
  }
  
  if (errors.length > 0) window.alert(errors)
}

/**
  * Adds sent markup
  */
async function addSentMarkup () {
  const formSetup = document.getElementById('emailFormSetup')
  const h2 = document.createElement('h2')
  const p = document.createElement('p')
  let refreshButton = document.createElement('button')
  let closeButton = document.createElement('button')
  const h3 = document.createElement('h3')
  const ul = document.createElement('ul')
  const h2Text = document.createTextNode('Success!')
  const pText = document.createTextNode('The emails have sent, and you can close BrandMail.')
  const refreshButtonText = document.createTextNode('Start Over')
  const closeButtonText = document.createTextNode('Close')
  const h3Text = document.createTextNode('Emails sent to:')

  const people = helpers.copy(sent)

  for (const person of people) {
    const li = document.createElement('li')
    const liText = document.createTextNode(person)

    li.appendChild(liText)
    ul.appendChild(li)
  }

  h2.appendChild(h2Text)
  p.appendChild(pText)
  refreshButton.appendChild(refreshButtonText)
  closeButton.appendChild(closeButtonText)
  h3.appendChild(h3Text)

  refreshButton.classList.add('button')
  refreshButton.setAttribute('id', 'refreshButton')
  closeButton.classList.add('button')
  closeButton.setAttribute('id', 'closeButton')

  formSetup.innerHTML = ''
  formSetup.appendChild(h2)
  formSetup.appendChild(p)
  formSetup.appendChild(refreshButton)
  formSetup.appendChild(closeButton)
  formSetup.appendChild(h3)
  formSetup.appendChild(ul)

  refreshButton = document.getElementById('refreshButton')
  closeButton = document.getElementById('closeButton')

  // When the refresh button is clicked
  refreshButton.addEventListener('click', function () {
    // Refresh the window and start over
    remote.getCurrentWindow().reload()
  }, false)

  // When the close button is clicked
  closeButton.addEventListener('click', function () {
    // Emit the close-app event to the main process
    ipcRenderer.send('close-app', true)
  }, false)
}

/**
  * Alerts the user that emails are sending
  */
function alertSending () {
  const count = config.recipientsCount
  const testOrLive = (config.testing === true) ? 'test' : 'live'
  const pluralizeEmail = count === 1 ? 'email' : 'emails'
  const toOrFrom = (config.testing === true) ? 'to' : 'from'
  const status = `Sending ${count} ${testOrLive} ${pluralizeEmail} ${toOrFrom} ${sender.from}! These will send in segments of ${limit} every ${config.sendGrid.interval.seconds} second(s).`

  window.alert(status)
  index.addUiStatus(status)
}

/**
  * Alerts the user that emails were sent
  */
function alertSent () {
  const count = config.recipientsCount
  const testOrLive = (config.testing === true) ? 'test' : 'live'
  const pluralizeEmail = count === 1 ? 'email' : 'emails'
  const toOrFrom = (config.testing === true) ? 'to' : 'from'
  const status = `${count} ${testOrLive} ${pluralizeEmail} finished sending ${toOrFrom} ${sender.from}!`

  window.alert(status)
  index.addUiStatus(status)
}

/**
  * Initializes sending
  */
async function init () {
  await alertSending()
  await segmentEmails()
  await addSentMarkup(sent)
  await alertSent()
}

// Send the emails
if (config.confirm === true) {
  init()
}
