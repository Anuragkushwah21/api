const jwt=require('jsonwebtoken')
const UserModel=require('../models/user')

const checkUserAuth=async(req,res,next)=>{
    // console.log("middleware auth")
    const {token}=req.cookies; //token get
    // console.log(token)
    if(!token){
        res.status(401).json({
            'status':"failed",
            "message":"Unauthorised user no token"
        })

    }else{
        const data =jwt.verify(token,'anuragkushwah9669907552asdfghjkzxcvbnm')
        //get data
        const Userdata=await UserModel.findOne({_id:data.ID});
        // console.log(Userdata)
        req.Userdata=Userdata
        next();
    }
}

module.exports=checkUserAuth;
