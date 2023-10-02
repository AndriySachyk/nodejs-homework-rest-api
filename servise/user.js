const userModel = require('../models/user')


const findUserByEmail = async (email)=>{
    const [user] = await userModel.find({email})

    return user
}


// const findById

module.exports = {
    findUserByEmail
}