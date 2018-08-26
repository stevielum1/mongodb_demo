const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jsonwebtoken = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

const User = require("../../models/User");

router.get("/test", (req, res) => {
  res.json({ msg: "Users route is working!" });
});

router.get('/current', passport.authenticate("jwt", {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({email: "A user has already registered with this address"});
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        })
      });
    }
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email}).then(user => {
    if (!user) {
      return res.status(400).json({email: "This user does not exist"});
    } else {
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {id: user.id, name: user.name};
            
            jsonwebtoken.sign(
              payload,
              keys.secretOrKey,
              {expiresIn: 3600},
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              });
          } else {
            return res.status(400).json({password: "Incorrect password"});
          }
        });
    }
  });
});

module.exports = router;
