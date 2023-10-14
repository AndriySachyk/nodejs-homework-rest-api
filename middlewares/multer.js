const multer = require('multer')
const {TMP_DIR}= require('../constant/common');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TMP_DIR)
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
    },
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload