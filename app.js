var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
var addRouter = require('./routes/projects');
var statusesRouter = require('./routes/statuses');

// Import passport and session
const passport = require('passport');
const session = require('express-session'); 
const githubStrategy = require('passport-github2').Strategy;

const config = require('./config/globals');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
app.use(session({
  secret: 's2021projectTracker',
  resave: false,
  saveUninitialized: false
}));

//initialize and set passport session
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy());

passport.use(new githubStrategy(
  {
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },

  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ oauthId: profile.id});

    if(user) {
      return done(null, user);
    }

    else {
      const newUser = new User(
        {
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: 'Github',
          created: Date.now()
        }
      );

      const savedUser = await newUser.save();
      return done(null, savedUser)
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/add', addRouter)
app.use('/statuses', statusesRouter);

//Importing mongoose to the project
const mongoose = require('mongoose');
//After all the custom routers/controllers
const connectionString = 'mongodb+srv://Sahil_200446745:Sumit@1987@cluster0.cxd70.mongodb.net/comp2068';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true })
.then((message) => {
  console.log('Connected Successfully!');
})

.catch((err) => {
  console.log(err);
});

const hbs = require('hbs');

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  var selectedAttribute = '';
  if(currentValue == selectedValue){
    selectedAttribute = 'selected'
  }
  
  return new hbs.SafeString("<option " + selectedAttribute + ">" + currentValue + "</option>");

});

hbs.registerHelper('toShortDate', (longDateValue)=>{
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
