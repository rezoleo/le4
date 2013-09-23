var express = require('express'),
    http = require('http'),
    config = require('./config.json'),
    passport = require('passport'),
    auths = require('./routes/logs');

var MemoryStore = express.session.MemoryStore;

require('./strategy-ng');
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 8080);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser(config.session.secret));
    app.use(express.session({
        store: new MemoryStore(),
        secret: config.session.secret
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/Lea'));
    app.use('views', __dirname + '/views');
    app.set('view engine', 'jade');
   
});

app.get('/', function(req, res) {
    res.render('lea',{user:req.user});
});
app.all('/rest/*', function(req, res, next) {
    if(req.isAuthenticated()) next();
    else res.redirect('/');
});
app.get('/rest/users', auths.searchLeo);
app.get('/rest/users/:id', auths.findById);
app.get('/rest/leos', auths.findLeoByUid);
//app.post('/rest/users', user.addUser);
//app.put('/rest/users/:id', user.updateUser);
//app.delete('/rest/users/:id', user.deleteUser);

app.get('/rest/pending', auths.findPendingMachine);
app.put('/rest/pending', auths.validatePendingMachine);


app.post('/rest/users/:id/machines', auths.addMachine);



app.put('/rest/leos', auths.moveLeo);

app.get('/rest/machines', auths.searchMachine);

app.post('/auth/login',
	passport.authenticate('local', {
		successRedirect: '/leos',
		failureRedirect: '/login'
	}),
	function(req, res){
		console.log('Auth: ok');
	}
);
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/debug', function(req, res){
    res.render('debug',{blarg:req.user});
});

app.get(/^\/\w+\/?$/,function(req, res) {
    if(req.isAuthenticated()) res.render('lea',{user:req.user});
    else res.render('login'); 
});



http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});
