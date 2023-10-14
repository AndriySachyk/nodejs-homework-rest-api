const express = require('express')
const { register, login, logout, current, updateAvatar } = require('../../controllers/controllerUser')
const {userValidate} = require('../../validate/validateUser')
const auth = require('../../middlewares/auth')
const validateBody = require('../../middlewares/validateBody')
const upload = require('../../middlewares/multer')
const router = express.Router()
const path = require('path');
const fs = require('fs').promises;
const storeImage = path.join(process.cwd(), 'images')

// ======REGISTER_USER=======
router.post('/register', validateBody(userValidate), register)


// ======LOGIN_USER=======
router.post('/login',  validateBody(userValidate), login)



// ======LOGOUT_USER=======
router.post('/logout', auth, logout)



// ======CURRENT_USER=======
router.get('/current', auth, current)


// ======CURRENT_USER=======
router.patch('/avatars', auth, upload.single('avatar'), updateAvatar)


module.exports = router


