const express = require('express')
const { register, 
    login, 
    logout, 
    current, 
    updateAvatar, 
    verifyEmail,
    verifyResend } = require('../../controllers/controllerUser')
const {userValidate} = require('../../validate/validateUser')
const auth = require('../../middlewares/auth')
const validateBody = require('../../middlewares/validateBody')
const upload = require('../../middlewares/multer')
const router = express.Router()



// ======REGISTER_USER=======
router.post('/register', validateBody(userValidate), register)


// ======LOGIN_USER=======
router.post('/login',  validateBody(userValidate), login)



// ======LOGOUT_USER=======
router.post('/logout', auth, logout)



// ======CURRENT_USER=======
router.get('/current', auth, current)


// ======UPDATE_AVATAR=======
router.patch('/avatars', auth, upload.single('avatar'), updateAvatar)


// ======VERIFY_EMAIL=======
router.get("/verify/:verificationToken", verifyEmail);


router.post('/verify', verifyResend)

module.exports = router


