const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const errorHandlers = require('./middlewares/errorHandlers')
const contactsRouter = require('./routes/api/contacts')
const userRouter = require('./routes/api/user')
const setupConnection = require('./index')
const cookieParser = require('cookie-parser')
const { COOKIE_SECRET } = require('./evn')
const createDirIfNotExists = require('./utils/createDirIfNotExists')
const { AVATARS_DIR,  TMP_DIR, PUBLIC_DIR } = require('./constant/common')
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

setupConnection()
createDirIfNotExists(TMP_DIR)
createDirIfNotExists(PUBLIC_DIR)
createDirIfNotExists(AVATARS_DIR)
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(cookieParser(COOKIE_SECRET))

app.use('/avatars', express.static(AVATARS_DIR));

app.use('/api/contacts', contactsRouter)
app.use('/api/users', userRouter)

app.use(errorHandlers);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app 
