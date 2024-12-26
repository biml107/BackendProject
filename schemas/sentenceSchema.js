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
   chapterId:{
    type:Number,
    required:true,

   },
   sequence:{
    type:Number,
    required:true

    },
    paragraphPosition: {
        type: Number,
        default:2,
        validate: {
            validator: function(value) {
                if (!value) return true;
                // Only allow values 1 or 2
                return value === 1 || value === 2;
            },
            message: 'paragraphPosition must be 1 or 2'
        }
        
   },
   value:{
     type:String,
     required:true

    },
  
 

})

// Pre-save hook to set paragraphPosition to 2 if an invalid value is given
sentenceSchema.pre('save', function(next) {
    if (this.paragraphPosition !== 1 && this.paragraphPosition !== 2) {
        this.paragraphPosition = 2; // Set default value
    }
    next();
});
const sentenceCollection = mongoose.model('sentence', sentenceSchema);
export default sentenceCollection;

 

