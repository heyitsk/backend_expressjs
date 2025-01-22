const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req,res,next)=>{
   try 
   {//read token from req cookies 

   const cookies = req.cookies
   const {token} = cookies
   if(!token){
      throw new Error("token not found")
   }

   //validate the token 

   const decodedObj = jwt.verify(token,"KUSH@1234#")
   const {_id} = decodedObj

   //find the user 
   const user = await User.findById({_id:_id})
   if(!user){
      throw new Error("user not found")
   }

   req.user= user //we are attaching the user that we have found to the request so when it passes to the next request handeler user will already be present in the req 

   next()
   }
   catch(err){
      res.status(400).send("error: "+err.message)
   }


}
module.exports = {userAuth};