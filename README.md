# Registration
Simple express API to register users and upload users' photos.
****
#### How to run it

######Locally
1. Clone or download the repository.
2. Make sure MongoDB is running.
3. `npm install` will install all dependecies
4. `npm start` will start the server.

****
######Remotely

I also set up the server on Heroku and the URL is <https://shrouded-beach-21895.herokuapp.com/>

****
######Functionality

- Accept a POST request to path `"/register"`, the request body should be a Json object which contains:
`"EMail"`,`"First Name"`,`"Last Name"`,`"Password"`,`"Gender"`,`"Date of Birth"`,`"Zipcode,Height"`,`"Gender Preference"`,`"Age Preference Min"`,`"Age Preference Max"`,`"Race (optional)"` and `"Religion (optional)"`

  Below is a valid Json object:

   `{
 	"Email":"abcd@gmail.com",
 	"First Name":"Tom",
 	"Last Name":"Jack",
 	"Password":"123456",
 	"Gender": "Male",
 	"Date of Birth": "2018-05-28T00:00:00.000Z",
 	"Zipcode":"94121",
 	"Height":"176",
 	"Gender Preference":"Female",
 	"Age Preference Min":"18",
 	"Age Preference Max": "30",
 	"Race":"Asian",
 	"Religion":"None"
   }`
   
   The password will be hashed by bcrypt and added a random salt, then store in the database. 
   
  After receiving a valid Json object, the server will return the user object which has been stored in mongoDB, with a Json Web Token set to response header, which is used to persist the user.
  
  ****
  
 - Accept a POST request to `"/login"` with a Json object contains `"EMail"` and `"Password"`. This router is used to valid user is in the database which will return user object.
 
 - Accept a GET request to `"/user"` with `x-auth` token which will validate the user has login and return the user object.
 
 - Accept a POST request to `"/uploadProfile""` with `x-auth` token and attach file in request body which will upload a file to server. `x-auth` token is to make sure which file belongs to which user.
 
 - Accept a GET request to `"/getProfile"` with `x-auth` token which will download the file.(For now just support upload one file).
 
 - Accept a GET request to `"/logout""` with `x-auth` token which will destroy the token and let the user logout.
  
