const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionReq = require("../models/connectionRequest")



//show all pending requests 
userRouter.get("/users/request/received", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const userData = await ConnectionReq.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName", "lastName", "age", "gender", "skills"])

        res.json({ 
            message:"data fetched successfully",
            data : userData
        })

    }
    catch(err){
        res.status(400).send(`error:- ${err.message}`);
    }
})

userRouter.get("/users/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user

        const connectionRequests = await ConnectionReq.find({
            $or:[
                {toUserId: loggedInUser, status:"accepted"},
                {fromUserId:loggedInUser, status:"accepted"}
            ]
        }).populate("fromUserId",["firstName", "lastName", "age", "gender", "skills"])
        .populate("toUserId",["firstName", "lastName", "age", "gender", "skills"])

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
            // If the logged-in user is the sender:
            // It returns the recipient's details (the user to whom the request was sent).
            // If the logged-in user is the receiver:
            // It returns the sender's details (the user who initiated the request).
        res.json({data})
    }
    catch(err){
        res.status(400).send(`error:- ${err.message}`);
    }
})

module.exports = userRouter