const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken')
const userModel = require('../models/user')
const createError = require('../utils/createError')
const { JWT_SECRET } = require('../evn');
const ERROR_TYPES = require('../utils/errorsTypes');
const gravatar = require('gravatar')
const fs= require('node:fs/promises')
const Jimp = require('jimp');
const path = require('path')

const AVATARS_DIR = path.join(__dirname, '../', 'public', 'avatars')

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
        const avatarURL = gravatar.url(email)
        const passwordHash = await bcrypt.hash(body.password, 10)   
        const newUser = await userModel.create({...body, password: passwordHash, avatarURL})
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


const updateAvatar = async(req,res,next)=> {

    try {
        const { _id } = req.user;
        
        
        const { path: destination, originalname } = req.file;

        Jimp.read(destination).then((avatar)=>{
            return avatar.resize(250,250).write(resultUpload)
        }).catch((err)=>{
            console.log(err.message)
        })  

        const filename = `${_id}_${originalname}`
        const resultUpload = path.join(AVATARS_DIR, filename)
        await fs.rename(destination, resultUpload)
        const avatarURL = path.join('avatars', filename)

        await userModel.findByIdAndUpdate(_id,{avatarURL})
        
                res.status(200).json({result:{
                    avatarURL
                }})

        } catch (error) {
            next(error)
        } 

}



module.exports = {
    register,login,logout,current,updateAvatar
}