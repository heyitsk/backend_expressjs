const express = require("express")
const feedRouter = express.Router()
const User = require("../models/user")

//get users by email id using findOne. 
//IF two entries with same email id are present it'll return the oldest entry with that email id 
// app.get("/signup",async (req,res)=>{
//     const userEmail = req.body.emailId
//     try{
//     const user = await User.findOne({emailId:userEmail})
//     if(!user){
//         res.send("unable to find the user")
//     }
//     else{
//         res.send(user)
//     }
//     }
//     catch(err){
//         res.status(400).send("cannot find user")
//     }

// })

//get user by _id
// app.get("/signup",async (req,res)=>{
//     // const userId = req.body._id
//     console.log(userId);
//     try{
//     const user = await User.findById({_id:userId}) 
//     //.find returns an array of object whereas .findOne returns one single object 
//     if(!user){
//         res.send("unable to find the user")
//     }
//     else{
//         res.send(user)
//     }
//     }
//     catch(err){
//         res.status(400).send("cannot find user")
//     }

// })


//get all users /feed api 
feedRouter.get("/feed",async (req,res)=>{
    try{
    const allUser = await User.find({}) //this will give all documents from the database 
    res.send(allUser)
    }
    catch(err){
        res.status(400).send("cannot find users")

    }

})

module.exports = feedRouter