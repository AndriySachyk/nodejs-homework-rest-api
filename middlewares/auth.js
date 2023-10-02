const passport = require("passport")
const createError = require("../utils/createError")
const ERROR_TYPES = require("../utils/errorsTypes")
require('../auth/index')


const auth = (req, res,next)=>{
   
   passport.authenticate('jwt',{session: false}, (error, user)=>{
    if (error) {
       return next(error)
    }
    if (!user) {
        const err = createError(ERROR_TYPES.UNAUTHORIZED,{message:'Not authorized'})
        next(err)
    }

    req.user = user
    next()

   })(req,res,next)
  }


module.exports = auth