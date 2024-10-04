import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';
const explainSchema = new Schema({
    uuid: {
        type: String,
        default:uuidv4,
        unique:true
    },
    englishSentenceId: {
        type: String,
        required: true,
        
    },
    simpleEnglish:{
         type:String
    },
    simpleEnglishHindi: {
        type: String,
        
    },
     englishExplain: {
        type: String,
        
    },
    explainWithGrammer: {
        type:String
    },
    creationDateTime: {
        type:String,
        required:true
    },
    userId: {
        type: String,
        required:false
    }
})


const explanationCollection = mongoose.model('explanation', explainSchema);
export default explanationCollection;