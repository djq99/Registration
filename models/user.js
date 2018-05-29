const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    "Email": {
        type: String,
        unique: true,
        required: true,
        trim: true
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
        maxlength: 12
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
    }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ "Email": email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user["Password"], function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user["Password"], 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user["Password"] = hash;
        next();
    })
});

UserSchema.statics.getUserByEmail = function (email, callback) {
    User.findOne({ "Email": email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (user) {
                return callback(null,user);
            }
        })
};

UserSchema.statics.getUserById = function (id, callback) {
    User.findOne({ _id: id })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (user) {
                return callback(null,user);
            }
        })
};



const User = mongoose.model('User', UserSchema);
module.exports = User;


