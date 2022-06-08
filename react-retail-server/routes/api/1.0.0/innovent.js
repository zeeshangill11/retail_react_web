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
const sku_parse = require("../../../controllers/epc-parser-fixed.js");
const aduit_Add = require("../../../controllers/custom_auditinfo.js");
var now = new Date();
const fs = require('fs');
var mysql2 = require("mysql");

var cron = require('node-cron');

var access_token2 = mysql.globals.access_token2;

//console.log(access_token2)
var mysqlMain2 = mysql.mysqlMain;

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    } 
    return true;
} 


function asn_submit(var_data,var_res){
//router.patch('/api/things/ASNDATA', function (req, res) {
    try{ 
        // console.log(var_data);
        var now = new Date();

        try {

            var data = var_data;
            var res = var_res;
            data_stringify = JSON.stringify(data);
            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }



            var token = access_token2;

            // if (req.headers.apikey == token){

                var results = writeData;
                var temp = [];
                var remarks_string = '';
                var destination_location = '';
                var asn_epc_rec = [];
                var parse_new = sku_parse;
                var sku_parts = '';
                var sku  = '';
                var sku_int = '';
                var SKU_original = '';
                var temp2 = [];
                var epc_details_data_array = [];
                var epc_query_new2 = '';
                var repetition_delete = '';
                var process_type = '';
                var storename = '';
                var Retail_CycleCountID = '';
                
                var process_status = '';
                var my_insertgobal = '';


                var total_asn_record = results.length;

                for(var i=0;i<results.length;i++){


                    if(results[i].serialNumber){
                        results[i].serialNumber
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'serialNumber field is missing in payload !'    
                        });

                    }


                    if(results[i].udfs){
                        results[i].udfs
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'udfs object is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.Retail_Bizlocation_Original){
                        results[i].udfs.Retail_Bizlocation_Original
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_Bizlocation_Original is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.Retail_Bizlocation_Original.value){
                        results[i].udfs.Retail_Bizlocation_Original.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_Bizlocation_Original value is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.deviceId){
                        results[i].udfs.deviceId
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object deviceId is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.deviceId.value){
                        results[i].udfs.deviceId.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object deviceId value is missing in payload !'    
                        });

                    }



                    if(results[i].udfs.Retail_BizTransactionId){
                        results[i].udfs.Retail_BizTransactionId
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_BizTransactionId is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.Retail_BizTransactionId.value){
                        results[i].udfs.Retail_BizTransactionId.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_BizTransactionId value is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.Retail_BizTransactionProcess){
                        results[i].udfs.Retail_BizTransactionProcess
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_BizTransactionProcess is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.Retail_BizTransactionProcess.value){
                        results[i].udfs.Retail_BizTransactionProcess.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_BizTransactionProcess value is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.Retail_BizTransactionProcessStatus){
                        results[i].udfs.Retail_BizTransactionProcessStatus
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_BizTransactionProcessStatus is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.Retail_BizTransactionProcessStatus.value){
                        results[i].udfs.Retail_BizTransactionProcessStatus.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object Retail_BizTransactionProcessStatus value is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.source){
                        results[i].udfs.source
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object source is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.source.value){
                        results[i].udfs.source.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object source value is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.user){
                        results[i].udfs.user
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object user is missing in payload !'    
                        });

                    }


                    if(results[i].udfs.user.value){
                        results[i].udfs.user.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object user value is missing in payload !'    
                        });

                    }


                    




                    dateTime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                               
                    if (results[0].udfs.Retail_BizTransactionProcess.value == 'packing') {
                        remarks_string = " , packing_remarks= '" + results[i].udfs.remarks.value + "' , packing_date = '" + dateTime + "' ";
                    } else if (results[0].udfs.Retail_BizTransactionProcess.value == 'shipping') {
                        remarks_string = " , shipping_remarks= '" + results[i].udfs.remarks.value  + "' , shipping_date= '" + dateTime + "' ";
                    } else if (results[0].udfs.Retail_BizTransactionProcess.value == 'receiving') {
                        remarks_string = " , receiving_remarks= '" + results[i].udfs.remarks.value  + "' ,receiving_date = '" + dateTime + "'  ";
                    }

                    if(results[i].udfs.Retail_Bizlocation !== undefined){
                        destination_location = results[i].udfs.Retail_Bizlocation.value;
                    }

                    sku_parts    = parse_new.parse(results[i].serialNumber);
                    sku          = sku_parts.Sku;
                    sku_int      = parseInt(sku,10);

                    if(sku_int>0){
                      SKU_original  =    sku_int;
                    }



                    process_type = results[i].udfs.Retail_BizTransactionProcess.value;
                    storename = results[i].udfs.Retail_Bizlocation_Original.value;
                    Retail_CycleCountID = results[i].udfs.Retail_BizTransactionId.value;

                    process_status = results[i].udfs.Retail_BizTransactionProcessStatus.value;
                    temp = [

                        results[i].udfs.Retail_Bizlocation_Original.value,
                        results[i].udfs.Retail_BizTransactionProcessStatus.value,
                        results[i].udfs.Retail_BizTransactionProcess.value,
                        'na',
                        results[i].serialNumber,
                        destination_location,
                        results[i].udfs.Retail_BizTransactionId.value,
                        results[i].udfs.Retail_Bizlocation_Original.value,
                        dateTime,
                        'na',
                        SKU_original,

                    ];

                    asn_epc_rec.push(temp);

                    temp2 = [

                        results[i].serialNumber,
                        SKU_original,
                        results[i].udfs.Retail_BizTransactionId.value,
                        'na',
                        'na',
                        'na',
                        'na',
                        dateTime,
                        results[i].udfs.Retail_Bizlocation_Original.value,
                        'na',
                        results[i].udfs.Retail_BizTransactionProcess.value,
                    ];


                    epc_details_data_array.push(temp2);
                    

                    epc_query_new2 += "CALL add_epc_rec('" + results[i].udfs.Retail_BizTransactionId.value + "'," +
                    " '" + results[i].udfs.Retail_Bizlocation_Original.value + "','" + results[i].serialNumber + "'," +
                    "'" + SKU_original + "','na', " +
                    "'na','0','0','" +
                    dateTime + "');";


                    repetition_delete += "CALL asn_fix_321 ('"+results[i].udfs.Retail_BizTransactionId.value+"','"+results[i].udfs.Retail_BizTransactionProcess.value+"');";

                }

                aduit_Add.send(
                    process_type +' job run successfully for store '+storename+' '+
                    'Total IBT Inserted '+total_asn_record, 
                    'audit_json',
                    process_type,
                    '',
                    storename,
                    '',
                    Retail_CycleCountID
                );
               
            my_insertgobal = " INSERT INTO  asn_master (`date`, `asn`,`status`)" +
            "SELECT * FROM (SELECT '" + dateTime + "','" + Retail_CycleCountID + "','" + process_status + "') AS tmp " +
            " WHERE NOT EXISTS (SELECT asn FROM asn_master " +
            " WHERE asn = '" + Retail_CycleCountID + "'  ) LIMIT 1; ";
            //console.log(my_insertgobal);
            mysqlMain2.query(my_insertgobal, function(error, results, fields) {

                if(error){
                 console2.log('Error', JSON.stringify(error), '670-Insert in IBT master process name ' + process_types + ' ');
                    return res.status(400).send({
                        error:'1',
                        message:'insert query error',
                        system_msg:error    
                    });
                }
                
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

            mysqlMain2.query(asn_data_str, [asn_epc_rec], function(err) {

                if (err) {
                    return res.status(400).send({
                        error:'1',
                        message:'insert query asn items error',
                        system_msg:err    
                    });
                   // console2.log('Error', JSON.stringify(err), '715-EpcDump API  process name ' + process_types + ' ');
                    //console.log(err);
                }
                mysqlMain2.query(epc_query_new2, function(err) {

                    mysqlMain2.query(insertquerydetails, [epc_details_data_array], function(err) {
                        if(err){
                            return res.status(400).send({
                                error:'1',
                                message:'insert query epc details error',
                                system_msg:err    
                            });
                           console2.log('Error', JSON.stringify(err), '475-EpcDump API insert in epc details process name ' + process_types + ' '); 
                        }else{



                            var today_date = dateFormat(now, "yyyy-mm-dd");

                                var desti = ''

                                if (destination_location == '') {

                                    desti = '';

                                } else {

                                    desti = destination_location;

                                }
                                var source = ''
                                if (results[0].udfs.Retail_BizTransactionProcess.value  == 'packing' || results[0].udfs.Retail_BizTransactionProcess.value  == 'shipping') {
                                    source = " source='" + storename + "', "
                                }


                                var update_query = "update asn_master set " + source +
                                    " `date` = '" + today_date + "', " +
                                    " destination = '" + desti + "'," +
                                    " packed_item = (select COUNT(process) from asn_items where " +
                                    " process='packing' AND asn = '" + Retail_CycleCountID + "' and is_deleted='0' ), " +
                                    "  transferred_item = (select COUNT(process) from asn_items where process='shipping' AND asn = '" + Retail_CycleCountID + "' and is_deleted='0' ), " +
                                    "  received_item = (select COUNT(process) from asn_items where process='receiving' AND asn = '" + Retail_CycleCountID + "' and is_deleted='0' )," +
                                    " status = '" + process_status + "'" + remarks_string +
                                    " WHERE asn = '" + Retail_CycleCountID + "';"
                                
                                    mysql.queryCustom(update_query).then(function(result) {
                                    if (result.status == "1") {

                                        setTimeout(function() {
                                            mysqlMain2.query(repetition_delete, function(err) {
                                                if (err) {
                                                    return res.status(400).send({
                                                        error:'1',
                                                        message:'Delte repetition SP',
                                                        system_msg:err    
                                                    });

                                                console2.log('Error', JSON.stringify(err), '427-repetition_delete API  repetition_delete');
                                                }else{
                                                    return res.status(200).send({
                                                        error:'0',
                                                        message:'Successfully Run',
                                                        // system_msg:err    
                                                    });
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
                                        return res.status(400).send({
                                            error:'1',
                                            message:'Update Query',
                                            system_msg:error    
                                        });
                                        console2.log('Error', JSON.stringify(error), '756-EpcDump API   process name ' + process_types + ' ');   
                                    }
                                    
                                });



                                if (err) {
                                    return res.status(400).send({
                                        error:'1',
                                        message:'insert query asn items error',
                                        system_msg:err    
                                    });
                                   // console2.log('Error', JSON.stringify(err), '715-EpcDump API  process name ' + process_types + ' ');
                                    //console.log(err);
                                }else{

                                    

                                }
                        }
                        
                        //console.log(err);
                    });
                });   

            })
        // }

        //res.end('ok');
        
    //});
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '569-asn_submit');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '576-asn_submit');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    } 
}
function get_store_soh(storename,var_res){
    try{
        return new Promise((resolve, reject) => {
            var now = new Date();
            var CheckDate = dateFormat(now, "yyyy-mm-dd");
            //var CheckDate = '2021-06-03';
            var res = var_res;

            var store = storename;
            store = store.split('admin').join('');
            //console.log(store)
            
            var select_query = "SELECT * FROM stock_count_"+store+" a where 1 and stockcountdate = '"+CheckDate+"';"
           //console.log(select_query)
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
                        totalprice:result.results[k].totalprice
                        
                    };
                    my_ar[result.results[k].code]=myObj;
                }

               let sendparam = {
                    db_data:my_ar,
                    store_name: store
                }

                resolve(sendparam);
            }).catch(err => {
                res.status(400).send({
                    error: "1",
                    message:"select_query error ",
                    system_msg: err,
                });
                console2.log('Error', JSON.stringify(err), '461-Check_StockExists API StockSummaryDump api error');
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '650-get_store_soh');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '657-get_store_soh');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }     
}

function fix_count_table(storename,response,var_res)
{   
    try{
        return new Promise((resolve, reject) => {
            var now = new Date();
            var CheckDate = dateFormat(now, "yyyy-mm-dd");
            var temp = response;
            var res = var_res;
            
            //if (!myObj.hasOwnProperty(i)) continue; // safety!
            var store_name = storename;
            
            get_store_soh(store_name,res).then(function(returnData){
                                
               
                var my_prev_db_rec  = returnData.db_data;
                var db_data         = returnData.db_data;
                var store_name      = returnData.store_name;
                var array_dump      = [];
            
             
              
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
                var db_data2        = new Object();
                var unexpected      =   0;
                var missing         =   0;
                var parse_new       = sku_parse;
                var sku_parts       = '';
                var SKU_original    =  '';
                var sku_int = '';
                var sku  = '';
                var zone = '';

                var season          =   '';
                var color           =   '';
                var size            =   '';
                var style           =   '';
                var price           =   ''; 
                var suppliername    =   '';
                var totalprice      =   '';
                console.log("==API number of record==>>"+temp.results.length);
                for(k=0; k<temp.results.length; k++)
                {
                        
                   
                    sku_parts             = parse_new.parse(temp.results[k].serialNumber);
                    SKU_original          = sku_parts.Sku
                    sku      = parseInt(SKU_original,10);
                   
                    if(sku>0){
                        if(typeof(db_data[sku])!=="undefined")
                        {
                            if(temp.results[k].Zone == 'stock room'){
                                zone = 'StockRoom'
                            }else if(temp.results[k].Zone == 'sales floor'){
                                zone = 'SalesFloor'
                            }    
                            

                            sku_data        =   db_data[sku];
                            departmentid    =   sku_data.departmentid;
                            initial         =   sku_data.initial;
                            
                            counted_sf      =   db_data[sku].counted_sf;
                            counted_sr      =   db_data[sku].counted_sr;
                            counted         =   db_data[sku].counted;
                            missing         =   db_data[sku].missing;
                            unexpected      =   db_data[sku].unexpected;


                            counted++;
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
                                brandname22    = escape(api_data.Brand);
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
                                stockcountdate:sku_data.stockcountdate,
                                brand_name:brandname22,
                                color:color,
                                size:size,
                                style:style,
                                season:season,
                                price:price,
                                suppliername:suppliername,
                                totalprice:totalprice
                                // extra_item:0,

                            };

                            
                            db_data[sku]=myObj;
                            
                        }
                        else
                        {   
                            
                            if(typeof(sku)!=="undefined" || sku>0){
                                
                                api_data     = temp.results[k];
                                brandname22    = escape(api_data.Brand);
                                departmentid = temp.results[k].departmentid;
                                if(temp.results[k].zone=="SalesFloor")
                                {   
                                    counted_sf++;
                                }

                                if(temp.results[k].zone=="StockRoom")
                                {   
                                    counted_sr++;
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
                                    totalprice:api_data.TotalPrice
                                    // extra_item:1
                                };  
                               
                                db_data[sku]=myObj;
                            }  
                        } 
                    } 
                }
                
                var temp22 = '';
                var dump_db = [];
               
                var update_item_code = '';
                console.log("=====DB Number of record=>"+Object.keys(db_data).length);
          
                var insert_query = "INSERT INTO `stock_count_"+store_name+"`(`storeid`, `departmentid`, `code`,"+ 
                " `initial`, `counted`, `delta`, `unexpected`,"+ 
                " `missing`, `expected`, `accuracy`, `expected_sf`,"+ 
                " `expected_sr`, `counted_sf`, `counted_sr`,"+ 
                " `scanned`, `stockcountdate`, `brand_name`,"+ 
                " `color`, `size`, `style`,`season`,`price`,`suppliername`,`totalprice`) VALUES ? ";
            
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
                       
                    ];
              
                    dump_db.push(temp22);
                }
                
            
              console.log("==="+delete_query);
                if(Object.keys(my_prev_db_rec).length>0)
                {
                    var delete_query = "DELETE FROM stock_count_"+store_name+" WHERE  "+ 
                                "  stockcountdate='"+CheckDate+"'";

                    mysqlMain2.query(delete_query, function(err) {
                        if(err){
                            console2.log('Error', err, '689-CycleCount delete_query api CycleCount error ');
                            return res.status(400).send({
                                error: "1",
                                message:"Delete Query error",
                                system_msg: err,
                            });
                        }
                        mysqlMain2.query(insert_query, [dump_db], function(err) {
                            if (err) {
                                console2.log('Error', JSON.stringify(err), '697-insert_query Dump insert_query');
                                return res.status(400).send({
                                    error: "1",
                                    message:"Insert Query error",
                                    system_msg: err,
                                });
                            }else{

                                resolve('ok');
                            }
                        }); 
                    });      
                }            
            }).catch(function(error) {

                console2.log('Error', error, '701-get_store_soh fix_count_table API api  error ');
                res.status(400).send({
                    error: "1",
                    message:"get_store_soh  fix_count_table error ",
                    system_msg: error,
                });
            })
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '994-fix_count_table');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1001-fix_count_table');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }           
}

function cycle_count(var_data,var_res)
{
    try{

        //console2.log_entry("POST GI FROM Mobile",req.body);

        var yesterday_Date = (new Date(Date.now() - 1 * 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
     
        var data = var_data;
        var res  = var_res;
        var temp = [];
        var array_dump = [];

        try {

            data_stringify = JSON.stringify(data)

            writeData = JSON.parse(data_stringify);

            var storename = writeData[0].udfs.user.value;

            storename     = storename.split('store').join('000');
            storename     = storename.substring(0, 7);
            var parse_new = sku_parse; 
            var sku22        = '';
            var sku_parts    = '';
            var SKU_original = '';
            var sku          = '';
            for(var i = 0;i<writeData.length;i++){

                if(writeData[i].serialNumber){
                   
                   writeData[i].serialNumber

                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "serialNumber filed is missing in payload !",
                    });
                }


                if(writeData[i].udfs.Retail_CycleCountDate){

                    writeData[i].udfs.Retail_CycleCountDate

                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object Retail_CycleCountDate filed is missing in payload !",
                    });

                }

                if(writeData[i].udfs.Retail_CycleCountDate.value){

                    writeData[i].udfs.Retail_CycleCountDate.value

                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object Retail_CycleCountDate value  is missing in payload !",
                    });

                }

                if(writeData[i].udfs.Retail_CycleCountID){
                    
                    writeData[i].udfs.Retail_CycleCountID
                
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object Retail_CycleCountID is missing in payload !",
                    });

                }


                if(writeData[i].udfs.Retail_CycleCountID.value){
                    
                    writeData[i].udfs.Retail_CycleCountID.value
                
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object Retail_CycleCountID value is missing in payload !",
                    });

                }

                if(writeData[i].udfs.deviceId){

                    writeData[i].udfs.deviceId

                }else{


                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object deviceId is missing in payload !",
                    })

                }


                if(writeData[i].udfs.deviceId.value){

                    writeData[i].udfs.deviceId.value

                }else{


                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object deviceId value is missing in payload !",
                    })

                }


                if(writeData[i].udfs.sourceModule){
                    writeData[i].udfs.sourceModule
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object sourceModule is missing in payload !",
                    })

                }



                if(writeData[i].udfs.sourceModule.value){
                    writeData[i].udfs.sourceModule.value
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object sourceModule value is missing in payload !",
                    })

                }

                if(writeData[i].udfs.Zone){
                    writeData[i].udfs.Zone
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object Zone is missing in payload !",
                    })
                    
                }



                if(writeData[i].udfs.Zone.value){
                    writeData[i].udfs.Zone.value
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object Zone value is missing in payload !",
                    })
                    
                }

                if(writeData[i].udfs.source){
                    writeData[i].udfs.source
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object source is missing in payload !",
                    })

                }

                if(writeData[i].udfs.source.value){
                    writeData[i].udfs.source.value
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object source value is missing in payload !",
                    })

                }

                if(writeData[i].udfs.user){
                    writeData[i].udfs.user
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object user is missing in payload !",
                    })

                }

                if(writeData[i].udfs.user.value){
                    writeData[i].udfs.user.value
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object user value is missing in payload !",
                    })

                }

                if(writeData[i].udfs.PartialCountAsQty){
                    writeData[i].udfs.PartialCountAsQty
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object PartialCountAsQty is missing in payload !",
                    })

                }

                if(writeData[i].udfs.PartialCountAsQty.value){
                    writeData[i].udfs.PartialCountAsQty.value
                }else{

                    return res.status(400).send({
                        error: "1",
                        message: "In udfs object PartialCountAsQty value is missing in payload !",
                    })
                }

               
                sku_parts             = parse_new.parse(writeData[i].serialNumber);
                SKU_original          = sku_parts.Sku
                sku      = parseInt(SKU_original,10);
                   if(sku>0){
                    sku22 = sku;
                   }

                temp = [

                    writeData[i].serialNumber,
                    sku22,
                    writeData[i].udfs.Retail_CycleCountDate.value,
                    writeData[i].udfs.Retail_CycleCountID.value,
                    writeData[i].udfs.deviceId.value,
                    writeData[i].udfs.sourceModule.value,
                    writeData[i].udfs.Zone.value,
                    writeData[i].udfs.source.value,
                    writeData[i].udfs.user.value,
                    writeData[i].udfs.PartialCountAsQty.value
                ];
                array_dump.push(temp);
            }

            /*yesterday_Date deleted*/
            var delete_query = "DELETE FROM cyclecount_temp_"+storename+" where 1 and "+ 
            " cyclecount_date <= '"+yesterday_Date+"'";
            //console.log(delete_query)
            /*New insert*/
            var insert_query = `INSERT IGNORE INTO cyclecount_temp_`+storename+`(serialNumber,
            item_code, 
            Retail_CycleCountDate, Retail_CycleCountID, deviceId, 
            sourceModule, Zone, source, user, PartialCountAsQty) VALUES ?`;

            mysqlMain2.query(delete_query, function(err) {
                if(err){

                    console2.log('Error', err, '1012-CycleCount delete_query api CycleCount error ');
                    return res.status(400).send({
                        error: "1",
                        message:"Delete Query error ",
                        system_msg: err
                    });
                }
                mysqlMain2.query(insert_query,[array_dump], function(err) {
                    if(err){
                        console2.log('Error', err, '1020-CycleCount insert_query,[array_dump] ');
                        return res.status(400).send({
                            error: "1",
                            message:"Insert Query error ",
                            system_msg: err
                        })  
                    }
                        var CheckDate = dateFormat(now,"yyyy-mm-dd");

                        var select_query = "SELECT * FROM cyclecount_temp_"+storename+" a where 1 and cyclecount_date = '"+CheckDate+"';"
                         // console.log(select_query)
                        mysql.queryCustom(select_query).then(function(result) {

                            if (result.status == "1") {

                                var total_results = result.results;
                                var total_record = result.results.length;
                                var send_api_data = result;
                                if(total_record > 0){

                                    var storeName     = total_results[0].user;
                                    storeName         = storeName.split('store').join('000');
                                    console.log("==="+storeName);
                                    fix_count_table(storeName,send_api_data,res).then(function(result){
                                        if(result = 'ok'){
                                            res.status(200).send({
                                                error: "1",
                                                message: "Inserted Successfully",
                                            });   
                                        }  
                                    })
                                }
                                
                                //console.log(storeName);
                            }
                        }).catch(err => {
                            // console.log(err)
                            return res.status(400).send({
                                error: "1",
                                message:"Select_query Query error ",
                                system_msg: err
                            })
                            console2.log('Error', JSON.stringify(err), '46w1-Check_StockExists API StockSummaryDump api error');
                        });   
                });
            });
            

           

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1352-cycle_count');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1359-cycle_count');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }             
}

router.patch('/COUNTEDITEMS', function (req, res) {
    try{
        console2.execution_info('COUNTEDITEMS');
        var token               = access_token2;
        var payload22           = '';
        var endpoint22          = '';
        var server_protocol     = '';
        var goods_in_item_ar    =  [];
        var cycle_count_ar      =  [];
        var asn_item_ar         =  [];
       console2.log_entry("/innovent/COUNTEDITEMS 2",req.body);

        if (req.headers.apikey == token) {
           
            var data        = req.body;
            
            if(data.length>0)
            {

                
                for (i = 0; i < data.length; i++) 
                {   
                    if(data[i].udfs){
                        data[i].udfs
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'udfs Object is missing in payload !'    
                        });
                    }
                    
                    if(data[i].udfs.sourceModule.value=="cycleCount")
                    {
                        cycle_count_ar.push(data[i]);
                    }  
                }
                //console.log(cycle_count_ar);

                

                
                if(cycle_count_ar.length>0)
                {
                    console.log("calling cyclecount");
                 
                    cycle_count(cycle_count_ar,res);
                } 

            }
            else
            {
                res.end("no data");
            }
        }
        else
        {
            return res.status(500).send({
                error:'1',
                message:'api key not valid !'    
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1431-COUNTEDITEMS');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1438-COUNTEDITEMS');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
});
router.patch('/SUPPLYCHAIN', function (req, res) {

    try{ 
        console2.execution_info('SUPPLYCHAIN');
        var token               = access_token2;
        var payload22           = '';
        var endpoint22          = '';
        var server_protocol     = '';
        var goods_in_item_ar    =  [];
        var cycle_count_ar      =  [];
        var asn_item_ar      =  [];
   
   
        if (req.headers.apikey == token) {
 
        
         var data        = req.body;
      
         var tagid       = data.TagID;
        
 
         if(data.length>0)
         {
             for (i = 0; i < data.length; i++) 
             {   
                
                
 
                
                 if(typeof(data[i].udfs.Retail_BizTransactionProcess) !== "undefined"){
                     if(data[i].udfs.Retail_BizTransactionProcess.value=="shipping" 
                         || data[i].udfs.Retail_BizTransactionProcess.value=="packing" 
                         || data[i].udfs.Retail_BizTransactionProcess.value=="receiving")
                     {
                         asn_item_ar.push(data[i]);
                     }
                 }
                 
                 
                 
                
             }
      
             if(asn_item_ar.length>0)
             {
                 console.log("calling ibt");
                 console2.log_entry("SUPPLYCHAIN",asn_item_ar);
                 asn_submit(asn_item_ar,res);
             } 
 
         }
         else
         {
             res.status(200).send({
                 total:'Invalid Object List Sent!'
                 
             });
         }
 
 
 
        } else {
            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1513-SUPPLYCHAIN');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1520-SUPPLYCHAIN');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }     

});


function get_printed_all(tagids_list)
{
    try{
        var tagids_list = tagids_list; 

        return new Promise((resolve, reject) => {
           
            var exists = '0';
            var select_query = "SELECT * FROM zpl_printer where epc in("+tagids_list+");"
            // console.log(select_query)
            mysql.queryCustom(select_query).then(function(result) {
                var result_set = result.results;
                if (result.results.length !== 0) {
                    exists = '1'
                }
                var obj = {};
                var zpl_arr = {};
                for(var z=0;z<result_set.length;z++){
                    
                    obj = {

                        uid:result_set[z].uid,
                        epc:result_set[z].epc,
                        suppliername:result_set[z].suppliername,
                        qty:result_set[z].qty,
                        PO_NO:result_set[z].PO_NO,
                        Supplier_ID:result_set[z].Supplier_ID,
                        Shipment_no:result_set[z].Shipment_no,
                        Comments:result_set[z].Comments,
                        sku:result_set[z].sku,
                        Product_Name:result_set[z].Product_Name,
                        storeid:result_set[z].storeid,
                        Retail_Product_Price:result_set[z].Retail_Product_Price,
                        Retail_Product_VAT:result_set[z].Retail_Product_VAT,
                        Retail_Product_SP_VAT_EN:result_set[z].Retail_Product_SP_VAT_EN,
                        Retail_Product_Color:result_set[z].Retail_Product_Color,
                        Retail_Product_Size:result_set[z].Retail_Product_Size,
                        Retail_Product_Season:result_set[z].Retail_Product_Season,
                        Retail_Product_Season:result_set[z].Retail_Product_Gender,
                        Retail_Product_SupplierItemNum:result_set[z].Retail_Product_SupplierItemNum
                    
                    };
                    zpl_arr[result_set[z].epc]=obj;
                    //console.log(obj)

                }
                
                let sendparam = {
                    ifexists:exists,
                    results:zpl_arr
                }

                resolve(sendparam);
            }).catch(err => {
                console2.log('Error', JSON.stringify(err), '51 roit core service issue');
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '241-get_printed_all');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '248-get_printed_all');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }       

}


function get_printed_all_product_item_master(var_tagids_list)
{
    try{
        return new Promise((resolve, reject) => {
            var tagids_list = var_tagids_list;       
            var exists = '0';
            var sku_list = '';
            var obj = {};
            var my_array = {};
            
            for (var element in tagids_list) {
                sku_list +=  "'"+tagids_list[element]+"' ,"
            }
            sku_list = sku_list.substring(0, sku_list.length - 2);

            var select_query = "SELECT * FROM product_item_master where item_code in("+sku_list+");"
            //console.log(select_query)
            var sku_exist_list = {};
            var return_sku={};
            mysql.queryCustom(select_query).then(function(result) {
               
                if (result.results.length !== 0) {
                    exists = '1'
                    var result_set = result.results;
                    for(var j=0;j<result_set.length;j++){
                        sku_exist_list[result_set[j].item_code]='ok';    
                    }

                    var mysku='';
                    for (var element in tagids_list) {
                        
                        mysku = tagids_list[element];

                        if( sku_exist_list[mysku]=='ok')
                        {
                            return_sku[element] = tagids_list[element];    
                        }
                    }
                }

                
                // console.log(return_sku)
                let sendparam = {
                    ifexists:exists,
                    results:return_sku
                }

                resolve(sendparam);
            }).catch(err => {
                console2.log('Error', JSON.stringify(err), '137 roit core service issue');
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '313-get_printed_all_product_item_master');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '320-get_printed_all_product_item_master');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }        
}

function goods_item_store_submit(var_data,var_res)
{
    try{        
        // console.log(var_data.length);
        var data = var_data;
        var res  = var_res;
        var results     = {};
        var parse_new = sku_parse
        var main_result = [];
        var sku_parts  = '';
        var sku = '';
        var sku_int = '';
        var sku_list = '';
        var my_ar = {};
        var myObj = {};

        var epc_list_str = '';
    
        for (i = 0; i < data.length; i++) {
            
            epc_list_str += "'"+data[i].serialNumber+"' ,";
            sku_parts    = parse_new.parse(data[i].serialNumber); 
            sku          = sku_parts.Sku;

            sku_int      = parseInt(sku,10);
            if(sku_int>0){
                sku_list +=  "'"+sku_int+"' ,"
            }

           
            my_ar[data[i].serialNumber]=sku_int;
        }
       
       
        epc_list_str = epc_list_str.substring(0, epc_list_str.length - 2);
        

        get_printed_all_product_item_master(my_ar).then(function(returnData22){

            
            var pm_data = returnData22.results;
            //console.log(pm_data)
            
            get_printed_all(epc_list_str).then(function(returnData){
           
                var now          =  new Date();
                
                var ifexistsEpc  =  returnData.ifexists;
                var zpl_epc_data =  returnData.results;

                //
                // console.log(zpl_epc_data)
                var db_epc       =  '';
                var db_epc_list  =  [];
                var goods_rec    =  [];
                var temp         =  [];
                var epc_details  =  [];
                var epc_sp_call  =  '';
                var epc_update = ''
                var update_data = []; 

                var current_date = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

                   
                   
                    /*---------------------------Insert Query--------------------------------*/
                    var shipment_no   = '';
                    var supplier_name = '';
                    var store_id      = '';
                    var uid           = '';
                    var po_no         = '';
                    var comments      = '';
                    var retail_product_color = '';
                    var retail_product_size  = '';

                    for (var element in pm_data) {
                        
                        mysku = pm_data[element];
                        
                       
                        db_epc = element;
                        epc_update = "'"+element+"'";

                        update_data.push(epc_update);
                        main_result.push(db_epc);


                        try{
                            shipment_no = zpl_epc_data[element].Shipment_no
                        }catch{
                          shipment_no = '';  
                        }

                        try{
                            supplier_name = zpl_epc_data[element].Supplier_ID
                        }catch{
                          supplier_name = '';  
                        }

                        try{
                            store_id = zpl_epc_data[element].storeid
                        }catch{
                            store_id = '';  
                        }


                        try{
                            po_no = zpl_epc_data[element].PO_NO
                        }catch{
                           po_no = '';  
                        }


                        try{
                            comments = zpl_epc_data[element].Comments
                        }catch{
                            comments = '';  
                        }

                        try{
                            retail_product_color = zpl_epc_data[element].Retail_Product_Color
                        }catch{
                            retail_product_color = '';  
                        }

                        try{
                            retail_product_size = zpl_epc_data[element].Retail_Product_Size
                        }catch{
                            retail_product_size = '';  
                        }


                        

                        temp = [

                            current_date,
                            data[0].udfs.Retail_ItemBatchID.value,
                            supplier_name ,
                            shipment_no,
                            store_id,
                            uid,
                            po_no,
                            comments,
                            "0",
                            element,
                            "remarks"
                        ];
                        goods_rec.push(temp);


                        temp2 = [

                            element,
                            mysku,
                            data[0].udfs.Retail_ItemBatchID.value,
                            '',
                            '',
                            retail_product_color,
                            retail_product_size,
                            current_date,
                            store_id,
                            'na',
                            "goods",
                        ];
                        epc_details.push(temp2);


                        epc_sp_call += "CALL add_epc_rec('" 
                                            + data[0].udfs.Retail_ItemBatchID.value + "'," +
                                            " '" + store_id + "','" + 
                                            element + "'," +
                                            "'"+mysku+"','0', " +
                                            "'0','0','0','" +
                                            current_date + "');";
                        
                       
                    }

                    //console.log(epc_sp_call);
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

                        mysqlMain2.query(insertquerydetails, [epc_details], function(err) {
                            if(err){
                                console2.log('Error', err, '389 API service ');
                                console.log(err); 
                            }
                        });
                        mysqlMain2.query(epc_sp_call, function(err) {
                            if(err){
                              console2.log('Error', err, '396 API service ');
                                console.log(err);   
                            }
                        });
                    });

                    //console.log(epc_details);
                    var update_query = "update zpl_printer set goods_in = '1' where epc in("+update_data+");"
                    // console.log(update_query);
                    mysqlMain2.query(update_query, function(err) {
                        if(err){
                          console2.log('Error', err, '389 API update_query ');
                            console.log(err); 
                            return res.status(400).send({
                                error:'1',
                                system_msg:err
                            });  
                        }else{
                            res.status(200).send({
                                total:zpl_epc_data.length,
                                success_list: main_result
                            });
                        }
                    });
                    //console.log(update_query)
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '558-goods_item_store_submit');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '567-goods_item_store_submit');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }  
       
}

router.patch('/GOODSIN', function (req, res) {
    try{

        console2.log_entry("/GOODSIN",req.body);

        var token               = access_token2;
        var payload22           = '';
        var endpoint22          = '';
        var server_protocol     = '';
        var goods_in_item_ar    =  [];
       
        var asn_item_ar      =  [];
      
      
        if (req.headers.apikey == token) {

           
            var data        = req.body;
         
            var tagid       = data.TagID;
           

            if(data.length>0)
            {
                for (i = 0; i < data.length; i++) 
                {   
                    if(data[i].udfs){
                        data[i].udfs
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'udfs Object is missing in payload !'    
                        });

                    }
                    // if(data[i].udfs.sourceModule){
                    //     data[i].udfs.sourceModule
                    // }else{
                        
                    //     return res.status(400).send({
                    //         error:'1',
                    //         message:'sourceModule is missing in payload !'    
                    //     });

                    // }

                    // if(data[i].udfs.sourceModule.value){
                    //     data[i].udfs.sourceModule.value
                    // }else{

                    //     return res.status(400).send({
                    //         error:'1',
                    //         message:'sourceModule value is missing in payload !'    
                    //     });

                    // }

                    if(data[i].udfs.sourceModule.value=="GoodsIn")
                    {
                        goods_in_item_ar.push(data[i]);
                    }


                    // if(data[i].udfs.sourceModule.value=="cycleCount"){
                    //     return res.status(400).send({
                    //         error:'1',
                    //         message: "InValid Api."
                    //     });
                    // }
                    
                }
                //console.log(goods_in_item_ar); 

                if(goods_in_item_ar.length>0)
                {
                    console.log("calling good in job");
                    console2.log_entry("GOODSIN Good item store",goods_in_item_ar);
                    goods_item_store_submit(goods_in_item_ar,res);
                }  
                
            }
            else
            {
                res.status(200).send({
                    total:'Invalid Object List Sent!'   
                });
            }



        } else {

            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });
           
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1748-/api/things');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1755-/api/things');
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
