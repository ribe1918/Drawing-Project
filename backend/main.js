const express = require('express')
const app = express()
const history = require('connect-history-api-fallback')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const word = require('./public/static/word.json')
require('dotenv').config()

const connect = require('./model')

const indexRouter = require('./routes/index')
const todoRouter = require('./routes/rest')

connect()

// save State
const pushArray = []
const userList = []
const Millisecond = 100000
let drawable = false
let pickedID
let index = 0
let roundCounter = 1
let step = -1
let answer = ''
let polling
let round

app.use(history())
app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use('/api/todos', todoRouter)
app.use('/', indexRouter)

app.use((req, res, next) => {
  // next(createError(404))
})

app.use((err, req, res, next) => {
  res.locals.messages = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

async function WordSelection () {
  const num = Math.floor(Math.random() * word.length)
  return word[num]
}

function clearPoll () {
  clearTimeout(round)
  clearInterval(polling)
}

function correct (usr, room) {
  clearPoll()
  answer = ''
  Start(userList)
  chat.to('1').emit('clsans')
  chat.to('1').emit('clear')
  if (usr !== undefined && usr !== null) usr.score += 10
  chat.to(room).emit('list', userList)
}

async function Start (mixed) {
  if (mixed.length <= index) index = 0
  if (roundCounter === 5) {
    roundCounter = 0
    drawable = false
    setTimeout(() => {
      if (mixed.length >= 2) {
        clearPoll()
        chat.to('1').emit('clsans')
        Start(mixed)
      }
    }, 5000)
    return false
  }

  let time = Millisecond
  drawable = true
  answer = await WordSelection()
  pickedID = mixed[index].id
  chat.to(`${pickedID}`).emit('word', answer.word)
  index++
  roundCounter++

  polling = setInterval(() => {
    const percent = time / Millisecond * 100
    chat.to('1').emit('timer', percent)
    time -= 1000
    if (percent <= 0) {
      time = Millisecond
      clearInterval(polling)
    }
  }, 1000)

  round = setTimeout(async () => {
    pickedID = ''
    step = -1
    pushArray.splice(0, pushArray.length)
    chat.to('1').emit('clear')
    clearPoll()
    Start(mixed)
  }, Millisecond + (roundCounter * 1000))
}

const chat = io.of('/game').on('connection', socket => {
  console.log('Connect from Client ' + socket.id)

  socket.on('saveState', (data) => {
    step++
    if (step < pushArray.length) {
      pushArray.length = step
    }
    pushArray.push(data)
  })

  socket.on('ClearAll', (data) => {
    if (pickedID !== socket.id) return console.log('그리는 사람 아님')
    step = -1
    pushArray.splice(0, pushArray.length)
    socket.join(socket.room)
    chat.to(socket.room).emit('clear')
  })

  socket.on('dpS', (data) => {
    if (pushArray.length < 0) return
    const room = socket.room = data.room
    socket.join(room)
    chat.to(room).emit('display', pushArray[step])
  })

  socket.on('mousemove', data => {
    if (data.isActive !== true) return

    const room = socket.room = data.room
    socket.join(room)

    if (drawable === false) return false
    if (pickedID === socket.id) {
      chat.to(room).emit('draw', {
        x1: data.x1,
        y1: data.y1,
        x2: data.x2,
        y2: data.y2,
        color: data.color
      })
    }
  })

  socket.on('submitMessage', data => {
    const room = socket.room = data.room
    socket.join(room)

    if (pickedID === socket.id) {
      chat.to(pickedID).emit('chat', {
        name: 'SYSTEM',
        msg: '정답을 말하지 마세요.'
      })
      return false
    }
    const found = userList.find(user => user.id === socket.id)
    const idx = userList.indexOf(found)
    if (answer.word === data.msg) return correct(userList[idx], room)
    chat.to(room).emit('chat', data)
    step = -1
    pushArray.splice(0, pushArray.length)
  })

  socket.on('nickname', data => {
    userList.push({
      id: data.id,
      name: data.name,
      score: data.score
    })
    console.log(userList)
  })

  socket.on('userlist', (data) => {
    const room = socket.room = data.room

    socket.join(room)
    chat.to(room).emit('list', userList)

    if (userList.length >= 2 && drawable === false) Start(userList)
  })

  socket.on('disconnect', () => {
    const found = userList.find(user => user.id === socket.id)
    socket.join(socket.room)
    chat.to(socket.room).emit('offline', found)
    const idx = userList.indexOf(found)

    if (idx > -1) userList.splice(idx, 1)
    if (pickedID === socket.id) correct()
    if (userList.length <= 0) {      
      answer = ''
      roundCounter = 0
      drawable = false
      clearPoll()
    }
  })
})

server.listen(app.get('port'), () => {
  console.log(`http://localhost:${process.env.PORT} is running!`)
})
