const express = require('express');
const router = express.Router();
const User = require('../models/user');
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req,res,next){
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
        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.status(200).json(user);
            }
        });

});

router.post('/login',function(req,res,next){
    User.authenticate(req.body["Email"],req.body["Password"],function(err,user){
            if(err || !user) {
                const err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.status(200).json(user);
            }
        })
})

router.get('/logout',function(req,res,next){
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.status(200).json("Logout successfully!");
            }
        });
    }
})

router.post('/uploadProfile',upload.single('profile'),function(req,res,next){
    if(!req.session.userId){
        return res.json("User is not authorized !");
    }

    else{
        User.getUserById(req.session.userId,function(err,user){
            if(err || !user){
                return res.json("User is not authorized !");
            };
            console.log(req.file);
            User.update({_id: user._id},{$set:{"Photo":req.file.path}},function(err,user){
                if(err){
                    return res.status(400).json("File upload failed when saving to db");
                }
                res.json("File uploaded successfully!");
            })

        })
    }

})

router.get('/getProfile',function(req,res,next){
    if(!req.session.userId){
        return res.json("User is not authorized !");
    }
    User.getUserById(req.session.userId,function(err,user){
        if(err || !user["Photo"]){
            return res.status(400).json("File download failed when fetching file from db");
        }
        res.download(user["Photo"],function(err){
            if(err){
                return res.status(400).json("Can not download file.");
            }
        });
    })

})

module.exports = router;
