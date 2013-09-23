var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , config = require('./config.json');

var users = config.users;

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    user.id = username;
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}
passport.use(new LocalStrategy(
  function(username, password, done) {
  	process.nextTick(function() {
	findByUsername(username, function(err, user) {
	  if(err) {return done(err);}
	  if(!user) {return done(null, false, {message: 'unknown user ' + username});}
	  if(user.password != password) {return done(null, false, {'message':'Invalid password'});}
          return done(null, user);
	});
 });

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
  done(null, id);
});
