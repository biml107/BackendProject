import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
 
const userCollection = mongoose.model('users', userSchema);
export default userCollection;