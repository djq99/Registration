const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/',function(req,res,next){
    if(!req.session.userId){
        return res.send('User is not authorized !');
    }
    User.findById(req.session.userId)
        .exec(function(err,user){
            if(err){
                return next(err);
            }
            else{
                if(user === null){
                    return res.send('User is not authorized !');
                }
                else{
                    res.status(200).json(user);
                }
            }
        })
})

module.exports = router;