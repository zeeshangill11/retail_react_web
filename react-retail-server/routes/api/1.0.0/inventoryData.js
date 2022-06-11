var express = require("express");
var router = express.Router();
var passport = require("passport");
const mysql = require("../../../controllers/mysqlCluster.js");
const console2 = require("../../../controllers/customconsole.js");
const commonFunctions = require("../../../commonFunction.js");
const fetch = require('node-fetch');
var response = {};
var Cookies = require("js-cookie");
const request = require('request');
var dateFormat = require("dateformat");
var now = new Date();
const nodemailer = require("nodemailer");
if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}
//export_excel

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


router.post('/CriticalOutOfStocksummary_DetailsReport', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CriticalOutOfStocksummary_DetailsReport');
    try {
        var session = req.session;
        var cond = '';
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
       
        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += 'AND SC.stockcountdate  = "' + to_date + '"'

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



            cond += 'and SC.stockcountdate >="' + from_date + '" and SC.stockcountdate <= "' + to_date + '"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += 'AND SC.stockcountdate  = "' + from_date + '"'

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND SC.stockcountdate  = "' + to_date + '"'

        }


        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }else{
            cond += ' AND SC.storeid="000"'
        }



        //if (mysql.check_permission('executiveSummary', session.user_permission)) {

            var new_query = "SELECT SUM(initial) as CriticalStock,storeid as storeid FROM `" + stock_count_tb + "` SC " +
                "  where  1 and counted = 0 " + cond + "group by SC.stockcountdate";

            
            mysql.queryCustom(new_query).then(function(result) {
                    console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '140-ExecutiveSummaryReport Critical Out Of Stock');
                        res.end(JSON.stringify(result.error));
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '146-ExecutiveSummaryReport Critical Out Of Stock');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '207-CriticalOutOfStocksummary  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '214-CriticalOutOfStocksummary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});




router.post('/getStockSummaryDetails_Report', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStockSummaryDetails_Report');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var stock_count_tb = '';
        var data_filter = req.body.storeid;
        if (data_filter !== '' &&
            data_filter !== "0" &&
            data_filter !== 0 &&
            data_filter !== undefined) {
            data_filter = req.body.storeid;
            stock_count_tb = 'stock_count_'+req.body.storeid;
        } else {
            stock_count_tb = 'stock_count';
        }


        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 
            || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 
            || order_col == 8 || order_col == 9 || order_col == 10 || order_col == 11 
            || order_col == 12) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and epc like '%" + req.body.search['value'] + "%'";
        }

        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += 'AND SC.stockcountdate  = "' + to_date + '"'

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



            cond += 'and SC.stockcountdate >="' + from_date + '" and SC.stockcountdate <= "' + to_date + '"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;

            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += 'AND SC.stockcountdate  = "' + from_date + '"'

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;

            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND SC.stockcountdate  = "' + to_date + '"'

        }

        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
           
            cond += ' AND SC.storeid="' + req.body.storeid + '"' 
            
        }else{

            cond += ' AND SC.storeid="000"'
        }


    //if(mysql.check_permission('epc_report', session.user_permission)) {

            var new_query = "SELECT CASE WHEN SC.counted = 0 THEN SUM(initial) END as critical_out_of_stock , ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                " SUM(initial) AS onhandtotal ," +
                " SUM(counted_sf) AS counted_sf," +
                " SUM(counted_sr) AS counted_sr, " +
                " SUM((counted)) AS inventroycount," +
                " ABS(SUM(missing)) AS missingtotal," +
                " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                " SUM(unexpected) AS overtotal," +
                " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage , SC.stockcountdate as date "+ 
                ",SC.storeid as storename" +
                " FROM "+stock_count_tb+" SC" +
               
                " WHERE 1 " + cond+" group by SC.stockcountdate ";

                //console.log(new_query)

            // var new_query = "SELECT SUM(initial) as CriticalStock FROM `" + stock_count_tb + "` SC " +
            //     "  where  1 and counted = 0 " + cond

             var query_count  = " select count(*) as `my_count` from (SELECT CASE WHEN SC.counted = 0 THEN SUM(initial) END as critical_out_of_stock ,ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                " SUM(initial) AS onhandtotal ," +
                " SUM(counted_sf) AS counted_sf," +
                " SUM(counted_sr) AS counted_sr, " +
                " SUM((counted)) AS inventroycount," +
                " ABS(SUM(missing)) AS missingtotal," +
                " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                " SUM(unexpected) AS overtotal," +
                " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage " +
                " FROM "+stock_count_tb+" SC" +
               
                " WHERE 1 " + cond + " group by SC.stockcountdate )sq";
                



        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;

                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {
                        //console.log(getstoreinf)
                        var row_data = {

                            "date":getstoreinf[i].date,
                            "storename":getstoreinf[i].storename,
                            "onhandtotal":getstoreinf[i].onhandtotal,

                            "inventroycount":getstoreinf[i].inventroycount,
                            "item_accuracy":getstoreinf[i].item_accuracy,
                            "operational_accuracy":getstoreinf[i].operational_accuracy,

                            "onhandmatching":getstoreinf[i].onhandmatching,
                            "missingtotal":getstoreinf[i].missingtotal,
                            "overtotal":getstoreinf[i].overtotal,

                            "critical_out_of_stock":"<span id=critical_out_of_stock_"+getstoreinf[i].storename+"_"+i+"></span>",


                            "counted_sf":getstoreinf[i].counted_sf,
                            "counted_sr":getstoreinf[i].counted_sr

 
                        };
                        //

                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '247-getStockSummaryDetails_Report');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '253-getStockSummaryDetails_Report');
                res.end(JSON.stringify(error));
            });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '329-getStockSummaryDetails_Report  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '336-getStockSummaryDetails_Report  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
router.post('/getStockCountOldDataReprt', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStockCountOldDataReprt');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        var stock_count_tb = 'stock_count_old_data';


        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 
            || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 
            || order_col == 8 || order_col == 9 || order_col == 10 || order_col == 11 
            || order_col == 12) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        var fromdate = req.body.from_my_date;
        var todate = req.body.to_my_date

        if (fromdate !== '' && fromdate !== '0' &&
            fromdate !== 0 && todate !== '' && todate !== '0' && todate !== 0 &&
            fromdate == todate) {

            var to_my_date = req.body.to_my_date;
            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += 'AND SC.date = "' + to_date + '"'

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
            cond += 'and SC.date >="' + from_date + '" and SC.date <= "' + to_date + '"'

        } else if (req.body.from_my_date != "" &&
            req.body.from_my_date != 0 &&
            req.body.from_my_date != "0") {

            var from_my_date = req.body.from_my_date;
            var from_date = dateFormat(from_my_date, "yyyy-mm-dd");

            cond += 'AND SC.date  = "' + from_date + '"'

        } else if (req.body.to_my_date != "" &&
            req.body.to_my_date != 0 &&
            req.body.to_my_date != "0") {

            var to_my_date = req.body.to_my_date;
            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");

            cond += ' AND SC.date  = "' + to_date + '"'
        }

        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
           
            cond += ' AND SC.storeid="' + req.body.storeid + '"' 
            
        }else{

            cond += ' AND SC.storeid="000"'
        }


    //if(mysql.check_permission('epc_report', session.user_permission)) {

            var new_query = "SELECT * FROM "+stock_count_tb+" SC" +
                " WHERE 1 " + cond+" group by SC.date ";
                //console.log(new_query)

            // var new_query = "SELECT SUM(initial) as CriticalStock FROM `" + stock_count_tb + "` SC " +
            //     "  where  1 and counted = 0 " + cond

             var query_count  = " select count(*) as `my_count` FROM "+stock_count_tb+" SC" +
                " WHERE 1 " + cond + " group by SC.date";
            //console.log(query_count);

        mysql.queryCustom(query_count).then(function(result) {
            //console.log(result);
            var total_rec = 0;
            if (result.length > 0) {
                total_rec = result.results[0].my_count;
            }
            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;

                    var table_data = [];
                    var stock_old_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {
                        //console.log(getstoreinf)
                        var row_data = {
                            "date":getstoreinf[i].date,
                            "storename":getstoreinf[i].storeid,
                            "onhandtotal":getstoreinf[i].onhandtotal,
                            "inventroycount":getstoreinf[i].inventroycount,
                            "item_accuracy":getstoreinf[i].item_accuracy,
                            "operational_accuracy":getstoreinf[i].operational_accuracy,
                            "onhandmatching":getstoreinf[i].onhandmatching,
                            "missingtotal":getstoreinf[i].missingtotal,
                            "overtotal":getstoreinf[i].overtotal,
                            "critical_out_of_stock":"<span id=critical_out_of_stock_"+getstoreinf[i].storeid+"_"+i+"></span>",
                            "counted_sf":getstoreinf[i].counted_sf,
                            "counted_sr":getstoreinf[i].counted_sr
                        };
                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                })
                .catch(function(error) {
                    console.log(error);
                    console2.log('Error', JSON.stringify(error), '247-getStockCountOldDataReprt');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '253-getStockCountOldDataReprt');
                console.log(error);
                res.end(JSON.stringify(error));
            });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '329-getStockCountOldDataReprt  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '336-getStockCountOldDataReprt  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getSOHSummary_yesterday', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getSOHSummary_yesterday');
    try {
        var date = new Date();
        
        var yesterday_Date = (new Date(Date.now() - 1 * 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
        //console.log(yesterday_Date);
        //var now = new Date();
        var session = req.session;
        var getstoreinf = '';
        var new_query_stock_store = '';
        var cond = '';
        var date = '';
        var search_cond = '';

        if (req.session.user_id == 1) {
            date = dateFormat(now, "yyyy-mm-dd");


            var  new_query = "SELECT * " +
                    "  FROM tb_store WHERE 1";

           
        }
       // console.log(new_query);


  
        mysql.queryCustom(new_query)

            .then(function(result) {
                //console.log(result)
                if (result.status == "1") {

                    getstoreinf = result.results;
                    var all_stores = [];
                    var one_hand_total = '';
                    var all_data = [];
                    var row_data = '';
                    for (var i = 0; i < getstoreinf.length; i++) {

                        storename = getstoreinf[i].storename;
                        store_id = getstoreinf[i].storeid;
                        all_stores.push(storename);
                        new_query_stock_store += "SELECT SUM(initial) AS onhandtotal , "+ 
                            " SUM((counted)) AS inventroycount,'"+storename+"' as mystore "+ 
                            " from stock_count_"+getstoreinf[i].storename+" where 1  and stockcountdate = '"+yesterday_Date+"';"

                    }

                        //console.log(all_stores.length);
                        mysql.queryCustom(new_query_stock_store).then(function(result22){ 
                               
                            total_results = result22.results;
                           
                            for(j=0;j<total_results.length;j++){
                                
                                row_data={

                                    "mystore":total_results[j][0].mystore,
                                    "inventroycount":total_results[j][0].inventroycount,
                                    "onhandtotal":total_results[j][0].onhandtotal
                                
                                } 
                               
                            
                               all_data.push(row_data) 
                            }
                           
                            res.end(JSON.stringify(all_data));  
                            }).catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '66w12-getSOHSummary_yesterday');
                            res.end(error);
                        });
                    
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6607-getSOHSummary_yesterday');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6612-getSOHSummary_yesterday');
                res.end(error);
            });


    } catch (e) {
        console2.log('Error', 'Catch Expection', '8784-getSOHSummary_yesterday');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '8791-getSOHSummary_yesterday');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/getSOHSummary', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getSOHSummary');
    try {
        var now = new Date();
        var session = req.session;
        var getstoreinf = '';
        var new_query_stock_store = '';
        var cond = '';
        var date = '';
        var search_cond = '';

        if (req.session.user_id == 1) {
            date = dateFormat(now, "yyyy-mm-dd");


            var  new_query = "SELECT * ," +
                    " CASE WHEN status = 1 THEN 'Active' ELSE 'Disable' END AS statuss FROM tb_store WHERE 1";

           
        }
       // console.log(new_query);


  
        mysql.queryCustom(new_query)

            .then(function(result) {
                //console.log(result)
                if (result.status == "1") {

                    getstoreinf = result.results;
                    var all_stores = [];
                    var one_hand_total = '';
                    var all_data = [];
                    var row_data = '';
                    for (var i = 0; i < getstoreinf.length; i++) {

                        storename = getstoreinf[i].storename;
                        store_id = getstoreinf[i].storeid;
                        all_stores.push(storename);
                        new_query_stock_store += "SELECT SUM(initial) AS onhandtotal , "+ 
                            " SUM((counted)) AS inventroycount,'"+storename+"' as mystore "+ 
                            " from stock_count_"+getstoreinf[i].storename+" where 1  and stockcountdate = '"+date+"';"

                    }

                        //console.log(all_stores.length);
                        mysql.queryCustom(new_query_stock_store).then(function(result22){ 
                               
                            total_results = result22.results;
                           
                            for(j=0;j<total_results.length;j++){
                                
                                row_data={

                                    "mystore":total_results[j][0].mystore,
                                    "inventroycount":total_results[j][0].inventroycount,
                                    "onhandtotal":total_results[j][0].onhandtotal
                                
                                } 
                               
                            
                               all_data.push(row_data) 
                            }
                           
                            res.end(JSON.stringify(all_data));  
                            }).catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '66w12-new_query_stock_store');
                            res.end(error);
                        });
                    
                } else {
                    console2.log('Error', JSON.stringify(result.error), '6607-getSOHSummary');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '6612-getSOHSummary');
                res.end(error);
            });

    } catch (e) {
        console2.log('Error', 'Catch Expection', '8784-getSOHSummary');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '8791-getSOHSummary');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//soh_detailsController
router.post('/soh_detailsController', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('soh_detailsController');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,150 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 6 || order_col == 5) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and storename like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0" && req.body.storeid != undefined) {
            cond += ' AND storename="' + req.body.storeid + '" ';
        }
        if (req.body.Company != "" && req.body.Company != 0 && req.body.Company != "0" && req.body.Company != undefined) {
            cond += ' AND store_company="' + req.body.Company + '" ';
        }
       
        

        //if (mysql.check_permission('storeinfo', session.user_permission)) {


            var new_query = '';
            var query_count = '';
            var new_query_stock_store = '';
            var total_results = '';
          
            var storeid = session.storeid;
            



            if (req.session.user_id == 1) {

                new_query += "SELECT * ," +
                    " CASE WHEN status = 1 THEN 'Active' ELSE 'Disable' END AS statuss FROM tb_store WHERE 1 " + cond + search_cond + " " + order_by_cond;

                query_count += "select count(*) as `my_count` from (SELECT * FROM tb_store WHERE 1 " + cond + search_cond + ") sq ";
            }

           
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;
                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;
                        var one_hand_total = '';
                        var inventroy_count = '';
                        var table_data = [];
                        var row_data = '';
                        var storename = ''
                        var store_id = '';
                       
                        for (var i = 0; i < getstoreinf.length; i++) {

                            storename = getstoreinf[i].storename;
                            store_id = getstoreinf[i].storeid;

                            row_data = {

                                "check_all":'<input type="checkbox" name="sotrename" class="check_all_inner" data_atrr='+i+' value='+storename+'>',
                                "storeid": store_id,
                                "storename": storename,
                                "yesterday_soh":"<span id=yesterday_soh_"+storename+"></span>",
                                "on_hand_matching": "<span id=on_hand_matching_"+storename+"></span>",
                                "counted": "<span id=counted_"+storename+"></span>",
                                'action': '<div class="msg_div"></div><button type="button" store_name=' +storename+ ' class="btn consume_soh btn-success" style="color:#fff;border-color:#fff;border-radius:0px">Consume SOH</button> | <button type="button" store_name='+storename+' class="btn clean_soh btn-danger" style="color:#fff;border-color:#fff;border-radius:0px;">Clean SOH</button> | <button type="button" store_name='+storename+' class="btn run_soh btn-primary" style="color:#fff;border-color:#fff;border-radius:0px;">Run CycleCount</button>'
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
        //}
    } catch (e) {
        console2.log('Error', 'Catch Expection', '4409-getstoreinfo');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '4416-getstoreinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
})

//Admin Error Log
router.post('/admin_error_logReport', authenticationMidleware(), (req, res, next) => {
        
    console2.execution_info('admin_error_logReport');
       
    try {
        var session = req.session;
      
        var fs        = require('fs');
        var path = require("path");
        var full_path = path.join(__dirname, '../../../MMAssets/css/error_log/');
        var open_link = process.env.SITE_LINK+'/assets/css/error_log/';
       
        var s = 0;
        var table_data = [];
        var date = '';       

        fs.readdirSync(full_path).forEach(file => {
            s++
            date = file.split('_error_log.html');
                      
            var row_data = {

                "date_time":date[0],
                "file_name":file,
                "view_file":'<a href='+open_link+file+' target="_blank" class="btn download_file btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">View File</a> ',
            };    
            table_data.push(row_data);
           
        });

        res.end('{"aaData":' + JSON.stringify(table_data) + '}');

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4409-admin_error_logReport');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '4416-getstoreinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
})


router.post('/clear_fileReport', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('clear_fileReport');
    try {
        var session = req.session;
        var now       = new Date();
        var dateTime  = dateFormat(now, "yyyy-mm-dd");
      
        var fs        = require('fs');
        var path = require("path");
        
        var open_link = process.env.SITE_LINK+'/assets/css/error_log/';
       
        var s = 0;
       
        var date = ''; 
        var full_path = '';  
        var file_name = '';    
        var full_path2 = path.join(__dirname, '../../../MMAssets/css/error_log/');
        fs.readdirSync(full_path2).forEach(file => {

            fs.writeFile(full_path2+file, '', function(){console.log('done')})
            //console.log(file)
            // s++
            // full_path = path.join(__dirname, '../../../MMAssets/css/error_log/'+dateTime+'_'+s+'_error_log.html');
               
            // fs.open(full_path+file_name, 'w', function (err, file) {
            //   if (err) throw err;
            //   //console.log('Saved!');
            // });  
        });

        res.end('ok');

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '4409-admin_error_logReport');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '4416-getstoreinfo');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
})

router.post('/GetASNDetailsReceiveingAPI', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetASNDetailsReceiveingAPI');
    try {
        var session = req.session;
        var data = req.body;
        //console.log(data);
        // res.end('ok');
        abody = {
            "OriginStoreID":data.store,
            "ASN": data.asn,
            "Process": "shipping",
            "ProcessStatus": "intransit"
        };
        //console.log(abody);
        fetch(process.env.IOT_API + 'reportExecution/SUPPLYCHAINVERIFY', {
            method: 'post',
            body: JSON.stringify(abody),
            headers: {
                'apikey': process.env.IOT_API_KEY,
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
            console2.log('Error', JSON.stringify(error), '902-EpcDump API ASN json validation');
        }).then((json) => {

            var total_results = json.results; 
            //console.log(total_results);                 
            var total_items_stock = total_results.length;
            var temp2=[];
            if (total_items_stock > 0) {
                for (var z = 0; z < total_results.length; z++) {

                    temp2.push(
                        total_results[z]["thing.headers"].serialNumber,
                    );
                }
               //console.log('qqqqqqqqqqq');
                res.end(JSON.stringify(temp2));
            }else{
               res.end(JSON.stringify('No result found')); 
            }
        })
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '41-Activities  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '48-Activities  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/ConfirmASNDetailsReceiveingAPI', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('ConfirmASNDetailsReceiveingAPI');
    try {
        var session = req.session;
        var data = req.body;
        var storeID = data.storename;
        var username = storeID.split('000');
        var storeuser = username[1];
       
        var Asn = data.asn;
        var remarks = data.remarks;
        var epcreceiveData = req.body.EpcReceive;
        var Retail_Bizlocation = req.body.retail_bizlocation;

       

        var payload22 = '';
         payload22 += '[';
          var sendJson ='';
        if(epcreceiveData !== undefined && epcreceiveData !== '' 
            && Asn !== undefined && Asn !== '' 
            && storeID !== undefined && storeID !== '' 
            && Retail_Bizlocation !== undefined && Retail_Bizlocation !== '' 
           ){
            

           

            if(Array.isArray(epcreceiveData)){

                    epcreceiveData.forEach(element => {
                    payload22 +=  '{"group":">RUBAIYAT","thingTypeCode":"ITEM", '+ 
                    '"serialNumber":"'+element+'",'+ 
                    ' "udfs":{"Retail_Bizlocation_Original":{"value":"'+storeID+'"},'+ 
                    ' "Retail_Bizlocation":{"value":"'+Retail_Bizlocation+'"},"deviceId":{"value":"C2A0622C-CB02-41E9-9465-9946B282B38F"},'+ 
                    ' "Retail_BizTransactionId":{"value":"'+Asn+'"},"Retail_BizTransactionProcess":{"value":"receiving"},"Retail_BizTransactionProcessStatus":{"value":"closed"},'+ 
                    '"source":{"value":"MOBILE"},"user":{"value":"store'+storeuser+'"},"remarks":{"value":"'+remarks+'"}}},'
                 
                
                });
                payload22 += ']';

                const editedText = payload22.slice(',', -2);
               sendJson = editedText+']';
            }else{


                payload22 +=  '{"group":">RUBAIYAT","thingTypeCode":"ITEM", '+ 
                    '"serialNumber":"'+epcreceiveData+'",'+ 
                    ' "udfs":{"Retail_Bizlocation_Original":{"value":"'+storeID+'"},'+ 
                    ' "Retail_Bizlocation":{"value":"'+Retail_Bizlocation+'"},"deviceId":{"value":"C2A0622C-CB02-41E9-9465-9946B282B38F"},'+ 
                    ' "Retail_BizTransactionId":{"value":"'+Asn+'"},"Retail_BizTransactionProcess":{"value":"receiving"},"Retail_BizTransactionProcessStatus":{"value":"closed"},'+ 
                    '"source":{"value":"MOBILE"},"user":{"value":"store'+storeuser+'"},"remarks":{"value":"'+remarks+'"}}}]'
                sendJson = payload22;  

                //console.log('ssssssssssssssssssssssssssssss');
            }

            
           //console.log(sendJson);
            //console.log(sendJson);

            const options = {
                url: process.env.IOT_API+'things?upsert=true&verboseResult=false',
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'apikey': process.env.IOT_API_KEY,
                },
                body: sendJson
            };
            //console.log(options);
           
                
            request(options, function(err, res2, body) {
                let wjson = body;
                console.log(wjson);
                if(err){
                   console2.log('Error', err, '2ds-ConfirmASNDetailsReceiveingAPI'); 
                }else{
                  var Addtask = "INSERT INTO cronjob_taks (Retail_CycleCountID,process_type,store_id,destinationStore) " +
                   "VALUES ('" + Asn + "','receiving' , '" + storeID + "' , '" + Retail_Bizlocation + "' )";
                    
                    mysql.queryCustom(Addtask).then(function(result) {
                        if (result.status == "1") {
                            res.end(JSON.stringify(result.results));
                        } else {

                            console2.log('Error', JSON.stringify(result.error), '28-ConfirmASNDetailsReceiveingAPI');
                            res.end(JSON.stringify(result.error));
                            
                        }
                    }).catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '34-ConfirmASNDetailsReceiveingAPI');
                        res.end(error);
                    });  
                } 
                

               
            });
        }
        
         
            
        
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '41-ConfirmASNDetailsReceiveingAPI  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '48-ConfirmASNDetailsReceiveingAPI  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/Activities', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('Activities');
    try {
        var session = req.session;
        if (mysql.check_permission('dashboard', session.user_permission)) {

            var new_query = "SELECT * FROM tb_audit ORDER BY auditid DESC LIMIT 0,10"
            mysql.queryCustom(new_query)
                .then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '28-Activities Show In Dashboard');
                        res.end(JSON.stringify(result.error));
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '34-Activities Show In Dashboard');
                    res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '41-Activities  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '48-Activities  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/executiveSummaryController', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('executiveSummaryController');
    try {
        var session = req.session;
        var cond = '';
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
        // console.log(req.body);
        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND SC.brand_name="' + req.body.bid + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }

        if (req.body.size != "" && req.body.size != 0 && req.body.size != "0") {
            cond += ' AND SC.size like "%' + req.body.size + '%" '
        }
        if (req.body.color != "" && req.body.color != 0 && req.body.color != "0") {
            cond += ' AND SC.color="' + req.body.color + '" '
        }
        var show_over="no";
        if (req.body.show_over =='yes' )
        {
            show_over="yes";
        }




        //if (mysql.check_permission('executiveSummary', session.user_permission)) {
            var new_query ='';

            if(show_over=='yes')
            {
                new_query = "SELECT ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                    " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                    " SUM(initial) AS onhandtotal ," +
                    " SUM(counted_sf) AS counted_sf," +
                    " SUM(counted_sr) AS counted_sr, " +
                    " SUM((counted)) AS inventroycount," +
                    " ABS(SUM(missing)) AS missingtotal," +
                    " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                    " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                    " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                    " SUM(unexpected) AS overtotal," +
                    " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                    " FROM " + stock_count_tb + " SC" +
                   
                    " WHERE 1 " + cond;
            }
            else
            {
                new_query = "SELECT ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                    " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                    " SUM(initial) AS onhandtotal ," +
                    " SUM(counted_sf) AS counted_sf," +
                    " SUM(counted_sr) AS counted_sr, " +
                    " SUM((counted)) AS inventroycount," +
                    " ABS(SUM(missing)) AS missingtotal," +
                    " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                    " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                    " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                    " SUM(unexpected) AS overtotal," +
                    " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                    " FROM " + stock_count_tb + " SC" +
                   
                    " WHERE initial<>0 " + cond; 
            }
            


           
            //console.log(new_query);
            mysql.queryCustom(new_query).then(function(result) {
                    //console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '95-ExecutiveSummaryReport');
                        res.end(JSON.stringify(result.error));
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '101-ExecutiveSummaryReport');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '136-summary  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '143-summary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
//aaa
router.post('/executiveSummaryDateWise', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('executiveSummaryDateWise');
    try {
        //var session = req.session;
        var stock_count_tb = '';
        var date = '';
        var export_excel = req.body.export_excel;

        // if (mysql.check_permission('executiveSummary', session.user_permission)) 
        // {
            var store_query =  "SELECT `storename` FROM `tb_store` ";
            var new_query   =  '';
            mysql.queryCustom(store_query).then(function(result) {
                if (result.status == "1") {
                    var stores = result.results;
                    var fromdate = req.body.from_my_date;
                    var todate = req.body.to_my_date;
                    //console.log(stores);
                    for (var i = 0; i < stores.length; i++) {

                        stock_count_tb = 'stock_count_'+stores[i].storename;

                        if (fromdate !== '' && fromdate !== '0' && fromdate !== 0 && 
                            todate !== '' && todate !== '0' && todate !== 0 && fromdate == todate) {

                            var to_my_date = req.body.to_my_date;
                            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");
                            var cond = 'AND SC.stockcountdate  = "' + to_date + '"';
                            
                            new_query += "SELECT '"+stores[i].storename+"' as storeid,'"+to_date+"' as count_datee,"+
                                            " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                                            " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                                            " SUM(initial) AS onhandtotal ," +
                                            " SUM(counted_sf) AS counted_sf," +
                                            " SUM(counted_sr) AS counted_sr, " +
                                            " SUM((counted)) AS inventroycount," +
                                            " ABS(SUM(missing)) AS missingtotal," +
                                            " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                                            " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                                            " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                                            " SUM(unexpected) AS overtotal," +
                                            " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                                            " FROM " + stock_count_tb + " SC" +
                                            " WHERE initial<>0 " + cond +";";


                        } else if (req.body.from_my_date != "" && req.body.from_my_date != 0 &&
                            req.body.from_my_date != "0" && req.body.to_my_date != "" &&
                            req.body.to_my_date != 0 && req.body.to_my_date != "0") {
                            
                            
                            var start  =  new Date(dateFormat(req.body.from_my_date, "yyyy-mm-dd"));
                            var end    =  new Date(dateFormat(req.body.to_my_date, "yyyy-mm-dd"));


                            while(start <= end){

                                var mm     = ((start.getMonth()+1)>=10)?(start.getMonth()+1):'0'+(start.getMonth()+1);
                                var dd     = ((start.getDate())>=10)? (start.getDate()) : '0' + (start.getDate());
                                var yyyy   = start.getFullYear();
                                var date11 = yyyy+"-"+mm+"-"+dd; //yyyy-mm-dd

                                start = new Date(start.setDate(start.getDate() + 1)); 
                           
                                var cond    = ' AND SC.stockcountdate  = "' + date11 + '"';
                                

                                new_query += "SELECT '"+stores[i].storename+"' as storeid,'"+date11+"' as count_datee,"+
                                    " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                                    " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                                    " SUM(initial) AS onhandtotal ," +
                                    " SUM(counted_sf) AS counted_sf," +
                                    " SUM(counted_sr) AS counted_sr, " +
                                    " SUM((counted)) AS inventroycount," +
                                    " ABS(SUM(missing)) AS missingtotal," +
                                    " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                                    " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                                    " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                                    " SUM(unexpected) AS overtotal," +
                                    " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                                    " FROM " + stock_count_tb + " SC" +
                                    " WHERE initial<>0 " + cond +";";
                            }

                        } else if (req.body.from_my_date != "" && req.body.from_my_date != 0 &&
                            req.body.from_my_date != "0") {

                            var from_my_date    = req.body.from_my_date;
                            var from_date       = dateFormat(from_my_date, "yyyy-mm-dd");
                            var cond            = 'AND SC.stockcountdate  = "' + from_date + '"';
                            
                            new_query += "SELECT '"+stores[i].storename+"' as storeid,'"+from_date+"' as count_datee,"+
                                            " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                                            " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                                            " SUM(initial) AS onhandtotal ," +
                                            " SUM(counted_sf) AS counted_sf," +
                                            " SUM(counted_sr) AS counted_sr, " +
                                            " SUM((counted)) AS inventroycount," +
                                            " ABS(SUM(missing)) AS missingtotal," +
                                            " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                                            " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                                            " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                                            " SUM(unexpected) AS overtotal," +
                                            " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                                            " FROM " + stock_count_tb + " SC" +
                                            " WHERE initial<>0 " + cond +";";

                        } else if (req.body.to_my_date != "" && req.body.to_my_date != 0 &&
                            req.body.to_my_date != "0") {

                            var to_my_date  = req.body.to_my_date;
                            var to_date     = dateFormat(to_my_date, "yyyy-mm-dd");
                            var cond        = ' AND SC.stockcountdate  = "' + to_date + '"';

                            new_query += "SELECT '"+stores[i].storename+"' as storeid,'"+to_date+"' as count_datee,"+
                                            " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                                            " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                                            " SUM(initial) AS onhandtotal ," +
                                            " SUM(counted_sf) AS counted_sf," +
                                            " SUM(counted_sr) AS counted_sr, " +
                                            " SUM((counted)) AS inventroycount," +
                                            " ABS(SUM(missing)) AS missingtotal," +
                                            " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                                            " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                                            " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                                            " SUM(unexpected) AS overtotal," +
                                            " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                                            " FROM " + stock_count_tb + " SC" +
                                            " WHERE initial<>0 " + cond +";";

                        } else {
                            var cond    = ' AND SC.stockcountdate= "" ';

                            new_query += "SELECT '"+stores[i].storename+"' as storeid,'0000-00-00' as count_datee,"+
                                            " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                                            " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                                            " SUM(initial) AS onhandtotal ," +
                                            " SUM(counted_sf) AS counted_sf," +
                                            " SUM(counted_sr) AS counted_sr, " +
                                            " SUM((counted)) AS inventroycount," +
                                            " ABS(SUM(missing)) AS missingtotal," +
                                            " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                                            " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                                            " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                                            " SUM(unexpected) AS overtotal," +
                                            " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                                            " FROM " + stock_count_tb + " SC" +
                                            " WHERE initial<>0 " + cond +";";
                        }
                        /*new_query += "SELECT '"+stores[i].storename+"' as storeid,"+
                            " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                            " ROUND(ABS(( ( (SUM(counted) - SUM(unexpected)) /SUM(initial) ) * 100)),2) AS operational_accuracy ," +
                            " SUM(initial) AS onhandtotal ," +
                            " SUM(counted_sf) AS counted_sf," +
                            " SUM(counted_sr) AS counted_sr, " +
                            " SUM((counted)) AS inventroycount," +
                            " ABS(SUM(missing)) AS missingtotal," +
                            " ABS(ROUND(((sum(missing) / SUM(initial))*100 ),2)) AS missingpercentage," +
                            " ABS(ROUND(((sum(unexpected) / SUM(initial))*100 ),2)) AS overpercentage," +
                            " (SUM(initial) - SUM(missing)) AS onhandmatching," +
                            " SUM(unexpected) AS overtotal," +
                            " ROUND(ABS(((expected)* 100 / ((SUM(expected))))),2) AS expectedpercentage" +
                            " FROM " + stock_count_tb + " SC" +
                            " WHERE initial<>0 " + cond +";";*/ 
                        //break;
                    }

                    //console.log(new_query);
                   // res.end(new_query);
                    mysql.queryCustom(new_query).then(function(results) {
                        console.log(results.results);
                        var total_results = results.results;
                        var table_data = [];
                        for (var i = 0; i < total_results.length; i++) {
                            //console.log(total_results)
                            if(export_excel=="yes")
                            {
                                var row_data = {
                                    "date":total_results[i][0].count_datee,
                                    "storename":total_results[i][0].storeid,
                                    "onhandtotal":(total_results[i][0].onhandtotal != null  ? total_results[i][0].onhandtotal : 0),
                                    "inventroycount":(total_results[i][0].inventroycount != null ? total_results[i][0].inventroycount : 0),
                                    "item_accuracy":(total_results[i][0].item_accuracy != null ? total_results[i][0].item_accuracy : 0),
                                    "operational_accuracy":(total_results[i][0].operational_accuracy != null ? total_results[i][0].operational_accuracy : 0),
                                    "onhandmatching":(total_results[i][0].onhandmatching != null ? total_results[i][0].onhandmatching : 0),
                                    "missingtotal":(total_results[i][0].missingtotal != null ? total_results[i][0].missingtotal : 0),
                                    "overtotal":(total_results[i][0].overtotal != null ? total_results[i][0].overtotal : 0),
                                    "critical_out_of_stock":"0",
                                    "counted_sf":(total_results[i][0].counted_sf != null ? total_results[i][0].counted_sf : 0),
                                    "counted_sr":(total_results[i][0].counted_sr != null ? total_results[i][0].counted_sr : 0)
                                };
                            }
                            else
                            {
                                var row_data = {
                                    "date":total_results[i][0].count_datee,
                                    "storename":total_results[i][0].storeid,
                                    "onhandtotal":(total_results[i][0].onhandtotal != null  ? total_results[i][0].onhandtotal : 0),
                                    "inventroycount":(total_results[i][0].inventroycount != null ? total_results[i][0].inventroycount : 0),
                                    "item_accuracy":(total_results[i][0].item_accuracy != null ? total_results[i][0].item_accuracy : 0),
                                    "operational_accuracy":(total_results[i][0].operational_accuracy != null ? total_results[i][0].operational_accuracy : 0),
                                    "onhandmatching":(total_results[i][0].onhandmatching != null ? total_results[i][0].onhandmatching : 0),
                                    "missingtotal":(total_results[i][0].missingtotal != null ? total_results[i][0].missingtotal : 0),
                                    "overtotal":(total_results[i][0].overtotal != null ? total_results[i][0].overtotal : 0),
                                    "critical_out_of_stock":"<span class=critical_out_of_stock store_id="+total_results[i][0].storeid+" id=critical_out_of_stock_"+total_results[i][0].storeid+" count_date="+total_results[i][0].count_datee+"></span>",
                                    "counted_sf":(total_results[i][0].counted_sf != null ? total_results[i][0].counted_sf : 0),
                                    "counted_sr":(total_results[i][0].counted_sr != null ? total_results[i][0].counted_sr : 0)
                                };
                            }
                            
                            table_data.push(row_data);
                        }
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + table_data.length + '","iTotalDisplayRecords":"' + table_data.length + '"}');
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '101-ExecutiveSummaryReport');
                        res.end(JSON.stringify(error));
                        //res.end(error);
                    });
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '101-ExecutiveSummaryReport');
                console.log(error);
                res.end(JSON.stringify(error));
                //res.end(error);
            });
           
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '136-summary  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '143-summary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/CriticalOutOfStocksummary', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CriticalOutOfStocksummary');
    try {
        var session = req.session;
        var cond = '';
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
        // console.log(req.body);
        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND SC.brand_name="' + req.body.bid + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }



        if (mysql.check_permission('executiveSummary', session.user_permission)) {

            var new_query = "SELECT SUM(initial) as CriticalStock FROM `" + stock_count_tb + "` SC " +
                "  where  1 and counted = 0 " + cond

            //console.log(">>>>>ssssssssssss>>>>>>>>>>>>" + new_query);
            mysql.queryCustom(new_query).then(function(result) {
                    //console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '140-ExecutiveSummaryReport Critical Out Of Stock');
                        res.end(JSON.stringify(result.error));
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '146-ExecutiveSummaryReport Critical Out Of Stock');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '207-CriticalOutOfStocksummary  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '214-CriticalOutOfStocksummary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/product_item_master_controller', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('product_item_master_controller');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and epc like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.skucode != "" && req.body.skucode != 0 && req.body.skucode != "0" && req.body.skucode != undefined) {
           
            cond += ' AND skucode = "' + req.body.skucode + '" '
        }

       

        if (req.body.ean != "" && req.body.ean != 0 && req.body.ean != "0" && req.body.ean != undefined) {

            cond += ' AND ean_no = "' + req.body.ean + '" '
        }



        //if(mysql.check_permission('epc_report', session.user_permission)) {

        var new_query = "SELECT * FROM `product_item_master` " +
            "where 1 " + search_cond + " " + cond +
            " " + order_by_cond;


        var query_count = " select count(*) as `my_count` " +
            "from (SELECT * from product_item_master " +
            " where 1 " + search_cond + " " + cond +
            ") sq ";


        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;
                    //console.log(getstoreinf)
                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {

                        var row_data = {

                            "id":getstoreinf[i].id,
                            "storeid":getstoreinf[i].storeid,
                            "skucode": getstoreinf[i].skucode,
                            "product_name": getstoreinf[i].product_name,
                            "product_des": getstoreinf[i].product_des,
                            "epc": getstoreinf[i].epc,
                            "item_code": getstoreinf[i].item_code,
                            "last_detected_time": getstoreinf[i].last_detected_time,
                            "user": getstoreinf[i].user,
                            "zone": getstoreinf[i].zone,


                            "departmentid": getstoreinf[i].departmentid,
                            "brand": getstoreinf[i].brand,
                            "color": getstoreinf[i].color,
                            "size": getstoreinf[i].size,
                            "sfsr": getstoreinf[i].sfsr,
                            "status": getstoreinf[i].status,
                            "group_name": getstoreinf[i].group_name,
                            "group_description": getstoreinf[i].group_description,


                            "dept": getstoreinf[i].dept,
                            "departmentname": getstoreinf[i].departmentname,
                            "brand_description": getstoreinf[i].brand_description,
                            "barcode": getstoreinf[i].barcode,
                            "model": getstoreinf[i].model,
                            "subgroup": getstoreinf[i].subgroup,
                            "sgroup": getstoreinf[i].sgroup,
                            "ean_no": getstoreinf[i].ean_no,


                            "sp_net": getstoreinf[i].sp_net,
                            "season": getstoreinf[i].season,
                            "vat": getstoreinf[i].vat,
                            "sales_area": getstoreinf[i].sales_area,
                            "sp_gross_eng": getstoreinf[i].sp_gross_eng,
                            "sp_gross_arb": getstoreinf[i].sp_gross_arb,
                            "supplier_item_no": getstoreinf[i].supplier_item_no,
                            "supplier_name": getstoreinf[i].supplier_name,


                            "type_no": getstoreinf[i].type_no,
                            "arabic_desc": getstoreinf[i].arabic_desc,
                            "origin": getstoreinf[i].origin,
                            "english_desc": getstoreinf[i].english_desc,
                            "company": getstoreinf[i].company,
                            "currency": getstoreinf[i].currency,
                            "cost": getstoreinf[i].cost,
                            "image_url": getstoreinf[i].image_url,

                            "country": getstoreinf[i].country,
                            "supplier_no": getstoreinf[i].supplier_no,
                            "po_supplier_no": getstoreinf[i].po_supplier_no,

 
                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '247-EpcReport');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '253-EpcReport');
            res.end(JSON.stringify(error));
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '329-epc_report  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '336-epc_report  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/epc_report', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('epc_report');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and epc like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            //console.log(chekc);
            cond += ' AND date like "%' + datenow + '%" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND store_id="' + req.body.store_id + '" '
        }

        if (req.body.epc != "" && req.body.epc != 0 && req.body.epc != "0") {

            cond += ' AND epc="' + req.body.epc + '" '
        }



        //if(mysql.check_permission('epc_report', session.user_permission)) {

        var new_query = "SELECT * FROM `epc_detail` " +
            "where 1 " + search_cond + " " + cond +
            "GROUP BY epc" + order_by_cond;


        var query_count = " select count(*) as `my_count` " +
            "from (SELECT * from epc_detail " +
            " where 1 " + search_cond + " " + cond +
            " GROUP BY epc) sq ";


        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;
                    //console.log(gettop20our)
                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {

                        var row_data = {
                            "date": getstoreinf[i].date,
                            "store_id": getstoreinf[i].store_id,
                            "epc": getstoreinf[i].epc,
                            "item_code": getstoreinf[i].item_code,
                            "zone": getstoreinf[i].zone,
                            "department": getstoreinf[i].department,
                            "brand": unescape(getstoreinf[i].brand),
                            "color": getstoreinf[i].color,
                            "size": getstoreinf[i].size,

                            "action": '<button type="button" epc=' + getstoreinf[i].epc + ' class="btn epc_detail btn-default"  style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">View</button> ',

                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '247-EpcReport');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '253-EpcReport');
            res.end(JSON.stringify(error));
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '329-epc_report  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '336-epc_report  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/epc_report_details', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('epc_report_details');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;



        if (order_col == 0 || order_col == 1 || order_col == 2) {

            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and epc like '%" + req.body.search['value'] + "%'";
        }



        if (req.body.Date != "" && req.body.Date != 0 && req.body.Date != "0") {
            var datenow = req.body.Date;
            //console.log(chekc);
            cond += ' AND date like "%' + datenow + '%" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND store_id="' + req.body.store_id + '" '
        }

        if (req.body.epc != "" && req.body.epc != 0 && req.body.epc != "0") {

            cond += ' AND epc="' + req.body.epc + '" '
        }



        // if(mysql.check_permission('epc_report', session.user_permission)) {

        var new_query = "SELECT * FROM `epc_detail` " +
            "where 1 " + search_cond + " " + cond + " " + order_by_cond;
        //console.log("++++++++++++++" + new_query);

        var query_count = " select count(*) as `my_count` " +
            "from (SELECT * from epc_detail " +
            " where 1 " + search_cond + " " + cond + ") sq ";
        //console.log("ssssssssssss"+query_count);    


        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;

            mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;
                    //console.log(gettop20our)
                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {

                        var row_data = {
                            "date": getstoreinf[i].date,
                            "store_id": getstoreinf[i].store_id,
                            "epc": getstoreinf[i].epc,
                            "item_code": getstoreinf[i].item_code,
                            "zone": getstoreinf[i].zone,
                            "department": getstoreinf[i].department,
                            "brand": unescape(getstoreinf[i].brand),
                            "color": getstoreinf[i].color,
                            "size": getstoreinf[i].size,
                            "action": getstoreinf[i].action_done,
                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '349-EpcReportDetails');
                    res.end(JSON.stringify(error));
                });
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '353-EpcReportDetails');
            res.end(JSON.stringify(error));
        });
        // }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '446-epc_report_details  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '453-epc_report_details  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/epcReportFilter', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('epcReportFilter');
    try {
        var session = req.session;
        var new_query = "SELECT store_id FROM epc_detail " +
            "WHERE store_id<>'undefined' " +
            " GROUP BY store_id order by id DESC";
        mysql.queryCustom(new_query)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(error), '371-epcReportFilter');
                    res.end(JSON.stringify(error));
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '376-epcReportFilter');
                res.end(JSON.stringify(error));
            });
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '484-epcReportFilter  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '491-epcReportFilter  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/CriticalOutOfStocksummarypercentage', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CriticalOutOfStocksummarypercentage');
    try {
        var session = req.session;
        var cond = '';
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
        // console.log(req.body);
        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND SC.brand_name ="' + req.body.bid + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }


        if (mysql.check_permission('executiveSummary', session.user_permission)) {

            var new_query = "SELECT " +
                "ABS(ROUND((('" + req.body.criticalper + "' / '" + req.body.onehand + "')*100 ),2)) AS criticalperentage " +
                " FROM `" + stock_count_tb + "` SC " +
                " where  1 and counted = 0 " + cond


            mysql.queryCustom(new_query).then(function(result) {
                //console.log(result)
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {

                    console2.log('Error', JSON.stringify(result.error), '414-CriticalOutOfStocksummarypercentage');
                    res.end(JSON.stringify(result.error));
                    // res.end(result.error);
                }
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '420-CriticalOutOfStocksummarypercentage');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '557-CriticalOutOfStocksummarypercentage  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '546-CriticalOutOfStocksummarypercentage  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



router.post('/CriticalOutOfStockDashobard', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CriticalOutOfStockDashobard');
    try {
        var session = req.session;
        var cond = '';
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

        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }

        // console.log(req.body);

        if (mysql.check_permission('dashboard_home', session.user_permission) || mysql.check_permission('dashboard', session.user_permission)) {

            var new_query = "SELECT count(*) AS CriticalStock FROM `" + stock_count_tb + "` SC " +
                " where 1 and counted = 0 " + cond;

            //console.log(">>>>>>>>>>>>>>>>>" + new_query);
            mysql.queryCustom(new_query)


                .then(function(result) {
                    //console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(error), '457-CriticalOutOfStockDashobard');
                        res.end(JSON.stringify(error));
                        // res.end(result.error);
                    }
                })
                .catch(function(error) {

                    console2.log('Error', JSON.stringify(error), '461-CriticalOutOfStockDashobard');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '628-CriticalOutOfStockDashobard  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '635-CriticalOutOfStockDashobard  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});
router.post('/TotalDevicesHandheldDevices', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('TotalDevicesHandheldDevices');
    try {
        var session = req.session;
        var cond = '';
        // console.log(req.body);

        if (mysql.check_permission('dashboard', session.user_permission)) {

            if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0" && req.body.storeid != undefined) {
                cond += ' AND HD.storeid="' + req.body.storeid + '" '
            }

            var new_query = "SELECT count(*) AS total_handheld_devices FROM `handheld_devices` HD" +
                " where 1 " + cond;

            mysql.queryCustom(new_query)
                .then(function(result) {
                    //console.log(result)
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '491-TotalDevicesHandheldDevices');
                        res.end(JSON.stringify(result.error));
                        //res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '497-TotalDevicesHandheldDevices');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '677-TotalDevicesHandheldDevices  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '684-TotalDevicesHandheldDevices  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/OnHandMatchingDetails', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('OnHandMatchingDetails');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';


        var limit_cond = ' limit 0,25 ';
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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and SC.unexpected like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND SC.brand_name="' + req.body.bid + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND SC.storeid="' + req.body.storeid + '" '
        }



        var new_query = "SELECT " +
            " SC.code as code," +
            " SC.initial as initial, " +
            " SC.counted as counted," +
            " SC.unexpected as unexpected," +
            " SC.missing as missing, " +
            " SC.expected as expected," +
            " SC.brand_name as brand," +
            " SC.color as color," +
            " SC.size as size," +
            " SC.departmentid as departmentname " +
            " FROM " + stock_count_tb + " SC " +
            " " +
            " WHERE 1 AND missing='0' " + cond + search_cond + " " + order_by_cond;


        var query_count = " select count(*) as `my_count` from (SELECT code,initial,counted," +
            "unexpected,missing,expected FROM " + stock_count_tb + " SC " +
            "  WHERE 1 AND missing='0' " + cond + search_cond + ") sq ";

        //console.log("sdddddddddd"+query_count);

        //abdulrehmanijaz
        if (mysql.check_permission('executiveSummary', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;


                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "code": getstoreinf[i].code,
                                "departmentname": getstoreinf[i].departmentname,
                                "brand": unescape(getstoreinf[i].brand),
                                "color": getstoreinf[i].color,
                                "size": getstoreinf[i].size,
                                "initial": getstoreinf[i].initial,
                                "counted": getstoreinf[i].counted,
                                "overs": getstoreinf[i].unexpected,

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '604-OnHandMatchingDetails');
                        res.end(JSON.stringify(error));
                        //res.end(error);
                    })
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '610-OnHandMatchingDetails');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '818-OnHandMatchingDetails  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '825-OnHandMatchingDetails  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});





//OneHandSimple
router.post('/OneHandSimple', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('OneHandSimple');
    try {
        //var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

        var limit_cond = ' limit 0,25 ';
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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and unexpected like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND SC.departmentid="' + escape(req.body.dptid) + '" '
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
        var new_query = '';
        var query_count = '';



        if(show_over == "yes"){

            new_query = "SELECT " +
            " SC.code as code," +
            " SC.initial as initial, " +
            " SC.counted as counted," +
            " SC.unexpected as unexpected," +
            " SC.missing as missing, " +
            " SC.expected as expected," +
            " SC.brand_name as brand," +
            " SC.color as color," +
            " SC.size as size," +
            " SC.departmentid as departmentname " +
            " FROM " + stock_count_tb + " SC " +
            "  " +
            " WHERE 1 " + cond + search_cond + " " + order_by_cond;


            query_count = " select count(*) as `my_count` from" +
                " (SELECT SC.code,SC.initial,SC.counted,SC.unexpected," +
                " SC.missing,SC.expected " +
                " FROM " + stock_count_tb + " SC  " +
                " WHERE 1 " + cond + search_cond + ") sq ";


        }else{


            new_query = "SELECT " +
            " SC.code as code," +
            " SC.initial as initial, " +
            " SC.counted as counted," +
            " SC.unexpected as unexpected," +
            " SC.missing as missing, " +
            " SC.expected as expected," +
            " SC.brand_name as brand," +
            " SC.color as color," +
            " SC.size as size," +
            " SC.departmentid as departmentname " +
            " FROM " + stock_count_tb + " SC " +
            "  " +
            " WHERE 1 and initial<>0 " + cond + search_cond + " " + order_by_cond;

        

            query_count = " select count(*) as `my_count` from" +
                " (SELECT SC.code,SC.initial,SC.counted,SC.unexpected," +
                " SC.missing,SC.expected " +
                " FROM " + stock_count_tb + " SC  " +
                " WHERE 1 and initial<>0 " + cond + search_cond + ") sq ";
        }

       
        //console.log(new_query)


        //abdulrehmanijaz
        // if (mysql.check_permission('executiveSummary', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;


                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "code": getstoreinf[i].code,
                                "departmentname": getstoreinf[i].departmentname,
                                "brand": unescape(getstoreinf[i].brand),
                                "color": getstoreinf[i].color,
                                "size": getstoreinf[i].size,
                                "initial": getstoreinf[i].initial,
                                "counted": getstoreinf[i].counted,
                                "overs": getstoreinf[i].unexpected,

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {

                        console2.log('Error', JSON.stringify(error), '720-OneHandSimple');
                        res.end(JSON.stringify(error));
                        //res.end(error);
                    })
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '726-OneHandSimple');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        // }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '961-OneHandSimple  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '968-OneHandSimple  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//BackStoreData
router.post('/BackStoreData', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('BackStoreData');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';


        var limit_cond = ' limit 0,25 ';
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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and unexpected like '%" + req.body.search['value'] + "%'";
        }


        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND department="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND brand="' + escape(req.body.bid) + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND date="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND store_id="' + req.body.storeid + '" '
        }



        var new_query = "SELECT * FROM `epc_detail` a " +
            " where date='" + req.body.date + "' " +
            " and action_done='CycleCount' and zone ='stockroom'  " +
            " and store_id='" + req.body.storeid + "'  " + cond +
            " and item_code in(select code from " + stock_count_tb + " where store_id='" + req.body.storeid + "'  and stockcountdate='" + req.body.date + "'  ) " +
            " GROUP by epc " + order_by_cond

        var query_count = "select count(*) as `my_count` from" + " (SELECT * FROM `epc_detail` a " +
            " where date='" + req.body.date + "' " +
            " and action_done='CycleCount' and zone ='stockroom'  " +
            " and store_id='" + req.body.storeid + "'  " + cond +
            " and item_code in(select code from " + stock_count_tb + " where store_id='" + req.body.storeid + "'  and stockcountdate='" + req.body.date + "'  ) " +
            " GROUP by epc ) sq"



        if (mysql.check_permission('executiveSummary', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;


                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "epc": getstoreinf[i].epc,
                                "item_code": getstoreinf[i].item_code,
                                "user": getstoreinf[i].user,
                                "zone": getstoreinf[i].zone,
                                "brand": unescape(getstoreinf[i].brand),
                                "color": getstoreinf[i].color,
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '824-BackStoreData');
                        res.end(JSON.stringify(error));
                        //res.end(error);
                    })
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '829-BackStoreData');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1092-BackStoreData  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1099-BackStoreData  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//CriticalOutOfStock
router.post('/CriticalOutOfStock', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CriticalOutOfStock');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';


        var limit_cond = ' limit 0,25 ';
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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and unexpected like '%" + req.body.search['value'] + "%'";
        }


        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND department="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND brand_name="' + escape(req.body.bid) + '" '
        }

        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0") {
            cond += ' AND stockcountdate="' + req.body.date + '" '
        }

        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0") {
            cond += ' AND storeid="' + req.body.storeid + '" '
        }

        var show_over="no";
        if (req.body.show_over =='yes' )
        {
            show_over="yes";
        }


        var new_query = '';
        var query_count = '';

        if(show_over == "yes"){

            new_query = "SELECT * FROM `" + stock_count_tb + "`  where 1 and counted = 0 " + cond + search_cond + " " + order_by_cond;
            // res.end('ssssssss'+new_query);
            query_count = " select count(*) as `my_count` from" +
                " (SELECT * FROM `" + stock_count_tb + "` where 1 and counted = 0 " + cond + search_cond + ") sq ";

        }else{

            new_query = "SELECT * FROM `" + stock_count_tb + "`  where 1 and initial<>0 and counted = 0 " + cond + search_cond + " " + order_by_cond;
            // res.end('ssssssss'+new_query);
            query_count = " select count(*) as `my_count` from" +
            " (SELECT * FROM `" + stock_count_tb + "` where 1  and  counted = 0 and initial<>0 " + cond + search_cond + ") sq ";

        }
        // console.log('sssssssssssssssssssssssss');
        // console.log(new_query)

        //abdulrehmanijaz
        if (mysql.check_permission('executiveSummary', session.user_permission) || mysql.check_permission('dashboard_home', session.user_permission)) {

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                    getstoreinf = result.results;


                    var table_data = [];
                    for (var i = 0; i < getstoreinf.length; i++) {

                        var row_data = {
                            "code": getstoreinf[i].code,
                            "departmentid": getstoreinf[i].departmentid,
                            "brand_name": unescape(getstoreinf[i].brand_name),
                            "color": getstoreinf[i].color,
                            "size": getstoreinf[i].size,

                            "initial": getstoreinf[i].initial,
                            "counted": getstoreinf[i].counted,
                            "unexpected": getstoreinf[i].unexpected,

                            "missing": getstoreinf[i].missing,
                            "season": getstoreinf[i].season,
                            "suppliername": unescape(getstoreinf[i].suppliername),
                            "price": getstoreinf[i].price,

                            "totalprice":getstoreinf[i].price,

                        };


                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '925-CriticalOutOfStock');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                })
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '931-CriticalOutOfStock');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1222-CriticalOutOfStock  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1229-CriticalOutOfStock  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//FrontStoreData
router.post('/FrontStoreData', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('FrontStoreData');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';


        var limit_cond = ' limit 0,25 ';
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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and unexpected like '%" + req.body.search['value'] + "%'";
        }


        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0) {
            cond += ' AND department="' + req.body.dptid + '" '
        }
        //console.log(req.body.dptid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0") {
            cond += ' AND brand="' + escape(req.body.bid) + '" '
        }

        var show_over="no";
        if (req.body.show_over =='yes' )
        {
            show_over="yes";
        }

        var new_query = "SELECT * FROM `epc_detail` a " +
            " where date='" + req.body.date + "' " +
            " and action_done='CycleCount' and zone ='salesfloor'  " +
            " and store_id='" + req.body.storeid + "'  " + cond +
            " and item_code in(select code from " + stock_count_tb + " where store_id='" + req.body.storeid + "' "+ 
            " and stockcountdate='" + req.body.date + "') " +
            " GROUP by epc " + order_by_cond
        // console.log('s'+new_query);
        var query_count = "select count(*) as `my_count` from" + " (SELECT * FROM `epc_detail` a " +
            " where date='" + req.body.date + "' " +
            " and action_done='CycleCount' and zone ='salesfloor'  " +
            " and store_id='" + req.body.storeid + "'  " + cond +
            " and item_code in(select code from " + stock_count_tb + " where store_id='" + req.body.storeid + "'  and stockcountdate='" + req.body.date + "'  ) " +
            " GROUP by epc ) sq"

        //console.log(query_count);

        if (mysql.check_permission('executiveSummary', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;


                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "epc": getstoreinf[i].epc,
                                "item_code": getstoreinf[i].item_code,
                                "user": getstoreinf[i].user,
                                "zone": getstoreinf[i].zone,
                                "brand": unescape(getstoreinf[i].brand),
                                "color": getstoreinf[i].color,
                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1022-FrontStoreData');
                        res.end(JSON.stringify(error));
                        //res.end(error);
                    })
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1028-FrontStoreData');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1346-FrontStoreData  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1353-FrontStoreData  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//CountExecutiveSummary
router.post('/CountExecutiveSummary', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CountExecutiveSummary');
    try {
        var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';

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


        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;

        //console.log(order_col);

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }


        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " and unexpected like '%" + req.body.search['value'] + "%'";
        }

        if (req.body.dptid != "" && req.body.dptid != "0" && req.body.dptid != 0 && req.body.dptid != undefined) {
            cond += ' AND department="' + (req.body.dptid) + '" '
        }
        // console.log(req.body.bid)
        if (req.body.bid != "" && req.body.bid != 0 && req.body.bid != "0" && req.body.bid != undefined) {
            cond += ' AND brand="' + escape(req.body.bid) + '" '
        }
        if (req.body.date != "" && req.body.date != 0 && req.body.date != "0" && req.body.date != undefined) {
            cond += ' AND date="' + req.body.date + '" '
        }
        if (req.body.storeid != "" && req.body.storeid != 0 && req.body.storeid != "0" && req.body.storeid != undefined) {
            cond += ' AND store_id="' + req.body.storeid + '" '
        }
        // var new_query = "SELECT * "+  
        // " FROM epc_detail WHERE 1  "+cond + search_cond + " " + order_by_cond;

        var new_query = 

        "SELECT a.* FROM `epc_detail` a "

            +
            " where date='" + req.body.date + "' and action_done='CycleCount' and store_id='" + req.body.storeid + "' " + cond +
            "  " +
            " GROUP by epc " + order_by;
        // console.log(new_query);
        // res.end(new_query);
        ///res.end('ssssssss'+new_query); 

        var query_count = " select count(*) as `my_count` from" +
            " (SELECT a.* FROM `epc_detail` a "

            +
            " where date='" + req.body.date + "' and action_done='CycleCount' and store_id='" + req.body.storeid + "' " + cond +
            "  " +
            " GROUP by epc ) sq ";
        // res.end(new_query);

        //abdulrehmanijaz
        if (mysql.check_permission('executiveSummary', session.user_permission)) {
            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                mysql.queryCustom(new_query + limit_cond).then(function(result) {

                        getstoreinf = result.results;


                        var table_data = [];
                        for (var i = 0; i < getstoreinf.length; i++) {

                            var row_data = {
                                "epc": getstoreinf[i].epc,
                                "item_code": getstoreinf[i].item_code,
                                "user": getstoreinf[i].user,
                                "zone": getstoreinf[i].zone,
                                "brand": unescape(getstoreinf[i].brand),
                                "color": getstoreinf[i].color,
                                "season":'',
                                "supplier_name":'',
                                "price":'',
                                "total_price":'',

                            };


                            table_data.push(row_data);
                        }

                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');
                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1127-CountExecutiveSummary');
                        res.end(JSON.stringify(error));
                        //res.end(error);
                    })
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1133-CountExecutiveSummary');
                res.end(JSON.stringify(error));
                // res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1482-CountExecutiveSummary  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1489-CountExecutiveSummary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});



//logouttttttttttttttttttttttt
router.get('/logout', (req, res, next) => {
    console2.execution_info('logout');
    try {
        var session = req.session;
        res.clearCookie("username");
        res.clearCookie("password");
        res.clearCookie("Rememberme");
        res.clearCookie("ORG_NAME");
        req.session.destroy(function(err) {

            return res.redirect(process.env.SITE_LINK + '/login');
        })
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1512-logout  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1519-CountExecutiveSummary  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Realtime Discrepancy
router.post('/RealtimeDiscrepancy12', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('RealtimeDiscrepancy12');
    var session = req.session;
    try {
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        //console.log(req.body.order[0].dir);
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " AND (SC.code like '%" + req.body.search['value'] + "%') ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }
        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        } else {
            cond += ' AND SC.storeid="000"'
        }

        //console.log(req.body.search['value'])
        if (mysql.check_permission('stockSummary', session.user_permission)) {

            var RealtimeDiscrepancySum = '';

            var new_query_sum = "SELECT ABS(SUM(SC.missing)) AS remaining," +
                " SUM(SC.initial) AS expected," +
                " SUM(SC.counted) AS counted,SUM(SC.counted_sf) AS countedsf," +
                " SUM(SC.counted_sr) AS countedsr " +
                " FROM " + stock_count_tb + " SC " +
                " WHERE 1 and SC.departmentid<> 'null' " + cond + " "

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.."+new_query_sum);

            mysql.queryCustom(new_query_sum).then(function(result) {

                if (result.status == "1") {
                    RealtimeDiscrepancySum = JSON.stringify(result.results);
                } else {
                    console2.log('Error', JSON.stringify(result.error), '1201-RealtimeDiscrepancySum');
                    res.end(result.error);
                }


                var new_query = "SELECT SC.code AS skucode, " +
                    " SC.departmentid as departmentname ," +
                    " SC.brand_name AS brandname, " +
                    " SC.size AS size,SC.color AS color, " +

                    " SC.counted - SC.initial AS remaining," +

                    " SC.initial AS expected," +
                    " SC.counted,SC.counted_sf AS countedsf,  SC.counted_sr AS countedsr " +

                    " FROM " + stock_count_tb + " SC " +

                    " WHERE 1 and SC.departmentid<> 'null' " + cond + " " +

                    " GROUP BY SC.code " + search_cond +

                    " ORDER BY skucode desc " + order_by_cond

                var query_count = "select count(*) as `my_count` FROM " +
                    "(SELECT SC.code AS skucode,SC.brand_name AS brandname, " +
                    " SC.size AS size,SC.color AS color, SC.missing AS remaining," +
                    " SC.initial AS expected," +
                    " SC.counted,SC.counted_sf AS countedsf,SC.counted_sr AS countedsr " +

                    " FROM " + stock_count_tb + " SC " +

                    "  WHERE 1 and SC.departmentid<> 'null' " + cond + " " +

                    " GROUP BY SC.code " + search_cond + ") sq";

                //console.log("Realttissssssssssssssssssme"+new_query)

                mysql.queryCustom(query_count).then(function(result) {
                    total_rec = result.results[0].my_count;

                    mysql.queryCustom(new_query + limit_cond).then(function(result) {
                            Realtimedisc = result.results;

                            var table_data = [];
                            // console.log(Realtimedisc.length);
                            if (Realtimedisc.length > 0) {
                                for (var i = 0; i < Realtimedisc.length; i++) {

                                    var row_data = {
                                        "realtimesum": RealtimeDiscrepancySum,
                                        "skucode": Realtimedisc[i].skucode,
                                        "departmentname": Realtimedisc[i].departmentname,
                                        "brandname": unescape(Realtimedisc[i].brandname),
                                        "size": Realtimedisc[i].size,
                                        "color": Realtimedisc[i].color,
                                        "remaining": Realtimedisc[i].remaining,
                                        "expected": Realtimedisc[i].expected,
                                        "counted": Realtimedisc[i].counted,
                                        "countedsf": Realtimedisc[i].countedsf,
                                        "countedsr": Realtimedisc[i].countedsr,
                                    };

                                    table_data.push(row_data);
                                }
                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                            } else {

                                // console.log('dddd');
                                var row_data = {
                                    "realtimesum": RealtimeDiscrepancySum,
                                    "skucode": "",
                                    "departmentname": "",
                                    "brandname": "",
                                    "size": "",
                                    "color": "",
                                    "remaining": "",
                                    "expected": "",
                                    "counted": "",
                                    "countedsf": "",
                                    "countedsr": "",
                                };

                                table_data.push(row_data);

                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                            }

                        })
                        .catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '1266-RealtimeDiscrepancy');
                            res.end(JSON.stringify(error));
                            //res.end(error);
                        });
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1271-RealtimeDiscrepancy');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1277-RealtimeDiscrepancy');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1701-RealtimeDiscrepancy  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1708-RealtimeDiscrepancy  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//RealtimeDiscrepancySum
router.post('/RealtimeDiscrepancySum', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('RealtimeDiscrepancySum');
    try {
        var session = req.session;

        if (mysql.check_permission('stockSummary', session.user_permission)) {
            var new_query = "SELECT ABS(SUM(SC.missing)) AS remaining," +
                " SUM(SC.expected) AS expected," +
                " SUM(SC.counted) AS counted,SUM(SC.counted_sf) AS countedsf," +
                " SUM(SC.counted_sr) AS countedsr " +
                " FROM stock_count SC WHERE 1"

            //console.log(new_query);

            mysql.queryCustom(new_query).then(function(result) {

                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {
                        console2.log('Error', JSON.stringify(error), '1303-RealtimeDiscrepancySum');
                        res.end(JSON.stringify(error));
                        //res.end(result.error);
                    }

                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1310-RealtimeDiscrepancySum');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });

        }
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1751-RealtimeDiscrepancySum  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1758-RealtimeDiscrepancySum  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//GetInventoryByItem
router.post('/GetInventoryByItem', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetInventoryByItem');
    try {
        //var session = req.session;
        var cond = '';
        var order_by_cond = '';
        var search_cond = '';
        var limit_cond = ' limit 0,25 ';
        var total_rec = '0';

        var order_col = req.body.order[0].column;
        var order_by = req.body.order[0].dir;
        console.log(req.body)

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 8) {
            order_by_cond = " ORDER BY " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
           
        }
        if (req.body.StoreID != "" && req.body.StoreID != 0 && req.body.StoreID != "0") {
            cond += ' AND PC.store_id="' + req.body.StoreID + '" '
        }else{
            cond += ' AND PC.store_id="000"';
        } 
        if (req.body.epc != "" && req.body.epc != 0 && req.body.epc != "0") {
            cond += ' AND PC.epc="' + req.body.epc + '" '
        }
        if (req.body.SKU != "" && req.body.SKU != 0 && req.body.SKU != "0") {
            cond += ' AND PC.item_code="' + req.body.SKU + '" '
        }
        if (req.body.DepartmentID != "" && req.body.DepartmentID != 0 && req.body.DepartmentID != "0" &&
            req.body.DepartmentID !== undefined) {
            cond += ' AND PC.department="' + req.body.DepartmentID + '" '
        }
        if (req.body.BrandID != "" && req.body.BrandID !== undefined) {

            cond += ' AND PC.brand = "' + req.body.BrandID+ '" '

        }
        if (req.body.Color != "" && req.body.Color != 0 && req.body.Color != "0") {
            cond += ' AND PC.color="' + req.body.Color + '" '
        }
        if (req.body.Size != "" && req.body.Size != 0 && req.body.Size != "0") {
            cond += ' AND PC.size="' + req.body.Size + '" '
        }
        //console.log(cond);
        //if (mysql.check_permission('inventorybyitem', session.user_permission)) {


            var new_query = " SELECT " +
                " PC.epc AS epc," +
                " PC.item_code AS sku," +
                " PC.brand AS brand_name," +
                " PC.color as color," +
                " PC.size as size," +
                " PC.zone AS zone," +
                " PC.store_id AS store_id," +
                " PC.status AS ItemDispostion" +
                " FROM epc PC  " +
                " WHERE 1 " +
                cond + " " + search_cond + order_by_cond;

           //console.log(new_query);

            var query_count = " SELECT "

                +
                " count(*) as my_count  " +
                " FROM ( select PC.epc AS epc,PC.item_code, PC.brand,PC.store_id AS store_id from epc PC  " +
            
                " WHERE 1 " +
                cond + " ) sq" + order_by_cond;
              

            mysql.queryCustom(query_count).then(function(result) {
                total_rec = result.results[0].my_count;

                //console.log(new_query);
                mysql.queryCustom(new_query + limit_cond).then(function(result2) {

                    //console.log(result2);
                    inventoryresult = result2.results;

                  

                    var table_data = [];

                    for (var i = 0; i < inventoryresult.length; i++) {
                        
                        var row_data = {

                            "epc": inventoryresult[i].epc,
                            "item_code": inventoryresult[i].sku,
                            "store_id": inventoryresult[i].store_id,
                         
                            "brand_name": unescape(inventoryresult[i].brand_name),

                            "color": inventoryresult[i].color,
                            "size": inventoryresult[i].size,
                          
                            "ItemDispostion": inventoryresult[i].ItemDispostion,
                            "action": '<button type="button" epc=' + inventoryresult[i].epc + ' class="btn epc_detail btn-default"  style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">View</button> ',
                        };

                        table_data.push(row_data);
                    }
                    //console.log(table_data);
                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1458-GetInventoryByItem');
                    res.end(JSON.stringify(error));
                });
            }).catch(function(error) {

                console2.log('Error', JSON.stringify(error), '1463-GetInventoryByItem');
                res.end(JSON.stringify(error));

            });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1890-GetInventoryByItem  inventoryData');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '1897-GetInventoryByItem  inventoryData');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//getusereditrecord
router.post('/GetEditRetailApi', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('GetEditRetailApi');
    try {
        var session = req.session;
        var query_new = "SELECT *  FROM retailapis" +
            " WHERE id= '" + req.body.edit_id + "'";
        //console.log("----sssss--------"+query_new);
        mysql.queryCustom(query_new)
            .then(function(result) {
                if (result.status == "1") {
                    res.end(JSON.stringify(result.results));
                } else {
                    console2.log('Error', JSON.stringify(result.error), '1918-GetEditRetailApi');
                    res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', JSON.stringify(error), '1923-GetEditRetailApi');
                res.end(error);
            });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '1927-GetEditRetailApi');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '1934-GetEditRetailApi');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/GetApiRetails', authenticationMidleware(), (req, res, next) => {

    console2.execution_info('GetApiRetails');
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

        if (req.body.request_name != "" && req.body.request_name != 0 && req.body.request_name != "0") {
            cond += ' AND request_name="' + req.body.request_name + '" '
        }

        if (req.body.envoirment != "" && req.body.envoirment != 0 && req.body.envoirment != "0") {
            cond += ' AND envoirment="' + req.body.envoirment + '"'
        }

        //if (mysql.check_permission('usersinfo', session.user_permission)) {

        var new_query = "SELECT " +
            " * FROM retailapis" +
            " WHERE 1 " + cond + search_cond + " " + order_by_cond;

        // console.log("++++-------"+new_query)

        var query_count = " select count(*) as `my_count` from (SELECT * FROM retailapis  " +
            " WHERE 1 " + cond + search_cond + ") sq ";

        mysql.queryCustom(query_count).then(function(result) {
            total_rec = result.results[0].my_count;


            mysql.queryCustom(new_query + limit_cond).then(function(result) {


                    getstoreinf = result.results;



                    var table_data = [];

                    var permission = ''

                    for (var i = 0; i < getstoreinf.length; i++) {


                        var row_data = {
                            "id": getstoreinf[i].id,
                            "request_name": getstoreinf[i].request_name,
                            "envoirment": getstoreinf[i].envoirment,
                            "endpoint": getstoreinf[i].endpoint,
                            "server_protocol": getstoreinf[i].server_protocol,
                            "payload": getstoreinf[i].payload,
                            'action': `<button type="button" edit_id=` + getstoreinf[i].id + ` class="btn RetialEdit btn-default" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Edit</button>  | 
                                <button type="button" del_id=` + getstoreinf[i].id + ` class="btn btn-default deleteRecord" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Delete</button> | 
                                <button type="button" Run_id=` + getstoreinf[i].id + ` class="btn btn-default Run" style="color:#fff;border-color:#fff;border-radius:0px;background:transparent">Run</button>`
                        };

                        table_data.push(row_data);
                    }

                    res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                })
                .catch(function(error) {

                    console2.log('Error', JSON.stringify(error), '2010-GetApiRetails');
                    res.end(error);
                    //res.end(error);
                });
        }).catch(function(error) {

            console2.log('Error', JSON.stringify(error), '2016-GetApiRetails');
            res.end(error);
            //res.end(error);
        });
        //}
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2022-GetApiRetails');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2029-GetApiRetails');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//authenticationMidleware(),
router.post('/stockSummaryReport_zero', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('stockSummaryReport_zero');
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
        } else {
            cond += ' AND SC.storeid="000"'
        }


        if (mysql.check_permission('stockSummary_initial', session.user_permission)) {

            var totalrecord = '';

            var sumQuery = "SELECT ROUND(((SUM(SC.initial)-ABS(SUM(SC.unexpected)))*100/SUM(SC.initial)),2) " +
                "AS uiasum," +
                "SUM(initial) AS expectedsum, ABS(SUM(unexpected)) AS unexpectedsum, " +
                "SUM(counted) AS countedsum,ABS(SUM(missing)) AS missingsum, " +
                "SUM(expected_sf) AS expectedsfsum,SUM(expected_sr) AS expectedsrsum, " +
                "SUM(counted_sf) AS countedsfsum,SUM(counted_sr) AS countedsrsum,SUM(scanned)" +
                " AS scannedsum  from " + stock_count_tb + " SC " +
                "where 1 AND SC.initial <> '0' " + cond + " "
            //console.log("<<<<<<<<<<<"+sumQuery);

            mysql.queryCustom(sumQuery).then(function(result) {
                totalrecord = JSON.stringify(result.results);

                //console.log('sssstotalrecord'+totalrecord);
                var query_new = "SELECT SC.code AS SKU_code,SC.storeid, " +
                    " SC.departmentid as departmentname22, " +

                    "SC.brand_name AS brandname,SC.size AS size,SC.color AS color, " +
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
                    " WHERE 1 AND SC.initial <> '0' " + cond + " " + search_cond + "  " +
                    " GROUP BY SC.departmentid " + order_by_cond;
                //     console.log('ssssssssssssss')
                //console.log("++++++++++++++++" + query_new);

                var query_count = " select count(*) as `my_count` from ( SELECT SC.storeid,SC.departmentid," +
                    " SC.brand_name AS brandname,SC.size AS size,SC.color AS color, " +
                    " SC.missing AS remaining,SC.initial AS expected," +
                    " SC.counted,SC.counted_sf AS countedsf, " +
                    " SC.counted_sr AS countedsr " +
                    " FROM " + stock_count_tb + " SC " +
                    " WHERE 1 AND SC.initial <> '0' " + cond + " " + search_cond + "  " +
                    " GROUP BY SC.departmentid ) sq ";

                //abdulrehmanijaz
                // console.log("====>>>>>>>>>>>"+query_count);


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
                                    "date": '',
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
                            console2.log('Error', JSON.stringify(error), '1653-stockSummaryReport_zero');
                            res.end(error);
                        })
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '1657-stockSummaryReport_zero');
                    res.end(error);
                });
                //console.log(totalrecord);

            })
        }

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2245-stockSummaryReport_zero');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2252-stockSummaryReport_zero');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }


});


//Stock Count Graph data
router.post('/getStockCountData_zero', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('getStockCountData_zero');
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
        } else {
            cond += ' AND SC.storeid="000"'
        }

        if (mysql.check_permission('stockSummary_initial', session.user_permission)) {

            var new_query = " SELECT SC.departmentid AS department," +
                " SUM(SC.initial) AS expected, " +
                " SUM(SC.unexpected) AS unexpected, " +
                " ( SUM(SC.initial) -  SUM(SC.missing) ) AS counted, " +
                " SUM(SC.missing) AS missing " +
                " FROM " + stock_count_tb + " SC  " +

                " WHERE 1 AND SC.initial<>'0' " + cond + "  GROUP by SC.departmentid ";
            //console.log("new_query"+new_query);    
            //zeeshan


            mysql.queryCustom(new_query)
                .then(function(result) {
                    if (result.status == "1") {
                        res.end(JSON.stringify(result.results));
                    } else {

                        console2.log('Error', JSON.stringify(result.error), '6835-getStockCountData_zero');
                        res.end(result.error);
                    }
                })
                .catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '6835-getStockCountData_zero');
                    res.end(error);
                });
        }

    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2022-getStockCountData_zero');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2029-getStockCountData_zero');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


//Get top 20 under
router.post('/gettop20under_zero', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('gettop20under_zero');
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
            search_cond = " and SC.brand_name like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }

        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        } else {
            cond += ' AND SC.storeid="000"'
        }


        if (mysql.check_permission('stockSummary_initial', session.user_permission)) {


            var Sum_new_query = "SELECT sum(SC.initial) AS sum_expected," +
                "sum(missing) AS sum_diff " +
                "FROM " + stock_count_tb + " SC WHERE 1 AND SC.initial<>'0' " + cond;

            mysql.queryCustom(Sum_new_query).then(function(sumresult) {

                totalrecord = JSON.stringify(sumresult.results);
                // console.log('totalrecordxx'+totalrecord);

                var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " (SC.initial) AS expected," +
                    " (missing) AS diff , " +
                    " round(ABS(((missing)/ (initial))*100),2) as diffper " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where missing <> 0  AND SC.initial<>'0' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond + "  LIMIT 20 ";

                //console.log("gettop20under================"+new_query);

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
                            };


                            table_data.push(row_data);
                        }


                        //res.end(JSON.stringify(result.results));
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');


                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1825-gettop20under_zero');
                        res.end(error);
                        //res.end(error);
                    });
            })
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2022-gettop20under_zero');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2029-gettop20under_zero');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Get top 20 over
router.post('/gettop20over_zero', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('gettop20over_zero');
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
            search_cond = " and SC.brand_name like '%" + req.body.search['value'] + "%' ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }
        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        } else {
            cond += ' AND SC.storeid="000"'
        }

        //sssssssssssss
        if (mysql.check_permission('stockSummary_initial', session.user_permission)) {

            var Sum_new_query = "SELECT sum(SC.initial) AS sum_expected," +
                "sum(unexpected) AS sum_diff " +
                "FROM " + stock_count_tb + " SC WHERE 1 AND SC.initial<>'0' " + cond;

            mysql.queryCustom(Sum_new_query).then(function(sumresult) {

                totalrecord = JSON.stringify(sumresult.results)

                var new_query = "SELECT" +
                    " SC.departmentid as departmentname, SC.code,SC.brand_name AS brandname," +
                    " SC.code as skucode ," +
                    " (SC.initial) AS expected," +
                    " (unexpected) AS diff , " +
                    " round(ABS(((unexpected)/ (initial))*100),2) as diffper " +
                    " FROM " + stock_count_tb + " SC " +
                    " " +
                    " where  unexpected <> 0   AND SC.initial<>'0' " + cond + " " + search_cond + "  " +
                    " order by diff desc " + order_by_cond + "  LIMIT 20 ";
                //and (initial < counted ) 
                //res.end(new_query);
                //console.log(new_query);

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
                            };


                            table_data.push(row_data);
                        }


                        //res.end(JSON.stringify(result.results));
                        res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                    })
                    .catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '1942-gettop20over_zero');
                        res.end(error);
                    });
            })

        } else {
            res.end("Not allowed");
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2022-gettop20over_zero');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2029-gettop20over_zero');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

//Realtime Discrepancy
router.post('/RealtimeDiscrepancy12_zero', authenticationMidleware(), (req, res, next) => {
    console2.execution_info('RealtimeDiscrepancy12_zero');
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

        if (order_col == 0 || order_col == 1 || order_col == 2 || order_col == 3 || order_col == 4 || order_col == 5 || order_col == 6 || order_col == 7 || order_col == 8 || order_col == 9) {
            order_by_cond = " , " + req.body.columns[order_col]['data'] + " " + order_by;
        }

        if (req.body.start != "" && req.body.length != "") {
            limit_cond = ' limit  ' + req.body.start + " , " + req.body.length;
        }

        if (req.body.search['value'] != "") {
            search_cond = " AND (SC.code like '%" + req.body.search['value'] + "%') ";
        }

        if (req.body.my_date != "" && req.body.my_date != 0 && req.body.my_date != "0") {
            cond += ' AND SC.stockcountdate="' + req.body.my_date + '" '
        }
        if (req.body.store_id != "" && req.body.store_id != 0 && req.body.store_id != "0") {
            cond += ' AND SC.storeid="' + req.body.store_id + '" '
        } else {
            cond += ' AND SC.storeid="000"'
        }

        //console.log(req.body.search['value'])
        if (mysql.check_permission('stockSummary_initial', session.user_permission)) {

            var RealtimeDiscrepancySum = '';

            var new_query_sum = "SELECT ABS(SUM(SC.missing)) AS remaining," +
                " SUM(SC.initial) AS expected," +
                " SUM(SC.counted) AS counted,SUM(SC.counted_sf) AS countedsf," +
                " SUM(SC.counted_sr) AS countedsr " +
                " FROM " + stock_count_tb + " SC " +
                " WHERE 1 AND SC.initial <>'0' " + cond + " "

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.."+new_query_sum);

            mysql.queryCustom(new_query_sum).then(function(result) {

                if (result.status == "1") {
                    RealtimeDiscrepancySum = JSON.stringify(result.results);
                } else {
                    console2.log('Error', JSON.stringify(result.error), '2008-RealtimeDiscrepancy12_zero');
                    res.end(result.error);
                }


                var new_query = "SELECT SC.code AS skucode, " +
                    " SC.departmentid as departmentname ," +
                    " SC.brand_name AS brandname, " +
                    " SC.size AS size,SC.color AS color, " +

                    " SC.counted - SC.initial AS remaining," +

                    " SC.initial AS expected," +
                    " SC.counted,SC.counted_sf AS countedsf,  SC.counted_sr AS countedsr " +

                    "FROM " + stock_count_tb + " SC " +

                    "  WHERE 1 AND SC.initial <>'0' " + cond + " " +

                    " GROUP BY SC.code " + search_cond +

                    "ORDER BY SC.code desc " + order_by_cond
                //console.log(new_query);    
                var query_count = "select count(*) as `my_count` FROM " +
                    "(SELECT SC.code AS skucode,SC.brand_name AS brandname, " +
                    " SC.size AS size,SC.color AS color, SC.missing AS remaining," +
                    " SC.initial AS expected," +
                    " SC.counted,SC.counted_sf AS countedsf,  SC.counted_sr AS countedsr " +

                    "FROM " + stock_count_tb + " SC " +

                    "  WHERE 1 AND SC.initial <>'0' " + cond + " " +

                    " GROUP BY SC.code " + search_cond + ") sq";

                //console.log("Realttissssssssssssssssssme"+new_query)

                mysql.queryCustom(query_count).then(function(result) {
                    total_rec = result.results[0].my_count;

                    mysql.queryCustom(new_query + limit_cond).then(function(result) {
                            Realtimedisc = result.results;

                            var table_data = [];
                            // console.log(Realtimedisc.length);
                            if (Realtimedisc.length > 0) {
                                for (var i = 0; i < Realtimedisc.length; i++) {

                                    var row_data = {
                                        "realtimesum": RealtimeDiscrepancySum,
                                        "skucode": Realtimedisc[i].skucode,
                                        "departmentname": Realtimedisc[i].departmentname,
                                        "brandname": unescape(Realtimedisc[i].brandname),
                                        "size": Realtimedisc[i].size,
                                        "color": Realtimedisc[i].color,
                                        "remaining": Realtimedisc[i].remaining,
                                        "expected": Realtimedisc[i].expected,
                                        "counted": Realtimedisc[i].counted,
                                        "countedsf": Realtimedisc[i].countedsf,
                                        "countedsr": Realtimedisc[i].countedsr,
                                    };

                                    table_data.push(row_data);
                                }
                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                            } else {

                                // console.log('dddd');
                                var row_data = {
                                    "realtimesum": RealtimeDiscrepancySum,
                                    "skucode": "",
                                    "departmentname": "",
                                    "brandname": "",
                                    "size": "",
                                    "color": "",
                                    "remaining": "",
                                    "expected": "",
                                    "counted": "",
                                    "countedsf": "",
                                    "countedsr": "",
                                };

                                table_data.push(row_data);

                                res.end('{"aaData":' + JSON.stringify(table_data) + ',"iTotalRecords":"' + total_rec + '","iTotalDisplayRecords":"' + total_rec + '"}');

                            }
                        })
                        .catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '2103-RealtimeDiscrepancy12_zero');
                            res.end(JSON.stringify(error));
                            //res.end(error);
                        });
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '2108-RealtimeDiscrepancy12_zero');
                    res.end(JSON.stringify(error));
                    //res.end(error);
                });
            }).catch(function(error) {
                console2.log('Error', JSON.stringify(error), '2113-RealtimeDiscrepancy12_zero');
                res.end(JSON.stringify(error));
                //res.end(error);
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '2022-RealtimeDiscrepancy12_zero');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection'+e, '2029-RealtimeDiscrepancy12_zero');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
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
        //if (req.isAuthenticated()) return next();
        //res.redirect('/login');
        return next();
    }
}
module.exports = router;
