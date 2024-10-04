import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';

const sentenceSchema = new Schema({
    uuid: {
        type: String,
        default:uuidv4,
        unique:true
    },
    userId: {
        type: String,
        required:true
    },
   standard:{
    type:Number,
    required:true,
    
    },
    bookName: {
        type: String,
        required:false
    },
   chapter:{
    type:Number,
    required:true,

   },
   sequence:{
    type:Number,
    required:true

    },
    position: {
        type: Number,
        default:2
        
   },
   value:{
     type:String,
     required:true

    },
  
 

})

const sentenceCollection = mongoose.model('sentence', sentenceSchema);
export default sentenceCollection;

 

