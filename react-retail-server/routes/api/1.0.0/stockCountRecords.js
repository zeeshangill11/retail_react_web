var express = require("express");
var router = express.Router();
var passport = require("passport");
const mysql = require("../../../controllers/mysqlCluster.js");
const commonFunctions = require("../../../commonFunction.js");
var bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
var dateFormat = require("dateformat");
var now = new Date();
var response = {};
const request = require('request');
const console2 = require("../../../controllers/customconsole.js");
const epc_parse = require("../../../controllers/epc-parser-fixed.js");

const fs = require('fs');

var access_token = mysql.globals.access_token;
const nodemailer = require("nodemailer");


// If environment is not production,
// load environment config

if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}

router.get('/update_time', (req, res, next) => {
    console2.execution_info('update_time');
    res.end("update at 12:08 PM 15 Aprail");
});

let transport = nodemailer.createTransport({
    host: 'mail.innodaba.com',
    port: 587,
    auth: {
       user: 'saqib@innodaba.com',
       pass: 'pJqX^++j;c@u'
    },
    tls: {
        rejectUnauthorized: false
    }
});



router.post('/New_CancelRequestAsn', (req, res, next) => {
    console2.execution_info('New_CancelRequestAsn');

    try {
        var session = req.session;

        var process_type = req.body.process_type
        var asn_id = req.body.asn_id;
        var storeid = '';
        var asn='';
        //console.log(">>>>>>>>>>>>>"+asn_id);

        var update_query = '';
        var new_query = "SELECT * FROM `asn_items` " +
            " WHERE 1  AND asn = '" + asn_id + "'";

        //console.log("<><><><><><>"+new_query);

        mysql.queryCustom(new_query).then(function(result) {


                if (result.status == "1") {

                    var total_results = result.results;

                    var item_for_cancel='';

                    for (var i = 0; i < total_results.length; i++) {

                        storeid = total_results[i].store_id;
                        storeid = storeid.split('000').join('');
                        asn     = total_results[i].asn;



                        item_for_cancel = item_for_cancel+'{"group":">RUBAIYATDEV","thingTypeCode":"ITEM",' +
                            '"serialNumber":"' + total_results[i].tag_id + '",' +
                            '"udfs":{"Retail_BizTransactionId":{"value":"'+asn+'"},' +
                            '"Retail_BizTransactionProcessStatus":{"value":"cancelled"},' +
                            '"remarks":{"value":"Reason for cancellation"},' +

                            '"user":{"value":"store'+storeid+'"}}},';



                        

                        update_query += "UPDATE asn_master SET status= 'cancelled' WHERE asn='" + total_results[i].asn + "';"
                        update_query += "UPDATE asn_items SET process_status= 'cancelled' WHERE asn='" + total_results[i].asn + "';"

                        //console.log(update_query);

                        
                    }

                    mysql.queryCustom(update_query).then(function(result) {
                        if (result.status == "1") {
                            // res.end(JSON.stringify(result.results));
                        } else {

                            console2.log('Error', JSON.stringify(result.error), '217-New_CancelRequestAsn');
                            // res.end(error);
                            //res.end(result.error);
                        }
                    }).catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '223-New_CancelRequestAsn');
                        // res.end(error);
                        // res.end(error);
                    });

                    //res.end('555555555');
                    item_for_cancel = item_for_cancel.slice(',', -1);
                    const options = {
                        url: 'http://'+process.env.IOT_PLATFORM_IP+'/innovent/SUPPLYCHAIN',
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                            'apikey': process.env.IOT_API_KEY,
                        },
                        body: '['+item_for_cancel+']'
                    };
                    //console.log(options);

                    request(options, function(err, res, body) {
                        let wjson = body;

                    });
                    //res.end('a');
                    //console.log(result);
                   res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(error), '233-New_CancelRequestAsn');
                    res.end(error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '239-New_CancelRequestAsn');
                res.end(error);
                //res.end(error);
            });

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '268-New_CancelRequestAsn');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '275-New_CancelRequestAsn');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//check_permission_request
router.post('/check_permission_request', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('check_permission_request');
    try {
        var session = req.session;
        var new_query = "SELECT TR.user_permission AS user_permission FROM users US " +
            "LEFT JOIN tb_roles TR ON TR.role_id=US.role_id " +
            "WHERE US.id = '" + session.user_id + "'";

        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '261-check_permission_request');
                    res.end(result.error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {

                console2.log('Error', JSON.stringify(error), '268-check_permission_request');
                res.end(error);
                //res.end(error);
            });

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '315-check_permission_request');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '322-check_permission_request');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});


//get_iot_notification_date 
router.post('/get_iot_notification_date', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('get_iot_notification_date');
    try {
        var session = req.session;

        var new_query = "SELECT status FROM iot_notification WHERE storename = '"+req.body.store_id+"' and "+ 
        " iot_date = '"+req.body.iot_date+"' ";

        //console.log(new_query)
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '261-get_iot_notification_date');
                    res.end(result.error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {

                console2.log('Error', JSON.stringify(error), '268-get_iot_notification_date');
                res.end(error);
                //res.end(error);
            });

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '315-get_iot_notification_date');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '322-get_iot_notification_date');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});



router.post('/CycleCountDetail', (req, res, next) => {
    console2.execution_info('CycleCountDetail');
    var now = new Date();
    try {
        var session = req.session;

        var token = req.body.token;

        var storeid = req.body.storename;

        var date = req.body.date;

        var stock_count_tb = '';
        var data_filter = req.body.storeid;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.storeid;
            stock_count_tb = 'stock_count_' + req.body.storeid;
        } else {
            stock_count_tb = 'stock_count';
        }



        if (token !== undefined && token !== '') {

            if (token == 'innovent@123') {

                if (storeid !== '' && storeid !== undefined) {

                    if (date !== '' && date !== undefined) {

                        date = date;

                    } else {
                        date = dateFormat(now, "yyyy-mm-dd");
                    }
                    //console.log(date);

                    var new_query = "SELECT " +
                        " SC.code AS skucode," +
                        " PM.color AS color," +
                        " PM.size AS size," +
                        " PM.brand AS brand," +

                        " PM.item_code AS item_code, " +
                        " SC.initial AS expected," +
                        " SC.unexpected AS unexpected," +
                        " SC.initial -  SC.missing AS counted, " +
                        " SC.missing AS missing" +

                        " FROM " + stock_count_tb + " SC " +

                        " LEFT JOIN product_item_master PM  ON SC.code= PM.skucode " +

                        " WHERE 1 and SC.storeid= '" + storeid + "' and stockcountdate= '" + date + "' " +

                        " GROUP BY SC.departmentid "

                    //res.end("++++++++++++++"+new_query);
                    mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify({
                                data: result.results
                            }));
                        } else {

                            console2.log('Error', JSON.stringify(result.error), '330-CycleCountDetail');
                            res.end(result.error);
                            //res.end(result.error);
                        }
                    }).catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '336-CycleCountDetail');
                        res.end(error);
                        //res.end(error);
                    });
                } else {

                    response['message'] = 'storename is missing!';
                    res.json(JSON.stringify(response));
                }
            } else {
                response['message'] = 'Invalid Token !';
                res.json(JSON.stringify(response));
            }
        } else {
            response['message'] = 'Field is missing !';
            res.json(JSON.stringify(response));
        }


    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '429-CycleCountDetail');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '436-CycleCountDetail');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});

router.post('/itemViewProductItem', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('itemViewProductItem');
    
    try{

        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        var limit_cond = ' limit 0,25 ';
        // var limit_cond = ' limit 0,25 ';
        var total_rec = '0';
        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;
      

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.skucode != "" && req.body.skucode != 0 && req.body.skucode != "0"  && req.body.skucode != undefined) {
            cond += ' AND skucode="' + req.body.skucode + '" '
        }

        if (req.body.departmentid != "" && req.body.departmentid != 0 && req.body.departmentid != "0" && req.body.departmentid != undefined) {
            
            cond += ' AND departmentid like "%' + req.body.departmentid + '%"'
        }


    var new_query = "SELECT  " +
    " *  FROM `product_item_master` a   where 1 " + search_cond + " " + cond +
    " " + order_by_cond;
   

     var query_count = " select `my_count` " +
     "from (SELECT count(*) as my_count  " +
     "FROM `product_item_master`  a where 1 " + search_cond + " " + cond +
     ") sq";

    mysql.queryCustom(query_count).then(function(result) {
        total_rec = result.results[0].my_count;
       

    mysql.queryCustom(new_query+limit_cond).then(function(result) {
        getstoreinf = result.results;
        var table_data = [];
        permission = '';
        for (var i = 0; i < getstoreinf.length; i++) {
            var row_data = {
                "skucode": getstoreinf[i].skucode,
                "departmentid": getstoreinf[i].departmentid,
                "ean_no": getstoreinf[i].ean_no,
                "arabic_desc": getstoreinf[i].arabic_desc,
                "english_desc": getstoreinf[i].english_desc,
            };
    
            table_data.push(row_data);
          
        }
        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
           
        
    }).catch(function(error) {

        console.log('Error',JSON.stringify(error),'518-itemViewProductItem');
        res.end(error);
      
      });
    })
    .catch(function(error) {

        console.log('Error',JSON.stringify(error),'525-itemViewProductItem');
        res.end(error);
      
      });


    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '532-itemViewProductItem');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '539-itemViewProductItem');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
    
});

router.post('/getStoresDetailsDashboard', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStoresDetailsDashboard');
    try {
        var session = req.session;

        if (mysql.check_permission('dashboard_home', session.user_permission) || mysql.check_permission('dashboard', session.user_permission)) {
            var new_query = "select stockcountdate AS date from tb_store where storename = '" + req.body.store_id + "'"
            //console.log(">>>>>>"+new_query);    
            mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '368-getStoresDetailsDashboard');
                    res.end(result.error);
                    //res.end(result.error);
                }
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '374-getStoresDetailsDashboard');
                res.end(error);
                //res.end(error);
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '475-getStoresDetailsDashboard');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '482-getStoresDetailsDashboard');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

});

//Get Store
router.post('/getStores', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('getStores');
    try {
        var session = req.session;
        //console.log(session.storeid);
        mysql.querySelect("tb_store", " order by storeid desc", "*")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '391-getStores');
                    res.end(result.error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {

                console2.log('Error', JSON.stringify(error), '398-getStores');
                res.end(error);
                //res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '517-getStores');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '524-getStores');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Get Store
router.post('/getStoresPercentage', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStoresPercentage');

    try {
        var session = req.session;
        var cond    = '';
        var storeid = '';

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" ';

            storeid = req.body.store_id ;
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }

        if (mysql.check_permission('dashboard_home', session.user_permission) || mysql.check_permission('dashboard', session.user_permission)) {
            var new_query = " SELECT " +
                " ABS(ROUND(((SUM(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                " ABS(ROUND(((SUM(unexpected) / SUM(initial))*100 ),2)) AS overpercentage ," +
                " ABS(ROUND((( ( sum(counted)-sum(unexpected))  / SUM(initial))*100 ),2)) AS matching ," +
                " SUM(SC.initial) AS onhandtotal," +
                " SUM((SC.counted)) AS inventroycount,SUM(SC.counted_sf) AS front," +
                " SUM(SC.counted_sr) AS back  " +
                " FROM stock_count_"+storeid+" SC" +
                "  WHERE 1 " + cond


            mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '435-getStoresPercentage');
                    res.end(result.error);
                    //res.end(result.error);  
                }
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '441-getStoresPercentage');
                res.end(error);
                //res.end(error);
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '579-getStoresPercentage');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '586-getStoresPercentage');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getunderall', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('getunderall');
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

        var stock_count_tb = '';
        var data_filter = req.body.storeid;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.storeid;
            stock_count_tb = 'stock_count_' + req.body.storeid;
        } else {
            stock_count_tb = 'stock_count';
        }
        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }



        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and TD.departmentname like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND SC.brand_name="' + escape(req.body.bid) + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }


        var show_over="no";
        if (req.body.show_over =='yes' )
        {
            show_over="yes";
        }

        if (mysql.check_permission('executiveSummary', session.user_permission)) {
            var new_query = '';
            var query_count = ''; 
            if(show_over == "yes"){

                new_query = "SELECT" +
                " SC.code as code, " +
                " SC.departmentid as departmentid,SC.suppliername as suppliername,SC.totalprice as totalprice, " +
                " SC.brand_name AS brandname, " +
                " SC.supplier_item_no as supplier_item_no ," +
                " SC.color as color,SC.size as size," +
                " (SC.initial) AS expected," +
                " (SC.counted) AS counted," +
                " SC.price as price , SC.season as season ,"+
                " SC.code as skucode , " +
                " (missing) as diff , " +
                " round(ABS(((missing)/(initial))*100),2) as diffper " +
                " FROM " + stock_count_tb + " SC " +
                "  " +
                " where  missing<>0 " + cond + search_cond + " " +
                "  order by diff desc " + order_by_cond;

          

            query_count = " select count(*) as `my_count` from ( SELECT SC.id FROM " +
                " " + stock_count_tb + " SC " +
                "  " +
                " where missing<>0 " + cond +
                ") sq ";


            }else{


                new_query = "SELECT" +
                " SC.code as code, " +
                " SC.departmentid as departmentid, " +
                " SC.brand_name AS brandname, " +
                " SC.supplier_item_no as supplier_item_no ," +
                " SC.color as color,SC.size as size,SC.suppliername as suppliername,SC.totalprice as totalprice," +
                " (SC.initial) AS expected," +
                " (SC.counted) AS counted," +
                " SC.price as price , SC.season as season ,"+
                " SC.code as skucode , " +
                " (missing) as diff , " +
                " round(ABS(((missing)/(initial))*100),2) as diffper " +
                " FROM " + stock_count_tb + " SC " +
                "  " +
                " where  missing<>0 and initial<>0 " + cond + search_cond + " " +
                "  order by diff desc " + order_by_cond;

           

            query_count = " select count(*) as `my_count` from ( SELECT SC.id FROM " +
                " " + stock_count_tb + " SC " +
                "  " +
                " where missing<>0 and initial<>0" + cond +
                ") sq ";


            }

           
            //console.log("++++++++++++++>+"+new_query);

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                //console.log("=hhhh===>"+new_query)
                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        gettopall = result.results;
                        //console.log(gettop20)
                        var table_data = [];
                        for (var i = 0; i < gettopall.length; i++) {


                            var row_data = {
                                "skucode": gettopall[i].skucode,
                                "departmentid": gettopall[i].departmentid,
                                "brandname": unescape(gettopall[i].brandname),
                                "color": unescape(gettopall[i].color),
                                "size": gettopall[i].size,
                                "expected": gettopall[i].expected,
                                "counted": gettopall[i].counted,
                                "diff": Math.abs(gettopall[i].diff),
                                "season": gettopall[i].season,
                                "suppliername": unescape(gettopall[i].suppliername),
                                "price": gettopall[i].price,
                                "totalprice": gettopall[i].totalprice,
                                "supplier_item_no": gettopall[i].supplier_item_no,
                            };


                            table_data.push(row_data);
                        }


                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '566-getunderall');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '572-getunderall');
                res.end(error);
                //res.end(error);
            });
        }

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '740-getunderall');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '747-getunderall');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});





router.post('/updateCronJobtable', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('updateCronJobtable');
    try {
        var session = req.session;
        //if (mysql.check_permission('storeSku', session.user_permission) || mysql.check_permission('executiveSummary', session.user_permission)) {

        var new_query = "UPDATE cronjob_taks SET status = '0' WHERE id='" + req.body.cronjob_id + "'";

        mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '594-updateCronJobtable');
                    res.end(error);
                    //res.end(result.error);
                }

            })
            .catch(function(error) {

                console2.log('Error', JSON.stringify(error), '602-updateCronJobtable');
                res.end(error);
                //res.end(error);
            });

        //}  

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '789-updateCronJobtable');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '796-updateCronJobtable');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/SelectFiltersCronjob', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('SelectFiltersCronjob');
    try {
        var session = req.session;
        //if (mysql.check_permission('storeSku', session.user_permission) || mysql.check_permission('executiveSummary', session.user_permission)) {

        var new_query = "SELECT process_type,store_id FROM `cronjob_taks` GROUP BY process_type ORDER BY id DESC";

        mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '594-SelectFiltersCronjob');
                    res.end(error);
                    //res.end(result.error);
                }

            })
            .catch(function(error) {

                console2.log('Error', JSON.stringify(error), '602-SelectFiltersCronjob');
                res.end(error);
                //res.end(error);
            });

        //}  

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '789-SelectFiltersCronjob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '796-SelectFiltersCronjob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//CronJobss
router.post('/handlercronjobsApi', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('handlercronjobsApi');
    try {
        var session = req.session;

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';
        var search_cond = '';
        var cond = '';
        var totalrecord = '';

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.Retail_CycleCountID != "" && req.body.Retail_CycleCountID != 0 && req.body.Retail_CycleCountID != "0" && req.body.Retail_CycleCountID != undefined) {
            cond += ' AND Retail_CycleCountID="' + req.body.Retail_CycleCountID + '" '
        }
        if (req.body.process_type != "" && req.body.process_type != 0 && req.body.process_type != "0" && req.body.process_type != undefined) {
            cond += ' AND process_type="' + req.body.process_type + '" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0" && req.body.store_id != undefined) {
            cond += ' AND store_id="' + req.body.store_id + '" '
        }

        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0" && req.body.Date != undefined) {

            cond += ' AND DateTIme like "%' + req.body.Date + '%"'
        }

        if (req.body.status != "" && req.body.status != undefined) {
            cond += ' AND status="' + req.body.status + '" '
        }

        //console.log('req.body.statusssssssssssssssssss'+req.body.status);

        var new_query = "SELECT  (CASE WHEN status = '0'" +
            " THEN 'runing' ELSE 'done' " +
            " END) " +
            " as status,id, " +
            " Retail_CycleCountID," +
            " DateTIme,process_type," +
            " store_id,destinationStore " +
            " FROM cronjob_taks " +
            " where 1 " + cond + " ORDER BY id desc" + order_by_cond
        // console.log(new_query);

        var query_count = "select count(*) as my_count from (select * from cronjob_taks where 1 " + cond + ") sq"

        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    gettopall = result.results;
                    //console.log(gettop20our)
                    var table_data = [];
                    for (var i = 0; i < gettopall.length; i++) {

                        var row_data = {

                            "id": gettopall[i].id,
                            "Retail_CycleCountID": gettopall[i].Retail_CycleCountID,
                            "DateTIme": gettopall[i].DateTIme,
                            "store_id": gettopall[i].store_id,
                            "destinationStore": gettopall[i].destinationStore,
                            "status": gettopall[i].status,
                            "process_type": gettopall[i].process_type,
                            "action": '<button type="button" cronjob_id=' + gettopall[i].id + ' class="btn btn-default cronjob_run" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Run</button>'
                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                })
                .catch(function(error) {

                    console2.log('Error', JSON.stringify(error), '694-handlercronjobsApi');
                    res.end(error);
                    //res.end(error);
                });
        }).catch(function(error) {

            console2.log('Error', JSON.stringify(error), '700-handlercronjobsApi');
            res.end(error);
            //res.end(error);
        });


    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '905-handlercronjobsApi');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '912-handlercronjobsApi');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Get top 20 under
router.post('/gettop20under', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('gettop20under');
    try {
        var session = req.session;

        var limit_cond = ' limit 0,20 ';
        var total_rec = '0';
        var search_cond = '';
        var cond = '';
        var totalrecord = '';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);
        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }

       

        if (req.body.search['value'] != "") {
            search_cond = " and PM.brand like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        }else{
            cond += ' AND SC.storeid="000"'
        }


        if (mysql.check_permission('stockSummary', session.user_permission)) {


            var Sum_new_query = "SELECT sum(SC.initial) AS sum_expected," +
                "sum(missing) AS sum_diff " +
                "FROM " + stock_count_tb + " SC WHERE 1 and SC.departmentid<> 'null' " + cond;

            mysql.queryCustom(Sum_new_query).then(function(sumresult) {

                totalrecord = JSON.stringify(sumresult.results);
                // console.log('totalrecordxx'+totalrecord);

                var  count_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (missing) AS diff , " +
                    " round(ABS(((missing)/ (initial))*100),2) as diffper " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where missing <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond ;

                var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (missing) AS diff , " +
                    " round(ABS(((missing)/ (initial))*100),2) as diffper " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where missing <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond + limit_cond;

                //console.log("gettop20under================"+new_query);

                mysql.queryCustom(count_query).then(function(rzlt) {
                    total_rec = rzlt.results.length;
                    mysql.queryCustom(new_query).then(function(result) {
                        gettop20 = result.results;
                        //console.log(gettop20)
                        var table_data = [];
                        if (gettop20.length > 0) {
                            for (var i = 0; i < gettop20.length; i++) {


                                var row_data = {
                                    "aatotalsum": totalrecord,
                                    "departmentname": gettop20[i].departmentname,
                                    "brandname": unescape(gettop20[i].brandname),

                                    "diff": Math.abs(gettop20[i].diff),
                                    "skucode": gettop20[i].skucode,
                                    "expected22": gettop20[i].expected,
                                    "diffper": gettop20[i].diffper,
                                    "supplier_item_no": gettop20[i].supplier_item_no,
                                };


                                table_data.push(row_data);
                            }

                        } else {
                            var row_data = {
                                "aatotalsum": totalrecord,
                                "departmentname": " ",
                                "brandname": " ",

                                "diff": " ",
                                "skucode": " ",
                                "expected22": " ",
                                "diffper": "0",
                                "supplier_item_no": " ",
                            };


                            table_data.push(row_data);
                        }


                        //res.end(JSON.stringify(result.results));
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '799-gettop20under');
                        res.end(error);
                        //res.end(error);
                    });
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '799-gettop20under');
                    res.end(error);
                    //res.end(error);
                });
            })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1049-gettop20under');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1056-gettop20under');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/gettop20under_all', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('gettop20under_all');
    try {
        var session = req.session;

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';
        var search_cond = '';
        var cond = '';
        var totalrecord = '';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);
        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }
       

        if (req.body.search['value'] != "") {
            search_cond = " and PM.brand like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        }else{
            cond += ' AND SC.storeid="000"'
        }


        if (mysql.check_permission('all_under_over', session.user_permission)) {


            var Sum_new_query = "SELECT sum(SC.initial) AS sum_expected," +
                "sum(missing) AS sum_diff " +
                "FROM " + stock_count_tb + " SC WHERE 1 and SC.departmentid<> 'null' " + cond;

            mysql.queryCustom(Sum_new_query).then(function(sumresult) {

                totalrecord = JSON.stringify(sumresult.results);
                // console.log('totalrecordxx'+totalrecord);

                var  count_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (missing) AS diff , " +
                    " round(ABS(((missing)/ (initial))*100),2) as diffper, SC.suppliername " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where missing <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond ;

                var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (missing) AS diff , " +
                    " round(ABS(((missing)/ (initial))*100),2) as diffper, SC.suppliername " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where missing <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond + limit_cond;

                //console.log("gettop20under================"+new_query);

                mysql.queryCustom(count_query).then(function(rzlt) {
                    total_rec = rzlt.results.length;
                    mysql.queryCustom(new_query).then(function(result) {
                        gettop20 = result.results;
                        //console.log(gettop20)
                        var table_data = [];
                        if (gettop20.length > 0) {
                            for (var i = 0; i < gettop20.length; i++) {


                                var row_data = {
                                    "aatotalsum": totalrecord,
                                    "departmentname": gettop20[i].departmentname,
                                    "brandname": unescape(gettop20[i].brandname),

                                    "diff": Math.abs(gettop20[i].diff),
                                    "skucode": gettop20[i].skucode,
                                    "expected22": gettop20[i].expected,
                                    "diffper": gettop20[i].diffper,
                                    "suppliername": unescape(gettop20[i].suppliername),
                                    "supplier_item_no": gettop20[i].supplier_item_no,
                                };


                                table_data.push(row_data);
                            }

                        } else {
                            var row_data = {
                                "aatotalsum": totalrecord,
                                "departmentname": " ",
                                "brandname": " ",

                                "diff": " ",
                                "skucode": " ",
                                "expected22": " ",
                                "diffper": "0",
                                "suppliername":"",
                                "supplier_item_no":"",
                            };


                            table_data.push(row_data);
                        } 


                        //res.end(JSON.stringify(result.results));
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '799-gettop20under');
                        res.end(error);
                        //res.end(error);
                    });
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '799-gettop20under');
                    res.end(error);
                    //res.end(error);
                });
            })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1049-gettop20under');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1056-gettop20under');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//get Allovers
router.post('/getallover', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getallover');
    try {

        
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);
        var stock_count_tb = '';
        var data_filter = req.body.storeid;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.storeid;
            stock_count_tb = 'stock_count_' + req.body.storeid;
        } else {
            stock_count_tb = 'stock_count';
        }


        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and TD.departmentname like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND SC.brand_name="' + escape(req.body.bid) + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }
        //  res.end(limit_cond);
        var show_over="no";
        if (req.body.show_over =='yes' )
        {
            show_over="yes";
        }

        if (mysql.check_permission('executiveSummary', session.user_permission)) {

            var new_query = '';
            var query_count  = '';

            if(show_over=="yes"){

                new_query = "SELECT" +
                " SC.code as code, " +
                " SC.supplier_item_no as supplier_item_no ," +
                " SC.departmentid as departmentid,SC.suppliername as suppliername,SC.totalprice as totalprice, " +
                " SC.brand_name AS brandname, " +
                " SC.color as color,SC.size as size," +
                " (SC.initial) AS expected," +
                " (SC.counted) AS counted," +
                " SC.price as price , SC.season as season ,"+

                " SC.code as skucode , " +
                " (unexpected) as diff , " +
                " round(ABS(((unexpected)/(initial))*100),2) as diffper " +
                " FROM " + stock_count_tb + " SC " +
                "  " +
                " where unexpected<>0  " + cond + search_cond + " " +
                "  order by diff desc ";


                query_count = " select count(*) as `my_count` from ( SELECT SC.id FROM " + stock_count_tb + " SC " +
                " " +
                " where unexpected<>0  " + cond + search_cond +
                ") sq ";


            }else{


               new_query = "SELECT" +               
                " SC.code as code, " +
                " SC.supplier_item_no as supplier_item_no ," +
                " SC.departmentid as departmentid, " +
                " SC.brand_name AS brandname, " +
                " SC.color as color,SC.size as size," +
                " (SC.initial) AS expected," +
                " (SC.counted) AS counted," +
                " SC.price as price , SC.season as season,SC.suppliername as suppliername,SC.totalprice as totalprice,"+
                " SC.code as skucode , " +
                " (unexpected) as diff , " +
                " round(ABS(((unexpected)/(initial))*100),2) as diffper " +
                " FROM " + stock_count_tb + " SC " +
                "  " +
                " where unexpected<>0 and initial<>0 " + cond + search_cond + " " +
                "  order by diff desc ";


            query_count = " select count(*) as `my_count` from ( SELECT SC.id FROM " + stock_count_tb + " SC " +
                " " +
                " where unexpected<>0 and initial<>0 " + cond + search_cond +
                ") sq ";


            }


           


            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        gettopall = result.results;
                        //console.log(gettop20our)
                        var table_data = [];
                        for (var i = 0; i < gettopall.length; i++) {

                            var row_data = {
                                "skucode": gettopall[i].skucode,
                                "departmentid": gettopall[i].departmentid,
                                "brandname": unescape(gettopall[i].brandname),
                                "color": unescape(gettopall[i].color),
                                "size": gettopall[i].size,
                                "expected": gettopall[i].expected,
                                "counted": gettopall[i].counted,
                                "diff": Math.abs(gettopall[i].diff),
                                "season": gettopall[i].season,
                                "suppliername": unescape(gettopall[i].suppliername),
                                "price": gettopall[i].price,
                                "totalprice": gettopall[i].totalprice,
                                "supplier_item_no": gettopall[i].supplier_item_no,
                            };

                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '926-getallover');
                        res.end(error);
                        //res.end( JSON.stringify(error));
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '931-getallover');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1202-getallover');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1209-getallover');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//totalstore
router.post('/totalstore', authenticationMidleware(), (req, res, next) => {
console2.execution_info('totalstore');
    try {
        var session = req.session;
        if (mysql.check_permission('dashboard', session.user_permission)) {

            var storeid = session.storeid;

            storeid = storeid.split('[').join('');
            storeid = storeid.split(']').join('');

            var query = '';

            if (session.user_id == 1) {
                query = "SELECT count(*) as total_store FROM tb_store "
            } else {
                query = "SELECT count(*) as total_store FROM tb_store WHERE  storename IN (" + storeid + ")"
            }


            mysql.queryCustom(query)

                .then(function(result) {
                    //console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '966-totalstore');
                        res.end(result.error);
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {

                    console2.log('Error', JSON.stringify(error), '937-totalstore');
                    res.end(error);
                    // res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1258-totalstore');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1265-totalstore');
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
        var token = req.body.token;

        if (req.body.log_text !== undefined && req.body.log_text !== "") {
            log_text = req.body.log_text;

        } else {

            response['message'] = 'Please Enter  log_text !';
            res.json(JSON.stringify(response));
        }
        if (req.body.log_json !== undefined && req.body.log_json !== "") {
            log_json = req.body.log_json;


        } else {

            response['message'] = 'Please Enter  log_json !';
            res.json(JSON.stringify(response));
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
            response['message'] = 'Please Enter  log_type !';
            res.json(JSON.stringify(response));
        }
        if (req.body.device_id !== undefined && req.body.device_id !== "") {
            device_id = req.body.device_id;
        } else {
            response['message'] = 'Please Enter  device_id !';
            res.json(JSON.stringify(response));
        }

        if (req.body.store_id !== undefined && req.body.store_id !== "") {
            store_id = req.body.store_id;
        } else {
            response['message'] = 'Please Enter  store_id !';
            res.json(JSON.stringify(response));
        }





        if (req.body.token !== undefined && req.body.token !== "") {

            var starttime = new Date();
            var isotime = new Date((new Date(starttime)).toISOString());
            var fixedtime = new Date(isotime.getTime() - (starttime.getTimezoneOffset() * 60000));
            var log_date_time = fixedtime.toISOString().slice(0, 19).replace('T', ' ');

            if (token == access_token) {

                var new_query = "INSERT INTO `tb_audit`" +
                    "(`audit_text`, `audit_json`, `log_type`, `date`, `deviceid`,`storeid`) " +
                    "VALUES " +
                    "('" + log_text + "','" + log_json + "','" + log_info + "'," +
                    "'" + log_date_time + "','" + device_id + "','" + store_id + "')";
                //console.log("++++++++"+new_query);
                mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify(result.results));
                        } else {

                            console2.log('Error', JSON.stringify(error), '1066-add_log');
                            res.end(error);
                            //res.end(result.error);
                        }
                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '1073-add_log');
                        res.end(error);
                        //res.end(error);
                    });
            } else {

                response['message'] = 'Invalid token!';
                res.json(JSON.stringify(response));
            }
        } else {
            response['message'] = 'Please Enter token';
            res.json(JSON.stringify(response));
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1381-add_log');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1388-add_log');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//total Users
router.post('/totalusers', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('totalusers');
    try {
        var session = req.session;
        //console.log("++++++"+session);
        if (mysql.check_permission('dashboard', session.user_permission)) {
            mysql.queryCustom("SELECT" +
                    " COUNT(id) AS total_users FROM users WHERE 1")
                .then(function(result) {
                    //console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '1102-totalusers');
                        res.end(error);
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1108-totalusers');
                    res.end(error);
                    //res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1424-totalusers');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1431-totalusers');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




router.post('/getusersinfo', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getusersinfo');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and name like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.Name != "" && req.body.Name != 0 && req.body.Name != "0") {
            cond += ' AND US.name="' + req.body.Name + '" '
        }

        if (req.body.UserName != "" && req.body.UserName != 0 && req.body.UserName != "0") {
            cond += ' AND US.username="' + req.body.UserName + '"'
        }

        if (mysql.check_permission('usersinfo', session.user_permission)) {
            var new_query = "SELECT " +
                " *, TR.role_name AS role_name ,US.storeid ,CASE " +
                " WHEN US.status = 1 THEN 'Active' WHEN US.status = 0 THEN 'Disable' " +
                " ELSE 'Nothing' " +
                " END AS qstatus FROM users US" +
                " LEFT JOIN tb_roles TR ON US.role_id = TR.role_id " +
                " WHERE 1 " + cond + search_cond + " " + order_by_cond;

            //console.log("++++-------"+new_query)

            var query_count = " select count(*) as `my_count` from (SELECT * FROM users US " +
                " WHERE 1 " + cond + search_cond + ") sq ";

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;


                mysql.queryCustom(new_query + limit_cond).then(function(result) {


                        getstoreinf = result.results;



                        var table_data = [];

                        var permission = ''

                        for (var i = 0; i < getstoreinf.length; i++) {

                            if (getstoreinf[i].id == 1) {
                                permission = ''
                            } else {
                                permission = '<button type="button" del_id=' + getstoreinf[i].id + ' class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button>'
                            }

                            var storeid = getstoreinf[i].storeid;

                            // console.log("++++++++++++++++"+storeid);

                            storeid = storeid.split('[').join('');
                            storeid = storeid.split(']').join('');
                            storeid = storeid.split('"').join('');


                            var row_data = {
                                "id": getstoreinf[i].id,
                                "name": getstoreinf[i].name,
                                "username": getstoreinf[i].username,
                                "role_name": getstoreinf[i].role_name,
                                "storeid": storeid,
                                "status": getstoreinf[i].qstatus,
                                "last_login": getstoreinf[i].last_login,
                                'action': '<button type="button" edit_id=' + getstoreinf[i].id + ' class="btn UserEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button>' + permission
                            };

                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '1219-getusersinfo');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '1225-getusersinfo');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1558-getusersinfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1565-getusersinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getauditinfo
router.post('/getauditinfo', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getauditinfo');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == GetUserRoles || order_col == 6) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }



        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and audit_text like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.retail_cyclecount_id != "" && req.body.retail_cyclecount_id != 0 && req.body.retail_cyclecount_id != "0") {
            cond += ' AND   Retail_CycleCountID="' + req.body.retail_cyclecount_id + '" '
        }

        if (req.body.LogType != "" && req.body.LogType != 0 && req.body.LogType != "0") {
            cond += ' AND log_type="' + req.body.LogType + '" '
        }
        if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {
            cond += ' AND storeid="' + req.body.StoreID + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND DATE(date) = DATE("' + req.body.date + '")'
        }

        var show_uae_time="false";
        if (req.body.show_uae_time =='true' )
        {
            show_uae_time="yes";
        }


        var show_utc_time="false";
        if (req.body.show_utc_time =='true' )
        {
            show_utc_time="yes";
        }

        if (mysql.check_permission('AuditInfo', session.user_permission)) {

            var new_query = "SELECT " +
                " * FROM tb_audit " +
                " WHERE 1 " + cond + search_cond + " " + order_by_cond;

            //console.log("++++-------"+new_query)

            var query_count = " select count(*) as `my_count` from (SELECT * FROM tb_audit US WHERE 1 " + cond + search_cond + ") sq ";

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {


                        getstoreinf = result.results;

                        //console.log(gettop20our)
                        var table_data = [];

                        var permission = ''
                        var show_date = '';
                        var localTime = '';
                        var localOffset = '';
                        var utc = '';
                        var offset = '';
                        var dubai = '';
                        var nd = '';
                        var time_show = '';

                        for (var i = 0; i < getstoreinf.length; i++) {

                            if(show_uae_time == "yes"){
                               
                                show_date= new Date(getstoreinf[i].date);
                                localTime = show_date.getTime();
                                localOffset = show_date.getTimezoneOffset() * 60000;
                                utc = localTime + localOffset;
                                offset = 4;  
                                dubai = utc + (3600000*offset);

                                time_show = dateFormat(dubai, "yyyy-mm-dd HH:MM:ss");

                               
                            }else if(show_utc_time == 'yes'){
                                
                           
                                utc = new Date(getstoreinf[i].date);
                                time_show2 = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                time_show = dateFormat(time_show2, "yyyy-mm-dd HH:MM:ss");
                                time_show = time_show.toString()


                            }else{
                               time_show = getstoreinf[i].date 
                            }

                            var row_data = {
                                "auditid": getstoreinf[i].auditid,
                                "audit_text": getstoreinf[i].audit_text,
                                "date": time_show,
                                "log_type": getstoreinf[i].log_type,
                                "storeid": getstoreinf[i].storeid,
                                "Retail_CycleCountID": getstoreinf[i].Retail_CycleCountID,
                                "audit_json": getstoreinf[i].audit_json,
                                "deviceid": getstoreinf[i].deviceid,
                            };

                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1312-getauditinfo');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1317-getauditinfo');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1667-getauditinfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1674-getauditinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//ibt_differenceReport
router.post('/ibt_differenceReport', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ibt_differenceReport');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == GetUserRoles || order_col == 6) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }



        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and audit_text like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.ans != "" && req.body.ans != 0 && req.body.ans != "0") {
            cond += ' AND   asn="' + req.body.ans + '" '
        }

        if (req.body.datetime != "" && req.body.datetime != 0 && req.body.datetime != "0") {
            cond += ' AND datetime="' + req.body.datetime + '" '
        }
        // if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {
        //     cond += ' AND storeid="' + req.body.StoreID + '" '
        // }
        // if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
        //     cond += ' AND DATE(date) = DATE("' + req.body.date + '")'
        // }

        console.log("before permission")
        if (mysql.check_permission('ibt_difference', session.user_permission)) {

            var new_query = "SELECT " +
                " * FROM notificaton_asn " +
                " WHERE 1 " + cond + search_cond + " " + order_by_cond;

            console.log("main query-"+new_query);

            var query_count = " select count(*) as `my_count` from (SELECT * FROM notificaton_asn  WHERE 1 " + cond + search_cond + ") sq ";

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;
                // console.log("after main query");
                mysql.queryCustom(new_query + limit_cond).then(function(result) {
                        console.log("after inner query");

                        getstoreinf = result.results;

                        //console.log(gettop20our)
                        var table_data = [];

                        var permission = ''
                        console.log(getstoreinf);
                        for (var i = 0; i < getstoreinf.length; i++) {


                            var row_data = {
                                "id": getstoreinf[i].id,
                                "datetime": getstoreinf[i].datetime,
                                "asn": getstoreinf[i].asn,
                                "send_mail": getstoreinf[i].send_mail,
                                "view_details":'<button type="button" asn_id='+getstoreinf[i].asn+' class="btn missing_ibt btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">View Details</button>'
                                
                              
                            };

                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1894-ibt_differenceReport');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1899-ibt_differenceReport');
                res.end(error);
                //res.end(error);
            });
        }
        else
        {
            res.end("permission not allowd");
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1905-ibt_differenceReport');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1912-ibt_differenceReport');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

function getasnInfo(var_asn,var_process){
  return new Promise((resolve, reject) => {
    var asn     = var_asn;
    var process_s = var_process;
    console2.execution_info('getasnInfo');
    var select_query = "select * from asn_items where asn='"+asn+"' and process = '"+process_s+"'  "    
    //console.log(select_query)
    mysql.queryCustom(select_query).then(function(result) {
        var records = result.results;
        
        var my_ar = {};
        var myObj = {};

        for(k=0; k<records.length; k++)
        {
            // console.log()
            my_ar[records[k].tag_id]=records[k].tag_id;
        }

        let sendparam = {
            db_data:my_ar
        }

        resolve(sendparam);
    }).catch(err => {
        console2.log('Error', err, '1832-getasnInfo API getasnInfo ');
    });


  }); 
}

//missing_ibt_list 
router.post('/missing_ibt_listReport', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('missing_ibt_listReport');
    try {
        const now = new Date();
        var CheckDate = dateFormat(now, "yyyy-mm-dd");
        var session = req.session;
        if (mysql.check_permission('missing_ibt_list', session.user_permission)) {

            var asn_new = req.body.asn;

        getasnInfo(asn_new,"shipping").then(function(returnData){

            
            var shipping_item = returnData.db_data;
            var rowdata = '';

            getasnInfo(asn_new,"receiving").then(function(returnData){

                
                var receiving_item = returnData.db_data;
                
                if(Object.keys(receiving_item).length>Object.keys(shipping_item).length)
                {
                    var table_data = [];
                  
                    for (var element in receiving_item) {
                        if(receiving_item[element] in shipping_item)
                        {
                            rowdata={
                                "rec_epc":receiving_item[element],
                                "ship_epc":receiving_item[element]
                            }  
                        }

                        else
                        {
                            rowdata={
                                "rec_epc":receiving_item[element],
                                "ship_epc":''
                            }  
                        }
                         
                        table_data.push(rowdata)
                       
                    }
                    
                    
                }else{

                    var table_data = [];
                  
                    for (var element in shipping_item) {
                        if(shipping_item[element] in receiving_item)
                        {
                            rowdata={
                                "rec_epc":shipping_item[element],
                                "ship_epc":shipping_item[element]
                            }  
                        }

                        else
                        {
                            rowdata={
                                "rec_epc":'',
                                "ship_epc":shipping_item[element]
                            }  
                        }
                         
                        table_data.push(rowdata)
                       
                    }
                    //console.log(table_data);
                    
                }
                res.end('{"aaData":'+JSON.stringify(table_data)+'}');
                                    
            });

        });
                      


        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1905-ibt_differenceReport');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1912-ibt_differenceReport');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Viewpermission
router.post('/Viewpermission', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Viewpermission');
    try {
        var session = req.session;
        var new_query = "SELECT user_permission FROM tb_roles" +
            " WHERE role_id='" + req.body.role_id + "'";

        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(error), '1337-Viewpermission');
                    res.end(error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1343-Viewpermission');
                res.end(error);
                //res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1708-Viewpermission');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1715-Viewpermission');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//ViewStores
router.post('/ViewStores', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ViewStores');
    try {
        var session = req.session;

        var new_query = "SELECT user_permission,storeid FROM tb_roles" +
            " WHERE role_id='" + req.body.role_id + "'";


        mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {


                    /*-----------------------------------------------------*/
                    var storeid = result.results[0].storeid;

                    if (storeid !== '') {

                        storeid = storeid.split('[').join('');
                        storeid = storeid.split(']').join('');
                        //console.log("ddddd"+storeid);


                        var new_query = "SELECT storename FROM tb_store WHERE storeid IN (" + storeid + ")"

                        //console.log("sssssssssss"+new_query);
                        mysql.queryCustom(new_query).then(function(result) {
                            if (result.status == "1") {
                                //console.log("dsssss");

                                res.end(JSON.stringify(result.results));
                            } else {

                                console2.log('Error', JSON.stringify(result.error), '1383-ViewStores');
                                res.end(error);
                                //res.end(result.error);
                            }
                        }).catch(function(error) {

                            console2.log('Error', JSON.stringify(error), '1389-ViewStores');
                            res.end(error);
                            //res.end(error);
                        });


                    } else {


                        res.end(JSON.stringify(result.results));
                    }


                    /*---------------------------------------------------*/

                } else {
                    console2.log('Error', JSON.stringify(result.error), '1405-ViewStores');
                    res.end(result.error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1411-ViewStores');
                res.end(error);
                //res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1792-ViewStores');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1799-ViewStores');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/ViewAsnDetails', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('ViewAsnDetails');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }


        if (req.body.Source != "" && req.body.Source != 0 && req.body.Source != "0" && req.body.Source != undefined) {

            cond += ' AND ( store_id="' + req.body.Source + '" OR destination="' + req.body.source + '" )'

        }

        if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0" && req.body.StoreID != undefined) {

            cond += ' AND store_id="' + req.body.StoreID + '" '

        }

        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            //var CheckDate = dateFormat(datenow, "dd/mm/yyyy");

            //console.log(chekc);
            cond += ' AND date = "' + datenow + '" '

        }

        if (req.body.Process != "" && req.body.Process != 0 && req.body.Process != "0" && req.body.Process != undefined) {
            cond += ' AND process="' + req.body.process + '" '
        }




        if (req.body.SerialNumber != "" && req.body.SerialNumber != 0 && req.body.SerialNumber != "0") {


            cond += ' AND tag_id like "%' + req.body.SerialNumber + '%" '
        }
        if (req.body.process_status != "" && req.body.process_status != 0 && req.body.process_status != "0") {


            cond += ' AND process_status ="' + req.body.process_status + '" '
        }
        if (req.body.process_asn != "" && req.body.process_asn != 0 && req.body.process_asn != "0") {


            cond += " AND process = '" + req.body.process_asn + "'"
        }


        if (req.body.asn_id != "" && req.body.asn_id != 0 && req.body.asn_id != "0") {


            cond += " AND asn = '" + req.body.asn_id + "'"
        }


        if (mysql.check_permission('asndata', session.user_permission)) {



            var new_query = "SELECT * FROM `asn_items` " +
                " WHERE 1 and is_deleted<>'1' " + cond + order_by_cond;
            //console.log("+++" + new_query);

            var query_count = " select count(*) as `my_count` " +
                "from (SELECT * FROM `asn_items` " +
                " WHERE 1 and is_deleted<>'1' " + cond + ") sq ";

                //console.log(query_count);


            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //console.log(gettop20our)
                        var table_data = [];
                        var button = '';
                        for (var i = 0; i < getstoreinf.length; i++) {


                            var row_data = {

                                "date": getstoreinf[i].date,
                                "asn": getstoreinf[i].asn,
                                "tag_id": getstoreinf[i].tag_id,
                                "sku": getstoreinf[i].sku,
                                // "process": getstoreinf[i].process,
                                "department": getstoreinf[i].department,
                                "original_location": getstoreinf[i].original_location,
                                "destination": getstoreinf[i].destination_location,
                                // "style": getstoreinf[i].style,
                                "process_status": getstoreinf[i].process_status,
                                "brand": unescape(getstoreinf[i].brand),
                                "shipment_number": unescape(getstoreinf[i].shipment_number),


                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '1549-ViewAsnDetails');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1554-ViewAsnDetails');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1952-ViewAsnDetails');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1959-ViewAsnDetails');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }



});


router.post('/StorePayload', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('StorePayload');
    try {
        var session = req.session;
        var cond = '';
        var total_rec = '0';

        if (req.body.store != "" && req.body.store != 0 && req.body.store != "0" && req.body.store != undefined) {
            cond += ' AND `store_name` = "' + req.body.store + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            var CheckDate = dateFormat(req.body.date, "yyyy-mm-dd");
            cond += ' AND `soh_date` = "' + CheckDate + '" '
        }       
        var new_query = "SELECT * FROM `soh_report` " +
            " WHERE 1 " + cond;

        var query_count = " select count(*) as `my_count` " +
            "from (SELECT * FROM `soh_report` " +
            " WHERE 1 " + cond + ") sq ";

        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query).then(function(result) {
                    getstoreinf = result.results;
                    var table_data = [];
                    var button = '';
                    for (var i = 0; i < getstoreinf.length; i++) {
                        var row_data = {
                            /*"date": getstoreinf[i].soh_date,
                            "store_name": getstoreinf[i].store_name,
                            "iot_total": getstoreinf[i].iot_total,*/
                            "recent_payload": unescape(getstoreinf[i].recent_payload)
                        };
                        table_data.push(row_data);
                    }
                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1549-StorePayload');
                    res.end(error);
                });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '1554-StorePayload');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1952-StorePayload');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1959-StorePayload');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//GetZPLReportData
router.post('/GetZPLReportData', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetZPLReportData');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Epc != "" && req.body.Epc != 0 && req.body.Epc != "0") {

            //console.log(chekc);
            cond += ' AND epc like "%' + req.body.Epc + '%" '

        }

        if (req.body.Storeid != "" && req.body.Storeid != 0 && req.body.Storeid != "0") {
            cond += ' AND   storeid="' + req.body.Storeid + '"';
        } else {
           // cond += ' AND   storeid="0000000000"';
        }

        if (req.body.uid != "" && req.body.uid != 0 && req.body.uid != "0") {

            cond += ' AND uid="' + req.body.uid + '" '
        }

        if (req.body.user_id != "" && req.body.user_id != 0 && req.body.user_id != "0") {

            cond += ' AND user_id="' + req.body.user_id + '" '
        }
        if (req.body.date22 != "" && req.body.date22 != 0 && req.body.date22 != "0") {

            cond += ' AND date_time="' + req.body.date22 + '" '
        }



        if (mysql.check_permission('zplReport', session.user_permission)) {

            var new_query = "SELECT  " +
                " *  FROM `zpl_printer` a where 1 " + search_cond + " " + cond +
                " " + order_by_cond;

           // console.log(new_query);

            var query_count = " select `my_count` " +
                "from (SELECT count(*) as my_count  " +
                "FROM `zpl_printer` a where 1 " + search_cond + " " + cond +
                ") sq ";

            //console.log(query_count);


            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                       
                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {
                           
                            var row_data = {
                                "uid": getstoreinf[i].uid,
                                "epc": getstoreinf[i].epc,
                                "sku": getstoreinf[i].sku,

                                "Product_Name": getstoreinf[i].Product_Name,
                                "PO_NO": getstoreinf[i].PO_NO,
                                "Supplier_ID": getstoreinf[i].Supplier_ID,
                                "Shipment_no": getstoreinf[i].Shipment_no,
                                "Comments": getstoreinf[i].Comments,

                                // "qty": getstoreinf[i].qty,
                                "storeid": getstoreinf[i].storeid,
                                // "printerid":getstoreinf[i].printerid ,
                                // "zplid": getstoreinf[i].zplid ,
                                "status": getstoreinf[i].status,
                                // "Retail_Product_Price": getstoreinf[i].Retail_Product_Price,
                                // "Retail_Product_VAT": getstoreinf[i].Retail_Product_VAT,
                                // "Retail_Product_SP_VAT_EN": getstoreinf[i].Retail_Product_SP_VAT_EN,

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1665-GetZPLReportData');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1671-GetZPLReportData');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2102-GetZPLReportData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2109-GetZPLReportData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//GetZPLReportData(SKU)
router.post('/GetZPLReportData_sku', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetZPLReportData_sku');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Epc != "" && req.body.Epc != 0 && req.body.Epc != "0") {

            //console.log(chekc);
            cond += ' AND epc like "%' + req.body.Epc + '%" '

        }

        if (req.body.Storeid != "" && req.body.Storeid != 0 && req.body.Storeid != "0") {
            cond += ' AND   storeid="' + req.body.Storeid + '"';
        } else {
            cond += ' AND   storeid="0000000000"';
        }

        if (req.body.uid != "" && req.body.uid != 0 && req.body.uid != "0") {

            cond += ' AND uid="' + req.body.uid + '" '
        }

        if (req.body.user_id != "" && req.body.user_id != 0 && req.body.user_id != "0") {

            cond += ' AND user_id="' + req.body.user_id + '" '
        }
        if (req.body.date22 != "" && req.body.date22 != 0 && req.body.date22 != "0") {

            cond += ' AND date_time="' + req.body.date22 + '" '
        }



        if (mysql.check_permission('zplReport_sku', session.user_permission)) {

           var new_query = "SELECT count(*) as total_skus,  " +
                " a.*  FROM `zpl_printer` a where 1 " + search_cond + " " + cond +
                "  GROUP BY sku " + order_by_cond ;

            //console.log(new_query);

            var query_count = " select count(*) as `my_count` " +
                " from (SELECT count(*) as total_item ,a.* " +
                " FROM `zpl_printer` a where 1 " + search_cond + " " + cond +" GROUP BY sku "+
                ") sq ";

           // console.log(query_count);


            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                       
                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {
                           
                            var row_data = {
                                "uid": getstoreinf[i].uid,
                                "epc": getstoreinf[i].epc,
                                "sku":'<button type="button" zku_zpl=' + getstoreinf[i].sku+' store_id='+getstoreinf[i].storeid+' class="btn sku_zpl_btn btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;border-bottom: 1px solid blue;" >'+getstoreinf[i].sku+' ('+getstoreinf[i].total_skus+')'+'</button>' ,
                                "Product_Name": getstoreinf[i].Product_Name,
                                "PO_NO": getstoreinf[i].PO_NO,
                                "Supplier_ID": getstoreinf[i].Supplier_ID,
                                "Shipment_no": getstoreinf[i].Shipment_no,
                                "Comments": getstoreinf[i].Comments,

                                
                                "storeid": getstoreinf[i].storeid,
                               
                                "status": getstoreinf[i].status,
                            };

                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1665-GetZPLReportData');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', error, '1671-GetZPLReportData_sku');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2102-GetZPLReportData_sku');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2109-GetZPLReportData_sku');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//GetZPLReportData(SKU)
router.post('/GetZPLReportData_sku_detail', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetZPLReportData_sku_detail');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Epc != "" && req.body.Epc != 0 && req.body.Epc != "0" && req.body.Epc!==undefined) {

            //console.log(chekc);
            cond += ' AND epc = "' + req.body.Epc + '" '

        }

        if (req.body.Storeid != "" && req.body.Storeid != 0 && req.body.Storeid != "0" && req.body.Storeid !== undefined) {
            cond += ' AND   storeid="' + req.body.Storeid + '"';
        } 

        if (req.body.uid != "" && req.body.uid != 0 && req.body.uid != "0" &&  req.body.uid !== undefined) {

            cond += ' AND uid="' + req.body.uid + '" '
        }

        if (req.body.user_id != "" && req.body.user_id != 0 && req.body.user_id != "0" && req.body.user_id != undefined) {

            cond += ' AND user_id="' + req.body.user_id + '" '
        }
        if (req.body.date22 != "" && req.body.date22 != 0 && req.body.date22 != "0" && req.body.date22 != undefined) {

            cond += ' AND date_time="' + req.body.date22 + '" '
        }

        if (req.body.zku_zpl22 != "" && req.body.zku_zpl22 != 0 && req.body.zku_zpl22 != "0" && req.body.zku_zpl22 != undefined) {

            cond += ' AND sku ="' + req.body.zku_zpl22  + '" '
        }



        if (mysql.check_permission('zplReport_sku', session.user_permission)) {

            var new_query = "SELECT  " +
                " *  FROM `zpl_printer` a where 1 " + search_cond + " " + cond +
                "  " + order_by_cond ;

            //console.log(new_query);

            var query_count = " select count(*) as `my_count` " +
                " from (SELECT *  " +
                " FROM `zpl_printer` a where 1 " + search_cond + " " + cond +"  "+
                ") sq ";

           // console.log(query_count);


            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                       
                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {
                           
                            var row_data = {

                                "uid": getstoreinf[i].uid,
                                "epc": getstoreinf[i].epc,
                                "sku":getstoreinf[i].sku,
                                "Product_Name": getstoreinf[i].Product_Name,
                                "PO_NO": getstoreinf[i].PO_NO,
                                "Supplier_ID": getstoreinf[i].Supplier_ID,
                                "Shipment_no": getstoreinf[i].Shipment_no,
                                "Comments": getstoreinf[i].Comments,
                                "storeid": getstoreinf[i].storeid,
                                "status": getstoreinf[i].status,
                            
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1665-GetZPLReportData');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', error, '1671-GetZPLReportData_sku');
                res.end(error);
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2102-GetZPLReportData_sku');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2109-GetZPLReportData_sku');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//GetZPLReportDataDeatails
router.post('/GetZPLReportDataDeatails', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetZPLReportDataDeatails');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Epc != "" && req.body.Epc != 0 && req.body.Epc != "0") {

            //console.log(chekc);
            cond += ' AND epc like "%' + req.body.Epc + '%" '

        }

        if (req.body.Storeid != "" && req.body.Storeid != 0 && req.body.Storeid != "0") {
            cond += ' AND   storeid="' + req.body.Storeid + '"';
        }





        //if (mysql.check_permission('asndata', session.user_permission)) {

        var new_query = "SELECT  " +
            " *  FROM `zpl_printer` a where uid = '" + req.body.uid + "' " + search_cond + " " + cond +
            " " + order_by_cond;

        //console.log(new_query);   

        var query_count = " select count(*) as `my_count` " +
            "from (SELECT count(*) as total_item, a.* " +
            "FROM `zpl_printer` a where uid = '" + req.body.uid + "' " + search_cond + " " + cond +
            ") sq ";



        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;
                    //console.log(gettop20our)
                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {

                        var row_data = {
                            "uid": getstoreinf[i].uid,
                            "epc": getstoreinf[i].epc,
                            "suppliername": getstoreinf[i].suppliername,
                            "qty": getstoreinf[i].qty,
                            "storeid": getstoreinf[i].storeid,
                            "printerid": getstoreinf[i].printerid,
                            "zplid": getstoreinf[i].zplid,
                            "status": getstoreinf[i].status,
                            "Retail_Product_Price": getstoreinf[i].Retail_Product_Price,
                            "Retail_Product_VAT": getstoreinf[i].Retail_Product_VAT,
                            "Retail_Product_SP_VAT_EN": getstoreinf[i].Retail_Product_SP_VAT_EN,

                            //"action": '<button type="button" uid=' + getstoreinf[i].uid + ' class="btn zpl_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">View</button> ',


                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1777-GetZPLReportDataDeatails');
                    res.end(error);
                    //res.end(error);
                });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '1782-GetZPLReportDataDeatails');
            res.end(error);
            //res.end(error);
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2230-GetZPLReportDataDeatails');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2237-GetZPLReportDataDeatails');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




router.post('/Cancel_ViewAsnDetails', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Cancel_ViewAsnDetails');

    try {
        var session = req.session;

        var new_query = "SELECT * FROM `cancel_asn_items` " +
            " WHERE 1 AND asn='" + req.body.asn_id + "' AND process= '" + req.body.process + "'";
        //console.log(new_query);
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '1805-Cancel_ViewAsnDetails');
                    res.end(error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {

                console2.log('Error', JSON.stringify(error), '1812-Cancel_ViewAsnDetails');
                res.end(error);
                //res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2276-Cancel_ViewAsnDetail');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2283-Cancel_ViewAsnDetail');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

});


//StoreDiscrepency
router.post('/GetMinMAx', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('GetMinMAx');
    try {
        var session = req.session;

        var cond = '';
        var storeid='';

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND PM.brand="' + req.body.bid + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" ';
            storeid =  req.body.storeid;
        }


        if (mysql.check_permission('storeSku', session.user_permission)) {
            var new_query = "SELECT MIN(missing) AS UNDER," +
                "MAX(unexpected) AS oveer FROM stock_count_"+storeid+" SC " +
                "LEFT JOIN product_item_master PM ON SC.code = PM.skucode WHERE 1" + cond

            mysql.queryCustom(new_query)
                .then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '1852-GetMinMAx');
                        res.end(result.error);
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1852-GetMinMAx');
                    res.end(error);
                    //res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2340-GetMinMAx');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2347-GetMinMAx');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/StoreDiscrepencyTwo', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('StoreDiscrepencyTwo');
    try {
        var session = req.session;
        var min = req.body.min;
        var max = req.body.max;

        var cond = '';
        var storeid='';

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND PM.brand="' + req.body.bid + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" ';
            storeid = req.body.storeid ;
        }

        var string = '';
        var query = '';

        for (var i = min; i <= max; i++) {
            if (i > 0) {
                query += "(" +
                    "SELECT COUNT(SC.unexpected) " +
                    "FROM stock_count_"+storeid+" SC WHERE SC.missing = '" + i + "' " +
                    ") AS oveer_" + i + ", "
            } else {
                query += "(" +
                    "SELECT COUNT(SC.missing) " +
                    "FROM stock_count_"+storeid+" SC WHERE SC.missing = '" + i + "' " +
                    ") AS oveer_m" + Math.abs(i) + ", "
            }
        }


        query = query.substr(0, query.length - 2);
        string = "SELECT " + query + " FROM stock_count_"+storeid+" SC " +
            " LEFT JOIN product_item_master PM ON SC.code = PM.skucode" +
            " LIMIT 0,1";

        // console.log(string);
        mysql.queryCustom(string)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '1916-StoreDiscrepencyTwo');
                    res.end(result.error);
                    //res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1922-StoreDiscrepencyTwo');
                res.end(error);
                //res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2419-StoreDiscrepencyTwo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2426-StoreDiscrepencyTwo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//GetUserRoles
router.post('/GetUserRoles', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetUserRoles');
    try {
        var session = req.session;

        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and role_name like '%" + req.body.search['value'] + "%'";
        }


        var new_query = "SELECT  *  FROM tb_roles TR " +
            " WHERE 1" + search_cond + " " + order_by_cond;

        //console.log("++++-------" + new_query)

        var query_count = "SELECT count(*) as `my_count` from (SELECT * FROM tb_roles WHERE 1 " + search_cond + ") sq ";


        if (mysql.check_permission('UserRoles', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;


                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //console.log(gettop20our)
                        var table_data = [];

                        for (var i = 0; i < getstoreinf.length; i++) {
                            //getstoreinf[i].storename

                            var row_data = {
                                "role_id": getstoreinf[i].role_id,
                                "role_name": getstoreinf[i].role_name,
                                "createddate": getstoreinf[i].createddate,
                                "viewpermissions": '<button type="button" role_id=' + getstoreinf[i].role_id + ' class="btn permission btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent" data-toggle="modal" data-target="#exampleModal">View</button>',
                                'action': '<button type="button" edit_id=' + getstoreinf[i].role_id + ' class="btn RoleEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button> <button type="button" del_id=' + getstoreinf[i].role_id + ' class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button>'
                            };

                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '1999-GetUserRoles');
                        res.end(error);

                    });
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '2005-GetUserRoles');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2518-GetUserRoles');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2525-GetUserRoles');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

});

router.post('/getasndata', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getasndata');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var query_select = '';
        var query_count_per = '';

        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }



        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += 'AND date  = "' + to_date + '"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 



            cond += 'and date>="' + from_date + '" and date <= "' + to_date + '"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += 'AND date  = "' + from_date + '"'

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND date  = "' + to_date + '"'

        }


        if (req.body.source != "" && req.body.source != 0 && req.body.source != "0") {

            if(req.body.source == 'all_source'){
                cond += ' '
            }else{
               cond += ' AND source="' + req.body.source + '"' 
            }
            
        }else{

            cond += ' AND source="000"'
        }

        if (req.body.Destination != "" && req.body.Destination != 0 && req.body.Destination != "0" &&
            req.body.Destination != undefined) {
            if(req.body.Destination == 'all_destination'){
                cond += '';
            }else{
                cond += ' AND destination="' + req.body.Destination + '"'
            }
            
        }else{
            cond += ' AND destination="000"';
        }

        

        if (req.body.Status != "" && req.body.Status != 0 && req.body.Status != "0") {
            cond += ' AND status="' + req.body.Status + '"'
        }

        if (req.body.Remarks != "" && req.body.Remarks != 0 && req.body.Remarks != "0") {
            cond += ' AND ( packing_remarks like "%' + req.body.Remarks + '%" OR ' +
                'shipping_remarks like "%' + req.body.Remarks + '%" ' +
                ' OR   receiving_remarks like "%' + req.body.Remarks + '%" )'
        }

        if (req.body.Asn != "" && req.body.Asn != 0 && req.body.Asn != "0") {

            cond += ' AND asn="' + req.body.Asn + '" '
        }

       

        //console.log(req.body.show_details);

        if (mysql.check_permission('asndata', session.user_permission)) {

            if (session.user_id == 1) {

              

                    query_select = `SELECT t1.*,
                    IF(transferred_item  IS NULL,"-",transferred_item) AS transferred_item_new,
                    IF(packed_item  IS NULL,"-",packed_item) AS packed_item_new,
                    IF(received_item  IS NULL,"-",received_item) AS received_item_new,

                    IF(packing_date  IS NULL,"-",packing_date) AS packing_date_new,
                    IF(shipping_date  IS NULL,"-",shipping_date) AS shipping_date_new,
                    IF(receiving_date  IS NULL,"-",receiving_date) AS receiving_date_new
                    

                    FROM asn_master t1  where 1 `+ search_cond +" "+cond+` 
                    GROUP BY asn,status`+ order_by_cond;
                   

                    
                    query_count_per = " select count(*) as `my_count` " +
                        "from (SELECT count(*) as total_item, a.* " +
                        "FROM `asn_master` a where 1 " + search_cond + " " + cond +
                        "GROUP BY asn,status) sq ";

               
              
                 

            } else {

               
                


                    query_select =  `SELECT a.*,
                    IF(transferred_item  IS NULL,"-",transferred_item) AS transferred_item_new,
                    IF(packed_item  IS NULL,"-",packed_item) AS packed_item_new,
                    IF(received_item  IS NULL,"-",received_item) AS received_item_new,

                    IF(packing_date  IS NULL,"-",packing_date) AS packing_date_new,
                    IF(shipping_date  IS NULL,"-",shipping_date) AS shipping_date_new,
                    IF(receiving_date  IS NULL,"-",receiving_date) AS receiving_date_new



                    FROM asn_master a  where (source in (` + storeid + `)  or destination in (`+ storeid + `))`+ search_cond +" "+cond+` 
                    GROUP BY asn,status`+ order_by_cond;

                    // console.log(query_select)
                

                    query_count_per = " select count(*) as `my_count` " +
                        "from (SELECT count(*) as total_item, a.* " +
                        "FROM `asn_master` a where (source in (" + storeid + ")  or destination in (" + storeid + ")) " + search_cond + " " + cond +
                        "GROUP BY asn,status) sq ";



               
            }

            //console.log(query_select);
            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //console.log(gettop20our)
                        var table_data = [];

                        var packing_date    = '';
                        var shipping_date   = '';
                        var receiving_date  = '';
                        var utc             = '';
                      
                        
                        for (var i = 0; i < getstoreinf.length; i++) {


                            packing_date   = getstoreinf[i].packing_date_new;

                            shipping_date  = getstoreinf[i].shipping_date_new;
                            
                            receiving_date = getstoreinf[i].receiving_date_new;
                            




                            if(packing_date!="-")
                            {
                                utc = new Date(packing_date);
                                packing_date = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                packing_date = dateFormat(packing_date, "yyyy-mm-dd HH:MM:ss");
                                packing_date = packing_date.toString()
                            }

                            if(shipping_date!="-")
                            {
                                utc = new Date(shipping_date);
                                shipping_date = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                shipping_date = dateFormat(shipping_date, "yyyy-mm-dd HH:MM:ss");

                                shipping_date = shipping_date.toString()


                            }
                            
                            if(receiving_date!="-")
                            {
                                utc = new Date(receiving_date);
                                receiving_date = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                receiving_date = dateFormat(receiving_date, "yyyy-mm-dd HH:MM:ss");
                                receiving_date = receiving_date.toString()
                            }
                            
                          


                            // console.log(getstoreinf[i].packing_count)
                            
                            var row_data = {
                                "asn": getstoreinf[i].asn,
                                "source": getstoreinf[i].source,
                                "destination": getstoreinf[i].destination,
                                "packed_item_new": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status="packing" class="btn asn_info_model btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].packed_item_new+ '</button>',
                                "transferred_item_new": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status="shipping" class="btn asn_info_model btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].transferred_item_new +  '</button>',
                                "received_item_new": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status="receiving" class="btn asn_info_model btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].received_item_new + '</button>',
                                "status": getstoreinf[i].status,
                                "packing_date": packing_date,
                                "packing_remarks": getstoreinf[i].packing_remarks,
                                "shipping_date":shipping_date ,
                                "shipping_remarks": getstoreinf[i].shipping_remarks,
                                "receiving_date": receiving_date,
                                "receiving_remarks": getstoreinf[i].receiving_remarks,
                                //"action": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status=' + getstoreinf[i].status + ' class="btn asn_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">View</button> ',

                            };
                            


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2177-getasndata');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2181-getasndata');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2740-getasndata');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2747-getasndata');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
function check_problem_asn(var_start_date){
    return new Promise((resolve, reject) => {
       
        var date = var_start_date;

        var abody = {
            "Date":
            {
                "relativeDate":"CUSTOM"
               
                
            }
        };
        
        fetch('http://157.245.110.120/innovent/REFLISTRESULTSHISTORY', {
            method: 'post',
            body: JSON.stringify(abody),
            headers: {
                'apikey': 'ND9B6IWYTUGO4IEW',
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return res.json();
        }).catch(function(error) {
            if(error){
                console2.log('Error', JSON.stringify(error), '3267-problem_Asn_function API ASN json validation');   
            }
            
        })
        .then((json) => {
            var response = json;
           // var response = json;
            var ibt_name     = ''
            var porcess_name = '';
            var result_set   = ''; 
            var matching_qty = '';
            var matching_qty_add = '';
            var api_date = '';
            var my_arr = {};

            for(var i=0;i<response.length;i++){

                ibt_name = response[i].ASN;
                //console.log(ibt_name);
                // if(ibt_name=="519344")
                // {
                    //console.log(ibt_name);

                    result_set = response[i].results;
                  
                    for(var j=0;j<result_set.length;j++){

                        porcess_name = result_set[j].Process;
                        //console.log(porcess_name)
                        matching_qty = result_set[j].matching;
                        
                        api_date     =  result_set[j].Date.value;
                        
                        var matching_qty_add = 0;
                       
                        for (var k=0;k<matching_qty.length;k++){

                            matching_qty_add = matching_qty_add+parseInt(matching_qty[k].Qty);    
                        }


                   
                        
                        if(ibt_name in my_arr)
                        {
                            //console.log("test 444");
                            if(my_arr[ibt_name].porcess_name=="shipping")
                            {
                                var obj={
                                    porcess_name:porcess_name,
                                    api_date:api_date,
                                    matching_qty_add:matching_qty_add
                                
                                };

                               my_arr[ibt_name]= obj;      
                            }
                        }
                        else
                        {
                            //console.log('test 222')
                            var obj={
                                porcess_name:porcess_name,
                                api_date:api_date,
                                matching_qty_add:matching_qty_add
                            
                            };

                            my_arr[ibt_name]= obj;      
                        }
                    }
                }
           
            //}   

            //console.log(my_arr);
            resolve(my_arr);   

        });
    });
}


router.post('/get_problem_asn', authenticationMidleware(), (req, res, next) => {
   

   // try {
        console2.execution_info('get_problem_asn');
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var query_select = '';
        var query_count_per = '';

        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%' and status='shipping' ";
        }



        var fromdate = req.body.from_my_date;
        
        let date22 = new Date(fromdate);

       
        let milisecond = date22.getTime();
        let nanosecond = milisecond;
        let refNum = milisecond;
            
        refNum='1625152953000';      

        if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date22 = req.body.from_my_date;

            var from_date22 = dateFormat(from_my_date22, "yyyy-mm-dd");

            cond += 'AND date  >= "' + from_date22 + '" and status="shipping"';
           
        }else{
            cond += 'AND date  = "000-00-00"'
        }


        if (req.body.Asn != "" &&
            req.body.Asn != 0 &&
            req.body.Asn != "0") {

            cond += ' AND asn  = "' + req.body.Asn + '"';
        }


        var show_details="false";
        if (req.body.show_details =='true' )
        {
            show_details="yes";
        }


        // console.log(show_details);
      
        //if (mysql.check_permission('asndata', session.user_permission)) {

            if (session.user_id == 1) {

                if(show_details == "yes"){   

                  query_select =   `SELECT 
                                    t1.asn,
                                    t1.packing_date,
                                        t1.shipping_date,
                                          t1.receiving_date,
                                          

                                    t1.packed_item,
                                    t1.transferred_item,
                                    t1.received_item,
                                    t1.status as db_status,
                                    (SELECT COUNT(*)  
                                    FROM asn_items AS t2 
                                    WHERE t2.asn = t1.asn AND process= 'packing' and is_deleted = '0')  AS packing_count,
                                    (SELECT COUNT(*)  
                                    FROM asn_items AS t2 
                                    WHERE t2.asn = t1.asn AND process= 'shipping' and is_deleted = '0')  AS shipping_count,
                                    (SELECT COUNT(*)  
                                    FROM asn_items AS t2 
                                    WHERE t2.asn = t1.asn AND process= 'receiving' and is_deleted = '0')  AS receiving_count

                                    
                                    FROM asn_master AS t1 WHERE 1 `+cond; 

                            query_count_per =  `select count(*) as my_count from ( SELECT 
                                t1.asn,
                                t1.packing_date,
                                        t1.shipping_date,
                                          t1.receiving_date,
                                          

                                t1.packed_item,
                                t1.transferred_item,
                                t1.received_item,
                                t1.status
                               
                                FROM asn_master AS t1 WHERE 1  `+cond+` ) sq`
                                          
                    } else{

                        query_select =   `SELECT 
                                    t1.asn,
                                      t1.packing_date,
                                        t1.shipping_date,
                                          t1.receiving_date,

                                    t1.packed_item,
                                    t1.transferred_item,
                                    t1.received_item,
                                    t1.status as db_status
                                    
                                    
                                    FROM asn_master AS t1 WHERE 1 `+cond;

                        console.log(query_select);             

                        query_count_per =  `select count(*) as my_count from ( SELECT 
                            t1.asn,
                              t1.packing_date,
                                t1.shipping_date,
                                  t1.receiving_date,

                            t1.packed_item,
                            t1.transferred_item,
                            t1.received_item,
                            t1.status
                               
                               
                            FROM asn_master AS t1 WHERE 1  `+cond+` ) sq` 


                    }               
               
                       
            } 

            //console.log(query_select);
            

                total_rec = 1000;

                mysql.queryCustom(query_select +" limit 0,1000000").then(function(result) {

                       var  getstoreinf = result.results;
                      
                        var table_data = [];
                        var process_name='';
                        var status=''; 

                        // console.log(refNum)

                        if(!isNaN(refNum)){
                            check_problem_asn(refNum).then(function(returnData22){

                                var vizix_status = '';

                                var packing_count   = 0;
                                var shipping_count  = 0;
                                var receiving_count = 0;
                               
                                for (var i = 0; i < getstoreinf.length; i++) {


                                    packing_date   = getstoreinf[i].packing_date_new;

                                    var asn = getstoreinf[i].asn;
                                    status='';

                                    if(typeof(getstoreinf[i].packing_count) !== "undefined"){
                                        packing_count = getstoreinf[i].packing_count
                                    }

                                    if(typeof(getstoreinf[i].shipping_count) !== "undefined"){
                                        shipping_count = getstoreinf[i].shipping_count
                                    }

                                    if(typeof(getstoreinf[i].receiving_count) !== "undefined"){
                                        receiving_count = getstoreinf[i].receiving_count
                                    }

                                    status = '';
                                    if(asn in returnData22)
                                    {
                                        status = returnData22[asn].porcess_name;

                                     
                                    }
                                    console.log(status +"<=========>"+ getstoreinf[i].db_status)
                                    if(status != getstoreinf[i].db_status){
                                        var row_data = {
                                            "asn": getstoreinf[i].asn,
                                            "packing_date": getstoreinf[i].packing_date,
                                            "shipping_date": getstoreinf[i].shipping_date,
                                            "receiving_date": getstoreinf[i].receiving_date,
                                            "packed_item": getstoreinf[i].packed_item + ' ('+packing_count+')' ,
                                            "transferred_item": getstoreinf[i].transferred_item +' ('+shipping_count+')',
                                            "received_item": getstoreinf[i].received_item + ' ('+receiving_count+')',
                                            "db_status":getstoreinf[i].db_status ,
                                            "status":status
                                            
                                        };
                                        table_data.push(row_data);

                                    }

                                   
                                    
                                }

                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                            });
                        }else{

                            // for (var i = 0; i < getstoreinf.length; i++) {

                            //         var row_data = {
                            //             "asn": '',
                            //             "packed_item": '' ,
                            //             "transferred_item": '' ,
                            //             "received_item": '' ,
                            //             "db_status": '' ,
                            //             "status":''
                                       
                            //         };
                                   
                                    

                            //         table_data.push(row_data);
                            //     }

                            res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                        }
                      
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2177-get_problem_asn');
                        res.end(error);
                    });
                
        
});


function get_payload_stock_count(var_payload,var_storename,var_date){
    return new Promise((resolve, reject) => {

    var payload = var_payload;
   
    var pay22 = JSON.parse(payload);
    var resultset =  pay22.results;
    var storename = var_storename;
    var date = var_date;
    
    var my_arr = {};
    var counted = 0;
    get_payload_db_stock_count(storename,date).then(function(returnData22){

   
        var db_data         = returnData22.db_data;
       
        var counted =  0;
        var db_skues = '';
        var my_arr = {};
        for(var k=0;k<resultset.length;k++){
            
            sku = resultset[k].SKU_original;
            if(typeof(db_data[sku])!=="undefined")
            {

                // db_skues = sku;

                // my_arr[sku]=db_data[sku]



            }else{

                my_arr[sku]=1;
                
            }

            
            
        }

        let sendparamData= {
            resultdata: my_arr
        }

        resolve(sendparamData);
         

    })    
   
    // console.log(my_arr)

    });
}


function get_payload_db_stock_count(var_storename,var_db_date){

    return new Promise((resolve, reject) => {

        var storename = var_storename;
        var date = var_db_date;

        
        var query= "SELECT * FROM stock_count_"+storename+" where stockcountdate='"+date+"'";

        mysql.queryCustom(query)
        .then(function(result) {
            if (result.status == "1") {
                // res.end(JSON.stringify(result.results));
                var result_set = result.results;
                var sku = '';
                var qty_add = 0;
                var my_arr = {};
                for(var i = 0;i<result_set.length;i++){
                    // if(result_set[i].code =='20825355'){
                        my_arr[result_set[i].code]=result_set[i].counted;
                    // }

                }


              
            let sendparam = {
               db_data:my_arr 
            }    
            resolve(sendparam);

            }
        })
        .catch(function(error) {
            console2.log('Error', error, '2314-get_payload_db_stock_count');
            // res.end(error);
        });



    });
}

router.post('/get_extra_stock_count', (req, res, next) => {
    console2.execution_info('get_extra_stock_count');
    // console.log(req.body.Payload);
    if(req.body.Payload !=='' && req.body.StoreID !== '' && req.body.FromDate !== ''){
            
        var payload = req.body.Payload;
        var storenamme = req.body.StoreID;
        var date =  req.body.FromDate;
        get_payload_stock_count(req.body.Payload,req.body.StoreID,req.body.FromDate).then(function(returnData){

                    
            var get_payload_stock_count = returnData.resultdata;

            get_payload_db_stock_count(storenamme,date).then(function(returnData_db){

                var db_date2 = returnData_db.db_data;
                console.log(Object.keys(get_payload_stock_count).length)
                console.log(Object.keys(db_date2).length)
            
                if(Object.keys(get_payload_stock_count).length>Object.keys(db_date2).length)
            {
                var table_data = [];

              
                for (var element in get_payload_stock_count) {

                    //console.log(element)
                    if(get_payload_stock_count[element] in db_date2)
                    {

                        rowdata={
                            "sku":element,
                            "qty":get_payload_stock_count[element]
                        }  
                    }

                    else
                    {
                        rowdata={
                            "sku":element,
                            "qty":'0'
                        }   
                    }
                     
                    table_data.push(rowdata)
                   
                }
                
                
            }else{

                var table_data = [];
                    
                for (var element in db_date2) {
                    if(db_date2 in get_payload_stock_count)
                    {
                        rowdata={
                            "sku":element,
                            "qty":db_date2[element]
                        }  
                    }

                    else
                    {
                        rowdata={
                            "sku":element,
                            "qty":db_date2[element]
                        }  
                    }
                     
                    table_data.push(rowdata)
                   
                }
                //console.log(table_data);
                
            }
            res.end('{"aaData":'+JSON.stringify(table_data)+'}');


            });
           
            
            
                                
        }); 
    }else{
         var table_data = {
            "sku":'',
            "qty":''
         }

        res.end('{"aaData":'+JSON.stringify(table_data)+'}');
    } 
})

router.post('/GetAsnDataDate', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetAsnDataDate');
    try {
        console2.execution_info('GetAsnDataDate');
        var session = req.session;
        var stock_count_tb = '';

        var new_query = "SELECT date FROM `asn_master` where 1 GROUP BY date"

        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '2309-GetAsnDataDate');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2314-GetAsnDataDate');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2777-GetAsnDataDate');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2784-GetAsnDataDate');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/new_getasndata', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('new_getasndata');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var query_select = '';
        var query_count_per = '';

        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            //var CheckDate = dateFormat(datenow, "dd/mm/yyyy");

            //console.log(chekc);
            cond += ' AND date = "' + datenow + '" '

        }

        if (req.body.source != "" && req.body.source != 0 && req.body.source != "0") {
           
            if(req.body.source == 'all_store'){
                cond += ''
            }else{
               cond += ' AND ( source="' + req.body.source + '" OR destination="' + req.body.source + '" ) ' 
            }
            
        } 
        else {
            cond += ' AND source="000" OR destination="000" '
        }

        if (req.body.Asn != "" && req.body.Asn != 0 && req.body.Asn != "0") {

            cond += ' AND asn="' + req.body.Asn + '" '
        }
  
        if (mysql.check_permission('new_asndata', session.user_permission)) {

            if (session.user_id == 1) {

                query_select = "SELECT  " +
                    " *  FROM `asn_master`  where 1 " + search_cond + " " + cond +
                    " GROUP BY asn,status" + order_by_cond;

            
                query_count_per = " select count(*) as `my_count` " +
                    "from (SELECT count(*) as total_item, a.* " +
                    "FROM `asn_master` a where 1 " + search_cond + " " + cond +
                    "GROUP BY asn,status) sq ";

            } else {

                query_select = "SELECT  " +
                    " *  FROM `asn_master` where (source in (" + storeid + ")  or destination in (" + storeid + ")) " + search_cond + " " + cond +
                    " GROUP BY asn,status" + order_by_cond;


                //console.log(query_select);
                query_count_per = " select count(*) as `my_count` " +
                    "from (SELECT count(*) as total_item, a.* " +
                    "FROM `asn_master` a where (source in (" + storeid + ")  or destination in (" + storeid + ")) " + search_cond + " " + cond +
                    "GROUP BY asn,status) sq ";

                //console.log(query_count_per);
            }

            //console.log(query_select);

            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;

                        var table_data = [];

                        var button = '';

                        for (var i = 0; i < getstoreinf.length; i++) {

                            if (getstoreinf[i].status == 'cancelled') {

                                button = '';

                            } else {
                                button = '| <button type="button" asn_id=' + getstoreinf[i].asn + ' class="btn cancel_asn btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Cancel</button>'
                            }

                            var row_data = {
                                "date": getstoreinf[i].date,
                                "asn": getstoreinf[i].asn,
                                "source": getstoreinf[i].source,
                                "destination": getstoreinf[i].destination,
                                "packed_item": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status="packing" class="btn asn_info_model btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].packed_item + '</button>',
                                "transferred_item": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status="shipping" class="btn asn_info_model btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].transferred_item + '</button>',
                                "received_item": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status="receiving" class="btn asn_info_model btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].received_item + '</button>',
                                "status": getstoreinf[i].status,
                                "action": '<button type="button"  asn_id=' + getstoreinf[i].asn + '  class="btn asn_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">View</button>' + button,

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2291-new_getasndata');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2295-new_getasndata');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2934-new_getasndata');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2941-new_getasndata');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/short_asn_details', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('short_asn_details');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }

        // if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {

        //     cond += ' AND store_id="' + req.body.StoreID + '" '

        // }

        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            var CheckDate = dateFormat(datenow, "dd/mm/yyyy");

            //console.log(chekc);
            cond += ' AND date like "%' + CheckDate + '%" '

        }

        // if (req.body.Process != "" && req.body.Process != 0 && req.body.Process != "0") {
        //     cond += ' AND process="' + req.body.Process + '" '
        // }

        // if (req.body.Asn != "" && req.body.Asn != 0 && req.body.Asn != "0") {

        //     cond += ' AND asn="' + req.body.Asn + '" '
        // }

        // if (req.body.SerialNumber != "" && req.body.SerialNumber != 0 && req.body.SerialNumber != "0") {


        //     cond += ' AND tag_id like "%' + req.body.SerialNumber + '%" '
        // }

        if (mysql.check_permission('asndata', session.user_permission)) {

            var new_query = "SELECT * " +
                " FROM asn_master" +
                " WHERE transferred_item > received_item" + cond;
            //console.log(new_query);

            var query_count = " select count(*) as `my_count` " +
                "from (SELECT * FROM asn_master " +
                " WHERE transferred_item > received_item " + cond + ") sq ";
            //console.log("sssssssssss"+new_query)
            //abdulrehmanijaz



            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;

                        var table_data = [];
                        var button = '';
                        for (var i = 0; i < getstoreinf.length; i++) {



                            var row_data = {

                                "date": getstoreinf[i].date,
                                "asn": getstoreinf[i].asn,
                                "source": getstoreinf[i].source,
                                "destination": getstoreinf[i].destination,
                                "packed_item": getstoreinf[i].packed_item,
                                "transferred_item": getstoreinf[i].transferred_item,
                                "received_item": getstoreinf[i].received_item,
                                "status": getstoreinf[i].status,
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2408-short_asn_details');
                        res.end(error);
                        //res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2413-short_asn_details');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3068-short_asn_details');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3075-short_asn_details');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/access_asn_details', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('access_asn_details');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }

        // if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {

        //     cond += ' AND store_id="' + req.body.StoreID + '" '

        // }

        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            var CheckDate = dateFormat(datenow, "dd/mm/yyyy");

            //console.log(chekc);
            cond += ' AND date like "%' + CheckDate + '%" '

        }

        // if (req.body.Process != "" && req.body.Process != 0 && req.body.Process != "0") {
        //     cond += ' AND process="' + req.body.Process + '" '
        // }

        // if (req.body.Asn != "" && req.body.Asn != 0 && req.body.Asn != "0") {

        //     cond += ' AND asn="' + req.body.Asn + '" '
        // }

        // if (req.body.SerialNumber != "" && req.body.SerialNumber != 0 && req.body.SerialNumber != "0") {


        //     cond += ' AND tag_id like "%' + req.body.SerialNumber + '%" '
        // }

        if (mysql.check_permission('asndata', session.user_permission)) {

            var new_query = "SELECT * FROM asn_master WHERE transferred_item < received_item" + cond;
            //console.log(new_query);

            var query_count = "select count(*) as `my_count` " +
                "from (SELECT * FROM asn_master WHERE transferred_item < received_item " + cond + " ) sq ";
            //console.log("sssssssssss"+new_query)
            //abdulrehmanijaz



            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;

                        var table_data = [];
                        var button = '';
                        for (var i = 0; i < getstoreinf.length; i++) {



                            var row_data = {

                                "date": getstoreinf[i].date,
                                "asn": getstoreinf[i].asn,
                                "source": getstoreinf[i].source,
                                "destination": getstoreinf[i].destination,
                                "packed_item": getstoreinf[i].packed_item,
                                "transferred_item": getstoreinf[i].transferred_item,
                                "received_item": getstoreinf[i].received_item,
                                "status": getstoreinf[i].status,
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2524-access_asn_details');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2528-access_asn_details');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3199-access_asn_details');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3206-access_asn_details');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




//get Cancel Asn Data
router.post('/Cancel_getasndata', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Cancel_getasndata');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and asn like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {

            cond += ' AND store_id="' + req.body.StoreID + '" '

        }

        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            var CheckDate = dateFormat(datenow, "dd/mm/yyyy");

            //console.log(chekc);
            cond += ' AND date like "%' + CheckDate + '%" '

        }

        if (req.body.Process != "" && req.body.Process != 0 && req.body.Process != "0") {
            cond += ' AND process="' + req.body.process + '" '
        }

        if (req.body.Asn != "" && req.body.Asn != 0 && req.body.Asn != "0") {

            cond += ' AND asn="' + req.body.Asn + '" '
        }

        if (req.body.SerialNumber != "" && req.body.SerialNumber != 0 && req.body.SerialNumber != "0") {


            cond += ' AND tag_id like "%' + req.body.SerialNumber + '%" '
        }

        if (mysql.check_permission('asndata', session.user_permission)) {

            var new_query = "SELECT count(*) as total_item, " +
                "a.* FROM `cancel_asn_items` a where 1 " + search_cond + " " + cond +
                "GROUP BY  process,asn " + order_by_cond;
            //console.log(new_query);

            var query_count = " select count(*) as `my_count` " +
                "from (SELECT count(*) as total_item, a.* " +
                "FROM `cancel_asn_items` a where 1 " + search_cond + " " + cond +
                "GROUP BY  process,asn) sq ";
            //console.log("sssssssssss"+new_query)
            //abdulrehmanijaz

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //console.log(gettop20our)
                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "id": getstoreinf[i].id,
                                "date": getstoreinf[i].date,
                                "asn": getstoreinf[i].asn,
                                "process_status": getstoreinf[i].process,
                                "department": getstoreinf[i].department,
                                "destination": getstoreinf[i].destination_location,
                                "style": getstoreinf[i].style,
                                "color": getstoreinf[i].color,
                                "brand": getstoreinf[i].brand,
                                "action": '<button type="button" asn_id=' + getstoreinf[i].asn + ' process_status=' + getstoreinf[i].process + ' class="btn asn_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent" data-toggle="modal" data-target="#exampleModal">View</button>',
                                // "purchase_order":getstoreinf[i].purchase_order,
                                // "user":getstoreinf[i].user,
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2643-Cancel_getasndata');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2647-Cancel_getasndata');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3334-Cancel_getasndata');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3341-Cancel_getasndata');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getgoodsForGi_Cancellation', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getgoodsForGi_Cancellation');

    try {
        var session = req.session;

        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;


        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query_select = '';
        var query_count_per = '';


        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and shipment_number like '%" + req.body.search['value'] + "%'";
        }
        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 



            cond += 'and date>="' + from_date + ' 00:00:00" and date <= "' + to_date + ' 23:59:59"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + from_date + '")'

           

            

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {

            if(req.body.store_id == "all_destination"){
                cond += '';
            }else{
                cond += ' AND store="' + req.body.store_id + '" '
            }
        
        } 
        else {
            cond += ' AND store="000"'
        }


        if (req.body.RetailItemBatchId != "" && req.body.RetailItemBatchId != 0 && req.body.RetailItemBatchId != "0" && req.body.RetailItemBatchId != undefined) {
            cond += ' AND retail_item_batch_id="' + req.body.RetailItemBatchId + '" '
        }

        if (req.body.EPC != "" && req.body.EPC != 0 && req.body.EPC != "0" &&
            req.body.EPC != undefined) {
            cond += ' AND epc="' + req.body.EPC + '" '
        }

        if (req.body.SKU != "" && req.body.SKU != 0 && req.body.EPC != "0" &&
            req.body.SKU != undefined) {
            cond += ' AND refno="' + req.body.SKU + '" '
        }

        if (req.body.supplier_number != "" && req.body.supplier_number != 0 &&
            req.body.supplier_number != undefined) {
            cond += ' AND supplier_number="' + req.body.supplier_number + '" '
        }

        if (req.body.shipment_number != "" && req.body.shipment_number != 0 &&
            req.body.shipment_number != undefined) {
            cond += ' AND shipment_number="' + req.body.shipment_number + '" '
        }

        if (req.body.Retail_Item_Batch_Id != "" && req.body.Retail_Item_Batch_Id != 0 &&
            req.body.Retail_Item_Batch_Id != undefined) {
            cond += ' AND   retail_item_batch_id="' + req.body.Retail_Item_Batch_Id + '" '
        }



        if (mysql.check_permission('GoodsStockStore', session.user_permission)) {


            if (session.user_id == 1) {

                query_select = "SELECT * FROM `goods_item_store` " +
                    " where (is_deleted='0' OR is_deleted='2') " + cond + " " + search_cond + "  " + order_by_cond;

                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_store`  where (is_deleted='0' OR is_deleted='2') " + cond + " " + search_cond + ") sq ";

            } else {


                query_select = "SELECT * FROM `goods_item_store` " +
                    " where store in (" + storeid + ") " + cond + " " + search_cond + "  " + order_by_cond;


                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_store`  where store in (" + storeid + ") " + cond + " " + search_cond + ") sq ";

            }

            console.log(query_select);
            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        var date_good = '';
                        var utc = '';

                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {


                            date_good = getstoreinf[i].date;
                            if(date_good!="")
                            {
                                utc = new Date(date_good);
                                date_good = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                date_good = dateFormat(date_good, "yyyy-mm-dd HH:MM:ss");
                                date_good = date_good.toString()
                            }


                            var row_data = {
                                "date": date_good,
                                "refno": getstoreinf[i].refno,
                                "retail_item_batch_id": getstoreinf[i].retail_item_batch_id,
                                "supplier_number": getstoreinf[i].supplier_number,
                                "shipment_number": getstoreinf[i].shipment_number,
                                "store": getstoreinf[i].store,
                                "purchase_order": getstoreinf[i].purchase_order,
                                 
                                 "epc": getstoreinf[i].epc,
                                "remarks": getstoreinf[i].remarks,
                                "id": getstoreinf[i].id,
                                "comments": (getstoreinf[i].is_deleted == 2 ? 'Cancelled' : '<button type="button" goods_item_store_id=' + getstoreinf[i].goods_item_store_id + ' class="btn cancel_gi btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Cancel</button>')+'',
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2823-getgoodsForGi_Cancellation');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2827-getgoodsForGi_Cancellation');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3532-getgoodsForGi_Cancellation');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3539-getgoodsForGi_Cancellation');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
/*********** CancelGI ***********/
router.post('/CancelGI', (req, res, next) => {
console2.execution_info('CancelGI');
    try {
        var session = req.session;

        var process_type = req.body.process_type
        var goods_item_store_id = req.body.goods_item_store_id;
        var update_query = "UPDATE `goods_item_store` SET is_deleted= 2 WHERE `goods_item_store_id` ='" + goods_item_store_id + "' ";
        mysql.queryCustom(update_query).then(function(result) {
            if (result.status == "1") {
                // res.end(JSON.stringify(result.results));
                res.end('done');
            } else {
                console2.log('Error', JSON.stringify(result.error), '217-CancelGI');
            }
        }).catch(function(error) {

            console2.log('Error', JSON.stringify(error), '223-CancelGI');
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '268-CancelGI');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Went Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '275-CancelGI');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Went Wrong !'
            });
        }
    }
});

router.post('/getgoodsstore', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getgoodsstore');
    try {
        var session = req.session;


        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;


        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query_select = '';
        var query_count_per = '';


        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and shipment_number like '%" + req.body.search['value'] + "%'";
        }
        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 



            cond += 'and date>="' + from_date + ' 00:00:00" and date <= "' + to_date + ' 23:59:59"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + from_date + '")'

           

            

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {

            if(req.body.store_id == "all_destination"){
                cond += '';
            }else{
                cond += ' AND store="' + req.body.store_id + '" '
            }
        
        } 
        else {
            cond += ' AND store="000"'
        }


        if (req.body.RetailItemBatchId != "" && req.body.RetailItemBatchId != 0 && req.body.RetailItemBatchId != "0" && req.body.RetailItemBatchId != undefined) {
            cond += ' AND retail_item_batch_id="' + req.body.RetailItemBatchId + '" '
        }

        if (req.body.EPC != "" && req.body.EPC != 0 && req.body.EPC != "0" &&
            req.body.EPC != undefined) {
            cond += ' AND epc="' + req.body.EPC + '" '
        }

        if (req.body.SKU != "" && req.body.SKU != 0 && req.body.EPC != "0" &&
            req.body.SKU != undefined) {
            cond += ' AND refno="' + req.body.SKU + '" '
        }

        if (req.body.supplier_number != "" && req.body.supplier_number != 0 &&
            req.body.supplier_number != undefined) {
            cond += ' AND supplier_number="' + req.body.supplier_number + '" '
        }

        if (req.body.shipment_number != "" && req.body.shipment_number != 0 &&
            req.body.shipment_number != undefined) {
            cond += ' AND shipment_number="' + req.body.shipment_number + '" '
        }

        if (req.body.Retail_Item_Batch_Id != "" && req.body.Retail_Item_Batch_Id != 0 &&
            req.body.Retail_Item_Batch_Id != undefined) {
            cond += ' AND   retail_item_batch_id="' + req.body.Retail_Item_Batch_Id + '" '
        }



        if (mysql.check_permission('GoodsStockStore', session.user_permission)) {


            if (session.user_id == 1) {

                query_select = "SELECT * FROM `goods_item_store` " +
                    " where is_deleted='0' " + cond + " " + search_cond + "  " + order_by_cond;

                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_store`  where is_deleted='0' " + cond + " " + search_cond + ") sq ";

            } else {


                query_select = "SELECT * FROM `goods_item_store` " +
                    " where store in (" + storeid + ") " + cond + " " + search_cond + "  " + order_by_cond;


                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_store`  where store in (" + storeid + ") " + cond + " " + search_cond + ") sq ";

            }

            //console.log(query_select);
            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        var date_good = '';
                        var utc = '';

                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {


                            date_good = getstoreinf[i].date;
                            if(date_good!="")
                            {
                                utc = new Date(date_good);
                                date_good = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                date_good = dateFormat(date_good, "yyyy-mm-dd HH:MM:ss");
                                date_good = date_good.toString()
                            }


                            var row_data = {
                                "date": date_good,
                                "refno": getstoreinf[i].refno,
                                "retail_item_batch_id": getstoreinf[i].retail_item_batch_id,
                                "supplier_number": getstoreinf[i].supplier_number,
                                "shipment_number": getstoreinf[i].shipment_number,
                                "store": getstoreinf[i].store,
                                "purchase_order": getstoreinf[i].purchase_order,
                                 
                                 "epc": getstoreinf[i].epc,
                                "remarks": getstoreinf[i].remarks,
                                "id": getstoreinf[i].id,
                                "comments": getstoreinf[i].comments,
                                // "action":'<button type="button" edit_id='+getstoreinf[i].id+'  class="btn asn_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button>',

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2823-getgoodsstore');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2827-getgoodsstore');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3532-getgoodsstore');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3539-getgoodsstore');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
router.post('/getgoodsstoreDetails', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getgoodsstoreDetails');
    try {
        var session = req.session;


        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;


        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query_select = '';
        var query_count_per = '';


        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and shipment_number like '%" + req.body.search['value'] + "%'";
        }
        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 



            cond += 'and date>="' + from_date + ' 00:00:00" and date <= "' + to_date + ' 23:59:59"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + from_date + '")'

           

            

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {

            if(req.body.store_id == "all_destination"){
                cond += '';
            }else{
                cond += ' AND store="' + req.body.store_id + '" '
            }
        
        } 
        else {
            cond += ' AND store="000"'
        }


        if (req.body.RetailItemBatchId != "" && req.body.RetailItemBatchId != 0 && req.body.RetailItemBatchId != "0" && req.body.RetailItemBatchId != undefined) {
            cond += ' AND retail_item_batch_id="' + req.body.RetailItemBatchId + '" '
        }

        if (req.body.EPC != "" && req.body.EPC != 0 && req.body.EPC != "0" &&
            req.body.EPC != undefined) {
            cond += ' AND epc="' + req.body.EPC + '" '
        }

        if (req.body.SKU != "" && req.body.SKU != 0 && req.body.EPC != "0" &&
            req.body.SKU != undefined) {
            cond += ' AND refno="' + req.body.SKU + '" '
        }

        if (req.body.supplier_number != "" && req.body.supplier_number != 0 &&
            req.body.supplier_number != undefined) {
            cond += ' AND supplier_number="' + req.body.supplier_number + '" '
        }

        if (req.body.shipment_number != "" && req.body.shipment_number != 0 &&
            req.body.shipment_number != undefined) {
            cond += ' AND shipment_number="' + req.body.shipment_number + '" '
        }

        if (req.body.Retail_Item_Batch_Id != "" && req.body.Retail_Item_Batch_Id != 0 &&
            req.body.Retail_Item_Batch_Id != undefined) {
            cond += ' AND   retail_item_batch_id="' + req.body.Retail_Item_Batch_Id + '" '
        }



        if (mysql.check_permission('GoodsDetail', session.user_permission)) {


            if (session.user_id == 1) {

                query_select = "SELECT * FROM `goods_item_store` " +
                    " where is_deleted='0' " + cond + " " + search_cond + "  " + order_by_cond;

                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_store`  where is_deleted='0' " + cond + " " + search_cond + ") sq ";

            } else {


                query_select = "SELECT * FROM `goods_item_store` " +
                    " where store in (" + storeid + ") " + cond + " " + search_cond + "  " + order_by_cond;


                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_store`  where store in (" + storeid + ") " + cond + " " + search_cond + ") sq ";

            }

            //console.log(query_select);
            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        var date_good = '';
                        var utc = '';

                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {


                            date_good = getstoreinf[i].date;
                            if(date_good!="")
                            {
                                utc = new Date(date_good);
                                date_good = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                date_good = dateFormat(date_good, "yyyy-mm-dd HH:MM:ss");
                                date_good = date_good.toString()
                            }


                            var row_data = {
                                "date": date_good,
                                "refno": getstoreinf[i].refno,
                                "retail_item_batch_id": getstoreinf[i].retail_item_batch_id,
                                "supplier_number": getstoreinf[i].supplier_number,
                                "shipment_number": getstoreinf[i].shipment_number,
                                "store": getstoreinf[i].store,
                                "purchase_order": getstoreinf[i].purchase_order,
                                 
                                 "epc": getstoreinf[i].epc,
                                "remarks": getstoreinf[i].remarks,
                                "id": getstoreinf[i].id,
                                "comments": getstoreinf[i].comments,
                                // "action":'<button type="button" edit_id='+getstoreinf[i].id+'  class="btn asn_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button>',

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2823-getgoodsstore');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2827-getgoodsstore');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection', '3532-getgoodsstore');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '3539-getgoodsstore');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
router.post('/getgoodssummary', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getgoodssummary');
    try {
        var session = req.session;


        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;


        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query_select = '';
        var query_count_per = '';


        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and shipment_number like '%" + req.body.search['value'] + "%'";
        }
        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 



            cond += 'and date>="' + from_date + ' 00:00:00" and date <= "' + to_date + ' 23:59:59"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + from_date + '")'

           

            

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'

            

        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {

            if(req.body.store_id == "all_destination"){
                cond += '';
            }else{
                cond += ' AND store="' + req.body.store_id + '" '
            }
        
        } 
        else {
            cond += ' AND store="000"'
        }


        if (req.body.RetailItemBatchId != "" && req.body.RetailItemBatchId != 0 && req.body.RetailItemBatchId != "0" && req.body.RetailItemBatchId != undefined) {
            cond += ' AND retail_item_batch_id="' + req.body.RetailItemBatchId + '" '
        }

       

        if (req.body.Retail_Item_Batch_Id != "" && req.body.Retail_Item_Batch_Id != 0 &&
            req.body.Retail_Item_Batch_Id != undefined) {
            cond += ' AND   retail_item_batch_id="' + req.body.Retail_Item_Batch_Id + '" '
        }



        if (mysql.check_permission('GoodsSummary', session.user_permission)) {


            if (session.user_id == 1) {
                query_select = `SELECT store, retail_item_batch_id,
                 COUNT(retail_item_batch_id) as Items_Count, 
                 date FROM goods_item_store 
                  WHERE 1 and   is_deleted  = '0' `+cond+`  
                  GROUP BY retail_item_batch_id HAVING COUNT(retail_item_batch_id)> 0 order by date Asc`


                  query_count_per = ` select count(*) as my_count from 
                  (SELECT store, retail_item_batch_id, COUNT(retail_item_batch_id) as Items_Count, 
                 date FROM goods_item_store 
                  WHERE 1 and   is_deleted  = '0' `+cond+`  
                  GROUP BY retail_item_batch_id HAVING COUNT(retail_item_batch_id)> 0 order by date Asc) sq`

                
               //console.log(query_select)

            } else {


                query_select = `SELECT store, retail_item_batch_id,
                     COUNT(retail_item_batch_id) as Items_Count, 
                     date FROM goods_item_store 
                      WHERE 1 and   is_deleted  = '0' and store in (` + storeid + `)  `+cond+`  
                      GROUP BY retail_item_batch_id HAVING COUNT(retail_item_batch_id)> 0 order by date Asc`


               query_count_per = ` select count(*) as my_count from 
                  (SELECT store, retail_item_batch_id, COUNT(retail_item_batch_id) as Items_Count, 
                 date FROM goods_item_store 
                  WHERE 1 and   is_deleted  = '0' and  store in (` + storeid + `)  `+cond+`  
                  GROUP BY retail_item_batch_id HAVING COUNT(retail_item_batch_id)> 0 order by date Asc) sq`
    
            }

            //console.log(query_select);
            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        var date_good = '';
                        var utc = '';

                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {


                            date_good = getstoreinf[i].date;
                            if(date_good!="")
                            {
                                utc = new Date(date_good);
                                date_good = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                date_good = dateFormat(date_good, "yyyy-mm-dd HH:MM:ss");
                                date_good = date_good.toString()
                            }
                           

                            var row_data = {
                                "store": getstoreinf[i].store,
                                "retail_item_batch_id": '<button type="button" store_id=' + getstoreinf[i].store + ' retail_item_batch_id='+getstoreinf[i].retail_item_batch_id+' class="btn goods_info btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].retail_item_batch_id+ '</button>',
                                "item_count":'<button type="button" store_id=' + getstoreinf[i].store + ' item_count='+getstoreinf[i].Items_Count+' class="btn goods_info btn-default" style="color:#fff;border:0;border-radius:0px;background:transparent;width:50%;border-bottom: 1px solid blue;">' + getstoreinf[i].Items_Count+ '</button>',
                                "date": date_good,   
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '2823-getgoodssummary');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2827-getgoodssummary');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection', '3532-getgoodssummary');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '3539-getgoodssummary');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getgoodswarehouse', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getgoodswarehouse');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var query_select = '';
        var query_count_per = '';

        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and shipment_number like '%" + req.body.search['value'] + "%'";
        }

        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'
           

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            //AND  date >= like "%' + from_date + '%" and date like <= "%'+to_date+'%" 



            cond += 'and date>="' + from_date + ' 00:00:00" and date <= "' + to_date + ' 23:59:59"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + from_date + '")'
         

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND DATE(date) = DATE("' + to_date + '")'
          

        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            
            if(req.body.store_id == "all_destination"){
                cond += '';
            }else{
                cond += ' AND store="' + req.body.store_id + '" '
            }

            
        } 
        else {
            cond += ' AND store="000" '
        }


        if (req.body.RetailItemBatchId != "" && req.body.RetailItemBatchId != 0 && req.body.RetailItemBatchId != "0" && req.body.RetailItemBatchId != undefined) {
            cond += ' AND retail_item_batch_id="' + req.body.RetailItemBatchId + '" '
        }

        if (req.body.EPC != "" && req.body.EPC != 0 && req.body.EPC != "0" &&
            req.body.EPC != undefined) {
            cond += ' AND epc="' + req.body.EPC + '" '
        }

        if (req.body.SKU != "" && req.body.SKU != 0 && req.body.EPC != "0" &&
            req.body.SKU != undefined) {
            cond += ' AND refno="' + req.body.SKU + '" '
        }
        if (req.body.supplier_number != "" && req.body.supplier_number != 0 &&
            req.body.supplier_number != undefined) {
            cond += ' AND supplier_number="' + req.body.supplier_number + '" '
        }

        if (req.body.shipment_number != "" && req.body.shipment_number != 0 &&
            req.body.shipment_number != undefined) {
            cond += ' AND shipment_number="' + req.body.shipment_number + '" '
        }

        if (req.body.Retail_Item_Batch_Id != "" && req.body.Retail_Item_Batch_Id != 0 &&
            req.body.Retail_Item_Batch_Id != undefined) {
            cond += ' AND retail_item_batch_id="' + req.body.Retail_Item_Batch_Id + '" '
        }

        if (mysql.check_permission('GoodsStockWareHouse', session.user_permission)) {

            //console.log(session.user_id);
            if (session.user_id == 1) {

                query_select = "SELECT * FROM `goods_item_warehouse` " +
                    " where 1 " + cond + " " + search_cond + "  " + order_by_cond;

                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_warehouse`  where 1 " + cond + " " + search_cond + ") sq ";

            } else {


                query_select = "SELECT * FROM `goods_item_warehouse` " +
                    " where store in (" + storeid + ") " + cond + " " + search_cond + "  " + order_by_cond;


                query_count_per = " select count(*) as `my_count` from " +
                    " (SELECT * FROM `goods_item_warehouse`  where store in (" + storeid + ") " + cond + " " + search_cond + ") sq ";

            }

            //console.log(query_select);

            mysql.queryCustom(query_count_per).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(query_select + limit_cond).then(function(result) {

                        getstoreinf = result.results;

                        var table_data = [];
                        var date_good = '';
                        var utc = '';
                        for (var i = 0; i < getstoreinf.length; i++) {

                            date_good = getstoreinf[i].date;
                            if(date_good!="")
                            {
                                utc = new Date(date_good);
                                date_good = new Date(utc.getTime() + (3 * 60 * 60 * 1000));
                                date_good = dateFormat(date_good, "yyyy-mm-dd HH:MM:ss");
                                date_good = date_good.toString()
                            }


                            var row_data = {
                                "date": date_good,
                                "refno": getstoreinf[i].refno,
                                "retail_item_batch_id": getstoreinf[i].retail_item_batch_id,
                                "supplier_number": getstoreinf[i].supplier_number,
                                "shipment_number": getstoreinf[i].shipment_number,
                                "store": getstoreinf[i].store,
                                "purchase_order": getstoreinf[i].purchase_order,
                                "comments": getstoreinf[i].comments,
                                "id": getstoreinf[i].id,
                                "epc": getstoreinf[i].epc,
                                "remarks": getstoreinf[i].remarks
                                // "action":'<button type="button" edit_id='+getstoreinf[i].id+'  class="btn asn_details btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button>',

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '3000-getgoodswarehouse');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3004-getgoodswarehouse');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3727-getgoodswarehouse');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3734-getgoodswarehouse');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getprinter
router.post('/getprinter', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('getprinter');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 6) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and ip like '%" + req.body.search['value'] + "%'";
        }
        //if(mysql.check_permission('asndata',session.user_permission)){
        var new_query = "SELECT " +
            " *,CASE WHEN status = 1 THEN 'Active' ELSE 'Disable' END AS status FROM printer WHERE 1 " + search_cond + " " + order_by_cond;

        var query_count = " select count(*) as `my_count` from (SELECT * FROM printer WHERE 1 " + search_cond + ") sq ";
        //console.log("sssssssssss"+new_query)
        //abdulrehmanijaz
        if (mysql.check_permission('printer', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //console.log(gettop20our)
                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {
                            store_id = getstoreinf[i].storeid;
                            store_id = store_id.split('[').join('');
                            store_id = store_id.split(']').join('');
                            store_id = store_id.split('"').join('');
                            var row_data = {
                                "id": getstoreinf[i].id,
                                "name": getstoreinf[i].name,
                                "ip": getstoreinf[i].ip,
                                "port": getstoreinf[i].port,
                                "storeid": store_id,
                                //'<button type="button" store_id=' + getstoreinf[i].storeid + ' class="btn storename btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent" data-toggle="modal" data-target="#exampleModal">View</button>',
                                "status": getstoreinf[i].status,
                                "remarks": getstoreinf[i].remarks,
                                'action': '<button type="button" edit_id=' + getstoreinf[i].id + ' class="btn PrinterEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button> <button type="button" del_id=' + getstoreinf[i].id + ' class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button>'

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '3083-getprinter');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3087-getprinter');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3825-getprinter');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3832-getprinter');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});


//get getzplinfo
router.post('/getzplinfo', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getzplinfo');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        //allover the wor
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and name like '%" + req.body.search['value'] + "%'";
        }
        //if(mysql.check_permission('asndata',session.user_permission)){
        var new_query = "SELECT * , CASE WHEN status = 1 THEN 'Active' ELSE 'Disable' END AS status" +
            " FROM zpl WHERE 1 " + search_cond + " " + order_by_cond;

        // console.log("+++++++++++++"+new_query);    

        var query_count = " select count(*) as `my_count` from (SELECT * FROM zpl WHERE 1 " + search_cond + ") sq ";
        //console.log("sssssssssss"+new_query)
        //abdulrehmanijaz
        if (mysql.check_permission('zpl', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;



                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //'<button type="button" store_id=' + getstoreinf[i].storeid + ' class="btn storename btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent" data-toggle="modal" data-target="#exampleModal">View</button>'
                        var table_data = [];
                        var store_id = '';
                        for (var i = 0; i < getstoreinf.length; i++) {

                            store_id = getstoreinf[i].storeid;
                            store_id = store_id.split('[').join('');
                            store_id = store_id.split(']').join('');
                            store_id = store_id.split('"').join('');
                            var row_data = {
                                "id": getstoreinf[i].id,
                                "name": getstoreinf[i].name,
                                "zplbutton": '<button type="button" zpl_id=' + getstoreinf[i].id + ' class="btn store_zpl_id btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent" data-toggle="modal" data-target="#exampleModal">View</button>',
                                "storeid": store_id,
                                "status": getstoreinf[i].status,
                                "remarks": unescape(getstoreinf[i].remarks),
                                'action': '<button type="button" edit_id=' + getstoreinf[i].id + ' class="btn ZPLEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button> <button type="button" del_id=' + getstoreinf[i].id + ' class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button>'
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '3182-getzplinfo');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3186-getzplinfo');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3926-getzplinfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3933-getzplinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }



});



router.post('/ViewZPLModel', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ViewZPLModel');
    try {
        var session = req.session;
        var new_query = "SELECT zpl FROM zpl" +
            " WHERE id = '" + req.body.zpl_id + "' ";


        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3222-ViewZPLModel');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3228-ViewZPLModel');
                res.end(error);

            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '3970-ViewZPLModel');

        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '3978-ViewZPLModel');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/qrcodeRequset', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('qrcodeRequset');
    try {
        var session = req.session;
        var username = '';
        var password = '';
        var device_unique_id = '';
        var connection = '';
        var ip = req.get('host');
        var store_id = '';
        var device_id = req.body.device_id;
        // console.log(device_id);


        //res.end('aaaaaaa');
        var new_query = "SELECT * FROM handheld_devices WHERE id = '" + device_id + "'"

        //console.log(new_query);
        mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    var result22 = JSON.stringify(result.results[0]);
                    var response_data = JSON.parse(result22);
                    //res.end(response_data);



                    var ns_connection2 = response_data.ns_connection;
                    ns_connection2 = ns_connection2.toLocaleLowerCase();

                    var device_ip2 = response_data.device_ip;

                    var ss_connection2 = response_data.ss_connection;

                    ss_connection2 = ss_connection2.toLocaleLowerCase();

                    var server_ip2 = response_data.server_ip;
                    var username2 = response_data.username;
                    var password2 = response_data.password;
                    var store_id2 = response_data.storeid;

                    var QRCode = require('qrcode');

                    console.log("" + ss_connection2 + "|" + server_ip2 + "|" + ns_connection2 + "|" + device_ip2 + "|" + username2 + "|" + password2 + "|" + store_id2 + "");



                    QRCode.toDataURL("" + ss_connection2 + "|" + server_ip2 + "|" + ns_connection2 + "|" + device_ip2 + "|" + username2 + "|" + password2 + "|" + store_id2 + "", function(err, url) {
                        //console.log(url)
                        res.end("<a href='" + url + "' download><img id='qrcode' src='" + url + "'></a>");
                    })
                    //res.end("aa");

                } else {

                    console2.log('Error', JSON.stringify(result.error), '3285-qrcodeRequset');
                    res.end(result.error);

                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3228-qrcodeRequset');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4050-qrcodeRequset');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4057-qrcodeRequset');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//Get HandHeld Devices
router.post('/gethandhelddevice', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('gethandhelddevice');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';


        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 4) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and device_unique_id like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.DeviceID != "" && req.body.DeviceID != 0 && req.body.DeviceID != "0") {
           // cond += ' AND HD.device_unique_id="' + req.body.DeviceID + '" '
        }

        if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {
          //  cond += ' AND HD.storeid="' + req.body.StoreID + '" '
        }

        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            //cond += ' AND HD.storeid="' + req.body.storeid + '" '
        }

        var new_query = "SELECT HD.id, HD.username AS username , " +
            "HD.description AS description," +
            "HD.uuid AS uuid,TS.storename,TS.store_location," +
            "CASE WHEN HD.status = 1 THEN 'Active' ELSE 'Disable' END AS statuss " +
            " FROM handheld_devices HD " +
            " LEFT JOIN tb_store TS ON HD.storeid=TS.storeid " +
            "WHERE 1 " + cond + search_cond + " " + order_by_cond;
        //console.log('ssssssss'+new_query);
        var query_count = " select count(*) as `my_count` from (SELECT HD.device_unique_id AS DeviceUniqueId," +
            "HD.description AS description," +
            " HD.last_sync AS last_sync,HD.last_usages AS last_usages,TS.storename," +
            "CASE WHEN HD.status = 1 THEN 'Active' ELSE 'Disable' END AS statuss " +
            " FROM handheld_devices HD " +
            " LEFT JOIN tb_store TS ON HD.storeid=TS.storeid " +
            "WHERE 1 " + search_cond + cond + ") sq ";


        //abdulrehmanijaz
        //res.end(query_count);
        //if (mysql.check_permission('handheldDevices', session.user_permission)) {
        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;


                    var table_data = [];
                    var qr_code_button = '';
                    var edit_button_dev = '';
                    var edit_button = '';

                    for (var i = 0; i < getstoreinf.length; i++) {
                        //  if(getstoreinf[i].login_flag == 0){
                        qr_code_button = '<button type="button" device_id=' + getstoreinf[i].id + ' class="btn handhelddevices btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent" data-toggle="modal" data-target="#exampleModal">QrCode</button>';
                        edit_button_dev = '<a type="button" href="/edithandhelddevice/'+getstoreinf[i].id +'"><button type="button" edit_id=' + getstoreinf[i].id + ' class="btn HandheldEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button></a>&nbsp;';
                        // }else{
                        //   qr_code_button = '';
                        //   edit_button_dev= '';  
                        // }

                        var row_data = {
                            "username": getstoreinf[i].username,
                            "description": getstoreinf[i].description,
                            "status": getstoreinf[i].statuss,
                            "storeid": getstoreinf[i].storename,
                            "uuid": getstoreinf[i].uuid,
                            "qr_code": qr_code_button,
                            'action': edit_button_dev + '<button type="button" del_id=' + getstoreinf[i].id + ' class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button>'

                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '3400-gethandhelddevice');
                    res.end(error);
                });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '3404-gethandhelddevice');
            res.end(error);
        });
        // }
        // else
        // {
        //     res.end("Testing");
        // }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4183-gethandhelddevice');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4190-gethandhelddevice');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//ExecutiveSummaryReport


//ExecutiveSummaryReport
router.post('/ExecutiveSummaryReport', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ExecutiveSummaryReport');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';


        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and unexpected like '%" + req.body.search['value'] + "%'";
        }

        // if(req.body.DeviceID !="" && req.body.DeviceID !=0 && req.body.DeviceID !="0"){
        //     cond +=' AND HD.device_unique_id="'+req.body.DeviceID+'" '
        // }

        // if(req.body.StoreID !="" && req.body.StoreID !=0 && req.body.StoreID !="0"){
        //     cond +=' AND TS.storeid="'+req.body.StoreID+'" '
        // }

        var new_query = "SELECT code,initial,counted,unexpected,missing,expected FROM stock_count WHERE 1" + search_cond + " " + order_by_cond;
        //console.log('ssssssss'+new_query);
        var query_count = " select count(*) as `my_count` from (SELECT code,initial,counted,unexpected,missing,expected FROM stock_count WHERE 1" + search_cond + ") sq ";


        //abdulrehmanijaz
        //if(mysql.check_permission('HandheldDevices',session.user_permission)){   
        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;


                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {

                        var row_data = {
                            "code": getstoreinf[i].code,
                            "initial": getstoreinf[i].initial,
                            "counted": getstoreinf[i].counted,
                            "unexpected": getstoreinf[i].unexpected,
                            "missing": getstoreinf[i].missing,
                            "expected": getstoreinf[i].expected,
                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '3489-ExecutiveSummaryReport');
                    res.end(error);
                })
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '3493-ExecutiveSummaryReport');
            res.end(error);
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4284-ExecutiveSummaryReport');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4291-ExecutiveSummaryReport');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//get sotre info
router.post('/getstoreinfo', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getstoreinfo');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 6 || order_col == 5) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and storename like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND storename="' + req.body.storeid + '" ';
        }
        if (req.body.Company != "" && req.body.Company != 0 && req.body.Company != "0") {
            cond += ' AND store_company="' + req.body.Company + '" ';
        }
        if (req.body.Country != "" && req.body.Country != 0 && req.body.Country != "0") {
            cond += ' AND store_country="' + req.body.Country + '" ';
        }
        // if (req.body.StoreCode != "" && req.body.StoreCode != 0 && req.body.StoreCode != "0") {
        //     cond += ' AND storecode="' + req.body.StoreCode + '" ';
        // }

        if (mysql.check_permission('storeinfo', session.user_permission)) {


            var new_query = ''
            var query_count = ''
            var storeid = session.storeid;
            storeid = storeid.split('[').join('');
            storeid = storeid.split(']').join('');

            if (req.session.user_id == 1) {

                new_query += "SELECT * ," +
                    " CASE WHEN status = 1 THEN 'Active' ELSE 'Disable' END AS statuss FROM tb_store WHERE 1 " + cond + search_cond + " " + order_by_cond;

                query_count += "select count(*) as `my_count` from (SELECT * FROM tb_store WHERE 1 " + cond + search_cond + ") sq ";


            } else {

                new_query += "SELECT *," +
                    " CASE WHEN status = 1 THEN 'Active' ELSE 'Disable' END AS statuss FROM tb_store WHERE storename IN (" + storeid + ") " + cond + search_cond + " " + order_by_cond;

                query_count += " select count(*) as `my_count` from (SELECT * FROM tb_store WHERE storename IN (" + storeid + ") " + cond + search_cond + ") sq ";
            }


            //console.log('==============='+new_query);
            //console.log(new_query);

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;
                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        //console.log(gettop20our)
                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "storeid": getstoreinf[i].storeid,
                                "storename": getstoreinf[i].storename,
                                "store_location": getstoreinf[i].store_location,
                                "lat_lng": getstoreinf[i].lat_lng,
                                "store_country": getstoreinf[i].store_country,
                                "store_company": getstoreinf[i].store_company,
                                "store_type": getstoreinf[i].store_type,
                                "status": getstoreinf[i].statuss,
                                'action': '<button type="button" edit_id=' + getstoreinf[i].storeid + ' class="btn StoreEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button> <button type="button" del_id=' + getstoreinf[i].storeid + ' store_name=' + getstoreinf[i].storename + ' class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button>'

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '3598-getstoreinfo');
                        res.end(error);
                    });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3603-getstoreinfo');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4409-getstoreinfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4416-getstoreinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Get top 20 over
router.post('/gettop20over', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('gettop20over');
    try {
        var session = req.session;
        var limit_cond = ' limit 0,20 ';
        var total_rec = '0';
        var search_cond = '';
        var cond = '';
        var totalrecord = '';

       
        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.search['value'] != "") {
            search_cond = " and PM.brand like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }
        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        }else{
            cond += ' AND SC.storeid="000"'
        }

        //sssssssssssss
        if (mysql.check_permission('stockSummary', session.user_permission)) {

            var Sum_new_query = "SELECT sum(SC.initial) AS sum_expected," +
                "sum(unexpected) AS sum_diff " +
                "FROM " + stock_count_tb + " SC WHERE 1 and SC.departmentid<> 'null' " + cond;

            mysql.queryCustom(Sum_new_query).then(function(sumresult) {

                totalrecord = JSON.stringify(sumresult.results)

                var count_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where  unexpected <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond;

                    var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where  unexpected <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond  +" "+limit_cond;
                //and (initial < counted ) 
                //res.end(new_query);

                mysql.queryCustom(count_query).then(function(result) {
                    var total_rec=result.results.length;
                    mysql.queryCustom(new_query).then(function(result) {
                        gettop20 = result.results;
                        //console.log(gettop20)
                        var table_data = [];
                        if (gettop20.length > 0) {
                            for (var i = 0; i < gettop20.length; i++) {


                                var row_data = {
                                    "aatotalsum": totalrecord,
                                    "departmentname": gettop20[i].departmentname,
                                    "brandname": unescape(gettop20[i].brandname),

                                    "diff": Math.abs(gettop20[i].diff),
                                    "skucode": gettop20[i].skucode,
                                    "expected": gettop20[i].expected,
                                    "diffper": gettop20[i].diffper,
                                    "supplier_item_no": gettop20[i].supplier_item_no,
                                };


                                table_data.push(row_data);
                            }

                        } else {
                            var row_data = {
                                "aatotalsum": totalrecord,
                                "departmentname": " ",
                                "brandname": " ",

                                "diff": " ",
                                "skucode": " ",
                                "expected": " ",
                                "diffper": "0",
                                "supplier_item_no": " ",
                            };


                            table_data.push(row_data);
                        }


                        //res.end(JSON.stringify(result.results));
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '3716-gettop20over');
                        res.end(error);
                    });
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '3716-gettop20over');
                    res.end(error);
                });
            })

        } else {
            res.end("Not allowed");
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4452-gettop20over');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4459-gettop20over');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/gettop20over_all', authenticationMidleware(), (req, res, next) => {
    
    console2.execution_info('gettop20over_all');    
    try {
        var session = req.session;
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';
        var search_cond = '';
        var cond = '';
        var totalrecord = '';
        var show_over="no";
        if (req.body.show_over =="yes" )
        {
            show_over="yes";
        }
        
        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.search['value'] != "") {
            search_cond = " and PM.brand like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }
        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        }else{
            cond += ' AND SC.storeid="000"'
        }

        //sssssssssssss
        if (mysql.check_permission('all_under_over', session.user_permission)) {

            var Sum_new_query = "SELECT sum(SC.initial) AS sum_expected," +
                "sum(unexpected) AS sum_diff " +
                "FROM " + stock_count_tb + " SC WHERE 1 and SC.departmentid<> 'null' " + cond;

            mysql.queryCustom(Sum_new_query).then(function(sumresult) {

                totalrecord = JSON.stringify(sumresult.results)
              

                if(show_over == "yes"){

                    var count_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper , SC.suppliername " +
                    
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where  unexpected <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond;

                    var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper, SC.suppliername " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where  unexpected <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond  +" "+limit_cond;
                }
                else
                {
                    var count_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper , SC.suppliername " +
                    
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where initial<>0 and unexpected <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond;

                    var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " SC.supplier_item_no as supplier_item_no ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper, SC.suppliername " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where  initial<>0  and unexpected <> 0  and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond  +" "+limit_cond;
                }
                //and (initial < counted ) 
                //res.end(new_query);

                mysql.queryCustom(count_query).then(function(result) {
                    var total_rec=result.results.length;
                    mysql.queryCustom(new_query).then(function(result) {
                        gettop20 = result.results;
                        //console.log(gettop20)
                        var table_data = [];
                        if (gettop20.length > 0) {
                            for (var i = 0; i < gettop20.length; i++) {


                                var row_data = {
                                    "aatotalsum": totalrecord,
                                    "departmentname": gettop20[i].departmentname,
                                    "brandname": unescape(gettop20[i].brandname),

                                    "diff": Math.abs(gettop20[i].diff),
                                    "skucode": gettop20[i].skucode,
                                    "expected": gettop20[i].expected,
                                    "diffper": gettop20[i].diffper,
                                    "suppliername":unescape(gettop20[i].suppliername),
                                    "supplier_item_no": gettop20[i].supplier_item_no,
                                };


                                table_data.push(row_data);
                            }

                        } else {
                            var row_data = {
                                "aatotalsum": totalrecord,
                                "departmentname": " ",
                                "brandname": " ",

                                "diff": " ",
                                "skucode": " ",
                                "expected": " ",
                                "diffper": "0",
                                "suppliername":"",
                                "supplier_item_no":"",
                            };


                            table_data.push(row_data);
                        }


                        //res.end(JSON.stringify(result.results));
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '3716-gettop20over');
                        res.end(error);
                    });
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '3716-gettop20over');
                    res.end(error);
                });
            })

        } else {
            res.end("Not allowed");
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4452-gettop20over');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4459-gettop20over');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Get Department
router.post('/getDepartment', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getDepartment');
    try {
        var session = req.session;
        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        var new_query = "SELECT departmentid FROM `" + stock_count_tb + "` WHERE departmentid <> '' " +
            " AND departmentid<>'null'  GROUP by departmentid order by id desc";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3739-getDepartment');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3744-getDepartment');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4601-getDepartment');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4608-getDepartment');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getColors', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getColors');
    try {
        var session = req.session;
        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        var new_query = "SELECT color FROM " + stock_count_tb + " where " +
            " color<>'null' GROUP BY color order by id desc";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3759-getColors');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3764-getColors');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4649-getColors');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4656-getColors');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getColorsForInventory', authenticationMidleware(), (req, res, next) => {
   
    console2.execution_info('getColorsForInventory');
    try {
        var session = req.session;
        var new_query = "SELECT color FROM epc where " +
            " color<>'null' GROUP BY color order by id desc";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3759-getColorsForInventory');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3764-getColorsForInventory');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4649-getColorsForInventory');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4656-getColorsForInventory');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getSize', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getSize');
    try {
        var session = req.session;
        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }
        var new_query = "SELECT size FROM " + stock_count_tb + " where " +
            " size<>'null' GROUP BY size order by id desc";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3779-getSize');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3784-getSize');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4696-getSizes');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4703-getSizes');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getSizeForInventory', authenticationMidleware(), (req, res, next) => {
     
    console2.execution_info('getSizeForInventory');
    try {
        var session = req.session;
        var new_query = "SELECT size FROM epc  where " +
            " size<>'null' GROUP BY size order by id desc";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3779-getSizeForInventory');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3784-getSizeForInventory');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4696-getSizeForInventory');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4703-getSizeForInventory');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getStockCountDate', authenticationMidleware(), (req, res, next) => {
    
    console2.execution_info('getStockCountDate');
    try {
        var session = req.session;
        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        //console.log("select stockcountdate from "+stock_count_tb+"  group by stockcountdate");
        mysql.queryCustom("select stockcountdate from " + stock_count_tb + " where  stockcountdate is not null group by stockcountdate")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3798-getStockCountDate');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3803-getStockCountDate');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4743-getStockCountDate');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4750-getStockCountDate');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//GetStoreInfoGoods
router.post('/GoodsStockStore_retail_item', authenticationMidleware(), (req, res, next) => {
    
    console2.execution_info('GoodsStockStore_retail_item');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT retail_item_batch_id FROM goods_item_store GROUP BY  retail_item_batch_id")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3816-GoodsStockStore_retail_item');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3821-GoodsStockStore_retail_item');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4779-GoodsStockStore_retail_item');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4786-GoodsStockStore_retail_item');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




//GetStoreInfoGoods
router.post('/GoodsWareHoue_retail_item_batch_id', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('GoodsWareHoue_retail_item_batch_id');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT retail_item_batch_id FROM goods_item_warehouse GROUP BY   retail_item_batch_id")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3839-GoodsWareHoue_retail_item_batch_id');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3844-GoodsWareHoue_retail_item_batch_id');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4818-GoodsWareHoue_retail_item_batch_id');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4825-GoodsWareHoue_retail_item_batch_id');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Get Roles
router.post('/GetRoles', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetRoles');
    try {
        var session = req.session;
        mysql.querySelect("tb_roles", " order by role_id DESC", "*")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3858-GetRoles');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3863-GetRoles');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4853-GetRoles');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4860-GetRoles');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Get getZPL
router.post('/getZPL', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getZPL');
    try {
        var session = req.session;
        var store_id = req.body.store_id;
        var query = "SELECT id,zpl,name FROM zpl where storeid like '%" + store_id + "%'"
       
        mysql.queryCustom(query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3879-getZPL');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3884-getZPL');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4890-getZPL');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4897-getZPL');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Get getZPL
router.post('/getZPL_new', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getZPL_new');
    try {
        var session = req.session;
        var store_id = req.body.store_id;
        var user_id = session.user_id;
       
        if(user_id>0)
        {
            var query = "SELECT id,zpl,name FROM zpl where storeid like '%" + store_id + "%' "
        }
        else
        {
            var query = "SELECT id,zpl,name FROM zpl where storeid like '%" + store_id + "%' and restrict_user NOT like '%" + user_id + "%'"
        }
        
        mysql.queryCustom(query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3879-getZPL');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3884-getZPL');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4890-getZPL');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4897-getZPL');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});





//getPrinter
router.post('/getPrinterInfo', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('getPrinterInfo');
    try {
        var session = req.session;
        var store_id = req.body.store_id;


        var query = "SELECT id,name FROM printer  where storeid like '%" + store_id + "%'  order by id desc"

        mysql.queryCustom(query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3907-getPrinterInfo');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3912-getPrinterInfo');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4933-getPrinterInfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4940-getPrinterInfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getPrinter
router.post('/getPrinterInfo_new', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('getPrinterInfo_new');
    try {
        var session = req.session;
        var store_id = req.body.store_id;


        var query = "SELECT id,name FROM printer  where storeid like '%" + store_id + "%'  order by id desc"

        mysql.queryCustom(query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '3907-getPrinterInfo');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '3912-getPrinterInfo');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4933-getPrinterInfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '4940-getPrinterInfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




router.post('/ConfirmApiRequestPrinter', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ConfirmApiRequestPrinter');
    try {
        var session = req.session;

        var epc = req.body.epc;
        var zpl = req.body.zpl;

        //console.log(zpl);

        var storeid = req.body.store_id;
        var location = storeid.split('000').join('');
        var my_printer = req.body.my_printer;

        var uid = req.body.uid;
        var sku = req.body.sku;
        var original_sku = req.body.sku_without_zero;

        var supplier_name = req.body.supplier_name;
        var product_name = req.body.ProductName;

        var retail_product_price = req.body.retail_product_price;
        var retail_product_vat = req.body.retail_product_vat;
        var Retail_Product_Color = req.body.Retail_Product_Color;
        var Retail_Product_Size = req.body.Retail_Product_Size;
        var Retail_Product_Season = req.body.Retail_Product_Season;
        var Retail_Product_Gender = req.body.Retail_Product_Gender;
        var Retail_Product_SupplierItemNum = req.body.Retail_Product_SupplierItemNum;


        var retail_product_sp_vat_en = req.body.retail_product_sp_vat_en;





        var PO_NO = req.body.PO_NO;
        var Supplier_ID = req.body.Supplier_ID;
        var Shipment_no = req.body.Shipment_no;
        var Comments = req.body.Comments;

        var department = req.body.Department;
        var brand = req.body.Brand;
        var style = req.body.style;

        // console.log('store_id>>>>>>>>>>>>>.'+storeid);
        // console.log('location>>>>>>>>>>>>>.'+location);
        // console.log('my_printer>>>>>>>>>>>>>.'+my_printer);
        // console.log('uid>>>>>>>>>>>>>.'+uid);
        // console.log('sku>>>>>>>>>>>>>.'+sku);
        // console.log('supplier_name>>>>>>>>>>>>>.'+supplier_name);

        // console.log('supplier_name>>>>>>>>>>>>>.'+zpl);



        // console.log('original_sku>>>>>>>>>>>>>.'+original_sku);
        // console.log('retail_product_price>>>>>>>>>>>>>.'+retail_product_price);
        // console.log('retail_product_vat>>>>>>>>>>>>>.'+retail_product_vat);
        // console.log('retail_product_sp_vat_en>>>>>>>>>>>>>.'+retail_product_sp_vat_en);
        // console.log('Retail_Product_Color>>>>>>>>>>>>>.'+Retail_Product_Color);
        // console.log('Retail_Product_Size>>>>>>>>>>>>>.'+Retail_Product_Size);
        // console.log('Retail_Product_Season>>>>>>>>>>>>>.'+Retail_Product_Season);
        // console.log('Retail_Product_Gender>>>>>>>>>>>>>.'+Retail_Product_Gender);
        // console.log('Retail_Product_SupplierItemNum>>>>>>>>>>>>>.'+Retail_Product_SupplierItemNum);

        
        var iot_ip = process.env.IOT_PLATFORM_IP;
        var ip = iot_ip.split("'").join('');


       // console.log('http://'+ip+'/innovent/TAGIT')
        // const options = {
        //     url: 'http://'+ip+'/innovent/TAGIT',
        //     method: 'PATCH',
        //     headers: {
        //         'content-type': 'application/json',
        //         'apikey': process.env.IOT_API_KEY,
        //     },
        //     body: '[{"group":">RUBAIYAT",' +
        //         '"thingTypeCode":"ITEM",' +
        //         '"serialNumber":"' + epc + '",' +
        //         '"udfs":{"deviceId":{"value":"C2A0622C-CB02-41E9-9465-9946B282B38F"},' +
        //         '"Retail_Bizlocation":{"value":"' + storeid + '"},'+
        //         '"sourceModule":{"value":"Printing"},' +
        //         '"Retail_Printer":{"value":"PrinterID"},'+
        //          '"Retail_Product_Color":{"value":"' + Retail_Product_Color + '"},' +
        //         '"Retail_Product_Gender":{"value":"' + Retail_Product_Gender + '"},' +
        //         '"Retail_Product_Level1Name":{"value":"' + department + '"},' +
        //         '"Retail_Product_Level2Name":{"value":"' + brand + '"},' +
        //         '"Retail_Product_Name":{"value":"' + product_name + '"},' +
        //         '"Retail_Product_Name_Text":{"value":"' + product_name + '"},' +
        //         '"Retail_Product_Price":{"value":"' + retail_product_price + '"},' +
        //         '"Retail_Product_Season":{"value":"' + Retail_Product_Season + '"},' +
        //         '"Retail_Product_Size":{"value":"' + Retail_Product_Size + '"},' +
        //         '"Retail_Product_SKU":{"value":"' + sku + '"},' +
        //         '"Retail_Product_SKUOriginal":{"value":"' + original_sku + '"},' +
        //         '"Retail_Product_SP_VAT_AR":{"value":"' + retail_product_sp_vat_en + '"},' +
        //         '"Retail_Product_SP_VAT_EN":{"value":"' + retail_product_sp_vat_en + '"},' +
        //         '"Retail_Product_Style":{"value":"' + style + '"},' +
        //         '"Retail_Product_SupplierName":{"value":"' + supplier_name + '"},' +
        //         '"Retail_Product_UniqueID":{"value":"' + uid + '"},' +
        //         '"Retail_Product_UPC":{"value":"' + sku + '"},' +
        //         '"Retail_Product_VAT":{"value":"' + retail_product_vat + '"},' +
        //         '"Retail_ZPL":{"value":"RUBAzpl_EN"},' +

        //         '"Retail_TagIT_Info_1":{"value":"' + PO_NO + '"},' +
        //         '"Retail_TagIT_Info_2":{"value":"' + Supplier_ID + '"},' +
        //         '"Retail_TagIT_Info_3":{"value":"' + Shipment_no + '"},' +
        //         '"Retail_TagIT_Info_4":{"value":"' + Comments + '"},' +

        //         '"user":{"value":"store' + location + '"},'+
        //         '"zone":{"value":"' + storeid + '.00101.1"}}}]'
        // };
       
       const options = {
            url: 'http://'+ip+'/innovent/TAGIT',
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'apikey': process.env.IOT_API_KEY,
            },
            body: '[{'+
                   '"group": ">RUBAIYAT",'+
                   '"thingTypeCode": "ITEM",'+
                   '"serialNumber": "' + epc + '",'+
                   '"udfs": {'+
                        '"deviceId": {"value": "C2A0622C-CB02-41E9-9465-9946B282B38F"},'+
                        '"Retail_Bizlocation": {"value": "' + storeid + '"},'+
                        '"sourceModule": {"value": "Printing"},'+
                        '"Retail_Printer": {"value": "PrinterID"},'+
                        '"Retail_Product_SKU": {"value": "'+sku+'"},'+
                        '"Retail_Product_SKUOriginal": {"value": "'+original_sku+'"},'+
                        '"Retail_Product_UniqueID": {"value": "'+uid+'"},'+
                        '"Retail_Product_UPC": {"value": "'+sku+'"},'+
                        '"Retail_ZPL": {"value": "RUBAzpl_EN"},'+
                        '"source": {"value": "PRINTING_APP"},'+
                        '"user": {"value": "store' + location + '"},'+
                        '"zone": {"value": "' + storeid + '.00101.1"},'+
                      
                        '"Retail_TagIT_Info_1":{"value":"' + PO_NO + '"},' +
                        '"Retail_TagIT_Info_2":{"value":"' + Supplier_ID + '"},' +
                        '"Retail_TagIT_Info_3":{"value":"' + Shipment_no + '"},' +
                        '"Retail_TagIT_Info_4":{"value":"' + Comments + '"}' +
                    '}'+
                '}]'
        };
    // console.log(options);
        



        request(options, function(err, res, body) {
            let wjson = body;
            // console.log(wjson);



            var update_query = "UPDATE `zpl_printer` SET " +
                " `suppliername`= '" + supplier_name + "', " +
                " `storeid`='" + storeid + "', " +
                " `zplid`='"+zpl+"' ,`status`='print'," +
                " `Retail_Product_Price`= '" + retail_product_price + "'," +
                " `Retail_Product_VAT`= '" + retail_product_vat + "'," +
                " `Retail_Product_SP_VAT_EN`='" + retail_product_sp_vat_en + "'," +
                " `Retail_Product_Color`='" + Retail_Product_Color + "'," +
                " `Retail_Product_Size`='" + Retail_Product_Size + "'," +
                " `Retail_Product_Season`='" + Retail_Product_Season + "'," +
                " `Retail_Product_Gender`= '" + Retail_Product_Gender + "'," +

                " `PO_NO`= '" + PO_NO + "'," +
                " `Supplier_ID`= '" + Supplier_ID + "'," +
                " `Shipment_no`= '" + Shipment_no + "'," +
                " `Comments`= '" + Comments + "'," +
                " `sku`= '" + sku + "'," +
                " `Product_Name`= '" + product_name + "'," +



                " `Retail_Product_SupplierItemNum`= '" + Retail_Product_SupplierItemNum + "' " +
                " WHERE epc = '" + epc + "'"
            //console.log('1111>>>>>>>>>>>>>'+update_query);

            // var update_query = "UPDATE zpl_printer SET status= 'print',zplid = '"+zpl+"' " +
            // "WHERE epc = '" + epc + "'";

            mysql.queryCustom(update_query).then(function(result) {


                    if (result.status == "1") {
                        // res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4064-ConfirmApiRequestPrinter');
                        res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4069-ConfirmApiRequestPrinter');
                    res.end(error);
                });

        });

        res.end("ok");
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5120-ConfirmApiRequestPrinter');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5127-ConfirmApiRequestPrinter');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});

router.post('/ConfirmApiRequestPrinter_new', authenticationMidleware(), (req, res, next) => {
   
    console2.execution_info('ConfirmApiRequestPrinter_new');
    try {
        var session = req.session;

        var epc = req.body.epc;
        var zpl = req.body.zpl;

        //console.log(zpl);

        var storeid = req.body.store_id;
        var location = storeid.split('000').join('');
        var my_printer = req.body.my_printer;

        var uid = req.body.uid;
        var sku = req.body.sku;
        var original_sku = req.body.sku_without_zero;

        var supplier_name = req.body.supplier_name;
        var product_name = req.body.ProductName;

        var retail_product_price = req.body.retail_product_price;
        var retail_product_vat = req.body.retail_product_vat;
        var Retail_Product_Color = req.body.Retail_Product_Color;
        var Retail_Product_Size = req.body.Retail_Product_Size;
        var Retail_Product_Season = req.body.Retail_Product_Season;
        var Retail_Product_Gender = req.body.Retail_Product_Gender;
        var Retail_Product_SupplierItemNum = req.body.Retail_Product_SupplierItemNum;


        var retail_product_sp_vat_en = req.body.retail_product_sp_vat_en;





        var PO_NO = req.body.PO_NO;
        var Supplier_ID = req.body.Supplier_ID;
        var Shipment_no = req.body.Shipment_no;
        var Comments = req.body.Comments;

        var department = req.body.Department;
        var brand = req.body.Brand;
        var style = req.body.style;



        var update_query = "UPDATE `zpl_printer` SET " +
            " `suppliername`= '" + supplier_name + "', " +
            " `storeid`='" + storeid + "', " +
            " `zplid`='"+zpl+"' ,`status`='print' " +
         
            " WHERE epc = '" + epc + "'";
        
        //console.log(update_query);
        mysql.queryCustom(update_query).then(function(result) {


            if (result.status == "1") {
                // res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4064-ConfirmApiRequestPrinter');
                res.end(result.error);
            }
        })
        .catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4069-ConfirmApiRequestPrinter');
            res.end(error);
        });

        

        res.end("ok");
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5120-ConfirmApiRequestPrinter');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5127-ConfirmApiRequestPrinter');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

});



/*


UPDATE
    new_product_item_master PM_new,
    product_item_master PM
SET
    PM.ean_no = PM_new.ean_no,
    PM.sp_net = PM_new.sp_net,
    PM.season = PM_new.season,
    PM.vat = PM_new.vat,
    PM.sales_area = PM_new.sales_area,
    PM.sp_gross_eng = PM_new.sp_gross_eng,
    PM.sp_gross_arb = PM_new.sp_gross_arb,
    PM.supplier_item_no = PM_new.supplier_item_no,
    PM.supplier_name = PM_new.supplier_name
WHERE
    PM.skucode = PM_new.item_ref;


*/

//getPrinter
router.post('/AddPrinterForm', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddPrinterForm');
    try {
        var session = req.session;
        var now = new Date();
        var qty = req.body.qty
        var UID = req.body.UID
        var epc = req.body.epc
        var storeid = req.body.StoreID
        var printer = req.body.Printer
        var zpl = req.body.ZPL;
        var SKU = req.body.SKU;



        const bigInt = require('big-integer');

        function BitsHelper(val, len, valbase = 16) {
            this.val = val;
            this.bitlength = len;

            this.bits = bigInt(val, valbase).toString(2);
            this.bits = Array(len - this.bits.length + 1).join('0') + this.bits;
        }

        function getCheckDigit(key) {
            const paddedKey = key.padStart(18, '0')
            const numbers = paddedKey.split('').map(n => parseInt(n))
            const sum = numbers.reduce((acc, n, i) => {
                acc += i % 2 ? n * 3 : n;
                return acc
            }, 0)
            const next = Math.ceil(sum / 10) * 10;
            return next - sum;
        }

        const header = '00110000';

        const partition = {
            bits: {
                company: [40, 37, 34, 30, 27, 24, 20],
                reference: [4, 7, 10, 14, 17, 20, 24]
            },
            digits: {
                company: [12, 11, 10, 9, 8, 7, 6],
                reference: [1, 2, 3, 4, 5, 6, 7]
            }
        };


        function parse(epc) {
            const parts = {
                Header: undefined,
                Filter: undefined,
                Partition: undefined,
                CompanyPrefix: undefined,
                ItemReference: undefined,
                SerialNumber: undefined,
                SerialReference: undefined,
                LocationReference: undefined,
                Extension: undefined,
                AssetType: undefined,
                IndividualAssetReference: undefined,
                ServiceReference: undefined,
                DocumentType: undefined,
                ManagerNumber: undefined,
                ObjectClass: undefined,
                CAGEOrDODAAC: undefined,
                CheckDigit: undefined,
                Sku: undefined
            };

            // initialize the bit helper
            const bh = new BitsHelper(epc, 96);

            // make sure the incoming value is really SGTIN by checking the header
            if (bh.bits.slice(0, 8) !== header)
                throw new Error(epc + ' is not a valid SGTIN.');

            // ok, looks good.  parse the stuff we'll need to figure out the rest
            parts.Header = bh.bits.slice(0, 8);
            parts.Filter = parseInt(bh.bits.slice(8, 11), 2);
            parts.Partition = parseInt(bh.bits.slice(11, 14), 2);
            // find the end of the company portion by calculating the number of bits
            // and adding it to the starting offset
            const companyPrefixEnd = 14 + partition.bits.company[parts.Partition];

            // get the company value from the bits, convert to a string
            let company = parseInt(bh.bits.slice(14, companyPrefixEnd), 2).toString();
            // pad the string with leading zeros to make-up the length according to the calculate length
            company = Array(partition.digits.company[parts.Partition] - company.length + 1).join('0') + company;

            parts.CompanyPrefix = company;

            let item = parseInt(bh.bits.slice(companyPrefixEnd, companyPrefixEnd + partition.bits.reference[parts.Partition]), 2).toString();
            item = Array(partition.digits.reference[parts.Partition] - item.length + 1).join('0') + item;

            parts.ItemReference = item;
            parts.SerialNumber = parseInt(bh.bits.slice(58), 2);
            const gs1Key = `${parts.ItemReference.substr(0, 1)}${parts.CompanyPrefix}${parts.ItemReference.substr(1)}`
            parts.CheckDigit = getCheckDigit(gs1Key);
            parts.Sku = `${gs1Key}${parts.CheckDigit}`;
            return parts
        }

        function encode(sku, serial, companyLength = 7, filter = 1) {
            let epc = '';
            epc += header;

            const filterBinary = parseInt(filter, 10).toString(2);
            epc += Array(3 - filterBinary.length + 1).join('0') + filterBinary

            const currentPartition = partition.digits.company.indexOf(companyLength);
            const currentPartitionBinary = currentPartition.toString(2);
            epc += Array(3 - currentPartitionBinary.length + 1).join('0') + currentPartitionBinary

            const companyPrefix = sku.substr(1, companyLength)
            const companyPrefixBinary = parseInt(companyPrefix, 10).toString(2);
            epc += Array(24 - companyPrefixBinary.length + 1).join('0') + companyPrefixBinary

            const itemReference = sku.substr(0, 1) + sku.substr(companyLength + 1, sku.length - companyLength - 2)
            const itemReferenceBinary = parseInt(itemReference, 10).toString(2);
            epc += Array(20 - itemReferenceBinary.length + 1).join('0') + itemReferenceBinary

            const serialBinary = parseInt(serial, 10).toString(2);
            epc += Array(38 - serialBinary.length + 1).join('0') + serialBinary

            return bigInt(epc, 2).toString(16).toUpperCase();
        }

        var select = "SELECT reference_value FROM reference_table"
        mysql.queryCustom(select).then(function(result) {
            if (result.status == "1") {

                var update_unique = "";
                var epc = '';
                var load_id = result.results[0].reference_value;
                var reference_value = result.results[0].reference_value;
                var tobe_dump = '';

                var tobe_dump = "INSERT INTO `zpl_printer` (`uid`, `epc`,`suppliername`,`qty`, `storeid`," +
                    " `printerid`, `zplid`, `status`,`Retail_Product_Price`,`Retail_Product_VAT` " +
                    " ,`Retail_Product_SP_VAT_EN`,`Retail_Product_Color`," +
                    "`Retail_Product_Size`,`Retail_Product_Season`" +
                    ",`Retail_Product_Gender`,`Retail_Product_SupplierItemNum`,`load_id`,`date_time`,`user_id`)" +
                    " VALUES "

                var date_time = dateFormat(now, "yyyy-mm-dd");
                var user_id = session.user_id;

                for (var i = 0; i < qty; i++) {
                    //console.log(qty);
                    reference_value = reference_value + 1;

                    epc = (encode(SKU, reference_value));
                    //console.log(epc);


                    tobe_dump += "('" + req.body.UID + "','" + epc + "','" + req.body.SupplierName + "','" + qty + "' ," +
                        "'" + req.body.StoreID + "','" + req.body.Printer + "','" + req.body.ZPL + "','Pending'," +
                        "'" + req.body.Retail_Product_Price + "'," +
                        "'" + req.body.Retail_Product_VAT + "'," +
                        "'" + req.body.Retail_Product_SP_VAT_EN + "'," +
                        "'" + req.body.Retail_Product_Color + "','" + req.body.Retail_Product_Size + "'," +
                        "'" + req.body.Retail_Product_Season + "'," +
                        "'" + req.body.Retail_Product_Gender + "'," +
                        "'" + req.body.Retail_Product_SupplierItemNum + "','" + load_id + "','" + date_time + "','" + user_id + "'),";
                    //printer code here//

                }
                var update_unique = "CALL get_reference_value('"+qty+"');"
                //update_unique = "UPDATE `reference_table` SET `reference_value` = reference_value+" + qty

                mysql.queryCustom(update_unique).then(function(result) {
                    if (result.status == "1") {
                        // res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4280-AddPrinterForm refrence table');
                        //res.end((result.error);
                        //res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4286-AddPrinterForm refrence table');
                    //res.end((result.error);
                    //res.end(error);
                });


                const insertText = tobe_dump.slice(',', -1);

                //console.log("+++++++++++++++++++"+insertText);
                mysql.queryCustom(insertText).then(function(result) {
                        if (result.status == "1") {

                            //Check_EPC_ZPL(epc);   
                            var select_query = "SELECT  * FROM `zpl_printer` " +
                                " WHERE 1 and uid='" + req.body.UID + "' and status <>'print' and load_id = '" + load_id + "' "
                            // console.log(select_query);

                            mysql.queryCustom(select_query).then(function(result) {
                                    if (result.status == "1") {

                                        var total_id = result.results;


                                        var printerDump = '';

                                        for (var i = 0; i < total_id.length; i++) {

                                            printerDump += total_id[i].epc + ','
                                        }



                                        res.end(JSON.stringify(printerDump));
                                    } else {
                                        //res.end(result.error);
                                    }
                                })
                                .catch(function(error) {
                                    console2.log('Error', JSON.stringify(error), '4324-AddPrinterForm first catch');
                                    //res.end(error);
                                });

                            //res.end(JSON.stringify(result.results));
                        } else {
                            //res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '4332-AddPrinterForm 2nd catch');
                        //res.end(error);
                    });

            } else {
                // res.end(result.error);
            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4339-AddPrinterForm 3rd catch');
            res.end(error);
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5409-AddPrinterForm');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5416-AddPrinterForm');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


function check_epc_exist_zpl(epc) {
    try {
        var epc_code = epc;
        return new Promise((resolve) => {

            

            mysql.queryCustom("SELECT * FROM zpl_printer WHERE epc='"+epc_code+ "'").then(function(result) {

               
                if (result.results.length !== 0) 
                {
                    let sendparam = {
                        exist: "1",
                    }
                    resolve(sendparam);
                }
                else
                {
                    let sendparam = {
                        exist: "0",
                    }
                    resolve(sendparam); 
                }
            })

        })
    }catch(e){
       
        console2.log('Error', 'Catch Expection'+e, '8514-check_epc_exist_zpl');
        if(e instanceof TypeError){
            console2.log('Error', 'Catch Expection'+e, '8514-check_epc_exist_zpl');
        }else{
            console2.log('Error', 'Catch Expection'+e, '8514-check_epc_exist_zpl');
        }
    }


}

router.post('/AddPrinterForm_new', authenticationMidleware(), async (req, res, next) => {
       
    console2.execution_info('AddPrinterForm_new_new');
    try {
        var session = req.session;
        

        var now = new Date();
        var qty = req.body.qty
        var UID = req.body.UID
        var epc = req.body.epc
        var storeid = req.body.StoreID; //var storeid = req.body.store_id;
        var printer = req.body.Printer;//var my_printer = req.body.my_printer;
        var zpl = req.body.ZPL; // new to check var zpl = req.body.zpl;
        var SKU = req.body.SKU; //var sku = req.body.sku;


        var location = storeid.split('000').join('');
        var uid = req.body.uid;
        var original_sku = req.body.SKU_without_zero;
        var supplier_name = req.body.supplier_name;
        var product_name = req.body.ProductName;
        var retail_product_price = req.body.retail_product_price;
        var retail_product_vat = req.body.retail_product_vat;
        var Retail_Product_Color = req.body.Retail_Product_Color;
        var Retail_Product_Size = req.body.Retail_Product_Size;
        var Retail_Product_Season = req.body.Retail_Product_Season;
        var Retail_Product_Gender = req.body.Retail_Product_Gender;
        var Retail_Product_SupplierItemNum = req.body.Retail_Product_SupplierItemNum;
        var retail_product_sp_vat_en = req.body.retail_product_sp_vat_en;
        var PO_NO = req.body.PO_NO;
        var Supplier_ID = req.body.Supplier_ID;
        var Shipment_no = req.body.Shipment_no;
        var Comments = req.body.Comments;
        var department = req.body.Department;
        var brand = req.body.Brand;
        var style = req.body.style;



        const bigInt = require('big-integer');

        function BitsHelper(val, len, valbase = 16) {
            this.val = val;
            this.bitlength = len;

            this.bits = bigInt(val, valbase).toString(2);
            this.bits = Array(len - this.bits.length + 1).join('0') + this.bits;
        }

        function getCheckDigit(key) {
            const paddedKey = key.padStart(18, '0')
            const numbers = paddedKey.split('').map(n => parseInt(n))
            const sum = numbers.reduce((acc, n, i) => {
                acc += i % 2 ? n * 3 : n;
                return acc
            }, 0)
            const next = Math.ceil(sum / 10) * 10;
            return next - sum;
        }

        const header = '00110000';

        const partition = {
            bits: {
                company: [40, 37, 34, 30, 27, 24, 20],
                reference: [4, 7, 10, 14, 17, 20, 24]
            },
            digits: {
                company: [12, 11, 10, 9, 8, 7, 6],
                reference: [1, 2, 3, 4, 5, 6, 7]
            }
        };


        function parse(epc) {
            const parts = {
                Header: undefined,
                Filter: undefined,
                Partition: undefined,
                CompanyPrefix: undefined,
                ItemReference: undefined,
                SerialNumber: undefined,
                SerialReference: undefined,
                LocationReference: undefined,
                Extension: undefined,
                AssetType: undefined,
                IndividualAssetReference: undefined,
                ServiceReference: undefined,
                DocumentType: undefined,
                ManagerNumber: undefined,
                ObjectClass: undefined,
                CAGEOrDODAAC: undefined,
                CheckDigit: undefined,
                Sku: undefined
            };

            // initialize the bit helper
            const bh = new BitsHelper(epc, 96);

            // make sure the incoming value is really SGTIN by checking the header
            if (bh.bits.slice(0, 8) !== header)
                throw new Error(epc + ' is not a valid SGTIN.');

            // ok, looks good.  parse the stuff we'll need to figure out the rest
            parts.Header = bh.bits.slice(0, 8);
            parts.Filter = parseInt(bh.bits.slice(8, 11), 2);
            parts.Partition = parseInt(bh.bits.slice(11, 14), 2);
            // find the end of the company portion by calculating the number of bits
            // and adding it to the starting offset
            const companyPrefixEnd = 14 + partition.bits.company[parts.Partition];

            // get the company value from the bits, convert to a string
            let company = parseInt(bh.bits.slice(14, companyPrefixEnd), 2).toString();
            // pad the string with leading zeros to make-up the length according to the calculate length
            company = Array(partition.digits.company[parts.Partition] - company.length + 1).join('0') + company;

            parts.CompanyPrefix = company;

            let item = parseInt(bh.bits.slice(companyPrefixEnd, companyPrefixEnd + partition.bits.reference[parts.Partition]), 2).toString();
            item = Array(partition.digits.reference[parts.Partition] - item.length + 1).join('0') + item;

            parts.ItemReference = item;
            parts.SerialNumber = parseInt(bh.bits.slice(58), 2);
            const gs1Key = `${parts.ItemReference.substr(0, 1)}${parts.CompanyPrefix}${parts.ItemReference.substr(1)}`
            parts.CheckDigit = getCheckDigit(gs1Key);
            parts.Sku = `${gs1Key}${parts.CheckDigit}`;
            return parts
        }

        function encode(sku, serial, companyLength = 7, filter = 1) {
            let epc = '';
            epc += header;

            const filterBinary = parseInt(filter, 10).toString(2);
            epc += Array(3 - filterBinary.length + 1).join('0') + filterBinary

            const currentPartition = partition.digits.company.indexOf(companyLength);
            const currentPartitionBinary = currentPartition.toString(2);
            epc += Array(3 - currentPartitionBinary.length + 1).join('0') + currentPartitionBinary

            const companyPrefix = sku.substr(1, companyLength)
            const companyPrefixBinary = parseInt(companyPrefix, 10).toString(2);
            epc += Array(24 - companyPrefixBinary.length + 1).join('0') + companyPrefixBinary

            const itemReference = sku.substr(0, 1) + sku.substr(companyLength + 1, sku.length - companyLength - 2)
            const itemReferenceBinary = parseInt(itemReference, 10).toString(2);
            epc += Array(20 - itemReferenceBinary.length + 1).join('0') + itemReferenceBinary

            const serialBinary = parseInt(serial, 10).toString(2);
            epc += Array(38 - serialBinary.length + 1).join('0') + serialBinary

            return bigInt(epc, 2).toString(16).toUpperCase();
        }

        var select = "SELECT reference_value FROM reference_table"
        mysql.queryCustom(select).then(async function(result) {
            if (result.status == "1") {

                var update_unique = "";
                var epc = '';
                var load_id = result.results[0].reference_value;
                var reference_value = result.results[0].reference_value;
                var tobe_dump = '';

                var tobe_dump = "INSERT INTO `zpl_printer` (`uid`, `epc`,`suppliername`,`qty`, `storeid`," +
                    " `printerid`, `zplid`, `status`,`Retail_Product_Price`,`Retail_Product_VAT` " +
                    " ,`Retail_Product_SP_VAT_EN`,`Retail_Product_Color`," +
                    "`Retail_Product_Size`,`Retail_Product_Season`" +
                    ",`Retail_Product_Gender`,`Retail_Product_SupplierItemNum`,`load_id`,`date_time`,`user_id`"+

                    " ,sku,PO_NO,Supplier_ID,Shipment_no,Comments)" +" VALUES "

                var date_time = dateFormat(now, "yyyy-mm-dd");
                var user_id = session.user_id;

                for (var i = 0; i < qty; i++) {
                    //console.log(qty);
                    reference_value = reference_value + 1;

                    epc = (encode(SKU, reference_value));
                    //console.log(epc);
                    //zeeshan
                    var epc_status = await check_epc_exist_zpl(epc);


                    if(epc_status.exist=="0")
                    {
                        tobe_dump += "('" + req.body.UID + "','" + epc + "','" + req.body.SupplierName + "','" + qty + "' ," +
                            "'" + req.body.StoreID + "','" + req.body.Printer + "','" + req.body.ZPL + "','Pending'," +
                            "'" + req.body.Retail_Product_Price + "'," +
                            "'" + req.body.Retail_Product_VAT + "'," +
                            "'" + req.body.Retail_Product_SP_VAT_EN + "'," +
                            "'" + req.body.Retail_Product_Color + "','" + req.body.Retail_Product_Size + "'," +
                            "'" + req.body.Retail_Product_Season + "'," +
                            "'" + req.body.Retail_Product_Gender + "'," +
                            "'" + req.body.Retail_Product_SupplierItemNum + "','" + load_id + "','" + date_time + 
                            "','" + user_id + "','" + SKU + "','" +  PO_NO+ "','" + Supplier_ID+ "','" + Shipment_no + "','" + Comments + "'),";
                    }

                }
               // console.log(tobe_dump);

                update_unique = "UPDATE `reference_table` SET `reference_value` = reference_value+" + qty

                mysql.queryCustom(update_unique).then(function(result) {
                    if (result.status == "1") {
                        // res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4280-AddPrinterForm_new refrence table');
                        //res.end((result.error);
                        //res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4286-AddPrinterForm_new refrence table');
                    //res.end((result.error);
                    //res.end(error);
                });


                const insertText = tobe_dump.slice(',', -1);

                //console.log("+++++++++++++++++++"+insertText);
                mysql.queryCustom(insertText).then(function(result) {
                        if (result.status == "1") {

                            //Check_EPC_ZPL(epc);   
                            var select_query = "SELECT  * FROM `zpl_printer` " +
                                " WHERE 1 and uid='" + req.body.UID + "' and status <>'print' and load_id = '" + load_id + "' "
                            // console.log(select_query);

                            mysql.queryCustom(select_query).then(function(result) {
                                    if (result.status == "1") {

                                        var total_id = result.results;


                                        var printerDump = '';
                                        var print_body='';

                                        for (var i = 0; i < total_id.length; i++) {

                                            printerDump += total_id[i].epc + ',';
                                            print_body += '{'+
                                           '"group": ">RUBAIYAT",'+
                                           '"thingTypeCode": "ITEM",'+
                                           '"serialNumber": "' + total_id[i].epc + '",'+
                                           '"udfs": {'+
                                                '"deviceId": {"value": "C2A0622C-CB02-41E9-9465-9946B282B38F"},'+
                                                '"Retail_Bizlocation": {"value": "' + storeid + '"},'+
                                                '"sourceModule": {"value": "Printing"},'+
                                                '"Retail_Printer": {"value": "PrinterID"},'+
                                                '"Retail_Product_SKU": {"value": "'+SKU+'"},'+
                                                '"Retail_Product_SKUOriginal": {"value": "'+original_sku+'"},'+
                                                '"Retail_Product_UniqueID": {"value": "'+UID+'"},'+
                                                '"Retail_Product_UPC": {"value": "'+SKU+'"},'+
                                                '"Retail_ZPL": {"value": "RUBAzpl_EN"},'+
                                                '"source": {"value": "PRINTING_APP"},'+
                                                '"user": {"value": "store' + location + '"},'+
                                                '"zone": {"value": "' + storeid + '.00101.1"},'+
                                              
                                                '"Retail_TagIT_Info_1":{"value":"' + PO_NO + '"},' +
                                                '"Retail_TagIT_Info_2":{"value":"' + Supplier_ID + '"},' +
                                                '"Retail_TagIT_Info_3":{"value":"' + Shipment_no + '"},' +
                                                '"Retail_TagIT_Info_4":{"value":"' + Comments + '"}' +
                                            '}'+
                                        '},';

                                        }
                                        print_body=print_body.substring(0, print_body.length - 1);
                                        var iot_ip = process.env.IOT_API_NEW;
                                        
                                        //
                                        //console.log(print_body);
                                        const options = {
                                            url: iot_ip+'innovent/TAGIT',
                                            method: 'PATCH',
                                            headers: {
                                                'content-type': 'application/json',
                                                'apikey': process.env.IOT_API_KEY,
                                            },
                                            body: '['+print_body+']'
                                        };
                                        // var body22 = '['+print_body+']';
                                        // console.log(body22)
                                        request(options, function(err, res, body) {
                                            let wjson = body;
                                            var status = res.statusCode;
                                            
                                            

                                            if(parseInt(status)!==200){

                                                const message = {
                                                    from: 'saqib@innodaba.com', // Sender address
                                                    to: 'zeeshangill11@gmail.com', // List of recipients
                                                    subject: 'Zpl Print Epc', // Subject line
                                                    text: "This " +printerDump+" Epc not printed Successfully !" // Plain text body
                                                };
                                                transport.sendMail(message, function(err, info) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        console.log(info);
                                                    }
                                                });
                                                

                                            }
                                        });
                                        



                                        res.end(JSON.stringify(printerDump));
                                    } else {
                                        //res.end(result.error);
                                    }
                                })
                                .catch(function(error) {
                                    console2.log('Error', JSON.stringify(error), '4324-AddPrinterForm_new first catch');
                                    //res.end(error);
                                });

                            //res.end(JSON.stringify(result.results));
                        } else {
                            //res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '4332-AddPrinterForm_new 2nd catch');
                        //res.end(error);
                    });

            } else {
                // res.end(result.error);
            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4339-AddPrinterForm_new 3rd catch');
            res.end(error);
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5409-AddPrinterForm_new');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5416-AddPrinterForm_new');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getStoreName', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStoreName');
    try {
        var session = req.session;
        var storeid = session.storeid='0000405';

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query = '';

        if (session.user_id == 1) {
            query = "SELECT * FROM tb_store WHERE 1 and storename<>'null' GROUP BY storename ORDER BY storeid DESC"
        } else {
            query = "SELECT * FROM tb_store WHERE storename<>'null' and storename IN (" + storeid + ") GROUP BY storename ORDER BY storeid DESC"
        }
        //console.log(query);

        mysql.queryCustom(query).then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4372-getStoreName');
                res.end(result.error);

            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4375-getStoreName');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5460-getStoreName');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5467-getStoreName');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getUserData', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getUserData');
    try {
        var session = req.session;
        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var new_query = "SELECT * FROM users order by id desc";

        mysql.queryCustom(new_query)
        .then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4556-GetUserinformationdrop filter');
                res.end(result.error);
            }
        })
        .catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4561-GetUserinformationdrop filter');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5460-getStoreName');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5467-getStoreName');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getUsers', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getUsers');
    try {
        var session = req.session;
        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query = '';

        if (session.user_id == 1) {
            query = "SELECT * FROM `users`  ORDER BY id DESC"
        } else {
            query = "SELECT * FROM `users` storeid IN (" + storeid + ") ORDER BY id DESC"
        }
        //console.log(query);

        mysql.queryCustom(query).then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4506-getUsers');
                res.end(result.error);

            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4511-getUsers');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5506-getUsers');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5513-getUsers');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getAsnDestination', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getAsnDestination');
    try {
        var session = req.session;
        var storeid = session.storeid;


        var new_query = "SELECT destination FROM `asn_master` WHERE destination <> '' " +
            " and destination<>'null' GROUP by destination order by id DESC"
        //console.log(query);

        mysql.queryCustom(new_query).then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4396-getAsnDestination filter');
                res.end(result.error);
            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4400-getAsnDestination filter');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5545-getAsnDestination');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5552-getAsnDestination');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/ZplDataProductMaster', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ZplDataProductMaster');
    try {
        var session = req.session;
        var storeid = session.storeid;


        var new_query = "SELECT * From product_item_master WHERE ean_no = '" + req.body.uid + "'"
        //console.log(query);

        mysql.queryCustom(new_query).then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4418-ZplDataProductMaster filter');
                res.end(error);
            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4422-ZplDataProductMaster filter');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5583-ZplDataProductMaster');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5590-ZplDataProductMaster');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/ZplDataProductMaster_new', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ZplDataProductMaster_new');
    try {
        var session = req.session;
        var storeid = session.storeid;


        var new_query = "SELECT * From product_item_master WHERE ean_no = '" + req.body.uid + "'"
        //console.log(query);

        mysql.queryCustom(new_query).then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {
                console2.log('Error', JSON.stringify(result.error), '4418-ZplDataProductMaster filter');
                res.end(error);
            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4422-ZplDataProductMaster filter');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5583-ZplDataProductMaster');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5590-ZplDataProductMaster');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getAsnStatus', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getAsnStatus');
    try {
        var session = req.session;
        var storeid = session.storeid;


        var new_query = 'SELECT status FROM asn_master group by status'
        //console.log(query);

        mysql.queryCustom(new_query).then(function(result) {
            if (result.status == "1") {
                res.end(JSON.stringify(result.results));
            } else {

                console2.log('Error', JSON.stringify(error), '4441-getAsnStatus filter');
                res.end(error);
            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '4445-getAsnStatus filter');
            res.end(error);
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5622-getAsnStatus');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5629-getAsnStatus');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Get getStoreCompany
router.post('/getStoreCompany', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStoreCompany');
    try {
        var session = req.session;
        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query = '';

        if (session.user_id == 1) {
            query = "SELECT * FROM tb_store WHERE 1 GROUP BY store_company ORDER BY storeid DESC"
        } else {
            query = "SELECT * FROM tb_store WHERE storeid IN (" + storeid + ") GROUP BY store_company ORDER BY storeid DESC"
        }
        //console.log(query);

        mysql.queryCustom(query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(error), '4474-getStoreCompany filter');
                    res.end(error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '4479-getStoreCompany filter');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5672-getStoreCompany');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5679-getStoreCompany');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




//Get store_country
router.post('/store_country', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('store_country');
    try {
        var session = req.session;
        var storeid = session.storeid;

        storeid = storeid.split('[').join('');
        storeid = storeid.split(']').join('');

        var query = '';

        if (session.user_id == 1) {
            query = "SELECT * FROM tb_store WHERE 1 GROUP BY store_country ORDER BY storeid DESC"
        } else {
            query = "SELECT * FROM tb_store WHERE storeid IN (" + storeid + ") GROUP BY store_country ORDER BY storeid DESC"
        }
        //console.log(query);

        mysql.queryCustom(query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(error), '4509-store_country filter');
                    res.end(error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '4514-store_country filter');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5723-store_country');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5730-store_country');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getDevieceID
router.post('/getDevieceID', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getDevieceID');
    try {
        var session = req.session;
        var storeid = session.storeid;
        // storeid = storeid.split('[').join('');
        // storeid = storeid.split(']').join('');

        var new_query = "SELECT * FROM handheld_devices GROUP BY device_unique_id order by id desc";
        //console.log("dddddddddddddddd"+new_query);
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(error), '4534-getDevieceID filter');
                    res.end(error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '4539-getDevieceID filter');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5764-getDevieceID');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5771-getDevieceID');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//GetUserinformationdrop
router.post('/GetUserinformationdrop', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetUserinformationdrop');
    try {
        var session = req.session;
        var storeid = session.storeid;


        var new_query = "SELECT * FROM users order by id desc";

        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '4556-GetUserinformationdrop filter');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '4561-GetUserinformationdrop filter');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5802-GetUserinformationdrop');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5809-GetUserinformationdrop');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/GetDeviceInfo', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetDeviceInfo');
    try {
        var session = req.session;
        var storeid = session.storeid;


        var new_query = "SELECT deviceid FROM tb_audit WHERE deviceid <> '' "+ 
        " AND deviceid<>'null' GROUP BY deviceid  ORDER BY auditid DESC";
        //console.log(new_query);
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '4577-GetDeviceInfo filter');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '4582-GetDeviceInfo filter');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5839-GetDeviceInfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5846-GetDeviceInfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/supply_chain_Receive_today', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('supply_chain_Receive_today');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;
        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');


                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = "SELECT SUM(received_item) as receiving_total " +
                    "FROM `asn_master`  " +
                    " WHERE 1 and destination " +
                    "IN ( " + storeid + ") and date = '" + CheckDate + "'";



                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '4614-supply_chain_Receive_today supplychaindashboard');
                        res.end(result.error);

                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4619-supply_chain_Receive_today supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5894-supply_chain_Receive_today');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5901-supply_chain_Receive_today');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/Supply_Chain_Receive_Last_Month', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Supply_Chain_Receive_Last_Month');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;
        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');



                var CheckDate = dateFormat(now, "yyyy-mm-dd");

                var myVariable = CheckDate;

                var makeDate = new Date(myVariable);



                makeDate.setMonth(makeDate.getMonth() - 1);

                var last_month = dateFormat(makeDate.toString(), "yyyy-mm-dd")


                var new_query = "SELECT SUM(received_item) as receiving_total_month " +
                    "FROM `asn_master`  " +
                    " WHERE 1  and destination " +
                    "IN ( " + storeid + ") and date >= '" + last_month + "' " +
                    " AND date <= '" + CheckDate + "'";


                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4662-Supply_Chain_Receive_Last_Month supplychaindashboard');
                        res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4666-Supply_Chain_Receive_Last_Month supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '5957-Supply_Chain_Receive_Last_Month');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '5946-Supply_Chain_Receive_Last_Month');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/Supply_Chain_Last_Week_Received', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Supply_Chain_Last_Week_Received');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');
                storeid = '0002115';



                function getLastWeek() {
                    var today = new Date();
                    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    return lastWeek;
                }

                var lastWeek = getLastWeek();
                var lastWeekMonth = lastWeek.getMonth() + 1;
                var lastWeekDay = lastWeek.getDate();
                var lastWeekYear = lastWeek.getFullYear();


                var lastWeek = ("00" + lastWeekMonth.toString()).slice(-2) + "-" + ("00" + lastWeekDay.toString()).slice(-2) + "-" + ("0000" + lastWeekYear.toString()).slice(-4);

                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = "SELECT SUM(received_item) as receiving_total_week " +
                    "FROM `asn_master`  " +
                    " WHERE 1 and  destination " +
                    "IN ( " + storeid + ") and date >= '" + lastWeek + "' AND date <= '" + CheckDate + "' ";



                // console.log("?????????????????++++"+new_query);


                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4719-Supply_Chain_Last_Week_Received supplychaindashboard');
                        res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4723-Supply_Chain_Last_Week_Received supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6030-Supply_Chain_Last_Week_Received');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6037-Supply_Chain_Last_Week_Received');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/supply_chain_Expected_Today', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('supply_chain_Expected_Today');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');



                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = "SELECT SUM(transferred_item) as expected_receiving_total " +
                    "FROM `asn_master`  " +
                    " WHERE 1 and  destination IN ( " + storeid + ") " +
                    " and date = '" + CheckDate + "' order by id desc";


                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '4757-supply_chain_Expected_Today supplychaindashboard');
                        res.end(result.error);


                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4763-supply_chain_Expected_Today supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6086-supply_chain_Expected_Today');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6093-supply_chain_Expected_Today');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/Expected_Today_dashboard', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Expected_Today_dashboard');
    try {
        var now = new Date();
        var session = req.session;

        var storeid = session.storeid;

        //console.log(session.user_permission);

        if (mysql.check_permission('dashboard_home', session.user_permission)) {

            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');

                var CheckDate = dateFormat(now, "yyyy-mm-dd");

                var new_query = "SELECT SUM(transferred_item) as expected_receiving_total " +
                    "FROM `asn_master`  " +
                    " WHERE 1  and destination IN ( " + storeid + ") and date = '" + CheckDate + "' order by id desc";


                mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify(result.results));
                        } else {
                            console2.log('Error', JSON.stringify(result.error), '4796-Expected_Today_dashboard supplychaindashboard');
                            res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '4808-Expected_Today_dashboard supplychaindashboard');
                        res.end(error);
                    });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6140-Expected_Today_dashboard');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6147-Expected_Today_dashboard');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/Expected_Today_home_dashboard_details', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Expected_Today_home_dashboard_details');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;
        if (mysql.check_permission('dashboard_home', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');
                //console.log("ddddd"+storeid);

                var CheckDate = dateFormat(now, "yyyy-mm-dd");

                var new_query = "SELECT * FROM `asn_master` WHERE transferred_item > 0 " +
                    " and received_item = 0  AND date <= '" + CheckDate + "' AND destination IN (" + storeid + ") order by `date` desc limit 0,20";
                //console.log("Expected_Today_home_dashboard_details>>>>>zzzzzzz>>>>>>>>"+new_query);
                mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify(result.results));
                        } else {

                            console2.log('Error', JSON.stringify(result.error), '4829-Expected_Today_home_dashboard_details supplychaindashboard');
                            res.end(result.error);


                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '4836-Expected_Today_home_dashboard_details supplychaindashboard');
                        res.end(error);
                    });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6191-Expected_Today_home_dashboard_details');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6198-Expected_Today_home_dashboard_details');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




router.post('/Supply_Chain_Expected_Last_Month', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Supply_Chain_Expected_Last_Month');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');


                var CheckDate = dateFormat(now, "yyyy-mm-dd");

                var myVariable = CheckDate;

                var makeDate = new Date(myVariable);



                makeDate.setMonth(makeDate.getMonth() - 1);

                var last_month = dateFormat(makeDate.toString(), "yyyy-mm-dd")


                var new_query = " SELECT SUM(transferred_item) as expected_total_month " +
                    "FROM `asn_master`  " +
                    " WHERE received_item='0' and destination IN ( " + storeid + ") and" +
                    " date >= '" + last_month + "' AND date <= '" + CheckDate + "' ";



                //console.log("<<>>>>>>>>>>>>>>>>>>>zzzzzzzz"+new_query);

                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4883-Supply_Chain_Expected_Last_Month supplychaindashboard');
                        res.end(result.error);

                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4888-Supply_Chain_Expected_Last_Month supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6259-Supply_Chain_Expected_Last_Month');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6266-Supply_Chain_Expected_Last_Month');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/Supply_Chain_Last_Week_Expected', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Supply_Chain_Last_Week_Expected');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');



                function getLastWeek() {
                    var today = new Date();
                    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    return lastWeek;
                }

                var lastWeek = getLastWeek();
                var lastWeekMonth = lastWeek.getMonth() + 1;
                var lastWeekDay = lastWeek.getDate();
                var lastWeekYear = lastWeek.getFullYear();


                var lastWeek = ("00" + lastWeekMonth.toString()).slice(-2) + "-" + ("00" + lastWeekDay.toString()).slice(-2) + "-" + ("0000" + lastWeekYear.toString()).slice(-4);

                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = "SELECT SUM(transferred_item) as week_transfered_receiving_total " +
                    "FROM `asn_master`  " +
                    " WHERE received_item='0'  " +
                    " and destination IN ( " + storeid + ")" +
                    " and  date >= '" + lastWeek + "' AND date <= '" + CheckDate + "'";


                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '4938-Supply_Chain_Last_Week_Expected supplychaindashboard');
                        res.end(result.error);


                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4944-Supply_Chain_Last_Week_Expected supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6331-Supply_Chain_Last_Week_Expected');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6338-Supply_Chain_Last_Week_Expected');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




router.post('/supply_chain_Shipped_Today', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('supply_chain_Shipped_Today');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');



                var CheckDate = dateFormat(now, "yyyy-mm-dd");

                var new_query = "SELECT SUM(transferred_item) as shipping_receiving_total from `asn_master` where 1 " +
                    " and  date = '" + CheckDate + "' and source in (" + storeid + ") ";

                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '4976-supply_chain_Shipped_Today supplychaindashboard');
                        res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '4980-supply_chain_Shipped_Today supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6382-supply_chain_Shipped_Today');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6389-supply_chain_Shipped_Today');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/Supply_Chain_Last_Week_Shipped', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Supply_Chain_Last_Week_Shipped');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');




                function getLastWeek() {
                    var today = new Date();
                    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    return lastWeek;
                }

                var lastWeek = getLastWeek();
                var lastWeekMonth = lastWeek.getMonth() + 1;
                var lastWeekDay = lastWeek.getDate();
                var lastWeekYear = lastWeek.getFullYear();


                var lastWeek = ("00" + lastWeekMonth.toString()).slice(-2) + "-" + ("00" + lastWeekDay.toString()).slice(-2) + "-" + ("0000" + lastWeekYear.toString()).slice(-4);

                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = "SELECT SUM(transferred_item) as Shipped_receiving_total_week from `asn_master` " +
                    " where received_item='0'  " +
                    " and date >= '" + lastWeek + "' AND date <= '" + CheckDate + "' and source in (" + storeid + ") ";

                //console.log("<><>>>>><<<????>><<}}}"+new_query)

                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '5028-Supply_Chain_Last_Week_Shipped supplychaindashboard');
                        res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '5033-Supply_Chain_Last_Week_Shipped supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6450-Supply_Chain_Last_Week_Shipped');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6457-Supply_Chain_Last_Week_Shipped');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/Last_Week_Shipped_Dashboard', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Last_Week_Shipped_Dashboard');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;


        if (mysql.check_permission('dashboard_home', session.user_permission)) {

            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');



                function getLastWeek() {
                    var today = new Date();
                    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    return lastWeek;
                }

                var lastWeek = getLastWeek();
                var lastWeekMonth = lastWeek.getMonth() + 1;
                var lastWeekDay = lastWeek.getDate();
                var lastWeekYear = lastWeek.getFullYear();


                var lastWeek = ("0000" + lastWeekYear.toString()).slice(-4) + "-" + ("00" + lastWeekMonth.toString()).slice(-2) + "-" + ("00" + lastWeekDay.toString()).slice(-2);

                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = " SELECT SUM(transferred_item) as Shipped_receiving_total_week from `asn_master` where 1 " +
                    " and date >= '" + lastWeek + "' AND date <= '" + CheckDate + "' and source in (" + storeid + ") ";

                //res.end("<><><><><><><><><><><><><><><"+new_query)

                mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify(result.results));
                        } else {
                            console2.log('Error', JSON.stringify(result.error), '5080-Last_Week_Shipped_Dashboard supplychaindashboard');
                            res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '5085-Last_Week_Shipped_Dashboard supplychaindashboard');
                        res.end(error);
                    });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6519-Last_Week_Shipped_Dashboard');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6526-Last_Week_Shipped_Dashboard');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/Last_Week_Shipped_dashboard_Details', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Last_Week_Shipped_dashboard_Details');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('dashboard_home', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');


                function getLastWeek() {
                    var today = new Date();
                    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    return lastWeek;
                }

                var lastWeek = getLastWeek();
                var lastWeekMonth = lastWeek.getMonth() + 1;
                var lastWeekDay = lastWeek.getDate();
                var lastWeekYear = lastWeek.getFullYear();


                var lastWeek = ("00" + lastWeekMonth.toString()).slice(-2) + "-" + ("00" + lastWeekDay.toString()).slice(-2) + "-" + ("0000" + lastWeekYear.toString()).slice(-4);

                var CheckDate = dateFormat(now, "yyyy-mm-dd");


                var new_query = "SELECT * FROM `asn_master`  WHERE transferred_item > 0 " +
                    " and received_item = 0  AND  date >= '" + lastWeek + "' AND date <= '" + CheckDate + "' " +
                    "and source in (" + storeid + ") order by `date` desc limit 0,10";

                // console.log("+Last_Week_Shipped_dashboard_Details+++++++++++++++++"+new_query);   
                mysql.queryCustom(new_query).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify(result.results));
                        } else {
                            console2.log('Error', JSON.stringify(result.error), '5130-Last_Week_Shipped_dashboard_Details supplychaindashboard');
                            res.end(result.error);
                        }
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '5135-Last_Week_Shipped_dashboard_Details supplychaindashboard');
                        res.end(error);
                    });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6585-Last_Week_Shipped_dashboard_Details');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6592-Last_Week_Shipped_dashboard_Details');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/Supply_Chain_Shipped_Last_Month', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Supply_Chain_Shipped_Last_Month');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;
        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            if (storeid !== '') {

                storeid = storeid.split('[').join('');
                storeid = storeid.split(']').join('');


                var CheckDate = dateFormat(now, "yyyy-mm-dd");

                var myVariable = CheckDate;

                var makeDate = new Date(myVariable);



                makeDate.setMonth(makeDate.getMonth() - 1);

                var last_month = dateFormat(makeDate.toString(), "yyyy-mm-dd")


                var new_query = "SELECT SUM(transferred_item) as shipping_total_month " +
                    " from `asn_master` where received_item='0' and source in (" + storeid + ") " +
                    " and  date >= '" + last_month + "' AND date <= '" + CheckDate + "' ";



                mysql.queryCustom(new_query).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '5175-Supply_Chain_Shipped_Last_Month supplychaindashboard');
                        res.end(result.error);
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '5179-Supply_Chain_Shipped_Last_Month supplychaindashboard');
                    res.end(error);
                });
            }
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6545-Supply_Chain_Shipped_Last_Month');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6552-Supply_Chain_Shipped_Last_Month');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/ExcessInAsn', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ExcessInAsn');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;

        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            var CheckDate = dateFormat(now, "yyyy-mm-dd");

            var myVariable = CheckDate;

            var makeDate = new Date(myVariable);



            makeDate.setMonth(makeDate.getMonth() - 1);

            var last_month = dateFormat(makeDate.toString(), "yyyy-mm-dd")

            //console.log('After subtracting a month: ', makeDate.toString());    

            var new_query = "SELECT SUM(received_item)-SUM(transferred_item) AS ExcessInAsn " +
                "FROM asn_master WHERE transferred_item < received_item "
            //console.log(">>>>>>>>>>>>>>>>>>>"+new_query);

            mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5214-ExcessInAsn supplychaindashboard');
                    res.end(result.error);
                }
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5218-ExcessInAsn supplychaindashboard');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6699-ExcessInAsn');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6706-ExcessInAsn');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/ShortageinASN', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ShortageinASN');
    try {
        var now = new Date();
        var session = req.session;
        var storeid = session.storeid;
        if (mysql.check_permission('supplychaindashboard', session.user_permission)) {
            var CheckDate = dateFormat(now, "yyyy-mm-dd");

            var myVariable = CheckDate;

            var makeDate = new Date(myVariable);

            //console.log('Original date: ', makeDate.toString());

            makeDate.setMonth(makeDate.getMonth() - 1);

            var last_month = dateFormat(makeDate.toString(), "yyyy-mm-dd")

            //console.log('After subtracting a month: ', makeDate.toString());    

            var new_query = "SELECT SUM(transferred_item)-SUM(received_item) AS ShortageinASN " +
                "FROM asn_master WHERE transferred_item > received_item "

            //console.log(">>>>>>>>>>>>>>>>>>>"+new_query);

            mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5252-ShortageinASN supplychaindashboard');
                    res.end(result.error);
                }
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5256-ShortageinASN supplychaindashboard');
                res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6753-ShortageinASN');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6760-ShortageinASN');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/log_type', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('log_type');
    try {

        var session = req.session;
        var storeid = session.storeid;


        var new_query = "SELECT log_type FROM tb_audit WHERE log_type<>'' AND log_type<>'null' "+ 
        " GROUP BY log_type ORDER BY auditid DESC";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5275-log_type');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5280-log_type');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6792-log_type');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6799-log_type');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Get BrandName
router.post('/getBrandName', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getBrandName');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT DISTINCT(brand) As brand_name,SC.code AS skucode " +
                " FROM `stock_count` SC " +
                "RIGHT JOIN product_item_master PM ON SC.code = PM.skucode GROUP BY PM.brand")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5296-getBrandName');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5301-getBrandName');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6829-getBrandNam');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6836-getBrandNam');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
router.post('/getBrandNameNew', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getBrandNameNew');
    try {
        var session = req.session;

        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {

            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;

        } else {
            stock_count_tb = 'stock_count';
        }

        mysql.queryCustom("SELECT DISTINCT(brand_name) As brand_name,SC.code AS skucode " +
                " FROM `" + stock_count_tb + "` SC where brand_name<>'null'" +
                " GROUP BY SC.brand_name")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5314-getBrandNameNew');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5319-getBrandNameNew');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6878-getBrandNameNew');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6885-getBrandNameNew');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getBrandNameNewForinventory', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getBrandNameNewForinventory');
    try {
        var session = req.session;

        mysql.queryCustom("SELECT DISTINCT(brand) As brand_name" +
                " FROM epc epc where brand<>'null'" +
                " GROUP BY brand")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5314-getBrandNameNewForinventory');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5319-getBrandNameNewForinventory');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6878-getBrandNameNewForinventory');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6885-getBrandNameNewForinventory');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//Get getSkuCode
router.post('/getSkuCode', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getSkuCode');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT SC.code AS skucode  FROM `stock_count` SC " +
                " INNER JOIN product_item_master PM ON SC.code = PM.skucode group by SC.code")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5332-getSkuCode');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5337-getSkuCode');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6912-getSkuCode');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6919-getSkuCode');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//Get getEPC
router.post('/Epc', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Epc');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT epc FROM `epc` SC GROUP BY epc")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5349-Epc');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5354-Epc');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6945-Epc');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6952-Epc');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//Stock Count Data
router.post('/stockCountData', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('stockCountData');
    try {
        var session = req.session;
        mysql.querySelect("stock_count", " order by id desc", "*")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5366-stockCountData');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5371-stockCountData');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '6912-getSkuCode');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '6985-getSkuCode');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//getusereditrecord
router.post('/GetEditUserRecord', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetEditUserRecord');
    try {
        var session = req.session;
        var query_new = "SELECT  US.id AS id, TR.role_id AS role_id,US.storeid, " +
            " US.name AS name ,US.username AS username,US.status AS status," +
            " US.password AS password FROM users US " +
            " LEFT JOIN tb_roles TR ON US.role_id = TR.role_id " +
            " WHERE US.id= '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5392-GetEditUserRecord');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5397-GetEditUserRecord');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7020-GetEditUserRecord');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7027-GetEditUserRecord');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//GetHandHeldDeviceRecord
router.post('/GetHandHeldDeviceRecord', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetHandHeldDeviceRecord');
    try {
        var session = req.session;
        var query_new = "SELECT * FROM handheld_devices " +
            " WHERE id= '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5414-GetHandHeldDeviceRecord');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5419-GetHandHeldDeviceRecord');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7058-GetHandHeldDeviceRecord');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7065-GetHandHeldDeviceRecord');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getusereditrecord
router.post('/GetEditPrinterRecord', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetEditPrinterRecord');
    try {
        var session = req.session;
        var query_new = "SELECT * FROM printer " +
            " WHERE id = '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5436-GetEditPrinterRecord');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5441-GetEditPrinterRecord');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7096-GetEditPrinterRecord');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7103-GetEditPrinterRecord');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getusereditrecord
router.post('/GetEditStoreRecord', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetEditStoreRecord');
    try {
        var session = req.session;
        var query_new = "SELECT * FROM tb_store " +
            " WHERE storeid = '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5458-GetEditStoreRecord');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5463-GetEditStoreRecord');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7134-GetEditStoreRecord');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7141-GetEditStoreRecord');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//getroleseditrecord
router.post('/GetEditRolesRecord', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetEditRolesRecord');
    try {
        var session = req.session;
        var query_new = "SELECT  * FROM tb_roles" +
            " WHERE role_id= '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5480-GetEditRolesRecord');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5485-GetEditRolesRecord');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7172-GetEditRolesRecord');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7179-GetEditRolesRecord');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//get EditZip
router.post('/GetEditZip', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetEditZip');
    try {
        var session = req.session;
        var query_new = "SELECT  * FROM zpl" +
            " WHERE id= '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '5502-GetEditZip');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5507-GetEditZip');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7210-GetEditZip');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7217-GetEditZip');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



function check_storname(storname) {
    try {
        return new Promise((resolve) => {

            var name = storname;


            var error = '0';
            var store_name = '';
            var name2 = '';



            mysql.queryCustom("SELECT storename FROM tb_store WHERE storename= '" + name + "' ").then(function(result) {

                //console.log("<<<<<<<<<<<<<<<<<<<");
                // console.log(util.inspect(result, {showHidden: false, depth: null}))
                // console.log("<<<<<<<<<<<<<<<<<"+result);

                if (result.results.length !== 0) {
                    name2 = result.results[0].storename;
                }


                if (name2 !== '') {
                    error = 'StoreName Already Exists';
                } else {
                    store_name = name;
                }
                let sendparam = {
                    error: error,
                    store_name: store_name
                }

                resolve(sendparam);
            })

        })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7267-check_storname');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7274-check_storname');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


}
//Add Store
router.post('/AddStore', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddStore');
    try {
        var data = req.body;
        var session = req.session;

        function AddStore() {
            return new Promise((resolve) => {
                var create_STS = '';
                check_storname(data.StoreName).then(function(sendparam) {

                    var error_name = sendparam.error;
                    //console.log(" after geeting sendparam ");
                    //console.log(sendparam);
                    if (error_name !== '0') {
                        //console.log(" in srrorrrrr ");
                        res.end(JSON.stringify({
                            "error22": error_name
                        }));
                    } else {

                        var user_id = session.passport.user;
                        var entryData = [];
                        //console.log(data);
                        entryData["storename"] = data.StoreName;
                        entryData["store_location"] = data.StoreLocation;
                        entryData["lat_lng"] = data.LatLng;
                        entryData["store_country"] = data.CountryName;
                        entryData["store_company"] = data.Company;
                        entryData["status"] = data.status;
                        entryData["store_type"] = data.store_type;


                        mysql.queryInsert("tb_store", entryData).then(function(result) {
                            resolve(result);


                            const create_SP = `CREATE PROCEDURE \`update_stock_count_` + data.StoreName + `\`(
                                IN var_sku VARCHAR(255), 
                                IN var_store_id VARCHAR(255), 
                                IN var_date VARCHAR(255))
                            BEGIN
                                DECLARE total DECIMAL(10,2) DEFAULT 0;
                                DECLARE my_initial DECIMAL(10,2) DEFAULT 0;
                                SELECT count(*),initial 
                                INTO total,my_initial
                                FROM stock_count_` + data.StoreName + `
                                WHERE code = var_sku and stockcountdate=var_date and storeid=var_store_id;
                                IF total =0 THEN
                                   insert into stock_count_`+data.StoreName+` set code=var_sku, stockcountdate=var_date, initial=0,counted=1,unexpected=1, storeid=var_store_id,
                                    counted_sf=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='salesfloor' ),
                                    counted_sr=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='stockroom' );
                                    UPDATE stock_count_` + data.StoreName + ` set departmentid= (SELECT department FROM epc_temp where stockcountdate = var_date AND store_id= var_store_id and item_code=var_sku group by item_code ) where code=var_sku;
                                ELSEIF my_initial = 0 THEN 
                                  update stock_count_` + data.StoreName + ` set  
                                  unexpected=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date AND store_id= var_store_id),
                                  counted=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date AND store_id= var_store_id),
                                  counted_sf=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='salesfloor' AND store_id= var_store_id ),
                                  counted_sr=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='stockroom' AND store_id= var_store_id )
                                    where code=var_sku AND stockcountdate=var_date AND  stockcountdate=var_date ;
                                    UPDATE stock_count_` + data.StoreName + ` set departmentid= (SELECT department FROM epc_temp where stockcountdate = var_date AND store_id= var_store_id and item_code=var_sku group by item_code ) where code=var_sku;
                                ELSE
                                  UPDATE stock_count_` + data.StoreName + `
                                    set 
                                    counted= (SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date AND store_id= var_store_id ), 
                                    counted_sr = (SELECT count(*) FROM epc_temp where  
                                    item_code =var_sku and check_date=var_date 
                                    and place='stockroom' AND store_id= var_store_id), 
                                    counted_sf = (SELECT count(*) FROM epc_temp where  
                                    item_code =var_sku and check_date=var_date and place='salesfloor' AND store_id= var_store_id), 
                                    missing = CASE WHEN initial >=counted THEN (initial - counted)  ELSE 0  END, 
                                    unexpected = CASE  WHEN counted > initial THEN (counted - initial) ELSE 0  END 
                                    WHERE code=var_sku  
                                    AND  stockcountdate = var_date AND storeid= var_store_id;
                                END IF;
                                END
                                ;`
                            mysql.queryCustom(create_SP).then(function() {



                            }).catch(function(error) {
                                console2.log('Error', JSON.stringify(error), '5508-create_SP');
                                console.log(error);
                            });

                            var create_table = `CREATE TABLE stock_count_`+data.StoreName+` (
                                id int(20) NOT NULL,
                                storeid varchar(128) DEFAULT NULL,
                                departmentid varchar(128) DEFAULT NULL,
                                code varchar(250) DEFAULT NULL COMMENT 'sku',
                                initial int(20) NOT NULL DEFAULT 0 COMMENT 'Expected',
                                counted int(20) NOT NULL DEFAULT 0,
                                delta varchar(250) DEFAULT NULL,
                                unexpected int(20) NOT NULL DEFAULT 0 COMMENT 'extra(over)',
                                missing int(20) NOT NULL DEFAULT 0 COMMENT 'under',
                                expected int(20) NOT NULL DEFAULT 0 COMMENT 'Match',
                                accuracy varchar(100) DEFAULT NULL,
                                expected_sf int(250) NOT NULL DEFAULT 0,
                                expected_sr int(20) NOT NULL DEFAULT 0,
                                counted_sf int(20) NOT NULL DEFAULT 0,
                                counted_sr int(20) NOT NULL DEFAULT 0,
                                scanned int(20) DEFAULT NULL,
                                stockcountdate date DEFAULT NULL,
                                brand_name varchar(256) DEFAULT NULL,
                                color varchar(128) DEFAULT NULL,
                                size varchar(128) DEFAULT NULL,
                                style varchar(256) DEFAULT NULL,
                                is_deleted varchar(256) DEFAULT NULL,
                                price varchar(250) DEFAULT NULL,
                                season varchar(250) DEFAULT NULL,
                                suppliername varchar(250) DEFAULT NULL,
                                totalprice varchar(250) DEFAULT NULL
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

                            mysql.queryCustom(create_table).then(function() {


                            }).catch(function(error) {
                                console2.log('Error', JSON.stringify(error), '5903-create_table');
                                console.log(error);
                            });

                            var new_sp_store = `
                                                CREATE  PROCEDURE \`stock_count_check_`+data.StoreName+`\`( 
                                                    IN var_store VARCHAR(255),
                                                    IN var_date VARCHAR(255))
                                                BEGIN
                                                    DECLARE data_from_stock_count  varchar (255);
                                                    DECLARE data_from_stock_count_storevise  varchar (255);
                                                    
                                                    select count(code) INTO data_from_stock_count from stock_count_temp WHERE storeid = var_store and stockcountdate = var_date;
                                                    
                                                    IF data_from_stock_count != ''  THEN
                                                    
                                                        select count(*) INTO data_from_stock_count_storevise FROM stock_count_`+data.StoreName+` WHERE NOT EXISTS ( SELECT 1
                                                        from
                                                            stock_count_temp 
                                                        WHERE
                                                            stock_count_`+data.StoreName+`.code = stock_count_temp.code and storeid = var_store and stockcountdate = var_date
                                                           );
                                                       
                                                       IF data_from_stock_count_storevise !='' THEN 
                                                        
                                                       INSERT INTO stock_count_`+data.StoreName+`
                                                  (storeid, departmentid, code, initial, counted, delta, 
                                                  unexpected, missing, expected, accuracy, expected_sf,
                                                   expected_sr, counted_sf, counted_sr, scanned, 
                                                   stockcountdate, brand_name, color, size, style, price, 
                                                   season, suppliername, totalprice)
                                                SELECT storeid, departmentid, code, initial, counted, 
                                                delta, unexpected, missing, expected, accuracy, 
                                                expected_sf, expected_sr, counted_sf, counted_sr, scanned, 
                                                stockcountdate, brand_name, color, size, style, price, season,suppliername, 
                                                totalprice 
                                                FROM stock_count_temp WHERE NOT EXISTS ( SELECT 1
                                                    from
                                                        stock_count_`+data.StoreName+`
                                                WHERE stock_count_`+data.StoreName+`.code = stock_count_temp.code and storeid = var_store and stockcountdate = var_date
                                                   );
                                                   
                                                    UPDATE stock_count_`+data.StoreName+` t1
                                                INNER JOIN stock_count_temp t2
                                                SET t1.storeid= t2.storeid,t1.departmentid= t2.departmentid,t1.code=t2.code,t1.initial=t2.initial,t1.counted=t2.counted,t1.delta=t2.delta,t1.unexpected=t2.unexpected,t1.missing=t2.missing,t1.expected=t2.expected,t1.accuracy=t2.expected,t1.expected_sf=t2.expected_sf,t1.expected_sr=t2.expected_sr,t1.counted_sf=t2.counted_sf,t1.counted_sr=t2.counted_sr,t1.scanned=t2.scanned,t1.stockcountdate=t2.stockcountdate,t1.brand_name=t2.brand_name,t1.color=t2.color,t1.size=t2.size,t1.style=t2.style,t1.price=t2.price,t1.season=t2.season,t1.is_deleted=t2.is_deleted,t1.suppliername=t2.suppliername,t1.totalprice=t2.totalprice
                                                WHERE t1.code = t2.code AND t1.stockcountdate=var_date;
                                                        
                                                delete from stock_count_temp WHERE storeid = var_store and stockcountdate = var_date;
                                                        
                                                        
                                                       END IF;
                                                    
                                                    END IF;
                                                    
                                                    
                                                END;`

                                            mysql.queryCustom(new_sp_store).then(function() {


                                            }).catch(function(error) {
                                                console2.log('Error', JSON.stringify(error), '5903-new_sp_store');
                                                console.log(error);
                                            });    



                        }).catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '5593-AddStore');
                            throw new Error(error);
                        });
                    }
                })
            });
        }
        AddStore()
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Added Successfully"
                    });
                    res.end(Message);
                } else {
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5619-AddStore');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7444-AddStore');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7451-AddStore');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//AddUserRole
router.post('/AddUserRole', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddUserRole');
    try {
        var data = req.body;
        var session = req.session;
        if (mysql.check_permission('UserRoles', session.user_permission)) {

            function AddUserRoles() {
                return new Promise((resolve) => {
                    var user_id = session.passport.user;


                    var entryData = [];
                    // const currentDate = new Date();
                    const currentDate = new Date();
                    const currentDayOfMonth = currentDate.getDate();
                    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
                    const currentYear = currentDate.getFullYear();
                    const dateString = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;


                    entryData["role_name"] = data.RoleName;
                    // entryData["storeid"] = data.SoteID;
                    entryData["createddate"] = dateString;
                    entryData["user_permission"] = data.user_permission;
                    //entryData["stockcountdate"] = data.StockCountDate;

                    mysql.queryInsert("tb_roles", entryData).then(function(result) {
                        res.end(JSON.stringify(result.results));
                    }).catch(function(error) {
                        console2.log('Error', JSON.stringify(result.error), '5656-AddUserRole');
                        res.end(result.error);
                    });
                });
            }
            AddUserRoles()

                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '5664-AddUserRole');
                    throw new Error(error);
                })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7505-AddUserRole');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7512-AddUserRole');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//SELECT * FROM `product_item_master` WHERE 1 AND skucode = '12211' OR ean_no = '11221'

function check_product_item_master(skucode,ean_no) {
    try {
        return new Promise((resolve) => {

            var error = '0';

            var skucode22 = skucode;
            var ean_no22 = ean_no;


           
            var sku_code_send = '';
            var ean_no_send = '';

            var sku_error = '';
            var ean_error = '';

            mysql.queryCustom("SELECT * FROM `product_item_master` WHERE 1 AND skucode = '"+skucode22+"' OR ean_no = '"+ean_no22+"'").then(function(result) {

                

                if (result.results.length !== 0) {
                    sku_code_send = result.results[0].skucode;
                    ean_no_send = result.results[0].ean_no;
                }
                // errorean = 'Sku Code or Ean no already inserted';

                if (sku_code_send == skucode22 ) {
                    sku_error = 'Sku already inserted !';

                } else {
                    sku_code_send = skucode22;
                }

                if (ean_no_send == ean_no22 ) {
                    ean_error = 'Ean no already inserted !';

                } else {
                    ean_no_send = ean_no22;
                }


                
                let sendparam = {
                    error: {
                      sku_error:sku_error,
                      ean_error:ean_error 
                    },
                    sku_code_send: sku_code_send,
                    ean_no_send: ean_no_send,
                }

                resolve(sendparam);
            })

        })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7267-check_product_item_master');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7274-check_product_item_master');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


}


//AddProduct_item_master
router.post('/AddProduct_item_master', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddProduct_item_master');
    try {
        var data = req.body;
        var session = req.session;
        if (mysql.check_permission('product_item_master', session.user_permission)) {

            function AddProduct_item() {
                return new Promise((resolve) => {

                    var entryData = [];

                    check_product_item_master(data.skucode,data.ean_no).then(function(sendparam) {


                        var error22 = sendparam.error;
                        //console.log(error22);
                       
                        if (error22.sku_error !== '' || error22.ean_error !== '') {
                            //console.log(sendparam);
                           

                            var sku_code_send22 = error22.sku_error;
                            var ean_no_send22 = error22.ean_error;

                            res.end(JSON.stringify({
                                "error22": {
                                    sku_error:sku_code_send22,
                                    ean_error:ean_no_send22
                                }
                            }));
                        }else{
                           // console.log('elseeeeeeeeeeeeeeeeeeeeeeeeee');

                            var user_id = session.passport.user;
                           
                            entryData["skucode"] = data.skucode;
                            entryData["product_des"] = data.product_des;
                            entryData["item_code"] = data.item_code;
                            entryData["user"] = data.user;
                            entryData["departmentid"] = data.departmentid;


                            entryData["brand"] = data.brand;
                            entryData["color"] = data.color;
                            entryData["size"] = data.size;
                            entryData["group_name"] = data.group_name;
                            entryData["group_description"] = data.group_description;


                            entryData["departmentname"] = data.departmentname;
                            entryData["ean_no"] = data.ean_no;
                            entryData["sp_net"] = data.sp_net;
                            entryData["season"] = data.season;
                            entryData["vat"] = data.vat;


                            entryData["sales_area"] = data.sales_area;
                            entryData["sp_gross_eng"] = data.sp_gross_eng;
                            entryData["sp_gross_arb"] = data.sp_gross_arb;
                            entryData["supplier_item_no"] = data.supplier_item_no;
                            entryData["supplier_name"] = data.supplier_name;

                            entryData["type_no"] = data.type_no;
                            entryData["arabic_desc"] = data.arabic_desc;
                            entryData["origin"] = data.origin;
                            entryData["english_desc"] = data.english_desc;
                            entryData["company"] = data.company;


                            entryData["currency"] = data.currency;
                            entryData["cost"] = data.cost;
                            entryData["image_url"] = data.image_url;
                            entryData["style"] = data.style;
                            entryData["country"] = data.country;

                            entryData["supplier_no"] = data.supplier_no;
                            entryData["po_supplier_no"] = data.po_supplier_no; 

                            mysql.queryInsert("product_item_master", entryData).then(function(result) {
                                res.end(JSON.stringify(result.results));
                            }).catch(function(error) {
                                console2.log('Error', JSON.stringify(result.error), '5656-AddProduct_item_master');
                                res.end(result.error);
                            });


 

                        }

                        
                    })    



                   
                });
            }
            AddProduct_item()

                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '5664-AddProduct_item_master');
                    throw new Error(error);
                })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7505-AddProduct_item_master');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7512-AddProduct_item_master');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



function check_username_users(username2) {
    try {
        return new Promise((resolve) => {

            var name = username2;


            var error = '0';
            var user_username = '';
            var name2 = '';



            mysql.queryCustom("SELECT username FROM users WHERE username= '" + name + "' ").then(function(result) {

                //console.log("<<<<<<<<<<<<<<<<<<<");
                // console.log(util.inspect(result, {showHidden: false, depth: null}))
                // console.log("<<<<<<<<<<<<<<<<<"+result);

                if (result.results.length !== 0) {
                    name2 = result.results[0].username;
                }


                if (name2 !== '') {
                    error = 'Username already exists !';
                } else {
                    user_username = name;
                }
                let sendparam = {
                    error: error,
                    user_username: user_username
                }

                resolve(sendparam);
            })

        })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7560-check_username_users');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7567-check_username_users');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


}

//AddUser
router.post('/AddUser', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddUser');
    try {
        var data = req.body;
        var session = req.session;
        if (mysql.check_permission('usersinfo', session.user_permission)) {
            function AddUser() {
                return new Promise((resolve) => {

                    check_username_users(data.username).then(function(sendparam) {

                        var error_name = sendparam.error;
                        //console.log(" after geeting sendparam ");
                        //console.log(sendparam);
                        if (error_name !== '0') {
                            //console.log(" in srrorrrrr ");
                            res.end(JSON.stringify({
                                "error22": error_name
                            }));
                        } else {


                            var user_id = session.passport.user;
                            var entryData = [];

                            let salt = bcrypt.genSaltSync(10);
                            let hash = bcrypt.hashSync(data.password, salt);
                            //let hash = bcrypt.hashSync(data.password, 10);


                            entryData["name"] = data.name;
                            entryData["username"] = data.username;
                            entryData["password"] = hash;
                            entryData["role_id"] = data.roles;
                            entryData["storeid"] = data.StoreID;
                            entryData["status"] = data.status;

                            mysql.queryInsert("users", entryData)
                                .then(function(result) {
                                    res.end(JSON.stringify(result.results));
                                })
                                .catch(function(error) {
                                    console2.log('Error', JSON.stringify(result.error), '5751-AddUser');
                                    res.end(result.error);
                                });
                        }
                    })


                });
            }
            AddUser()
                .catch(function(error) {
                    throw new Error(error);
                })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7635-AddUser');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7642-AddUser');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/addretailapi', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('addretailapi');
    try {
        var data = req.body;
        var session = req.session;
        //if (mysql.check_permission('UserRoles', session.user_permission)) {
            function AddRetailApi() {
                return new Promise((resolve) => {
                    var user_id = session.passport.user;
                    var entryData = [];

                    entryData["request_name"] = data.request_name;
                    entryData["envoirment"] = data.envoirment;
                    entryData["endpoint"] = data.endpoint;
                    entryData["payload"] = data.payload;
                    entryData["server_protocol"] = data.server_protocol;
                    
                    
                    mysql.queryInsert("retailapis", entryData)
                        .then(function(result) {
                            res.end(JSON.stringify(result.results));
                        })
                        .catch(function(error) {
                            console2.log('Error', JSON.stringify(result.error), '7684-AddRetailApi');
                            res.end(result.error);
                        });
                });
            }
            AddRetailApi()
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(result.error), '7691-AddRetailApi');
                    throw new Error(error);
                })
       // }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7696-AddRetailApi');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7703-AddRetailApi');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
})



//Add ZPL
router.post('/AddZPL', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddZPL');
    try {
        var data = req.body;
        var session = req.session;
        if (mysql.check_permission('UserRoles', session.user_permission)) {
            function AddZpl() {
                return new Promise((resolve) => {
                    var user_id = session.passport.user;
                    var entryData = [];

                    entryData["name"] = data.name;
                    entryData["zpl"] = data.zpl;
                    entryData["storeid"] = data.stoid;
                    entryData["status"] = data.status;
                    entryData["remarks"] = escape(data.remarks);
                    //entryData["stockcountdate"] = data.StockCountDate;
                   
                    mysql.queryInsert("zpl", entryData)
                        .then(function(result) {
                            res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error.error), '5791-AddZPL');
                        res.end(JSON.stringify(error.error));
                    });
                });
            }
            AddZpl()
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(errorc.error), '5798-AddZPL');
                    throw new Error(error);
                })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7688-AddZPL');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7695-AddZPL');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


function check_username(username2) {
    try {
        return new Promise((resolve) => {

            var name = username2;


            var error = '0';
            var deviceusername = '';
            var name2 = '';



            mysql.queryCustom("SELECT username FROM handheld_devices WHERE username= '" + name + "' ").then(function(result) {

                //console.log("<<<<<<<<<<<<<<<<<<<");
                // console.log(util.inspect(result, {showHidden: false, depth: null}))
                // console.log("<<<<<<<<<<<<<<<<<"+result);

                if (result.results.length !== 0) {
                    name2 = result.results[0].username;
                }


                if (name2 !== '') {
                    error = 'Device username already exists';
                } else {
                    deviceusername = name;
                }
                let sendparam = {
                    error: error,
                    deviceusername: deviceusername
                }

                resolve(sendparam);
            })

        })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7744-check_username');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7751-check_username');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


}


//Add HandHeld Device
router.post('/AddHandHeldDevice', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddHandHeldDevice');
    try {
        var data = req.body;
        //var session = req.session;

        //console.log("i am enter in AddHandHeldDevice");
        //if (mysql.check_permission('handheldDevices', session.user_permission)) {
            //console.log("permission condition true");

            function HandheldDevices() {
                
                return new Promise((resolve) => {

                    var username = req.body.UserName;
                  

                    check_username(username).then(function(sendparam) {

                    


                        var error_name = sendparam.error;
                   
                        if (error_name !== '0') {
                            //console.log(" in srrorrrrr ");
                            res.end(JSON.stringify({
                                "error22": error_name
                            }));
                        } else {

                            //var user_id = session.passport.user;
                            var entryData = [];
                            var password = '';

                            // console.log(" before calling genSaltSync");

                            let salt = bcrypt.genSaltSync(10);
                            password = bcrypt.hashSync(data.Password, salt);
                            //console.log(" after calling genSaltSync");
                            //password = bcrypt.hashSync(data.Password, 10);

                            entryData["username"] = req.body.UserName;
                            entryData["password"] = password;
                            entryData["device_unique_id"] = data.DeviceID;
                            entryData["ns_connection"] = data.NonSecureIP;
                            entryData["ss_connection"] = data.SecureIP;
                            entryData["device_ip"] = data.DeveiceIP;
                            entryData["server_ip"] = data.ServerIP;
                            entryData["status"] = data.status;
                            entryData["storeid"] = data.StoreID;
                            entryData["description"] = data.Description;

                          
                            mysql.queryInsert("handheld_devices", entryData).then(function(result) {
                                //res.end(JSON.stringify(result.results));
                                res.end(JSON.stringify({status: "1",title: "Success",icon: "success",text: "Device Added Successfully"}));
                            }).catch(function(error) {
                                console2.log('Error', JSON.stringify(error.error), '5907-AddHandHeldDevice');
                                res.end(error.error);
                            });

                        }

                    })






                });
            }
            HandheldDevices()
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '5924-AddHandHeldDevice');
                    throw new Error(error);
                })
        /*} else {
            res.end("No Permission");
        }*/
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7850-AddHandHeldDevice');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7857-AddHandHeldDevice');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




//Add Printer
router.post('/AddPrinter', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('AddPrinter');
    try {
        var data = req.body;
        var session = req.session;
        //if(mysql.check_permission('UserRoles',session.user_permission)){
        function AddPrinter() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];

                entryData["name"] = data.name;
                entryData["ip"] = data.ip;
                entryData["port"] = data.port;
                entryData["storeid"] = data.stoid;
                entryData["status"] = data.status;
                entryData["remarks"] = data.remarks;
                //entryData["stockcountdate"] = data.StockCountDate;

                mysql.queryInsert("printer", entryData)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error.error), '5960-AddPrinter');
                        res.end(error.error);
                    });
            });
        }
        AddPrinter()


            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '5969-AddPrinter');
                throw new Error(error);
            })
        // } 
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7907-AddPrinter');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7914-AddPrinter');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




//Stock Count Edit
router.post('/EditHandHeldDevice', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditHandHeldDevice');
    try {
        var data = req.body;
        var session = req.session;
        function HandheldDevice() {
            return new Promise((resolve) => {
                //var user_id = session.passport.user;
                var entryData = [];

                var password = '';




                if (data.password == '') {
                    password = data.hidden_password;

                } else {

                    let salt = bcrypt.genSaltSync(10);
                    password = bcrypt.hashSync(data.password, salt);
                    // password = bcrypt.hashSync(data.password, 10)

                }

                entryData["username"] = data.UserName;
                entryData["password"] = password;
                entryData["device_unique_id"] = data.DeviceID;
                entryData["ns_connection"] = data.NonSecureIP;
                entryData["ss_connection"] = data.SecureIP;
                entryData["device_ip"] = data.DeveiceIP;
                entryData["server_ip"] = data.ServerIP;
                entryData["status"] = data.status;
                entryData["last_sync"] = data.LastSync;
                entryData["storeid"] = data.StoreID;
                entryData["description"] = data.Description;
                entryData["last_usages"] = data.LastUsages;
                var whereQuery = {
                    id: data.hidden_id,
                }
                mysql.queryUpdate("handheld_devices", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify({status: "1",title: "Success",icon: "success",text: "Device Updated Successfully"}));
                        //res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '6024-EditHandHeldDevice');
                        res.end(JSON.stringify(error));
                    });
            });
        }
        HandheldDevice()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6034-EditHandHeldDevice');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6039-EditHandHeldDevice');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '7992-EditHandHeldDevice');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '7999-EditHandHeldDevice');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});


//EditUserRecord
router.post('/EditUserRecord', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditUserRecord');
    try {
        var data = req.body;
        var session = req.session;

        function editUsers() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];

                var password = '';




                if (data.password == '') {
                    password = data.hidden_password;

                } else {

                    let salt = bcrypt.genSaltSync(10);
                    password = bcrypt.hashSync(data.password, salt);
                    //password = bcrypt.hashSync(data.password, 10)

                }

                var submitpassword = password



                entryData["name"] = data.name;
                entryData["username"] = data.username;
                entryData["role_id"] = data.roles;
                entryData["storeid"] = data.StoreID;
                entryData["status"] = data.status;
                entryData["password"] = password;
                var whereQuery = {
                    id: data.id,
                }
                mysql.queryUpdate("users", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '6092-EditUserRecord');
                        res.end(JSON.stringify(error));
                    });
            });
        }
        editUsers()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6102-EditUserRecord');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6107-EditUserRecord');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8076-EditUserRecord');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8083-EditUserRecord');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//EditUserRecord
router.post('/EditPrinter', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditPrinter');
    try {
        var data = req.body;
        var session = req.session;

        function editUsers() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];

                // var new_query = "UPDATE "+ 
                // " printer SET name='"+data.name+"',ip='"+data.ip+"',"+ 
                // "port='"+data.port+"',storeid='"+data.stoid+"',status='"+data.status+""+ 
                // "',remarks='"+data.remarks+"' "+ 
                // "WHERE id='"+data.id+"'"
                //console.log("================="+new_query);
                entryData["name"] = data.name;
                entryData["ip"] = data.ip;
                entryData["port"] = data.port;
                entryData["storeid"] = data.stoid;
                entryData["status"] = data.status;
                entryData["remarks"] = data.remarks;

                var whereQuery = {
                    id: data.id,
                }
                //"printer",entryData,whereQuery
                mysql.queryUpdate("printer", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '6146-EditPrinter');
                        res.end(JSON.stringify(error));
                    });
            });
        }
        editUsers()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6156-EditPrinter');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6161-EditPrinter');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8146-EditPrinter');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8153-EditPrinter');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//EditStore
router.post('/EditStore', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditStore');
    try {
        var data = req.body;
        var session = req.session;

        function editUsers() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];
                //console.log(data);

                entryData["storename"] = data.StoreName;
                entryData["store_location"] = data.StoreLocation;
                entryData["lat_lng"] = data.LatLng;
                entryData["store_country"] = data.CountryName;
                entryData["store_company"] = data.Company;
                entryData["status"] = data.status;
                entryData["store_type"] = data.store_type;

                var whereQuery = {
                    storeid: data.id,
                }
                //"printer",entryData,whereQuery
                mysql.queryUpdate("tb_store", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '6195-EditStore');
                        res.end(JSON.stringify(error));
                    });
            });
        }
        editUsers()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6205-EditStore');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6210-EditStore');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8211-EditStore');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8218-EditStore');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//EditRetailApi
router.post('/EditRetailApi', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditRetailApi');
    try {
        var data = req.body;
        var session = req.session;

        function EditRetailApi() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];
                //console.log(data);
                // console.log(data.server_protocol);
                entryData["request_name"] = data.request_name;
                entryData["envoirment"] = data.envoirment;
                entryData["endpoint"] = data.endpoint;
                entryData["payload"] = data.payload;
                entryData["server_protocol"] = data.server_protocol;
              

                var whereQuery = {
                    id: data.Retail_id,
                }
                //"printer",entryData,whereQuery
                mysql.queryUpdate("retailapis", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '8315-EditRetailApi');
                        res.end(JSON.stringify(error));
                    });
            });
        }
        EditRetailApi()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '8325-EditRetailApi');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '8330-EditRetailApi');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8334-EditRetailApi');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8341-EditRetailApi');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//EditRoles
router.post('/EditRoles', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditRoles');
    try {
        var data = req.body;

        var session = req.session;


        function editUsers() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];
                entryData["role_name"] = data.RoleName;
                // entryData["storeid"] = data.SoteID;
                // entryData["createddate"] = data.CreatedDate;
                entryData["user_permission"] = data.user_permission;
                var whereQuery = {
                    role_id: data.id,
                }
                mysql.queryUpdate("tb_roles", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '6239-EditRoles');
                        res.end(JSON.stringify(error));
                    });
            });
        }
        editUsers()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6249-EditRoles');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6254-EditRoles');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8272-EditRoles');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8279-EditRoles');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//EditZpl
router.post('/EditZpl', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('EditZpl');
    try {
        var data = req.body;
        var session = req.session;
        // console.log(data);
        function editUsers() {
            return new Promise((resolve) => {
                var user_id = session.passport.user;
                var entryData = [];
                entryData["name"] = data.name;
                entryData["zpl"] = data.zpl;
                entryData["storeid"] = data.StoreIDD;
                entryData["restrict_user"] = data.restrict_user;
                entryData["remarks"] = data.remarks;
                entryData["status"] = data.status;
                var whereQuery = {
                    id: data.ID,
                }
                // console.log("zpl", entryData, whereQuery);
                mysql.queryUpdate("zpl", entryData, whereQuery)
                    .then(function(result) {
                        res.end(JSON.stringify(result.results));
                    })
                    .catch(function(error) {
                        res.end(JSON.stringify(result.results));
                    });
            });
        }
        editUsers()
            .then(function(response) {
                if (response.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(error), '6293-EditZpl');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6298-EditZpl');
                throw new Error(error);
            })
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8333-EditZpl');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8340-EditZpl');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Delete Users
router.post('/userDelete', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('userDelete');
    try {
        mysql.queryCustom("DELETE FROM users Where id = '" + req.body.id + "'")
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6316-userDelete');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6327-userDelete');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8385-userDelete');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8392-userDelete');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Delete Users
router.post('/RetailDelete', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('RetailDelete');
    try {
        mysql.queryCustom("DELETE FROM retailapis Where id = '" + req.body.id + "'")
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6316-RetailDelete');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6327-RetailDelete');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8385-RetailDelete');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8392-RetailDelete');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//Delete Store
router.post('/storeDelete', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('storeDelete');
    try {
        var delete_query = '';
        var storename = req.body.store_name;

        if (storename !== '' && storename !== undefined) {
            delete_query = "DELETE FROM tb_store Where storeid = '" + req.body.id + "';" +
                "DROP TABLE IF EXISTS stock_count_" + storename + ";DROP PROCEDURE IF EXISTS `update_stock_count_" + storename + "`;"+ 
                " DROP PROCEDURE IF EXISTS `stock_count_check_" + storename + "`  ";
        } else {
            delete_query = "DELETE FROM tb_store Where storeid = '" + req.body.id + "';"
        }

        mysql.queryCustom(delete_query)
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6353-storeDelete');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6364-storeDelete');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8448-storeDelete');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8455-storeDelete');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Delete Device
router.post('/DeleteDeviceHandheld', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('DeleteDeviceHandheld');
    try {
        mysql.queryCustom("DELETE FROM handheld_devices Where id = '" + req.body.id + "'")
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Device Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6389-DeleteDeviceHandheld');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6400-DeleteDeviceHandheld');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8500-DeleteDeviceHandheld');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8507-DeleteDeviceHandheld');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//Delete Users
router.post('/zplDelete', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('zplDelete');
    try {
        mysql.queryCustom("DELETE FROM zpl Where id = '" + req.body.id + "'")
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6427-zplDelete');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6438-zplDelete');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8554-zplDelete');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8561-zplDelete');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//DeletePrinter
router.post('/DeletePrinter', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('DeletePrinter');
    try {
        mysql.queryCustom("DELETE FROM printer Where id = '" + req.body.id + "'")
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6464-DeletePrinter');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6475-DeletePrinter');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8607-DeletePrinter');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8614-DeletePrinter');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//RolesDelete
router.post('/RolesDelete', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('RolesDelete');
    try {
        var query_role = "SELECT role_id FROM users";
        mysql.queryCustom(query_role).then(function(result) {

            return new Promise((resolve) => {
                //var roleid ='';
                getrole = result.results;
                var roleid = '';
                for (var i = 0; i <= getrole.length; i++) {

                    roleid += getrole[i].role_id;
                }

            });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '6506-RolesDelete');
            res.end(error);
        });


        mysql.queryCustom("DELETE FROM tb_roles WHERE role_id = '" + req.body.id + "'")
            .then(function(response) {
                if (response.status == "1") {
                    var Message = JSON.stringify({
                        status: "1",
                        title: "Success",
                        icon: "success",
                        text: "Stock Count Deleted Successfully"
                    });
                    res.end(Message);
                } else {
                    console2.log('Error', JSON.stringify(response.error), '6522-RolesDelete');
                    var Message = JSON.stringify({
                        status: "0",
                        title: "Error",
                        icon: "error",
                        text: response.error
                    });
                    res.end(Message);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(response.error), '6533-RolesDelete');
                var errorMessage = JSON.stringify({
                    status: "0",
                    title: "Error",
                    icon: "error",
                    text: error.message
                });
                commonFunctions.errorLogger(error.message);
                res.end(errorMessage);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8680-RolesDelete');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8687-RolesDelete');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});

//sumofStocksummay

router.post('/sumofStocksummay', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('sumofStocksummay');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';




        if (mysql.check_permission('stockSummary', session.user_permission)) {


            var query_new = " SELECT ROUND(((SUM(SC.initial)-ABS(SUM(SC.missing)))*100/SUM(SC.initial)),2) " +
                "AS accuracy, ROUND(((SUM(SC.initial)-ABS(SUM(SC.unexpected)))*100/SUM(SC.initial)),2) " +
                "AS uia," +
                "SUM(initial) AS expected,ABS(SUM(unexpected)) AS unexpected, " +
                "SUM(counted) AS counted,ABS(SUM(missing)) AS missing, " +
                "SUM(expected_sf) AS expectedsf,SUM(expected_sr) AS expectedsr, " +
                "SUM(counted_sf) AS countedsf,SUM(counted_sr) AS countedsr,SUM(scanned) AS scanned  " +
                "FROM `stock_count` SC " +
                " WHERE 1";
            //console.log(query_new);

            mysql.queryCustom(query_new).then(function(result) {

                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '6577-sumofStocksummay');
                        res.end(result.error);
                    }

                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '6583-sumofStocksummay');
                    res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8740-sumofStocksummay');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8747-sumofStocksummay');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/getuserPermissions', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getuserPermissions');
    try {
        var session = req.session;

        var new_query = "SELECT user_permission FROM users US " +
            "LEFT JOIN tb_roles TR ON TR.role_id=US.role_id " +
            "WHERE US.id = '" + session.user_id + "'"
        mysql.queryCustom(new_query)

            .then(function(result) {
                //console.log(result)
                if (result.status == "1") {

                    var json2 = result.results[0].user_permission

                    res.send(json2);
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6607-getuserPermissions');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6612-getuserPermissions');
                res.end(error);
            });

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8784-getuserPermissions');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8791-getuserPermissions');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }

    // var permissions = session.user_permission;

    // res.end(permissions); 

});





router.post('/getuserdetails', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getuserdetails');
    try {
        var session = req.session;
        var permissions = session.user_permission;
        var new_query = "SELECT username" +
            " FROM users US " +
            " WHERE id='" + session.user_id + "'";

        //console.log(new_query); 
        mysql.queryCustom(new_query)

            .then(function(result) {
                //console.log(result)
                if (result.status == "1") {

                    let userInformation = {
                        query_result: result.results,
                        user_permissions: permissions,
                    };

                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '6651-getuserdetails');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6656-getuserdetails');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8841-getuserdetails');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8848-getuserdetails');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//authenticationMidleware(),
router.post('/stockSummaryReport', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('stockSummaryReport');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        // var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        //console.log(req.body.order[0].dir);


        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }


        //console.log('======'+req.body.my_date);

        if (order_col == 0 || order_col == 1 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {
            order_by_cond = " order by " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        }else{
            cond += ' AND SC.storeid="000"'
        }






        if (mysql.check_permission('stockSummary', session.user_permission)) {

            var totalrecord = '';

            var sumQuery = "SELECT ROUND(((SUM(SC.initial)-ABS(SUM(SC.unexpected)))*100/SUM(SC.initial)),2) " +
                "AS uiasum," +
                "SUM(initial) AS expectedsum, ABS(SUM(unexpected)) AS unexpectedsum, " +
                "SUM(counted) AS countedsum,ABS(SUM(missing)) AS missingsum, " +
                "SUM(expected_sf) AS expectedsfsum,SUM(expected_sr) AS expectedsrsum, " +
                "SUM(counted_sf) AS countedsfsum,SUM(counted_sr) AS countedsrsum,SUM(scanned)" +
                " AS scannedsum  from " + stock_count_tb + " SC " +
                "where 1 and SC.departmentid<> 'null' " + cond + " "
            //console.log("<<<<<<<<<<<"+sumQuery);

            mysql.queryCustom(sumQuery).then(function(result) {
                totalrecord = JSON.stringify(result.results);

                //console.log('sssstotalrecord'+totalrecord);
                var query_new = "SELECT SC.code AS SKU_code,SC.storeid, " +
                    " SC.departmentid as departmentname22, " +

                  
                    "SC.brand_name AS brandname,"+ 
                    "SC.size AS size,SC.color AS color,"+ 

                    " sum(SC.missing) AS remaining," +
                    " sum(SC.initial) AS expected," +
                    " sum(SC.counted) as counted , " +
                    " sum(SC.counted_sf) AS countedsf," +
                    " sum(SC.unexpected) AS unexpected," +
                    " sum(SC.missing) AS missing, " +
                    " sum(SC.expected_sr) AS expectedsr, " +
                    " sum(SC.expected_sf) AS expectedsf, " +
                    " sum(SC.scanned) AS scanned," +
                    " sum(SC.counted_sr) AS countedsr, " +
                    " SC.stockcountdate AS date " +
                    " FROM " + stock_count_tb + " SC " +
                    " WHERE 1 and SC.departmentid<> 'null'" + cond + " " + search_cond + "  " +
                    " GROUP BY SC.departmentid " + order_by_cond;

                //console.log("++++++++++++++++" + query_new);

                var query_count = " select count(*) as `my_count` from ( SELECT SC.storeid," +
                    "SC.missing AS remaining,SC.initial AS expected," +
                    " SC.counted,SC.counted_sf AS countedsf, " +
                    " SC.counted_sr AS countedsr " +
                    " FROM " + stock_count_tb + " SC " +
                    " WHERE 1 and SC.departmentid<> 'null' " + cond + " " + search_cond + "  " +
                    " GROUP BY SC.departmentid ) sq ";

                //abdulrehmanijaz
                //console.log("====>>>>>>>>>>>"+query_new);


                mysql.queryCustom(query_count).then(function(result) {
                    total_rec = result.results[0].my_count;


                    mysql.queryCustom(query_new).then(function(result) {


                            summaryData = result.results;
                            var table_data = [];

                            if (summaryData.length > 0) {

                                for (var i = 0; i < summaryData.length; i++) {

                                    var accuracyForm = parseFloat(summaryData[i].expected) - parseFloat(Math.abs(summaryData[i].missing));
                                    var accuracyForm2 = parseFloat(accuracyForm) * parseFloat(100);
                                    var accuracyForm3 = parseFloat(accuracyForm2) / parseFloat(summaryData[i].expected);

                                    var uiaForm = parseFloat(summaryData[i].expected) - (parseFloat(Math.abs(summaryData[i].unexpected)) + parseFloat(Math.abs(summaryData[i].missing)));
                                    var uiaForm2 = parseFloat(uiaForm) * parseFloat(100);
                                    var uiaForm3 = parseFloat(uiaForm2) / parseFloat(summaryData[i].expected);

                                    var row_data = {
                                        "aatotal_sum": totalrecord,
                                        "accuracyCount": summaryData[i].accuracyCount,
                                        // "SKU_code": summaryData[i].SKU_code,
                                        "date": summaryData[i].date,
                                        "store": summaryData[i].storeid,
                                        "department": summaryData[i].departmentname22,

                                        "accuracy": accuracyForm3.toFixed(2),
                                        "uia": uiaForm3.toFixed(2),
                                        "expected": summaryData[i].expected,
                                        "counted": summaryData[i].counted,
                                        "unexpected": summaryData[i].unexpected,
                                        "missing": "-" + (summaryData[i].missing).toString(),
                                        "expectedsf": summaryData[i].expectedsf,
                                        "expectedsr": summaryData[i].expectedsr,
                                        "countedsf": summaryData[i].countedsf,
                                        "countedsr": summaryData[i].countedsr,
                                        "scanned": summaryData[i].scanned,

                                    };
                                    table_data.push(row_data);
                                }

                                //console.log(totalrecord);
                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');



                            } else {
                                //console.log('ssss'+totalrecord);
                                var row_data = {
                                    "aatotal_sum": totalrecord,
                                    "accuracyCount": '',
                                    "SKU_code": '',
                                    "date": 'No Record Found',
                                    "store": '',
                                    "department": '',
                                    "accuracy": '',
                                    "uia": '',
                                    "expected": '',
                                    "counted": '',
                                    "unexpected": '',
                                    "missing": '',
                                    "expectedsf": '',
                                    "expectedsr": '',
                                    "countedsf": '',
                                    "countedsr": '',
                                    "scanned": '',
                                };

                                table_data.push(row_data);

                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                            }


                        })
                        .catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '6831-stockSummaryReport');
                            res.end(error);
                        })
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '6835-stockSummaryReport');
                    res.end(error);
                });
                //console.log(totalrecord);

            })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9057-stockSummaryReport');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9064-stockSummaryReport');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Stock Count Graph data
router.post('/getStockCountData', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStockCountData');
    try {
        var session = req.session;
        var cond = '';

        var stock_count_tb = '';
        var data_filter = req.body.store_id;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.store_id;
            stock_count_tb = 'stock_count_' + req.body.store_id;
        } else {
            stock_count_tb = 'stock_count';
        }


        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        }

        if (mysql.check_permission('stockSummary', session.user_permission)) {

            var new_query = " SELECT SC.departmentid AS department," +
                " SUM(SC.initial) AS expected, " +
                " SUM(SC.unexpected) AS unexpected, " +
                " ( SUM(SC.initial) -  SUM(SC.missing) ) AS counted, " +
                " SUM(SC.missing) AS missing " +
                " FROM `" + stock_count_tb + "` SC " +

                " WHERE 1 and SC.departmentid<> 'null' " + cond + "  GROUP by SC.departmentid ";

            //zeeshan

            mysql.queryCustom(new_query)
                .then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '6835-getStockCountData');
                        res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '6835-getStockCountData');
                    res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9128-getStockCountData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9135-getStockCountData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//AsnFilters
router.post('/Cancel_AsnFilters', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Cancel_AsnFilters');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT process FROM cancel_asn_items GROUP BY process")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6896-Cancel_AsnFilters');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6901-Cancel_AsnFilters');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9163-Cancel_AsnFilters');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9170-Cancel_AsnFilters');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//cancelstore_id 
router.post('/cancelstore_id', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('cancelstore_id');
    try {
        var session = req.session;
        mysql.queryCustom("SELECT store_id FROM cancel_asn_items GROUP BY store_id")
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6913-cancelstore_id');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6918-cancelstore_id');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9196-cancelstore_id');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9203-cancelstore_id');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/AddCronJobTask', (req, res, next) => {
    console2.execution_info('AddCronJobTask');
    try {
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
                var status=1;
                if(process_type=="CycleCount")
                {
                    status=1;
                }
                var Addtask = "INSERT INTO cronjob_taks (Retail_CycleCountID,process_type,store_id,destinationStore,status) " +
                    "VALUES ('" + Retail_CycleCountID + "','" + process_type + "' , '" + store_id + "' , '" + destinationStore + "' , '" + status + "' )";


                mysql.queryCustom(Addtask).then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        res.end(JSON.stringify(result));
                    }
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '6960-AddCronJobTask stockcount record');
                    res.end(error);
                });
            } else {
                response['message'] = 'Token Not Valid !';
                res.json(JSON.stringify(response));
            }
        } else {

            response['message'] = 'Filed is missing';
            res.json(JSON.stringify(response));
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9236-AddCronJobTask');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9270-AddCronJobTask');
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
            var data_base_uuid = '';

            for (var kk = 0; kk < res22.length; kk++) {
                data_base_uuid = res22[kk].uuid;

                //console.log(parseInt(data_base_uuid)+"<====>"+parseInt(user_uuid));

                if ((data_base_uuid) == (user_uuid)) {
                    stats22 = '1';
                }

            }
            resolve(stats22);


        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9302-check_exist');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9309-check_exist');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
};

router.post('/HandHeldDevice_Api', (req, res, next) => {

    console2.execution_info('HandHeldDevice_Api');
    try {
        var now = new Date();
        var username = req.body.username;
        var password = req.body.password;
        var token = req.body.token;

        var user_uuid = req.body.uuid;

        //console.log((req.body));

        if (username !== '' && username !== undefined && password !== '' &&
            password !== undefined && token !== undefined && token !== '') {

            //console.log(check_status);
            if (password == '' || username == '') {
                response = 0;
                //response['message']  =   'Both username and password required';
                res.json(JSON.stringify(response));
                return
            }

            // console.log(access_token );
            if (token == 123456) {
                var check_now = 'enter ana do';
                var data_base_uuid = '';
                //console.log(check_status);
                var selectquery = "select * from handheld_devices where username= '" + username + "' ";
                mysql.queryCustom(selectquery)
                    .then(function(result) {
                        //console.log((result));
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



                                // bcrypt.compare(password, result.results[0].password, function(err, result) {
                                if (password == result.results[0].password) {
                                    check_exist(password, resss, user_uuid).then(function(ressss2) {

                                        if (ressss2 == "0") {
                                            //console.log(typeof ressss2);
                                            var CheckDate = dateFormat(now, "yyyy-mm-dd");

                                            var insert_query = "insert into handheld_devices (`device_unique_id`," +
                                                " `username`, `password`, `description`, `status`, `storeid`, `last_sync`," +
                                                " `last_usages`, `ns_connection`, `ss_connection`," +
                                                " `device_ip`, `server_ip`, `uuid`,`handheld_date`) values ('" + database_device_unique_id + "','" + username22 + "'," +
                                                "'" + password22 + "','" + description + "','" + status + "','" + storeid + "'," +
                                                "'" + last_sync + "','" + last_usages + "','" + ns_connection + "'," +
                                                "'" + ss_connection + "','" + device_ip + "','" + server_ip + "','" + user_uuid + "', '" + CheckDate + "' )"

                                            //console.log(insert_query);
                                            mysql.queryCustom(insert_query).then(function(result) {
                                                if (result.status == "1") {

                                                } else {

                                                }
                                            }).catch(function(error) {
                                                //res.end(error);
                                                console2.log('Error', JSON.stringify(error), '7078-HandHeldDevice_Api stockcount record');
                                            });

                                            //response['message'] =   'insert karna ha';
                                            //res.json(JSON.stringify(response));
                                        } else {

                                            var CheckDate2 = dateFormat(now, "yyyy-mm-dd");

                                            var update = "UPDATE `handheld_devices` " +
                                                " SET `uuid` = '" + user_uuid + "',`handheld_date`= '" + CheckDate2 + "'  WHERE  username = '" + username + "' and password = '" + password22 + "'";
                                            //console.log(update);
                                            mysql.queryCustom(update).then(function(result) {
                                                if (result.status == "1") {
                                                    // res.end(JSON.stringify(result.results));
                                                } else {
                                                    //res.end(result.error);
                                                }
                                            }).catch(function(error) {
                                                //res.end(error);
                                            });
                                        }
                                        response['message'] = 'Logged in Successfully';
                                        res.json(JSON.stringify(response));
                                        //update table set date='date' where user='user' and pass='pass' and uui='123'


                                    });

                                } else {
                                    response['message'] = 'Your Username or Password is incorrect';
                                    res.json(JSON.stringify(response));
                                }
                                // });
                            } else {
                                //response = 0;
                                response['message'] = 'Username does not exist';
                                res.json(JSON.stringify(response));
                            }
                        } else {
                            //response = 0;
                            response['message'] = 'Error Logging In';
                            res.json(JSON.stringify(response));
                        }
                    })
                    .catch(function(error) {
                        res.json(JSON.stringify(response));
                    })
            } else {
                //response = 0;
                response['message'] = ' Invalid Token';
                res.json(JSON.stringify(response));
            }
        } else {
            response = '1';
            response['message'] = 'Field is missing !';
            res.json(JSON.stringify(response));
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '9458-HandHeldDevice_Api');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '9465-HandHeldDevice_Api');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.get('/faultyskus', (req, res, next) => {
    console2.execution_info('faultyskus');
    
    var new_query = "SELECT * FROM zpl_printer "+ 
    " WHERE sku IS NOT NULL AND epc IS NOT NULL AND sku <> '' AND epc <> '' ";

    mysql.queryCustom(new_query).then(function(result) {
        if (result.status == "1") {
            var record_set = result.results;
            var parse_new = epc_parse;
            var sku_parts = '';
            var sku = '';
            var sku_int = '';
            var faulty_sku = '';
            var faulty_epc = '';
            var f_data_push = {};
            var total = record_set.length;
            var sku_split = '';
            var epc = '';
            //console.log(total)
            for(var i= 0;i<record_set.length;i++){
                //console.log(record_set[i].epc);
                sku_parts    = parse_new.parse(record_set[i].epc);
                sku          = sku_parts.Sku;
                sku_int      = parseInt(sku,10);
                sku_split    = record_set[i].sku;
                sku_split    = sku_split.split('000000').join('');
               
                // if (i=5 && i < 10){
                    if(sku_int>0){
                        //console.log(sku_int)
                        //console.log(sku_int +"<<<====>>s"+sku_split);
                        if(parseInt(sku_int) !== parseInt(sku_split)){
                            epc += "'"+record_set[i].epc+"' ,"
                            //f_data_push[sku_int]=sku_split;
                        }

                    }
                // }
            }
            
            //console.log(data_push)


            res.end(
                epc
            );
        } else {

        }
    }).catch(function(error) {
        //res.end(error);
        console2.log('Error', JSON.stringify(error), '7078-faultyskus');
    });
    
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

function onAuthorizeSuccess(data, accept) {
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error)
        throw new Error(message);
    accept(null, false);
}

function authenticationMidleware() {
   
    return (req, res, next) => {
        return next();
        //if (req.isAuthenticated()) res.redirect('/login');
    }
    //return true;
}
module.exports = router;
