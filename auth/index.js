const password = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')
const { JWT_SECRET } = require('../evn')
const createError = require('../utils/createError')
const ERROR_TYPES = require('../utils/errorsTypes')
const userService = require('../servise/user');


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
        const user = await userService.findById(payload.sub)
        
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

})


password.use(jwtStrategy)