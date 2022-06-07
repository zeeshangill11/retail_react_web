//const helmet = require("helmet");
var express = require("express");
var router = express.Router();
const mysql = require("../../../controllers/mysqlCluster.js");
var passport = require("passport");
var bcrypt = require('bcryptjs');
var response = {};
var dateFormat = require("dateformat");
var now = new Date();
const rateLimit = require("express-rate-limit");
const console2 = require("../../../controllers/customconsole.js");
const parse = require("../../../controllers/epc-parser-fixed.js");
const aduit_Add = require("../../../controllers/custom_auditinfo.js");
const LimitingMiddleware = require("../../../controllers/login_Limit.js");
if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });

// router.use(limiter);

var mysql2 = require("mysql");
var mainDBName2 = mysql.globals.mainDBName;
var DBNames = {};
var mysqlMain2 = mysql.mysqlMain;
//app.use(helmet());
var access_token = mysql.globals.access_token;
router.use(express.json());

const limiter_ip = new LimitingMiddleware({ limit: 15, resetInterval: 900000 }).limitByIp();

router.post('/mobile_login_2',limiter_ip, (req, res, next) => {

    console2.execution_info('mobile_login_2');
    try {
        console2.log_entry("/mobile_login_2",req.body);
        var now = new Date();
        var username = req.body.username;
        var password = req.body.password;
        var token = req.body.token;
        if (username !== '' && username !== undefined && password !== '' &&
            password !== undefined && token !== undefined && token !== '') { 

            var currentdate = new Date();
            var datetime = currentdate.getFullYear() + "-" +
                (currentdate.getMonth() + 1) + "-" +
                currentdate.getDate() + "  " +
                currentdate.getHours() + ":" +
                currentdate.getMinutes() + ":" +
                currentdate.getSeconds()

            if (password == '' || username == '') {


                res.status(400).send({
                    error: "1",
                    message: "Both username and password required",
                });
                return;
            }

            if (token == access_token || token == 123456) {

                mysql.querySelect("users", "where username = '" + username + "'", "*")
                    .then(function(result) {

                        if (result.status == "1") {
                            if (result.results.length > 0) {
                                var user_id = result.results[0].id;
                                bcrypt.compare(password, result.results[0].password, function(err, result) {

                                    if (result) {
                                        var new_query = "SELECT *, TR.user_permission AS permissions FROM users US " +
                                            "LEFT JOIN tb_roles TR ON TR.role_id=US.role_id " +
                                            "WHERE US.id = '" + user_id + "'"

                                        var insert_query = "INSERT INTO tb_audit (audit_text,date,deviceid,user_id)" +
                                            " VALUES ('LoginSuccessfully','" + datetime + "','1','" + user_id + "')";

                                        mysql.queryCustom(new_query).then(function(result) {


                                                mysql.queryCustom(insert_query).then(function(result) {
                                                        if (result.status == "1") {

                                                        } else {
                                                            console.log("aaaaaaaa");
                                                            console2.log(req.body, 'Unknown Error'+result.error, '977-mobile_login_2');
                                                            res.status(400).send({
                                                                error: "1",
                                                                message: "Uknown Error Logging In",
                                                            });
                                                            return;
                                                        }
                                                    })
                                                    .catch(function(error) {
                                                        console.log(error);
                                                        /*console2.log(req.body,'Unknown Error'+error, '985-mobile_login_2');
                                                        res.status(400).send({
                                                            error: "1",
                                                            message: "Uknown Error Logging In",
                                                        });
                                                        return;*/

                                                    })

                                                if (result.status == "1") {


                                                    req.session.user_id = user_id;
                                                    req.session.user_permission = result.results[0].user_permission;
                                                    req.session.username = result.results[0].username;
                                                    req.session.role_id = result.results[0].role_id;
                                                    req.session.storeid = result.results[0].storeid;
                                                    req.login(user_id, function(err) {


                                                        if (err) {
                                                            console2.log(req.body, 'Unknown Error'+err, '1008-mobile_login_2');
                                                            res.status(400).send({
                                                                error: "1",
                                                                message: "Uknown Error Logging In",
                                                            });

                                                        } else {


                                                            res.status(200).send({
                                                                error: "0",
                                                                message: "Logged in Successfully",
                                                                permissions: result.results[0].permissions


                                                            });

                                                        }


                                                    });
                                                } else {


                                                    console2.log(req.body, 'Unknown Error ', '1032-mobile_login_2');
                                                    res.status(400).send({
                                                        error: "1",
                                                        message: "Uknown Error Logging In",
                                                    });
                                                }
                                            })
                                            .catch(function(error) {

                                                console2.log(req.body, 'Unknown Error'+error, '1041-mobile_login_2');
                                                res.status(400).send({
                                                    error: "1",
                                                    message: "Uknown Error Logging In",
                                                });
                                            })

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

                            console2.log('Error', 'Unknown Error ', '1065-mobile_login_2');
                            res.status(400).send({
                                error: "1",
                                message: "Error Logging In",
                            });
                        }
                    })
                    .catch(function(error) {
                        console2.log(req.body, 'Unknown Error'+error, '1073-mobile_login_2');
                        res.status(400).send({
                            error: "1",
                            message: JSON.stringify(error),
                        });

                    })
            } else {


                res.status(400).send({
                    error: "1",
                    message: "Invalid Token",
                });
            }


        } else {

            res.status(400).send({
                error: "1",
                message: "Field is missing !",
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1176-mobile_login_2 API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1183-mobile_login_2 API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

})


router.post('/Procedure_Run', (req, res, next) => {
    console2.execution_info('Procedure_Run');

    try {

        var data = req.body;

        var cond = '';

        var data_stringify = '';

        var writeData = '';


        try {

            data_stringify = JSON.stringify(data)

            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }


        var data_SP = '';
        //console.log(data_stringify);

        if (typeof writeData.Details !== 'undefined') {
            data_SP = writeData.Details[0];
        } else {
            console2.log('Error', 'please send proper json', '821-Procedure_Run');
            res.status(400).send({
                error: "1",
                message: 'please send proper json',
            });

        }


        var token = data_SP.access_token;
        var procedure_name = data_SP.procedure_name;

        var sku = data_SP.var_sku;

        var store_id = data_SP.var_store_id;

        var date = data_SP.var_date;




        var cond = '';
        var join_cond = '';

        if (token == access_token) {

            var new_query = `CALL ` + procedure_name + ` ('` + sku + `','` + store_id + `','` + date + `')`;

            mysql.queryCustom(new_query).then(function(result) {

                res.status(200).send({
                    error: "0",
                    'Data': 'Run Successfully',
                });
            }).catch(function(error) {
                console2.log('Error', error, '906-Procedure_Run');
                res.status(400).send({
                    error: "1",
                    message: "DB Fetch error" + JSON.stringify(error),
                });
            });

        } else {
            res.status(400).send({
                error: "1",
                message: "Invalid Token",
            });
        }


    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '984-Procedure_Run API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '991-Procedure_Run API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




function Product_item_master_check(sku_code, dataForLoop) {
    try {
        return new Promise((resolve, reject) => {

            var item_code2 = sku_code;
            var dataLoop = dataForLoop;


            var error = '';
            var new_query22 = "SELECT * FROM " +
                " product_item_master WHERE skucode = ?"

            mysqlMain2.query(new_query22, [item_code2], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }

                error = '0';

                if (results == '') {
                    error = '1';
                }

                let permssion_error = {
                    error: error,
                    data: dataForLoop,


                }
                resolve(permssion_error)
            });

        });
    } catch (e) {
        if (e instanceof TypeError) {
            console2.log('Error', 'Catch Exception'+e, '71-Product_item_master_check API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '77-Product_item_master_check API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
};

function mysql_real_escape_string(var_res,str) {
    return str;
}

router.post('/Product_item_master_old', (req, res, next) => {

    console2.execution_info('Product_item_master_old');
    try {
        var data = req.body;

        var data_stringify = JSON.stringify(data)

        var writeData = JSON.parse(data_stringify);

        //console.log(writeData.access_token);

        var access_token2 = writeData.access_token;

        //console.log(access_token2);
        var dataForLoop = writeData.result;

        //console.log(dataForLoop);
        var item_code = '';


        var temp = [];
        var new_query2 = '';
        var product_name = '';
        var product_des = '';
        var epc = '';
        var last_detected_time = '';
        var user = '';
        var zone = '';
        var brand = '';
        var departmentid = '';
        var size = '';
        var sfsr = '';
        var group_description = '';
        var dept = '';
        var departmentname = '';
        var brand_description = '';
        var barcode = '';
        var model = '';
        var subgroup = '';
        var dept = '';
        var style = '';
        if (access_token2 !== '' && access_token2 !== undefined) {
            if (access_token2 == access_token) {
                for (var i = 0; i < dataForLoop.length; i++) {

                    product_name = dataForLoop[i].product_name;
                    product_des = dataForLoop[i].product_des;
                    epc = dataForLoop[i].epc;
                    user = dataForLoop[i].user;
                    zone = dataForLoop[i].zone;
                    departmentid = dataForLoop[i].departmentid;
                    brand = dataForLoop[i].brand;
                    size = dataForLoop[i].size;
                    sfsr = dataForLoop[i].sfsr;
                    dept = dataForLoop[i].dept;
                    group_description = dataForLoop[i].group_description;
                    last_detected_time = dataForLoop[i].last_detected_time;
                    departmentname = dataForLoop[i].departmentname;
                    barcode = dataForLoop[i].barcode;
                    brand_description = dataForLoop[i].brand_description;
                    model = dataForLoop[i].model;
                    subgroup = dataForLoop[i].subgroup;
                    style = dataForLoop[i].style;


                    new_query2 += "CALL product_item_master_items_insert (" +

                        "'" + mysql_real_escape_string(res,dataForLoop[i].storeid) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].skucode) + "'," +
                        "'" + mysql_real_escape_string(res,product_name) + "'," +
                        "'" + mysql_real_escape_string(res,product_des) + "'," +
                        "'" + mysql_real_escape_string(res,epc) + "'," +
                        "'" + mysql_real_escape_string(res,last_detected_time) + "'," +
                        "'" + mysql_real_escape_string(res,user) + "'," +
                        "'" + mysql_real_escape_string(res,zone) + "'," +
                        "'" + mysql_real_escape_string(res,departmentid) + "'," +
                        "'" + mysql_real_escape_string(res,brand) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].color) + "'," +
                        "'" + mysql_real_escape_string(res,size) + "'," +
                        "'" + mysql_real_escape_string(res,sfsr) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].status) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].group_name) + "'," +
                        "'" + mysql_real_escape_string(res,group_description) + "'," +
                        "'" + mysql_real_escape_string(res,dept) + "'," +
                        "'" + mysql_real_escape_string(res,departmentname) + "'," +
                        "'" + mysql_real_escape_string(res,brand_description) + "'," +
                        "'" + mysql_real_escape_string(res,barcode) + "'," +
                        "'" + mysql_real_escape_string(res,model) + "'," +
                        "'" + mysql_real_escape_string(res,subgroup) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].sgroup) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].ean_no) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].sp_net) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].season) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].vat) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].gender) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].sp_gross_eng) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].sp_gross_arb) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].supplier_item_no) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].supplier_name) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].type_no) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].arabic_desc) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].origin) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].english_desc) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].company) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].currency) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].cost) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].image_url) + "'," +
                        "'" + mysql_real_escape_string(res,style) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].country) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].supplier_no) + "'," +
                        "'" + mysql_real_escape_string(res,dataForLoop[i].po_supplier_no) + "');";
                }


                //console.log(new_query_insert);
                mysql.queryCustom(new_query2).then(function() {

                        res.status(200).send({
                            error: "0",
                            message: "Product Inserted Successfully",
                        });

                    })
                    .catch(function(error) {
                        console2.log('Error', error, '234-Product_item_master API');
                        res.status(400).send({
                            error: "1",
                            message: error,
                        });
                    })
            } else {

                res.status(400).send({
                    error: "1",
                    message: "Invalid Access Token !",
                });
            }
        } else {
            res.status(400).send({
                error: "1",
                message: "Access Token Is missing !",
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '279-Product_item_master API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '286-Product_item_master API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

});


router.post('/Product_item_master', (req, res, next) => {

        console2.execution_info('Product_item_master');

        var data = req.body;
        console2.log_entry("/Product_item_master",req.body);
        var data_stringify = JSON.stringify(data)

        var writeData = JSON.parse(data_stringify);

        //console.log(writeData.access_token);

        var access_token2 = writeData.access_token;

        //console.log(access_token2);
        var dataForLoop = writeData.result;

        //console.log(dataForLoop);
        var item_code = '';


        var temp = [];
        var new_query2 = '';
        var product_name = '';
        var product_des = '';
        var epc = '';
        var last_detected_time = '';
        var user = '';
        var zone = '';
        var brand = '';
        var departmentid = '';
        var size = '';
        var sfsr = '';
        var group_description = '';
        var dept = '';
        var departmentname = '';
        var brand_description = '';
        var barcode = '';
        var model = '';
        var subgroup = '';
        var dept = '';
        var style = '';
        

        var epc_details_data_array=[];
        var temp2;
        var insertquery_epc_details;


        if (access_token2 !== '' && access_token2 !== undefined) {
            if (access_token2 == access_token) {
                for (var i = 0; i < dataForLoop.length; i++) {

                    product_name = dataForLoop[i].product_name;
                    product_des = dataForLoop[i].product_des;
                    epc = dataForLoop[i].epc;
                    user = dataForLoop[i].user;
                    zone = dataForLoop[i].zone;
                    departmentid = dataForLoop[i].departmentid;
                    brand = dataForLoop[i].brand;
                    size = dataForLoop[i].size;
                    sfsr = dataForLoop[i].sfsr;
                    dept = dataForLoop[i].dept;
                    group_description = dataForLoop[i].group_description;
                    last_detected_time = dataForLoop[i].last_detected_time;
                    departmentname = dataForLoop[i].departmentname;
                    barcode = dataForLoop[i].barcode;
                    brand_description = dataForLoop[i].brand_description;
                    model = dataForLoop[i].model;
                    subgroup = dataForLoop[i].subgroup;
                    style = dataForLoop[i].style;


                    temp2 = [

                                         
                        mysql_real_escape_string(res,dataForLoop[i].storeid),
                        mysql_real_escape_string(res,dataForLoop[i].skucode),
                        mysql_real_escape_string(res,dataForLoop[i].skucode),
                        mysql_real_escape_string(res,product_name),
                        mysql_real_escape_string(res,product_des),
                        mysql_real_escape_string(res,epc),
                        mysql_real_escape_string(res,last_detected_time),
                        mysql_real_escape_string(res,user),
                        mysql_real_escape_string(res,zone),

                        mysql_real_escape_string(res,departmentid),
                        mysql_real_escape_string(res,brand),
                        mysql_real_escape_string(res,dataForLoop[i].color),
                        mysql_real_escape_string(res,size),
                        mysql_real_escape_string(res,sfsr),
                        mysql_real_escape_string(res,dataForLoop[i].status),
                        mysql_real_escape_string(res,dataForLoop[i].group_name),
                        mysql_real_escape_string(res,group_description),
                        mysql_real_escape_string(res,dept),
                        mysql_real_escape_string(res,departmentname),
                        mysql_real_escape_string(res,brand_description),
                        mysql_real_escape_string(res,barcode),
                        mysql_real_escape_string(res,model),
                        mysql_real_escape_string(res,subgroup),
                        mysql_real_escape_string(res,dataForLoop[i].sgroup),
                        mysql_real_escape_string(res,dataForLoop[i].ean_no),

                        mysql_real_escape_string(res,dataForLoop[i].sp_net),
                        mysql_real_escape_string(res,dataForLoop[i].season),
                        mysql_real_escape_string(res,dataForLoop[i].vat),
                        mysql_real_escape_string(res,dataForLoop[i].gender),
                        mysql_real_escape_string(res,dataForLoop[i].sp_gross_eng),
                        mysql_real_escape_string(res,dataForLoop[i].sp_gross_arb),
                        mysql_real_escape_string(res,dataForLoop[i].supplier_item_no),
                        mysql_real_escape_string(res,dataForLoop[i].supplier_name),
                        mysql_real_escape_string(res,dataForLoop[i].type_no),
                        mysql_real_escape_string(res,dataForLoop[i].arabic_desc),
                        mysql_real_escape_string(res,dataForLoop[i].origin),
                        mysql_real_escape_string(res,dataForLoop[i].english_desc),


                        mysql_real_escape_string(res,dataForLoop[i].company),
                        mysql_real_escape_string(res,dataForLoop[i].currency),
                        mysql_real_escape_string(res,dataForLoop[i].cost),
                        mysql_real_escape_string(res,dataForLoop[i].image_url),
                        mysql_real_escape_string(res,style),
                        mysql_real_escape_string(res,dataForLoop[i].country),
                        mysql_real_escape_string(res,dataForLoop[i].supplier_no),
                        mysql_real_escape_string(res,dataForLoop[i].po_supplier_no) 
                    ];
                    epc_details_data_array.push(temp2);
                }

                insertquery_epc_details = "INSERT INTO product_item_master_2 ("+
                    "`storeid`, " +
                    "`skucode`, " +
                     "`item_code`, " +
                    "`product_name`, " +
                    "`product_des`, " +
                    "`epc`, " +
                    "`last_detected_time`, " +
                    "`user`, " +
                    "`zone`, " +
                    "`departmentid`, " +
                    "`brand`, " +
                    "`color`, " +
                    "`size`, " +
                    "`sfsr`, " +
                    "`status`, " +
                    "`group_name`, " +
                    "`group_description`, " +
                    "`dept`, " +
                    "`departmentname`, " +
                    "`brand_description`, " +
                    "`barcode`, " +
                    "`model`, " +
                    "`subgroup`, " +
                    "`sgroup`, " +
                    "`ean_no`, " +
                    "`sp_net`, " +
                    "`season`, " +
                    "`vat`, " +
                    "`sales_area`, " +
                    "`sp_gross_eng`, " +
                    "`sp_gross_arb`, " +
                    "`supplier_item_no`, " +
                    "`supplier_name`, " +
                    "`type_no`, " +
                    "`arabic_desc`, " +
                    "`origin`, " +
                    "`english_desc`, " +
                    "`company`, " +
                    "`currency`, " +
                    "`cost`, " +
                    "`image_url`, " +
                    "`style`, " +
                    "`country`, " +
                    "`supplier_no`, " +
                    "`po_supplier_no` " +
                    " ) " +
                    " VALUES ? ";
                try{

                    mysqlMain2.query(insertquery_epc_details, [epc_details_data_array], function(error, results, fields) {
                        
                        console.log(error);
                        res.status(200).send({
                            error: "0",
                            message: "Product added",
                        });
                    });
                     
                } catch (e) {

                
                }

            } else {

                res.status(400).send({
                    error: "1",
                    message: "Invalid Access Token !",
                });
            }
        } else {
            res.status(400).send({
                error: "1",
                message: "Access Token Is missing !",
            });
        }

});

function fix_from_pm_table(tag_id)
{

}
function fix_asn_issue(tagids_list)
{

    var tagids_list = tagids_list;
   
    var parse_new = parse;
    var select_query = "SELECT * FROM asn_items where asn in("+tagids_list+") and is_deleted='0';"
    
    mysql.queryCustom(select_query).then(function(result) {
     
        console.log(parse);
        var myObj           =   {};
        var select_query    =   '';
        var tag_id          =   '';
        var sku             =   '';
        var sku_parts       =   '';
        var update_query    =   ''; 
        var update_frm_pm   =   '';
        var sku_int         =   '';
        for(k=0; k<result.results.length; k++)
        {
         
            if(result.results[k].sku==null)
            {
                
                sku_parts    = parse_new.parse(result.results[k].tag_id);
                sku          = sku_parts.Sku;
                sku_int      = parseInt(sku,10);
                if(sku_int>0)
                {
                    update_query  += "update  asn_items set sku='"+sku_int+"' where "+
                                     " tag_id='"+result.results[k].tag_id+"';"

                    update_frm_pm += `UPDATE asn_items a
                                    INNER JOIN product_item_master b ON a.sku = b.item_code
                                    SET a.color = b.color, 
                                        a.brand = b.brand,
                                        a.style = b.style,
                                        a.department = b.departmentname`+
                                    " WHERE a.sku='"+sku_int+"'; ";   
                }   
            }
        }
        
        // console.log(update_query);
        // console.log(update_frm_pm);

        if(update_query!="")
        {
            mysql.queryCustom(update_query).then(function (){
                mysql.queryCustom(update_frm_pm).then(function (){

                }); 
            });  
        }
    }).catch(err => {
        console.log(JSON.stringify(err));
        console2.log('Error', err, '51 roit core service issue');
    });
}


function get_zpl_data_from_epc(epc_list){

    return new Promise((resolve, reject) => {
        
  
        var select_query = "SELECT * FROM zpl_printer  where  epc in("+epc_list+") ;"
    
        mysql.queryCustom(select_query).then(function(result) {

            
            var my_ar = {};
            var myObj = {};
            
            for(k=0; k<result.results.length; k++)
            {
                myObj = {
                 
                    Supplier_ID:result.results[k].Supplier_ID ,
                    Shipment_no:result.results[k].Shipment_no ,
                    suppliername:result.results[k].suppliername,
                    PO_NO:result.results[k].PO_NO,
                    Comment:result.results[k].Comments
                   
                };
                my_ar[result.results[k].epc]=myObj;
            }

            let sendparam = {
                db_data:my_ar
               
            }

            resolve(sendparam);
        }).catch(err => {
            console2.log('Error', err, 'get_zpl_data_from_epc select query issue');
        });
    });
}
router.post('/add_goods', (req, res, next) => {
    var data = req.body;

    var token = access_token;
    console2.execution_info('add_goods');
    console2.log_entry("/add_goods",req.body);

   
    

    if (req.headers.apikey == token ) {

        var data_stringify = JSON.stringify(data)

        var writeData = JSON.parse(data_stringify);
        var total_results = writeData;
        var dateSplit = '';
        var storename = '';
        var Retail_CycleCountID = '';
        var temp = [];
        var temp2 = [];
        var goods_rec = [];
        var epc_details_data_array = [];

        var total_goods = total_results.length;
        var epc_query_new = '';
        var remove_duplication_SP = '';
        var storeName = total_results[0].Store; 


        
        var batchid   = total_results[0].Retail_ItemBatchID;
        var headers_obj = '';
        aduit_Add.send(
            'Manually Goods job running for store '+storeName, 
            'audit_json',
            'good',
            '',storeName,
            '',
            batchid
        );
        var update_goods_item_store = '';

        var epc_list='';
        for (var i = 0; i < total_results.length; i++) {
            epc_list += "'"+total_results[i].epc+"',";
        }

        epc_list = epc_list.slice(0, -1)




        get_zpl_data_from_epc(epc_list).then(function(returnData){
      
            var zpl_data  = returnData.db_data;

            for (var i = 0; i < total_results.length; i++) {



                if(total_results[i].date)
                {
                    dateSplit = dateFormat(total_results[i].date, "yyyy-mm-dd HH:MM:ss");
                }
                else
                {
                    console2.log('Error', '', 'date field missing in payload');
                    return res.status(500).send({
                        error: "1",
                        message: "date field missing in payload",
                        system_msg:""
                    });
                }

                if(!(total_results[i].Retail_ItemBatchID))
                {
                    console2.log('Error', '', 'Retail_ItemBatchID field missing in payload');
                    return res.status(500).send({
                        error: "1",
                        message: "Retail_ItemBatchID field missing in payload",
                        system_msg:""
                    });
                }


                if(!(total_results[i].Store))
                {
                    console2.log('Error', '', 'Store field missing in payload');
                    return res.status(500).send({
                        error: "1",
                        message: "Store field missing in payload",
                        system_msg:""
                    });
                }

                if(!(total_results[i].refno))
                {
                    console2.log('Error', '', 'refno field missing in payload');
                    return res.status(500).send({
                        error: "1",
                        message: "refno field missing in payload",
                        system_msg:""
                    });
                }

                

 

                if(!(total_results[i].epc))
                {
                    console2.log('Error', '', 'epc field missing in payload');
                    return res.status(500).send({
                        error: "1",
                        message: "epc field missing in payload",
                        system_msg:""
                    });
                }
                
                
                storename = total_results[i].Store;
                Retail_CycleCountID = total_results[i].Retail_ItemBatchID;
                
                var po_no   = total_results[i].Purchase_Order;
                var sup_no  = total_results[i].Supplier_Number;
                var ship_no = total_results[i].Shipment_Number;
                var comment = total_results[i].Comments;
                var epc     = total_results[i].epc;
                

                if(po_no=="")
                {
                    if(zpl_data[epc])
                    {
                       if(zpl_data[epc].PO_NO)
                       {
                            po_no = zpl_data[epc].PO_NO;
                       } 
                    }   
                }


                if(sup_no=="")
                {
                    if(zpl_data[epc])
                    {
                       if(zpl_data[epc].Supplier_ID)
                       {
                            sup_no = zpl_data[epc].Supplier_ID;
                       } 
                    }   
                }


                if(ship_no=="")
                {
                    if(zpl_data[epc])
                    {
                       if(zpl_data[epc].Shipment_no)
                       {
                            ship_no = zpl_data[epc].Shipment_no;
                       } 
                    }   
                }

                if(comment=="")
                {
                    if(zpl_data[epc])
                    {
                       if(zpl_data[epc].Comment)
                       {
                            comment = zpl_data[epc].Comment;
                       } 
                    }   
                }

                temp = [

                    dateSplit,
                    total_results[i].Retail_ItemBatchID,
                    sup_no,
                    ship_no,
                    total_results[i].Store,
                    total_results[i].refno,
                    po_no,
                    comment,
                    total_results[i].id,
                    epc,
                    total_results[i].remarks
                ];
                headers_obj += total_results[i].epc+ ','
                update_goods_item_store +=" CALL update_goods_item_store('"+total_results[i].epc+"'); ";   



                goods_rec.push(temp);


                checkdatenow = dateFormat(now, "yyyy-mm-dd");


                temp2 = [

                    total_results[i].epc,
                    'na',
                    'na',
                    'na',
                    'na',
                    'na',
                    'na',
                    checkdatenow,
                    total_results[i].Store,
                    'na',
                    'good',
                ];

                epc_details_data_array.push(temp2);

                epc_query_new += "CALL add_epc_rec('" + Retail_CycleCountID + "'," +
                    " '" + total_results[i].Store + "','" + total_results[i].epc + "'," +
                    "'0','0', " +
                    "'0','0','0','" +
                    checkdatenow + "');";

               //console.log(epc_query_new);

            }



            const epc_send = headers_obj.slice(',', -1);
            aduit_Add.send(
                'Manually Goods job run successfully for store '+storename+' '+
                'Total '+total_goods+' items inserted in goods successfully',
                'audit_json',
                'good', 
                '',
                storename,
                '',
                Retail_CycleCountID
            );

            var insert_query = "INSERT INTO goods_item_store (`date`, `retail_item_batch_id`," +
                                " `supplier_number`, `shipment_number`," +
                                " `store`, `refno`,`purchase_order`, `comments`," +
                                " `id`,`epc`,`remarks`) VALUES ? "

            var insertquerydetails = "INSERT INTO epc_detail (`epc`, " +
                "`item_code`, `Retail_CycleCountID`, " +
                " `department`, `brand`, `color`, `size`,`date`," +
                "`store_id`,`zone`,`action_done`) " +
                " VALUES ? ";


            mysqlMain2.query(insert_query, [goods_rec], function(err) {



                mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {
                    if(err){
                       console2.log('Error', err, 'Goods_api Insert epc_detail query error');
                    }
                   
                });
                mysqlMain2.query(epc_query_new, function(err) {
                    if(err)
                    {
                      console2.log('Error', err, 'Goods_api call add_epc_rec query error');
                    }
                   
                });
                

                setTimeout(function(){
                    remove_duplication_SP = 
                    "CALL goods_item_store_duplication('"+storename+"','"+Retail_CycleCountID+"');"; 


                    mysqlMain2.query(remove_duplication_SP, function(err) {
                        if(err)
                        {
                           console2.log('Error', err, 'Goods_api remove_duplication_SP query error');
                        }

                        mysqlMain2.query(update_goods_item_store, function(err) {
                            if(err)
                            {
                              console2.log('Error', err, 'Goods_api update_goods_item_store query error ');
                            }
                        });
                    });

                },3000);

                if(err)
                {
                    console2.log('Error', err, 'Goods_api main query error');
                    res.status(500).send({
                        error: "0",
                        message: "Goods_api main query error!",
                        system_msg:JSON.stringify(err)
                    });
                    
                }
                else
                {
                    res.status(200).send({
                        error: "0",
                        message: "Goods added successfully !",
                        system_msg:" Submitted EPC "+epc_send 
                    });
                }
               
            });    

        });
           

    }else{
        res.end("Api key not validate");
    }


});

function isValidDate(txtDate)
{
     var currVal = txtDate;
    if(currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null) 
        return false;

    //Checks for mm/dd/yyyy format.
    dtMonth = dtArray[1];
    dtDay= dtArray[3];
    dtYear = dtArray[5];        

    if (dtMonth < 1 || dtMonth > 12) 
        return false;
    else if (dtDay < 1 || dtDay> 31) 
        return false;
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
        return false;
    else if (dtMonth == 2) 
    {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
                return false;
    }
    return true;
};

router.post('/add_asn', async (req, res, next) => {

    console2.execution_info('add_asn');
    console2.log_entry("/add_asn",req.body);
    
    var data = req.body;

    var token = access_token;



    if (req.headers.apikey == token) {


        var data_stringify = JSON.stringify(data)

        var writeData = JSON.parse(data_stringify);


        var dataForLoop = writeData;
        var source = ''

        var remarks_string = '';
        var datetime = '';
        var temp = [];
        var items = '';
        var asn_epc_rec = [];
        var epc_query_sp = '';
        var my_insert_asn_master = '';
        var epc_details_data_array = [];
        var temp2 = [];
        var source2 = '';
        var destination = '';
        var asn = '';
        var process_status = '';
        var status = '';
        var destination = '';
        var asn_data_str = '';
        var insertquery_epc_details = '';
        var update_query = '';
        var delete_query22 = '';

        var event_status    = ''; 
       
        var event_ref_id    ='';
        var update_str      ='';
       
        var repetition_delete='';
        var asn_list ='';
        var ibt_send ='';
        var destination_fix_asn = '';
        
        for (var i = 0; i < dataForLoop.length; i++) {

          
           
           ibt_send = dataForLoop[i].asn;
            
            /*---------------------validation-----------------------------------*/
            if(dataForLoop[i].asn)
            {
                asn = dataForLoop[i].asn;
            }
            else
            {
                console2.log('Error', '', 'asn field missing in payload');
                   
                return res.status(500).send({
                    error: "1",
                    message: "asn field missing in payload",
                    system_msg:""
                });
            }

            if(dataForLoop[i].source)
            {
                source = dataForLoop[i].source;
            }
            else
            {
                
                console2.log('Error', '', 'source field missing in payload');
                return res.status(500).send({
                    error: "1",
                    message: "source field missing in payload",
                    system_msg:""
                });
            }


            if(dataForLoop[i].destination)
            {
                destination = dataForLoop[i].destination;
            }
            else
            {
               // console2.log('Error', '', 'destination field missing in payload');
              
            }


            if(dataForLoop[i].status)
            {
                status = dataForLoop[i].status;
            }
            else
            {
                console2.log('Error', '', 'status field missing in payload');
                return res.status(500).send({
                    error: "1",
                    message: "status field missing in payload",
                    system_msg:""
                });
            }

           //console.log(dataForLoop);
            if(dataForLoop[i].event_ref_id)
            {
                event_ref_id = dataForLoop[i].event_ref_id;
            }
            else
            {
                console2.log('Error', '', 'event_ref_id field missing in payload =='+dataForLoop[i].event_ref_id);
                return res.status(500).send({
                    error: "1",
                    message: "event_ref_id field missing in payload",
                    system_msg:""
                });
            }

            if(dataForLoop[i].event_date)
            {
               // if(isValidDate(dataForLoop[i].event_date))
                //{
                dateTime = dateFormat(dataForLoop[i].event_date, "yyyy-mm-dd HH:MM:ss");
                // }
                // else
                // {
                //     return res.status(500).send({
                //         error: "1",
                //         message: "event_date field format not valide",
                //         system_msg:""
                //     }); 
                // }
                
            }
            else
            {
                console2.log('Error', '', 'event_date field missing in payload');
                return res.status(500).send({
                    error: "1",
                    message: "event_date field missing in payload",
                    system_msg:""
                });
            }

            items = dataForLoop[i].items;
            var tag_ids = '';
            for (var z = 0; z < items.length; z++) 
            {
                tag_ids += "'"+items[z].tag_id+"',"; 
                items[z].original_location,
                items[z].process_status,

                dataForLoop[i].status,
                items[z].tag_id,
                dataForLoop[i].destination,
                dataForLoop[i].asn,
                items[z].store_id,
                dateTime,
                items[z].departmentid,
                items[z].brand,
                items[z].sku

                if(!(items[z].original_location))
                {
                    console2.log('Error', '', 'original_location field missing in payload item object');
                    return res.status(500).send({
                        error: "1",
                        message: "original_location field missing in payload item object",
                        system_msg:""
                    });
                }
                if(!(items[z].process_status))
                {
                    console2.log('Error', '', 'process_status field missing in payload item object');
                    return res.status(500).send({
                        error: "1",
                        message: "process_status field missing in payload item object",
                        system_msg:""
                    });
                }
               
                if(!(items[z].tag_id))
                {
                    console2.log('Error', '', 'tag_id field missing in payload item object');
                    return res.status(500).send({
                        error: "1",
                        message: "tag_id field missing in payload item object",
                        system_msg:""
                    });
                }
               
                
                if(!(items[z].store_id))
                {
                    console2.log('Error', '', 'store_id field missing in payload item object');
                    return res.status(500).send({
                        error: "1",
                        message: "store_id field missing in payload item object",
                        system_msg:""
                    });
                }
                // if(!(items[z].departmentid))
                // {
                //     console2.log('Error', '', 'departmentid field missing in payload item object');
                //     return res.status(500).send({
                //         error: "1",
                //         message: "departmentid field missing in payload item object",
                //         system_msg:""
                //     });
                // }
                if(!(items[z].brand))
                {
                    console2.log('Error', '', 'brand field missing in payload item object');
                    return res.status(500).send({
                        error: "1",
                        message: "brand field missing in payload item object",
                        system_msg:""
                    });
                }
                if(!(items[z].sku))
                {
                    console2.log('Error', '', 'brand field missing in payload item object');
                    return res.status(500).send({
                        error: "1",
                        message: "sku field missing in payload item object",
                        system_msg:""
                    });
                } 

            }
           
            asn_list += "'"+asn+"', ";
            var remarks_string='';
           
            if (dataForLoop[i].status == 'packing') {
                remarks_string = 
                     "  packing_remarks= '" + dataForLoop[i].event_remarks +"' , packing_date = '" + dateTime +"' , status = 'open' "+

                     " , packing_status ='"+event_status+"'  , packing_ref_list_id ='"+event_ref_id+"'  ";
            
            } else if (dataForLoop[i].status == 'shipping') {
                remarks_string = 
                    "  shipping_remarks= '" + dataForLoop[i].event_remarks + "' , shipping_date= '" + dateTime + "' , status = 'intransit' "+
                    " , shipping_status ='"+event_status+"'  , shipping_ref_list_id ='"+event_ref_id+"'  ";
            } else if (dataForLoop[i].status == 'receiving') {
                remarks_string = "  receiving_remarks= '" + dataForLoop[i].event_remarks + "' ,receiving_date = '" + dateTime + "' , status = 'closed'  "+
                " , receiving_status ='"+event_status+"'  , receiving_ref_list_id ='"+event_ref_id+"'  ";
            }

            items = dataForLoop[i].items;
            //console.log(remarks_string);

            var returnData = await get_shipping_dtl(tag_ids);
            //console.log("5555555555");
            console.log(returnData);
            //res.end("aaaaa");

            for (var z = 0; z < items.length; z++) {

                
                process_status = items[z].process_status;

                temp = [
                    items[z].original_location,
                    items[z].process_status,
                    dataForLoop[i].status,
                    items[z].tag_id,
                    dataForLoop[i].destination,
                    dataForLoop[i].asn,
                    items[z].store_id,
                    dateTime,
                    items[z].departmentid,
                    items[z].brand,
                    items[z].sku,
                    returnData[items[z].tag_id],
                ];

                asn_epc_rec.push(temp);


                temp2 = [
                    items[z].tag_id,
                    'na',
                    'na',
                    'na',
                    'na',
                    'na',
                    'na',
                    dateTime,
                    items[z].original_location,
                    'na',
                    dataForLoop[i].status,
                ];

                epc_details_data_array.push(temp2);

                epc_query_sp += "CALL add_epc_rec('0'," +
                    " '" + items[z].store_id + "','" + items[z].tag_id + "'," +
                    "'" + items[z].skucode + "','0', " +
                    "'0','0','0','" +
                    dataForLoop[i].event_date + "');";

                //console.log(update_query);

            }

            my_insert_asn_master += " INSERT INTO  asn_master (`date`, `asn`,`status`)" +
                "SELECT * FROM (SELECT '" + dateTime + "'," +
                " '" + dataForLoop[i].asn + "','" + dataForLoop[i].status + "') AS tmp " +
                " WHERE NOT EXISTS (SELECT asn FROM asn_master " +
                " WHERE asn = '" + dataForLoop[i].asn + "'  ) LIMIT 1; ";

            if (destination == '') {

                desti = '';

            } else {

                desti = destination;
            }
           
            
            source = ''
            if (status == 'packing' || status == 'shipping') {
                source = " source='" + dataForLoop[i].source + "', "
            }
            update_str='';
            if (status == 'packing') 
            {
                  update_str = " `date` = '"+dateTime+"', " ;
            }
            else
            {
                update_str = " `date` = packing_date, " ;
            }
           //console.log(update_str);                    

            if(status == "packing"){

                update_query += " update asn_master set " + source +
                update_str+
                " destination = '" + desti + "'," +
                " packed_item = (select COUNT(process) from asn_items where " +
                " process='packing' AND asn = '" + asn + "' and is_deleted=0), " +
                " " + remarks_string +
                " , `status` = Case " +
                " When received_item > 0 Then 'receiving' " +
                " When transferred_item > 0 Then 'shipping' " +
                " When packed_item > 0 Then 'packing'" +
                "End WHERE asn = '" + asn + "';";

            }


            if(status == "shipping"){

                update_query += " update asn_master set " + source +
                update_str+
                " destination = '" + desti + "'," +
                " transferred_item = (select COUNT(process) from asn_items "+ 
                " where process='shipping' AND asn = '" + asn + "' and is_deleted=0 ), " +
                " " + remarks_string +
                " , `status` = Case " +
                " When received_item > 0 Then 'receiving' " +
                " When transferred_item > 0 Then 'shipping' " +
                " When packed_item > 0 Then 'packing'" +
                "End WHERE asn = '" + asn + "';";

                destination_fix_asn += "CALL fix_destinaion_asn ('"+asn+"');"

            }


            if(status == "receiving"){

                update_query += " update asn_master set " + source +
                update_str +
                " destination = '" + desti + "'," +
                " received_item = (select COUNT(process) from asn_items where process='receiving' "+ 
                " AND asn = '" + asn + "' and is_deleted=0)," +
                " " + remarks_string +
                " , `status` = Case " +
                " When received_item > 0 Then 'receiving' " +
                " When transferred_item > 0 Then 'shipping' " +
                " When packed_item > 0 Then 'packing'" +
                "End WHERE asn = '" + asn + "';";

            }

           
            repetition_delete += "CALL asn_fix_321 ('"+asn+"','"+status+"');";

        }


        //end here
        //console.log(asn_epc_rec);



        asn_data_str = "INSERT INTO asn_items (" +
            " original_location," +
            " process_status, " +
            " process," +
            " tag_id, " +
            " destination_location," +
            " asn," +
            " store_id, " +
            " date , " +
            " department , " +
            " brand , " +
            " sku , " +
            " shipment_number  " +
            ") VALUES ? ";
            

        mysqlMain2.query(asn_data_str, [asn_epc_rec], function(err) {

            if (err) {
               console2.log('Error', err, 'asn_items insert query error');

                return res.status(500).send({
                    error: "1",
                    message: "asn_items insert query error",
                    system_msg:JSON.stringify(err)
                });
            }

                  
            mysqlMain2.query(my_insert_asn_master, function(error, results, fields) {

                if (error) {
                    console2.log('Error', error, 'asn_master insert query error');
                    return res.status(500).send({
                        error: "1",
                        message: "asn_master insert query error",
                        system_msg:error
                    });

                }


                mysql.queryCustom(update_query).then(function(result) {
                    if (result.status == "1") {
                       
                        mysqlMain2.query(repetition_delete, function(err) {
                            if (err) {
                                console2.log('Error', err, 'asn repetition_delete  error');
                                return res.status(500).send({
                                    error: "1",
                                    message: "asn repetition_delete  error",
                                    system_msg: JSON.stringify(result.error)
                                });

                            }
                            else
                            {
                                console2.log('Info', '', 'IBT Inserted Successfully');
                                return res.status(200).send({
                                    error: "0",
                                    message: "IBT Inserted Successfully",
                                    system_msg : "Submitted ASN "+ ibt_send
                                });

                            }
                            asn_list = asn_list.substring(0, asn_list.length - 2);

                            fix_asn_issue(asn_list);

                            setTimeout(function(){
                                mysqlMain2.query(destination_fix_asn, function(err) {
                                    console.log(err);
                                })
                            },1000)

                        });

                    } else {
                        
                        console2.log('Error', result.error, 'asn update_query  error');
                                
                   
                        return res.status(500).send({
                            error: "1",
                            message: "asn update_query  error",
                            system_msg: JSON.stringify(result.error)
                        });

                        
                    }

                   
                }).catch(function(error) {
                    console2.log('Error', error, 'asn update_query  error2');
                    return res.status(500).send({
                        error: "1",
                        message: "asn update_query  error",
                        system_msg: JSON.stringify(error)
                    });

                });

            });

            insertquery_epc_details = "INSERT INTO epc_detail (`epc`, " +
                "`item_code`, `Retail_CycleCountID`, " +
                " `department`, `brand`, `color`, `size`,`date`," +
                "`store_id`,`zone`,`action_done`) " +
                " VALUES ? ";


            mysqlMain2.query(epc_query_sp, function(err) {
             
                mysqlMain2.query(insertquery_epc_details, [epc_details_data_array], function(err) {
                    if (err) {
                        console2.log('Error', JSON.stringify(err), ' API insert in epc details error');
                        console2.log('Error', JSON.stringify(err), '475-asndata API insert in epc details process name ' + process_status);
                    }

                });


            });

        });


        
    }
    else
    {
        console2.log('Error', '', 'Api key not validate');
        res.status(500).send({
            error: "1",
            message: "Api key not validate",
        });
    }
});

function get_shipping_dtl(var_tag_ids) {

    return new Promise((resolve, reject) => {
        var tag_ids = var_tag_ids.replace(/,\s*$/, ""); 
        var new_query22 = "SELECT epc,Shipment_no FROM zpl_printer WHERE epc IN ("+tag_ids+") ";
        //var new_query22 = " SELECT epc,Shipment_no FROM zpl_printer WHERE epc IN ('303400005043188000264CC8','30340000504300C000264CC7','30340C652057E90000000158') ";
        mysql.queryCustom(new_query22).then(function(result) {
            var shipment_no = [];
            var shipment_nos = result.results;
            for (var i = 0; i < shipment_nos.length; i++) {
                shipment_no[shipment_nos[i].epc] = shipment_nos[i].Shipment_no;
            }
            resolve(shipment_no);
        })
        .catch(function(error) {
            console.log(error);
        });
    });
}

function Check_EPC_Exists(EPC, STATUS, STOREID,epc_data) {
   
    var epc_data22=epc_data;
    try {
        return new Promise((resolve, reject) => {

            var EPC2 = EPC;
            var STATUS2 = STATUS;
            var STOREID2 = STOREID;
            //console.log(EPC2);
            var cond = '';

            if (STATUS2 !== '' && STATUS2 !== undefined) {
                cond += " AND status = '" + STATUS2 + "'"
            }


            var error22 = '';

            var new_query22 = "SELECT * FROM " +
                " epc WHERE epc = '" + EPC2 + "' ";
           // console.log(new_query22);

            mysqlMain2.query(new_query22, (error, results, fields) => {


                var stringify_result = results;
                var InsertData2 = '';

                if (stringify_result !== '' && stringify_result.length !== 0) {

                    
                    error22 = "UpdateStatus";
                    InsertData2 = JSON.stringify(stringify_result[0])
               

                } else {
                    error22 = "NotExistsInEPC";
                    InsertData2 = JSON.stringify(epc_data22)
                }



                if (error) {
                    console2.log('Error', JSON.stringify(error.message), '306-Check_EPC_Exists');
                    return console.error(error.message);
                }

                let permssion_error = {
                    error: error22,
                    Data: InsertData2

                }

                resolve(permssion_error)
            });

        });
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '364-Check_EPC_Exists API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '371-Check_EPC_Exists API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
};

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
router.post('/epc_status_change', (req, res, next) => {

    console2.execution_info('epc_status_change');
    try {
        console2.log_entry("/epc_status_change",req.body);
        var now = new Date();
        var data = req.body;

        var cond = '';

        var data_stringify = '';

        var writeData = '';
        var insert_query = ''; 
        try {

            data_stringify = JSON.stringify(data)

            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }

        var data_epc = '';
        var status = '';
        //console.log(data_stringify);

        if (typeof writeData.Details !== 'undefined') {
            data_epc = writeData.Details[0];


        } else {
            console2.log('Error', 'please send proper json', '365-epc_status_change');
            res.status(400).send({
                error: "1",
                message: 'please send proper json',
            });

        }

        var access_token2 = data_epc.access_token;
        //console.log(data_epc);

        var epc = data_epc.EPC;
        status = data_epc.Status;
        var storeid = data_epc.StoreID;



        if (access_token2 !== '') {
            if (access_token2 == access_token) {


                Check_EPC_Exists(epc, status, storeid,data_epc).then(function(resultss) {
                    var data22 = '';
                    var response22 = '';

                    var store_id = '';
                    var epc = '';
                    var item_code = '';
                    var Retail_CycleCountID = '';
                    var last_detected_time = '';
                    var user = '';
                    var zone = '';
                    var department = '';
                    var brand = '';
                    var color = '';
                    var size = '';
                    var check_date = '';
                    var store_id_insert = '';
                    // console.log("ddddddddddddddddddddddd");
                    // console.log(resultss);
                    if (isJson(resultss.Data)) {
                        data22 = JSON.parse(resultss.Data);
                        response22 = data22;
                    }

                    store_id = (response22.store_id);
                    store_id_insert = (response22.store_id);
                    // console.log(response22);
                    epc = response22.epc;
                    item_code = response22.item_code;
                    Retail_CycleCountID = response22.Retail_CycleCountID;
                    last_detected_time = response22.last_detected_time;
                    user = response22.user;
                    zone = response22.zone;
                    department = response22.department;
                    brand = response22.brand;
                    color = response22.color;
                    size = response22.size;
                   

                    //status      = response22.Status;
                    
                    if (resultss.error == 'NotExistsInEPC') {
                        //console.log("===============================");
                     
                        epc = response22.EPC;
                        item_code = response22.sku;
                        Retail_CycleCountID='000';
                        last_detected_time = check_date;
                        user        = 'api_user';
                        zone        = '';
                        department  = '';
                        brand       = response22.brand_name;
                        color       = response22.color;
                        size        = response22.size;
                     
                        check_date  = dateFormat(now, "yyyy-mm-dd");


                        insert_query = "INSERT INTO `epc`(`store_id`, " +

                            "`epc`, " +
                            "`item_code`," +
                            " `Retail_CycleCountID`, `last_detected_time`, `user`, `zone`," +
                            "`department`, `brand`, `color`, `size`, `check_date`, `place`,`status`) " +
                            " VALUES " +
                            "('" + store_id_insert + "'," +
                            "'" + epc + "'," +
                            "'" + item_code + "'," +
                            "'" + Retail_CycleCountID + "'," +
                            "'" + check_date + "'" +
                            ",'" + user + "'," +
                            "'" + zone + "'," +
                            "'" + department + "'," +
                            " '" + brand + "'," +
                            "'" + color + "'," +
                            "'" + size + "'," +
                            "'" + check_date + "','no place','"+status+"')";
                        //console.log("======>>>>"+insert_query);




                        mysql.queryCustom(insert_query).then(function(result44) {

                            if (result44.status == "1") {

                                res.status(200).send({
                                    error: "0",
                                    message: "EPC Added"
                                });
                            } else {
                                console2.log('Error', result44.error, '960-epc_status_change');
                                res.status(400).send({
                                    error: "15555",
                                    message: result44.error,
                                });

                            }
                        }).catch(function(error) {
                            console2.log('Error', error, '969-epc_status_change');
                            res.status(400).send({
                                error: "16666",
                                message: JSON.stringify(error),
                            });
                        });

                     
                    }
                    else  
                    {
                       
                       
                        check_date = response22.check_date;


                        var update_query = "UPDATE epc set status = '"+status+"' WHERE epc = '" + epc + "'";
                        mysql.queryCustom(update_query).then(function(result33) {


                            var insert_query22 = "INSERT INTO `epc_detail`(`store_id`, " +

                                "`epc`, " +
                                "`item_code`," +
                                " `Retail_CycleCountID`, `last_detected_time`, `user`, `zone`," +
                                "`department`, `brand`, `color`, `size`, `date`, `action_done`) " +
                                " VALUES " +
                                "('" + store_id_insert + "'," +
                                "'" + epc + "'," +
                                "'" + item_code + "'," +
                                "'" + Retail_CycleCountID + "'," +
                                "'" + last_detected_time + "'" +
                                ",'" + user + "'," +
                                "'" + zone + "'," +
                                "'" + department + "'," +
                                " '" + brand + "'," +
                                "'" + color + "'," +
                                "'" + size + "'," +
                                "'" + check_date + "','"+status+"')";

                            //console.log(insert_query22);               

                            mysql.queryCustom(insert_query22).then(function(result44) {

                                if (result.status == "1") {
                                    res.status(200).send({
                                        error: "0",
                                        message: "Status Change Successfully"
                                    });

                                } else {
                                    console2.log('Error', result44.error, '461-epc_status_change');
                                    res.status(400).send({
                                        error: "1",
                                        message: result44.error,
                                    });

                                }
                            }).catch(function(error) {
                                console2.log('Error',error, '469-epc_status_change');
                                res.status(400).send({
                                    error: "1",
                                    message: error,
                                });
                            });

                        }).catch(function(error) {
                            console2.log('Error', error, '477-epc_status_change');
                            res.status(400).send({
                                error: "1",
                                message: error,
                            });
                        });
                    }

                    if (resultss.error == 'UpdateStatus') {
                        res.status(200).send({
                            error: "0",
                            message: "Status Change Successfully"
                        });
                    }  
                });
            } else {
                res.status(400).send({
                    error: "1",
                    message: "InValid Access Token !",
                });
            }
        } else {
            res.status(400).send({
                error: "1",
                message: "Access Token Is missing !",
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '569-epc_status_change API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '576-epc_status_change API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});



//  
router.post('/getAsnMasterData', (req, res, next) => {

    console2.execution_info('getAsnMasterData');
    try {
        console2.log_entry("/getAsnMasterData",req.body);
        var now = new Date();
        var data = req.body;

        var cond = '';

        var data_stringify = '';

        var writeData = '';
        try {

            data_stringify = JSON.stringify(data)

            writeData = JSON.parse(data_stringify);

        } catch (e) {
            console2.log('Error', 'JSON not valid', '543-getAsnMasterData');
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }

        var data_asn = '';
        //console.log(data_stringify);

        if (typeof writeData.Details !== 'undefined') {
            data_asn = writeData.Details[0];


        } else {
            console2.log('Error', 'JSON not valid', '561-getAsnMasterData');
            res.status(400).send({
                error: "1",
                message: 'please send proper json',
            });

        }

        var access_token2 = data_asn.access_token;

        var fromdate = data_asn.From_Date;

        var todate = data_asn.To_Date;

        var IBTs = data_asn.IBTs;

        var Source = data_asn.Source;

        var Destination = data_asn.Destination;

        var IBT_Process = data_asn.IBT_Process;

        var IBT_STATUS = data_asn.IBT_STATUS;

        var Packing_Date = data_asn.packing_date;
        var Shipping_Date = data_asn.shipping_date;
        var Receiving_Date = data_asn.receiving_date;



        if (access_token2 !== '') {
            if (access_token2 == access_token) {

                if (Packing_Date !== "" && Packing_Date !== 0 &&
                    Packing_Date !== "0" && Packing_Date !== undefined) {
                    cond += ' AND packing_date like "%' + Packing_Date + '%"'
                }

                if (Shipping_Date !== "" && Shipping_Date !== 0 &&
                    Shipping_Date !== "0" && Shipping_Date !== undefined) {
                    cond += ' AND shipping_date like "%' + Shipping_Date + '%"'
                }

                if (Receiving_Date !== "" && Receiving_Date !== 0 &&
                    Receiving_Date !== "0" && Receiving_Date !== undefined) {
                    cond += ' AND receiving_date like "%' + Receiving_Date + '%"'
                }


                if (Source !== "" && Source !== 0 &&
                    Source !== "0" && Source !== undefined) {
                    cond += ' AND source="' + Source + '"'
                }

                if (Destination !== "" && Destination !== 0 &&
                    Destination !== "0" && Destination !== undefined) {
                    cond += ' AND destination="' + Destination + '"'
                }

                if (IBT_STATUS !== "" && IBT_STATUS !== 0 && IBT_STATUS != "0" &&
                    IBT_STATUS !== undefined) {
                    cond += ' AND status="' + IBT_STATUS + '"'
                }

                if (IBTs !== "" && IBTs !== 0 && IBTs !== "0" && IBTs !== undefined) {

                    cond += ' AND asn="' + IBTs + '" '
                }


                if (fromdate !== '' && fromdate !== '0' &&
                    fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
                    fromdate == todate && todate !== undefined && fromdate !== undefined) {

                    var to_my_date = todate;

                    var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

                    cond += 'AND date = "' + to_date + '"'

                } else if (fromdate !== "" &&
                    fromdate !== 0 &&
                    fromdate !== "0" && todate != "" &&
                    todate !== 0 &&
                    todate !== "0" && todate !== undefined && fromdate !== undefined) {

                    var to_my_date = todate;

                    var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

                    var from_my_date = fromdate;

                    var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

                    //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 

                    // console.log('aaaaaaaaaaaa'); 
                    // console.log(todate); 
                    // console.log(fromdate);  


                    cond += 'and date > "' + from_date + '" and date <= "' + to_date + '"'

                } else if (fromdate !== "" &&
                    fromdate !== 0 &&
                    fromdate !== "0" && fromdate !== undefined) {

                    var from_my_date = fromdate;

                    var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

                    cond += 'AND date < "' + from_date + '"'


                } else if (todate !== "" &&
                    todate !== 0 &&
                    todate !== "0" && todate !== undefined) {

                    var to_my_date = todate;

                    var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

                    cond += ' AND date  < "' + to_date + '"'


                }


                var new_query = " SELECT SUM(packed_item) AS packed_items ," +
                    " SUM(transferred_item) AS transfer_items ," +
                    " SUM(received_item) AS reveived_items ," +
                    " status," +
                    " `packing_remarks`, `shipping_remarks`, " +
                    " `receiving_remarks`,`date`,`asn`," +
                    " `source`,`destination`" +
                    " FROM `asn_master` WHERE 1 " + cond +
                    " GROUP BY asn"

                //console.log(new_query);
                mysql.queryCustom(new_query).then(function(result) {

                    if (result.status == "1") {

                        var respondData = JSON.stringify(result.results);
                        var response = JSON.parse(respondData)
                        //console.log(response.length);

                        if (response.length > 0) {

                            var total_length = response.length;
                            var return_data = [];


                            for (var i = 0; i < response.length; i++) {

                                var row_data = {
                                    "packed_items": response[i].packed_items,
                                    "transfer_items": response[i].transfer_items,
                                    "reveived_items": response[i].reveived_items,
                                    "IBTS": response[i].asn,
                                    "Source": response[i].source,
                                    "Destination": response[i].destination,
                                    "IBT_STATUS": response[i].status,
                                    "packing_remarks": response[i].packing_remarks,
                                    "shipping_remarks": response[i].shipping_remarks,
                                    "receiving_remarks": response[i].receiving_remarks,
                                    "date": response[i].date
                                };


                                return_data.push(row_data);
                            }


                            res.status(200).send('{"error":"0","total":' + total_length + ',"Data":' + JSON.stringify(return_data) + '}');
                        } else {
                            res.status(200).send('{"error":"0","total":"0","Data":""}');
                        }


                    } else {


                        console2.log('Error', result.error, '748-getAsnMasterData');
                        res.status(400).send({
                            error: "1",
                            message: result.error,
                        });

                    }
                }).catch(function(error) {
                    console2.log('Error', result.error, '756-getAsnMasterData');
                    res.status(400).send({
                        error: "1",
                        message: error,
                    });
                });

            } else {
                res.status(400).send({
                    error: "1",
                    message: "InValid Access Token !",
                });
            }
        } else {
            res.status(400).send({
                error: "1",
                message: "Access Token Is missing !",
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '833-getAsnMasterData API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '840-getAsnMasterData API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});

router.post('/GetAsnItemsDetail', (req, res, next) => {

    console2.execution_info('GetAsnItemsDetail');

    try {
        console2.log_entry("/GetAsnItemsDetail",req.body);
        var now = new Date();
        var data = req.body;

        var cond = '';

        var data_stringify = '';

        var writeData = '';


        try {

            data_stringify = JSON.stringify(data)

            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }


        var data_asn = '';
        //console.log(data_stringify);

        if (typeof writeData.Details !== 'undefined') {
            data_asn = writeData.Details[0];
        } else {
            console2.log('Error', 'please send proper json', '821-GetAsnItemsDetail');
            res.status(400).send({
                error: "1",
                message: 'please send proper json',
            });

        }



        var from_date = data_asn.From_Date;
        var to_date = data_asn.To_Date;
        var asn = data_asn.IBTs;
        var source = data_asn.Source;
        var destination = data_asn.Destination;
        var ibt_process = data_asn.IBT_Process;
        var ibt_status = data_asn.IBT_STATUS;
        var token = data_asn.access_token;

        var cond = '';
        var join_cond = '';
        if (from_date != "" && from_date != 0 && from_date != "0" && from_date != undefined) {
            cond += "and asn_master.date >='" + from_date + "'";
        }
        if (to_date != "" && to_date != 0 && to_date != "0" && to_date != undefined) {
            cond += "and asn_master.date <='" + to_date + "'";
        }
        if (asn != "" && asn != 0 && asn != "0" && asn != undefined) {
            cond += "and asn_master.asn ='" + asn + "'";
        }
        if (destination != "" && destination != 0 && destination != "0" && destination != undefined) {
            cond += "and asn_master.destination ='" + destination + "'";
        }
        if (source != "" && source != 0 && source != "0" && source != undefined) {
            cond += "and asn_master.source ='" + source + "'";
        }
        if (ibt_process != "" && ibt_process != 0 && ibt_process != "0" && ibt_process != undefined) {
            cond += "and asn_master.status ='" + ibt_process + "'";
        }

        //and asn_items.process_status='"+ibt_status+"'
        var res2 = res;
        if (token == access_token) {
            var new_query = "SELECT *, count(sku) as sku_total," +
                " asn_items.sku,asn_master.source,asn_master.destination,asn_master.status FROM asn_master  " +
                " LEFT JOIN asn_items ON asn_items.asn = asn_master.asn " +
                " where 1 " + cond + "  GROUP by asn_items.asn";
            //res.end(new_query);
            mysql.queryCustom(new_query).then(function(result) {

                    var getAsnData = JSON.stringify(result.results);

                    var response = JSON.parse(getAsnData)
                    //console.log(getAsnData);
                    var total_length = response.length;
                    var skudata = [];
                    if (response.length > 0) {
                        //console.log("hello");
                        for (var i = 0; i < response.length; i++) {
                            var row_data = {
                                'SKU': response[i].sku,
                                'ASN': response[i].asn,
                                'sku_total': response[i].sku_total,
                                'source': response[i].source,
                                'destination': response[i].destination,
                                'ibt_process': response[i].status
                            }

                            skudata.push(row_data);

                        }

                    }
                    //console.log(skudata);
                    res.status(200).send('{"error":"0","total":' + total_length + ',"Data":' + JSON.stringify(skudata) + '}');


                    // res.status(200).send({
                    //     error: "0",
                    //     'Data': JSON.stringify(skudata),     
                    // });  
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '906-GetAsnItemsDetail');
                    res.status(400).send({
                        error: "1",
                        message: "DB Fetch error" + JSON.stringify(error),
                    });
                });

        } else {
            res.status(400).send({
                error: "1",
                message: "Invalid Token",
            });
        }


    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '984-GetAsnItemsDetail API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '991-GetAsnItemsDetail API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


function check_exist(password, result, user_uuid) {
    try {
        return new Promise((resolve, reject) => {

            var stats22 = '0';
            var res22 = result;
            //console.log(res22);
            var data_base_uuid = '';
            var user_uuid2 = user_uuid;

            for (var kk = 0; kk < res22.length; kk++) {
                data_base_uuid = res22[kk].uuid;

                //console.log(data_base_uuid+"<====>"+user_uuid);



                if ((data_base_uuid) == (user_uuid2)) {
                    stats22 = '1';
                }

            }
            resolve(stats22);


        });
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1121-check_exist API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1228-check_exist API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
};


router.post('/login_access', (req, res, next) => {

    console2.execution_info('login_access');
    try {
        console2.log_entry("/login_access",req.body);
        var now = new Date();
        var username = req.body.username;
        var password = req.body.password;
        var token = req.body.token;

        var user_uuid = req.body.uuid;

        if (username !== '' && username !== undefined && password !== '' &&
            password !== undefined && token !== undefined && token !== '') {

            //console.log(check_status);
            if (password == '' || username == '') {

                res.status(400).send({
                    message: "Both username and password required",
                });

            }

            // console.log(access_token );
            if (token == access_token || token == 123456) {

                var data_base_uuid = '';

                var selectquery = "select * from handheld_devices where username= '" + username + "' ";
                mysql.queryCustom(selectquery)
                    .then(function(result) {

                        if (result.status == "1") {
                            if (result.results.length > 0) {

                                var resss = result.results;

                                var database_device_unique_id = result.results[0].device_unique_id;

                                var username22 = result.results[0].username;
                                var password22 = result.results[0].password;


                                var ns_connection = result.results[0].ns_connection;
                                var ss_connection = result.results[0].ss_connection;
                                var device_ip = result.results[0].device_ip;
                                var server_ip = result.results[0].server_ip;
                                var description = result.results[0].description;
                                var status = result.results[0].status;
                                var storeid = result.results[0].storeid;
                                var last_sync = result.results[0].last_sync;
                                var last_usages = result.results[0].last_usages;
                                var data_base_uuid = result.results[0].uuid;




                                if (password == result.results[0].password) {
                                    check_exist(password, resss, user_uuid).then(function(ressss2) {

                                        if (ressss2 == '1') {

                                            var CheckDate = dateFormat(now, "yyyy-mm-dd");

                                            var insert_query = "insert into handheld_devices (`device_unique_id`," +
                                                " `username`, `password`, `description`, `status`, `storeid`, `last_sync`," +
                                                " `last_usages`, `ns_connection`, `ss_connection`," +
                                                " `device_ip`, `server_ip`, `uuid`,`handheld_date`) values ('" + database_device_unique_id + "','" + username22 + "'," +
                                                "'" + password22 + "','" + description + "','" + status + "','" + storeid + "'," +
                                                "'" + last_sync + "','" + last_usages + "','" + ns_connection + "'," +
                                                "'" + ss_connection + "','" + device_ip + "','" + server_ip + "','" + user_uuid + "', '" + CheckDate + "')"

                                            mysql.queryCustom(insert_query).then(function(result) {
                                                if (result.status == "1") {

                                                } else {

                                                }
                                            }).catch(function(error) {
                                                console2.log('Error', JSON.stringify(error), '1206-login_access');
                                            });


                                        } else {

                                            var CheckDate2 = dateFormat(now, "yyyy-mm-dd");

                                            var update = "UPDATE `handheld_devices` " +
                                                " SET `uuid` = '" + user_uuid + "',`handheld_date`= '" + CheckDate2 + "'  WHERE  username = '" + username + "' and password = '" + password22 + "' ";

                                            mysql.queryCustom(update).then(function(result) {
                                                if (result.status == "1") {
                                                    // res.end(JSON.stringify(result.results));
                                                } else {
                                                    console2.log('Error', JSON.stringify(result.error), '1222-login_access');
                                                    //res.end(result.error);
                                                }
                                            }).catch(function(error) {
                                                console2.log('Error', JSON.stringify(error), '1225-login_access');
                                                //res.end(error);
                                            });
                                        }

                                        res.status(200).send({
                                            message: "Logged in Successfully",
                                        });



                                    });

                                } else {

                                    res.status(400).send({
                                        message: "Your Username or Password is incorrect",
                                    });
                                }

                            } else {
                                //response = 0;
                                res.status(400).send({
                                    message: "Username does not exist",
                                });

                            }
                        } else {
                            //response = 0;
                            res.status(400).send({
                                message: "Error Logging In",
                            });


                        }
                    })
                    .catch(function(error) {


                        res.status(400).send({
                            error: "1",
                            message: JSON.stringify(error),
                        });
                    })
            } else {

                res.status(400).send({
                    message: "Invalid Token",
                });

            }
        } else {
            //response = '1';
            res.status(400).send({
                message: "Field is missing !",
            });

        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1395-login_access API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1402-login_access API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/add_log', (req, res, next) => {
    console2.execution_info('add_log');
    try {
        var session = req.session;
        var now = new Date();
        //console.log('sadsdf');
        //log_text
        //log_json
        //log_type
        //device_id
        var log_text = '';
        var log_json = '';
        var log_type = '';
        var device_id = '';
        var store_id = '';
        var user_id = '';
        var token = req.body.token;

        if (req.body.log_text !== undefined && req.body.log_text !== "") {
            log_text = req.body.log_text;

        } else {

            res.status(400).send({
                message: "Please Enter  log_text !",
            });

        }
        if (req.body.log_json !== undefined && req.body.log_json !== "") {
            log_json = req.body.log_json;

        } else {

            res.status(400).send({
                message: "Please Enter  log_json !",
            });

        }
        if (req.body.log_type !== undefined && req.body.log_type !== "") {
            log_type = req.body.log_type;
            var log_info = '';
            if (log_type == 'warning') {
                log_info = 'warning'
            } else {
                log_info = "information"
            }


        } else {

            res.status(400).send({
                message: "Please Enter  log_type !",
            });


        }
        if (req.body.device_id !== undefined && req.body.device_id !== "") {
            device_id = req.body.device_id;
        } else {

            res.status(400).send({
                message: "Please Enter  device_id !",
            });
        }

        if (req.body.store_id !== undefined && req.body.store_id !== "") {
            store_id = req.body.store_id;
        } else {

            res.status(400).send({
                message: "Please Enter  store_id !",
            });
        }

        if (req.body.user_id !== undefined && req.body.user_id !== "") {
            user_id = req.body.user_id;
        } else {

            res.status(400).send({
                message: "Please Enter  user_id !",
            });


        }

        if (req.body.token !== undefined && req.body.token !== "") {

            var starttime = new Date();
            var isotime = new Date((new Date(starttime)).toISOString());
            var fixedtime = new Date(isotime.getTime() - (starttime.getTimezoneOffset() * 60000));
            var log_date_time = fixedtime.toISOString().slice(0, 19).replace('T', ' ');

            if (token == access_token) {

                var new_query = "INSERT INTO `tb_audit`" +
                    "(`audit_text`, `audit_json`, `log_type`, `date`, `deviceid`,`storeid`,`user_id`) " +
                    "VALUES " +
                    "('" + log_text + "','" + log_json + "','" + log_info + "'," +
                    "'" + log_date_time + "','" + device_id + "','" + store_id + "','" + user_id + "')";

                mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.status(200).send({
                                message: "Log Added Successfully !",
                            });
                            //res.end(JSON.stringify(result.results));
                        } else {
                            console2.log('Error', JSON.stringify(result.error), '1391-add_log');
                            res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1396-add_log');
                        res.end(error);
                    });
            } else {

                res.status(400).send({
                    message: "Invalid token !",
                });


            }
        } else {

            res.status(400).send({
                message: "Please Enter token !",
            });

        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1544-add_log API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1551-add_log API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/AddCronJobTask', (req, res, next) => {

    console2.log_entry("/AddCronJobTask",req.body);
    try {
        console2.execution_info('AddCronJobTask');
        var session = req.session;
        var Retail_CycleCountID = req.body.Retail_CycleCountID;
        var process_type = req.body.process_type;
        var destinationStore = req.body.destinationStore;

        var token = req.body.token;
        var store_id = req.body.store_id;
        var error_message = '';

        // res.end('aa');
        //console.log(req.body);
        if (req.body.Retail_CycleCountID !== undefined && req.body.Retail_CycleCountID !== ''

            &&
            req.body.process_type !== undefined && req.body.process_type !== '' &&
            req.body.token !== undefined && req.body.token !== '' &&
            req.body.store_id !== undefined && req.body.store_id !== ''

        ) {


            if (token == 'innovent@123') {
                var status = 0;
                if(process_type=="packing" || process_type=="shipping" || process_type=="receiving")
                {
                    status = 1;
                }
                var Addtask = "INSERT INTO cronjob_taks (Retail_CycleCountID,process_type,store_id,destinationStore, status) " +
                    "VALUES ('" + Retail_CycleCountID + "','" + process_type + "' , '" + store_id + "' , '" + destinationStore + "', '"+status+"')";


                mysql.queryCustom(Addtask).then(function(result) {
                    if (result.status == "1") {
                        res.status(200).send({
                            error: "0",
                            message: "Record Inserted",
                        });
                    } else {
                        res.status(400).send({
                            error: "1",
                            message: "Error!"
                        });
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1459-AddCronJobTask');
                    res.status(400).send({
                        error: "1",
                        message: JSON.stringify(error),
                    });
                });
            } else {


                res.status(400).send({
                    error: "1",
                    message: "Token Not Valid !",
                });

            }
        } else {
            res.status(400).send({
                error: "1",
                message: "Filed is missing !",
            });

        }


    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1631-AddCronJobTask API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1638-AddCronJobTask API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

});


router.post('/getCustomLogs', (req, res, next) => {

    console2.execution_info('getCustomLogs');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,10';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        // console.log(req.body.Date2);

        if (req.body.Date != "" && req.body.Date != "0" && req.body.Date != 0 && req.body.Date !== undefined) {
            cond += ' AND datetime like "%' + req.body.Date + '%" '
        }
        //console.log(req.body.dptid)
        if (req.body.Type != "" && req.body.Type != 0 && req.body.Type != "0" && req.body.Type !== undefined) {
            cond += ' AND type="' + req.body.Type + '" '
        }


        var new_query = "select * from logs where 1 " + cond + " order by id desc" + order_by_cond
        // console.log(new_query);
        var query_count = " select count(*) as `my_count` from (select * from logs where 1 " + cond + " ) sq ";
        // console.log(query_count);
        if (mysql.check_permission('logs', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query).then(function(result) {
                    getlogs = result.results;

                    var table_data = [];
                    for (var i = 0; i < getlogs.length; i++) {


                        var row_data = {
                            "id": parseInt(i + 1),
                            "type": getlogs[i].type,
                            "datetime": getlogs[i].datetime,
                            "custom_msg": unescape(getlogs[i].custom_msg),
                            "system_msg": unescape(getlogs[i].system_msg),

                        };

                        table_data.push(row_data);
                    }
                    //console.log(table_data);

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1554-getCustomLogs');
                    res.end(error);
                });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1558-getCustomLogs');
                res.end(error);
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1727-getCustomLogs API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1734-getCustomLogs API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/change_iot_status', (req, res, next) => {

    console2.execution_info('change_iot_status');
     try {
        var session = req.session;
        var now = new Date();
        var storename = '';
        var iot_date = '';
        
        
        var token = req.headers.apikey;

            
        if (req.headers.apikey !== undefined && req.headers.apikey !== "") {

            if (token == access_token) {


                if (req.body.storename !== undefined && req.body.storename !== "") {
                
                    storename = req.body.storename;

                } else {

                    return res.status(400).send({
                        message: "Please Enter  storename !",
                    });

                }


                if (req.body.iot_date !== undefined && req.body.iot_date !== "") {
                
                    iot_date = req.body.iot_date;

                } else {

                    return res.status(400).send({
                        message: "Please Enter  iot_date !",
                    });

                }


                var now = new Date();
               
                var CheckDate23 = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

               var update_query_iot = "update iot_notification set status='0',datetime= '"+CheckDate23+"' WHERE  "+ 
                            " iot_date='"+iot_date+"' and storename = '"+storename+"'";

                mysql.queryCustom(update_query_iot).then(function(result) {
                        if (result.status == "1") {
                            return res.status(200).send({
                                message: "Status update Successfully !",
                            });
                            //res.end(JSON.stringify(result.results));
                        } else {
                            console2.log('Error', JSON.stringify(result.error), '1391-change_iot_status');
                            res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1396-change_iot_status');
                        res.end(error);
                    });
            } else {

                return res.status(400).send({
                    message: "Invalid token !",
                });


            }
        } else {

            return res.status(400).send({
                message: "Please Enter token !",
            });

        }

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1544-change_iot_status');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1551-change_iot_status API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
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
