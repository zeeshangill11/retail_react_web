var express = require("express");
var router = express.Router();
var passport = require("passport");
const mysql = require("../../../controllers/mysqlCluster.js");
const commonFunctions = require("../../../commonFunction.js");
var bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
var dateFormat = require("dateformat");
var response = {};
const request = require('request');
const console2 = require("../../../controllers/customconsole.js");
const aduit_Add = require("../../../controllers/custom_auditinfo.js");
var now = new Date();
const fs = require('fs');
var mysql2 = require("mysql");
const sku_parse = require("../../../controllers/epc-parser-fixed.js");
var cron = require('node-cron');
const nodemailer = require("nodemailer");
const lockfile = require('proper-lockfile');

/*let transport = nodemailer.createTransport({
    host: 'mail.innodaba.com',
    port: 587,
    auth: {
       user: 'saqib@innodaba.com',
       pass: 'pJqX^++j;c@u'
    },
    tls: {
        rejectUnauthorized: false
    }
});*/

let transport = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587,
    auth: {
       user: 'info@oxygensoft.net',
       pass: 'ZXcv@1234@C$$$'
    },
    tls: {
        rejectUnauthorized: false
    }
});


// If environment is not production,
// load environment config
if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}

var mainDBName2 = mysql.globals.mainDBName;
var DBNames = {};

var mysqlMain2 = mysql.mysqlMain;

var mysql_bak  = mysql.mysql_bak;

var access_token = mysql.globals.access_token;


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

router.post('/get_iot_soh_check',(req, res, next) => {
    console2.execution_info('get_iot_soh_check');
    console.log('SOH check Manual')
    soh_empty_check_iot(res)
});

router.post('/get_iot_goods_store_check',(req, res, next) => {
    console2.execution_info('get_iot_goods_store_check');
    console.log('Goods check Manual')
    get_goods_store_iot_check(res)
});


router.post('/get_iot_ibt_store_check',(req, res, next) => {
    console2.execution_info('get_iot_ibt_store_check');
    console.log('ibt check Manual')
    get_ibt_iot_check(res)
});

router.get('/getSOHCheck22', (req, res, next) => {
    console2.execution_info('getSOHCheck22');
    console.log('getSOHCheck22 Manual')
    get_soh_summary_report();
    res.end("ok");
})

router.post('/CronJobRun30', (req, res, next) => {
    console2.execution_info('CronJobRun30');
    console.log('Manual CronjobRuning 30 Sec.')
    epc_dump_thirty_sec();
    res.end('ok');
});

function update_payload(storename,date)
{
    return new Promise((resolve, reject) => {
        var body = {
            "StoreID": storename
        };
        var CheckDate = date;

        fetch(process.env.IOT_API_NEW + 'innovent/GETCOUNTEDITEMS', {
            method: 'post',
            body: JSON.stringify(body),
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
            if(error){
                console2.log('Error', JSON.stringify(error), '902-EpcDump API CycleCount json validation');   
            }
            
        })
        .then((json) => {
            //console.log(json);
            update_query = "UPDATE `soh_report` SET "+
                                " `recent_payload` = '"+escape(json)+"', "+ 
                                " `iot_total` = '"+json.total+"' "+ 
                                    " WHERE `store_name` = '"+storename+"' AND `soh_date` = '"+date+"';"
                
            mysql.queryCustom(update_query).then(function(result){
                var select_query = "select * from soh_report where `store_name` = '"+storename+"' AND soh_date = '"+date+"';"
                console.log(result);
                mysql.queryCustom(select_query).then(function(result1122){
                    var mail_result = result1122.results;
                    for(var m = 0;m<mail_result.length;m++){
                        if (mail_result[m].iot_total != mail_result[m].counted) {
                            run_cycle_count22(access_token,'n/a',mail_result[m].store_name,0);
                        }
                    }
                    resolve("1");
                }).catch(function(error) {
                    console.log(error);
                    resolve("2");
                });
            }).catch(function(error) {
                console.log(error);
                resolve("2");
            });
        }).catch(function(error) {
            console.log(error);
            resolve("2");
        });
    });
}

function get_soh_summary_report(){

    var now = new Date();
    var getstoreinf = '';
    var new_query_stock_store = '';
    var cond = '';
    
    var search_cond = '';

    var yesterday_Date = (new Date(Date.now() - 1 * 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
    var date = dateFormat(now, "yyyy-mm-dd");
    var  new_query = "SELECT * " +
    "  FROM tb_store where storename not in('0000405')";
    /*"  FROM tb_store WHERE `storename` = '0001130'";*/
    //console.log("yyyyyyyyyyyy");
    mysql.queryCustom(new_query)
        .then(function(result) {

        if (result.status == "1") {
            //console.log("tttttttttttttttttt");
            var getstoreinf = result.results;
            var new_query_stock_store = '';
            var storename = '';
            var new_query_stock_store_yesterdate = '';

            for (var i = 0; i < getstoreinf.length; i++) {

                storename = getstoreinf[i].storename;
                ;
                new_query_stock_store += "SELECT SUM(initial) AS onhandtotal , "+ 
                            " ROUND(ABS((SUM(counted)/SUM(initial) * 100)),2) AS item_accuracy," +
                            " SUM((counted)) AS inventroycount,'"+storename+"' as mystore "+ 
                            " from stock_count_"+getstoreinf[i].storename+" where 1  and stockcountdate = '"+date+"';"
            }

            mysql.queryCustom(new_query_stock_store).then(function(result22){ 
                //console.log(result22.results);
                //console.log("uuuuuuuuuuuuuuuuuuuuu");
                var total_results = result22.results;
                var insert_query = '';
                var insert_query_yesterday = '';
                var storename = '';
                var onhandtotal = '';
                var inventroycount = '';
                var item_accuracy = '';
                for(j=0;j<total_results.length;j++){

                    storename = total_results[j][0].mystore;
                    onhandtotal = total_results[j][0].onhandtotal;
                    inventroycount = total_results[j][0].inventroycount;
                    item_accuracy = total_results[j][0].item_accuracy;

                    if(onhandtotal == null){
                        onhandtotal = 0;
                    }else{
                        onhandtotal = total_results[j][0].onhandtotal;
                    }

                    if(inventroycount == null){
                       inventroycount = 0 ;
                    }else{
                        inventroycount = total_results[j][0].inventroycount;
                    }

                    if(item_accuracy == null){
                       item_accuracy = 0 ;
                    }else{
                        item_accuracy = total_results[j][0].item_accuracy;
                    }

                    insert_query = insert_query+"insert into soh_report set "+ 
                    " store_name='"+storename+"',"+  
                    " on_hand_matching='"+onhandtotal+"',"+ 
                    " item_accuracy='"+item_accuracy+"',"+ 
                    " counted='"+inventroycount+"',soh_date='"+date+"';"
                }
                
                var delete_query = "delete from soh_report where soh_date='"+date+"';"
                    mysql.queryCustom(delete_query).then(function(result){
                        mysql.queryCustom(insert_query).then(function(result){ 
                            //console.log("gggggggggggggg");
                            var select_query22 = "SELECT * FROM soh_report where soh_date= '"+date+"';"

                            mysql.queryCustom(select_query22).then(function(result233){ 

                                var total_results22 = result233.results;
                                var new_query_stock_store122 = '';
                                var storename22 = '';
                                var yesterday_Date = (new Date(Date.now() - 1 * 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
                                
                                if(total_results22.length>0){

                                    for(j=0;j<total_results22.length;j++){
                                

                                        storename22 = total_results22[j].store_name;
                            
                                        new_query_stock_store122 = new_query_stock_store122+"SELECT SUM(initial) AS onhandtotal , "+ 
                                                    " SUM((counted)) AS inventroycount,'"+storename22+"' as mystore "+ 
                                                    " from stock_count_"+storename22+" where 1  and stockcountdate = '"+yesterday_Date+"';"

                                        
                                    }

                                    //console.log(new_query_stock_store122)
                                    mysql.queryCustom(new_query_stock_store122).then(async function(result2923){ 

                                        var total_results255 = result2923.results;
                                        var update_query22 = '';
                                        if(total_results255.length>0){


                                            var onhandtotal33 = '';
                                            var storename = '';
                                            for(p=0;p<total_results255.length;p++){


                                                onhandtotal33 = total_results255[p][0].onhandtotal;
                                                               
                                                storename = total_results255[p][0].mystore;
                                                  console.log("---storename->>>>>"+storename);
                                                update_query22 = update_query22+"update soh_report set on_hand_matching_soh_yesterday = '"+onhandtotal33+"'"+
                                                " where store_name='"+storename+"' and soh_date = '"+date+"';"    

                                                await update_payload(storename,date);
                                            }

                                            mysql.queryCustom(update_query22).then(function(result293){ 
                                                setTimeout(function(){
                                                var select_query = "select * from soh_report where soh_date = '"+date+"';"
                                                mysql.queryCustom(select_query).then(function(result1122){

                                                    var mail_result = result1122.results;
                                                    var table=''    
                                                        table += '<table border=1 style="text-align:center">  <thead> <tr> <th>ID</th> <th>Store Name</th> '+ 
                                                        ' <th>On OnHandMatching yesterday Soh </th> <th>On HandMatching</th> <th>Counted</th> <th>IOT total</th> <th>Date</th> <th>Item Accuracy</th></tr></thead> <tbody> ' 
                                                    for(var m = 0;m<mail_result.length;m++){
                                                        //console.log(mail_result[m])
                                                        table +='<tr rowspan="4"> ';
                                                        table +='<td>'+mail_result[m].id+'</td>'
                                                        table +='<td>'+mail_result[m].store_name+'</td>'
                                                        table +='<td>'+mail_result[m].on_hand_matching_soh_yesterday+'</td>'
                                                        table +='<td>'+mail_result[m].on_hand_matching+'</td>'
                                                        table +='<td>'+mail_result[m].counted+'</td>'
                                                        table +='<td>'+mail_result[m].iot_total+'</td>'
                                                        table +='<td>'+mail_result[m].soh_date+'</td>'
                                                        table +='<td>'+mail_result[m].item_accuracy+'%</td>'
                                                        table += '</tr>'
                                                    }
                                                    table +='</tbody>'
                                                    table += ' </table>';

                                                    var maillist = process.env.ALERT_EMAIL_1;
                                                    const message = {
                                                        from: 'saqib@innodaba.com', // Sender address
                                                        to: maillist, // List of recipients
                                                        subject: 'Soh Report ', // Subject line
                                                        html:table// Plain text body
                                                    };
                                                    transport.sendMail(message, function(err, info) {
                                                        if (err) {
                                                            console.log(err)
                                                        } else {
                                                            console.log(info);
                                                        }
                                                    });
                                                })
                                                }, 180000);
                                            }).catch(function(error) {
                                                console.log(error)
                                                console2.log('Error', error, '630-new_query_stock_store');
                                                
                                            }); 
                                        }
                                    }).catch(function(error) {
                                        console.log(error)
                                        console2.log('Error', error, '612-new_query_stock_store');
                                    });    
                                }
                            }).catch(function(error) {
                                console.log(error)
                                console2.log('Error', error, '611-new_query_stock_store');
                            });
                        }).catch(function(error) {
                            console.log(error)
                            console2.log('Error', error, '573-new_query_stock_store');
                        });
                    }).catch(function(error) {
                        console2.log('Error', error, '669-new_query_stock_store');
                    });
                }).catch(function(error) {
                    console2.log('Error', error, '66w12-new_query_stock_store');
                });

            //return false;    

        }
    });
}

function check_iot_ibt_status(var_ibt_id,var_portal_total){
    return new Promise((resolve, reject) => {

        var retail_id_1 = var_ibt_id;
        var portal_total_1 = var_portal_total;
        // console.log('ddddddddddddddddddd'+retail_id_1)
        // console.log('ddddddddddddddddddd'+portal_total_1)
        var body = {
            "ASN": retail_id_1,
            // "DestinationStoreID":total_epc[i].destinationStore,
            "Process": "receiving",
            "ProcessStatus": "closed"
        };
        //zeeshan need to change
        fetch(process.env.IOT_API_NEW + 'innovent/SUPPLYCHAINVERIFY', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'apikey': process.env.IOT_API_KEY,
                'Content-Type': 'application/json'
            },
        }).then(res => {
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return res.json();
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '81-check_iot_ibt_status API json validation');
        }).then((json) => {

            var total_results = json.total;
            //console.log('ddddddddddddddddddd'+total_results)

            let sendparam22 ={
                iot_total:total_results,
                retail_id:retail_id_1,
                portal_total:portal_total_1
            }

            //console.log(total_results)

            resolve(sendparam22);

        }).catch(err => {
            console.log(err)
        })

    }); 
}

function get_ibt_iot_check(var_res){

    var now = new Date();
    var res = var_res;
    var iot_date = dateFormat(now, "yyyy-mm-dd");
    var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

   
     var  new_query = "SELECT * FROM asn_master WHERE 1 "+ 
    " AND  (`receiving_date` >= '"+iot_date+" 00:00:00' AND `receiving_date` <= '"+iot_date+" 23:59:59') "+ 
    " AND `status` = 'receiving' ";

  
        mysql.queryCustom(new_query)
            .then(function(result) {
                //console.log(result)
                if (result.status == "1") {

                    var ibt_record = result.results;
                    var insert_query = '';
                    for (var i = 0; i < ibt_record.length; i++) {

                        insert_query =insert_query+"insert into ibt_report set "+ 
                        " ibt='"+ibt_record[i].asn+"' "+ 
                        " ,portal_status='"+ibt_record[i].received_item+"',"+ 
                        " process='"+ibt_record[i].status+"', "+ 
                        "ibt_date='"+iot_date+"';"

                    }

                    var delete_query22 = "delete from ibt_report where ibt_date='"+iot_date+"'";
                   
                    mysql.queryCustom(delete_query22)
                    .then(function(result) {
                        if (result.status == "1") {

                            mysql.queryCustom(insert_query)
                            .then(function(result22) {

                                if (result22.status == "1") {

                                    var select_query_in = "select * from ibt_report where ibt_date = '"+iot_date+"' "
                                    // console.log(select_query_in)
                                    mysql.queryCustom(select_query_in)
                                    .then(function(result23) {

                                    if (result23.status == "1") {

                                        var get_retail_id = result23.results;

                                        var asn_rec = 0;
                                        var portal_status_s = 0;
                                        if(get_retail_id.length>0){
                                        const get_ibt_data_iot = async () => {      
                                           for(var k=0;k<get_retail_id.length;k++){
                                                //console.log(asn_rec+"<><><><><>"+portal_status_s)  
                                                await sleep(1000);
                                                asn_rec = get_retail_id[k].ibt
                                                portal_status_s = get_retail_id[k].portal_status

                                                    //console.log(asn_rec)

                                                check_iot_ibt_status(asn_rec,portal_status_s).then(function(returnData22){

                                                    var iot_total_22    = returnData22.iot_total;
                                                    var portal_total_22 = returnData22.portal_total;
                                                    var retail_id_22    = returnData22.retail_id;
                                                    //console.log(returnData22)
                                                    var status = 'yes';

                                                    if(parseInt(iot_total_22) !== parseInt(portal_total_22)){
                                                        status = 'No'
                                                    }

                                                    //console.log(returnData22);
                                                    var update_Query ="update ibt_report set "+ 
                                                    " iot_status = '"+iot_total_22+"',status_match='"+status+"' "+ 
                                                    " where ibt='"+retail_id_22+"' and ibt_date ='"+iot_date+"' ;";
                                                    //console.log(update_Query)
                                                      mysql.queryCustom(update_Query)
                                                        .then(function(result24) {})
                                                });
                                            }
                                        }    

                                        get_ibt_data_iot();


                                            const send_ibt_mail = async () => {    

                                                var select_query_inn = "SELECT * FROM ibt_report WHERE "+ 
                                                " ibt_date = '"+iot_date+"' AND iot_status IS NOT NULL AND iot_status <> '' AND send_mail = 0 "
                                                // console.log(select_query_in)
                                                mysql.queryCustom(select_query_inn)
                                                .then(function(result25) {

                                                    var get_send_mail = result25.results;
                                                    // console.log(get_send_mail.length)
                                                    if(get_send_mail.length>0){
                                                        var update_query_34 = '';
                                                        


                                                     var table=''    
                                                        table += '<table border=1 style="text-align:center" id="ibt_report_tb">  <thead style="background-color:#000;color:#fff"> <tr> <th>IBT</th> <th>Portal Status</th> '+ 
                                                        ' <th>IOT Status </th> <th>Status Matched</th> <th>Process</th> <th>Date</th>  </tr></thead> <tbody> ' 
                                                        for(var j=0;j<get_send_mail.length;j++){

                                                            table +='<tr rowspan="4"> ';
                                                            table +='<td>'+get_send_mail[j].ibt+'</td>'
                                                            table +='<td>'+get_send_mail[j].portal_status+'</td>'

                                                            table +='<td>'+get_send_mail[j].iot_status+'</td>'
                                                            table +='<td>'+get_send_mail[j].status_match+'</td>'
                                                            table +='<td>'+get_send_mail[j].process+'</td>'
                                                            table +='<td>'+get_send_mail[j].ibt_date+'</td>'

                                                            table += '</tr>'

                                                            update_query_34 = update_query_34+"update ibt_report set send_mail = '1' where "+ 
                                                            " ibt_date = '"+iot_date+"' and ibt = '"+get_send_mail[j].ibt+"'; "


                                                        }
                                                        //console.log(update_query_34)
                                                        table +='</tbody>'
                                                        table += ' </table>';

                                                        var send_message = table;

                                                        //console.log(send_message)
                                                        var maillist = process.env.ALERT_EMAIL_1;
                                                        const message = {
                                                            from: 'saqib@innodaba.com', // Sender address
                                                            to: maillist, // List of recipients
                                                            subject: 'IBT Report', // Subject line
                                                            html:send_message
                                                        };
                                                        transport.sendMail(message, function(err, info) {
                                                            if (err) {
                                                                console.log(err)
                                                            } else {
                                                                console.log(info);
                                                                mysql.queryCustom(update_query_34)
                                                                .then(function(result26) {

                                                                })


                                                            }
                                                        });

                                                    }


                                                })

                                            }
                                            //doSomething_ibt();
                                            setTimeout(function(){
                                                console.log('mail send ibt');
                                                send_ibt_mail();
                                            },300000)

                                        }
                                    }  


                                    }).catch(function(error) {
                                        console2.log('Error',error, '104-get_iot_ibt_store_check');  
                                    });    

                                }                                

                            }).catch(function(error) {
                                console2.log('Error', error, '133-get_iot_ibt_store_check');  
                            });
                        }      


                    }) .catch(function(error) {
                        console2.log('Error', error, '127-get_iot_ibt_store_check');

                    }); 
                }
        })     
        .catch(function(error) {
            console2.log('Error', error, '115-get_iot_ibt_store_check');
            //res.end(error);
        });

        if(res!=='n/a'){
         res.end('ssssssssssssssss');
        }
}

function check_iot_goods_status(var_retail_id,var_portal_total){
    return new Promise((resolve, reject) => {

        var retail_id_1 = var_retail_id;
        var portal_total_1 = var_portal_total;

        const body = {
            "Retail_ItemBatchID": retail_id_1
        };
        //zeeshan need to need to change
        fetch(process.env.IOT_API + 'reportExecution/GOODSINITEMSSTORES', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'apikey': process.env.IOT_API_KEY,
                'Content-Type': 'application/json'
            },
        }).then(res => {
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return res.json();
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '81-GOODSINITEMSSTORES API json validation');
        }).then((json) => {

            var total_results = json.total;

            
            let sendparam22 ={
                iot_total:total_results,
                retail_id:retail_id_1,
                portal_total:portal_total_1
            }

            //console.log(total_results)

            resolve(sendparam22);

        });

    }); 
}

function get_goods_store_iot_check(var_res){

    var now = new Date();
    var res = var_res;
    var iot_date = dateFormat(now, "yyyy-mm-dd");
    var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

    //console2.execution_info('get_goods_store_iot_check');
    
    var  new_query = "SELECT count(*) as mycount,a.retail_item_batch_id  " +
                    "  FROM goods_item_store a WHERE 1 and DATE(date)='"+iot_date+"' group by retail_item_batch_id";

        mysql.queryCustom(new_query)
            .then(function(result) {
                //console.log(result)
                if (result.status == "1") {

                    var goods_store_record = result.results;
                    var insert_query = '';
                    for (var i = 0; i < goods_store_record.length; i++) {

                        insert_query =insert_query+"insert into goods_store_report set "+ 
                        " retail_cyclecount_id='"+goods_store_record[i].retail_item_batch_id+"' "+ 
                        " ,portal_status='"+goods_store_record[i].mycount+"', goods_date='"+iot_date+"';"

                    }

                    var delete_query22 = "delete from goods_store_report where goods_date='"+iot_date+"'";
                   // console.log(delete_query22)     
                    mysql.queryCustom(delete_query22)
                    .then(function(result) {
                        if (result.status == "1") {

                            mysql.queryCustom(insert_query)
                            .then(function(result22) {

                                if (result22.status == "1") {

                                    var select_query_in = "select * from goods_store_report where goods_date = '"+iot_date+"' "
                                    // console.log(select_query_in)
                                    mysql.queryCustom(select_query_in)
                                    .then(function(result23) {

                                    if (result23.status == "1") {
                                        
                                        var get_retail_id = result23.results;

                                        var retail_cyclecount_id_s = 0;
                                        var portal_status_s = 0;
                                        if(get_retail_id.length>0){
                                        const get_goods_data_iot = async () => {      
                                            for(var k=0;k<get_retail_id.length;k++){
                                                //console.log(retail_cyclecount_id_s+"<><><><><>"+portal_status_s)  
                                                await sleep(1000);
                                                retail_cyclecount_id_s = get_retail_id[k].retail_cyclecount_id
                                                portal_status_s = get_retail_id[k]. portal_status
                                                    

                                                check_iot_goods_status(retail_cyclecount_id_s,portal_status_s).then(function(returnData22){

                                                    var iot_total_22    = returnData22.iot_total;
                                                    var portal_total_22 = returnData22.portal_total;
                                                    var retail_id_22    = returnData22.retail_id;
                                                    var status = 'yes';

                                                    if(parseInt(iot_total_22) !== parseInt(portal_total_22)){
                                                        status = 'No'
                                                    }

                                                    var update_Query ="update goods_store_report set "+ 
                                                    " iot_status = '"+iot_total_22+"',status_match='"+status+"' "+ 
                                                    " where retail_cyclecount_id='"+retail_id_22+"' and goods_date ='"+iot_date+"' ;";
                                                    //console.log(update_Query)
                                                      mysql.queryCustom(update_Query)
                                                        .then(function(result24) {})
                                                });
                                            }
                                        }    
                                        get_goods_data_iot();

                                            const send_mail_goods = async () => {    
                                                
                                                var select_query_inn = "SELECT * FROM goods_store_report WHERE "+ 
                                                " goods_date = '"+iot_date+"' AND iot_status IS NOT NULL AND iot_status <> '' AND send_mail = 0 "
                                                // console.log(select_query_in)
                                                mysql.queryCustom(select_query_inn)
                                                .then(function(result25) {
                                                   
                                                    var get_send_mail = result25.results;
                                                    // console.log(get_send_mail.length)
                                                    if(get_send_mail.length>0){
                                                        var update_query_34 = '';
                                                        // console.log('statrtfffffffffffffffffff')
                                                    

                                                     var table=''    
                                                        table += '<table border=1 style="text-align:center" id="goods_report_tb">  <thead style="background-color:#000;color:#fff"> <tr> <th>Retail_CycleCountID</th> <th>Portal Status</th> '+ 
                                                        ' <th>IOT Status </th> <th>Status Matched</th> <th>Date</th>  </tr></thead> <tbody> ' 
                                                        for(var j=0;j<get_send_mail.length;j++){

                                                            table +='<tr rowspan="4"> ';
                                                            table +='<td>'+get_send_mail[j].retail_cyclecount_id+'</td>'
                                                            table +='<td>'+get_send_mail[j].portal_status+'</td>'
                                                           
                                                            table +='<td>'+get_send_mail[j].iot_status+'</td>'
                                                            table +='<td>'+get_send_mail[j].status_match+'</td>'
                                                            table +='<td>'+get_send_mail[j].goods_date+'</td>'
                                                            
                                                            table += '</tr>'

                                                            update_query_34 = update_query_34+"update goods_store_report set send_mail = '1' where "+ 
                                                            " goods_date = '"+iot_date+"' and retail_cyclecount_id = '"+get_send_mail[j].retail_cyclecount_id+"'; "


                                                        }

                                                        table +='</tbody>'
                                                        table += ' </table>';

                                                        var send_message = table;


                                                        var maillist = process.env.ALERT_EMAIL_1;
                                                        const message = {
                                                            from: 'saqib@innodaba.com', // Sender address
                                                            to: maillist, // List of recipients
                                                            subject: 'Goods Report', // Subject line
                                                            html:send_message
                                                        };
                                                        transport.sendMail(message, function(err, info) {
                                                            if (err) {
                                                                console.log(err)
                                                            } else {
                                                                console.log(info);
                                                                mysql.queryCustom(update_query_34)
                                                                .then(function(result26) {

                                                                })

                                                                
                                                            }
                                                        });

                                                    }

                                                    
                                                })

                                            }

                                            setTimeout(function(){
                                                send_mail_goods();
                                            },300000)
                                           
                                        }
                                    }  


                                    }).catch(function(error) {
                                        console2.log('Error',error, '104-get_goods_store_iot_check');  
                                    });    

                                }                                

                            }).catch(function(error) {
                                console2.log('Error', error, '133-get_goods_store_iot_check');  
                            });
                        }      


                    }) .catch(function(error) {
                        console2.log('Error', error, '127-get_goods_store_iot_check');
                        
                    }); 
                }
        })     
        .catch(function(error) {
            console2.log('Error', error, '115-get_goods_store_iot_check');
            //res.end(error);
        });

        if(res!=='n/a'){
         res.end('ssssssssssssssss');
        }


                  
}




function check_iot_soh_status(var_storename){

    return new Promise((resolve, reject) => {
        var storeid = var_storename;

        const body = {
            "StoreID": storeid
        };
        //zeeshan need to change
        fetch(process.env.IOT_API_NEW + 'innovent/SOHPERSTORE', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'apikey': process.env.IOT_API_KEY,
                'Content-Type': 'application/json'
            },
        }).then(res => {
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return res.json();
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '90-StockSummaryDump API json validation');
        }).then((json) => {
            var total_results = json.total;

            
            let sendparam = {
                storename: storeid,
                iot_result:total_results
            }
            //console.log(total_results)

            resolve(sendparam);

        });

    });
}


function soh_empty_check_iot(var_res){
       
    try {
        
        var now = new Date();
        var res = var_res;
        var iot_date = dateFormat(now, "yyyy-mm-dd");
        var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

        // console2.execution_info('get_iot_soh_check');
        var now = new Date();
       
        var getstoreinf = '';
        var new_query_stock_store = '';
        var cond = '';
        var date = '';
        var search_cond = '';

        // if (req.session.user_id == 1) {
            date = dateFormat(now, "yyyy-mm-dd");


            var  new_query = "SELECT * " +
                    "  FROM tb_store WHERE 1 order by storeid desc";
           
        //}
        
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
                            
                            var total_onhand_total = 0;
                            var store_id = '';
                            if(total_results.length>0){
                                const doSomething = async () => {    
                                    for(j=0;j<total_results.length;j++){
                                          await sleep(1000);
                                            
                                            try{
                                                total_onhand_total = total_results[j][0].onhandtotal;
                                            }catch{

                                                total_onhand_total= 0;
                                            }
                                           

                                           
                                            if(typeof(total_onhand_total) == "null" || 
                                                total_onhand_total == null || total_onhand_total == '' 
                                                || total_onhand_total == 0 || total_onhand_total == '0'){
                                                
                                                try{
                                                    store_id = total_results[j][0].mystore;
                                                }catch{
                                                    store_id = '';
                                                }
                                                
                                                var select_query_2 = '';
                                              
                                                var update_query_iot  = '';

                                                check_iot_soh_status(store_id).then(function(returnData){
                                                    var iot_result = returnData;

                                                    var store_name22 = iot_result.storename;
                                                    var iot_result_22 = iot_result.iot_result;

                                                    // console.log('iot_result<<++>>++'+iot_result);
                                                    console.log('store_name22<<++>>++'+store_name22);
                                                    console.log('iot_result_22<<++>>++'+iot_result_22);


                                                   
                                                    if(parseInt(iot_result_22)>0){

                                                        const doSomething2 = async () => {    
                                                            await sleep(2000);

                                                                var insert_query = "INSERT INTO soh_notification (`storename`,`datetime`,`status`,`soh_controller`,`soh_date`,`soh_result`) "+
                                                                "SELECT * FROM (SELECT '"+store_name22+"', '"+var_datetime+"', '0','soh_handle','"+iot_date+"','"+iot_result_22+"') AS tmp "+
                                                                "WHERE NOT EXISTS ( "+
                                                                    "SELECT `storename`,`soh_date` FROM soh_notification WHERE storename = '"+store_name22+"' "+ 
                                                                " AND soh_date= '"+iot_date+"' AND status='0' "+
                                                                ") LIMIT 1"

                                                            // var insert_query = "insert into iot_notification set status='0',iot_controller='soh_handle',datetime= '"+var_datetime+"' ,"+ 
                                                            //     " iot_date='"+iot_date+"' , storename = '"+store_id+"',iot_result = '"+iot_result+"'";
                                                                mysqlMain2.query(insert_query, function(err) {
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{

                                                                        update_query_iot = "update soh_notification set status='1',soh_mail='1',"+ 
                                                                        " datetime= '"+var_datetime+"' WHERE  "+ 
                                                                        " soh_date='"+iot_date+"' and storename = '"+store_name22+"';";


                                                                        mysqlMain2.query(update_query_iot, function(err) { 

                                                                            if(err){
                                                                                console.log(err)
                                                                            }else{

                                                                                var maillist = process.env.ALERT_EMAIL_1;
                                                                                
                                                                                var message_string ="Against this store '"+store_name22+"' soh is zero in iot platform this store having '"+iot_result_22+"' records."+"\n"; 
                                                                                var message22 = {
                                                                                    from: 'saqib@innodaba.com', // Sender address
                                                                                    to: maillist, // List of recipients
                                                                                    subject: 'Soh Report', // Subject line
                                                                                    text: message_string// Plain text body
                                                                                };


                                                                                transport.sendMail(message22, function(err, info) {
                                                                                    if (err) {
                                                                                       console.log(err)
                                                                                    } else {
                                                                                        console.log(info);                                                                                  
                                                                                    }
                                                                                });





                                                                            }

                                                                        });



                                                                    }
                                                                    
                                                                }); 
                                                        }
                                                        
                                                        doSomething2();
                                                       
                                                    }
                                                });
                                                
                                            
                                            }

                                        // }   
                                    } 
                                    

                                
                                }
                                doSomething();
                            }

                           
                            //res.end(error);
                        }).catch(function(error) {
                             console2.log('Error', error, '236-get_iot_soh_check');
                        })
                    
                } else {
                    console2.log('Error', result.error, '448-get_iot_soh_check');
                    //res.end(result.error);
                }
            })
            .catch(function(error) {
                console2.log('Error', error, '453-get_iot_soh_check');
                //res.end(error);
            });

            if(res!=='n/a'){
                res.end('ssssssssssssssss');
            }
    
    } catch (e) {
        console2.log('Error', 'Catch Expection'+e, '8784-get_iot_soh_check');
        if (e instanceof TypeError) {
            // res.status(500).send({
            //     error: '1',
            //     message: 'SomeThing Wrong !'
            // });
        } else {
            console2.log('Error', 'Catch Expection'+e, '8791-get_iot_soh_check');
            // res.status(500).send({
            //     error: '1',
            //     message: 'SomeThing Wrong !'
            // });
        }
    }   
}




function remove_single_qoute(str) {
    try {

        if (typeof(str) !== 'undefined') {

        } else {
            str = '';
        }

        return str.replace(/[\`\g\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
            switch (char) {
                case "'":
                    return "";
                case "`":
                    return "";
                
                
                return " " + char;

            }
        });

       
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '117-mysql_real_escape_string API');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '124-mysql_real_escape_string API');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
}

function check_store_process_status(var_storename, var_res){
    return new Promise((resolve, reject) => {

        var store = var_storename;
        var now = new Date();

        var CheckDate = dateFormat(now, "yyyy-mm-dd");
        
        var res3      = var_res;
        
      
        var select_query = "SELECT status FROM store_process_status a where 1 "+ 
        " and status = '1' and storename ='"+store+"' ;"
        //console.log(select_query);
        mysql.queryCustom(select_query).then(function(result) {
            var status = '';
      
            try{
                status = result.results[0].status;
            }catch{

                status = '02222222222222';
            }

            let sendparam = {
                status2:status,
                store_name: store,
                res:res3
            }
            resolve(sendparam);
        })

    })
}

function get_store_soh(storename){

    return new Promise((resolve, reject) => {
        
        var now = new Date();

        var CheckDate = dateFormat(now, "yyyy-mm-dd");
      
        var store = storename;
      
        var select_query = "SELECT * FROM stock_count_"+store+" a where 1 and stockcountdate = '"+CheckDate+"' and is_deleted='0' ;"
    
        mysql.queryCustom(select_query).then(function(result) {

            
            var my_ar = {};
            var myObj = {};
            for(k=0; k<result.results.length; k++)
            {
                myObj = {
                 
                    storeid:result.results[k].storeid ,
                    departmentid:result.results[k].departmentid ,
                    code:result.results[k].code ,
                    initial:result.results[k].initial,
                    counted:0 ,
                    delta:result.results[k].delta,
                    unexpected:0,
                    missing:0,
                    expected:0,
                    accuracy:result.results[k].accuracy,
                    expected_sf:0,
                    expected_sr:0,
                    counted_sf:0,
                    counted_sr:0,
                    scanned:result.results[k].scanned,
                    stockcountdate:result.results[k].stockcountdate,
                    brand_name:result.results[k].brand_name,
                    color:result.results[k].color,
                    size:result.results[k].size,
                    style:result.results[k].style,
                    season:result.results[k].season,
                    price:result.results[k].price,
                    suppliername:result.results[k].suppliername,
                    totalprice:result.results[k].totalprice,
                    supplier_item_no:result.results[k].supplier_item_no
                    
                };
                my_ar[result.results[k].code]=myObj;
            }

            let sendparam = {
                db_data:my_ar,
                store_name: store
            }

            resolve(sendparam);
        }).catch(err => {
            console2.log('Error', JSON.stringify(err), '461-Check_StockExists API StockSummaryDump api error');
        });
    });
}


function EpcDump_22(storename,response,var_res,var_value=0)
{
    var now = new Date();
    var CheckDate = dateFormat(now, "yyyy-mm-dd");
    var dateTime22 = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var temp = response;
    var res = var_res;
    var value_22 = var_value;

    console2.log_entry("/cycle_count_run",temp);
   
    var store_name = storename;

    if(parseInt(value_22) == 1){
        //console.log('dddddddddddddd>>>>>>>>>active+'+value_22)
        check_store_process_status(store_name).then(function(returnData33){

            var return_status  = returnData33.status2;
            var return_storename  = returnData33.store_name;

            if(parseInt(return_status) == 1 ){

                var update_query_status = "update store_process_status set status='0',datetime= '"+dateTime22+"', iot_date='"+CheckDate+"' where  "+ 
                " storename = '"+return_storename+"'";
                           
                mysqlMain2.query(update_query_status, function(err) {
                    if(err){
                      console.log(err);
                    }
                   
                }); 

                get_store_soh(return_storename).then(function(returnData){
                                    
                    var my_prev_db_rec  = returnData.db_data;
                    var db_data         = returnData.db_data;
                    var store_name      = returnData.store_name;
                    var array_dump      = [];
                    
                    if(Object.keys(my_prev_db_rec).length>0) {

                        var now = new Date();
                        var CheckDate = dateFormat(now, "yyyy-mm-dd");
                  
                        var myObj = '';
                        var sku='';
                       
                    
                        var sku_data        =   {};
                        var departmentid    =   '';
                        var initial         =   0;
                        var counted_sf      =   0;
                        var counted_sr      =   0;
                        var counted         =   0;
                        var db_data_extra   =   [];
                        var api_data        =   '';
                        var brandname22     =   ''; 
                        var db_data2        =   new Object();
                        var unexpected      =   0;
                        var missing         =   0;
                        var season          =   '';
                        var color           =   '';
                        var size            =   '';
                        var style           =   '';
                        var price           =   ''; 
                        var suppliername    =   '';
                        var totalprice      =   '';
                        var supplier_item_no=   '';
                        var extra_items     =   {};
                        console.log("==zzAPI number of record==>>"+temp.results.length);
                        console.log(temp);
                       
                        for(k=0; k<temp.results.length; k++)
                        {
                          
                            
                            sku = temp.results[k].SKU_original;
                            if(typeof(db_data[sku])!=="undefined")
                            {
                                
                                sku_data        =   db_data[sku];
                                departmentid    =   sku_data.departmentid;
                                initial         =   sku_data.initial;
                                
                                counted_sf      =   db_data[sku].counted_sf;
                                counted_sr      =   db_data[sku].counted_sr;
                                counted         =   db_data[sku].counted;
                                missing         =   db_data[sku].missing;
                                unexpected      =   db_data[sku].unexpected;

                               
                                
                                counted=parseInt(counted)+1;
                                if(temp.results[k].zone=="SalesFloor")
                                {   
                                    counted_sf++;
                                }

                                if(temp.results[k].zone=="StockRoom")
                                {   
                                    counted_sr++;
                                }

                                api_data        =   temp.results[k];
                                
                                if(db_data[sku].brand_name !== ""){
                                    brandname22 = db_data[sku].brand_name;
                                }else{
                                    brandname22 = escape(api_data.Brand);
                                }


                                if(db_data[sku].season !== ""){
                                    season = db_data[sku].season;
                                }else{
                                    season = api_data.Season
                                }


                                if(db_data[sku].color !== ""){
                                    color = db_data[sku].color;
                                }else{
                                    color = api_data.Color
                                }


                                if(db_data[sku].size !== ""){
                                    size = db_data[sku].size;
                                }else{
                                    size = api_data.Size
                                }

                                if(db_data[sku].style !== ""){
                                    style = db_data[sku].style;
                                }else{
                                    style = api_data.Style
                                }

                                if(db_data[sku].price !== ""){
                                    price = db_data[sku].price;
                                }else{
                                    price = api_data.Price
                                }

                                if(db_data[sku].suppliername !== ""){
                                    suppliername = db_data[sku].suppliername;
                                }else{
                                    suppliername = api_data.SupplierName
                                }

                                if(db_data[sku].totalprice !== ""){
                                    totalprice = db_data[sku].totalprice;
                                }else{
                                    totalprice = api_data.TotalPrice
                                }

                                if(db_data[sku].supplier_item_no !== ""){
                                    supplier_item_no = db_data[sku].supplier_item_no;
                                }else{
                                    supplier_item_no = api_data.Supplier_Item_No
                                }

                                
                                myObj = { 

                                    storeid:store_name,
                                    departmentid:departmentid,
                                    code:sku,
                                    initial:initial,
                                    counted: counted,
                                    delta:sku_data.delta,
                                    unexpected:unexpected,
                                    missing:missing,
                                    expected:0,
                                    accuracy:sku_data.accuracy,
                                    expected_sf:0,
                                    expected_sr:0,
                                    counted_sf:counted_sf,
                                    counted_sr:counted_sr,
                                    scanned:sku_data.scanned,
                                    stockcountdate:CheckDate,
                                    brand_name:brandname22,
                                    color:color,
                                    size:size,
                                    style:style,
                                    season:season,
                                    price:price,
                                    suppliername:suppliername,
                                    totalprice:totalprice,
                                    supplier_item_no:supplier_item_no
                                    // extra_item:0,
                                };

                                
                                db_data[sku]=myObj;  
                                 

                            }
                            else
                            {   

                                // if(typeof(api_data.SKU_original)!=="undefined"){
                                    //console.log("(((((((((((((((((((("+api_data.SKU_original);
                                    api_data     = temp.results[k];
                                    departmentid = temp.results[k].departmentid;
                                    brandname22    = escape(api_data.Brand);
                                 
                                    if(temp.results[k].zone=="SalesFloor")
                                    {   
                                        counted_sf=1;
                                    }

                                    if(temp.results[k].zone=="StockRoom")
                                    {   
                                        counted_sr=1;
                                    }
                                    
                                    myObj = { 
                                       
                                        storeid:store_name,
                                        departmentid:api_data.DepartmentID,
                                        code:api_data.SKU_original,
                                        initial:0,
                                        counted: 1,
                                        delta:'null',
                                        unexpected:0,
                                        missing:0,
                                        expected:0,
                                        accuracy:'null',
                                        expected_sf:0,
                                        expected_sr:0,
                                        counted_sf:counted_sf,
                                        counted_sr:counted_sr,
                                        scanned:0,
                                        stockcountdate:CheckDate,
                                        brand_name:brandname22,
                                        color:api_data.Color,
                                        size:api_data.Size,
                                        style:api_data.Style,
                                        season:api_data.Season,
                                        price:api_data.Price,
                                        suppliername:api_data.SupplierName,
                                        totalprice:api_data.TotalPrice,
                                        supplier_item_no:api_data.Supplier_Item_No
                                        // extra_item:1
                                    };  
                                   
                                    db_data[sku]=myObj;
                                    extra_items[sku]=myObj;
                                //}
                            }    
                        }
                       
                        var temp22 = '';
                        var dump_db = [];
                        var zero_initial = [];
                        //console.log(array_dump); 
                        var update_item_code = '';
                        console.log("=====DB Number of record=>"+Object.keys(db_data).length );
                      

                        var insert_query = "INSERT INTO `stock_count_temp`(`storeid`, `departmentid`, `code`,"+ 
                        " `initial`, `counted`, `delta`, `unexpected`,"+ 
                        " `missing`, `expected`, `accuracy`, `expected_sf`,"+ 
                        " `expected_sr`, `counted_sf`, `counted_sr`,"+ 
                        " `scanned`, `stockcountdate`, `brand_name`,"+ 
                        " `color`, `size`, `style`,`season`,`price`,`suppliername`,`totalprice`,`supplier_item_no`) VALUES ? ";

                        var insert_query_initial = "INSERT INTO stock_count_"+store_name+"(`storeid`, `departmentid`, `code`,"+ 
                        " `initial`, `counted`, `delta`, `unexpected`,"+ 
                        " `missing`, `expected`, `accuracy`, `expected_sf`,"+ 
                        " `expected_sr`, `counted_sf`, `counted_sr`,"+ 
                        " `scanned`, `stockcountdate`, `brand_name`,"+ 
                        " `color`, `size`, `style`,`season`,`price`,`suppliername`,`totalprice`,`supplier_item_no`) VALUES ? ";

                    
                        var missing_new    = 0;
                        var unexpected_new = 0;

                        for (var element in extra_items) {


                            if(db_data[element].initial >=db_data[element].counted)
                            {
                                missing_new= db_data[element].initial - db_data[element].counted;
                            }
                            else
                            {
                                missing_new= '0';     
                            }

                            if(db_data[element].counted > db_data[element].initial)
                            {
                                unexpected_new= db_data[element].counted - db_data[element].initial;
                            }
                            else
                            {
                                unexpected_new= 0; 
                            }

                            temp22 = [
                                db_data[element].storeid,
                                db_data[element].departmentid,
                                db_data[element].code,
                                db_data[element].initial,
                                db_data[element].counted,
                                db_data[element].delta,
                                unexpected_new,
                                missing_new,
                                db_data[element].expected,
                                db_data[element].accuracy,
                                db_data[element].expected_sf,
                                db_data[element].expected_sr,
                                db_data[element].counted_sf,
                                db_data[element].counted_sr,
                                db_data[element].scanned,
                                db_data[element].stockcountdate,
                                db_data[element].brand_name,
                                db_data[element].color,
                                db_data[element].size,
                                db_data[element].style,
                                db_data[element].season,
                                db_data[element].price,
                                db_data[element].suppliername,
                                db_data[element].totalprice,
                                db_data[element].supplier_item_no
                               
                            ];

                            
                            zero_initial.push(temp22);


                        }
                        console.log("======>after first for loop"+store_name);
                        for (var element in db_data) {
                          
                            if(db_data[element].initial >=db_data[element].counted)
                            {
                                missing_new= db_data[element].initial - db_data[element].counted;
                            }
                            else
                            {
                                missing_new= '0';     
                            }

                            if(db_data[element].counted > db_data[element].initial)
                            {
                                unexpected_new= db_data[element].counted - db_data[element].initial;
                            }
                            else
                            {
                                unexpected_new= 0; 
                            }

                            temp22 = [
                                db_data[element].storeid,
                                db_data[element].departmentid,
                                db_data[element].code,
                                db_data[element].initial,
                                db_data[element].counted,
                                db_data[element].delta,
                                unexpected_new,
                                missing_new,
                                db_data[element].expected,
                                db_data[element].accuracy,
                                db_data[element].expected_sf,
                                db_data[element].expected_sr,
                                db_data[element].counted_sf,
                                db_data[element].counted_sr,
                                db_data[element].scanned,
                                db_data[element].stockcountdate,
                                db_data[element].brand_name,
                                db_data[element].color,
                                db_data[element].size,
                                db_data[element].style,
                                db_data[element].season,
                                db_data[element].price,
                                db_data[element].suppliername,
                                db_data[element].totalprice,
                                db_data[element].supplier_item_no
                               
                            ];

                            
                            
                            dump_db.push(temp22);
                        }
                        console.log("======>after second for loop"+store_name);
                        
                        
                        //console.log(dump_db.length)
                        if(dump_db.length>0)
                        {
                            var now = new Date();
                            var iot_date = dateFormat(now, "yyyy-mm-dd");
                            var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

                            var now = new Date();
                            var iot_date = dateFormat(now, "yyyy-mm-dd");
                            var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

                            var delete_query = "delete from stock_count_temp WHERE storeid = '"+store_name+"'";
                                mysqlMain2.query(delete_query, function(err) {

                                    console.log("tttttttttttttt");
                                    mysqlMain2.query(insert_query, [dump_db], function(err,result) {
                                        if(err)
                                        {
                                            console.log(err);
                                            if (res != "n/a") {
                                                res.status(200).send({
                                                    error: "1",
                                                    message: JSON.stringify(err),
                                                });
                                            }
                                        } 
                                        else
                                        {   
                                            var update_query_iot = "update iot_notification set status='1',datetime= '"+var_datetime+"' WHERE  "+ 
                                                " iot_date='"+iot_date+"' and storename = '"+store_name+"'";
                                            mysqlMain2.query(update_query_iot, function(err) {}); 
                                             
                                            var update_query_status = "update store_process_status set status='1',datetime= '"+var_datetime+"' WHERE  "+ 
                                                    " iot_date='"+iot_date+"' and storename = '"+store_name+"'";
                                            mysqlMain2.query(update_query_status, function(err) {
                                                if(err){
                                                    console.log(err)
                                                }
                                            }); 
                                             
                                            // console.log(insert_query_initial, [zero_initial])
                                            mysqlMain2.query(insert_query_initial, [zero_initial], function(err) {

                                                // var update_query_initial = `UPDATE stock_count_`+store_name+` t1
                                                //                             INNER JOIN stock_count_temp t2
                                                //                             SET t1.storeid= t2.storeid,t1.departmentid= t2.departmentid,t1.code=t2.code,
                                                //                             t1.initial=t2.initial,
                                                //                             t1.counted=t2.counted,t1.delta=t2.delta,t1.unexpected=t2.unexpected,
                                                //                             t1.missing=t2.missing,t1.expected=t2.expected,t1.accuracy=t2.expected,
                                                //                             t1.expected_sf=t2.expected_sf,t1.expected_sr=t2.expected_sr,t1.counted_sf=t2.counted_sf,
                                                //                             t1.counted_sr=t2.counted_sr,t1.scanned=t2.scanned,
                                                //                             t1.brand_name=t2.brand_name,t1.color=t2.color,t1.size=t2.size,t1.style=t2.style,
                                                //                             t1.price=t2.price,t1.season=t2.season,t1.is_deleted=t2.is_deleted,t1.suppliername=t2.suppliername,
                                                //                             t1.totalprice=t2.totalprice
                                                //                             WHERE t1.code = t2.code AND t2.stockcountdate='`+iot_date+`' AND t2.storeid='`+store_name+`';`
                                                //console.log(update_query_initial) 

                                                var call_procedure = "CALL stock_count_check_"+store_name+"('"+store_name+"','"+iot_date+"');" ;                          
                                                mysqlMain2.query(call_procedure, function(err) { if(err){console.log(err)} });                            
                                                console.log("RUN CycleCount OK For "+store_name);
                                                if (res != "n/a") {
                                                    res.status(200).send({
                                                        error: "0",
                                                        message: "All Done !.",
                                                    });
                                                }

                                            }); 
                                               

                                        }
                                        
                                    });
                                });     

                            // });    
                        }
                        else
                        {
                            if (res != "n/a") {
                                res.status(200).send({
                                    error: "0",
                                    message: "Zero soh",
                                });
                            }
                        }            
                       
                    }
                    else
                    {
                        if (res != "n/a") {
                            res.status(200).send({
                                error: "1",
                                message: "Previous job running or soh not consume please try again",
                            });
                        }
                    }
                        
                })
            }else{
                
                console.log('Server busy in other calculation please try again later .')
                if (res != "n/a") {
                    res.status(200).send({
                        error: "1",
                        message: "Server busy in other calculation please try again later .",
                    });
                }
                /*return res.end(
                
                    "Server busy in other calculation please try again later ."
                );*/
            }    
        });
    }else{

        //console.log('dddddddddddddd>>>>>>>>>disable+'+value_22)
        get_store_soh(store_name).then(function(returnData){
                        
       
            var my_prev_db_rec  = returnData.db_data;
            var db_data         = returnData.db_data;
            var store_name      = returnData.store_name;
            var array_dump      = [];
    
            if(Object.keys(my_prev_db_rec).length>0) {

                var now = new Date();
                var CheckDate = dateFormat(now, "yyyy-mm-dd");
          
                var myObj = '';
                var sku='';
               
            
                var sku_data        =   {};
                var departmentid    =   '';
                var initial         =   0;
                var counted_sf      =   0;
                var counted_sr      =   0;
                var counted         =   0;
                var db_data_extra   =   [];
                var api_data        =   '';
                var brandname22     =   ''; 
                var db_data2        =   new Object();
                var unexpected      =   0;
                var missing         =   0;
                var season          =   '';
                var color           =   '';
                var size            =   '';
                var style           =   '';
                var price           =   ''; 
                var suppliername    =   '';
                var totalprice      =   '';
                var supplier_item_no=   '';
                console.log("==API number of record==>>"+temp.results.length);
               
               
                for(k=0; k<temp.results.length; k++)
                {
                  
                    
                    sku = temp.results[k].SKU_original;
                    if(typeof(db_data[sku])!=="undefined")
                    {
                        
                        sku_data        =   db_data[sku];
                        departmentid    =   sku_data.departmentid;
                        initial         =   sku_data.initial;
                        
                        counted_sf      =   db_data[sku].counted_sf;
                        counted_sr      =   db_data[sku].counted_sr;
                        counted         =   db_data[sku].counted;
                        missing         =   db_data[sku].missing;
                        unexpected      =   db_data[sku].unexpected;

                       
                        
                        counted=parseInt(counted)+1;
                        if(temp.results[k].zone=="SalesFloor")
                        {   
                            counted_sf++;
                        }

                        if(temp.results[k].zone=="StockRoom")
                        {   
                            counted_sr++;
                        }

                        api_data        =   temp.results[k];
                        
                        if(db_data[sku].brand_name !== ""){
                            brandname22 = db_data[sku].brand_name;
                        }else{
                            brandname22 = escape(api_data.Brand);
                        }


                        if(db_data[sku].season !== ""){
                            season = db_data[sku].season;
                        }else{
                            season = api_data.Season
                        }


                        if(db_data[sku].color !== ""){
                            color = db_data[sku].color;
                        }else{
                            color = api_data.Color
                        }


                        if(db_data[sku].size !== ""){
                            size = db_data[sku].size;
                        }else{
                            size = api_data.Size
                        }

                        if(db_data[sku].style !== ""){
                            style = db_data[sku].style;
                        }else{
                            style = api_data.Style
                        }

                        if(db_data[sku].price !== ""){
                            price = db_data[sku].price;
                        }else{
                            price = api_data.Price
                        }

                        if(db_data[sku].suppliername !== ""){
                            suppliername = db_data[sku].suppliername;
                        }else{
                            suppliername = api_data.SupplierName
                        }

                        if(db_data[sku].totalprice !== ""){
                            totalprice = db_data[sku].totalprice;
                        }else{
                            totalprice = api_data.TotalPrice;
                        }

                        if(db_data[sku].supplier_item_no !== ""){
                            supplier_item_no = db_data[sku].supplier_item_no;
                        }else{
                            supplier_item_no = api_data.Supplier_Item_No;
                        }

                        
                        myObj = { 

                            storeid:store_name,
                            departmentid:departmentid,
                            code:sku,
                            initial:initial,
                            counted: counted,
                            delta:sku_data.delta,
                            unexpected:unexpected,
                            missing:missing,
                            expected:0,
                            accuracy:sku_data.accuracy,
                            expected_sf:0,
                            expected_sr:0,
                            counted_sf:counted_sf,
                            counted_sr:counted_sr,
                            scanned:sku_data.scanned,
                            stockcountdate:CheckDate,
                            brand_name:brandname22,
                            color:color,
                            size:size,
                            style:style,
                            season:season,
                            price:price,
                            suppliername:suppliername,
                            totalprice:totalprice,
                            supplier_item_no:supplier_item_no
                            // extra_item:0,
                        };

                        
                        db_data[sku]=myObj;  
                         

                    }
                    else
                    {   
                        // if(typeof(api_data.SKU_original)!=="undefined"){
                            //console.log("(((((((((((((((((((("+api_data.SKU_original);
                            api_data     = temp.results[k];
                            departmentid = temp.results[k].departmentid;
                            brandname22    = escape(api_data.Brand);
                         
                            if(temp.results[k].zone=="SalesFloor")
                            {   
                                counted_sf=1;
                            }

                            if(temp.results[k].zone=="StockRoom")
                            {   
                                counted_sr=1;
                            }
                            
                            myObj = { 
                               
                                storeid:store_name,
                                departmentid:api_data.DepartmentID,
                                code:api_data.SKU_original,
                                initial:0,
                                counted: 1,
                                delta:'null',
                                unexpected:0,
                                missing:0,
                                expected:0,
                                accuracy:'null',
                                expected_sf:0,
                                expected_sr:0,
                                counted_sf:counted_sf,
                                counted_sr:counted_sr,
                                scanned:0,
                                stockcountdate:CheckDate,
                                brand_name:brandname22,
                                color:api_data.Color,
                                size:api_data.Size,
                                style:api_data.Style,
                                season:api_data.Season,
                                price:api_data.Price,
                                suppliername:api_data.SupplierName,
                                totalprice:api_data.TotalPrice,
                                supplier_item_no:api_data.Supplier_Item_No
                                // extra_item:1
                            };  
                           
                            db_data[sku]=myObj;
                        //}
                       
                       
                    }    
                }
               
                var temp22 = '';
                var dump_db = [];
                //console.log(array_dump); 
                var update_item_code = '';
                console.log("=====DB Number of record=>"+Object.keys(db_data).length );
              

                var insert_query = "INSERT INTO `stock_count_"+store_name+"`(`storeid`, `departmentid`, `code`,"+ 
                " `initial`, `counted`, `delta`, `unexpected`,"+ 
                " `missing`, `expected`, `accuracy`, `expected_sf`,"+ 
                " `expected_sr`, `counted_sf`, `counted_sr`,"+ 
                " `scanned`, `stockcountdate`, `brand_name`,"+ 
                " `color`, `size`, `style`,`season`,`price`,`suppliername`,`totalprice`,`supplier_item_no`) VALUES ? ";

            
                var missing_new   =0;
                var unexpected_new=0; 

               

                for (var element in db_data) {
                  
                    if(db_data[element].initial >=db_data[element].counted)
                    {
                        missing_new= db_data[element].initial - db_data[element].counted;
                    }
                    else
                    {
                        missing_new= '0';     
                    }

                    if(db_data[element].counted > db_data[element].initial)
                    {
                        unexpected_new= db_data[element].counted - db_data[element].initial;
                    }
                    else
                    {
                        unexpected_new= 0; 
                    }
                    temp22 = [
                        db_data[element].storeid,
                        db_data[element].departmentid,
                        db_data[element].code,
                        db_data[element].initial,
                        db_data[element].counted,
                        db_data[element].delta,
                        unexpected_new,
                        missing_new,
                        db_data[element].expected,
                        db_data[element].accuracy,
                        db_data[element].expected_sf,
                        db_data[element].expected_sr,
                        db_data[element].counted_sf,
                        db_data[element].counted_sr,
                        db_data[element].scanned,
                        db_data[element].stockcountdate,
                        db_data[element].brand_name,
                        db_data[element].color,
                        db_data[element].size,
                        db_data[element].style,
                        db_data[element].season,
                        db_data[element].price,
                        db_data[element].suppliername,
                        db_data[element].totalprice,
                        db_data[element].supplier_item_no,
                       
                    ];

              
                    dump_db.push(temp22);
                }
          
                if(dump_db.length>0)
                {
                    


                   /* var update_query = "Update stock_count_"+store_name+" set is_deleted='1' WHERE  "+ 
                                "  stockcountdate='"+CheckDate+"' ";
                    mysqlMain2.query(update_query, function(err) {
                        
                        
                        mysqlMain2.query(insert_query, [dump_db], function(err,result) {
                              if(err)
                              {
                                 console.log(err);
                              } 
                              else
                              {
                                var delete_query = "DELETE FROM stock_count_"+store_name+" WHERE  "+ 
                                "  stockcountdate='"+CheckDate+"' and is_deleted='1' ";
                                
                                mysqlMain2.query(delete_query, [dump_db], function(err,result) {
                                });   
                              }
                              
                            
                        }); 
                        var now = new Date();
                        var iot_date = dateFormat(now, "yyyy-mm-dd");
                        var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        var update_query_iot = "update iot_notification set status='1',datetime= '"+var_datetime+"' WHERE  "+ 
                                " iot_date='"+iot_date+"' and storename = '"+store_name+"'";
                        mysqlMain2.query(update_query_iot, function(err) {}); 
                    });    */  


                    var update_query = "delete from stock_count_"+store_name+" WHERE  "+ 
                                "  stockcountdate='"+CheckDate+"' ";
                    mysqlMain2.query(update_query, function(err) {
                        
                        

                        mysqlMain2.query(insert_query, [dump_db], function(err,result) {
                            if(err) {
                                console.log(err);
                                if (res != "n/a") {
                                    res.status(200).send({
                                        error: "1",
                                        message: JSON.stringify(err),
                                    });
                                }
                            } 
                            else {
                                var now = new Date();
                                var iot_date = dateFormat(now, "yyyy-mm-dd");
                                var var_datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

                                var update_query_iot = "update iot_notification set status='1',datetime= '"+var_datetime+"' WHERE  "+ 
                                        " iot_date='"+iot_date+"' and storename = '"+store_name+"'";
                                mysqlMain2.query(update_query_iot, function(err) {}); 
                                if(err) {
                                    console.log(err);
                                    if (res != "n/a") {
                                        res.status(200).send({
                                            error: "1",
                                            message: JSON.stringify(err),
                                        });
                                    }
                                } else {
                                    if (res != "n/a") {
                                        res.status(200).send({
                                            error: "0",
                                            message: "All Done !.",
                                        });
                                    }
                                }
                            }
                        }); 

                    });    
                }            
                else
                {
                    if (res != "n/a") {
                        res.status(200).send({
                            error: "1",
                            message: "Zero Soh",
                        });
                    } 
                }
            }
            else
            {
                if (res != "n/a") {
                    res.status(400).send({
                        error: "1",
                        message: "Previous job running or soh not consume please try again",
                    });
                }
            }
        }).catch(function(error) {

            console2.log('Error', error, '1180-AddCronJobTask22 API api  error ');
            if (res != "n/a") {
                res.status(400).send({
                    error: "1",
                    message: JSON.stringify(error),
                });
            }
        })  

    }          
}



function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    } 
    return true;
} 

router.post('/RunRetailsApis', (req, res, next) => {

    console2.execution_info('RunRetailsApis');
    try {
        console2.log_entry("/RunRetailsApis",req.body);
        var token = access_token;
        var payload22 = '';
        var endpoint22 = '';
        var server_protocol = '';

        if (token == access_token) {

            var session = req.session;
            var data = req.body;
            if(data.payload !== '' && data.payload !== undefined){

                if(isJson(data.payload)){
                    payload22 = data.payload;
                }else{

                    res.status(400).send({
                        error: "1",
                        message: "InValid JSon",
                    }); 
                    
                }
                

            }

            if(data.endpoint !=='' && data.endpoint !== undefined){

                endpoint22 = data.endpoint;
            }

            if(data.server_protocol !=='' && data.server_protocol !== undefined){

                server_protocol22 = data.server_protocol;
            }
            
            
            
            if(data.envoirment22 !== 'PATCH'){

                
                if(data.payload !== '' && data.payload !== undefined){
                    if(isJson(data.payload)){

                        payload22 = JSON.parse(data.payload);
                    }
                    else
                    {
                        payload22 = data.payload;
                    }     
                }
               

                const body = {
                    "StoreID": payload22.StoreID
                };
               // console.log(body);
               //process.env.IOT_API
                fetch(endpoint22, 
                    {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: {
                        'apikey': process.env.IOT_API_KEY,
                        'Content-Type': 'application/json'
                    },
                }).then(res => {
                    const contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }
                return res.json();
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '90-RunRetailsApis API json validation');
                })
                .then((json) => {
                    var total_results = json.results
                    res.send(({
                        data: json
                    }));
                    
                    
                })


            }else{
                
                
                const options = {
                    url: process.env.IOT_API + endpoint22,
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                        'apikey': process.env.IOT_API_KEY,
                    },
                    body: payload22
                };

                
                request(options, function(err, res2, body) {
                    let wjson = body;
                    res.send(({
                        data: wjson
                    }));  
                });
                

            }
        } else {

            res.status(400).send({
                error: "1",
                message: "Token Not Valid !",
            });
           
        }
        

    } catch (e) {
        console2.log('Error', 'Catch Exception', '1318-RunRetailsApis  CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1325-RunRetailsApis  CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


function Check_StockExists(storename){
    return new Promise((resolve, reject) => {
        var now = new Date();
        var CheckDate = dateFormat(now, "yyyy-mm-dd");
        var store = storename;
        var exists = '0';
        //2021-04-02
        var select_query = "SELECT * FROM stock_count_"+store+" a where 1 and stockcountdate = '"+CheckDate+"';"
        mysql.queryCustom(select_query).then(function(result) {

            if (result.results.length !== 0) {
                exists = '1'
            }

            let sendparam = {
                ifexists:exists,
                StoreName: store
            }

            resolve(sendparam);
        }).catch(function(error) {

            console2.log('Error', JSON.stringify(error), '223-Check_StockExists');
            // res.end(error);
            // res.end(error);
        });

    });
}

function StockSummaryDump22_consume_automatic(res,var_store_id){
//router.get('/StockSummaryDump', (req, res, next) => {
    try {
       var now = new Date();
       var res = res;
        var store_id = var_store_id;

        
        var check_store = '';
        var store_cond2 = '';
        if(store_id !='' && store_id != undefined)
        {
           store_cond2 = " and storename='"+store_id+"' ";  
           
        }
        
        var  CheckDate = dateFormat(now, "yyyy-mm-dd");

        var now = new Date();

        var  CheckDate22 = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

        var select_query = "SELECT * FROM tb_store a where 1 "+store_cond2+" GROUP BY storename"
        
        mysql.queryCustom(select_query).then(async function(result) {
            
            if (result.status == "1") {
                console2.log('Info', JSON.stringify(result.results), 'I am in store block');
                var total_epc = result.results;
                var delete_query_tb = '';
                var store_name = ''
                var insertbody = [];
                if(total_epc.length>0){
                    for (var i = 0; i < total_epc.length; i++) {
                        await consume_soh_automatic_fn(total_epc[i].storename);
                    }                    
                }        
            } else {
                console2.log('Error', JSON.stringify(result.error), '92-StockSummaryDump Select Store Query Status');
                if(res !== 'n/a'){
                    res.end(result.error);
                }
               
            }
        });
            
        

        if(res !== 'n/a'){
            res.status(200).send({
                error: "0",
                message: "Successfully Inserted !.",
            });
        }    
        
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '2416-StockSummaryDump22_consume_automatic CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception'+e, '2468-StockSummaryDump22_consume_automatic CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
//});  
}

function consume_soh_automatic_fn(var_storename) {
    return new Promise((resolve, reject) => {
        var storename = var_storename;

        Check_StockExists(storename).then(function(returnData){
            
            var ifexistsStock = returnData.ifexists;
            var StoreName2 = returnData.StoreName;
            var  CheckDate2 = dateFormat(now, "yyyy-mm-dd");
            
            var delete_query2 = "DELETE FROM epc_temp  WHERE  check_date < '" + CheckDate2 + "'  ";
            mysql.queryCustom(delete_query2);


            //console2.log('Info',  '' ,'after check store  Check_StockExists'+StoreName2);

            if(ifexistsStock == '0' ){

                console2.log('Info', '', 'ifexistsStock store'+StoreName2);
                
                const body = {
                    "StoreID": StoreName2
                };
                
                fetch(process.env.IOT_API_NEW + 'innovent/SOHPERSTORE', {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: {
                        'apikey': process.env.IOT_API_KEY,
                        'Content-Type': 'application/json'
                    },
                }).then(res => {
                    const contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new TypeError("Oops, we haven't got JSON!");
                    }
                    return res.json();
                }).catch(function(error) {
                    console2.log('Error', JSON.stringify(error), '90-StockSummaryDump API json validation');
                }).then((json) => {
                    var total_results = json.results;

                    console2.log_entry_unique("/soh",total_results,store_id);

                    console2.log('Info',  'Total reocrd check store'+StoreName2);


                    var total_items_stock = total_results.length;
                    var stockSummary_dump = [];
                    if (total_items_stock > 0) {


                        console2.log('Info', '', 'total_items_stock > 0');


                        var insert_query = "INSERT INTO stock_count_" + StoreName2 + " (storeid,departmentid,code," +
                            "initial,missing,stockcountdate,brand_name,color,`size`,`style`,`price`,`season`,`suppliername`,`totalprice`) VALUES ?"


                        for (var z = 0; z < total_results.length; z++) {

                            CheckDate = dateFormat(now, "yyyy-mm-dd");

                            if (total_results[z].StoreID == StoreName2) {

                                temp2 = [

                                    total_results[z].StoreID,
                                    total_results[z].DepartmentID,
                                    total_results[z].SOHSKU,
                                    total_results[z].SOHQTY,
                                    total_results[z].SOHQTY,
                                    CheckDate,
                                    escape(total_results[z].Brand),
                                    escape(total_results[z].Color),
                                    escape(total_results[z].Size),
                                    escape(total_results[z].Style),
                                    total_results[z].Price,
                                    total_results[z].Season,
                                    escape(total_results[z].SupplierName),
                                    total_results[z].TotalPrice

                                ];
                                stockSummary_dump.push(temp2);
                            }

                        }

                        aduit_Add.send(
                         'StockSummary Dump Job Run Successfully for Store '+StoreName2+' '+ 
                         'Total items inserted ' + total_items_stock + ' in store ' + StoreName2,
                         'audit_json', 
                         'StockSummaryDump', 
                         '', StoreName2, 
                         '',
                         StoreName2
                        );
                        var add_in_item_master = "Insert into product_item_master " +
                            "(`skucode`, `product_name`, `product_des`, `item_code`,  `departmentid`, `brand`," +
                            " `color`,`dept`, `departmentname`)" +
                            "SELECT code, code, code, code, departmentid,brand_name,color,departmentid,departmentid " +
                            " FROM stock_count_"+StoreName2+" SC " +
                            " WHERE 1 AND SC.stockcountdate='" + dateFormat(now, "yyyy-mm-dd") + "' " +
                            " AND sc.code not in (Select item_code from product_item_master)";
                        mysql.queryCustom(add_in_item_master).then(function(result) {

                        }).catch(function(error) {
                            console2.log('Error', JSON.stringify(error), '223-add_in_item_master');
                        });


                        console2.log('Info',  'Out Side The loop When We ready to insert in db'+StoreName2);


                        mysqlMain2.query(insert_query, [stockSummary_dump], function(err) {
                            if (err) {
                                resolve("2");
                                console2.log('Error', JSON.stringify(err), '153-StockSummary Dump InsertStoreViseQuery');
                            }else{
                                var now = new Date();

                                var  CheckDate22 = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                var  CheckDate23 = dateFormat(now, "yyyy-mm-dd");


                                var delect_query__iot = "DELETE FROM iot_notification WHERE storename = '"+StoreName2+"' "+ 
                               " AND iot_date = '"+CheckDate23+"' "
                                mysqlMain2.query(delect_query__iot, function(err) {

                                    

                                    var insert_query_iot = "INSERT INTO `iot_notification`(`storename`, `datetime`, `status`,`iot_date`)"+ 
                                    " VALUES ('"+StoreName2+"','"+CheckDate22+"','1','"+CheckDate23+"')"
                                    mysqlMain2.query(insert_query_iot, function(err,result) {
                                          if(err)
                                          {
                                            console.log(err);
                                          } 

                                          if(result)
                                          {
                                             //console.log(result);
                                          }  
                                        
                                    }); 
                                });


                                var duplication_soh = "CALL stock_count_duplication_"+StoreName2+"('"+StoreName2+"','"+CheckDate23+"');"
                                
                                setTimeout(function() {
                                    mysql.queryCustom(duplication_soh).then(function(result) {
                                    }).catch(function(error) {
                                        console2.log('Error', JSON.stringify(error), '2446-duplication_soh');   
                                    });
                                }, 3000);
                                resolve("2");
                            }

                        });
                    }else {
                        resolve("2");
                    }  


                });
             
            } else {
                resolve("2");
            }
        });
    });
}

//zeeshan here
function StockSummaryDump22(var_res,var_store_id){
//router.get('/StockSummaryDump', (req, res, next) => {
    

    try {
       var now = new Date();
       var res2 = var_res;
        // var session = req.session;
        var store_id = var_store_id;

        
        var check_store = '';
        var store_cond2 = '';
        if(store_id !='' && store_id != undefined)
        {
           store_cond2 = " and storename='"+store_id+"' ";  
           check_store = store_id;
        }

        
        var  CheckDate = dateFormat(now, "yyyy-mm-dd");

        
       
        check_store_process_status(check_store,res2).then(function(returnData33){

            var return_status      = returnData33.status2;
            var return_storename   = returnData33.store_name;
            var res4               =  returnData33.res;

            

            if(parseInt(return_status) == 1){
                

                var now = new Date();

                var  CheckDate22 = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                                   

                var update_query_status = "update store_process_status set status='0',datetime= '"+CheckDate22+"', iot_date='"+CheckDate+"' where  "+ 
                " storename = '"+return_storename+"'";
                           
                mysqlMain2.query(update_query_status, function(err) {
                    if(err){
                      console.log(err)   
                    }
                   
                }); 

                var select_query = "SELECT * FROM tb_store a where 1 "+store_cond2+" GROUP BY storename"
             
                mysql.queryCustom(select_query).then(function(result) {
                    

                   

                    if (result.status == "1") {
                        console2.log('Info', JSON.stringify(result.results), 'I am in store block');
                        var total_epc = result.results;
                        var delete_query_tb = '';
                        var store_name = ''
                        var insertbody = [];

                        for (var i = 0; i < total_epc.length; i++) {
                            
                            console2.log('Info','', 'before check store in loop 1 ===');
                            
                            Check_StockExists(total_epc[i].storename).then(function(returnData){
                                
                                //console.log(returnData);
                                var ifexistsStock = returnData.ifexists;
                                var StoreName2 = returnData.StoreName;
                                var  CheckDate2 = dateFormat(now, "yyyy-mm-dd");
                                

                               

                                var delete_query2 = "DELETE FROM epc_temp  WHERE  check_date < '" + CheckDate2 + "'  ";
                                mysql.queryCustom(delete_query2);


                                console2.log('Info',  '' ,'after check store  Check_StockExists'+StoreName2);


                               


                                if(ifexistsStock == '0' ){



                                    

                                    console2.log('Info', '', 'ifexistsStock store'+StoreName2);
                                    
                                    const body = {
                                        "StoreID": StoreName2
                                    };
                                    
                                    fetch(process.env.IOT_API_NEW + 'innovent/SOHPERSTORE', {
                                        method: 'post',
                                        body: JSON.stringify(body),
                                        headers: {
                                            'apikey': process.env.IOT_API_KEY,
                                            'Content-Type': 'application/json'
                                        },
                                    }).then(res => {
                                        const contentType = res.headers.get('content-type');
                                        if (!contentType || !contentType.includes('application/json')) {
                                            throw new TypeError("Oops, we haven't got JSON!");
                                        }
                                        return res.json();
                                    }).catch(function(error) {
                                        console2.log('Error', JSON.stringify(error), '90-StockSummaryDump API json validation');
                                    }).then((json) => {
                                        var total_results = json.results;

                                        console2.log_entry_unique("/soh",total_results,store_id);

                                        console2.log('Info',  'Total reocrd check store'+StoreName2);


                                        var total_items_stock = total_results.length;
                                        var stockSummary_dump = [];
                                        if (total_items_stock > 0) {



                                          
                                            console2.log('Info', '', 'total_items_stock > 0');


                                            var insert_query = "INSERT INTO stock_count_" + StoreName2 + " (storeid,departmentid,code," +
                                                "initial,missing,stockcountdate,brand_name,color,`size`,`style`,`price`,`season`,`suppliername`,`totalprice`,`supplier_item_no`) VALUES ?"


                                            for (var z = 0; z < total_results.length; z++) {

                                                CheckDate = dateFormat(now, "yyyy-mm-dd");

                                                if (total_results[z].StoreID == StoreName2) {

                                                    temp2 = [

                                                        total_results[z].StoreID,
                                                        total_results[z].DepartmentID,
                                                        total_results[z].SOHSKU,
                                                        total_results[z].SOHQTY,
                                                        total_results[z].SOHQTY,
                                                        CheckDate,
                                                        escape(total_results[z].Brand),
                                                        escape(total_results[z].Color),
                                                        escape(total_results[z].Size),
                                                        escape(total_results[z].Style),
                                                        total_results[z].Price,
                                                        total_results[z].Season,
                                                        escape(total_results[z].SupplierName),
                                                        total_results[z].TotalPrice,
                                                        total_results[z].Supplier_Item_No

                                                    ];
                                                    stockSummary_dump.push(temp2);
                                                }
                                               

                                            }

                                            aduit_Add.send(
                                             'StockSummary Dump Job Run Successfully for Store '+StoreName2+' '+ 
                                             'Total items inserted ' + total_items_stock + ' in store ' + StoreName2,
                                             'audit_json', 
                                             'StockSummaryDump', 
                                             '', StoreName2, 
                                             '',
                                             StoreName2
                                            );
                                            var add_in_item_master = "Insert into product_item_master " +
                                                "(`skucode`, `product_name`, `product_des`, `item_code`,  `departmentid`, `brand`," +
                                                " `color`,`dept`, `departmentname`)" +
                                                "SELECT code, code, code, code, departmentid,brand_name,color,departmentid,departmentid " +
                                                " FROM stock_count_"+StoreName2+" SC " +
                                                " WHERE 1 AND SC.stockcountdate='" + dateFormat(now, "yyyy-mm-dd") + "' " +
                                                " AND sc.code not in (Select item_code from product_item_master)";
                                            mysql.queryCustom(add_in_item_master).then(function(result) {

                                            }).catch(function(error) {

                                                console2.log('Error', JSON.stringify(error), '223-add_in_item_master');
                                                // res.end(error);
                                                // res.end(error);
                                            });


                                            console2.log('Info',  'Out Side The loop When We ready to insert in db'+StoreName2);


                                            mysqlMain2.query(insert_query, [stockSummary_dump], function(err) {
                                                if (err) {

                                                    console2.log('Error', JSON.stringify(err), '153-StockSummary Dump InsertStoreViseQuery');

                                                    res4.status(200).send({
                                                        error: "0",
                                                        message: "Error in insert query for "+StoreName2,
                                                    });

                                                }else{

                                                    //console.log('=========================')
                                                    var now = new Date();

                                                    var  CheckDate22 = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                                    var  CheckDate23 = dateFormat(now, "yyyy-mm-dd");


                                                    var delect_query__iot = "DELETE FROM iot_notification WHERE storename = '"+StoreName2+"' "+ 
                                                   " AND iot_date = '"+CheckDate23+"' "
                                                    mysqlMain2.query(delect_query__iot, function(err) {

                                                        var update_query_status = "update store_process_status set status='1',datetime= '"+CheckDate22+"' WHERE  "+ 
                                                        " iot_date='"+CheckDate23+"' and storename = '"+StoreName2+"'";
                                                       // console.log(update_query_status)
                                                        mysqlMain2.query(update_query_status, function(err) {
                                                            if(err){
                                                                console.log(err)
                                                            }
                                                        }); 

                                                        var insert_query_iot = "INSERT INTO `iot_notification`(`storename`, `datetime`, `status`,`iot_date`)"+ 
                                                        " VALUES ('"+StoreName2+"','"+CheckDate22+"','1','"+CheckDate23+"')"
                                                        mysqlMain2.query(insert_query_iot, function(err,result) {
                                                              if(err)
                                                              {
                                                                console.log(err);
                                                              } 

                                                              if(result)
                                                              {
                                                                 //console.log(result);
                                                              }  
                                                            
                                                        }); 
                                                    });

                                                    if(res4 !== 'n/a'){
                                                       var  CheckDate23 = dateFormat(now, "yyyy-mm-dd");
                                                        var update_query_status = "update store_process_status set status='1',datetime= '"+CheckDate22+"' WHERE  "+ 
                                                        " iot_date='"+CheckDate23+"' and storename = '"+StoreName2+"'";
                                                        console.log(update_query_status)
                                                        mysqlMain2.query(update_query_status, function(err) {
                                                            if(err){
                                                                console.log(err)
                                                            }
                                                        }); 
                                                        res4.status(200).send({
                                                            error: "0",
                                                            message: "Successfully Inserted SOH For "+StoreName2,
                                                        });
                                                    } 

                                                    var duplication_soh = "CALL stock_count_duplication_"+StoreName2+"('"+StoreName2+"','"+CheckDate23+"');"
                                                    
                                                    setTimeout(function() {
                                                        mysql.queryCustom(duplication_soh).then(function(result) {
                                                        }).catch(function(error) {

                                                            console2.log('Error', JSON.stringify(error), '2446-duplication_soh');   
                                                        });
                                                    }, 3000); 
                                                   


                                                }

                                            });
                                        } 
                                        else
                                        {
                                            if(res4 !== 'n/a'){
                                                res4.status(200).send({
                                                    error: "0",
                                                    message: "IOT platform no soh",
                                                });
                                            } 

                                        }   


                                    })
                                 
                                }
                                else
                                {
                                    if(res4 !== 'n/a'){
                                        var  CheckDate23 = dateFormat(now, "yyyy-mm-dd");
                                        var update_query_status = "update store_process_status set status='1',datetime= '"+CheckDate22+"' WHERE  "+ 
                                        " iot_date='"+CheckDate23+"' and storename = '"+StoreName2+"'";
                                        console.log(update_query_status)
                                        mysqlMain2.query(update_query_status, function(err) {
                                            if(err){
                                                console.log(err)
                                            }
                                        }); 
                                        res4.status(200).send({
                                            error: "0",
                                            message: "SOH already exist please clean it first",
                                        });
                                    } 
                                }
                                

                                    
                            });   
                        }
                    } else {
                        console2.log('Error', JSON.stringify(result.error), '92-StockSummaryDump Select Store Query Status');
                        if(res !== 'n/a'){
                            res.end(result.error);
                        }
                       
                    }
                })
            }else{
                console.log('Server busy in other calculation please try again later .')
                return res4.end(
                
                    "Server busy in other calculation please try again later ."
                );
            }
        });

        
        
    } catch (e) {
        console2.log('Error', 'Catch Exception', '207-StockSummaryDump CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '214-StockSummaryDump CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
//});  
}

function update_product_item_sp(){

    var call_update_procedure = "CALL product_item_master_check();"

    mysqlMain2.query(call_update_procedure, function(err) {
        if (err) {


            console2.log('Error', JSON.stringify(err), 'issue with update_product_item_sp ');
        }

    });

}


router.post('/StockSummaryDump', (req, res, next) => {
    
    console2.execution_info('StockSummaryDump');

    try {
        var store_id = req.body.store_id;

        StockSummaryDump22(res,store_id);

    } catch (e) {
        console2.log('Error', 'Catch Exception', '1219-EpcDump Route CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1226-EpcDump Route CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});

router.post('/StockSummaryDump_curl', (req, res, next) => {
    console2.execution_info('StockSummaryDump_curl');
    var token       =   req.headers.token;
    var access_token = mysql.globals.access_token;
    var store_id = '';
    if (token !== undefined && token !== '') {
        if (token == access_token) {
            
            store_id = req.body.StoreID;
            if (store_id !== undefined && store_id !== '' && store_id !== 'undefined') {

                try {

                    // console2.execution_info('StockSummaryDump_curl');
                    StockSummaryDump22(res,store_id);
                    /*res.status(500).send({
                        error: '1',
                        message: 'aaaaaaaaaaaaaaSomeThing Wrong !'
                    });*/
                
                } catch (e) {
                    console2.log('Error', 'Catch Exception', '1226-EpcDump Route CronJob');
                    res.status(500).send({
                        error: '1',
                        message: 'SomeThing Wrong !'
                    });
                }
            } else {
                res.status(400).send({
                    message: "Invalid StoreID !",
                });    
            }

        }
        else {
            res.status(400).send({
                message: "Invalid Token !",
            });
        }
    } else {
        res.status(400).send({
            message: "Please Enter token !",
        });
    }
    
});
function send_curl_for_soh(store_name)
{
    var store_name_var = store_name;
    return new Promise((resolve, reject) => {
        var site_url = process.env.SITE_LINK;
        request({
            url: site_url+'/api/1.0.0/cronjobs/StockSummaryDump_curl',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token':'innovent@123',
            },
            body: JSON.stringify({
                "StoreID": store_name_var
            })
        }, function(error, response, body){
            if(error) {
                console.log(error);
                resolve("1");
            } else {

                console.log(response.statusCode, body);
                resolve("1");
            }
        });

       
    });
    
}
router.post('/StockSummaryDump_curl_fn', async (req, res, next) => { 
    console2.execution_info('StockSummaryDump_curl_fn');
    try {
        
        var select_query = "SELECT * FROM tb_store a where 1 GROUP BY storename"
        mysql.queryCustom(select_query).then(async function(result) {
            
            if (result.status == "1") {

                var total_epc = result.results;

                if(total_epc.length>0){
                    var request = require('request');

                    for (var i = 0; i < total_epc.length; i++) {
                        await send_curl_for_soh(total_epc[i].storename);
                    }
                    res.status(200).send({
                        error: '0',
                        message: 'All done!'
                    });
                    
                } else {
                    console2.log('Error', 'Catch Exception'+e, '2468-StockSummaryDump_curl_fn CronJob');
                    res.status(500).send({
                        error: '1',
                        message: 'SomeThing Wrong !'
                    });
                }

            } else {

                console2.log('Error', JSON.stringify(result.error), '92-StockSummaryDump Select Store Query Status');
                res.end(result.error);
               
            }
        });   
        
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '2468-StockSummaryDump_curl_fn CronJob');
        res.status(500).send({
            error: '1',
            message: 'SomeThing Wrong !'
        });
    }
    
});

function StockSummaryDump_curl_fn() {
    try {
        
        var select_query = "SELECT * FROM tb_store where 1 GROUP BY storename"
        mysql.queryCustom(select_query).then(async function(result) {
            
            if (result.status == "1") {

                var total_epc = result.results;

                if(total_epc.length>0){
                    var request = require('request');

                    for (var i = 0; i < total_epc.length; i++) {
                        await send_curl_for_soh(total_epc[i].storename);
                    }
                    
                }

            } else {
                console2.log('Error', JSON.stringify(result.error), '92-StockSummaryDump Select Store Query Status');
            }
        });   
        
    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '2468-StockSummaryDump_curl_fn CronJob');
    }
}

// cron.schedule('1 42 19 * * *', () => {
//     console2.execution_info('cron_StockSummaryDump_curl_fn');
//     let timeInMs = Math.random() * (2000);
//     setTimeout(StockSummaryDump_curl_fn,timeInMs);
// });


function CleanSOH(res,store_id,password){
   

    var now = new Date();
    var date = dateFormat(now, "yyyy-mm-dd");
    var storename = store_id;
    var password22 = password
    var check_pass = process.env.SOH_PWD;
    if(password22 == check_pass){

        aduit_Add.send(
            'Clean Soh job run for Store '+storename+' '+ 
            'Clean Soh job successfully for Store '+storename+'',
            'audit_json', 
            'Soh Clean', 
            '', storename, 
            '',
            storename
        );
        //console.log(storename);
        var new_query_stock_store = "SELECT SUM(initial) AS onhandtotal , "+ 
                                " SUM((counted)) AS inventroycount,'"+storename+"' as mystore "+ 
                                " from stock_count_"+storename+" where 1  and stockcountdate = '"+date+"';"
                       
        mysql.queryCustom(new_query_stock_store).then(function(result){

            if (result.status == "1") {

                var response_data2 = result.results;
                //console.log(response_data2[0].inventroycount);
                // if(response_data2[0].inventroycount == '0' || response_data2[0].inventroycount == null){

                   var delete_query = "DELETE  "+ 
                                " from stock_count_"+storename+" where 1  and stockcountdate = '"+date+"';" 
                    //console.log(delete_query)   ;         
                    mysql.queryCustom(delete_query).then(function(result){     
                        

                    }).catch(function(error) {
                        console2.log('Error', JSON.stringify(error), '6612-delete_query');
                        res.end(JSON.stringify(error));
                    });        

                //}  
               res.end(JSON.stringify('Clean Successfully !'));

                  
            
            } else {

                console2.log('Error', JSON.stringify(result.error), '217-CleanSOH');
                // res.end(error);
                //res.end(result.error);
            }

        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '6612-CleanSOH');
            res.end(JSON.stringify(error));
        });
    }else{

        res.end(JSON.stringify('Incorrect Password !'));
    }    
        //res.end('oooooooo');
}

router.post('/CleanSOH',authenticationMidleware(), (req, res, next) => {
    console2.execution_info('CleanSOH');
    try {
        var store_id = req.body.store_id;
        var password = req.body.password;
        //console.log('111111'+password)

        CleanSOH(res,store_id,password);

    } catch (e) {
        console2.log('Error', 'Catch Exception', '1219-EpcDump Route CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1226-EpcDump Route CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.get('/check_date', (req, res, next) => {
    console2.execution_info('check_date');
    var now = new Date();
    var CheckDate = dateFormat(now, "yyyy-mm-dd");
    res.end(CheckDate);

});

function update_last_five_mint_record(){

    const now = new Date();
    var now_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

    var update_query = "UPDATE  `store_process_status` SET status = '1' WHERE datetime <  ADDDATE('"+now_time+"', INTERVAL -5 MINUTE);"
    //console.log(update_query);
    mysqlMain2.query(update_query, function(err) {
        if(err){
           console.log(err); 
        }
        
    });
}

function EpcDump(token, myid, res) {

    try {
        
        var token = token;

        var myid = myid;
        var res = res;

        const now = new Date();
        var CheckDate = "";
        var body = "";

        var epc_temp_data_array = [];
        var epc_details_data_array = [];
        var access_token = mysql.globals.access_token;

        //console.log(token);
        if (token !== undefined && token !== '') {

            if (token == access_token) {

                var cond = '';
                if (myid > 0) {
                    cond = " and id = '" + myid + "' ";
                } else {
                    cond = " and status = '0' ";
                }

               
                var select_query = "SELECT * FROM cronjob_taks  where 1 " + cond +" and  `DateTIme` < ADDDATE(NOW(), INTERVAL -10 SECOND) order by id asc LIMIT 0,10";
                ///var select_query = "SELECT * FROM cronjob_taks  where id=15 LIMIT 0,10";

               
                //console.log(select_query);

                CheckDate = dateFormat(now, "yyyy-mm-dd");


                var delect_query_3 = "DELETE from epc_temp where check_date < '" + CheckDate + "' ";

                mysqlMain2.query(delect_query_3, function(err) {});


                mysql.queryCustom(select_query).then(function(result) {

                    if (result.status == "1") {
                        var total_epc = result.results;

                        var abc = '';
                        var message = '';

                        var remarks_string = '';

                       // console.log(total_epc);
                        for (var i = 0; i < total_epc.length; i++) {


                            var jj = i;
                            var total_inner_epc = total_epc;

                            var StockStore_id = total_inner_epc[jj].store_id;
                            var Retail_CycleCountID = total_inner_epc[jj].Retail_CycleCountID;

                            var destinationStore = total_inner_epc[jj].destinationStore;
                            var process_types = total_epc[i].process_type;

                            if (total_epc[i].process_type == 'CycleCount') {
                                aduit_Add.send(
                                    'CycleCount job running for store '+StockStore_id, 
                                    'audit_json', 
                                    'CycleCount', 
                                    '', 
                                    StockStore_id, 
                                    '',
                                    Retail_CycleCountID
                                );


                                const body = {
                                    "StoreID": total_epc[i].store_id
                                   
                                };

                                CheckDate = dateFormat(now, "yyyy-mm-dd");
                                
                                
                                fetch(process.env.IOT_API_NEW + 'innovent/GETCOUNTEDITEMS', {
                                    method: 'post',
                                    body: JSON.stringify(body),
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
                                    if(error){
                                        console2.log('Error', JSON.stringify(error), '902-EpcDump API CycleCount json validation');   
                                    }
                                    
                                })
                                .then((json) => {

                                    
                                    //console.log(total_results);
                                    //console.log("(((((((((((((((9"+StockStore_id);
                                    //EpcDump_22(StockStore_id,total_results);


                                        var result_send = json;
                                        var total_results = json.results;
                                        var total_item_cycle_Count = total_results.length;
                                        //console.log(total_results)
                                       
                                        if (total_item_cycle_Count > 0) {
                                            //console.log('22222222222222222222222')
                                            EpcDump_22(StockStore_id,result_send,res);

                                            var string;
                                            var total_results = json.results;

                                            // console.log(total_results.length);

                                            var string;
                                            var update_query = '';
                                            var stinglower = '';


                                            var update_query22 = '';
                                            var zone = '';
                                            var brandname = '';
                                            var ColorName = '';
                                            var Size = '';
                                            var skuss = '';

                                            var insert_query_new = '';
                                            var store_vise_update = '';
                                            var CheckDate = dateFormat(now, "yyyy-mm-dd");
                                            var epc_query_new = '';



                                            for (var c = 0; c < total_results.length; c++) {
                                                //console.log("+++>>>"+total_results.length);

                                                var abc2 = total_results;
                                                stinglower = abc2[c].zone;

                                                string = stinglower.toLowerCase();

                                                string = string.split(' ').join('');

                                                zone = string;


                                                brandname = escape(abc2[c].Brand);
                                                ColorName = abc2[c].Color;
                                                Size = abc2[c].Size;



                                              

                                                temp2 = [

                                                    abc2[c].TagID,
                                                    abc2[c].SKU_original,

                                                    Retail_CycleCountID,

                                                    abc2[c].DepartmentID,

                                                    brandname,
                                                    ColorName,
                                                    Size,

                                                    CheckDate,
                                                    StockStore_id,
                                                    zone,
                                                    process_types,


                                                ];


                                                epc_details_data_array.push(temp2);


                                                var CheckDate2 = dateFormat(now, "yyyy-mm-dd");

                                               


                                                epc_query_new += "CALL add_epc_rec('"+Retail_CycleCountID+"', '" + StockStore_id + "','" + abc2[c].TagID + "'," +
                                                    "'" + abc2[c].SKU_original + "','" + remove_single_qoute(abc2[c].DepartmentID) + "', " +
                                                    "'" + brandname + "','" + remove_single_qoute(abc2[c].Color) + "','" + remove_single_qoute(abc2[c].Size) + "','" +
                                                    CheckDate2 + "');";


                                            }
                                            //console.log('CycleCount Job run Successfully','audit_json','CycleCount total Record inserted '+total_item_cycle_Count,'',StockStore_id,'');
                                            aduit_Add.send(
                                                'CycleCount Job run successfully for store '+StockStore_id+' '+ 
                                                'CycleCount total Record inserted '+ total_item_cycle_Count, 
                                                'audit_json', 
                                                process_types, 
                                                '', 
                                                StockStore_id,
                                                '',
                                                ''
                                            );


                                            var insertquerydetails = "INSERT INTO epc_detail (`epc`, `item_code`, `Retail_CycleCountID`, " +
                                                " `department`, `brand`, `color`, `size`,`date`,`store_id`,`zone`,`action_done`) " +
                                                " VALUES ? ";



                                                mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {


                                                    mysqlMain2.query(epc_query_new, function(err) {
                                                        if (err) {
                                                            console.log(err)
                                                            console2.log('Error', JSON.stringify(err), '416-EpcDump API CycleCount');
                                                        }

                                                    });

                                                });

                                               

                                                //console.log("i am done22"); 

                                            



                                            var CheckDate = dateFormat(now, "yyyy-mm-dd");
                                            var updateDate = " UPDATE tb_store set stockcountdate='" + CheckDate +

                                                "' WHERE storename='" + StockStore_id + "' ; "

                                            mysql.queryCustom(updateDate).then(function(result) {

                                            }).catch(function(error) {
                                                if(error){
                                                  console2.log('Error', JSON.stringify(error), '482-EpcDump API ASN json validation');  
                                                }
                                                
                                            });
                                        }

                                });
                             
                            }    
                            

                            /*-------------------------------/cycle count-----------------------------------------*/


                            if (total_inner_epc[i].process_type == 'packing') {






                                aduit_Add.send(
                                    'packing Job running for store '+StockStore_id, 
                                    'audit_json', 
                                    'packing',
                                    '', 
                                    StockStore_id,
                                    '',
                                    Retail_CycleCountID
                                );

                                abody = {

                                    //   "OriginStoreID": total_epc[i].store_id ,
                                    "ASN": total_epc[i].Retail_CycleCountID,
                                    "Process": "packing",
                                    "ProcessStatus": "open"

                                };
                                console.log("tttttttttttttt");
                                console.log(process.env.IOT_API_NEW + 'innovent/SUPPLYCHAINVERIFY');
                                fetch(process.env.IOT_API_NEW + 'innovent/SUPPLYCHAINVERIFY', {
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
                                        if(error){
                                            console2.log('Error', JSON.stringify(error), '902-EpcDump API ASN json validation');   
                                        }
                                        
                                    })
                                    .then((json) => {

                                        //console.log(json);
                                        var total_masterasn = '';
                                        var location = '';
                                        var destination = '';
                                        var asn = '';
                                        var OriginStoreID = '';
                                        var DestinationStoreID = '';
                                        var process_status = '';
                                        var tagid = '';
                                        var SKU = '';
                                        var DepartmentID = '';
                                        var Brand = '';

                                        var abody = '';
                                        var fetch_api = '';
                                        var asn_epc_rec = [];

                                        var total_results = json.results;
                                        //console.log(total_results);
                                        var total_asn_record = total_results.length;
                                        if (total_asn_record > 0) {

                                            var CheckDate = '';
                                            var select = "";
                                            var update_query = "";
                                            var update_query_master = '';

                                            var my_update = '';

                                            var check_count = '';
                                            var brandname = '';
                                            var checkLength = total_results.length;
                                            var epc_query_new2 = '';
                                            var checkdatenow = '';
                                            var dateTime = '';
                                            var my_insertgobal = '';
                                            var repetition_delete  = '';
                                            var remarks_string_new ='';

                                            for (var z = 0; z < total_results.length; z++) {


                                                dateTime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");


                                                if (total_results[z].Brand != "") {
                                                    brandname = escape(total_results[z].Brand);
                                                } else {
                                                    brandname = 'na';
                                                }


                                                
                                                remarks_string_new = " , packing_remarks= '" + total_results[z].remarks + "' , packing_date = '" + dateTime + "' ";
                                                

                                                CheckDate = dateFormat(now, "yyyy-mm-dd");



                                                temp = [

                                                    total_results[z].OriginStoreID,
                                                    total_results[z].ProcessStatus,
                                                    total_results[z].Process,
                                                    total_results[z].DepartmentID,
                                                    total_results[z].TagID,
                                                    total_results[z].DestinationStoreID,
                                                    total_results[z].ASN,
                                                    total_results[z].OriginStoreID,
                                                    CheckDate,
                                                    escape(total_results[z].Brand),
                                                    total_results[z].SKU_original,

                                                ];
                                                asn_epc_rec.push(temp);


                                                checkdatenow = dateFormat(now, "yyyy-mm-dd");
                                                //console.log(asn_epc_rec);
                                                temp2 = [

                                                    total_results[z]["thing.headers"].serialNumber,
                                                    total_results[z].SKU_original,
                                                    Retail_CycleCountID,
                                                    total_results[z].DepartmentID,
                                                    escape(total_results[z].Brand),
                                                    'na',
                                                    'na',
                                                    checkdatenow,
                                                    total_results[z].OriginStoreID,
                                                    'na',
                                                    process_types,
                                                ];

                                                epc_details_data_array.push(temp2);


                                                //CheckDate = dateFormat(total_results[0].ASNtimestamp.value, "yyyy-mm-dd");

                                                epc_query_new2 += "CALL add_epc_rec('" + Retail_CycleCountID + "'," +
                                                    " '" + StockStore_id + "','" + total_results[z].TagID + "'," +
                                                    "'" + total_results[z].SKU_original + "','" + total_results[z].DepartmentID + "', " +
                                                    "'" + escape(total_results[z].Brand) + "','0','0','" +
                                                    CheckDate + "');";

                                                var j = z;

                                                total_masterasn = total_results;
                                                location = total_masterasn[j].Original_Location;
                                                destination = total_masterasn[j].Destination_Location;
                                                asn = total_masterasn[j].ASN;
                                                OriginStoreID = total_masterasn[j].OriginStoreID;
                                                DestinationStoreID = total_masterasn[j].DestinationStoreID;
                                                process_status = total_masterasn[j].Process
                                                tagid = total_masterasn[j].TagID;
                                                SKU = total_masterasn[j].SKU;
                                                DepartmentID = total_masterasn[j].DepartmentID;
                                                Brand = escape(total_masterasn[j].Brand);

                                                repetition_delete += "CALL asn_fix_321 ('"+total_results[z].ASN+"','"+total_results[z].Process+"');";


                                            }

                                            aduit_Add.send(
                                                process_types+' job run successfully for store '+StockStore_id+' '+
                                                'Total IBT Inserted '+total_asn_record, 
                                                'audit_json',
                                                process_types,
                                                '',
                                                StockStore_id,
                                                '',
                                                Retail_CycleCountID
                                            );

                                            my_insertgobal = " INSERT INTO  asn_master (`date`, `asn`,`status`)" +
                                                "SELECT * FROM (SELECT '" + CheckDate + "','" + asn + "','" + total_results[0].ProcessStatus + "') AS tmp " +
                                                " WHERE NOT EXISTS (SELECT asn FROM asn_master " +
                                                " WHERE asn = '" + asn + "'  ) LIMIT 1; ";


                                                //console.log(my_insertgobal);

                                            mysqlMain2.query(my_insertgobal, function(error, results, fields) {

                                                if(error){
                                                 console2.log('Error', JSON.stringify(error), '670-Insert in IBT master process name ' + process_types + ' ');
                                                   
                                                }
                                                
                                                //console.log(JSON.stringify(error));
                                            });




                                            var asn_data_str = "INSERT INTO asn_items (" +

                                                " original_location," +
                                                " process_status, " +
                                                " process," +
                                                " department," +
                                                " tag_id, " +
                                                " destination_location," +
                                                " asn," +
                                                " store_id, " +
                                                " date," +
                                                " brand," +
                                                " sku " + ") VALUES ?";

                                            var insertquerydetails = "INSERT INTO epc_detail (`epc`, " +
                                                "`item_code`, `Retail_CycleCountID`, " +
                                                " `department`, `brand`, `color`, `size`,`date`," +
                                                "`store_id`,`zone`,`action_done`) " +
                                                " VALUES ? ";

                                            //console.log(asn_epc_rec);    
                                            mysqlMain2.query(asn_data_str, [asn_epc_rec], function(err) {

                                                //console.log(">>>>>>>>"+JSON.stringify(err));



                                                mysqlMain2.query(epc_query_new2, function(err) {

                                                    mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {
                                                        if(err){
                                                           console2.log('Error', JSON.stringify(err), '475-EpcDump API insert in epc details process name ' + process_types + ' '); 
                                                        }
                                                        
                                                        //console.log(err);
                                                    });

                                                    //console.log(err);
                                                });

                                                if (err) {
                                                    console2.log('Error', JSON.stringify(err), '715-EpcDump API  process name ' + process_types + ' ');
                                                    //console.log(err);
                                                }
                                                var today_date = dateFormat(now, "yyyy-mm-dd");

                                                var desti = ''

                                                if (DestinationStoreID == '') {

                                                    desti = '';

                                                } else {

                                                    desti = DestinationStoreID;

                                                }
                                                var source = ''
                                                if (total_inner_epc[0].process_type == 'packing' || total_inner_epc[0].process_type == 'shipping') {
                                                    source = " source='" + OriginStoreID + "', "
                                                }


                                                var update_query = "update asn_master set " + source +
                                                    " `date` = '" + today_date + "', " +
                                                    " destination = '" + desti + "'," +
                                                    " packed_item = (select COUNT(process) from asn_items where " +
                                                    " process='packing' AND asn = '" + asn + "' and is_deleted='0' ), " +
                                                    " status = '" + process_status + "'" + remarks_string_new +
                                                    " WHERE asn = '" + asn + "';"
                                                //console.log('update_queryddddddddddddddd'+update_query);
                                                mysql.queryCustom(update_query).then(function(result) {
                                                    if (result.status == "1") {


                                                            setTimeout(function() {


                                                                mysqlMain2.query(repetition_delete, function(err) {
                                                                    if (err) {


                                                                    console2.log('Error', JSON.stringify(err), '427-repetition_delete API  repetition_delete');
                                                                    }

                                                                });

                                                            }, 3000);  

                                                    } else {
                                                        if(result.error){
                                                         console2.log('Error', JSON.stringify(result.error), '752-EpcDump API  process name ' + process_types + ' ');   
                                                        }
                                                        
                                                        //res.end(result.error);
                                                    }
                                                }).catch(function(error) {
                                                    if(error){
                                                        console2.log('Error', JSON.stringify(error), '756-EpcDump API   process name ' + process_types + ' ');   
                                                    }
                                                    
                                                });
                                            })
                                        }
                                    })
                                    .catch(err => {

                                        var update_cronjob_error = '';
                                         //console.log('...................'+err);
                                        if(err){
                                          console2.log('Error', err, '770-EpcDump API api catch error in ' + process_types + '');
                                        }
                                        

                                        update_cronjob_error += "UPDATE cronjob_taks set " +
                                            "status='0' " +
                                            " where process_type = '" + process_types + "' and Retail_CycleCountID ='" + Retail_CycleCountID + "';"

                                        mysql.queryCustom(update_cronjob_error).then(function(result) {
                                            if (result.status == "1") {
                                                //res.end("All Done");           
                                            } else {
                                                //res.end(result.error);
                                            }
                                        });


                                    });



                            }
                            if (total_inner_epc[i].process_type == 'shipping' ) {



                                

                               
                                aduit_Add.send('Shipping Job running for store '+StockStore_id, 
                                    'audit_json', 
                                    'shipping',
                                    '',
                                    StockStore_id,
                                    '',
                                    Retail_CycleCountID
                                );

                                abody = {
                                    "ASN": total_epc[i].Retail_CycleCountID,
                                    // "DestinationStoreID":total_epc[i].destinationStore,
                                    "Process": "shipping",
                                    "ProcessStatus": "intransit"
                                };
                           
                                 
                               
                                fetch(process.env.IOT_API_NEW + 'innovent/SUPPLYCHAINVERIFY', {
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
                                        if(error){
                                            console2.log('Error', JSON.stringify(error), '902-EpcDump API ASN json validation');   
                                        }
                                        
                                    })
                                    .then((json) => {

                                        var total_masterasn = '';
                                        var location = '';
                                        var destination = '';
                                        var asn = '';
                                        var OriginStoreID = '';
                                        var DestinationStoreID = '';
                                        var process_status = '';
                                        var tagid = '';
                                        var SKU = '';
                                        var DepartmentID = '';
                                        var Brand = '';

                                        var abody = '';
                                        var fetch_api = '';
                                        var asn_epc_rec = [];


                                        var total_results = json.results;
                                        //console.log(total_results);
                                        var total_asn_record = total_results.length;
                                        if (total_asn_record > 0) {

                                            var CheckDate = '';
                                            var select = "";
                                            var update_query = "";
                                            var update_query_master = '';

                                            var my_update = '';

                                            var check_count = '';
                                            var brandname = '';
                                            var checkLength = total_results.length;
                                            var epc_query_new2 = '';
                                            var checkdatenow = '';
                                            var dateTime = '';
                                            var my_insertgobal = '';
                                            var repetition_delete  = '';
                                            var remarks_string_new = '';

                                            for (var z = 0; z < total_results.length; z++) {


                                                dateTime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");


                                                if (total_results[z].Brand != "") {
                                                    brandname = escape(total_results[z].Brand);
                                                } else {
                                                    brandname = 'na';
                                                }

                                                remarks_string_new = " , shipping_remarks= '" + total_results[z].remarks + "' , shipping_date= '" + dateTime + "' ";
                                               

                                                CheckDate = dateFormat(now, "yyyy-mm-dd");



                                                temp = [

                                                    total_results[z].OriginStoreID,
                                                    total_results[z].ProcessStatus,
                                                    total_results[z].Process,
                                                    total_results[z].DepartmentID,
                                                    total_results[z].TagID,
                                                    total_results[z].DestinationStoreID,
                                                    total_results[z].ASN,
                                                    total_results[z].OriginStoreID,
                                                    CheckDate,
                                                    escape(total_results[z].Brand),
                                                    total_results[z].SKU_original,

                                                ];
                                                asn_epc_rec.push(temp);


                                                checkdatenow = dateFormat(now, "yyyy-mm-dd");
                                                //console.log(asn_epc_rec);
                                                temp2 = [

                                                    total_results[z]["thing.headers"].serialNumber,
                                                    total_results[z].SKU_original,
                                                    Retail_CycleCountID,
                                                    total_results[z].DepartmentID,
                                                    escape(total_results[z].Brand),
                                                    'na',
                                                    'na',
                                                    checkdatenow,
                                                    total_results[z].OriginStoreID,
                                                    'na',
                                                    process_types,
                                                ];

                                                epc_details_data_array.push(temp2);


                                                //CheckDate = dateFormat(total_results[0].ASNtimestamp.value, "yyyy-mm-dd");

                                                epc_query_new2 += "CALL add_epc_rec('" + Retail_CycleCountID + "'," +
                                                    " '" + StockStore_id + "','" + total_results[z].TagID + "'," +
                                                    "'" + total_results[z].SKU_original + "','" + total_results[z].DepartmentID + "', " +
                                                    "'" + escape(total_results[z].Brand) + "','0','0','" +
                                                    CheckDate + "');";

                                                var j = z;

                                                total_masterasn = total_results;
                                                location = total_masterasn[j].Original_Location;
                                                destination = total_masterasn[j].Destination_Location;
                                                asn = total_masterasn[j].ASN;
                                                OriginStoreID = total_masterasn[j].OriginStoreID;
                                                DestinationStoreID = total_masterasn[j].DestinationStoreID;
                                                process_status = total_masterasn[j].Process
                                                tagid = total_masterasn[j].TagID;
                                                SKU = total_masterasn[j].SKU;
                                                DepartmentID = total_masterasn[j].DepartmentID;
                                                Brand = escape(total_masterasn[j].Brand);

                                                repetition_delete += "CALL asn_fix_321 ('"+total_results[z].ASN+"','"+total_results[z].Process+"');";


                                            }

                                            aduit_Add.send(
                                                process_types+' job run successfully for store '+StockStore_id+' '+
                                                'Total IBT Inserted '+total_asn_record, 
                                                'audit_json',
                                                process_types,
                                                '',
                                                StockStore_id,
                                                '',
                                                Retail_CycleCountID
                                            );

                                            my_insertgobal = " INSERT INTO  asn_master (`date`, `asn`,`status`)" +
                                                "SELECT * FROM (SELECT '" + CheckDate + "','" + asn + "','" + total_results[0].ProcessStatus + "') AS tmp " +
                                                " WHERE NOT EXISTS (SELECT asn FROM asn_master " +
                                                " WHERE asn = '" + asn + "'  ) LIMIT 1; ";


                                                //console.log(my_insertgobal);

                                            mysqlMain2.query(my_insertgobal, function(error, results, fields) {

                                                if(error){
                                                 console2.log('Error', JSON.stringify(error), '670-Insert in IBT master process name ' + process_types + ' ');
                                                   
                                                }
                                                
                                                //console.log(JSON.stringify(error));
                                            });




                                            var asn_data_str = "INSERT INTO asn_items (" +

                                                " original_location," +
                                                " process_status, " +
                                                " process," +
                                                " department," +
                                                " tag_id, " +
                                                " destination_location," +
                                                " asn," +
                                                " store_id, " +
                                                " date," +
                                                " brand," +
                                                " sku " + ") VALUES ?";

                                            var insertquerydetails = "INSERT INTO epc_detail (`epc`, " +
                                                "`item_code`, `Retail_CycleCountID`, " +
                                                " `department`, `brand`, `color`, `size`,`date`," +
                                                "`store_id`,`zone`,`action_done`) " +
                                                " VALUES ? ";

                                            //console.log(asn_epc_rec);    
                                            mysqlMain2.query(asn_data_str, [asn_epc_rec], function(err) {

                                                //console.log(">>>>>>>>"+JSON.stringify(err));



                                                mysqlMain2.query(epc_query_new2, function(err) {

                                                    mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {
                                                        if(err){
                                                           console2.log('Error', JSON.stringify(err), '475-EpcDump API insert in epc details process name ' + process_types + ' '); 
                                                        }
                                                        
                                                        //console.log(err);
                                                    });

                                                    //console.log(err);
                                                });

                                                if (err) {
                                                    console2.log('Error', JSON.stringify(err), '715-EpcDump API  process name ' + process_types + ' ');
                                                    //console.log(err);
                                                }
                                                var today_date = dateFormat(now, "yyyy-mm-dd");

                                                var desti = ''

                                                if (DestinationStoreID == '') {

                                                    desti = '';

                                                } else {

                                                    desti = DestinationStoreID;

                                                }
                                                var source = ''
                                                if (total_inner_epc[0].process_type == 'packing' || total_inner_epc[0].process_type == 'shipping') {
                                                    source = " source='" + OriginStoreID + "', "
                                                }


                                                var update_query = "update asn_master set " + source +
                                                    " `date` = '" + today_date + "', " +
                                                    " destination = '" + desti + "'," +
                                                   
                                                    "  transferred_item = (select COUNT(process) from asn_items where process='shipping' AND asn = '" + asn + "' and is_deleted='0' ), " +
                                                     " status = '" + process_status + "'" + remarks_string_new +
                                                    " WHERE asn = '" + asn + "';"
                                                //console.log('update_queryddddddddddddddd'+update_query);
                                                mysql.queryCustom(update_query).then(function(result) {
                                                    if (result.status == "1") {


                                                            setTimeout(function() {


                                                                mysqlMain2.query(repetition_delete, function(err) {
                                                                    if (err) {


                                                                    console2.log('Error', JSON.stringify(err), '427-repetition_delete API  repetition_delete');
                                                                    }

                                                                });

                                                            }, 3000);  

                                                    } else {
                                                        if(result.error){
                                                         console2.log('Error', JSON.stringify(result.error), '752-EpcDump API  process name ' + process_types + ' ');   
                                                        }
                                                        
                                                        //res.end(result.error);
                                                    }
                                                }).catch(function(error) {
                                                    if(error){
                                                        console2.log('Error', JSON.stringify(error), '756-EpcDump API   process name ' + process_types + ' ');   
                                                    }
                                                    
                                                });
                                            })
                                        }
                                    })
                                    .catch(err => {

                                        var update_cronjob_error = '';
                                         //console.log('...................'+err);
                                        if(err){
                                          console2.log('Error', err, '770-EpcDump API api catch error in ' + process_types + '');
                                        }
                                        

                                        update_cronjob_error += "UPDATE cronjob_taks set " +
                                            "status='0' " +
                                            " where process_type = '" + process_types + "' and Retail_CycleCountID ='" + Retail_CycleCountID + "';"

                                        mysql.queryCustom(update_cronjob_error).then(function(result) {
                                            if (result.status == "1") {
                                                //res.end("All Done");           
                                            } else {
                                                //res.end(result.error);
                                            }
                                        });


                                    });



                            }
                            if (total_inner_epc[i].process_type == 'receiving') {



                               
                               
                                aduit_Add.send(
                                    'Receiving Job running for store ' +StockStore_id,
                                    'audit_json',
                                    'receiving',
                                    '',
                                    StockStore_id,
                                    '',
                                    Retail_CycleCountID
                                );
                                abody = {
                                    "ASN": total_epc[i].Retail_CycleCountID,
                                    // "DestinationStoreID":total_epc[i].destinationStore,
                                    "Process": "receiving",
                                    "ProcessStatus": "closed"
                                };

                               
                             

                              
                                fetch(process.env.IOT_API_NEW + 'innovent/SUPPLYCHAINVERIFY', {
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
                                        if(error){
                                            console2.log('Error', JSON.stringify(error), '902-EpcDump API ASN json validation');   
                                        }
                                        
                                    })
                                    .then((json) => {


                                        var total_masterasn = '';
                                        var location        = '';
                                        var destination     = '';
                                        var asn             = '';
                                        var OriginStoreID   = '';
                                        var DestinationStoreID = '';
                                        var process_status  = '';
                                        var tagid           = '';
                                        var SKU             = '';
                                        var DepartmentID    = '';
                                        var Brand           = '';

                                        var abody           = '';
                                        var fetch_api       = '';
                                        var asn_epc_rec     = [];



                                        var total_results = json.results;
                                        //console.log(total_results);
                                        var total_asn_record = total_results.length;
                                        if (total_asn_record > 0) {

                                            var CheckDate = '';
                                            var select = "";
                                            var update_query = "";
                                            var update_query_master = '';

                                            var my_update = '';

                                            var check_count = '';
                                            var brandname = '';
                                            var checkLength = total_results.length;
                                            var epc_query_new2 = '';
                                            var checkdatenow = '';
                                            var dateTime = '';
                                            var my_insertgobal = '';
                                            var repetition_delete  = '';
                                            var remarks_string_new = '';

                                            for (var z = 0; z < total_results.length; z++) {


                                                dateTime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");


                                                if (total_results[z].Brand != "") {
                                                    brandname = escape(total_results[z].Brand);
                                                } else {
                                                    brandname = 'na';
                                                }

                                                remarks_string_new = " , receiving_remarks= '" + total_results[z].remarks + "' ,receiving_date = '" + dateTime + "'  ";
                                                


                                                CheckDate = dateFormat(now, "yyyy-mm-dd");



                                                temp = [

                                                    total_results[z].OriginStoreID,
                                                    total_results[z].ProcessStatus,
                                                    total_results[z].Process,
                                                    total_results[z].DepartmentID,
                                                    total_results[z].TagID,
                                                    total_results[z].DestinationStoreID,
                                                    total_results[z].ASN,
                                                    total_results[z].OriginStoreID,
                                                    CheckDate,
                                                    escape(total_results[z].Brand),
                                                    total_results[z].SKU_original,

                                                ];
                                                asn_epc_rec.push(temp);


                                                checkdatenow = dateFormat(now, "yyyy-mm-dd");
                                                //console.log(asn_epc_rec);
                                                temp2 = [

                                                    total_results[z]["thing.headers"].serialNumber,
                                                    total_results[z].SKU_original,
                                                    Retail_CycleCountID,
                                                    total_results[z].DepartmentID,
                                                    escape(total_results[z].Brand),
                                                    'na',
                                                    'na',
                                                    checkdatenow,
                                                    total_results[z].OriginStoreID,
                                                    'na',
                                                    process_types,
                                                ];

                                                epc_details_data_array.push(temp2);


                                                //CheckDate = dateFormat(total_results[0].ASNtimestamp.value, "yyyy-mm-dd");

                                                epc_query_new2 += "CALL add_epc_rec('" + Retail_CycleCountID + "'," +
                                                    " '" + StockStore_id + "','" + total_results[z].TagID + "'," +
                                                    "'" + total_results[z].SKU_original + "','" + total_results[z].DepartmentID + "', " +
                                                    "'" + escape(total_results[z].Brand) + "','0','0','" +
                                                    CheckDate + "');";

                                                var j = z;

                                                total_masterasn = total_results;
                                                location = total_masterasn[j].Original_Location;
                                                destination = total_masterasn[j].Destination_Location;
                                                asn = total_masterasn[j].ASN;
                                                OriginStoreID = total_masterasn[j].OriginStoreID;
                                                DestinationStoreID = total_masterasn[j].DestinationStoreID;
                                                process_status = total_masterasn[j].Process
                                                tagid = total_masterasn[j].TagID;
                                                SKU = total_masterasn[j].SKU;
                                                DepartmentID = total_masterasn[j].DepartmentID;
                                                Brand = escape(total_masterasn[j].Brand);

                                                repetition_delete += "CALL asn_fix_321 ('"+total_results[z].ASN+"','"+total_results[z].Process+"');";


                                            }

                                            aduit_Add.send(
                                                process_types+' job run successfully for store '+StockStore_id+' '+
                                                'Total IBT Inserted '+total_asn_record, 
                                                'audit_json',
                                                process_types,
                                                '',
                                                StockStore_id,
                                                '',
                                                Retail_CycleCountID
                                            );

                                            my_insertgobal = " INSERT INTO  asn_master (`date`, `asn`,`status`)" +
                                                "SELECT * FROM (SELECT '" + CheckDate + "','" + asn + "','" + total_results[0].ProcessStatus + "') AS tmp " +
                                                " WHERE NOT EXISTS (SELECT asn FROM asn_master " +
                                                " WHERE asn = '" + asn + "'  ) LIMIT 1; ";


                                                //console.log(my_insertgobal);

                                            mysqlMain2.query(my_insertgobal, function(error, results, fields) {

                                                if(error){
                                                 console2.log('Error', JSON.stringify(error), '670-Insert in IBT master process name ' + process_types + ' ');
                                                   
                                                }
                                                
                                                //console.log(JSON.stringify(error));
                                            });




                                            var asn_data_str = "INSERT INTO asn_items (" +

                                                " original_location," +
                                                " process_status, " +
                                                " process," +
                                                " department," +
                                                " tag_id, " +
                                                " destination_location," +
                                                " asn," +
                                                " store_id, " +
                                                " date," +
                                                " brand," +
                                                " sku " + ") VALUES ?";

                                            var insertquerydetails = "INSERT INTO epc_detail (`epc`, " +
                                                "`item_code`, `Retail_CycleCountID`, " +
                                                " `department`, `brand`, `color`, `size`,`date`," +
                                                "`store_id`,`zone`,`action_done`) " +
                                                " VALUES ? ";

                                            //console.log(asn_epc_rec);    
                                            mysqlMain2.query(asn_data_str, [asn_epc_rec], function(err) {

                                                //console.log(">>>>>>>>"+JSON.stringify(err));



                                                mysqlMain2.query(epc_query_new2, function(err) {

                                                    mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {
                                                        if(err){
                                                           console2.log('Error', JSON.stringify(err), '475-EpcDump API insert in epc details process name ' + process_types + ' '); 
                                                        }
                                                        
                                                        //console.log(err);
                                                    });

                                                    //console.log(err);
                                                });

                                                if (err) {
                                                    console2.log('Error', JSON.stringify(err), '715-EpcDump API  process name ' + process_types + ' ');
                                                    //console.log(err);
                                                }
                                                var today_date = dateFormat(now, "yyyy-mm-dd");

                                                var desti = ''

                                                if (DestinationStoreID == '') {

                                                    desti = '';

                                                } else {

                                                    desti = DestinationStoreID;

                                                }
                                               
                                                


                                                var update_query = "update asn_master set  `date` = '" + today_date + "', " +
                                                    " destination = '" + desti + "'," +
                                                    "  received_item = (select COUNT(process) from asn_items where process='receiving' AND asn = '" + asn + "' and is_deleted='0' )," +
                                                    " status = '" + process_status + "'" + remarks_string_new +
                                                    " WHERE asn = '" + asn + "';"
                                                //console.log('update_queryddddddddddddddd'+update_query);
                                                mysql.queryCustom(update_query).then(function(result) {
                                                    if (result.status == "1") {


                                                            setTimeout(function() {


                                                                mysqlMain2.query(repetition_delete, function(err) {
                                                                    if (err) {


                                                                    console2.log('Error', JSON.stringify(err), '427-repetition_delete API  repetition_delete');
                                                                    }

                                                                });

                                                            }, 3000);  

                                                    } else {
                                                        if(result.error){
                                                         console2.log('Error', JSON.stringify(result.error), '752-EpcDump API  process name ' + process_types + ' ');   
                                                        }
                                                        
                                                        //res.end(result.error);
                                                    }
                                                }).catch(function(error) {
                                                    if(error){
                                                        console2.log('Error', JSON.stringify(error), '756-EpcDump API   process name ' + process_types + ' ');   
                                                    }
                                                    
                                                });
                                            })
                                        }
                                    })
                                    .catch(err => {

                                        var update_cronjob_error = '';
                                         //console.log('...................'+err);
                                        if(err){
                                          console2.log('Error', err, '770-EpcDump API api catch error in ' + process_types + '');
                                        }
                                        

                                        update_cronjob_error += "UPDATE cronjob_taks set " +
                                            "status='0' " +
                                            " where process_type = '" + process_types + "' and Retail_CycleCountID ='" + Retail_CycleCountID + "';"

                                        mysql.queryCustom(update_cronjob_error).then(function(result) {
                                            if (result.status == "1") {
                                                //res.end("All Done");           
                                            } else {
                                                //res.end(result.error);
                                            }
                                        });


                                    });



                            }

                            /*-------------------------------/ASN-----------------------------------------*/

                            if (total_epc[i].process_type == 'good') {

                                aduit_Add.send(
                                    'Goods job running for store '+StockStore_id, 
                                    'audit_json',
                                    'good',
                                    '',StockStore_id,
                                    '',
                                    Retail_CycleCountID
                                );
                                const body = {
                                    "StoreID": total_epc[i].store_id,
                                    "Retail_ItemBatchID": total_epc[i].Retail_CycleCountID
                                };
                                
                                fetch(process.env.IOT_API + 'reportExecution/GOODSINITEMSSTORES', {
                                        method: 'post',
                                        body: JSON.stringify(body),
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
                                        console2.log('Error', JSON.stringify(error), '845-EpcDump API GoodsStore json validation');
                                    })
                                    .then((json) => {

                                        var total_results = json.results;
                                        var total_goods = total_results.length;
                                        if (total_goods > 0) {
                                            //console.log(total_results);
                                            var checkdatenow = '';
                                            var goods_rec = [];
                                            var epc_query_new = '';
                                            var dateSplit = '';
                                            var remove_duplication_SP = '';
                                            var update_goods_item_store = '';
                                            var parse_new       = sku_parse;
                                            var sku_parts = '';
                                            var SKU_original = '';
                                            var sku = '';
                                            var update_epc_from_pm='';

                                            for (var i = 0; i < total_results.length; i++) {

                                                dateSplit = dateFormat(total_results[i].Date.value, "yyyy-mm-dd HH:MM:ss");

                                                temp = [

                                                    dateSplit,
                                                    total_results[i].Retail_ItemBatchID,
                                                    total_results[i].Supplier_Number,
                                                    total_results[i].Shipment_Number,
                                                    total_results[i].Store,
                                                    total_results[i]["Refno/EAN"],
                                                    total_results[i].Purchase_Order,


                                                    total_results[i].Comments,
                                                    total_results[i].id,
                                                    total_results[i]["thing.headers"].serialNumber,
                                                    total_results[i].remarks
                                                ];


                                                goods_rec.push(temp);


                                                checkdatenow = dateFormat(now, "yyyy-mm-dd");



                                                temp2 = [

                                                    total_results[i]["thing.headers"].serialNumber,
                                                    'na',
                                                    'na',
                                                    'na',
                                                    'na',
                                                    'na',
                                                    'na',
                                                    checkdatenow,
                                                    StockStore_id,
                                                    'na',
                                                    process_types,
                                                ];

                                                epc_details_data_array.push(temp2);

                                            
                                               
                                                sku_parts             = parse_new.parse(total_results[i]["thing.headers"].serialNumber);
                                                SKU_original          = sku_parts.Sku
                                                sku      = parseInt(SKU_original,10);
                                                

                                                epc_query_new += "CALL add_epc_rec('" + Retail_CycleCountID + "'," +
                                                    " '" + StockStore_id + "','" + total_results[i]["thing.headers"].serialNumber + "'," +
                                                    "'"+sku+"','0', " +
                                                    "'0','0','0','" +
                                                    checkdatenow+"');";

                                                update_goods_item_store +="CALL update_goods_item_store('" + total_results[i]["thing.headers"].serialNumber + "');";
                                                update_epc_from_pm = update_epc_from_pm+"CALL update_epc_from_pm('" + total_results[i]["thing.headers"].serialNumber + "');";   
                                            
                                             
                                              

                                            }
                                            aduit_Add.send(
                                                'Goods job run successfully for store '+StockStore_id+' '+
                                                'Total '+total_goods+' items inserted in goods successfully',
                                                'audit_json',
                                                'good', 
                                                '',
                                                StockStore_id,
                                                '',
                                                Retail_CycleCountID
                                            );

                                            //purchase_order
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
                                                        console2.log('Error', err, '888-EpcDump API api goods epc_detail error ');
                                                        console.log(err); 
                                                    }
                                                   
                                                });
                                                mysqlMain2.query(epc_query_new, function(err) {
                                                    if(err){
                                                      console2.log('Error', err, '892-EpcDump API api goods procedure error ');
                                                        console.log(err);   
                                                    }
                                                   
                                                });
                                                if(err){
                                                    console2.log('Error', err, '895-EpcDump API api goods query error ');
                                                    console.log(err);
                                                }

                                                setTimeout(function(){
                                                    remove_duplication_SP = "CALL goods_item_store_duplication("+ 
                                                " '"+StockStore_id+"','"+Retail_CycleCountID+"');"; 

                                                //update_goods_item_store
                                                    mysqlMain2.query(remove_duplication_SP, function(err) {
                                                        if(err){
                                                          console2.log('Error', err, '892-EpcDump API api remove_duplication_SP procedure error ');
                                                            console.log(err);   
                                                        }

                                                        mysqlMain2.query(update_goods_item_store, function(err) {
                                                            if(err){
                                                              console2.log('Error', err, '892-EpcDump API api update_goods_item_store procedure error ');
                                                                console.log(err);   
                                                            }else{



                                                            mysqlMain2.query(update_epc_from_pm, function(err) {
                                                                if(err){
                                                                  console2.log('Error', err, 'EpcDump API api update_epc_from_pm procedure error ');
                                                                    console.log(err);   
                                                                }else{
 
                                                                }
                                                            });    



                                                            }
                                                        });



                                                    });

                                                },3000);
                                               
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        if(err){
                                          console2.log('Error', err, '902-EpcDump API api catch error ');  
                                        }
                                        
                                        var update_cronjob_error = '';
                                        //console.log('...................');
                                        update_cronjob_error += "UPDATE cronjob_taks set " +
                                            "status='0' " +
                                            " where process_type = '" + process_types + "' and Retail_CycleCountID ='" + Retail_CycleCountID + "';"

                                        mysql.queryCustom(update_cronjob_error).then(function(result) {
                                            if (result.status == "1") {
                                                //res.end("All Done");           
                                            } else {
                                                //res.end(result.error);
                                            }
                                        }).catch(function(error) {
                                            if(error){
                                                 console2.log('Error', JSON.stringify(error), '916-EpcDump API api update catch api query goods  error ');
                                                //res.end(error);
                                            }
                                           
                                        });
                                    });


                                //good

                            }


                            if (total_epc[i].process_type == 'warehouse') {
                                aduit_Add.send(
                                    'WareHose job running for store '+StockStore_id,
                                    'audit_json',
                                    'warehouse',
                                    '',
                                    StockStore_id,
                                    '',
                                    Retail_CycleCountID
                                );

                                const body = {
                                    "store": total_epc[i].store_id,
                                    "Retail_ItemBatchID": total_epc[i].Retail_CycleCountID
                                };
                                
                                fetch(process.env.IOT_API + 'reportExecution/GOODSINITEMS', {
                                        method: 'post',
                                        body: JSON.stringify(body),
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
                                        if(error){
                                            console2.log('Error', JSON.stringify(error), '989-EpcDump API GoodsWareHouse json validation');
                                        }
                                        
                                    })
                                    .then((json) => {

                                        var total_results = json.results;
                                        var total_goodsWare = total_results.length;
                                        if (total_goodsWare > 0) {

                                            // console.log(json);
                                            var checkdatenow = '';
                                            var goods_rec = [];
                                            var epc_query_new = '';
                                            var dateSplit = "";
                                            var remove_duplication_SP = '';
                                            var update_goods_ware_house = '';

                                            for (var i = 0; i < total_results.length; i++) {

                                                dateSplit = dateFormat(total_results[i].Date.value, "yyyy-mm-dd HH:MM:ss");

                                                temp = [

                                                    dateSplit,
                                                    total_results[i].Retail_ItemBatchID,
                                                    total_results[i].Supplier_Number,
                                                    total_results[i].Shipment_Number,
                                                    total_results[i].Store,
                                                    total_results[i]["Refno/EAN"],
                                                    total_results[i].Comments,
                                                    total_results[i].id,
                                                    total_results[i]["thing.headers"].serialNumber,
                                                    total_results[i].remarks,
                                                ];


                                                goods_rec.push(temp);

                                                //  console.log(goods_rec);

                                                checkdatenow = dateFormat(now, "yyyy-mm-dd");



                                                temp2 = [

                                                    total_results[i]["thing.headers"].serialNumber,
                                                    'na',
                                                    'na',
                                                    'na',
                                                    'na',
                                                    'na',
                                                    'na',
                                                    checkdatenow,
                                                    StockStore_id,
                                                    'na',
                                                    process_types,
                                                ];

                                                epc_details_data_array.push(temp2);



                                                epc_query_new += "CALL add_epc_rec('" + Retail_CycleCountID + "'," +
                                                    " '" + StockStore_id + "','" + total_results[i]["thing.headers"].serialNumber + "'," +
                                                    "'0','0', " +
                                                    "'0','0','0','" +
                                                    checkdatenow + "');";

                                                update_goods_ware_house +="CALL update_goods_ware_house('" + total_results[i]["thing.headers"].serialNumber + "');";     

                                                     

                                            }
                                            aduit_Add.send(
                                                'WareHose job run successfully for store '+StockStore_id+' '+
                                                'Total '+total_goodsWare+' items inserted successfully in warehouse', 
                                                'audit_json',
                                                '',
                                                '', 
                                                StockStore_id,
                                                '',
                                                Retail_CycleCountID
                                            );
                                            var insert_query = "INSERT INTO goods_item_warehouse (`date`, `retail_item_batch_id`," +
                                                " `supplier_number`, `shipment_number`," +
                                                " `store`, `refno`, `comments`," +
                                                " `id`,`epc`,`remarks`) VALUES ? "

                                            var insertquerydetails = "INSERT INTO epc_detail (`epc`, " +
                                                "`item_code`, `Retail_CycleCountID`, " +
                                                " `department`, `brand`, `color`, `size`,`date`," +
                                                "`store_id`,`zone`,`action_done`) " +
                                                " VALUES ? ";

                                            mysqlMain2.query(insert_query, [goods_rec], function(err) {

                                                mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {
                                                    if(err){
                                                        console2.log('Error', JSON.stringify(err), '1026-EpcDump API api  goods_item_warehouse  error ');
                                                    }
                                                    
                                                    //console.log(err);
                                                });
                                                mysqlMain2.query(epc_query_new, function(err) {
                                                    if(err){
                                                      console2.log('Error', JSON.stringify(err), '1030-EpcDump API api  procedure  error ');  
                                                    }
                                                    
                                                    //console.log(err);
                                                });
                                                if(err){
                                                  console2.log('Error', JSON.stringify(err), '1033-EpcDump API api  main insert goods_item_warehouse  error ');  
                                                }

                                                setTimeout(function(){

                                                    remove_duplication_SP = "CALL goods_item_warehouse_duplication("+ 
                                                "'"+StockStore_id+"','"+Retail_CycleCountID+"');"; 

                                                    mysqlMain2.query(remove_duplication_SP, function(err) {
                                                        if(err){
                                                          console2.log('Error', err, '8922-EpcDump API api remove_duplication_SP procedure error ');
                                                            console.log(err);   
                                                        }
                                                    });

                                                    mysqlMain2.query(update_goods_ware_house, function(err) {
                                                            if(err){
                                                              console2.log('Error', err, '892-EpcDump API api update_goods_ware_house procedure error ');
                                                                console.log(err);   
                                                            }
                                                    });

                                                },3000);
                                                
                                                //console.log(err);
                                            });
                                        }

                                    })
                                    .catch(err => {
                                        if(err){
                                          console2.log('Error',err, '1042-EpcDump API api  goods_item_warehouse catch  error ');  
                                        }
                                        
                                        var update_cronjob_error = '';
                                        //  console.log('.sss..................');
                                        update_cronjob_error += "UPDATE cronjob_taks set " +
                                            "status='0' " +
                                            " where process_type = '" + process_types + "' and Retail_CycleCountID ='" + Retail_CycleCountID + "';"

                                        mysql.queryCustom(update_cronjob_error).then(function(result) {
                                            if (result.status == "1") {
                                                //res.end("All Done");           
                                            } else {
                                                //res.end(result.error);
                                            }
                                        }).catch(function(error) {
                                            console2.log('Error', JSON.stringify(error), '1056-EpcDump API api  update catch goods_item_warehouse  error ');
                                            //res.end(error);
                                        });
                                    });
                            }



                            var new_update_cronjob = '';



                           new_update_cronjob += "UPDATE cronjob_taks set " +
                                "status='1' " +
                                " WHERE process_type = '" + total_epc[i].process_type + "'  and  id = '" + total_epc[i].id + "' ;"

                            mysql.queryCustom(new_update_cronjob).then(function(result) {
                                if (result.status == "1") {
                                    //res.end("All Done");           
                                } else {
                                    //res.end(result.error);
                                }
                            }).catch(function(error) {
                                if(error){
                                    console2.log('Error', JSON.stringify(error), '1081-EpcDump API api  all done cronjob task ');    
                                }
                                
                                //res.end(error);
                            });


                            /*forloop*/
                        }
                        if (res != "n/a") {
                            res.status(200).send({
                                error: "0",
                                message: "All Done !.",
                            });
                        }

                        //res.end("All Done");

                    } else {
                        console2.log('Error', JSON.stringify(result.error), '1095-EpcDump API api  error ');
                        if (res != "n/a") {
                            res.status(400).send({
                                error: "1",
                                message: result.error,
                            });
                        }
                        //res.end(result.error);

                    }
                }).catch(function(error) {

                    console2.log('Error', JSON.stringify(error), '1180-EpcDump select Query API api  error ');
                    if (res != "n/a") {
                        res.status(400).send({
                            error: "1",
                            message: JSON.stringify(error),
                        });
                    }    
                   

                });
            } else {

                if (res != "n/a") {
                    res.status(400).send({
                        message: "Invalid Token !",
                    });
                }
                // response['message'] = 'Invalid Token !';
                // res.json(JSON.stringify(response));
            }
        } else {
            if (res != "n/a") {
                res.status(400).send({
                    message: "Please Enter token !",
                });
            }
            // response['message'] = 'Please Enter Token !';
            // res.json(JSON.stringify(response));
        }


    } catch (e) {
        console2.log('Error', 'Catch Exception', '1185-EpcDump CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1192-EpcDump CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
}


function check_IBT_exists(var_asn,var_process){
    return new Promise((resolve, reject) => {
        var now = new Date();
        var CheckDate = dateFormat(now, "yyyy-mm-dd");
        var asn = var_asn;
        var process_type = var_process;
        var exists = '0';
        var select_query = "SELECT * FROM notificaton_asn a where 1 and asn = '"+asn+"' and process_type = '"+process_type+"';"
        //console.log(select_query);
        mysql.queryCustom(select_query).then(function(result) {

            if (result.results.length !== 0) {
                exists = '1'
            }

            let sendparam = {
                ifexists:exists,
                IBT: asn
            }

            resolve(sendparam);
        }).catch(err => {
            console2.log('Error', JSON.stringify(err), '461-Check_StockExists API StockSummaryDump api error');
        });
    });
}

function asn_notification(var_res){

    var res = var_res;
    const now = new Date();
    var CheckDate = dateFormat(now, "yyyy-mm-dd");
    // router.post('/asn_notification', (req, res, next) => {    
        var select_query = "select * from asn_master where packed_item > 0 and transferred_item > 0 and  received_item > 0 " +
        "and received_item!=transferred_item AND `status` = 'receiving'";
       
        mysql.queryCustom(select_query).then(function(result) {
            if (result.status == "1") {

                var total_results = result.results;
                var insert_query = '';
                var id = '';
                var asn = '';
                var transferred_item = '';
                var received_item = '';
                var status  = '';

                if(total_results.length >0){

                    for(var i = 0;i<total_results.length;i++){
                        // asn = total_results[i].asn;
                        transferred_item =   total_results[i].transferred_item;
                        received_item    =   total_results[i].received_item;
                        status    =   total_results[i].status;

                        check_IBT_exists(total_results[i].asn,'receiving').then(function(returnData){
                            //console.log(returnData)
                            var exits = returnData.ifexists;
                            var ibt   = returnData.IBT
                            if(exits == '0'){

                                var now = new Date();
                                var CheckDate = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

                                insert_query = "INSERT INTO notificaton_asn SET asn ='"+ibt+"' , datetime ='"+CheckDate+"',process_type='receiving' ;" 
                                
                                // console.log('receiving');
                                mysql.queryCustom(insert_query).then(function(result) {
                                    if (result.status == "1") {                  
                                       
                                      

                                        var maillist = process.env.ALERT_EMAIL_1;
                                       

                                        const message = {
                                            from: 'saqib@innodaba.com', // Sender address
                                            to: maillist,// List of recipients
                                            subject: 'IBT notification', // Subject line
                                            text: ""+ibt+" IBT shipping item "+transferred_item+" receiving item "+received_item+" " // Plain text body
                                        };

                                        transport.sendMail(message, function(err, info) {
                                            if (err) {
                                               console.log(err)
                                            } else {
                                               console.log(info);
                                            }
                                        });


                                       
                                        // console.log("Message sent: %s", info.messageId);

                                        var update_query = "UPDATE notificaton_asn SET send_mail = '1' where asn = '"+ibt+"' and process_type='receiving';"
                                        // console.log(update_query);
                                        mysql.queryCustom(update_query).then(function(result) {

                                        });

                                    }
                                        if(res != 'n/a'){
                                          res.end('ss');   
                                        }
                                    // console.log(total_results);
                                    //

                                }).catch(function(error) {
                                    console.log(error)
                                    console2.log('Error', JSON.stringify(error), '2074-asn_notification');
                                });  


                            }
                            

                        });  

                    }
                }
               

            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '2092-asn_notification');
            // res.end(error);
            // res.end(error);
        });
    // });

}

function asn_notification_packing(var_res){

    
    var res = var_res;
    const now = new Date();
    var CheckDate = dateFormat(now, "yyyy-mm-dd");
    // router.post('/asn_notification', (req, res, next) => {    
        var select_query = "select * from asn_master where packed_item > 0 and transferred_item > 0  " +
        "and packed_item!=transferred_item AND `status` = 'shipping'";
        //console.log(select_query) 
        mysql.queryCustom(select_query).then(function(result) {
            if (result.status == "1") {

                var total_results = result.results;
                var insert_query = '';
                var id = '';
                var asn = '';
                var transferred_item = '';
                var received_item = '';
                var status  = '';
                var packed_item = '';

                if(total_results.length >0){

                    for(var i = 0;i<total_results.length;i++){
                        // asn = total_results[i].asn;
                        transferred_item =   total_results[i].transferred_item;
                        received_item    =   total_results[i].received_item;
                        status    =   total_results[i].status;
                        packed_item = total_results[i].packed_item;

                        check_IBT_exists(total_results[i].asn,'shipping').then(function(returnData){
                            //console.log(returnData)
                            var exits = returnData.ifexists;
                            var ibt   = returnData.IBT
                            if(exits == '0'){

                                var now = new Date();
                                var CheckDate = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

                                insert_query = "INSERT INTO notificaton_asn SET asn ='"+ibt+"' , datetime ='"+CheckDate+"',process_type='shipping' ;" 
                                
                                // console.log('packing');
                                mysql.queryCustom(insert_query).then(function(result) {
                                    if (result.status == "1") {                  

                                         var maillist = process.env.ALERT_EMAIL_1;
                                         
                                        const message = {
                                            from: 'saqib@innodaba.com', // Sender address
                                            to: maillist, // List of recipients
                                            subject: 'IBT notification', // Subject line
                                            text: ""+ibt+" IBT packing item "+packed_item+" shipping item "+transferred_item+" " // Plain text body
                                        };


                                        transport.sendMail(message, function(err, info) {
                                            if (err) {
                                               console.log(err)
                                            } else {
                                               console.log(info);
                                            }
                                        });


                                       
                                        // console.log("Message sent: %s", info.messageId);

                                        var update_query = "UPDATE notificaton_asn SET send_mail = '1' where asn = '"+ibt+"' and process_type='shipping';"
                                        // console.log(update_query);
                                        mysql.queryCustom(update_query).then(function(result) {

                                        });

                                    }
                                        if(res != 'n/a'){
                                          res.end('ss');   
                                        }
                                    // console.log(total_results);
                                    //

                                }).catch(function(error) {
                                    console.log(error)
                                    console2.log('Error', JSON.stringify(error), '2074-asn_notification');
                                });  


                            }
                            

                        });  
                    }

                    // console.log(insert_query)
                     

                }
               

            }
        }).catch(function(error) {
            console2.log('Error', JSON.stringify(error), '2092-asn_notification');
            // res.end(error);
            // res.end(error);
        });
    // });

}





function run_cycle_count22(token,var_res,store_name22,var_value = 0){
    
    try {

       
        var token = token;

        var res = var_res;

        const now = new Date();
        var CheckDate = "";
        var body = "";

        var epc_temp_data_array = [];
        var epc_details_data_array = [];
        var access_token = mysql.globals.access_token;

        var value22 = var_value; 


      
        if (token !== undefined && token !== '') {

            if (token == access_token) {

                var cond = '';
                if (store_name22 !== '' && store_name22 != undefined) {
                    cond = " and storename = '"+store_name22+"' ";
                } 
               
                var select_query = "SELECT storename as store_id FROM `tb_store` where 1 "+cond;


                CheckDate = dateFormat(now, "yyyy-mm-dd");



                mysql.queryCustom(select_query).then(function(result) {

                    if (result.status == "1") {
                        var total_epc = result.results;

                        var abc = '';
                        var message = '';

                        var remarks_string = '';

                        //console.log(total_epc.length);
                        for (var i = 0; i < total_epc.length; i++) {

                            var jj = i;
                            var total_inner_epc = total_epc;

                            var StockStore_id = total_inner_epc[jj].store_id;
                            
                                aduit_Add.send(
                                    'CycleCount job running for store '+StockStore_id, 
                                    'audit_json', 
                                    'CycleCount', 
                                    '', 
                                    StockStore_id, 
                                    '',
                                    'run from soh details report'
                                );



                                const body = {
                                    "StoreID": total_epc[i].store_id
                                    
                                };
                                
                                CheckDate = dateFormat(now, "yyyy-mm-dd");

                               
                                fetch(process.env.IOT_API_NEW + 'innovent/GETCOUNTEDITEMS', {
                                        method: 'post',
                                        body: JSON.stringify(body),
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
                                        if(error){
                                            console2.log('Error', JSON.stringify(error), '902-EpcDump API CycleCount json validation');   
                                        }
                                        
                                    })
                                    .then((json) => {

                                        var result_send = json;
                                        var total_results = json.results;
                                        var total_item_cycle_Count = total_results.length;
                                        //console.log(total_results)
                                       
                                        if (total_item_cycle_Count > 0) {
                                            
                                            console.log("11111111111111111111111111111");
                                            EpcDump_22(StockStore_id,result_send,res,value22);

                                            var string;
                                            var total_results = json.results;

                                           

                                            var string;
                                            var update_query = '';
                                            var stinglower = '';


                                            var update_query22 = '';
                                            var zone = '';
                                            var brandname = '';
                                            var ColorName = '';
                                            var Size = '';
                                            var skuss = '';

                                            var insert_query_new = '';
                                            var store_vise_update = '';
                                            var CheckDate = dateFormat(now, "yyyy-mm-dd");
                                            var epc_query_new = '';



                                            for (var c = 0; c < total_results.length; c++) {
                                                //console.log("+++>>>"+total_results.length);

                                                var abc2 = total_results;
                                                stinglower = abc2[c].zone;

                                                string = stinglower.toLowerCase();

                                                string = string.split(' ').join('');

                                                zone = string;


                                                brandname = escape(abc2[c].Brand);
                                                ColorName = abc2[c].Color;
                                                Size = abc2[c].Size;



                                              

                                                temp2 = [

                                                    abc2[c].TagID,
                                                    abc2[c].SKU_original,

                                                    'Manual Run',

                                                    abc2[c].DepartmentID,

                                                    brandname,
                                                    ColorName,
                                                    Size,

                                                    CheckDate,
                                                    StockStore_id,
                                                    zone,
                                                    'CycleCount',


                                                ];


                                                epc_details_data_array.push(temp2);


                                                var CheckDate2 = dateFormat(now, "yyyy-mm-dd");

                                               


                                                epc_query_new += "CALL add_epc_rec('Manual Run', '" + StockStore_id + "','" + abc2[c].TagID + "'," +
                                                    "'" + abc2[c].SKU_original + "','" + remove_single_qoute(abc2[c].DepartmentID) + "', " +
                                                    "'" + brandname + "','" + remove_single_qoute(abc2[c].Color) + "','" + remove_single_qoute(abc2[c].Size) + "','" +
                                                    CheckDate2 + "');";


                                            }
                                            //console.log('CycleCount Job run Successfully','audit_json','CycleCount total Record inserted '+total_item_cycle_Count,'',StockStore_id,'');
                                            aduit_Add.send(
                                                'CycleCount Job run successfully for store '+StockStore_id+' '+ 
                                                'CycleCount total Record inserted '+ total_item_cycle_Count, 
                                                'audit_json', 
                                                'CycleCount', 
                                                '', 
                                                StockStore_id,
                                                '',
                                                ''
                                            );


                                            var insertquerydetails = "INSERT INTO epc_detail (`epc`, `item_code`, `Retail_CycleCountID`, " +
                                                " `department`, `brand`, `color`, `size`,`date`,`store_id`,`zone`,`action_done`) " +
                                                " VALUES ? ";



                                                mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {


                                                    mysqlMain2.query(epc_query_new, function(err) {
                                                        if (err) {
                                                            console2.log('Error', JSON.stringify(err), '416-EpcDump API CycleCount');
                                                        }

                                                    });

                                                });

                                               

                                                //console.log("i am done22"); 

                                            



                                            var CheckDate = dateFormat(now, "yyyy-mm-dd");
                                            var updateDate = " UPDATE tb_store set stockcountdate='" + CheckDate +

                                                "' WHERE storename='" + StockStore_id + "' ; "

                                            mysql.queryCustom(updateDate).then(function(result) {

                                            }).catch(function(error) {
                                                if(error){
                                                  console2.log('Error', JSON.stringify(error), '482-EpcDump API ASN json validation');  
                                                }
                                                
                                            });
                                        } else {
                                            if (res != "n/a") {
                                                res.status(200).send({
                                                    error: "1",
                                                    message: "No item for CycleCount !.",
                                                });
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        if(err){
                                            console2.log('Error', err, '461-EpcDump API CycleCount api error');
                                        }
                                        
                                        // var update_cronjob_error = '';
                                        // // console.log('...................');
                                        // update_cronjob_error += "UPDATE cronjob_taks set " +
                                        //     "status='0' " +
                                        //     " where process_type = '" + process_types + "' and Retail_CycleCountID ='" + Retail_CycleCountID + "';"

                                        // mysql.queryCustom(update_cronjob_error).then(function(result) {
                                        //     if (result.status == "1") {
                                        //         //res.end("All Done");           
                                        //     } else {
                                        //         //res.end(result.error);
                                        //     }
                                        // }).catch(function(error) {
                                        //     if(error){
                                        //        console2.log('Error', JSON.stringify(error), '475-EpcDump API CycleCount api update query in api catch error'); 
                                        //     }
                                            
                                        //     //res.end(error);
                                        // });


                                    });



                            /*-------------------------------/cycle count-----------------------------------------*/


                           

                            /*forloop*/
                        }
                        /*if (res != "n/a") {
                            res.status(200).send({
                                error: "0",
                                message: "All Done !.",
                            });
                        }*/

                        //res.end("All Done");

                    } else {
                        console2.log('Error', JSON.stringify(result.error), '1095-run_cycle_count API api  error ');
                        if (res != "n/a") {
                            res.status(400).send({
                                error: "1",
                                message: result.error,
                            });
                        }
                        //res.end(result.error);

                    }
                }).catch(function(error) {

                    console2.log('Error', error, '11800-run_cycle_count select Query API api  error ');
                    if (res != "n/a") {
                        res.status(400).send({
                            error: "1",
                            message: JSON.stringify(error),
                        });
                    }    
                   

                });
            } else {

                if (res != "n/a") {
                    res.status(400).send({
                        message: "Invalid Token !",
                    });
                }
                // response['message'] = 'Invalid Token !';
                // res.json(JSON.stringify(response));
            }
        } else {
            if (res != "n/a") {
                res.status(400).send({
                    message: "Please Enter token !",
                });
            }
            // response['message'] = 'Please Enter Token !';
            // res.json(JSON.stringify(response));
        }


    } catch (e) {
        console2.log('Error', 'Catch Exception', '1185-run_cycle_count CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1192-run_cycle_count CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
}


function cycle_count_run_nine(){
//router.post('/testinglahore', (req, res, next) => {
    var res = 'n/a';
    var new_query = "select * from tb_store"
    var token = access_token;
    mysql.queryCustom(new_query).then(function(result) {
        var result_set = result.results;

        const list = result_set
        const doSomething = async () => {
            //const item of list
          for (var i=0;i<result_set.length;i++) {
            await sleep(20000);
            //console.log(result_set[i].storename);
            run_cycle_count22(token,res,result_set[i].storename);
            
          }
        }
        doSomething();
        //res.end("Run Successfully !");
    });
//});
}
router.get('/run_cycle_count_external', (req, res, next) => {
    console2.execution_info('run_cycle_count_external');
    console.log(req.query);
    if(req.query.token=="innovent@123")
    {
        var storename   =   req.query.store_name22;
        var token       =   req.query.token;
        var res_1       =   res;

        console.log("External server running")

        run_cycle_count22(token,res,storename,"1"); 

    }
    else
    {
        res.end("error");
    }
      
});
router.post('/run_cycle_count', (req, res, next) => {


    console2.execution_info('run_cycle_count');
    try {
        var token = req.body.token;
        var myid = req.body.myid;
        var store_name22 = req.body.store_name;
        
        var new_query = "select * from web_settings"
    
        mysql.queryCustom(new_query).then(function(result) {
            if (result.status == "1") {

                   var total_results = result.results;



                    if(total_results.length>0){

                        var key   = 0;
                        var value = 0;
                        var url22 = '';
                        
                        for(var i = 0;i<total_results.length;i++){

                            key = total_results[i].key;
                            url22 = total_results[i].url;
                            value = total_results[i].value;

                         
                         
                           

                            
                            if(key == 'external_server' && value==1){

                                var url = url22+'?token='+token+'&&store_name22='+store_name22+'';
                                console.log(url);

                                request.get({url:url}, function(err, httpResponse, body) {
                                  if (err) {
                                    return console.error('post failed:', err);
                                  }

                                    console.log('Post successful!  Server responded with:', body);
                                    // res.end(JSON.str(body));
                                    res.status(200).send({
                                        error: "0",
                                        message: "All Done !.",
                                    });

                                });

                            }else if(key == 'new_logic_cycle_count' && value==1){
                               
                                console.log("new Cycle count run")

                                run_cycle_count22(token,res,store_name22,value); 

                            }
                        }
                    }else{

                       
                        run_cycle_count22(token,res,store_name22)
                    }

                

                //console.log(key)
                


            } else {

                res.status(400).send({
                    error: "1",
                    message: "Error!"
                });
            }
        }).catch(function(error) {

            console2.log('Error', error, '3449-run_cycle_count API api  error ');
            res.status(400).send({
                error: "1",
                message: JSON.stringify(error),
            });

        });


       

        

        

    } catch (e) {
        console2.log('Error', 'Catch Exception'+e, '1219-run_cycle_count Route CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1226-run_cycle_count Route CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
})

router.get('/test22', (req, res, next) => {
    var aa={'a':'b'};
    var data22;
    data22.push(aa);
    res.end(data22);
});


router.get('/EpcDump', (req, res, next) => {
    console2.execution_info('EpcDump');
    try {

        var token = req.query.token;
        var myid = req.query.myid;
        EpcDump(token, myid, res);
        // EpcDump_2(token, myid, res);

    } catch (e) {
        console2.log('Error', 'Catch Exception', '1219-EpcDump Route CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1226-EpcDump Route CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


router.post('/AddCronJobTask22', (req, res, next) => {
    
    console2.execution_info('AddCronJobTask22');
    try {
        var session = req.session;
        var Retail_CycleCountID = req.body.Retail_CycleCountID;
        var process_type = req.body.process_type;
        var destinationStore = req.body.destinationStore;

        var token = req.body.token;
        var store_id = req.body.store_id;
        var error_message = '';

        console2.log_entry("AddCronJobTask22",req.body);
        if (req.body.Retail_CycleCountID !== undefined && req.body.Retail_CycleCountID !== ''

            &&
            req.body.process_type !== undefined && req.body.process_type !== '' &&
            req.body.token !== undefined && req.body.token !== '' &&
            req.body.store_id !== undefined && req.body.store_id !== ''

        ) {


            if (token == access_token) {


                var Addtask = " INSERT INTO  cronjob_taks (`Retail_CycleCountID`, `process_type`,`store_id`," +
                    "`destinationStore`)" +
                    "SELECT * FROM (SELECT '" + Retail_CycleCountID + "','" + process_type + "','" +
                    store_id + "','" + destinationStore + "') AS tmp " +
                    " WHERE NOT EXISTS (SELECT `process_type` FROM cronjob_taks " +
                    " WHERE Retail_CycleCountID = '" + Retail_CycleCountID + "'  ) LIMIT 1; ";



                // var Addtask = "INSERT INTO cronjob_taks (Retail_CycleCountID,"+
                // "process_type,store_id,destinationStore) " +
                //     "VALUES ('" + Retail_CycleCountID + "','" + process_type + "' , "+ 
                //     "'" + store_id + "' , '" + destinationStore + "' )";

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

                    console2.log('Error', JSON.stringify(error), '1180-AddCronJobTask22 API api  error ');
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
                // response['message'] = 'Token Not Valid !';
                // res.json(JSON.stringify(response));
            }
        } else {

            res.status(400).send({
                error: "1",
                message: "Filed is missing !",
            });
            // response['message'] = 'Filed is missing';
            // res.json(JSON.stringify(response));
        }

    } catch (e) {
        console2.log('Error', 'Catch Exception', '1318-AddCronJobTask22  CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1325-AddCronJobTask22  CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
});


async function epc_dump_thirty_sec()
{
    
    lockfile.lock('epc_dump_thirty_sec.txt').then((release) => {
        
        console.log("<<epc_dump_thirty_sec>>  running after 30 second2222");
        
       
        var access_token = mysql.globals.access_token;
        EpcDump(access_token, '', 'n/a');
       
       

        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand);
       
    })
    .catch((e) => {
       
    });
}

cron.schedule('*/5 * * * *', () => {
    //let timeInMs = Math.random() * (2000);
    console.log("update Every 5 mints !.");
    update_last_five_mint_record();
    cron_ibt_fix();
});

function cron_ibt_fix() {
    var new_query = " SELECT * FROM asn_master WHERE `status` = 'shipping' AND `destination` = '' "
    mysql.queryCustom(new_query).then(function(result) {

        var total_records = result.results;   

        if(total_records.length>0) {

            for(var k=0;k<total_records.length;k++) {
                var asn = total_records[k].asn;
                cron_ibt_fix_fn(asn);         
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function cron_ibt_fix_fn(var_asn) {
    var asn = var_asn;
    var query = " SELECT * FROM asn_items WHERE `asn` = '"+asn+"' AND `process` = 'shipping' LIMIT 0,1";
    mysql.queryCustom(query).then(function(rzlt) {

        var total_rzlts = rzlt.results;
        if(total_rzlts.length>0) {
            
            var destination = total_rzlts[0].destination_location;
            var qry = " UPDATE asn_master SET destination = '"+destination+"' WHERE "+
                      " `status` = 'shipping' AND `destination` = '' AND `asn` = '"+asn+"' ";
            mysql.queryCustom(qry).then(function(results) {
                var maillist = process.env.ALERT_EMAIL_1;
                const message = {
                    from: 'saqib@innodaba.com', // Sender address
                    to: maillist, // List of recipients
                    subject: 'Daily Report', // Subject line
                    html:'IBT fixed against ASN '+asn
                };
                transport.sendMail(message, function(err, info) {
                    if(err) 
                    {
                        console.log(err)
                    } 
                    else 
                    {
                        console.log(info);
                    } 
                    
                });
            })
            .catch(function(error) {
                console.log(error);
            });
        }
        else {
            console.log("No records found againt ASN "+asn);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

async function update_product_item_master_sp(){

    lockfile.lock('update_product_item_master_sp.txt').then((release) => {
        
        console.log('<<update_product_item_master_sp>> running after 14 mint job');
        
        // console2.execution_info('update_product_item_sp');
        update_product_item_sp();

        asn_notification_packing("n/a");
        asn_notification('n/a');

        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
       
    })
    .catch((e) => {
       
    });
}

function prod_data_master_copy() {
    var new_query = "SELECT GROUP_CONCAT(`skucode`) as all_skucode FROM `product_item_master_2` ";
    mysql.queryCustom(new_query).then(function(result) {
        var getrecords  =   result.results;
        var all_sku     =   getrecords[0].all_skucode;
        var all_sku_ar  =   [];
        if(all_sku !== null)
        {
            all_sku_ar  =   all_sku.split(",");
        }

        var qry     = "SELECT GROUP_CONCAT(`skucode`) as exist_skucode  FROM `product_item_master` "+
        " WHERE `skucode`  IN ("+getrecords[0].all_skucode+") ";
        console.log(qry);
        mysql.queryCustom(qry).then(function(rzlt) {
            
            var exist_skucode    =  rzlt.results[0].exist_skucode;
            var exist_skucode_ar =  [];
            if(exist_skucode !== null)
            {
                exist_skucode_ar = exist_skucode.split(",");
            }

            var need_to_insert = [];
            for (var i = 0; i < all_sku_ar.length; i++) {
                var sku =all_sku_ar[i];
                if(exist_skucode_ar.indexOf(sku)  !== -1)
                {
                    console.log("hello");
                }
                else
                {
                    need_to_insert.push(sku);
                }
                
            }
            console.log("all_sku_ar",all_sku_ar);

            console.log("exist_skucode_ar",exist_skucode_ar);

            console.log("need to insert",need_to_insert);

            var need_to_insert_str = need_to_insert.join(",");
            console.log("need_to_insert_str",need_to_insert_str);

            if (need_to_insert_str != '') {

                var new_query2 = " SELECT * FROM `product_item_master_2` where skucode in("+need_to_insert_str+") ";
                mysql.queryCustom(new_query2).then(function(rzlts) {

                    //console.log(rzlts);
                    var getrzlt = rzlts.results
                    var insertion_data = [];
                    for (var i = 0; i < getrzlt.length; i++) {
                        temp = [
                            getrzlt[i].storeid,
                            getrzlt[i].skucode,
                            getrzlt[i].product_name,
                            getrzlt[i].product_des,
                            getrzlt[i].epc,
                            getrzlt[i].item_code,
                            getrzlt[i].last_detected_time,
                            getrzlt[i].user,
                            getrzlt[i].zone,
                            getrzlt[i].departmentid,
                            getrzlt[i].brand,
                            getrzlt[i].color,
                            getrzlt[i].size,
                            getrzlt[i].sfsr,
                            getrzlt[i].status,
                            getrzlt[i].group_name,
                            getrzlt[i].group_description,
                            getrzlt[i].dept,
                            getrzlt[i].departmentname,
                            getrzlt[i].brand_description,
                            getrzlt[i].barcode,
                            getrzlt[i].model,
                            getrzlt[i].subgroup,
                            getrzlt[i].sgroup,
                            getrzlt[i].ean_no,
                            getrzlt[i].sp_net,
                            getrzlt[i].season,
                            getrzlt[i].vat,
                            getrzlt[i].sales_area,
                            getrzlt[i].sp_gross_eng,
                            getrzlt[i].sp_gross_arb,
                            getrzlt[i].supplier_item_no,
                            getrzlt[i].supplier_name,
                            getrzlt[i].type_no,
                            getrzlt[i].arabic_desc,
                            getrzlt[i].origin,
                            getrzlt[i].english_desc,
                            getrzlt[i].company,
                            getrzlt[i].currency,
                            getrzlt[i].cost,
                            getrzlt[i].image_url,
                            getrzlt[i].style,
                            getrzlt[i].country,
                            getrzlt[i].supplier_no,
                            getrzlt[i].po_supplier_no
                        ]; 
                        insertion_data.push(temp);
                    }

                    //console.log(insertion_data);
                    var insertquerydetails = "INSERT INTO `product_item_master` (`storeid`, `skucode`, `product_name`, `product_des`, `epc`, `item_code`, `last_detected_time`, `user`, `zone`, `departmentid`, `brand`, `color`, `size`, `sfsr`, `status`, `group_name`, `group_description`, `dept`, `departmentname`, `brand_description`, `barcode`, `model`, `subgroup`, `sgroup`, `ean_no`, `sp_net`, `season`, `vat`, `sales_area`, `sp_gross_eng`, `sp_gross_arb`, `supplier_item_no`, `supplier_name`, `type_no`, `arabic_desc`, `origin`, `english_desc`, `company`, `currency`, `cost`, `image_url`, `style`, `country`, `supplier_no`, `po_supplier_no`) VALUES ? ";
                    //console.log(insertquerydetails);
                    if (insertion_data.length > 0) {

                        mysqlMain2.query(insertquerydetails, [insertion_data], function(err) {
                            if (err) {
                                console.log('errrrrrrrror',err);
                            } else {
                                console.log('inserted');

                                var new_query2 = " Delete FROM `product_item_master_2` where skucode in("+need_to_insert_str+") ";
                                mysql.queryCustom(new_query2).then(function(rzlts) {

                                });
                            }
                        })
                    }

                })
                .catch(function(error) {
                    console.log(error);
                });
            }
            var new_query3;
            if (need_to_insert.length > 0) {
                new_query3 = " SELECT * FROM `product_item_master_2` where skucode not in("+need_to_insert_str+") ";
            } else {
                new_query3 = " SELECT * FROM `product_item_master_2` ";
            }
            mysql.queryCustom(new_query3).then(function(rzlts2) {
                console.log('111111111111');
                var update_records = rzlts2.results;
                for (var i = 0; i < update_records.length; i++) {

                    var new_query4 = " UPDATE `product_item_master` SET "+
                            "`storeid` = '"+update_records[i].storeid+"',"+
                            "`skucode` = '"+update_records[i].skucode+"',"+
                            "`product_name` = '"+update_records[i].product_name+"',"+
                            "`product_des` = '"+update_records[i].product_des+"',"+
                            "`epc` = '"+update_records[i].epc+"',"+
                            "`item_code` = '"+update_records[i].item_code+"',"+
                            "`last_detected_time` = '"+update_records[i].last_detected_time+"',"+
                            "`user` = '"+update_records[i].user+"',"+
                            "`zone` = '"+update_records[i].zone+"',"+
                            "`departmentid` = '"+update_records[i].departmentid+"',"+
                            "`brand` = '"+update_records[i].brand+"',"+
                            "`color` = '"+update_records[i].color+"',"+
                            "`size` = '"+update_records[i].size+"',"+
                            "`sfsr` = '"+update_records[i].sfsr+"',"+
                            "`status` = '"+update_records[i].status+"',"+
                            "`group_name` = '"+update_records[i].group_name+"',"+
                            "`group_description` = '"+update_records[i].group_description+"',"+
                            "`dept` = '"+update_records[i].dept+"',"+
                            "`departmentname` = '"+update_records[i].departmentname+"',"+
                            "`brand_description` = '"+update_records[i].brand_description+"',"+
                            "`barcode` = '"+update_records[i].barcode+"',"+
                            "`model` = '"+update_records[i].model+"',"+
                            "`subgroup` = '"+update_records[i].subgroup+"',"+
                            "`sgroup` = '"+update_records[i].sgroup+"',"+
                            "`ean_no` = '"+update_records[i].ean_no+"',"+
                            "`sp_net` = '"+update_records[i].sp_net+"',"+
                            "`season` = '"+update_records[i].season+"',"+
                            "`vat` = '"+update_records[i].vat+"',"+
                            "`sales_area` = '"+update_records[i].sales_area+"',"+
                            "`sp_gross_eng` = '"+update_records[i].sp_gross_eng+"',"+
                            "`sp_gross_arb` = '"+update_records[i].sp_gross_arb+"',"+
                            "`supplier_item_no` = '"+update_records[i].supplier_item_no+"',"+
                            "`supplier_name` = '"+update_records[i].supplier_name+"',"+
                            "`type_no` = '"+update_records[i].type_no+"',"+
                            "`arabic_desc` = '"+update_records[i].arabic_desc+"',"+
                            "`origin` = '"+update_records[i].origin+"',"+
                            "`english_desc` = '"+update_records[i].english_desc+"',"+
                            "`company` = '"+update_records[i].company+"',"+
                            "`currency` = '"+update_records[i].currency+"',"+
                            "`cost` = '"+update_records[i].cost+"',"+
                            "`image_url` = '"+update_records[i].image_url+"',"+
                            "`style` = '"+update_records[i].style+"',"+
                            "`country` = '"+update_records[i].country+"',"+
                            "`supplier_no` = '"+update_records[i].supplier_no+"',"+
                            "`po_supplier_no` = '"+update_records[i].po_supplier_no+"' "+ 
                    " WHERE `skucode` = "+update_records[i].skucode+"  ";
                    mysql.queryCustom(new_query4).then(function(rzlts4) {
                        console.log(rzlts4);
                    });

                }

            }).catch(function(error) {
                console.log(error);
            });

        })
        .catch(function(error) {
            console.log(error);
        });
    });
}

cron.schedule('0 */14 * * * *', () => {  
    let timeInMs = Math.random() * (2000);
    setTimeout(update_product_item_master_sp,timeInMs);
    //prod_data_master_copy();
});

//cron.schedule('45 04 16 * * *', () => {  
    //let timeInMs = Math.random() * (2000);
    //setTimeout(update_product_item_master_sp,timeInMs);
    //prod_data_master_copy();
//});





async function soh_empty_check_from_iot_report(){

    lockfile.lock('soh_empty_check_from_iot_report.txt').then((release) => {
        
        console.log('<<soh_empty_check_from_iot_report>> soh check++++++++++++++++++++++++ ');
        
        

        soh_empty_check_iot();

        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand);
       
    })
    .catch((e) => {
       
    });
}


cron.schedule('1 45 18 * * *', () => {
    let timeInMs = Math.random() * (2000);
    setTimeout(soh_empty_check_from_iot_report,timeInMs);
});




async function cycle_count_run_nine_pm(){

    lockfile.lock('cycle_count_run_nine_pm.txt').then((release) => {
        
        console.log('<<cycle_count_run_nine_pm>> Run cycle count 9  ');
        
        // console2.execution_info('cycle_count_run_nine');
        cycle_count_run_nine();

        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}




// cron.schedule('1 42 19 * * *', () => {
//    let timeInMs = Math.random() * (2000);
//    setTimeout(cycle_count_run_nine_pm,timeInMs);
// });


async function get_goods_store_iot_report(){

    lockfile.lock('get_goods_store_iot_report.txt').then((release) => {
        
        console.log('<<get_goods_store_iot_report>> get_goods_store_iot_check  ');
        
        // console2.execution_info('get_goods_store_iot_check');

        get_goods_store_iot_check();


        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}

cron.schedule('1 55 18 * * *', () => {
    let timeInMs = Math.random() * (2000);
    setTimeout(get_goods_store_iot_report,timeInMs);          
});

async function get_ibt_iot_report(){

    lockfile.lock('get_ibt_iot_report.txt').then((release) => {
        
        console.log('<<get_ibt_iot_report>> get_ibt_iot_check  ');
        
        // console2.execution_info('get_ibt_iot_check');

        get_ibt_iot_check();


        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}


cron.schedule('1 5 19 * * *', () => {
    let timeInMs = Math.random() * (2000);
    setTimeout(get_ibt_iot_report,timeInMs); 
});


async function soh_daily_screen_shot(){

    lockfile.lock('soh_daily_screen_shot.txt').then((release) => {
        
        console.log('<<soh_daily_screen_shot>> soh_daily_screen_shot  ');
        
        // console2.execution_info('soh_daily_screen_shot');

       
        get_soh_summary_report();


        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}

// cron.schedule('1 35 23 * * *', () => {
//     let timeInMs = Math.random() * (2000);
//     setTimeout(soh_daily_screen_shot,timeInMs);  
// });

cron.schedule('1 15 19 * * *', () => {
    let timeInMs = Math.random() * (2000);
    setTimeout(soh_daily_screen_shot,timeInMs);  
});




function update_store(var_storename,var_mysql)
{


    var now = new Date();

    var CheckDate = dateFormat(now, "yyyy-mm-dd");

    var storename   = var_storename;
    var tabel_name  = "`stock_count_"+storename+"`";
            
    var mysql       = var_mysql;
    var new_query   = "SELECT * FROM  "+tabel_name+ " where stockcountdate='"+CheckDate+"' ";
   
    mysql.queryCustom(new_query).then(function(result) {
        if (result.status == "1") {

            var total_results = result.results;

            var asn_epc_rec = [];

            for (var b = 0; b < total_results.length; b++) {
                temp = [
                  
                    total_results[b].storeid,
                    total_results[b].departmentid,
                    total_results[b].code,
                    total_results[b].initial,
                    total_results[b].counted,
                    total_results[b].delta,
                    total_results[b].unexpected,
                    total_results[b].missing,
                    total_results[b].expected,
                    total_results[b].accuracy,
                    total_results[b].expected_sf,
                    total_results[b].expected_sr,
                    total_results[b].counted_sf,
                    total_results[b].counted_sr,
                    total_results[b].scanned,
                    total_results[b].stockcountdate,
                    total_results[b].brand_name,
                    total_results[b].color,
                    total_results[b].size,
                    total_results[b].style,
                    total_results[b].is_deleted,
                    total_results[b].price,
                    total_results[b].season,
                    total_results[b].suppliername,
                    total_results[b].totalprice
                ]; 
                asn_epc_rec.push(temp);
            }
            //console.log(asn_epc_rec);
            var insertquerydetails = "INSERT INTO "+tabel_name+
            " (`storeid`,`departmentid`,`code`,`initial`,`counted`,`delta`,`unexpected`,`missing`,`expected`,`accuracy`,`expected_sf`,`expected_sr`,`counted_sf`,`counted_sr`,`scanned`,`stockcountdate`,`brand_name`,`color`,`size`,`style`,`is_deleted`,`price`,`season`,`suppliername`,`totalprice`) " + " VALUES ? ";
            if (asn_epc_rec.length > 0) {
                mysql_bak.query(insertquerydetails, [asn_epc_rec], function(err) {
                      if (err) {
                        //console.log(err);
                        console.log(err);
                    }
                });
            }

        } else {
            //console.log('Error', JSON.stringify(result.error), '217-New_CancelRequestAsn');
            console.log('records_error');
            //res.end("error");
            //res.end(result.error);
        }
    });

}
function stock_count_bankup()
{
    var qry = "SELECT * FROM `tb_store` ";


    mysql.queryCustom(qry).then(function(result) {
        if (result.status == "1") {
            var total_stores = result.results;
            var new_query ='';
            var storename ='';

            for (var i = 0; i < total_stores.length; i++) {
                 
                storename=total_stores[i].storename;
                update_store(storename,mysql);
            }

        } else {
            //console.log('Error', JSON.stringify(result.error), '217-New_CancelRequestAsn');
            console.log('store_query');
            //res.end("error");
            //res.end(result.error);
        }
    });
}
async function stock_count_bak(){

    lockfile.lock('stock_count_bak.txt').then((release) => {
        
        console.log('<<stock_count_bak>> stock_count_bak  ');
        
        
        stock_count_bankup();


        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}


cron.schedule('1 35 19 * * *', () => {

    console.log("----------------------");
    let timeInMs = Math.random() * (2000);
    setTimeout(stock_count_bak,timeInMs);  
});

async function StockSummaryDump22_consume_automatic_cron(){

    lockfile.lock('StockSummaryDump22_consume_automatic.txt').then((release) => {
        
        console.log('<<StockSummaryDump22_consume_automatic>> StockSummaryDump22_consume_automatic  ');
        
        // console2.execution_info('StockSummaryDump22_consume_automatic');

       
        StockSummaryDump22_consume_automatic('n/a','');


        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}

cron.schedule('10 1 4 * * *', () => {
        
    //let timeInMs = Math.random() * (2000);
    //setTimeout(StockSummaryDump22_consume_automatic_cron,timeInMs); 
    
});

router.get('/auto_consume_soh', (req, res, next) => {
    console2.execution_info('auto_consume_soh');
    StockSummaryDump22_consume_automatic_cron();
    res.end("hellllllllo");
});



function mail_report(var_res)
{
    var res         = var_res;

    var now         = new Date();
    var today_date  = dateFormat(now, "yyyy-mm-dd");

    //var today_date = '2021-07-17';   
    var td_style    = 'font-family:sans-serif;border:thin solid rgb(100,149,237);padding:5px';
 
    var new_query   = " SELECT COUNT(*) as count,storeid FROM `zpl_printer` WHERE `date_time` >= '"+today_date+" 00:00:00' AND `date_time` <= '"+today_date+" 23:59:59' GROUP BY storeid ";
   console.log(new_query);
    mysql.queryCustom(new_query).then(function(result) {
        if (result.status == "1") {
            var record_set = result.results;
            var printed_tags = '';
            var total_printed_tags = 0;

            for(var i= 0;i<record_set.length;i++){

                var total_printed_tags = total_printed_tags + record_set[i].count;
                printed_tags += 
                '<tr style="background:rgb(232,237,255)">'+ 
                    ' <td style="'+td_style+'">'+record_set[i].storeid+'</td>'+
                    ' <td style="'+td_style+'">'+record_set[i].count+'</td> '+
                '</tr> ';
            }

            var t_printed_tags = total_printed_tags;

            var query = " SELECT *,COUNT(*) as count FROM goods_item_store WHERE `date` >= '"+today_date+" 00:00:00' AND `date` <= '"+today_date+" 23:59:59' GROUP BY `retail_item_batch_id` ";
            mysql.queryCustom(query).then(function(results) {
                if (results.status == "1") {
                    var record = results.results;
                    var gis_done = '';

                    for(var i= 0;i<record.length;i++){
                        gis_done += 
                        '<tr style="background:rgb(232,237,255)">'+ 
                            '<td style="'+td_style+'">'+record[i].store+'</td>'+
                            '<td style="'+td_style+'">'+record[i].retail_item_batch_id+'</td>'+
                            '<td style="'+td_style+'">'+record[i].count+'</td>'+
                            '<td style="'+td_style+'">'+record[i].date+'</td>'+
                        '</tr> ';
                    }
                    var t_gis_done = record.length;
                }

                var qry = " SELECT * FROM asn_master WHERE `shipping_date` >= '"+today_date+" 00:00:00' AND `shipping_date` <= '"+today_date+" 23:59:59' ";
                mysql.queryCustom(qry).then(function(rzlt) {
                    if (rzlt.status == "1") {
                        var records = rzlt.results;
                        var transfers_done = '';

                        for(var i= 0;i<records.length;i++){
                            transfers_done += 
                            '<tr style="background:rgb(232,237,255)">'+
                                '<td style="'+td_style+'">'+records[i].asn+'</td>'+
                                '<td style="'+td_style+'">'+records[i].source+'</td>'+
                                '<td style="'+td_style+'">'+records[i].destination+'</td>'+
                                '<td style="'+td_style+'">'+records[i].packed_item+'</td>'+
                                '<td style="'+td_style+'">'+records[i].transferred_item+'</td>'+
                                '<td style="'+td_style+'">'+records[i].status+'</td>'+
                            '</tr> ';
                        }
                        var t_transfers_done = records.length;
                    }

                    var qrys = " SELECT * FROM asn_master WHERE `receiving_date` >= '"+today_date+" 00:00:00' AND `receiving_date` <= '"+today_date+" 23:59:59' AND `status` = 'receiving' ";
                    mysql.queryCustom(qrys).then(function(rzlts) {
                        if (rzlts.status == "1") {
                            var record_sets = rzlts.results;
                            var receiving_done = '';

                            for(var i= 0;i<record_sets.length;i++){
                                receiving_done += 
                                '<tr style="background:rgb(232,237,255)">'+
                                    '<td style="'+td_style+'">'+record_sets[i].asn+'</td>'+
                                    '<td style="'+td_style+'">'+record_sets[i].source+'</td>'+
                                    '<td style="'+td_style+'">'+record_sets[i].destination+'</td>'+
                                    '<td style="'+td_style+'">'+record_sets[i].packed_item+'</td>'+
                                    '<td style="'+td_style+'">'+record_sets[i].transferred_item+'</td>'+
                                    '<td style="'+td_style+'">'+record_sets[i].received_item+'</td>'+
                                    '<td style="'+td_style+'">'+record_sets[i].status+'</td>'+
                                '</tr> ';
                            }
                            var t_receiving_done = record_sets.length;
                        }

                        var soh_qry = " SELECT * FROM soh_report WHERE soh_date='"+today_date+"' AND counted > 0 ";
                        mysql.queryCustom(soh_qry).then(function(soh_rzlt) {
                            if (soh_rzlt.status == "1") {
                                var soh_record_sets = soh_rzlt.results;
                                var cycle_count = '';

                                for(var i= 0;i<soh_record_sets.length;i++){
                                    cycle_count += 
                                    '<tr style="background:rgb(232,237,255)">'+
                                        '<td style="'+td_style+'">'+soh_record_sets[i].store_name+'</td>'+
                                    '</tr> ';
                                }
                                var t_cycle_count = soh_record_sets.length;
                            }

                            const fs = require('fs')
                            fs.readFile('./views/daily_email.html', 'utf8' , (err, full_html) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                                
                                full_html = full_html.split("{printed_tags}").join(printed_tags);
                                full_html = full_html.split("{total_printed_tags}").join(t_printed_tags);
                                
                                full_html = full_html.split("{gis_done}").join(gis_done);
                                full_html = full_html.split("{t_gis_done}").join(t_gis_done);

                                full_html = full_html.split("{transfers_done}").join(transfers_done);
                                full_html = full_html.split("{t_transfers_done}").join(t_transfers_done);

                                full_html = full_html.split("{receiving_done}").join(receiving_done);
                                full_html = full_html.split("{t_receiving_done}").join(t_receiving_done);
                                
                                full_html = full_html.split("{cycle_count}").join(cycle_count);
                                full_html = full_html.split("{t_cycle_count}").join(t_cycle_count);

                                if(res!=='n/a'){
                                    res.writeHead(200, { 'Content-Type':'text/html'});
                                }
                               
                                var maillist = process.env.ALERT_EMAIL_1;
                                const message = {
                                    from: 'saqib@innodaba.com', // Sender address
                                    to: maillist, // List of recipients
                                    subject: 'Daily Report', // Subject line
                                    html:full_html
                                };
                                transport.sendMail(message, function(err, info) {
                                    if(err) 
                                    {
                                        console.log(err)
                                    } 
                                    else 
                                    {
                                        console.log(info);
                                    }
                                });

                                if(res!=='n/a'){
                                    res.end(full_html);
                                }
                                else
                                {
                                    return false;
                                }
                                
                            });

                        });
                    });
                });
            

            }).catch(function(error) {
                //res.end(error);
                //console2.log('Error', JSON.stringify(error), '7078-faultyskus');
                console.log(error);
            });
        } else {

        }
    }).catch(function(error) {
        //res.end(error);
        console2.log('Error', JSON.stringify(error), '7078-faultyskus');
    });

}

async function mail_report_fn(){

    lockfile.lock('mail_report.txt').then((release) => {
        
        console.log('<<mail_report>> daily');
       
        mail_report('n/a');

        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}

cron.schedule('1 45 19 * * *', () => {
    let timeInMs = Math.random() * (2000);
    setTimeout(mail_report_fn,timeInMs);  
});

router.get('/mail_report', (req, res, next) => {
    console2.execution_info('mail_report');
    mail_report(res);
  
});


// cron.schedule('0 */2 * * *', () => {

//     console.log('running after 2 hours');
    
//     //StockSummaryDump22('n/a','');

// });


// cron.schedule('1,10 * * * * *', () => {

//     console.log("running a task every 10 second");
//     var access_token = mysql.globals.access_token;
    
    
//     //console2.execution_info('asn_notification');

// });















async function StockCountOldDataInsert(var_store_id,var_start_date) {
    var store_id = var_store_id;
    var start_date = var_start_date;
    try {
        // console2.execution_info('getStockCountOldData');
        var cond = '';

        var stock_count_tb = '';
        var data_filter = store_id;
        if (data_filter !== '' && data_filter !== "0" && data_filter !== 0 && data_filter !== undefined) {
            stock_count_tb = 'stock_count_'+store_id;
        } else {
            stock_count_tb = 'stock_count';
        }

        var total_rec = '0';

        if (start_date !== '' && start_date !== '0' && start_date !== 0) {
            var to_my_date = start_date;
            var to_date = dateFormat(to_my_date, "yyyy-mm-dd");
            cond += 'AND SC.stockcountdate  = "' + to_date + '"'
        }

        if (store_id != "" && store_id != 0 && store_id != "0") {
            cond += ' AND SC.storeid="' + store_id + '"' 
        } else{
            cond += ' AND SC.storeid="000"'
        }

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

        mysql.queryCustom(new_query).then(function(result) {
            getstoreinf = result.results;
            var stock_old_data = [];
            for (var i = 0; i < getstoreinf.length; i++) {
                temp = [
                    getstoreinf[i].date,
                    getstoreinf[i].storename,
                    getstoreinf[i].onhandtotal,
                    getstoreinf[i].inventroycount,
                    getstoreinf[i].item_accuracy,
                    getstoreinf[i].operational_accuracy,
                    getstoreinf[i].onhandmatching,
                    getstoreinf[i].missingtotal,
                    getstoreinf[i].overtotal,
                    getstoreinf[i].counted_sf,
                    getstoreinf[i].counted_sr
                ]; 
                stock_old_data.push(temp);
            }

            var insertquerydetails = "INSERT INTO stock_count_old_data "+
            " (`date`,`storeid`,`onhandtotal`,`inventroycount`,"+
            "`item_accuracy`,`operational_accuracy`,`onhandmatching`,`missingtotal`,`overtotal`,`counted_sf`,`counted_sr`) " + " VALUES ? ";
            //console.log(insertquerydetails);
            if (stock_old_data.length > 0) {
                mysqlMain2.query(insertquerydetails, [stock_old_data], function(err) {
                    if (err) {
                        //console.log('err');
                        console.log(err);
                    } 
                    //console.log('hello');
                    var qry = "SELECT SUM(initial) as CriticalStock,storeid as storeid FROM `" + stock_count_tb + "` SC " +
                        "  where  1 and counted = 0 " + cond + "group by SC.stockcountdate";
                    mysql.queryCustom(qry).then(function(result) {
                        critical_stock = result.results;
                        //console.log(critical_stock);
                        for (var i = 0; i < critical_stock.length; i++) {
                            var query = "UPDATE stock_count_old_data SET `critical_out_of_stock` = '"+critical_stock[i].CriticalStock+"' " +
                                "  WHERE `storeid` = '"+critical_stock[i].storeid+"' AND `date` = '"+dateFormat(start_date, "yyyy-mm-dd")+"' ";
                            console.log(query);
                            mysql.queryCustom(query).then(function(results) {
                                console.log(results);
                            }).catch(function(error) {
                                console.log(error);
                                //console2.log('Error', JSON.stringify(error), '247-getStockCountOldData');
                            });
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        //console2.log('Error', JSON.stringify(error), '247-getStockCountOldData');
                    });
                });

            }

        })
        .catch(function(error) {
            console.log(error);
            console2.log('Error', JSON.stringify(error), '247-getStockCountOldData');
        });
    } catch (e) {
        console.log(e);
        console2.log('Error', 'Catch Exception'+e, '329-getStockCountOldData  inventoryData');
    }
}

function old_cc_data_insert()
{
    var now       = new Date();
    now.setDate(now.getDate() - 90);

    var iot_date  = dateFormat(now, "yyyy-mm-dd");
    console.log(iot_date);
    var all_store = "select * from tb_store where 1 ";
    mysql.queryCustom(all_store).then(function(result_all_store) {


        if (result_all_store.status == "1") {

            var total_store_data = result_all_store.results;
            var storename='';
            if(total_store_data.length>0){
                
                const call_all_store_old_data = async () => {      
                    
                    for(var k=0;k<total_store_data.length;k++){
                        await sleep(5000);
                        storename = total_store_data[k].storename;
                        console.log("calling old store data for"+storename);
                        StockCountOldDataInsert(storename,iot_date);
                    }
                }
                call_all_store_old_data();
            }
        }

    });
}
router.get('/old_cc_data_insert', (req, res, next) => {
    //StockCountOldDataInsert('0001142','2021-08-04');
    console2.execution_info('old_cc_data_insert');
    old_cc_data_insert();
    res.end('Old CC job running');
});



async function old_cc_data_insert_fn(){

    lockfile.lock('old_cc_data_insert.txt').then((release) => {
        
        console.log('Old CC job async function running');
       
       old_cc_data_insert();

        var rand = Math.random()*5000;    
        return setTimeout(function (){
            return release();  
        },rand); 
    })
    .catch((e) => {
       
    });
}
//1 15 18

cron.schedule('1 38 18 * * *', () => {
    let timeInMs = Math.random() * (2000);
    setTimeout(old_cc_data_insert_fn,timeInMs);  
});




/*****************clean `epc_detail` Date Wise*****************/
router.get('/clean_epc_dtl_from_date', (req, res, next) => {
    console2.execution_info('clean_epc_dtl_from_date');
    var data = req.query;
    var count_days = data.days;

    for (var i = -1; i < count_days - 1; i++) 
    {
        var now         = new Date(data.date);
        now.setDate(now.getDate() - i);
        var dateString  = dateFormat(now, "yyyy-mm-dd");
        clean_epc_date_wise(dateString);
        //console.log(dateString);
    }
    /*var dateString  = '2021-06-17';
    clean_epc_date_wise(dateString);*/
    res.end('ended');
});

/*****************count `epc_detail` Date Wise*****************/
router.get('/count_epc_dtl_from_date', (req, res, next) => {
    console2.execution_info('count_epc_dtl_from_date');
    var data = req.query;
    var dateString  = data.date;
    console.log(dateString);
    var count_query = "SELECT COUNT(e.id) as ids FROM `epc_detail` e WHERE `id` IN "+
                    " (SELECT `id` FROM "+
                          "(SELECT `id` FROM `epc_detail` "+ 
                            " WHERE `Retail_CycleCountID`  = 'Manual Run' "+
                            "   AND `action_done` = 'CycleCount' "+
                            "   AND DATE(`date`) = '"+dateString+"' "+
                            " GROUP BY `epc` , `action_done` , `date`, `store_id` HAVING COUNT(`epc`)>1 "+
                   "       ) "+
                   " X )";
    mysql.queryCustom(count_query).then(function(result) {
        id_count = result.results[0].ids;
        var result = "Result against date "+dateString+" is "+id_count;
        res.end(result);
    });
});

/*****************clean `epc_detail` to days back*****************/
router.get('/clean_epc_dtl', (req, res, next) => {
    console2.execution_info('clean_epc_dtl');
    var from_days = 107;
    var to_day = 5;
    var to_days = from_days + to_day;
    for (var i = from_days; i < to_days; i++) 
    {
        var now         = new Date();
        now.setDate(now.getDate() - i);
        var dateString  = dateFormat(now, "yyyy-mm-dd");
        clean_epc_date_wise(dateString);
        //console.log(dateString);
    }
    /*var dateString  = '2021-06-17';
    clean_epc_date_wise(dateString);*/
    res.end('ended');
});

async function clean_epc_date_wise(var_date_string) {
    console.log('running for date',var_date_string);
    var date_string = var_date_string;
    var count_query = "SELECT COUNT(e.id) as ids FROM `epc_detail` e WHERE `id` IN "+
                    " (SELECT `id` FROM "+
                          "(SELECT `id` FROM `epc_detail` "+ 
                            " WHERE `Retail_CycleCountID`  = 'Manual Run' "+
                            "   AND `action_done` = 'CycleCount' "+
                            "   AND DATE(`date`) = '"+date_string+"' "+
                            " GROUP BY `epc` , `action_done` , `date`, `store_id` HAVING COUNT(`epc`)>1 "+
                   "       ) "+
                   " X )";
    mysql.queryCustom(count_query).then(function(result) {
        id_count = result.results[0].ids;
        if (id_count > 0) 
        {
            var query = "DELETE FROM `epc_detail` WHERE `id` IN "+
                            " (SELECT `id` FROM "+
                                  "(SELECT `id` FROM `epc_detail` "+ 
                                    " WHERE `Retail_CycleCountID`  = 'Manual Run' "+
                                    "   AND `action_done` = 'CycleCount' "+
                                    "   AND DATE(`date`) = '"+date_string+"' "+
                                    " GROUP BY `epc` , `action_done` , `date`, `store_id` HAVING COUNT(`epc`)>1 "+
                           "       ) "+
                           " X )";
            console.log(query);
            mysql.queryCustom(query).then(function(result) {
                clean_epc_date_wise(date_string);
                //console.log(result);
            })
            .catch(function(error) {
                console.log(error);
            });
        } else {
            console.log('done for date', date_string);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function check_duplication_fn() {
    var count_query = " SELECT * FROM zpl_printer WHERE 1 GROUP BY epc HAVING COUNT(epc) > 1 ";
    mysql.queryCustom(count_query).then(function(result) {
        var records_cnt = result.results.length;
        
        var count_query = " SELECT `value` FROM web_settings WHERE `key` = 'zpl_printer_duplication' ";
        
        mysql.queryCustom(count_query).then(function(result1) {
            var zpl_printer_duplication = result1.results[0].value;

            if (records_cnt > zpl_printer_duplication) {
                var update_query = "UPDATE `web_settings` SET `value` = '"+records_cnt+"' WHERE `key` = 'zpl_printer_duplication' ";
                var table = "Duplication Increases From "+zpl_printer_duplication+" to "+records_cnt;
                mysql.queryCustom(update_query).then(function(result) {
                    var maillist = process.env.ALERT_EMAIL_1;
                    const message = {
                        from: 'saqib@innodaba.com', // Sender address
                        to: maillist, // List of recipients
                        subject: 'ZPL Printer Duplication Notification ', // Subject line
                        html:table// Plain text body
                    };
                    transport.sendMail(message, function(err, info) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(info);
                        }
                    });
                });
            }

        });
        
    });
}

cron.schedule('0 */2 * * *', () => {
    check_duplication_fn();
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

function authenticationMidleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

module.exports = router;
