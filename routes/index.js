var express = require('express');
var router = express.Router();

const User = require('../models/user');
const passport = require('passport');
const { LengthRequired } = require('http-errors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Employee Portal', user: req.user});
});

router.get('/login', (req, res, next) => {
 // res.render('login', {title: 'Login to your Account'}); 

let messages = req.session.messages || [];

req.session.messages = [];

 res.render('login', { title: 'Login to your Account', messages: messages });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/projects',
  failureRedirect: '/login',
  failureMessage: 'Invalid Username and/or password'
}));

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Create a new Account'});
});

router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,

    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/register');
      } 
      else {
        req.login(newUser, (err) => {
          res.redirect('/projects');
        });
      }
    });
});

router.get('/logout', (req, res, next) => {
  req.logout();

  res.redirect('/login');
});

router.get('/github', passport.authenticate('github', { scope: ["user.email"] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login'}),
  (req, res, next) => {
    res.redirect('/projects');
  }
);

module.exports = router;
