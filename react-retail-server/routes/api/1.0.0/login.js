var express = require("express");
var router = express.Router();
const mysql = require("../../../controllers/mysqlCluster.js");
var passport = require("passport");
var bcrypt = require('bcryptjs');
var response = {};
const rateLimit = require("express-rate-limit");
var dateFormat = require("dateformat");
const aduit_Add = require("../../../controllers/custom_auditinfo.js");
const console2 = require("../../../controllers/customconsole.js");
var dateFormat = require("dateformat");
var now = new Date();
var Cookies = require("js-cookie");
var datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

const LimitingMiddleware = require("../../../controllers/login_Limit.js");
//const LimitingMiddleware = require('limiting-middleware');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000 ,
//   max: 5, // limit each IP to 5 requests per windowMs
//   message: 'Too many wrong attempts please try again after 15 minutes !',
 
// });

const limiter = new LimitingMiddleware({ limit: 50, resetInterval: 900000 }).limitByIp();

// router.use(new LimitingMiddleware({ limit: 5, resetInterval: 900000 }).limitByIp());

router.post('/web_login2',limiter, (req, res, next) => {
   // const remaining = req.rateLimit.remaining;
   var now = new Date();

    var username = req.body.username;
    var password = req.body.password;
    var token = req.body.token;
    console.log(username);
    console.log(password);
    console.log(token);

    if (username !== '' && username !== undefined && password !== '' &&
        password !== undefined && token !== undefined && token !== '') {


        if (password == '' || username == '') {

            res.status(400).send({
                error: "1",
                message: "Both username and password required",
            });
            return
        }

       
        if (token == 123456) {
           
            mysql.querySelect("users", "where username = '" + username + "'", "*")
                .then(function(result) {
                    
                    if (result.status == "1") {
                        if (result.results.length > 0) {
                            var user_id = result.results[0].id;
                            bcrypt.compare(password, result.results[0].password, function(err, result2) {
                                
                                if (result2) {
                                    var new_query = "SELECT *, TR.user_permission FROM users US " +
                                        "LEFT JOIN tb_roles TR ON TR.role_id=US.role_id " +
                                        "WHERE US.id = '" + user_id + "'"
                                    
                                    mysql.queryCustom(new_query).then(function(result22) {

                                           
                                            if (result.status == "1") {

                                            
                                                res.cookie('ORG_NAME',process.env.ORG_NAME);
                                                req.session.user_id = user_id;
                                                req.session.user_permission = result22.results[0].user_permission;
                                                req.session.username = result22.results[0].username;
                                                req.session.role_id = result22.results[0].role_id;
                                                req.session.storeid = result22.results[0].storeid;

                                                aduit_Add.send(''+req.session.username+' -- Login successfully', 'audit_json','login', '', '', req.session.username,'');

                                                req.login(user_id, function(err) {
                                                    if (err) {

                                                        console2.log('Error',JSON.stringify(err),'71-login Uknown Error Logging In 1');
                                                        res.status(400).send({
                                                            error: "0",
                                                            message:"Uknown Error Logging In 1"
                                                        });
                                                    } else {

                                                        var update_login_time = "update users set `last_login`= '" + datetime + "' " +
                                                            " where id = '" + user_id + "'"

                                                        mysql.queryCustom(update_login_time).then(function(result) {
                                                            if (result.status == "1") {

                                                                res.status(200).send({
                                                                    error:"0",
                                                                    message:"Logged in Successfully"
                                                                });
                                                            } else {
                                                                console2.log('Error',JSON.stringify(error),'91-login Uknown Error Logging In 2');
                                                                
                                                                res.status(400).send({
                                                                    error: "1",
                                                                    message:"Uknown Error Logging In 2"
                                                                });


                                                            }
                                                        })

                                                    }
                                                });
                                            } else {

                                                console2.log('Error',JSON.stringify(err),'91-login Uknown Error Logging In 3');
                                                
                                                res.status(400).send({
                                                    error: "1",
                                                    message:"Uknown Error Logging In 3"
                                                });
                                               
                                            }
                                        })
                                        .catch(function(error) {

                                            console2.log('Error',JSON.stringify(error),'114-login  Error');
                                            res.end(error);
                                        
                                        });

                                } else {

                                    res.status(400).send({
                                        error: "1",
                                        message: "Your Username or Password is incorrect",
                                    });

                                    

                                }
                            });
                        } else {

                            res.status(400).send({
                                error: "1",
                                message: "Username does not exist",
                            });
                            

                        }

                    } else {
                        console2.log('Error',JSON.stringify(error),'139-Error Logg In');

                        res.status(400).send({
                            error: "1",
                            message: "Error Logg In"
                        });
                       

                    }
                })
                .catch(function(error) {
                    console2.log('Error',JSON.stringify(error),'148-Error Logg In');
                    res.json(JSON.stringify(response));
                })
        } else {

            res.status(400).send({
                error: "1",
                message:  "Invalid Token"
            });

          
        }
    } else {

        res.status(400).send({
            error: "1",
            message:  "Field is missing"
        });
    }

});


passport.serializeUser(function(userName, done) {
    done(null, userName);
});

passport.deserializeUser(function(userName, done) {
    done(null, userName);
});

//Handle Invalid Command
router.post('/*', (req, res, next) => {
    response['error'] = '1';
    response['message'] = 'NO OR INVALID API COMMAND PROVIDED';
    res.end(JSON.stringify(response));
});

router.get('/*', (req, res, next) => {
    response['error'] = '1';
    response['message'] = 'NO OR INVALID API COMMAND PROVIDED';
    res.end(JSON.stringify(response));
});
module.exports = router;