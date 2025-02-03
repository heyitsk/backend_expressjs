const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionReq = require("../models/connectionRequest")
const User = require("../models/user")


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

userRouter.get("/user/feed", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionReq.find({
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName")


        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{ 
         
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        
        })
        // console.log(hideUsersFromFeed);
        
        const  users = await User.find({
            $and:[
            {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
            
            // If the logged-in user has at least one connection request (sent or received), their ID would be in hideUsersFromFeed, making {_id: {$ne: loggedInUser._id}} redundant in those cases.
            // However, if the user has no connection requests, their ID won’t be in hideUsersFromFeed, and they could see their own profile in the feed without this condition.
            
            ]
        }).select("firstName lastName age gender about skills")

        res.json({users})
        
    }
    catch(err){
        res.status(400).send(`error:- ${err.message}`);
    }
})

module.exports = userRouter