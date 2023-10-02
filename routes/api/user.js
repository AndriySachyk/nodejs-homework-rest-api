const express = require('express')
const { register, login, logout, current } = require('../../controllers/controllerUser')
const {userValidate} = require('../../validate/validateUser')
const auth = require('../../middlewares/auth')
const router = express.Router()



// ======REGISTER_USER=======
router.post('/register', async(req, res, next)=>{
    try {
        const { error } = userValidate.validate(req.body);
        if (error) {
            res.status(400).json({result:{
                status: "rejected",
                code: 400,
                message: `${error}`
        }})
        throw error;
    } 
    const newUser = await register(req.body)
    res.status(201).json({ result:{
        status: "success",
        code: 201,
        data: newUser
    }})
} catch (error) {
    next(error)
}
})


// ======LOGIN_USER=======
router.post('/login', async(req, res, next) =>{
    try {
        const {body}= req
        const { error } = userValidate.validate(body);
        if (error) {
            res.status(400).json({result:{
                status: "rejected",
                code: 400,
                message: `${error}`
            }})
            throw error;
        } 
        const user = await login(body)
        res.cookie('jwt',user.token, {secure: true})
        return res.status(200).json({result:{
            status: 'success',
            code: 200,
            data: user
        }})
    } catch (error) {
        next(error)
    }
})



// ======LOGOUT_USER=======
router.post('/logout', [auth], async(req,res,next)=>{
    try { 
        await logout(req.user)
        res.clearCookie('jwt')
        return res.status(204).json()
        
    } catch (error) {
        next(error)
    }
})



// ======CURRENT_USER=======
router.get('/current', [auth], async(req,res,next)=>{
    try{
        const user = await current(req.user)
        res.status(200).json({result:{
            status: 'success',
            code:200,
            data: user
        }})
    }catch(err){
        next(err)
    }
})



module.exports = router


