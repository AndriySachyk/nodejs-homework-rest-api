const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken')
const userModel = require('../models/user')
const createError = require('../utils/createError')
const { JWT_SECRET } = require('../evn');
const ERROR_TYPES = require('../utils/errorsTypes');
const gravatar = require('gravatar')
const fs= require('node:fs/promises')
const Jimp = require('jimp');
const path = require('path');
const { nanoid } = require('nanoid');
const {sendEmail} = require('../servise/nodemailer');
const { mail } = require('../utils/templateMail');


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
        const passwordHash = await bcrypt.hash(body.password, 10)   
        
        const avatarURL = gravatar.url(email)
        
        const verificationToken = nanoid()
        
        const newUser = await userModel.create({...body, password: passwordHash, avatarURL, verificationToken})
        
        
        await sendEmail(()=>{mail(email, verificationToken)})

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
    
    
const verifyEmail = async(req,res,next)=>{
    const {verificationToken} = req.params
    
try {
    const verifiedUser = await userModel.findOne({verificationToken});
    if (!verifiedUser) {
        const err = createError(ERROR_TYPES.NOT_FOUND,{
            message:'Not Found'
        })
        throw err
    }
    await userModel.findByIdAndUpdate(verifiedUser._id, {verify: true, verificationToken:null})
    res.status(200).json({result:{
        message: 'Verification successful',
    }})
    
} catch (error) {
    next(error)
}

}

    
    
const verifyResend = async(req,res,next)=>{
    try {
        const {email}= req.body
        if (!email) {
            const err = createError(ERROR_TYPES.BAD_REQUEST,{message:"missing required field email"})
            throw err
        }
        const user = await userModel.findOne({email})
        if (!user) {
            const err = createError(ERROR_TYPES.NOT_FOUND,{
                message:'Not Found'
            })
            throw err
        }
        if (user.verify) {
            const err = createError(ERROR_TYPES.BAD_REQUEST,{message:"Verification has already been passed"})
            throw err
        }

        const {verificationToken} = user

        await sendEmail(()=>mail(email, verificationToken))




        res.status(200).json({result:{
            message: "Verification email sent"
          }})
    } catch (error) {
        next(error)
    }
}
    




    module.exports = {
        register,
        login,
        logout,
        current,
        updateAvatar,
        verifyEmail,
        verifyResend
}