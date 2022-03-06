const loginForm=document.getElementById("login");
const createAcountForm=document.getElementById("createAcount");
const loginButton=document.getElementById("submmitLogin");
const AcountButton=document.getElementById("submmitAcount");
const adminModeSec=document.getElementById("AdminModeSec");
const adminButton=document.querySelector("#adminButton");
const adminID=document.getElementById("adminId");
const passwordId=document.getElementById("passwordId");
const submitId=document.getElementById("submitId");
const overlay=document.getElementById("overlay");
const exitAuthenticationButton=document.getElementById("exitAuthentication");
let adminMode=false;
let logedUser;
//const nodePort=process.env.PORT || 2000;
const nodePort=9000;
const host=`http://127.0.0.1:${nodePort}/`;
adminButton.addEventListener("click",function(e){
  if(adminMode)
   switchUserMode();
  else
   openAdminModeForm(); 
});
submitId.addEventListener("click",function(e){
  e.preventDefault();
  let id=adminID.value.trim();
  let password=passwordId.value.trim();
  postLoginData(`${host}authenticatId`,{id:id,password:password}).then(resolve=>{
    if(resolve.authenticate)
    {
      closeAdminModeForm();
      switchAdminMode();
    }
    else
    {
      adminID.value="";
      passwordId.value="";
      alert("id or password is invalid");
    }
  })
});

exitAuthenticationButton.addEventListener("click",function(e){
  e.preventDefault();
  closeAdminModeForm();
})


AcountButton.addEventListener("click",function(e)
{
  e.preventDefault();
  /*connectToDatabase();*/
  let acountData=getAcountData();
  if(!checkAcount(acountData))
   {     
    alert(checkAcountMethods.invalidMessage);
   }
  else
    {
      acountData.adminMode=adminMode;
      let res=postAcount(`${host}createAcount`,acountData);
      if(typeof res == String)
         alert(res);
      else
       {
         res.then(function(myResponse){
         alert(myResponse.message);
          clearAcountForm();
         })
       }
    }
});

function checkLogin(loginData)
{
  loginData.userName=loginData.userName.trim();
  loginData.password=loginData.password.trim();
  if(loginData.userName=="" || loginData.password=="")
   return false;
  else
    return true; 
}

loginButton.addEventListener("click", async function(e){
  e.preventDefault();
  let loginData=getLoginData();
   if(!checkLogin(loginData))
   {
    alert("please enter user name and password to login to application");
    clearLoginForm();
   }
   else
   {
     
   loginData.adminMode=adminMode;    
    const res=postLoginData(`${host}authenticateLogin`,loginData);
   await res.then(async(res)=>{
     if(typeof res === String)
        alert(res);
     if(res.done)
      {
        if(res.acountExists)
        {
          loginForm.action=`${host}loginTOSystem`;
          loginForm.submit();
          //await fetch("http://localhost:2000/loginTOSystem");
          //loginTOSystem("http://localhost:2000/loginTOSystem")
          //logedUser=res.message[0].userName;
          //module.export.logedUser=logedUser;
        }
        else
          alert("acount does not exists ...");  
      }
      else
       {
         if(res.message)
           alert(res.message);
       }
    });
   }  
});

async function postAcount(url='',data)
{
  let response;
  let mydata;
  try{
      response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
     // redirect: 'follow', // manual, *follow, error
     // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

  }
  catch(Error)
  {
    alert("error while feching data",Error);
    return `Error while fetching response message : ${Error}`;
  }
  try{
    if(response.ok)
       mydata=response.json();
     
     else
        alert( "Error in response Message");
  }
  catch(Error)
  {
    console.log("error in jisoning",Error);
    alert (`Error in jsoning returned object : ${Error}`);
  }
    
     return  mydata;
}

async function postLoginData(url='',loginData)
{
try{
  const response= await fetch(url,{
    method:"POST",
    mode:"cors",
    credentials:"same-origin",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(loginData)

  });
  try{
    const myLogData=response.json();
    return myLogData;
  }
  catch(Error){
    alert( `error accured while jisoning data , error in recieved data .... " , ${Error}`);
  }

}

catch(Error){
  alert( `error while fetching data  , may be  aproblem in the server....,${Error}`);

}

}



function getAcountData()
{
  let inputs=createAcountForm.getElementsByTagName("input");
  let values=[];
  for(let input of inputs)
   {
     values.push(input.value);
   }
   let obj={};
   obj.firstName=values[0];
   obj.lastName=values[1];
   obj.userName=values[2];
   obj.email=values[3];
   obj.password=values[4];
   return obj;
};
function getLoginData(){
  let userName=document.getElementById("user").value;
  let password=document.getElementById("pass").value;
    return {userName,password};

}

async function loginTOSystem(url)
{
  try{
    const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'reload', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    //headers: {
      //'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    //},
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
       // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  
  //loginForm.action="http://localhost:2000/login";
  }
);

  }
  catch(error)
  {
    alert( error);
  }

};
function  clearAcountForm()
{
  let inputs=createAcountForm.getElementsByTagName("input");
  for(let i=0;  i<inputs.length-1; i++)
    {
      inputs[i].value="";
    }
}
function clearLoginForm()
{
  let inputs=loginForm.getElementsByTagName("input");
  for(let i=0; i<inputs.length-1; i++)
    {
      inputs[i].value="";
    }
}
function checkAcount(acount){
  acount.firstName=acount.firstName.trim();
  if(acount.firstName=="")
   {
    checkAcountMethods.invalidMessage="please enter first name";
    return false;
   }
  acount.lastName=acount.lastName.trim();
  if(acount.lastName=="")
    {
      checkAcountMethods.invalidMessage="please enter last name";
      return false;
    }
  acount.userName=acount.userName.trim();
  if(acount.userName=="")
    {
      checkAcountMethods.invalidMessage="please enter user name";
      return false;
    }
  acount.email=acount.email.trim();
  if(acount.email=="")
    {
      checkAcountMethods.invalidMessage="please enter Email";
      return false;
    }
  acount.password=acount.password.trim();  
  if(acount.password=="")
    {
      checkAcountMethods.invalidMessage="please enter password";
    }        
  if( checkAcountMethods.checkName(acount.firstName) && checkAcountMethods.checkName(acount.lastName) &&
      checkAcountMethods.checkUserName(acount.userName) && checkAcountMethods.checkEmail(acount.email) &&
      checkAcountMethods.checkPassword(acount.password))
     return true;
  else 
     return false;   
}
let checkAcountMethods=
{
  invalidMessage:"",
  checkName:(Name)=>{
    for(let char of Name)
     {
       if(char==" ")
        {
          checkAcountMethods.invalidMessage="first name or last name must not has any spaces";
        //  console.log(invalidMessage);
          return false;
        }
     }
    var letters = /^[A-Za-z]+$/;
    if(Name.match(letters))
      return true;
    else
      {
        checkAcountMethods.invalidMessage="first name or last name must contain letters only";
        return false;  
      }

  },
  checkUserName:(userName)=>{
    for(let char of userName)
     {
       if(char==" ")
        {
          checkAcountMethods.invalidMessage="invalid user name  , user name  must contain no spaces";
          return false;
        }
      
     }
    
     var usernameRegex = /^[a-zA-Z0-9]+$/;
     if(userName.match(usernameRegex))
     return true;
    else
      {
        checkAcountMethods.invalidMessage="invalid user name";
      }
      return false; 
  },
  checkEmail:(email)=>{
    for(let char of email)
    {
      if(char==" ")
       {
        checkAcountMethods.invalidMessage="invalid email";
         return false;
       }
       
    }
    var validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(validEmailRegex))
     return true;
    else
     {
      checkAcountMethods.invalidMessage="invalid email";
      return false;
     }


  },

  checkPassword:(password)=>{
    for(let char of password)
    {
      if(char==" ")
       {
        checkAcountMethods.invalidMessage="invalid password , password must contain no spaces";
         return false;
       }
    }
    return true;

  }

}



function connectToDatabase()
{
  c1.con1.connect(function(err) {
    if (err) console.log( err);
    else
    console.log("Connected!");
  });
};
let openAdminModeForm=()=>
{
  adminModeSec.style.display="block";
  overlay.style.cssText="height:120%";

}
let closeAdminModeForm=()=>{
  adminModeSec.style.display="none";
  overlay.style.cssText="height:0%";
}
let switchAdminMode=()=>{

  /************************************ */

  /****************************************** */
  loginButton.value="Login As Admin";
  adminButton.innerText="switch user mode";
  adminMode=true;


}
let switchUserMode=()=>{
  loginButton.value="Login";
  adminButton.innerText="switch admin mode";
  adminMode=false;

}


