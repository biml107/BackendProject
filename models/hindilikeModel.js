import hindiLikeCollection from "../schemas/hindiLikeSchema.js";
let HindiSentenceLikesModel = class {
    userId;
    hindiSentenceId;
   
    constructor({ hindiSentenceId,creationDateTime,userId }) {
        this.userId = userId;
        this.hindiSentenceId = hindiSentenceId;
        this.creationDateTime = creationDateTime;
        
    }

    addHindiLike() {
        
        return new Promise(async (resolve, reject) => {
            
           


            try {
                
                const hindiLike = new hindiLikeCollection({
                    hindiSentenceId: this.hindiSentenceId,
                    likedByUserId:this.userId,
                    LikedAt:this.creationDateTime,
                   
                }) 


                const dbHindiLike = await hindiLike.save();
                return resolve(dbHindiLike);
            }
            catch (error) {
                
                return reject(error)
            }
        })
    }
    deleteHindiLike() {
        
        return new Promise(async (resolve, reject) => {
            
           


            try {
                
                const dbHindiLike = await hindiLikeCollection.findOneAndDelete({ hindiSentenceId: this.hindiSentenceId,likedByUserId:this.userId });
                //console.log(dbHindiLike);
            return resolve(dbHindiLike);


                 
            }
            catch (error) {
                
                return reject(error)
            }
        })
    }


}
export default HindiSentenceLikesModel;