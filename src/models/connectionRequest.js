const mongoose = require("mongoose")

const connectionReqSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
        
    },
    status:{
        type:String,
        enum:{
            values:["accepted","rejected","ignored","interested"],
            message:`{VALUE} not a valid status`
        }
    }
},{
    timestamps:true
})


connectionReqSchema.index({fromUserId:1, toUserId:1})

//NOTE :- never use arrow function in pre
//NOTE :- always use next() bcz it is kind of a middelware 
connectionReqSchema.pre("save", function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send requets to yourself")
    }
    next()
})

const ConnectionReq = mongoose.model("ConnectionReq",connectionReqSchema)

module.exports = ConnectionReq