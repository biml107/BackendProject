import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';

const hindiSentenceSchema = new Schema({
    uuid: {
        type: String,
        default:uuidv4,
        unique:true
    },
    englishSentenceId: {
        type: String,
        required:true
    },
    hindi: {
        type: String,
        required:true
    },
    hindiExplain: {
        type: String,
        
    },
    creationDateTime: {
        type: String,
        required:true
    },
    userId: {
        type: String,
        required:false
    },
    isHidden: {
        type: Boolean,
        required: true, // Indicates that this field is mandatory
        default: false, // Default value if not provided
      },
      isDeleted: {
        type: Boolean,
        required: true, // Indicates that this field is mandatory
        default: false, // Default value if not provided
      },
     

    
})



const hindiCollection = mongoose.model('hindi', hindiSentenceSchema);
export default hindiCollection; 