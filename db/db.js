const mongoose = require('mongoose');

//connect to MongoDB
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};