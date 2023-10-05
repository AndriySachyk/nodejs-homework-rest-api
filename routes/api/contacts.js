const express = require('express')
const { listContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact } = require('../../controllers/controllerContacts')
const { contactSchemaPost, contactSchemaPut, contactSchemaPatch } = require('../../validate/validateContacts')
const auth = require('../../middlewares/auth')
const validateBody = require('../../middlewares/validateBody')

const router = express.Router()




// ======GET_LIST_CONTACTS=======
router.get('/', listContacts)


// ======GET_CONTACT=======
router.get('/:contactId', getContactById)



// ======ADD_CONTACT=======
router.post('/', auth, validateBody(contactSchemaPost), addContact)



// ======REMOVE_CONTACT=======
router.delete('/:contactId', auth, removeContact)



// ======UPDATE_CONTACT=======
router.put('/:contactId', auth, validateBody(contactSchemaPut), updateContact)




// ======PATCH_CONTACT=======
router.patch('/:contactId/favorite', auth, validateBody(contactSchemaPatch), updateStatusContact)





module.exports = router
