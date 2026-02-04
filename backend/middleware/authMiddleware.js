const jwt=require("jsonwebtoken")

const auth_middileware=async (req,res,next)=>{
    try {
        const token=req.cookies.token
        
        if(!token){
           
           return res.status(401).json({
                message:"user not found"
            })
        }

        const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken){
              return res.status(401).json({
                message:"user not found"
            })
        }

  
        req.userId=decodedToken.userId
        next()

    } catch (error) {
         return res.status(500).json({
                message:"isAuth error"
            })
    }

}

module.exports=auth_middileware