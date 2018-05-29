const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {authenticate} = require('../middleware/authenticate');
const multer = require('multer');

const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
const upload = multer({ storage: storage });


// register router
router.post('/register', async (req,res) => {
        const userData = {
            "Email": req.body["Email"],
            "First Name": req.body["First Name"],
            "Last Name": req.body["Last Name"],
            "Password": req.body["Password"],
            "Gender":req.body["Gender"],
            "Date of Birth": req.body["Date of Birth"],
            "Zipcode": req.body["Zipcode"],
            "Height": req.body["Height"],
            "Gender Preference": req.body["Gender Preference"],
            "Age Preference Min" : req.body["Age Preference Min"],
            "Age Preference Max" : req.body["Age Preference Max"],
            "Race" : req.body["Race"],
            "Religion" : req.body["Religion"]
        }
        try{
            const user = new User(userData);
            await user.save();
            const token = await user.generateAuthToken();
            res.header('x-auth',token).send(user);
        }catch(e){
            console.log(e);
            res.status(400).send(e);
        }

});


//login router
router.post('/login', async(req,res) =>{
  try{
      const user = await User.findByCredentials(req.body["Email"],req.body["Password"]);
      const token = await user.generateAuthToken();
      res.header('x-auth',token).send(user);
  }
  catch(e){
      res.status(400).send(e);
  }
})

// logout router
router.get('/logout',authenticate, async(req,res)=>{
    try{
        await req.user.removeToken(req.token);
        res.status(200).send("Logout successfully.");
    }
    catch(e){
        res.status(400).send(e);
    }
})

//uploadProfile router
router.post('/uploadProfile',authenticate, upload.single('profile'),(req,res)=>{

    User.findOneAndUpdate({_id:req.user._id},{$set:{"Photo":req.file.path}},{new:true}).then((user)=>{
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }).catch((e)=>{
         res.status(400).send(e);
    })
})


//download profile photo router
router.get('/getProfile', authenticate, (req,res)=>{

    if(!req.user["Photo"]){
        return res.status(404).json("File does not exist!");
    }
    res.download(req.user["Photo"],(err)=>{
        if(err){
            return res.status(400).json("Can not download file.");
        }
    })
})

module.exports = router;
