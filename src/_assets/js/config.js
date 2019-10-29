const path = require('path')
const config = require('config')

/**
  * The main config object
  */
let config = {

  sendGrid: {
    limit: 500,
    interval: { seconds: 20 },

    apiKey: config.get('sendgrid.api.key')
  },

  setTesting: function (bool) {
    config.testing = bool
  },

  sender: {
    name: {
      setFirst: function (first) {
        config.sender.name.first = first
      },
      setLast: function (last) {
        config.sender.name.last = last
      },
      setTeam: function (team) {
        config.sender.name.team = team
      }
    },
    setEmail: function (email) {
      config.sender.email = email
    }
  },

  setRecipientsCount: function (count) {
    config.recipientsCount = count
  },

  headers: {
    'password-violation': [ 'User_Principal_Name', 'EmailAddress', 'Domain_File' ]
  },

  setRecipients: function (recipients) {
    config.recipients = recipients
  },

  setSubject: function (text) {
    config.subject = text
  },

  message: {
    setText: function (text) {
      config.message.text = text
    },
    setHtml: function (html) {
      config.message.html = html
    }
  },

  setConfirm: function (bool) {
    config.confirm = bool
  }

}

module.exports = config
