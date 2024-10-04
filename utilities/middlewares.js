const checkAuth = (req, res, next) => {
    try {
        if(req.session.isAuth){
            return next(); 
            
        }
        
        return res.status(400).send({
            message:"Session Expired. please Loigin"
        })
    }
    catch (err) {
        return res.status(400).send({
            message:"SEssion Expired. please Loigin"
        })
   }
 
   
     
}

export {checkAuth}