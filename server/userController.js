// userController.js
const db = require('./db');

module.exports = {
  getAllUsers: (callback) => {
    const query = 'SELECT * FROM users';
    db.query(query, [], callback);
  },
  AuthenticateUser: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  },
  RegisterUser: ([name,username, email,phone,hashedPassword],callback) => {
    const query = 'INSERT INTO users (name,username, email,phone, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name,username, email,phone,hashedPassword], callback);
  },
  FetchUserDataAndResumeId: ([userId],callback1,callback2) => {
    

    const query1 = 'SELECT * FROM users WHERE id= ?';
  db.query(query1, [userId], callback1);
  const query2 = 'SELECT * FROM resumes WHERE user_id= ?';
  db.query(query2, [userId], callback2);
  
  },
  FetchResumeDataOfUser: ([resumeId],callback1,callback2,callback3,callback4) => {
    

   
  const query1 = 'SELECT * FROM resumes WHERE id= ?';
  db.query(query1, [resumeId], callback1);
  const query2 = 'SELECT * FROM experience WHERE resume_id= ?';
  db.query(query2, [resumeId], callback2);
  const query3 = 'SELECT * FROM skills WHERE resume_id= ?';
  db.query(query3, [resumeId], callback3);
  const query4 = 'SELECT * FROM education WHERE resume_id= ?';
  db.query(query4, [resumeId], callback4);
  
  },
  AddResumeDataOfUser: ([personal_info,experience_info,skills_info,education_info],callback1,callback2,callback3,callback4) => {
    

   
    const query1 = 'INSERT into resumes (first_name,last_name,email,phone,address,site,about) VALUES(?,"","","","","","")';
    db.query(query1, [resumeId], callback1);
    const query2 = 'INSERT into experience VALUES(?,?,?,?,?)';
    db.query(query2, [resumeId], callback2);
    const query3 = 'INSERT into skills VALUES(?,?)';
    db.query(query3, [resumeId], callback3);
    const query4 = 'INSERT into education VALUES(?,?,?,?,?)';
    db.query(query4, [resumeId], callback4);
    
    },
  AddResume: ([id,userId],callback) => {
    const query = 'INSERT into resumes VALUES(?,?,"","","","","","","")';
    db.query(query, [id,userId], callback);
  },

  UpdateResume:([resumeId,resumeData],callback1) =>{
    resume_query="UPDATE resumes set first_name= ?,last_name= ?,email= ?,phone= ?,site= ?,address= ?,about= ? WHERE id= ?"

   db.query(resume_query,[resumeData.first_name[0],
    resumeData.last_name[0],
    resumeData.email[0],resumeData.phone[0],resumeData.site[0],resumeData.address[0],resumeData.about[0],
  resumeId],callback1)
  

  if(resumeData.title.length != 0){
  delete_query = "DELETE FROM experience WHERE resume_id= ?"
  db.query(delete_query,[resumeId])
  
  
  resumeData.title.forEach((value,index)=>{
    console.log(index)
    ex_query = "INSERT into experience (resume_id,title,start_date,last_date,description)  VALUES(?, ?, ?, ?, ?)"

    db.query(ex_query,[resumeId,resumeData.title[index],resumeData.start_year[index],resumeData.end_year[index]
      ,resumeData.description[index]],callback1)
  })
}

if(resumeData.degree.length != 0){
  delete_query_edu = "DELETE FROM education WHERE resume_id= ?"
  db.query(delete_query_edu,[resumeId])
 
  resumeData.degree.forEach((value,index)=>{
    ex_query = "INSERT into education (resume_id,degree,start_date,last_date,college)  VALUES(?, ?, ?, ?, ?)"
    db.query(ex_query,[resumeId,resumeData.degree[index],resumeData.start_year_edu[index],resumeData.end_year_edu[index]
      ,resumeData.college[index]],callback1)
  })
}


if(resumeData.skill.length != 0){
  delete_query_skill = "DELETE FROM skills WHERE resume_id= ?"
  db.query(delete_query_skill,[resumeId])
 
  resumeData.skill.forEach((value,index)=>{
    console.log(value)
    ex_query = "INSERT into skills (resume_id,title)  VALUES(?, ?)"
    db.query(ex_query,[resumeId,resumeData.skill[index]],callback1)
  })
  }
}
 
};
