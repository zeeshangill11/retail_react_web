var express = require("express");
var router = express.Router();
const fs = require('fs');
var response = {};

fs.readdirSync(__dirname).forEach(file => {
    if(file != "api_router.js"){
        var apiFolder = require("./" + file + "/index.js");
        router.use("/"+ file, apiFolder);
    }
});

router.get('*', (req, res, next) => {
    response['error']	=	'1';
    response['message']	=	'Invalid or Missing API Version';
    res.end(JSON.stringify(response));
});


module.exports = router;