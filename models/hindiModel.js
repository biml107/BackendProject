import hindiCollection from "../schemas/hindiSchema.js";
import hindiLikesCollection from "../schemas/hindiLikeSchema.js";
let hindiSentenceModel = class {
    
    englishSentenceId;
    hindiSentenceId;
    hindi;
    hindiExplain;
    creationDateTime;
    userId;

    constructor({ englishSentenceId, hindiSentenceId, hindi,creationDateTime, hindiExplain,userId }) {
         
        this.englishSentenceId = englishSentenceId;
        this.hindiSentenceId= hindiSentenceId;
        this.hindi=hindi;
        this.hindiExplain = hindiExplain;
        this.creationDateTime = creationDateTime;
        this.userId = userId;
    }


    addHindiTanslate() {
        
        return new Promise(async (resolve, reject) => {
            
           


            try {
                
                const hindiTranslate = new hindiCollection({
                    englishSentenceId: this.englishSentenceId,
                    hindi: this.hindi,
                    userId:this.userId,
                    ...(this.hindiExplain && { hindiExplain: this.hindiExplain }),
                    creationDateTime:this.creationDateTime,
                   
                }) 


                const dbHindiSentence = await hindiTranslate.save();
                return resolve(dbHindiSentence);
            }
            catch (error) {
                
                return reject(error)
            }
        })
    }






    updateHindiTranslate() {
        
         
        return new Promise(async (resolve, reject) => {
            
            try {
                const objectOfAvailableFields = {
                    ...(this.hindi && { hindi :this.hindi}),
                    ...(this.hindiExplain && { hindiExplain:this.hindiExplain})
                }
                
                const dbHindiSentence = await hindiCollection.findOneAndUpdate({uuid: this.hindiSentenceId,userId:this.userId},objectOfAvailableFields,{ returnDocument: 'after' });
                return resolve(dbHindiSentence);
           
            }
            catch (error) {
                return reject(error)
            }
        })
    }


    static findHindiSentenceById({ hindiSentenceId }) {
        
        return new Promise(async (resolve, reject) => {
            
            try{
                const dbHindiSentence= await hindiCollection.findOne({uuid:hindiSentenceId});
                return resolve(dbHindiSentence);
            } catch (err) {
                 
                return reject(err);
            }
        })
    }



 deleteHindiTranslate() {
     

        return new Promise(async(resolve,reject)=>{
            try {
                 
                const dbHindiSentence = await hindiCollection.findOneAndDelete({ uuid: this.hindiSentenceId,userId:this.userId });
                console.log(dbHindiSentence);
            return resolve(dbHindiSentence);
            }
            catch(err){
                return reject(err);
            }
        })
}


    
    static countAddedHindi({ englishSentenceId, userId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await hindiCollection.countDocuments({ englishSentenceId, userId });
                return resolve(count);
            }
            catch (err) {
                return reject(err);
            }
        })
    }


    static findHindiBook({ query }) {
        return new Promise(async (resolve, reject) => {
            
            try {
                
            
                const book = await hindiCollection.aggregate([
                    {
                        $lookup: {
                            from: 'sentences',
                            localField: 'englishSentenceId',
                            foreignField: 'uuid',
                            as: 'student'
                        }
                    },
                    {
                        $unwind: {
                            path: '$student',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            'student.sequence': 1
                        }
                    }
                ])
                console.log(book);
                resolve(book);

            }
            catch (err)
            {
                return reject(err);
            }

        })
    }



    static findHindiTranslates({ query,skip,limit }) {
        return new Promise(async (resolve, reject) => {
            
            try {
                const dbHindiSentences = await hindiCollection.find( query,{_id:0,__v:0} )
                .sort({creationDateTime:1})
                .skip(skip)
                .limit(limit);
             
            return resolve(dbHindiSentences);

            }
            catch (err)
            {
                return reject(err);
            }

            

        })
    }

    static findHindiTranslatesIfUserLoggedIn({ query,skip,limit,loggedInUserId }) {
        return new Promise(async (resolve, reject) => {
            

            try {
                const dbHindiSentences = await hindiCollection.aggregate([
                    // Match documents in the hindi collection based on englishsentenceid
                    {
                      $match:query
                    },
                    {
                        $lookup: {
                          from: 'hindilikes', // Name of the likes collection
                          localField: 'uuid', // Field in the current collection
                          foreignField: 'hindiSentenceId', // Field in the likes collection
                          as: 'allLikes', // Field with all matching documents
                        },
                      },
                    // Perform a lookup to join with the likes collection
                    {
                        $lookup: {
                          from: 'hindilikes', // Name of the likes collection
                          let: { hindiUuid: '$uuid' }, // Pass the uuid of hindisentence as a variable
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ['$hindiSentenceId', '$$hindiUuid'] }, // Match hindisentenceid with uuid
                                    { $eq: ['$likedByUserId', loggedInUserId] }, // Match userId with logged-in user
                                  ],
                                },
                              },
                            },
                            { $limit: 1 }, // Only check if at least one document exists
                          ],
                          as: 'likesInfo', // Resulting field with matching documents
                        },
                      },
                    // Add a new field likedby based on whether there are matching documents in likesInfo
                    {
                      $addFields: {
                        likedby: {
                          $cond: {
                            if: { $gt: [{ $size: '$likesInfo' }, 0] }, // If likesInfo array is not empty
                            then: true,
                            else: false,
                          },
                        },
                        likesCount: { $size: '$allLikes' },
                      },
                    },
                    // Optionally exclude the likesInfo array to clean up the output
                    {
                      $project: {
                        likesInfo: 0,
                        allLikes:0,
                        _id:0,
                        __v:0
                      },
                    },
                     {
                        $sort:{likesCount:-1,creationDateTime:1}
                      },
                      {
                          $skip:skip
                      }, {
                          $limit:limit
                      }
                  ]);
             
            return resolve(dbHindiSentences);

            }
            catch (err)
            {
                return reject(err);
            }

        })
    }
}


export default hindiSentenceModel;
