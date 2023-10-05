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
    token: String
  },{timestamps:true, versionKey:false})


schemaUser.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj
} 
const userModel = model('users', schemaUser)

module.exports = userModel;