import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
const userSchema = new Schema({
    uuid: {
        type: String,
        default:uuidv4,
        unique:true
    },
    username:{
     type:String,
     required:true,
     unique:true
    },
    email:{
     type:String,
     required:true,
     unique:true
    },
    name:{
     type:String,
     required:true
 
    },
 password:{
  type:String,
  required:true
 
 },
 role: {
  type: String,
  enum: ["user", "admin"],
  required: true,
  default: "user", // Default value if not provided
},
 phoneNumber:{
     type:String,
     required:true
 },
 profilePic:{
     type:String,
     required:false
    },
    address: {
        addressLine: String,
        village: String,
        postOffice: String,
        policeStation: String,
        dist: String,
        state: String,
        country: String,
        pin:String
    }
    
 
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if the password is modified
  
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds); // Generate salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      next();
    } catch (error) {
      next(error);
    }
  });
 
  userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
const userCollection = mongoose.model('users', userSchema);
export default userCollection;