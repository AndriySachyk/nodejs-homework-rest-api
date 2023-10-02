const password = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')
const { JWT_SECRET } = require('../evn')
const userModel = require('../models/user')
const createError = require('../utils/createError')
const ERROR_TYPES = require('../utils/errorsTypes')



const cookieExtractor = function(req){
    let token = null;
    if (req && req.cookies){
        token = req.cookies['jwt']
    }
    return token
}



const jwtStrategy = new Strategy({secretOrKey: JWT_SECRET, jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
])}, 
async(payload, done)=>{
    try {
        const user = await userModel.findOne(payload._id, {password:0})
        
        if (user) {
            return done(null, user)
        } else {
            const err = createError(ERROR_TYPES.UNAUTHORIZED, {
                message: 'Not authorized'
            })
            done(err, null)
        }
    } catch (error) {
        return done(error, null)
    }

    console.log('userPRO', user)
})


password.use(jwtStrategy)