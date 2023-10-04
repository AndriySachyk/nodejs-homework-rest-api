const contactModel = require('../models/contacts');
const createError = require('../utils/createError');
const ERROR_TYPES = require('../utils/errorsTypes');




const listContacts = async (req, res, next) => {
  try {
    const contacts = await contactModel.find({})
    res.status(200).json({ result:{
      status: "success",
      code: 200,
      data: contacts
    }})
  } catch (error) {
    next(error)
  }
}



const getContactById = async (req, res, next) => {
  try {
    const contactById = await contactModel.findById(req.params.contactId) 
    if (!contactById) {
      const err = createError(ERROR_TYPES.NOT_FOUND, {
        message: "Not found"
      })
      throw err
    }
    res.status(200).json({ result: {
      status: "success",
      code: 200,
      data: contactById 
    }})
  } catch (error) {
    next(error)
  }
}



const addContact = async (req, res, next) => {
  try {
    
    const newContact = await contactModel.create(req.body)
    res.status(201).json({ result:{
      status: "success",
      code: 201,
      data: newContact 
    }})
  } catch (error) {
    next(error)
  }
}



const removeContact = async (req, res, next) => {
  try {
    const removeContactId = await contactModel.deleteOne({_id: req.params.contactId})
    if (!removeContactId) {
      const err = createError(ERROR_TYPES.NOT_FOUND, {
        message: "Not found"
      })
      throw err
    }
    res.status(200).json({ result:{
      status: "success",
      code: 200,
      message: "contact deleted"
    }})
  } catch (error) {
    next(error)
  }
}



const updateContact = async (req, res, next) => {
  try {
  
    const contactUpdate = await contactModel.findByIdAndUpdate( req.params.contactId, req.body)
    res.json({ result: {
      status: "success",
      code: 200,
      data: contactUpdate
    }})
  } catch (error) {
    next(error)
  }
}



const updateStatusContact = async (req,res,next)=>{
  try {
    const patchFavorite = await contactModel.findByIdAndUpdate(req.params.contactId, req.body)
    res.json({result: {
      status: "success",
      code: 200,
      data: patchFavorite
    }})
  } catch (error) {
    next(error)
  }
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
