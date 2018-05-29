const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {authenticate} = require('../middleware/authenticate')

router.get('/',authenticate, async (req,res) => {
    res.send(req.user);
})

module.exports = router;