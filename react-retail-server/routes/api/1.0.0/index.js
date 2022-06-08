var express = require("express");
var router = express.Router();
const fs = require('fs');
var response = {};

fs.readdirSync(__dirname).forEach(file => {
    
    if(file != "index.js"){
        file = file.replace(".js","");
        var route = require("./" + file + ".js");
        router.use("/" + file, route);
    }
});

//Handle Invalid Command
router.post('/*', (req, res, next) => {
    response['error']	=	'1';
    response['message']	=	'NO OR INVALID API COMMAND PROVIDED';
    res.end(JSON.stringify(response));
});

router.get('/*', (req, res, next) => {
    response['error']	=	'1';
    response['message']	=	'NO OR INVALID API COMMAND PROVIDED';
    res.end(JSON.stringify(response));
});

module.exports = router;