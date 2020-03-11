const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(
      process.env.MONGO_URI,
      { user: process.env.MONGO_USER, pass: process.env.MONGO_PASS },
      error => {
        if (error) {
          console.log('Connection Failed', error)
        } else {
          console.log('Connection Success!')
        }
      }
    )
  }
  connect()
  mongoose.connection.on('error', error => {
    console.error('Disconnected', error)
  })
  mongoose.connection.on('Disconnected', error => {
    console.error('Retry Connection', error)
    connect()
  })
}
