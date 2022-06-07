var express = require("express");
var router = express.Router();
var passport = require("passport");
var path = require("path");
var read = require('fs').readFileSync;
const fs = require('fs');

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

fs.readdirSync(__dirname).forEach(file => {
    
    if(file != "app_router.js"){
        file = file.replace(".js","");
        var route = require("./" + file + ".js");
        router.use("/" + file, route);
    }
});

router.get('/', authenticationMidleware(), async function (req, res) {
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

router.get('/login', async function (req, res) {
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else {
        res.setHeader('Content-Type','text/html'); 
        var header = new String(read(path.join(__dirname, '../../views/partials/loginHeader.html')));
        var loginPage = new String(read(path.join(__dirname, '../../views/login.html')));
        loginPage = header +  loginPage;
        res.end(loginPage);
    }
});

fs.readdirSync(__dirname + "/../../views/").forEach(file => {
    if(file != "layouts" && file != "partials"){
        router.get('/' + file.replace(".hbs", ""), authenticationMidleware(), async function (req, res){
            var user_id = req.session.passport.user;
            var session = req.session;
            var restaurant_name = session.restaurant_name;
            var options = {
                restaurant_name: restaurant_name,
                pageTitle: toTitleCase(file.replace(/_/g, " ").replace(".hbs", "")),
                scriptFile: file.replace(".hbs", ".js")
            };
            //res.render(file.replace(".hbs", ""),options);
            res.renderPjax(file.replace(".hbs", ""),options);
        });
    }
    
});


router.get('*', function(err, req, res, next){

    if (err) {
     return res.sendStatus(500);
    }
    res.render('404');
});

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


module.exports = router;