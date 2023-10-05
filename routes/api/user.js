const express = require('express')
const { register, login, logout, current } = require('../../controllers/controllerUser')
const {userValidate} = require('../../validate/validateUser')
const auth = require('../../middlewares/auth')
const validateBody = require('../../middlewares/validateBody')
const router = express.Router()



// ======REGISTER_USER=======
router.post('/register', validateBody(userValidate), register)


// ======LOGIN_USER=======
router.post('/login',  validateBody(userValidate), login)



// ======LOGOUT_USER=======
router.post('/logout', auth, logout)



// ======CURRENT_USER=======
router.get('/current', auth, current)



module.exports = router


