import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';
const wordSchema = new Schema({
    
    englishSentenceId: {
        type: String,
        required:true
    },
    word: {
        type: String,
        required:true
    },
    meaning: {
        type: String,
        required:true  
    },
    explainEnglish: {
        type: String,
         
    },
    explainHindi: {
        type:String
    },
    userId: {
        type: String,
        required:true 
    }
})

const wordCollection = mongoose.model('words', wordSchema);
export default wordCollection;