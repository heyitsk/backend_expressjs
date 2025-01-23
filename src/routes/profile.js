const express = require("express")
const profileRouter = express.Router()
const User = require("../models/user")
const {userAuth} = require("../middleware/auth")
const {profileEditDataValidation} = require("../utils/validation")
const bcrypt = require("bcrypt")



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
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const user = req.user
        if (!profileEditDataValidation(req)){
            throw new Error("cannot update the field")
        }
        Object.keys(req.body).forEach((key)=>user[key]=req.body[key])

        await user.save()
        res.send(`${user.firstName} profile udpated successfull`)
    
    }
    catch(err){
        res.status(400).send("update not allowed"+"-"+err.message)
    }
}) 
//this does not update the _id field bcz its not present in the schema of the model. SO anything let's suppose you try to add another fields while updating which are not in the schema it'll ignore all of them 


profileRouter.patch("/profile/changepassword",userAuth,async (req,res)=>{
    try{
        const user = req.user 
        // console.log(user);
        const passwordHash = user.password
        const passwordEntered = req.body.password
        const newPassword = req.body.newPassword
        const isPasswordMatch = await bcrypt.compare(passwordEntered,passwordHash)
        // console.log(isPasswordMatch);
        if(!isPasswordMatch){
            throw new Error("password doesn't match")
        }
        const newHash = await bcrypt.hash(newPassword,10)
        user.password = newHash
        await user.save()
        res.send("password successfully updated")


        

    }
    catch(err){
        res.status(400).send("error:- ",err.messsage)
    }
})
module.exports = profileRouter