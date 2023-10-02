const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken')
const userModel = require('../models/user')
const createError = require('../utils/createError')
const ERROR_CODES = require('../utils/errorCodes');
const { JWT_SECRET } = require('../evn');
const ERROR_TYPES = require('../utils/errorsTypes');

const register = async (body)=> {
    const passwordHash = await bcrypt.hash(body.password, 10)   
    const newUser = await userModel.create({...body, password: passwordHash})
    return newUser
}


const login = async ({email, password}) =>{
        let user  = await userModel.findOneAndUpdate({email})
        if(!user){
            const error = createError(ERROR_CODES.NOT_FOUND,
                {message: 'User with given email not found'
            })
            throw error
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
        return user 
    }


const logout = async(user)=>{
     await userModel.findByIdAndUpdate(user._id, {token:''})
}

const current = async (user)=>{
    const userCurrent = await userModel.findById(user._id)
    return {email: userCurrent.email, subscription: userCurrent.subscription}
}


module.exports = {
    register,login,logout,current
}