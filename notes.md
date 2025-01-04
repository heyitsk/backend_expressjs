we have to create a sever (express server) so that it "listens" to the request from client side and listen on a port so that anyone can connect 

``` js
app.use((req,res)=>{
    res.send("hello from the server")
}) 
```
this function is called a response handler



```js
app.use("/",(req,res)=>{
    res.send("hello from the server")
})

app.use("/test",(req,res)=>{
    res.send("hello from test page")
})

app.use("/hello",(req,res)=>{
    res.send("hello from hello page")
}) 
```
if you use this order the issue is with .use method 
even if you change the port to /hello or /test it shows "hello from the server" bcz it reads any routes that start with "/" and show hello from the server  
also if you remove 1st handelerand  write /hello/abc it will show hello from hello page bcz this handler handeles anything after this route bcz it starts with /hello  
why?  
bcz .use matches the "/" first and  shows it in the hello and test port  
fix
1. .use-> .get  
app.use("/test") will match all method api calls to /test. ex /test/xyz 
app.get("/test") will only handle get call to /test
2. change the order. It matter bcz when theres a request on the serever it starts reading the code from the top first it checks if there is /test than /hello and then / so this will work file bcz above 2 don't match the 3rd as they have soem extraa infoa s well apart from just / so it will go to the 3rd one 




### Advanced hashing technique 
1. /ab?c -> means b is optional. abc will work and ac will work 
2. /ab+c -> means you can add b number of times. abc will work  and abbbbbbbbbbbbbbc will work
3. /ab*cd -> means you you can add anything btw ab and cd. abcd will work and abaskkjdaldalksdaskdadcd will work 
4. /a(bc)?d -> you can group like this means bc is optional
5. /a(bc)+d -> abcbcbcd will work 
YOU can write regex instead of strings 
6. /a/ -> means it will run anywhere a exists in the url like /a or /cap
7. /.*fly$/ -> means any url that ends with fly will run like /fly or /butterfly 


```js
app.get("/user",(req,res)=>{
    console.log(req.query); this is how you read what's sent 
    res.send({
        "firstname":"kushagra",
        "lastname":"agarwal"
    })

})
```
to make the routes dynamic like /user/101 
```js
app.get("/user/:userId",(req,res)=>{
    console.log(req.params); this will print { userId: '101' }
    
    
    res.send({
        "firstname":"kushagra",
        "lastname":"agarwal"
    })

})
```
Route path: /plantae/:genus.:species  
Request URL: http://localhost:3000/plantae/Prunus.persica



```js
app.get("/user",
    (req,res)=>{
    console.log("1st response");
    res.send("this is the first response")
    
    },
    (req,res)=>{
        console.log("2nd response");
        res.send("this is the 2nd response")
        
    }

) 
```
when you do this only 1st response will be logged and the postman get the this is the 1st respons
why? 
    bcz js is executed line by line and once the response is send by res.send("this is the first response") it does not proceed further 
    
```js
app.get("/user",
    (req,res)=>{
    console.log("1st response");
    },
    (req,res)=>{
        console.log("2nd response");
        res.send("this is the 2nd response")
    }
) 
```
this wont run  as well bcz it there is no response in the 1st handeler and you can not transfer the control to next handeler directly. for this you have to use next() which is passed as a parameter and it transferes the control to next handeler in case 1st handeler does not send any response 




```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
    res.send("this is the first response")
    next();
    },
    (req,res)=>{
        console.log("2nd handeler");
        res.send("this is the 2nd response")
    }
)
```
If the 1st handeler consist of sending a response it will show an error "Cannot set headers after they are sent to the client" this means that the 1st handeler has already sent a response and cannot send the response again 
Bcz a TCP connection is made btw a client and a server. Postman is the client and once the request is made and the response is sent the connection closes. here we are still trying to send a response even after the connection is lost that's why it shows this error 




```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
    next();
    res.send("this is the first response")
    },
    (req,res)=>{
        console.log("2nd handeler");
        res.send("this is the 2nd response")   
    }
)
```
this again shows that error "Cannot set headers after they are sent to the client".   
Why?  
 due to the js execution that it executess line by line. On encoutering the next() the control is sent to the 2nd handeler and the response is sent now the next leaves the execution context and the execution comes to line after next() which tries to send the response again 

```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
    // res.send("this is the first response")
    next();
    
    },
    (req,res,next)=>{
        console.log("2nd handeler");
        // res.send("this is the 2nd response")
        next()
        
    },
    (req,res,next)=>{
        console.log("3d handeler");
        // res.send("this is the 2nd response")
        next()
        
    },
    (req,res,next)=>{
        console.log("4th handeler");
        // res.send("this is the 4th response")
        next()
        
    }

)
```
this still shows error bcz when you used next() in tha 4th handeler it was expecting another handeler where you'll send the responsw but it doesn't exist that's why it shows the error "cannot get user"  


You can add handelers just like this or use arrays also and mix both of these methods as well 

```js
app.get("route",rh1,rh2,rh3,rh4)
app.get("route",[rh1,rh2,rh3,rh4])
app.get("route",[rh1,rh2],rh3,rh4)
```
They all give the same response