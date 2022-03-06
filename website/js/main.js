/* Global Variabels */
  /* Global variables for Icons section*/
const icons=document.getElementById("icons");  // icons section inside main 
const persecerptsIcon=document.getElementById("persecreptIcon"); // anchor|button for  going to persecrepts section exist in icons section

/*anchor|button for going to registerSec (persecreption form) section exists in icons section */
const registerIcon=document.getElementById("registerIcon"); 
  /********************************************************************* */

  /* Global variables for persecreptions section (persecrepts list)*/

const persecreptsList=document.getElementById("persecreptsList");  // ul that contain icons for registered persecrepts 
  /********************************************************************************************************************* */
 const backButtons=document.getElementsByClassName("back");

 /* Global variables for  persecreption form section  */
 const formsbuttons=document.getElementsByClassName("formbutton");
 let uploadImageButton=document.getElementById("uploadImageButon");
const registerSec=document.getElementById("registerSec");
const persecreptsSec=document.getElementById("persecreptsSec");
const PersecreptionForm=document.getElementById("registeringForm");//persecreption registeration form
const logoutbutton=document.getElementById("logout");
const logoutForm=document.getElementById("logoutForm");
let activeUser;
const imgback=document.getElementById("imgBackground");
const nodePort=9000;
const host=`http://127.0.0.1:${nodePort}/`;
imgback.src=`${host}img`;
/* object conatain sections of persecreption form 
 * persecreption form contain 6 sections here is 6 variables inside persecreptionInfo object
 * ech variable hold section points to it 
*/
let persecreptInfo={
    /*
    patientInfo:document.getElementById("patientInfo"), // patient onformatioon section 
    examinations:document.getElementById("examinations"), // examinatioon section
    */ 
    diagnosis:document.getElementById("diagnosis"),// diagnosis section
    /*
    drugs:document.getElementById("drugs"), //drugs section
    instructions:document.getElementById("instructions"),//instructions section
    signature:document.getElementById("signature")//signature section
    */
}

 /*
const patientAdd=document.getElementById("patientAddective");// div that contain adicctive diseases list ,it exxist in patientInfo section
*/
/*div that represent button for viewing addictive diseases list for selecting diseases from it 
 * it exists in addictiveDiseases div as direct child
 */
/*
const AddDiseasesButton=document.getElementById("AddictiveDisButton");
*/
/* navigation that contain addictive diseases list
 *it it represented with nav element and contain ul as addictivve diseases list
 */

//const AddDiseasesNav =document.getElementById("addDislist"); 
const registerButton=document.getElementById('rigesterButton');
  /************************************************************************************* */
const persecreptViewSec=document.getElementById("persecreptViewSec");
const persecreptView=document.getElementById("persecreptView");

/****************************************************************************************************************** */
const user=document.getElementById("user");
(async function(){

    await getUser( `${host}getUser`).then((resolve)=>{
        activeUser=resolve;
        user.innerText=`${activeUser.user}`;
    });
})();


logoutbutton.addEventListener("click",async function(e){
    e.preventDefault();
   await logoutAuthenticate( `${host}logoutAuthenticate`,activeUser).then(async resolve=>{
        if(resolve)
        { 
            console.log("logout process will began...");
            logoutForm.action=`${host}logout`;
               logoutForm.submit();
    //     let response=   await fetch("http://localhost:2000/logout");
      //   console.log(response);
        }
         

     //   logoutForm.submit();
        else
         alert("error while logout");
    });
    
})

persecerptsIcon.addEventListener("click",function(e){
    e.preventDefault();
    controller.viewing_persecrepts_list();
   // controller.update_persecreptions_List();                                      //  node server.js
});

registerIcon.addEventListener("click" , function(e){
    controller.viewing_persecreption_form();
});

(function returnTOMainPage()
{
     for(let index of backButtons)
     {
         index.addEventListener("click",function(e){
            controller.viewingIcons();

         })
     }
}());

(
    function addEventsToFormsButtons(){
        for(let element of formsbuttons)
         {
             element.addEventListener('click',function(e){
                 if(e.target.nodeName=="BUTTON")
                    controller.uploadForm( e.target.dataset.formtype );
                  uploadImageButton.value=null;
             })
         }
    }
)();

(function UploadImageEvent()
{
    uploadImageButton=document.getElementById("uploadImageButon");
    uploadImageButton.addEventListener('input',function(e){
        console.log("load success");
        controller.uploadForm(e.target.dataset.formtype);
        let image=document.getElementById("persecreptImage");
        image.src = URL.createObjectURL(e.target.files[e.target.files.length-1]);    
    })
})()
//UploadImageEvent();

/**************************************************************** */
class Presecreption{  
    static ids=[];
    static async createIdS(mod)
    {
        let id;
        id=Math.floor(Math.random()*99999);
        if(mod==2 && id%2!=0)
          id+=1;
        if(mod==1 && id%2==0)
         id+=1;
        let response;

        let oldIds;
        if(mod==2)
            await  getAllIds( `${host}getAllIdsImage`).then(resolve=>response=resolve);
        else
          await getAllIds(`${host}getAllIdsTexts`).then(resolve=>{console.log(resolve);response=resolve});

          if(response.done)
            oldIds=response.message;
         else
          {
              alert("error while fetching all ids     | "+ response.message);
              return ;
          }   
    
          for(let i=0; i<oldIds.length; i++)
           {
               if(id==oldIds[i].id)
                {
                    id=Math.floor(Math.random()*99999);
                    if(mod==2 && id%2!=0)
                      id+=1;
                    if(mod==1 && id%2==0)
                     id+=1;
                     i=-1;

                }
           }
           return id;
         
    }
    


}
class Presecreption2 extends Presecreption{
    constructor(/*patient_info*/diagnosis/*,signature*/)
    {
        super();
       // this.patient_info=patient_info;
        this.diagnosis=diagnosis;
       // this.signature=signature;
        this.id=  Presecreption.createIdS(1);
        this.formType="form2";
    };
}

class Presecreption3 extends Presecreption {
    constructor(image,signature)
    {
        super();
        this.diagnosis=image;
        this.signature=signature;
        this.id=Presecreption.createIdS(2);
        this.formType="form3";
    };
}
    

let Model={
    idsGetted:false,
    newIds:[],
    persecreptions:[],
    persecreptForms:{form2:`<section>
    <h2>degital Perscreption</h2>
</section>


<section id="diagnosis" class="diagnosis">
    <textarea id="diagnosisArea" rows="15" name="Diagnosis" placeholder="doctor diagnosis"></textarea>

</section>
<button  id="rigesterButton" data-formType="form2">Register</button>
`
,form3:`<h2>degital Perscreption</h2>
<img id="persecreptImage" accept="image/*"  width="100%">
<section id="signature" class="signature">
    <label>Doctor</label>
    <input id="doctorSignature" type="text" name="signature">
</section>
<button id="rigesterButton" data-formType="form3">Register</button>
`

}

};
let view={
  /*1*/  mainView:document.getElementById("mianView")
}
let controller={
 blobToImage2:function(blob){
     return new Promise(resolve=>{
        let reader=new FileReader();
        reader.readAsArrayBuffer(new Blob(blob.data,{type:"image/jpeg"}));
        reader.onload=()=>{
            var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(new Blob(blob.data,{type:"image/jpeg"}));
        let image=new Image();
        image.src=imageUrl;
        resolve(image);
        }        
     })
 } , 

    // view to model this function is called when submitting persecreption form
    createPrescrept:async function(prescrept)
    {
     let myId;
      await  prescrept.id.then(resolve=>myId=resolve);
      let resultPres=new FormData();
      resultPres.append('formType',prescrept.formType);
      resultPres.append('id',myId);
      resultPres.append('user',activeUser.user);
      resultPres.append('diagnosis',prescrept.diagnosis);
      return resultPres;

    }
    ,
    getPresecrept: function (formType)
    {
        return new Promise(async(resolve)=>{   
        let presecrept;
        if(formType=="form2")
           presecrept=  this.getPresecreptForm2();
       else if(formType=="form3")
            presecrept= this.getPresecreptForm3();
       let myresult;
       await this.createPrescrept(presecrept).then(resolve=>myresult=resolve);
       resolve( myresult);

        })  
    }
    ,

    getPresecreptForm2()
    {
        let diagnosis=this.persecreptData.getDiagnosis();
        return new Presecreption2(diagnosis);
    }
    ,
    getPresecreptForm3()
    {
        let signature=this.persecreptData.getSignature();
        let image=this.persecreptData.getImageFile();
        return new Presecreption3(image,signature);
    }
    ,
    uploadForm:function(formType)
    {
        console.log("imah there in uploadm form ....")
      PersecreptionForm.innerHTML=Model.persecreptForms[`${formType}`];
      if(formType=="form1")
         {     
           persecreptInfo={
           patientInfo:document.getElementById("patientInfo"), // patient onformatioon section 
           examinations:document.getElementById("examinations"), // examinatioon section 
           diagnosis:document.getElementById("diagnosis"),// diagnosis section
           drugs:document.getElementById("drugs"), //drugs section
           instructions:document.getElementById("instructions"),//instructions section
           signature:document.getElementById("signature")//signature section
           }
          // onhovering_on_addectiveDiseases(); 
           //onLeaving_addectiveDiseases();
        }
       else if(formType=="form2")
         {
             
           persecreptInfo={
            // patientInfo:document.getElementById("patientInfo"), // patient onformatioon section  
             diagnosis:document.getElementById("diagnosis"),// diagnosis section   
             //signature:document.getElementById("signature")//signature section
            }  
           /// onhovering_on_addectiveDiseases(); 
           // onLeaving_addectiveDiseases();
         }
       else if(formType=="form3")
         {
             persecreptInfo={
                 persecreptImage:document.getElementById("persecreptImage"),
                 signature:document.getElementById("signature")
             }
         }

         registerEvent();   
     }
    ,
    persecreptData:
    {
        getDiagnosis:function()
        {
            return persecreptInfo.diagnosis.querySelector("#diagnosisArea").value;

        }
       ,
        getSignature:function()
        {
            return persecreptInfo.signature.querySelector("#doctorSignature").value;

        }
        ,
        
        getImageFile:function()
        {
            return uploadImageButton.files[uploadImageButton.files.length-1];
           // return document.getElementById("persecreptImage");
        }
        
        
},


update_persecreptions_List:function()
{

    let persecrepts = persecreptsList.getElementsByTagName("li");
    let persLength = Model.persecreptions.length;
    if(persecrepts.length <persLength)
     {
         for(let i=persecrepts.length; i<persLength; i++)
          {
              let id=Model.persecreptions[i].id;
              persecreptsList.insertAdjacentHTML('afterbegin',`<li data-id=${id}> ${id}</li>`);
              persecreptsList.firstElementChild.addEventListener("click",function(e){
                  controller.create_persecrept_view(Model.persecreptions[i]);
                  controller.viewingPersecrept();
              })
          }
     }

},

viewing_persecrepts_list:async  function()
{
    persecreptsSec.style.cssText="display:flex;flex-direction: column;justify-content: center;  align-items: center;"
    registerSec.style.display="none";
    icons.style.display="none";
    persecreptViewSec.style.display="none";
   let ids=[];
   if(Model.idsGetted)
      ids=Model.newIds;
   else
     {
        Model.idsGetted=true;

    let response=getPresecreptionsIds(`${host}getPresecreptionsIds`,activeUser);
        
    await response.then((res)=>{
        if(res.done==true && res.presecreptsExistence==true)   
          ids=res.message;
       else
         alert(res.message);  
    })
    } 
    if(activeUser.adminMode)
    {
        for(let i=0; i<ids.length; i++)
        {
            persecreptsList.insertAdjacentHTML('afterbegin',`<li id=${ids[i].id} data-id=${ids[i].id}> <strong>${ids[i].id}</strong><strong>${ids[i].user}</strong></li>`);     
            let id=ids[i].id;
            persecreptsList.firstElementChild.addEventListener("click", async function(e){
                     let response= getPrescreptData(`${host}gpt`,{id:id});
                     await  response.then(async presecrept=>{
                        let imageBlob;
                        if(presecrept.message.id%2==0)
                           await getImageFile( `${host}getImageFile`).then(resolve=>imageBlob=resolve);
                         
                           if(presecrept.done==true)
                          {                          
                           controller.create_persecrept_view(presecrept.message,imageBlob);
                           controller.viewingPersecrept();
                           document.getElementById("remove").addEventListener("click",function(){
                            /**removing id  */
                            getPrescreptData(`${host}removeId`,{id:id}).then(resolve=>{
                                if(resolve.done)
                                {
                                    persecreptsList.removeChild(document.getElementById(id));
                                    alert(` prescreption with id = ${id}  removed successfully ...`);
                                }
                                else
                                   alert(resolve.message);  
                             })
                        })
                          }
                          else
                            alert(presecrept.message);
                        });              
                       })
        }

    }
    else
    {
        for(let i=0; i<ids.length; i++)
        {
            persecreptsList.insertAdjacentHTML('afterbegin',`<li id=${ids[i].id} data-id=${ids[i].id}> ${ids[i].id}</li>`);
            let id=ids[i].id;

                  persecreptsList.firstElementChild.addEventListener("click", async function(e){
                    let response= getPrescreptData(`${host}gpt`,{id:id});
                  await  response.then(async presecrept=>{
                    let imageBlob;
                    if(presecrept.message.id%2==0)
                        await getImageFile(`${host}getImageFile`).then(resolve=>imageBlob=resolve);                   
                    if(presecrept.done==true)
                      {                          
                       controller.create_persecrept_view(presecrept.message,imageBlob);
                       controller.viewingPersecrept();
                       document.getElementById("remove").addEventListener("click",function(e){
                        /**removing id  */
                       let but= document.getElementById("remove") ;
                        but.disabled=true;
                        getPrescreptData(`${host}removeId`,{id:id}).then(resolve=>{
                            if(resolve.done)
                            {
                                persecreptsList.removeChild(document.getElementById(id));
                                alert(` prescreption with id = ${id}  removed successfully ...`);
                            }
                            else
                            {
                                alert(resolve.message);
                                but.disabled=false;
                            }
                                 

                         })
                    })
                                              
                      }
                      else
                        alert(presecrept.message);

                    });  
                  })
        }

    }

    ids=[];
    Model.newIds=[];

},
viewingIcons:function()
{
    persecreptsSec.style.display="none";
    registerSec.style.display="none";
    persecreptViewSec.style.display="none";
    icons.style.display="flex";
},
viewing_persecreption_form:function()
{
    persecreptsSec.style.display="none";
    icons.style.display="none";
    persecreptViewSec.style.display="none";
    registerSec.style.display="block";
    this.uploadForm("form2");
},


/** getting object from persecreptions array bases on id passsed to function */
getPersecrept:function(id)
{
    let persecreptions=Model.persecreptions;
    for(let i=0; i<persecreptions.length; i++)
     {
         if(persecreptions[i].id==id)
           return persecreptions[i];
     }

     return Error("id not found");
}
,
/** create section that represent one persecrept */
create_persecrept_view:function(persecrept,imageBlob)
{
     if(persecrept.id %2!=0)
      this.BuildPersecreptView2(persecrept);
    else 
      this.BuildPersecreptView3(persecrept,imageBlob);    
}
,
BuildPersecreptView1:function(persecrept)
{
    let addDiseases=persecrept.patient_info.AddictiveDiseases;
    let diseases="";
    for(let i=0;i<addDiseases.length; i++)
        diseases+= `<li>${addDiseases[i]}</li>`;

    let drugs=persecrept.drugs;
    let drugsElements="";
    for(let i=0; i<drugs.length; i++)
      drugsElements+=`<li><div>${drugs[i][0]}</div><div>${drugs[i][1]}</div><div>${drugs[i][2]}</div></li>`
    
    persecreptView.innerHTML=
    `
    <h2>d${persecrept.id}</h2>
    <div class="line"></div>
    <h2>Patient Information</h2>
    <section id="Pv_patientInfo" class=patientInfo>
        <div class="patientName">
            <label>Name</label>
            <strong>${persecrept.patient_info.patientName}</strong>
        </div>
        <div class=" patientAge">
            <label>Age</label>
            <strong>${persecrept.patient_info.patientAge}</strong>
        </div>
        <div id="pv_patientAddective" >
            <label>Addictive Diseases</label>
            <ul>
            ${diseases}
            </ul>                                 
        </div>
    </section>
    <div class="midline"></div>
    <h2>Examinations</h2>
    <section id="pv_examinations" class="examinations">
        <div>
            <label>Blood Pressure</label>
            <strong>${persecrept.examinations.bloodPressure}</strong>
        </div>
        <div>
            <label>Diabetes</label>
            <strong>${persecrept.examinations.diabetes}</strong>
        </div>
        <div>
            <label>pulse Rate</label>
            <strong>${persecrept.examinations.pulseRate}</strong>
        </div>
    </section>
    <div class="midline"></div>

    <h2>Diagnosis</h2>
    <section id="pv_diagnosis" class="diagnosis">
        <strong>${persecrept.diagnosis}</strong>
    </section>
    <div class="midline"></div>

    <h2>Drugs</h2>
    <section id="pv_drugs" class="drugs">
        <ul>
            <li><label>Drug Name</label><label>all Dosage</label><label>Dosage_Per_day</label></li>
            ${drugsElements}
        </ul>
    </section>
    <div class="midline"></div>

    <h2>Instructions</h2>
    <section id="pv_instructions" class="instructions">
        <strong>${persecrept.instructions}</strong>
    </section>
    <div class="midline"></div>

    <h2>Signature</h2>
    <section id="pv_signature" class="signature">
        <label>Doctor : </label>
        <strong>${persecrept.signature}</strong>
    </section>
    `
},
BuildPersecreptView2:function(persecrept)
{
    persecreptView.innerHTML=`
    <button id="remove">remove</button>
    <h2>d${persecrept.id}</h2>
    <div class="line"></div>
 
    <h2>Diagnosis</h2>
    <section id="pv_diagnosis" class="diagnosis">
        <strong>${persecrept.diagnosis}</strong>
    </section>
    <div class="midline"></div>
    </section>
    `
},
BuildPersecreptView3:async function(persecrept,imageBlob)
{
    persecreptView.innerHTML=`
    <button id="remove">remove</button>
    <h2>d${persecrept.id}</h2>
    <section id="pv_signature" class="signature">
</section>

    `;
 let reader=new FileReader();
 reader.onload=()=>
 {
     let image=new Image();
     image.src=reader.result;
     image.style.cssText="width:100%";
     persecreptView.appendChild(image);

 }

 reader.readAsDataURL(imageBlob);
},
viewingPersecrept:function()
{
    persecreptsSec.style.display="none";
    registerSec.style.display="none";
    icons.style.display="none";
    persecreptViewSec.style.cssText="display:block;position:absolute; z-index:9";

}



}

 function registerEvent()
{
let registerButton=document.getElementById("rigesterButton");    
registerButton.addEventListener("click", async function(e){
    e.target.style.display="none";
    registerButton.Enabled=false;
    e.preventDefault();
    let formType=e.target.dataset.formtype;
    let presecrept
     await controller.getPresecrept(formType).then(
      async   resolve1=>{
    let response=registerPresecrept(`${host}registerPresecreption`,resolve1);
    await response.then((resolve2)=>{
        if(resolve2.done==true)
         {
             if(Model.idsGetted)
              Model.newIds.push({id:resolve1.get("id"),user:resolve1.get("user")});
         }
        alert(resolve2.message);
        registerButton.Enabled=true;
    });

         }
     );

     e.target.style.display="block";

    });

};
registerEvent();
//onhovering_on_addectiveDiseases();
//onLeaving_addectiveDiseases();
//controller.regesiterPersecreption();



/** persecreptView */



/**************  12/12/2021************* */
async function getUser(url)
{
    try
    {
        const response= await fetch(url);

        try
        {
            const myUser=response.json();
            console.log(myUser);
            return myUser;
        }
        catch(error)
        {
            throw error
        }

    } 
    catch(err)
    {
        throw err;
    }
};



//*****12/12/2021 */ 
async function getPresecreptionsIds(url,loginUser){
    try
    {
        response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            //mode: 'no-cors', // no-cors, *cors, same-origin
           // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
           // redirect: 'follow', // manual, *follow, error
           // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(loginUser) // body data type must match "Content-Type" header
          });
         try
         {
             let myPresecreptions=response.json();
             return myPresecreptions;
         }
         catch(error)
         {
             throw error;
         } 

    }
    catch(error)
    {
        throw error;

    }
}

async function registerPresecrept(url,Data){
    try
    {
        let response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
          //  mode: 'no-cors', // no-cors, *cors, same-origin
           // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit

            /*
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            */
           // redirect: 'follow', // manual, *follow, error
           // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: Data // body data type must match "Content-Type" header
          });
         try
         {
             let myresponse=response.json();

             return myresponse;
         }
         catch(error)
         {
             throw error;
         } 

    }
    catch(error)
    {
        throw error;

    }
}


async  function getPrescreptData(url,id)
{
    try
    {
        let response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
           // mode: 'no-cors', // no-cors, *cors, same-origin
           // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
           // redirect: 'follow', // manual, *follow, error
           // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(id) // body data type must match "Content-Type" header
          });
         try
         {
             let myresponse=response.json();
             return myresponse;
         }
         catch(error)
         {
             throw error;
         } 

    }
    catch(error)
    {
        throw error;

    }


}

async function getAllIds(url)
{
    try
    {
        let response=await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
           // cache: 'reload', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            //headers: {
              //'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            //},
           // redirect: 'follow', // manual, *follow, error
          //  referrerPolicy: 'no-referrer',
               // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          
          //loginForm.action="http://localhost:2000/login";
          }
        );
        try
        {
            return await response.json();
        }
        catch(error)
        {
            throw error;
        }
    }
    catch(error)
    {
        throw error;
    }

}


async function getImageFile(url)
{
    try
    {
        let response= await fetch(url);
        return response.blob();

    }
    catch(error)
    {
        console.log(error);

    }

 
}


async function logoutAuthenticate(url,user)
{
  try
  {
    
  let response=await fetch(url,{    method:"POST",
  mode:"cors",
  credentials:"same-origin",
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: JSON.stringify(user)

});
return await response.json();


  }
  catch(error)
  {
    throw error;
  }
}


async function logout(e)
{
    e.preventDefault();
    logoutAuthenticate("http://localhost:2000/logoutAuthenticate",activeUser).then(resolve=>{
        if(resolve)
        logoutForm.submit();
        else
         alert("error while logout");
    });
    await fetch("http://localhost:2000/logout");
}


/******************************************************************** */
