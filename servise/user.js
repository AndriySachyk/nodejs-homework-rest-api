const userModel = require('../models/user')


const findById = async (id) => {
    const user = await userModel.findById(id);
  
    return user;
  };


module.exports = {
    findById
}