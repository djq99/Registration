const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    "Email": {
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{value} is not a valid email'
        }
    },
    "First Name": {
        type: String,
        required: true,
        trim: true
    },
    "Last Name": {
        type: String,
        required: true,
        trim: true
    },
    "Password": {
        type: String,
        required: true,
        minlength: 6,
    },
    "Gender": {
        type: String,
        enum: ["Male", "Female"],
        required: true,
    },
    "Date of Birth":{
      type: Date,
      required: true,
    },
    "Zipcode":{
        type: Number,
        validate: {
            validator: function(v) {
                return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(v);
            },
            message: '{VALUE} is not a valid zip code !'
        },
        require: true,
    },
    "Height":{
        type: Number,
        require: true,
    },
    "Gender Preference":{
        type: String,
        require: true,
    },
    "Age Preference Min":{
        type: Number,
        require: true,
        min:1,
        max:99
    },
    "Age Preference Max":{
        type: Number,
        require: true,
        min:1,
        max:99
    },
    "Race":{
        type:String,
    },
    "Religion":{
        type:String,
    },
    "Photo":{
        type:String,
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
});


UserSchema.methods.generateAuthToken = function(){
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    })
}

UserSchema.methods.removeToken = function(token){
    const user = this;
    return user.update({
        $pull:{
            tokens:{token}
        }
    })
}

UserSchema.statics.findByToken = function(token){
    const User = this;
    let decoded;

    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}


//authenticate input against database
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({"Email":email}).then(function (user) {
        if (!user) {
            return Promise.reject();
        }
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user["Password"], function (err, res) {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};

//hashing a password before saving it to the database
UserSchema.pre('save',function(next){
    const user = this;
    if(user.isModified("Password")){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user["Password"],salt,(err,hash)=>{
                user["Password"] = hash;
                next();
            })
        })
    }
    else{
        next()
    }
})



const User = mongoose.model('User', UserSchema);
module.exports = User;


