var express = require('express');
var pjax    = require('express-pjax');
const helmet = require("helmet");
var app = express();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyparser = require("body-parser");
var http = require('http')
var io = require('socket.io')
var cors = require("cors");
const mysql = require("./controllers/mysqlCluster.js");
var cookieParser = require('cookie-parser')
var passport = require("passport");
const hbs = require("express-handlebars");
var minifyHTML = require('express-minify-html-2');


// let console2 = require('./controllers/customconsole.js');
// console2.log('data', 'info');


// If environment is not production,
// load environment config
if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}

var app_port = process.env.APP_PORT;
var socket_port = process.env.SOCKET_PORT;



app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layouotsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));
app.set('view engine', 'hbs');
app.use(pjax());
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(cookieParser());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var sessionStore = new MySQLStore({}, mysql.mysqlMain);
app.use(session({
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
//site link;
app.locals.sitelink = process.env.SITE_LINK;

var compress = require('compression');
app.use(compress());


app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));
 
//app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes'));

app.get('*', function(req, res){
  res.render('404');
});


var server = http.createServer(app);
server.listen(app_port,"0.0.0.0");
var sio = io.listen(server);
var passportSocketIo = require("passport.socketio");
var socketHandshake = require ('socket.io-handshake');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


sio.use(passportSocketIo.authorize({
    passport : passport,
    cookieParser: cookieParser,
    key:          'connect.sid',
    secret:       'INNOVENTTECH',
    store:        sessionStore,
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
}));

sio.use(socketHandshake({
    store: sessionStore, 
    key: 'connect.sid',
    secret: 'INNOVENTTECH',
    parser: cookieParser(),
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

function onAuthorizeSuccess(data, accept){
    accept(null, true);
}
  
function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    accept(null, false);
}

function authenticationMidleware(){
    return (req,res,next) =>{
        if(req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}


app.listen(socket_port,'0.0.0.0', () =>{
    console.log("Server has been started on PORT: " + socket_port);
});

sio.on('connection', async function (socket) {
    var socketSession = socket.handshake.session;
    
})
