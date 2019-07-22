const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../../../.env') })
require('./ui/browser')
require('./ui/a11y')
require('./ui/navigation')

if (process.env.NODE_ENV === 'development') {
  console.log(`Environment: ${process.env.NODE_ENV}`)
}
