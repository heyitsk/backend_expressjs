const express = require("express")
// const authRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionReq = require("../models/connectionRequest")
const connectionRouter = express.Router()
const User = require("../models/user")


connectionRouter.post("/request/send/:status/:userId",userAuth, async (req,res)=>{
    try{
        
        const toUserId = req.params.userId
        const status = req.params.status
        const user = req.user
        const fromUserId = user._id

        const allowedStatus = ["ignored","interested"]
        if(!allowedStatus.includes(status)){
            throw new Error("not a valid status")
        }

        // if(fromUserId.equals(toUserId)){
        //     //bcz this fromuserid is an object you can't directly compare you ahve to use .equals 
        //     throw new Error("cannot send request to yourself")
        // }
        //another approach for this issue is writing schema pre which is a function which gets run "before or pre" saving. It is like a middleware

        //to check if the user  is present or the touserid is valid or not
        const toUser = await User.findById(toUserId)
        if(!toUser){
            throw new Error("cannot find the user to which you want to send the request")
        }

        const existingConnectionReq = await ConnectionReq.findOne({
            $or:[
                {toUserId,fromUserId},
                {toUserId:fromUserId, fromUserId:toUserId}
            ]
        })
        if(existingConnectionReq){
            throw new Error("connection request already present")
        }

        const connectionRequest = new ConnectionReq({
            toUserId:toUserId,
            fromUserId:fromUserId,
            status:status
        })

        const data = await connectionRequest.save()
        res.send("connection request successfully sent")


    }
    catch(err){
        res.status(400).send(`error:- ${err.message}`);

    }


})

connectionRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try{
        //check for entered status 
        //check for requestId present in 
        //check for status should be interested in db
        //check for loggedinuser = touserid in db
        
        const {status, requestId} = req.params
        const loggedInUser = req.user

        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            throw new Error("status not valid")
        }

        const request = await ConnectionReq.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status:"interested"

        })
        if(!request){
            throw new Error("connection request not found")
        }

        request.status = status 
        const reqSave = await request.save()
        
        res.send("connection request accepted")


    }
    catch(err){
        res.status(400).send(`error:- ${err.message}`);
    }
})



module.exports = connectionRouter