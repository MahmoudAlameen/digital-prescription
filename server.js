const express=require("express");
const cors=require('cors');
const app=express();
const parser=require("body-parser");
const mysql=require("mysql");
const { report } = require("process");
const { response } = require("express");
const { errorMonitor } = require("events");
const multer=require("multer");
const buffer=require("buffer");
let fileBuffer;  // this  variable will hold  buffer of the image retrieved from database before sending it to client side
const authenticatId={id:29909252500232,password:29909252500232};
let activeUsers=[];
// setting app
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(cors());
app.use(express.static('website'));
let connecting=()=>{
    
 return mysql.createConnection({
    host: "mysql-70418-0.cloudclusters.net",
    port:11165,
    database:"doctorApp",
    user:"admin",
    password:"cBTecMAP"
});
};
let con=connecting();
//console.log(con);

app.get("/img",function(req,res){
   // res.send("hello world");
    res.sendFile(__dirname+"/website/backgrounds/background2.jfif");
})

/********************************** */
// creae nodejs server
const nodePort=process.env.PORT ||9000
app.listen(nodePort,listening(nodePort));
let acounts=[];
function listening(nodePort)
{
    console.log(`running on port ${nodePort}`);
    app.get("/",function(req,res){
        res.sendFile(__dirname+"/website/login.html");     
    })
}
/****************************** */

// create acount service 
app.post("/createAcount", async function(req,res){
     con=connecting();
   try
   {
       
 await   promiseConnect().then(
        (resolve)=>{
            createAcountPromise(req.body).then((resolve)=>{
        res.send({message:resolve});
     },(reject)=>{res.send({message:reject})})
    },(reject)=>{
        res.send({message:reject});
    });

   }

    catch(error)
    {
        throw error;

    }
    con.end((err)=>{
        if(err)
         console.log("error while disconnecting");
        else
         console.log("disconnecting succeeded"); 
    })
});

let promiseConnect=()=>{ return new Promise((resolve,reject)=>{
     
    if(con.state!="disconnected")
      resolve("connected");
     else
     {
         con=connecting();
        con.connect((err)=>{
            if(err)
                reject(`this is err message ${err.message}`);
             else
                resolve("connection succeeded");
        });
     }
})
};

let createAcountPromise=(acount)=>{
    let myquery; 
    if(acount.adminMode)
      myquery=`insert into adminAcounts values(\'${acount.firstName}\',\'${acount.lastName}\',\'${acount.userName}\',\'${acount.email}\',\'${acount.password}\')`;
    else
      myquery=`insert into usersAcounts values(\'${acount.firstName}\',\'${acount.lastName}\',\'${acount.userName}\',\'${acount.email}\',\'${acount.password}\')`;
    return new Promise((resolve,reject)=>{
        con.query(myquery,function(err)
    {
        if(err)
          reject(err.message);
        else
          resolve("acount registered successfully ...");
    });

})
};

/******************** */
app.post("/authenticateLogin", async function(req,res){
    console.log("authenticate login process started...");
    let acount=req.body;
    let response;
    promiseConnect().then((resolve)=>{
        try
            {
                checkAcountsPromise(acount).then(
                (resolve)=>{
                          if(resolve.length==0)
                           response={message:resolve,done:true,acountExists:false};
                         else
                         {
                           response={message:resolve,done:true, acountExists:true};
                           //logeduser={admin:false,user:resolve[0].userName};
                           activeUsers.push({user:resolve[0].userName,ck:false,adminMode:acount.adminMode});
                         }
                         res.send(response);
                         },
                (reject)=>{
                           response={message:reject,done:false}
                           res.send(response);
                          }
            ); 

            }
            catch(error)
            {
                throw error;
            }
     

        }
        
     
            
        
      ,(reject)=>{
        response={message:reject,done:false}
        res.send(response);
    })
});

app.get("/loginTOSystem",function(req,res){
  console.log("login to system processs started ...");
  res.sendFile(__dirname+"/website/main.html");
})

let checkAcountsPromise=(acount)=>
{
    console.log("this acount loged in  ",acount);
    let myquery;
    if(acount.adminMode)
      myquery=`select * from adminAcounts where userName=\'${acount.userName}\' and password=\'${acount.password}\' `;
    else   
      myquery=`select * from usersAcounts where userName=\'${acount.userName}\' and password=\'${acount.password}\' `    
    return new Promise((resolve,reject)=>{
        con.query(myquery,(err,result)=>{
            if(err)
              reject(err.message);
            else
            {
                resolve(result);                   
            }
        });
    });
}
/***************************** */
app.get("/getUser",function(req,res){
    console.log("getUser process started ....");
    res.send(activeUsers[activeUsers.length-1]);

});
/******************* */

app.post("/getPresecreptionsIds",async function(req,res){
    let myUser=req.body;
    let response;
    try
    {
         await promiseConnect().then(
           async (resolve)=>
            {
                try
                {
                    await getPresecreptionsIds(myUser).then(
                        (resolve)=>
                        {
                            if(resolve.length==0)
                              response={message:"you does not  register any presecreptions yet",done:true,presecreptsExistence:false};
                            else
                              response={message:resolve,done:true,presecreptsExistence:true};
    
                        },
                        (reject)=>
                        {
                            response={message:reject,done:false};
                        }
                    )

                }
                catch(error)
                {
                    throw error;
                }

 

            },
            (reject)=>
            {
                response={message:reject,done:false};
            });

            res.send(response);

    }
    catch(error)
    {
        throw error;
    }
});

let getPresecreptionsIds=(myUser)=>
{
    let myquery;
    if(myUser.adminMode)
      myquery= "SELECT  id,user  FROM PsText   UNION  SELECT id,user  FROM PsImage";
    else
      myquery=`SELECT id  FROM PsText WHERE user=\'${myUser.user}\' UNION  SELECT id  FROM PsImage WHERE user=\'${myUser.user}\'`;
    
    return queryingPromise(myquery);

}

const upload=multer({storage:multer.memoryStorage()});
app.post("/registerPresecreption",upload.single("diagnosis"),async function(req,res){
    console.log("starting registerPrescreption process ---");
    if(!req.body)
        res.send({message:"body of the  request is empty",done:false}); 
    let pres=req.body;
     if(req.file)
        pres.diagnosis=req.file.buffer.toString("base64");
   let response;
    try
    {
        await promiseConnect().then(
            async (resolve)=>
            {
               try
               {
                await registerPresecreption(pres).then(
                    (resolve)=>
                    {
                        response={message:"presecreption registered successfully",done:true};
                    },
                    (reject)=>
                    {
                        response={message:reject,done:false};
                    }
                );

               }
               catch(error)
                {
                    throw error;
                }

            },
            (reject)=>
            {
                response={message:reject,done:false};

            }
        )

        res.send(response);


    }
    catch(error)
    {
        throw error;

    }

})

registerPresecreption=(presecreption)=>
{
    let myquery;
    if(presecreption.formType=="form2")
     myquery=`insert into PsText values(\'${presecreption.id}\',\'${presecreption.diagnosis}\',\'${presecreption.user}\')`;
    else if(presecreption.formType=="form3")
     myquery= `insert into PsImage values(\'${presecreption.id}\',\'${presecreption.diagnosis}\',\'${presecreption.user}\')`;
    return queryingPromise(myquery);
}

app.get("/getImageFile",function(req,res){
    res.send(fileBuffer);
})

app.post("/gpt",async function(req,res){
let id=req.body.id;
let response;

try
{
    await promiseConnect().then(
      async  (resolve)=>
        {
            try
            {
                await getPresecreptData(id).then(
                    (resolve)=>
                    {
                        if(resolve[0].id%2==0)
                        {
                            let buf=resolve[0].diagnosis;
                            let string=buf.toString("binary");
                            fileBuffer=buffer.Buffer.from(string,"base64");
                            resolve[0].diagnosis="";
                        }
                        response={message:resolve[0],done:true};
                    },
                    (reject)=>
                    {
                        response={message:reject,done:false};
                    }
                )

            }
            catch(error)
            {
                throw error;
            }

        },
        (reject)=>
        {
            response={message:reject,done:false};
        }
    )
    res.send(response);


}
catch(error)
{
    throw error;
}

});
getPresecreptData=(id)=>
{
    let query;
    if(id%2==0)
     query=`select * from PsImage where id=\'${id}\'`;
    else
     query=`select * from PsText where id=\'${id}\'`;

    return queryingPromise(query);  
}

queryingPromise=(query)=>
{
    return new Promise((resolve,reject)=>{
        con.query(query,(err,result)=>{
            if(err)
             reject(err.message);
            else
            {
                resolve(result);

            }
               
        })
    });

}

app.get("/getAllIdsTexts",async function(req,res){
    let query=`select id from PsText`;
    let response;
    await promiseConnect().then(
      async  resolve=>
        {
            await queryingPromise(query).then(
                resolve=>
                {
                    response={message:resolve,done:true};

                },
                reject=>
                {
                    response={message:reject,done:false};
                }
            )

        },
        reject=>
        {
            response={message:reject,done:false};

        }
    )

    res.send(response);
});


app.get("/getAllIdsImage",async function(req,res){
    let query=`select id from PsImage`;
    let response;
    try
    {
        await promiseConnect().then(
          async  resolve=>
            {
                await queryingPromise(query).then(
                    resolve=>
                    {
                        response={message:resolve,done:true};
    
                    },
                    reject=>
                    {
                        response={message:reject,done:false};
                    }
                )
    
            },
            reject=>
            {
                response={message:reject,done:false};
    
            }
        )

    }
    catch(error)
    {
        throw error;
    }
    res.send(response);
})



/************************************************************ */
app.post("/logoutAuthenticate",function(req,res){
    console.log("logout authenticate process started ....");
    let myuser=req.body;
    res.send(removeActiveUser(myuser));
})
app.get("/logout",function(req,res){
    console.log("logout process...");
    res.sendFile(__dirname+"/website/login.html");
})


removeActiveUser=(myuser)=>
{
    for(let i=0; i<activeUsers.length; i++)
    {
        if(myuser.user==activeUsers[i].user)
        {
            let temp=activeUsers[i];
            activeUsers[i]=activeUsers[activeUsers.length-1];
            activeUsers[activeUsers.length-1]=temp;
            activeUsers.pop();
            return true;
        }
    }
    return false;
}

app.post("/authenticatId",function(req,res){
    console.log("authenticate Id precess started ....");
    if(authenticatId.id==req.body.id && authenticatId.password==req.body.password)
       res.send({authenticate:true});
    else
       res.send({authenticate:false});
})

app.post("/removeId",async function(req,res){
    console.log("removing process started ...");
    let id= req.body.id;
    let imagesTable="PsImage";
    let textTable="PsText";
    let query=`DELETE FROM ${id%2==0?imagesTable: textTable} WHERE id=${id}`;
    let response="";
    await promiseConnect().then(
        async  resolve=>
          {
              try{
                await queryingPromise(query).then(
                    resolve=>
                    {
                        response={message:resolve,done:true};
    
                    },
                    reject=>
                    {
                        response={message:reject,done:false};
                    }
                )
    

              }
              catch(error)
              {
                  console.log("error",error);
              }

          },
          reject=>
          {
              response={message:reject,done:false};
  
          }

      )
      res.send(response);

})


