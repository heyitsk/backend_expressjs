const adminAuth = (req,res,next)=>{
    //logic to authorize user
   console.log("admin auth is getting checked");
    
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(isAdminAuthorized){
       next()
    }
    else{
       res.status(401).send("user not authorized")
    }
}
const userAuth = (req,res,next)=>{
    //logic to authorize user
   console.log("user auth is getting checked");
    
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(isAdminAuthorized){
       next()
    }
    else{
       res.status(401).send("user not authorized")
    }
}
module.exports = {adminAuth,userAuth};