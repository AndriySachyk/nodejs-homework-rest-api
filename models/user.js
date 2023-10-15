const {Schema, model} = require('mongoose')

const schemaUser = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    
  },{timestamps:true, versionKey:false})


schemaUser.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj
} 
const userModel = model('users', schemaUser)

module.exports = userModel;