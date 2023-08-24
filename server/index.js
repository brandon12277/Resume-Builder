
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const database = require('./userController');
const db = require('./db');
const shortid = require('shortid');


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port=3000
// Registration route







app.post('/register', (req, res) => {
  const {name, username, email,phone,password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  database.RegisterUser([name,username, email,phone,hashedPassword], (error) => {
    if (error) {
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.redirect('http://localhost:3001/login');
  });


});

// Login route
app.post('/login', (req, res) => {
  console.log("yes")
  const userDetails = req.body;
  console.log(userDetails)
  database.AuthenticateUser([userDetails.username], (error, results) => {
    if (error || results.length === 0 || !bcrypt.compareSync(userDetails.password, results[0].password)) {
      
     return res.send(error)
    }
  // Create a JWT token
    
    const token = jwt.sign({ userId: results[0].id}, secretKey);
    res.json({ token });
    
    
  });
});






app.post("/addResume",(req,res)=>{
  const token = req.body.token;
  if (!token) {
    console.log("yo")
   return "no token"
  }

  try {
   
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId; 
    const uniqueShortID = generateUniqueNumericID()
    console.log(uniqueShortID)
    console.log(userId)
    database.AddResume([uniqueShortID,userId],(error,results)=>{
      if (error) {
        return error
      }
      res.json({"userId":userId,"resumeId":uniqueShortID})
      return results
      
    })
  } catch (error) {
    return error
  }
 
  
})
// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
 


  const token = req.headers.authorization;

  if (!token) {
    res.redirect("http://localhost:3001/login")
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    console.log("hi",userId) // Extract the user ID from the token payload
    const userData={}
    // Proceed with your protected route logic here, e.g., fetching user data
    // You can use the userId to identify the user and perform operations accordingly

    database.FetchUserDataAndResumeId([userId],
      
      (error,results)=>{
      if (error || results.length === 0) {
         return res.status(401).json({ error: 'Invalid USER' });
      }
      else{
        console.log("fetched user")
        userData["user"]=results[0]
        console.log(userData)
      }
    }, (error,results)=>{
      if (error) {
        return res.status(401).json({ error: 'Invalid USER' });
     }
     else{
      console.log("fetched resume")
       userData["resumes"]=results
       console.log(userData)
       res.send(userData)
     }
    })


   

    
  } catch (error) {
    console.log("redirect to login")
    res.redirect("http://localhost:3001/login")
  }
    
  
 
   
  
});



app.get("/resumedata",(req,res)=>{
  const token = req.headers.authorization;
   const resumeId=  req.query.resumeId;
  if (!token) {
    res.status(401).json({ error: 'Invalid USER' });
  }
  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    const ResumeData={}
    
    
    database.FetchResumeDataOfUser([resumeId],
      (error,results)=>{
       
        if (error || results.length === 0) {
         
          console.log(results)
         return res.status(401).json({ error: 'Invalid USER' });
       }
       
           ResumeData["personal_info"]=results[0]
      },
      (error,results)=>{
        
        if (error) {
          return res.status(401).json({ error: 'Invalid USER' });
       }
        ResumeData["experience_info"]=results
   },
   (error,results)=>{
    
    if (error) {
      return res.status(401).json({ error: 'Invalid USER' });
   }
    ResumeData["skills_info"]=results
},
(error,results)=>{
 
  if (error) {
    return res.status(401).json({ error: 'Invalid USER' });
 }
 else{
  
  ResumeData["education_info"]=results
  return res.send(ResumeData)
 }
  
}
      )
    

  } catch (error) {
    console.log("redirect to login")
    res.status(401).json({ error: 'Invalid USER' });
  }



  
   
})


app.get("/resumeTemplateSet",(req,res)=>{
  const token = req.headers.authorization;
  const resumeId=  req.query.resumeId;
 if (!token) {
   res.status(401).json({ error: 'Invalid USER' });
 }
 try {
   // Verify the token using your secret key
   const decoded = jwt.verify(token, secretKey);
   const userId = decoded.userId;
   const ResumeData={}
   
   console.log("resume id",resumeId)
   console.log("in")
   database.FetchResumeDataOfUser([resumeId],
     (error,results)=>{
      
       if (error || results.length === 0) {
         console.log("in 1")
         console.log(results)
       
      }
      
          ResumeData["personal_info"]=results[0]
     },
     (error,results)=>{
       console.log("in 2")
       if (error) {
        
      }
       ResumeData["experience_info"]=results
  },
  (error,results)=>{
   console.log("in 3")
   if (error) {
     
  }
   ResumeData["skills_info"]=results
},
(error,results)=>{
 console.log("in 4")
 if (error) {
  
}
else{
 console.log("in 5")
 ResumeData["education_info"]=results
 return res.send(ResumeData)
}
 
}
     )
   
    
 } catch (error) {
   console.log("redirect to login")
   return res.status(401).json({ error: 'Invalid USER' });
 }

 



 
  
})


app.post("/UpdateExistingResume",(req,res)=>{

  resumeId = req.body.resumeId
  formData = req.body.resumeData
  console.log(formData)
  database.UpdateResume([resumeId,formData],(error,results)=>{
    if(error) return error
  })
   
 return res.send(resumeId);

  

 

  
   
})

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});











app.post("/resume",(req,res)=>{
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const site=req.body.site;
    const about=req.body.about;

    const title=req.body.title;
    const start=req.body.start_year;
    const last=req.body.end_year;
    const descriptions=req.body.description;
    

    const degree=req.body.degree;
    const start_edu=req.body.start_year_edu;
    const last_edu=req.body.end_year_edu;
    const college=req.body.college;

    const skill=req.body.skill;

    const data={"first_name":first_name,"last_name":last_name,"email":email,"phone":phone
,"address":address,"site":site,"about":about,"title":title,"start":start,"last":last,"descriptions":descriptions
,"degree":degree,"start_edu":start_edu,"last_edu":last_edu,"college":college,"skill":skill};

resume=data;
    
})

app.get("/resume",(req,res)=>{
    console.log(resume)
    res.send(resume)
})

app.listen(3000,()=>{console.log("server started at 3000")})

function generateUniqueNumericID() {
  const alphanumericID = shortid.generate();
  const numericID = parseInt(alphanumericID, 36).toString().substr(0, 6);
  return numericID.padStart(6, '0');
}