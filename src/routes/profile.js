const express = require("express")
const profileRouter = express.Router()
const User = require("../models/user")
const {userAuth} = require("../middleware/auth")



profileRouter.get("/profile",userAuth, async (req,res)=>{
    try 
    {
    const user = req.user
    if(!user){
        throw new Error("user does not exist")
    }
    
    res.send(user)}
    catch(err){
        res.status(400).send("Error"+"-"+err.message)
    }
    
})
//delete user by _id 
profileRouter.delete("/user",async(req,res)=>{
    const userId = req.body._id
    try{

        const user = await User.findByIdAndDelete({_id:userId})
        res.send("user deleted")
    }
    catch(err){
        res.send("some error ocurred cannot delete the user")
    }
})


//update data fo the user using pathc
profileRouter.patch("/user/:userId",async(req,res)=>{
    const data = req.body
    const userId= req.params.userId
    try{
        const UPDATES_ALLOWED = ["firstName","lastName","gender","about","password","skills"]
        const isAllowed = Object.keys(data).every((key)=>UPDATES_ALLOWED.includes(key))
        if(!isAllowed){
            throw new Error("update not allowed")
        }
        if(data.skills.length>5){
            throw new Error("skills cannot be more than 5")
        }
         const userInfo = await User.findByIdAndUpdate({_id:userId},data,
            {returnDocument:"after",
                runValidators:true
            },
            
        )
        // console.log(userInfo);
        
        
        res.send("data updates succesfully")
    
    }
    catch(err){
        res.status(400).send("update not allowed"+"-"+err.message)
    }
}) //this does not update the _id field bcz its not present in the schema of the model. SO anything let's suppose you try to add another fields while updating which are not in the schema it'll ignore all of them 
module.exports = profileRouter