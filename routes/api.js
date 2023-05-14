const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/user")
const { body, validationResult } = require('express-validator');

router.get("/", async (req, res) => {
    res.status(201).json({
      message: "Welcome to the laper API"
    });
  });


  
router.post("/login", async (req, res) => {
    try {
        const result = await User.findOne({
            email: req.body.email
        })

        if (result == null){
            console.log('User not found');
            return res.status(401).json(
                {
                    message: 'User not found'
                }

            )
        }
        else if(!result.validPassword(req.body.password)){
            req.flash('error', 'Incorrect Credentials')
            res.status(401).json(
                {
                    message: 'Incorrect Credentials'
                }
            )
        }
        else{
            console.log('Logged In');
            const token = jwt.sign(
                {
                    email: result.email,
                    userId: result._id

                },
                process.env.AUTH_SECRET,
                {
                    expiresIn: '48h'
                }

            );

            return res.status(200).json({
                message: "Auth successful",
                token: token,
                uid: result._id
              });
            }
        }

    


    
    
    catch(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    }

});
  

  router.post("/signup", body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
        const user = new User();
        user.email =  req.body.email,
        user.password = user.encryptPassword(req.body.password),
        user.isGAuth = false,
        user.date_created = Date.now()
        console.log('new user created, pushing to database');
        const saveRes = await user.save();
            if (!saveRes) {
                console.log('Some error occured')
              res.status(500).json({
                message: "An error has occured here."
              })
            } else {
                res.status(201).json({
                  message: "User successfully created."
                });
            }
        }
     catch(e) {
        console.log()
        res.status(500).json({
          message: "An error has occured initially."
        })
    }
});







  module.exports = router