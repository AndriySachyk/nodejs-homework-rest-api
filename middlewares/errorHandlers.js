const ERROR_CODES = require('../utils/errorCodes');


const errorHandlers = (err, req,res,next)=>{
    const status = ERROR_CODES[err.type] || 500;
    res.status(status);
    res.json({
        status,
        message: err.message || 'Oops something went wrong',
        data: err.data || {}
    })
}


module.exports = errorHandlers