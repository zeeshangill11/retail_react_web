var express = require("express");
var router = express.Router();
const apiRouter = require("./api/api_router.js");


router.use("/innoventRetailScript", express.static(__dirname + "/../routes/pages"));
router.use("/innoventRetailFiles", express.static(__dirname + "/../uploads"));
router.use("/assets", express.static(__dirname + "/../MMAssets"));
router.use("/loginAssets", express.static(__dirname + "/../assets/loginAssets"));
router.use("/api", apiRouter);
router.use(require('./app/app_router.js'));

module.exports = router;