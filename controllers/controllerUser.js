const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken')
const userModel = require('../models/user')
const createError = require('../utils/createError')
const { JWT_SECRET } = require('../evn');
const ERROR_TYPES = require('../utils/errorsTypes');


const register = async(req, res, next)=>{
    try {
        const {email} = req.body    
        const user = await userModel.findOne({email})
        if (user) {
            const err = createError(ERROR_TYPES.EMAIL_USE, {
                message: "Email in use"
            })
            throw err
        }
        const {body} = req
        const passwordHash = await bcrypt.hash(body.password, 10)   
        const newUser = await userModel.create({...body, password: passwordHash})
        return res.status(201).json({ result:{
            status: "success",
            code: 201,
            data: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        }})
} catch (error) {
    next(error)
}
}



const login = async(req, res, next) =>{
    try {
        const {email, password} = req.body

        let user = await userModel.findOne({email})
        if (!user) {
            const err = createError(ERROR_TYPES.UNAUTHORIZED, {
                message: "Email or password is wrong"
            })
            throw err
        }


        const hashedPassword = user.password;
        const isValid = await bcrypt.compare(password, hashedPassword)
        if (!isValid) {
            
            const error = createError(ERROR_TYPES.UNAUTHORIZED, {message:"Email or password is wrong"})
            throw error;
            
        }
        const serializedUser = user.toObject();
        delete serializedUser.password;
        const token = jwt.sign({sub: serializedUser._id, role: serializedUser.subscription },JWT_SECRET,{expiresIn: "23h"})
        user = {...serializedUser, token}
        
        await userModel.findOneAndUpdate(user._id, { token})
        
        res.cookie('jwt',user.token, {secure: true})
        return res.status(200).json({result:{
            status: 'success',
            code: 200,
            data: user
        }})
            
    } catch (error) {
        next(error)
    }
}



const logout = async(req,res,next)=>{
    try {
        const {user} = req
        res.clearCookie('jwt')
        await userModel.findByIdAndUpdate(user._id, {token:''})

        res.status(204).json()
            
    } catch (error) {
        next(error)
    }
}


const current = async(req,res)=>{
    const {email, subscription,} = req.user
        res.status(200).json({result:{
            status: 'success',
            code:200,
            data: {
                email: email,
                subscription: subscription
            }
        }})
    
}

module.exports = {
    register,login,logout,current
}