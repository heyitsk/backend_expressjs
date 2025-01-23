const express = require("express")

const authRouter = express.Router()
const {signUpDataValidation} = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user.js")



authRouter.post("/signup",async (req,res)=>{
    // console.log(req.body);   
    const {firstName, lastName, password, emailId}= req.body

    //encrypt the passwword 
    const passwordHash = await bcrypt.hash(password,10)


    const user = new User({
        firstName,
        lastName,
        password:passwordHash,
        emailId
    }) //we are creating a new instance of a user model 

    //whenver you are doing DB calls always do then inside try catch 
    try{
    signUpDataValidation(req) //we are adding this in the try catch block bcz the error it throws will be handeled by the catch blocks

        await user.save() //since it returns a promise so use async await 
        res.send("user added succesfully")
    }
    catch(err){
        res.status(400).send("error: "+err.message)
    }
})
//get users by email id
authRouter.get("/signup",async (req,res)=>{
    const userEmail = req.body.emailId
    // console.log(userEmail);
    try{
    const userList = await User.find({emailId:userEmail}) 
    //.find returns an array of object whereas .findOne returns one single object 
    if(userList.length===0){
        res.send("unable to find the user")
    }
    else{
        res.send(userList)
    }
    }
    catch(err){
        res.status(400).send("cannot find user")
    }

})

authRouter.post("/login",async (req,res)=>{
    //work flow -> it checks if email present in db -> if yes then it checks if password matches
    try{
        const {emailId, password} = req.body
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("email not present in db")
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){

            //creating a token 
            const token = await user.getJWT() //we only have to do this bcz now the user schema has this method with it 

            //create a cookie and send the token with it 
            res.cookie("token",token,{expires: new Date(Date.now()+8*3600000)})//this will expire in 8 hours 

            res.send("login successfull")
        }
        else{
            throw new Error("password does not match")
        }
    }
    catch(err){
        res.status(400).send("error: "+err.message)
    }
})

authRouter.post("/logout",(req,res)=>{
    res
        .cookie("token",null,{expires:new Date(Date.now())})
        .send("user logged out succesfully")
})
module.exports = authRouter