import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';

const hindiLikeSchema = new Schema({
    uuid: {
        type: String,
        default:uuidv4,
        unique:true
    },
    hindiSentenceId: {
        type: String,
        required:true
    },
    likedByUserId: {
        type: String,
        required:true
    },
    
    LikedAt: {
        type: String,
        required:true
    },
   
    
    
})



const hindiLikesCollection = mongoose.model('hindilikes', hindiLikeSchema);
export default hindiLikesCollection; 