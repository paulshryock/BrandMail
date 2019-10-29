const email = {
  title: 'Email Title',
  year: new Date().getFullYear()
}

email.copyright = `&copy; ${email.year} ${email.title}. All rights reserved.`

// TODO: Move this to a Liquid filter
email.superscript = function (text) {
  return `<sup style="font-size: 66%; line-height: 1; vertical-align: top; mso-text-raise: 30%;">${text}</sup>`
}

module.exports = email
