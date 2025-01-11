const checkAuth = (req, res, next) => {
    try {
        if(req.session.isAuth){
            return next(); 
            
        }
        
        return res.status(400).send({
            message:"Session Expired. Please Login"
        })
    }
    catch (err) {
        return res.status(400).send({
            message:"SEssion Expired. Please Login"
        })
   }
 
   
     
}

export {checkAuth}