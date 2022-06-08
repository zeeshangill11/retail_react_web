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
function check_printed(tagid)
{
    try{
        var tagid = tagid;

        return new Promise((resolve, reject) => {
           
           
        
            var exists = '0';
          
            var select_query = "SELECT * FROM zpl_printer a where epc = '"+tagid+"';"
            
            mysql.queryCustom(select_query).then(function(result) {
               
                if (result.results.length !== 0) {
                    exists = '1'
                }

                let sendparam = {
                    ifexists:exists,
                }

                resolve(sendparam);
            }).catch(err => {
                console2.log('Error', JSON.stringify(err), '51 roit core service issue');
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '100-check_printed');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '107-check_printed');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }   

}



router.post('/api/reportExecution/STORES', (req, res, next) => {
    try{

        var select_query = "SELECT * FROM tb_store ;"
     
        var main_result=[];
        mysql.queryCustom(select_query).then(function(result) {

            
            var my_ar = {};
            var myObj = {};
          
            for(k=0; k<result.results.length; k++)
            {

                var myObj={};
                var headers_obj={};

                headers_obj.serialNumber = result.results[k].storename;
                headers_obj.thingTypeId =result.results[k].storeid;
                headers_obj.thingTypeCode ='Store';
                headers_obj.thingTypeName ='Store';
                headers_obj.groupId =result.results[k].storeid;
                headers_obj.name =result.results[k].store_location;
                
                myObj={'thing.headers':headers_obj};
                
                myObj.StoreID =result.results[k].storename;
                myObj.StoreName =result.results[k].store_location;
                myObj.thingTypeId=result.results[k].storeid;

                
                


               
                main_result.push(myObj);

               

                
            }
            res.status(200).send({
                total:result.results.length,
                results: main_result
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '167-api/reportExecution/STORES');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '174-api/reportExecution/STORES');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }       
   
});



function get_store_soh(storename,var_res){
    try{
        return new Promise((resolve, reject) => {
            var now = new Date();
            var CheckDate = dateFormat(now, "yyyy-mm-dd");
            //var CheckDate = '2021-06-03';
            var res = var_res;

            var store = storename;
            
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
                        price:result.results[k].price
                        
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
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '640-get_store_soh');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '647-get_store_soh');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
}






/*-----------------------------COUNT POST--------------------------------------*/

function get_epc_data(var_sku_list,var_storename,var_res)
{
    try{ 
        var sku_list   = var_sku_list;
        var store_name = var_storename;
        var res = var_res;
     

        return new Promise((resolve, reject) => {
           
           
        
            var exists = '0';
          
            var select_query = "SELECT * FROM cyclecount_temp_"+store_name+" "+ 
            " where item_code in("+sku_list+");"
            
            mysql.queryCustom(select_query).then(function(result) {

                var my_ar = {};
                var myObj = {};

                for(k=0; k<result.results.length; k++)
                {

                    myObj = {
                     
                        skucode:result.results[k].item_code ,
                        epc:result.results[k].serialNumber ,
                      
                        
                    };
                    my_ar[result.results[k].item_code]=myObj;
                }

                let sendparam = {
                  
                    results:my_ar
                }

                // console.log(my_ar);

                resolve(sendparam);
            }).catch(err => {
                return res.status(400).send({
                    error:'1',
                    message:"Select query Query error ",
                    system_error:err
                });
                console2.log('Error', JSON.stringify(err), '51 roit core service issue');
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '716-get_epc_data');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '723-get_epc_data');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }   

}
router.post('/api/reportExecution/COUNTEDITEMS', function (req, res) {
    try{
        console2.log_entry("Post COUNTEDITEMS",req.body);

        var now = new Date();
        
        var res = res;
        var token = access_token2;

        if (req.headers.apikey == token) {

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
            var storename = '';
            var storename2 = writeData.StoreID;
            if(storename2){
                storename = writeData.StoreID;
            }else{

                res.status(400).send({
                    error: "1",
                    message: "StoreID is missing !",
                });

            }
            

            var current_date = dateFormat(now, "yyyy-mm-dd");
           
            var select_query = "SELECT sum(counted) as total_count, a.* FROM `stock_count_"+storename+"` a  where stockcountdate='"+current_date+"' and counted>0 group by code ";
            //console.log(select_query)   
            mysql.queryCustom(select_query).then(function(result) {
                
                if (result.status == "1") 
                {

                    var table_data   = result.results;
                    var total_record = 0;
                    if(table_data.length>0)
                    {
                        total_record = table_data[0].total_count;   
                    }
                    //console.log(total_record);
                  
                    var skudata = [];
                   
                    var results = [];
                    var sohdate= {};
                    var toBePadded = '';
                    var sku_upc = '';

                    var isodate = '';
                    var valuedate = '';
                    var tsdateformat = '';
                    var total_num_of_rec=0;

                    if(total_record>0){

                       var sku_list='';
                        for(var i = 0;i<table_data.length;i++){
                            sku_list += "'"+table_data[i].code+"', ";
                        }

                        sku_list = sku_list.substring(0, sku_list.length - 2);
                        //console.log(sku_list);

                        get_epc_data(sku_list,storename,res).then(function(returnData){
                 
                          
                            var epc_data    =   returnData.results;
                            var sku         =   '';
                            var headers_obj =   {};
                            var epc = '';
                            //console.log(table_data.length)

                            for(var i = 0;i<table_data.length;i++){
                                //epc_data[sku].serialNumber 
                                // sku = table_data[i].code;
                                if(table_data[i].code !== "null"
                                    && table_data[i].code !== null){
                                    sku = table_data[i].code;
                                    epc = epc_data[sku].epc;
                                    sku_upc = sku.padStart(16, '0')
                                }

                                // console.log(sku)
                                headers_obj.serialNumber = epc;
                                headers_obj.thingTypeId ='null';

                                headers_obj.thingTypeCode ='null';
                                headers_obj.thingTypeName ='null';

                                headers_obj.groupId ='null';
                                headers_obj.name ='null';

                                isodate =  dateFormat(table_data[i].stockcountdate, "isoDateTime");
                                valuedate = dateFormat(table_data[i].stockcountdate, "mm/dd/yyyy HH:MM:ss");
                                tsdateformat = Date.parse(table_data[i].stockcountdate);

                                // console.log(isodate);

                                sohdate.iso = isodate;
                                sohdate.value = valuedate;
                                sohdate.ts = tsdateformat;
                               
                                // toBePadded = table_data[i].code;

                               
                                //console.log(toBePadded.padStart(16, '0')); 
                                main_result={
                                    'Company':"null",
                                    'Description':'null',
                                    'thingTypeId':'null',
                                    'thingTypeId': 'null',
                                    'Size':table_data[i].size,
                                    'Color': table_data[i].color,
                                    'UPC':sku_upc,
                                    'ImageURL': 'null',
                                    'thing.headers':headers_obj,
                                    'SOHSKU':table_data[i].code,
                                    'Cost':'null',
                                    'Brand':unescape(table_data[i].brand_name),
                                    'SOHDate':sohdate,
                                    "StoreID":table_data[i].storeid,
                                    "SOHQTY": table_data[i].initial,
                                    "Currency": null,
                                    "Style":unescape(table_data[i].style),
                                    "DepartmentID":table_data[i].departmentid,
                                    "id":"null",
                                    "SKU": sku_upc

                                };
                                total_num_of_rec = total_num_of_rec+parseInt(table_data[i].total_count);

                                results.push(main_result);
                                //skudata.push(row_data);

                            } 

                            res.status(200).send({
                                total:total_num_of_rec,
                                results    
                            });
                        }); 
                    }else{
                        res.status(200).send({
                            total:total_record,
                            results    
                        });
                    }
                } else {
                    console2.log('Error', JSON.stringify(result.error), '965-SOHPERSTORE SOHPERSTORE');
                    res.end(JSON.stringify(result.error));
                }
            })
            .catch(function(error) {
                console2.log('Error',error, '970- SOHPERSTORE');
                return res.status(400).send({
                    error:'1',
                    message:"Select query Query error ",
                    system_error:error
                });
               
                //res.end(error);
            });

            //res.end('p')
        } else {
            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });       
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '924-/api/reportExecution/COUNTEDITEMS');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '931-/api/reportExecution/COUNTEDITEMS');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
});


router.post('/api/reportExecution/SOHPERSTORE', function (req, res) {
    try{
        console2.log_entry("Post SOHPERSTORE",req.body);

        var now = new Date();
        
        var res = res;
        var token = access_token2;

        if (req.headers.apikey == token) {

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
            var storename = '';
            var storename2 = writeData.StoreID;
            if(storename2){
                storename = writeData.StoreID;
            }else{

                res.status(400).send({
                    error: "1",
                    message: "StoreID is missing !",
                });

            }
            
           
            var current_date = dateFormat(now, "yyyy-mm-dd");
           
            var select_query = "SELECT * FROM `stock_count_"+storename+"` a  where stockcountdate='"+current_date+"'";
            // console.log(select_query)   
            mysql.queryCustom(select_query).then(function(result) {
                
                if (result.status == "1") 
                {

                    var table_data   = result.results;
                    
                    //console.log(total_record);
                  
                    var skudata = [];
                   
                    var results = [];
                    var sohdate= {};
                    var toBePadded = '';
                    var sku_upc = '';

                    var isodate = '';
                    var valuedate = '';
                    var tsdateformat = '';
                    var total_num_of_rec= parseInt(table_data.length);

                    if(total_num_of_rec>0){
                 
                        var sku         =   '';
                        var headers_obj =   {};
                    

                        for(var i = 0;i<table_data.length;i++){
                            //epc_data[sku].serialNumber 
                            sku=table_data[i].code;
                            headers_obj.serialNumber = 'null';
                            headers_obj.thingTypeId ='null';

                            headers_obj.thingTypeCode ='null';
                            headers_obj.thingTypeName ='null';

                            headers_obj.groupId ='null';
                            headers_obj.name ='null';

                            isodate =  dateFormat(table_data[i].stockcountdate, "isoDateTime");
                            valuedate = dateFormat(table_data[i].stockcountdate, "mm/dd/yyyy HH:MM:ss");
                            tsdateformat = Date.parse(table_data[i].stockcountdate);

                            // console.log(isodate);

                            sohdate.iso = isodate;
                            sohdate.value = valuedate;
                            sohdate.ts = tsdateformat;
                           
                            toBePadded = table_data[i].code;
                            sku_upc = toBePadded.padStart(16, '0')
                            //console.log(toBePadded.padStart(16, '0')); 
                            main_result={
                                'Company':"null",
                                'Description':'null',
                                'thingTypeId':'null',
                                'thingTypeId': 'null',
                                'Size':table_data[i].size,
                                'Color': table_data[i].color,
                                'UPC':sku_upc,
                                'ImageURL': 'null',
                                'thing.headers':headers_obj,
                                'SOHSKU':table_data[i].code,
                                'Cost':'null',
                                'Brand':unescape(table_data[i].brand_name),
                                'SOHDate':sohdate,
                                "StoreID":table_data[i].storeid,
                                "SOHQTY": table_data[i].initial,
                                "Currency": null,
                                "Style":unescape(table_data[i].style),
                                "DepartmentID":table_data[i].departmentid,
                                "id":"null",
                                "SKU": sku_upc

                            };
                            //total_num_of_rec = total_num_of_rec+parseInt(table_data[i].total_count);

                            results.push(main_result);
                            //skudata.push(row_data);

                        } 

                        res.status(200).send({
                            total:total_num_of_rec,
                            results    
                        });
                   
                    }else{
                        res.status(200).send({
                            total:total_num_of_rec,
                            results    
                        });
                    }
                } else {
                    console2.log('Error', JSON.stringify(result.error), '965-SOHPERSTORE SOHPERSTORE');
                    res.end(JSON.stringify(result.error));
                }
            })
            .catch(function(error) {
                console2.log('Error',error, '970- SOHPERSTORE');
                return res.status(400).send({
                    error:'1',
                    message:"Select query Query error ",
                    system_error:error
                });
               
                //res.end(error);
            });

            //res.end('p')
        } else {
            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });       
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1107-/api/reportExecution/SOHPERSTORE');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1114-/api/reportExecution/SOHPERSTORE');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }         
});

function Check_StockExists(storename,var_res){
    try{
        return new Promise((resolve, reject) => {
            var now = new Date();
            var CheckDate = dateFormat(now, "yyyy-mm-dd");
            var store = storename;
            var exists = '0';
            var res = var_res;
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
            }).catch(err => {
                return res.status(400).send({
                    error:'1',
                    message:"Check Stock Summary Query error ",
                    system_error:err
                });
                console2.log('Error', JSON.stringify(err), '461-Check_StockExists API StockSummaryDump api error');
            });
        });
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1156-Check_StockExists');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1163-Check_StockExists');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
}




router.post('/soh_dump', (req, res, next) => {
    try {
       var now = new Date();
       var res = res;
       var data = req.body;
        
        var  CheckDate = dateFormat(now, "yyyy-mm-dd");

        data_stringify = JSON.stringify(data)

        total_results = JSON.parse(data_stringify);

        var object_validation = total_results.results;

        if(object_validation){
            object_validation
        }else{
            return res.status(400).send({
                error:'1',
                message:"result object is missing !"
            });
        }

        var Company = '';
        for (var k = 0; k < object_validation.length; k++) {

            // Company = object_validation[k].Company;
            // console.log(Company);
            // if(object_validation[k].Company){
            //     object_validation[k].Company
            // }else{
            //     return res.status(400).send({
            //         error:'1',
            //         message:"Company filed is missing in payload !"
            //     });
            // }



            if(object_validation[k].Description){
                object_validation[k].Description
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Description filed is missing in payload !"
                });
            }



            if(object_validation[k].thingTypeId){
                object_validation[k].thingTypeId
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thingTypeId filed is missing in payload !"
                });
            }


            if(object_validation[k].Size){
                object_validation[k].Size
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Size filed is missing in payload !"
                });
            }

            if(object_validation[k].Color){
                object_validation[k].Color
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Color filed is missing in payload !"
                });
            }

            if(object_validation[k].UPC){
                object_validation[k].UPC
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"UPC filed is missing in payload !"
                });
            }

          
            // if(object_validation[k].ImageURL && object_validation[k].ImageURL == null){
            //     object_validation[k].ImageURL
            // }else{
            //     return res.status(400).send({
            //         error:'1',
            //         message:"ImageURL filed is missing in payload !"
            //     });
            // }


            if(object_validation[k]['thing.headers']){
                object_validation[k]['thing.headers']
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object is missing in payload !"
                });
            }


            if(object_validation[k]['thing.headers'].serialNumber){
                object_validation[k]['thing.headers'].serialNumber
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object serialNumber field is missing in payload !"
                });
            }


            if(object_validation[k]['thing.headers'].thingTypeId){
                object_validation[k]['thing.headers'].thingTypeId
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object thingTypeId field is missing in payload !"
                });
            }


            if(object_validation[k]['thing.headers'].thingTypeCode){
                object_validation[k]['thing.headers'].thingTypeCode
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object thingTypeCode field is missing in payload !"
                });
            }



            if(object_validation[k]['thing.headers'].thingTypeName){
                object_validation[k]['thing.headers'].thingTypeName
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object thingTypeName field is missing in payload !"
                });
            }


            if(object_validation[k]['thing.headers'].groupId){
                object_validation[k]['thing.headers'].groupId
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object groupId field is missing in payload !"
                });
            }


            if(object_validation[k]['thing.headers'].name){
                object_validation[k]['thing.headers'].name
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"thing.headers object name field is missing in payload !"
                });
            }


            if(object_validation[k].SOHSKU){
                object_validation[k].SOHSKU
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SOHSKU field is missing in payload !"
                });
            }

          
            // if(object_validation[k].Cost && object_validation[k].Cost == null){
            //     object_validation[k].Cost
            // }else{
            //     return res.status(400).send({
            //         error:'1',
            //         message:"Cost field is missing in payload !"
            //     });
            // }


            if(object_validation[k].Brand){
                object_validation[k].Brand
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Brand field is missing in payload !"
                });
            }


            if(object_validation[k].SOHDate){
                object_validation[k].SOHDate
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SOHDate object is missing in payload !"
                });
            }



            if(object_validation[k].SOHDate.iso){
                object_validation[k].SOHDate.iso
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SOHDate object iso field is missing in payload !"
                });
            }


            if(object_validation[k].SOHDate.value){
                object_validation[k].SOHDate.value
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SOHDate object value field is missing in payload !"
                });
            }


            if(object_validation[k].SOHDate.ts){
                object_validation[k].SOHDate.ts
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SOHDate object ts field is missing in payload !"
                });
            }


            if(object_validation[k].StoreID){
                object_validation[k].StoreID
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"StoreID field is missing in payload !"
                });
            }


            if(object_validation[k].SOHQTY){
                object_validation[k].SOHQTY
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SOHQTY field is missing in payload !"
                });
            }


            // if(object_validation[k].Currency){
            //     object_validation[k].Currency
            // }else{
            //     return res.status(400).send({
            //         error:'1',
            //         message:"Currency field is missing in payload !"
            //     });
            // }


            if(object_validation[k].Style){
                object_validation[k].Style
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Style field is missing in payload !"
                });
            }

            if(object_validation[k].DepartmentID){
                object_validation[k].DepartmentID
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"DepartmentID field is missing in payload !"
                });
            }

            if(object_validation[k].id){
                object_validation[k].id
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"id field is missing in payload !"
                });
            }


            if(object_validation[k].SKU){
                object_validation[k].SKU
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"SKU field is missing in payload !"
                });
            }


            if(object_validation[k].Price){
                object_validation[k].Price
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Price field is missing in payload !"
                });
            }


            if(object_validation[k].Season){
                object_validation[k].Season
            }else{
                return res.status(400).send({
                    error:'1',
                    message:"Season field is missing in payload !"
                });
            }
        }



        var storename = total_results.results[0].StoreID;

        
        var epc_detail_delete = "DELETE FROM epc_detail  WHERE `date` = '" + CheckDate + "'  ";
        //mysql.queryCustom(epc_detail_delete);
        var stockSummary_dump = [];
        var temp2 = [];
        
        Check_StockExists(storename,res).then(function(returnData){
                        
          
            var ifexistsStock = returnData.ifexists;
            var StoreName2 = returnData.StoreName;
            var  CheckDate2 = dateFormat(now, "yyyy-mm-dd");
         

            var delete_query2 = "DELETE FROM epc_temp  WHERE  check_date < '" + CheckDate2 + "'  ";
            mysql.queryCustom(delete_query2).then(function(result){


                if(ifexistsStock == '0' ){
               

                    var insert_query = "INSERT INTO stock_count_" + StoreName2 + " (storeid,departmentid,code," +
                    "initial,missing,stockcountdate,brand_name,color,`size`,`style`,`price`,`season`) VALUES ?"

                    var insert_data = total_results.results;

                    var total_items_stock = total_results.results.length;
                    var Company = '';
                    
                        for (var z = 0; z < insert_data.length; z++) {

                            CheckDate = dateFormat(now, "yyyy-mm-dd");
                            
                            
                            temp2 = [

                                insert_data[z].StoreID,
                                insert_data[z].DepartmentID,
                                insert_data[z].SOHSKU,
                                insert_data[z].SOHQTY,
                                insert_data[z].SOHQTY,
                                CheckDate,
                                escape(insert_data[z].Brand),
                                escape(insert_data[z].Color),
                                escape(insert_data[z].Size),
                                escape(insert_data[z].Style),
                                insert_data[z].Price,
                                insert_data[z].Season

                            ];
                            stockSummary_dump.push(temp2);
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
                            " FROM stock_count SC " +
                            " WHERE 1 AND SC.stockcountdate='" + dateFormat(now, "yyyy-mm-dd") + "' " +
                            " AND sc.code not in (Select item_code from product_item_master)";
                        mysql.queryCustom(add_in_item_master).then(function(result) {

                        }).catch(err => {  
                            return res.status(400).send({
                                error:'1',
                                message:"Insert asn master query error ",
                                system_msg:err
                            });
                            console2.log('Error', JSON.stringify(err), '1732-add_in_item_master API delete_query2 api error');
                            
                        });

                        console2.log('Info',  'Out Side The loop When We ready to insert in db'+StoreName2);


                        mysqlMain2.query(insert_query, [stockSummary_dump], function(err) {
                            if (err) {
                                return res.status(400).send({
                                    error:'1',
                                    message:"Inster stock summary dump query error ",
                                    system_msg:err
                                });
                                console2.log('Error', JSON.stringify(err), '153-StockSummary Dump InsertStoreViseQuery');
                            }else{

                                if(res !== 'n/a'){
                                    res.status(200).send({
                                        error: "0",
                                        message: "Successfully Inserted !.",
                                    });
                                }

                            }

                        });
                }else{
                    return res.status(400).send({
                        error:'1',
                        message:"Soh already dumped !"
                    });
                }


            }).catch(err => {
                return res.status(400).send({
                    error:'1',
                    message:"Delete epc query error ",
                    system_msg:err
                });
                console2.log('Error', JSON.stringify(err), '1439-delete_query2 API delete_query2 api error');
            });

            
        }); 
         
        
    } catch (e) {
        console2.log('Error', 'Catch Exception'+JSON.stringify(e), '1634-StockSummaryDump CronJob');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Exception', '1641-StockSummaryDump CronJob');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }
}); 


router.patch('/SUPPLYCHAIN', function (req, res) {
    try{
 
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
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '1823-SUPPLYCHAIN');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '1830-SUPPLYCHAIN');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      

 });

function asn_submit(var_data,var_res){
//router.patch('/api/things/ASNDATA', function (req, res) {
    try{
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


                    if(results[i].udfs.remarks){
                        results[i].udfs.remarks
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object remarks is missing in payload !'    
                        });

                    }

                    if(results[i].udfs.remarks.value){
                        results[i].udfs.remarks.value
                    }else{

                        return res.status(400).send({
                            error:'1',
                            message:'in udfs object remarks value is missing in payload !'    
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
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '2358-asnsubmit');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '2365-asnsubmit');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }   
}


router.post('/api/reportExecution/timeSeriesReportTable/SUPPLYCHAIN', function (req, res) {
    try{
        console2.log_entry("POST reportExecution/timeSeriesReportTable/SUPPLYCHAIN",req.body);
        try {

            var data = req.body;
            data_stringify = JSON.stringify(data);
            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }

        var token = access_token2;

        if (req.headers.apikey == token){


            var OriginStoreID = writeData.OriginStoreID;
            var ASN = writeData.ASN;
            var Process = writeData.Process;
            var ProcessStatus = writeData.ProcessStatus;
            var cond = '';



            if (OriginStoreID !== "" && OriginStoreID !== 0 &&
                OriginStoreID !== "0" && OriginStoreID !== undefined) {
                cond += ' AND store_id="' + OriginStoreID + '"'
            }

            if (ASN !== "" && ASN !== 0 && ASN != "0" &&
                ASN !== undefined) {
                cond += ' AND asn="' + ASN + '"'
            }

            if (Process !== "" && Process !== 0 && Process !== "0" && Process !== undefined) {

                cond += ' AND process="' + Process + '" '
            }

            if (ProcessStatus !== "" && ProcessStatus !== 0 && Process !== "0" 
                && ProcessStatus !== undefined) {

                cond += ' AND process_status="' + ProcessStatus + '" '
            }


            var select_query = "select * from asn_items where 1 "+cond;
            //console.log(select_query)
            mysql.queryCustom(select_query).then(function(result) {

                if (result.status == "1") {

                   
                    var totalrecord = result.results.length;
                    var prepare_data = result.results;
                    
                    var results=[];
                    var headers_obj={};
                    var vigix_type_record = {};
                    var main_result=[];
                    var sohdate= {};
                    var time2 = {};
                    var fieldnotchange = {};
                    var fieldsNotBlinked = {};
                  
                    for(var i = 0;i<prepare_data.length;i++){

                        headers_obj.serialNumber = prepare_data[i].tag_id;
                        headers_obj.thingTypeId ='null';
                        headers_obj.thingTypeCode ='null';
                        headers_obj.thingTypeName ='null';
                        headers_obj.groupId = 'null';
                        headers_obj.name = prepare_data[i].tag_id;
                     

                        vigix_type_record.timeSeries = 'null';
                        vigix_type_record.lastValue = 'null';


                        isodate =  dateFormat(prepare_data[i].date, "isoDateTime");
                        valuedate = dateFormat(prepare_data[i].date, "mm/dd/yyyy HH:MM:ss");
                        tsdateformat = Date.parse(prepare_data[i].date);
                                
                        sohdate.iso = isodate;
                        sohdate.value = valuedate;
                        sohdate.ts = tsdateformat;


                         
                        fieldnotchange.Time = "Time";
                        fieldnotchange.DestinationStoreID = "DestinationStoreID";
                        fieldnotchange.TagID = "TagID";
                        fieldnotchange.SKU_original = "SKU_original";
                        fieldnotchange.SKU = "SKU";
                        fieldnotchange.Description = "Description";
                        fieldnotchange.DepartmentID = "DepartmentID";
                        fieldnotchange.Brand = "Brand";
                        fieldnotchange.id = "id";

                        
                        fieldsNotBlinked.Time = "Time";
                        fieldsNotBlinked.DestinationStoreID = "DestinationStoreID";
                        fieldsNotBlinked.TagID = "TagID";
                        fieldsNotBlinked.SKU_original = "SKU_original";
                        fieldsNotBlinked.SKU = "SKU";
                        fieldsNotBlinked.Description = "Description";
                        fieldsNotBlinked.DepartmentID = "DepartmentID";
                        fieldsNotBlinked.Brand = "Brand";
                        fieldsNotBlinked.id = "id";
                               


                            main_result={
                                "SKU_original":prepare_data[i].sku,
                                "Description": "null",
                                "ProcessStatus":prepare_data[i].process_status,
                                "Time":sohdate,
                                "Process":prepare_data[i].process,
                                "thing.headers":headers_obj,
                                "DestinationStoreID":prepare_data[i].destination_location,
                                "vizix.typeRecord":vigix_type_record,
                                "ASNtimestamp":sohdate,
                                "Brand":prepare_data[i].brand,
                                "OriginStoreID":prepare_data[i].store_id,
                                "TagID":prepare_data[i].tag_id,
                                "vizix.fieldsNotChanged":fieldnotchange,
                                "DepartmentID":prepare_data[i].department,
                                "id":"null",
                                "ASN":prepare_data[i].asn,
                                "SKU":prepare_data[i].sku,
                                "remarks":"null",
                                "vizix.fieldsNotBlinked":fieldsNotBlinked,
                            }

                        //console.log(main_result)
                        results.push(main_result);
                    }

                    res.status(200).send({
                        total:totalrecord,
                        results    
                    });

                }else{

                }
            }).catch(err =>{
                return res.status(400).send({
                    message: "Select query error",
                    system_msg: err
                });
                console2.log('Error', JSON.stringify(err), '1994 select_query');
            });
        }else{
            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '2539-/api/reportExecution/timeSeriesReportTable/SUPPLYCHAIN');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '2546-/api/reportExecution/timeSeriesReportTable/SUPPLYCHAIN');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }        
});

router.post('/api/reportExecution/SUPPLYCHAINVERIFY', function (req, res) {
    try{
        try {

            var data = req.body;
            data_stringify = JSON.stringify(data);
            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }

        var token = access_token2;

        if (req.headers.apikey == token){


            var OriginStoreID = writeData.OriginStoreID;
            var ASN = writeData.ASN;
            var Process = writeData.Process;
            var ProcessStatus = writeData.ProcessStatus;
            var cond = '';



            if (OriginStoreID !== "" && OriginStoreID !== 0 &&
                OriginStoreID !== "0" && OriginStoreID !== undefined) {
                cond += ' AND store_id="' + OriginStoreID + '"'
            }

            if (ASN !== "" && ASN !== 0 && ASN != "0" &&
                ASN !== undefined) {
                cond += ' AND asn="' + ASN + '"'
            }

            if (Process !== "" && Process !== 0 && Process !== "0" && Process !== undefined) {

                cond += ' AND process="' + Process + '" '
            }

            if (ProcessStatus !== "" && ProcessStatus !== 0 && Process !== "0" 
                && ProcessStatus !== undefined) {

                cond += ' AND process_status="' + ProcessStatus + '" '
            }


            var select_query = "select * from asn_items where 1 "+cond;
            //console.log(select_query)
            mysql.queryCustom(select_query).then(function(result) {

                if (result.status == "1") {

                   
                    var totalrecord = result.results.length;
                    var prepare_data = result.results;
                    
                    var results=[];
                    var headers_obj={};
                    var main_result=[];
                    var sohdate= {};

                    
                    for(var i = 0;i<prepare_data.length;i++){

                       
                        headers_obj.serialNumber = prepare_data[i].tag_id;
                        headers_obj.thingTypeId ='null';

                        headers_obj.thingTypeCode ='null';
                        headers_obj.thingTypeName ='null';

                        headers_obj.groupId = 'null';
                        headers_obj.name = prepare_data[i].tag_id;

                        isodate =  dateFormat(prepare_data[i].date, "isoDateTime");
                        valuedate = dateFormat(prepare_data[i].date, "mm/dd/yyyy HH:MM:ss");
                        tsdateformat = Date.parse(prepare_data[i].date);


                        sohdate.iso = isodate;
                        sohdate.value = valuedate;
                        sohdate.ts = tsdateformat;
                           
                        main_result={
                            'SKU_original':prepare_data[i].sku,
                            'Description':'null',
                            'thingTypeId':'null',
                            'ProcessStatus':prepare_data[i].process_status,
                            'Process':prepare_data[i].process,
                            'thing.headers':headers_obj,
                            'DestinationStoreID':prepare_data[i].process,
                            'ASNtimestamp':sohdate,
                            "Brand":prepare_data[i].brand,
                            "OriginStoreID":prepare_data[i].destination_location,
                            "TagID":prepare_data[i].tag_id,
                            "DepartmentID":prepare_data[i].department,
                            "id":'null',
                            "ASN":prepare_data[i].asn,
                            "SKU": prepare_data[i].sku,
                            "remarks": "null"
                        };
                        //console.log(main_result)
                        results.push(main_result);
                    }

                    res.status(200).send({
                        total:totalrecord,
                        results    
                    });

                }else{

                }
            }).catch(err =>{
                return res.status(400).send({
                    message: "Select query error",
                    system_msg: err
                });
                console2.log('Error', JSON.stringify(err), '1994 select_query');
            });
        }else{
            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '2685-/api/reportExecution/SUPPLYCHAINVERIFY');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '2692-/api/reportExecution/SUPPLYCHAINVERIFY');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
});

router.post('/reportExecution/STOREINVENTORY', function (req, res) {

    // try{

        var token               = access_token2;
        var payload22           = '';
        var endpoint22          = '';
        var server_protocol     = '';
        var goods_in_item_ar    =  [];

        var asn_item_ar      =  [];
      
      
        if (req.headers.apikey == token) {

            
            try {

                var data = req.body;
                data_stringify = JSON.stringify(data);
                writeData = JSON.parse(data_stringify);

            } catch (e) {
                return  res.status(400).send({
                    error: "1",
                    message: "JSON not valid",
                });
            }



            // if(data.StoreID){
            //     data.StoreID
            // }else{

            //     return res.status(400).send({
            //         error:'1',
            //         message:'StoreID is missing'    
            //     });

            // }

            
            if(typeof(data.TagID) != "undefined"){
                console.log('look up epc run');
                console2.log_entry("Look up epc run",data);
                look_up_epc(data,res);
            }
            if(typeof(data.SKU_original) != "undefined"){
                console.log('Look up sku run');
                console2.log_entry("Look up sku run",data);
                look_up_sku(data,res);
            }

            if(typeof(data.TagID) == "undefined" 
                && typeof(data.SKU_original) == "undefined"){

                return res.status(400).send({
                    error:'1',
                    message:'Invalid API'    
                });
            }
            

        } else {

            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });
           
        }
    // } catch (e) {
    //     console2.log('Error', 'Catch Expection'+e, '2774-/api/reportExecution/STOREINVENTORY');
    //     if (e instanceof TypeError) {
    //         res.status(500).send({
    //             error: '1',
    //             message: 'SomeThing Wrong !'
    //         });
    //     } else {
    //         console2.log('Error', 'Catch Expection', '2781-/api/reportExecution/STOREINVENTORY');
    //         res.status(500).send({
    //             error: '1',
    //             message: 'SomeThing Wrong !'
    //         });
    //     }
    // }      
});

function look_up_epc(var_data,var_res){
    try{
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

        //if (req.headers.apikey == token){
            // console.log('ss');

            var StoreID = writeData.StoreID;
            var TagID = writeData.TagID;
            var SKU_original = writeData.SKU_original;
           
            var cond = '';
            var select_query = '';


            if (StoreID !== "" && StoreID !== 0 &&
                StoreID !== "0" && StoreID !== undefined) {
                cond += ' AND store_id="' + StoreID + '"'
            }

            if (TagID !== "" && TagID !== 0 && TagID != "0" &&
                TagID !== undefined) {
                cond += ' AND epc="' + TagID + '"'
            }

           
            select_query = "select * from epc where 1 "+cond;
            //console.log(select_query)
            
            mysql.queryCustom(select_query).then(function(result) {

                if (result.status == "1") {

                   
                    var totalrecord = result.results.length;
                    var prepare_data = result.results;
                    
                    var results=[];
                    var headers_obj={};
                    var main_result=[];
                    var sohdate= {};

                    
                    for(var i = 0;i<prepare_data.length;i++){

                       
                        headers_obj.serialNumber = prepare_data[i].epc;
                        headers_obj.thingTypeId ='null';

                        headers_obj.thingTypeCode ='null';
                        headers_obj.thingTypeName ='null';

                        headers_obj.groupId = 'null';
                        headers_obj.name = prepare_data[i].epc;

                        
                           
                        main_result={
                            'SKU_original':prepare_data[i].item_code,
                            'Company':'null',
                            'Description':'null',
                            'thingTypeId':'null',
                            'Size':prepare_data[i].size,
                            'Color':prepare_data[i].color,
                            'ImageURL':'null',
                            'thing.headers':headers_obj,
                            'Retail_Disposition':'null',
                            'Brand':unescape(prepare_data[i].brand),
                            "zone":prepare_data[i].zone,
                            "Style":prepare_data[i].style,
                            "ViZix_Rule":'null',
                            "DepartmentID":prepare_data[i].department,
                            "id":'null',
                            "SKU": prepare_data[i].item_code,
                            
                        };
                        //console.log(main_result)
                        results.push(main_result);
                    }

                    res.status(200).send({
                        total:totalrecord,
                        results    
                    });

                }else{

                }
            }).catch(err =>{
                return res.status(400).send({
                    message: "Select query error",
                    system_msg: err
                });
                console2.log('Error', JSON.stringify(err), '1994 select_query');
            });
        // }else{
        //     res.status(400).send({
        //         error: "Not Authenticated, Access Denied"
        //     });
        // }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '2905-look_up_epc');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '2912-look_up_epc');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
}


function look_up_sku(var_data,var_res){
    try{
        try {


            var data = var_data;
            var res = var_res;
            data_stringify = JSON.stringify(data);
            writeData = JSON.parse(data_stringify);

        } catch (e) {
           return res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }

        var token = access_token2;
       
        // if (req.headers.apikey == token){
            // console.log('ss');

            var StoreID = writeData.StoreID;
            var TagID = writeData.TagID;
            var SKU_original = writeData.SKU_original;
           
            var cond = '';
            var select_query = '';


            if (StoreID !== "" && StoreID !== 0 &&
                StoreID !== "0" && StoreID !== undefined) {
                cond += ' AND storeid="' + StoreID + '"'
            }

           

            if (SKU_original !== "" && SKU_original !== 0 && SKU_original !== "0" && SKU_original !== undefined) {

                cond += ' AND item_code="' + SKU_original + '" ';

                
            }


            select_query = "select * from product_item_master where 1 "+cond;
           
            
            mysql.queryCustom(select_query).then(function(result) {

                if (result.status == "1") {

                   
                    var totalrecord = result.results.length;
                    var prepare_data = result.results;
                    
                    var results=[];
                    var headers_obj={};
                    var main_result=[];
                    var sohdate= {};

                    
                    for(var i = 0;i<prepare_data.length;i++){

                       
                        headers_obj.serialNumber = prepare_data[i].epc;
                        headers_obj.thingTypeId ='null';

                        headers_obj.thingTypeCode ='null';
                        headers_obj.thingTypeName ='null';

                        headers_obj.groupId = 'null';
                        headers_obj.name = prepare_data[i].epc;

                        
                           
                        main_result={
                            'SKU_original':prepare_data[i].skucode,
                            'Company':prepare_data[i].company,
                            'Description':prepare_data[i].english_desc,
                            'thingTypeId':'null',
                            'Size':prepare_data[i].size,
                            'Color':prepare_data[i].color,
                            'ImageURL':'null',
                            'thing.headers':headers_obj,
                            'source':'',
                            'Retail_Bizlocation':'null',
                            'Retail_Disposition':'',
                            'Brand':prepare_data[i].brand,
                            'EAN':prepare_data[i].ean_no,
                            "zone":prepare_data[i].zone,
                            "Price":prepare_data[i].cost,
                            "TagID":prepare_data[i].epc,
                            "Style":prepare_data[i].style,
                            "ViZix_Rule":'null',
                            "DepartmentID":prepare_data[i].departmentid,
                            "id":'null',
                            "SKU": prepare_data[i].skucode,
                            "Season": prepare_data[i].season,
                        };
                        //console.log(main_result)
                        results.push(main_result);
                    }

                    res.status(200).send({
                        total:totalrecord,
                        results    
                    });

                }else{

                }
            }).catch(err =>{
                return res.status(400).send({
                    message: "Select query error",
                    system_msg: err
                });
                console2.log('Error', JSON.stringify(err), '1994 select_query');
            });
        // }else{
        //     res.status(400).send({
        //         error: "Not Authenticated, Access Denied"
        //     });
        // }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '3047-look_up_sku');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '3054-look_up_sku');
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        }
    }      
}

router.post('/api/reportExecution/tableSummary/FILTERSPERSTORE', function (req, res) {
    try{
        console2.log_entry("POST api/reportExecution/tableSummary/FILTERSPERSTORE",req.body);
        try {

            var data = req.body;
            data_stringify = JSON.stringify(data);
            writeData = JSON.parse(data_stringify);

        } catch (e) {
            res.status(400).send({
                error: "1",
                message: "JSON not valid",
            });
        }

        var token = access_token2;

        if (req.headers.apikey == token){

          

            var StoreID = writeData.StoreID;
            var cond = '';



            if (StoreID !== "" && StoreID !== 0 &&
                StoreID !== "0" && StoreID !== undefined) {
                cond += ' AND store_id="' + StoreID + '"'
            }

            

            var select_query = "select * from stock_count_"+StoreID+" where 1 ";
            //console.log(select_query)
            mysql.queryCustom(select_query).then(function(result) {

                if (result.status == "1") {

                   
                    var totalrecord = result.results.length;
                    var prepare_data = result.results;
                    
                    
                    var result_data = [];
                    var headersY_data = [];
                    var value2 = {}; 
                   
                    //var re
                  
                    for(var i = 0;i<prepare_data.length;i++){
                        //console.log(prepare_data[i].departmentid);

                        // results={'thing.headers':headers_obj};
                        // results.SKU_original ='123123';
                        // main_result.push(results);
                        
                        
                        var result = {
                           "color":[],
                           "value":[]
                        }

                        result_data.push(result);

                        var headersY = {
                            "isTotal":"false",
                            "value":[
                                unescape(prepare_data[i].departmentid),
                                unescape(prepare_data[i].brand_name),
                                unescape(prepare_data[i].color),
                                unescape(prepare_data[i].size),
                                unescape(prepare_data[i].style)
                            ]
                        };

                        headersY_data.push(headersY)
                    }

                   
                    res.status(200).send(`
                        {
                           "result":`+JSON.stringify(result_data)+`,
                            "total":`+totalrecord+`,"oldImplementation":"false",
                            "headersX": [
                                {
                                    "identifier": "RG-24",
                                    "styleColumn": "",
                                    "typeHeader": "grouper",
                                    "isTotal": false,
                                    "fixedColumn": true,
                                    "dataType": 1,
                                    "label": "DepartmentID",
                                    "sort": "ASC"
                                },
                                {
                                    "identifier": "RG-23",
                                    "styleColumn": "",
                                    "typeHeader": "grouper",
                                    "isTotal": false,
                                    "fixedColumn": true,
                                    "dataType": 1,
                                    "label": "Brand",
                                    "sort": "ASC"
                                },
                                {
                                    "identifier": "RG-25",
                                    "styleColumn": "",
                                    "typeHeader": "grouper",
                                    "isTotal": false,
                                    "fixedColumn": true,
                                    "dataType": 1,
                                    "label": "Color",
                                    "sort": "ASC"
                                },
                                {
                                    "identifier": "RG-26",
                                    "styleColumn": "",
                                    "typeHeader": "grouper",
                                    "isTotal": false,
                                    "fixedColumn": true,
                                    "dataType": 1,
                                    "label": "Size",
                                    "sort": "ASC"
                                },
                                {
                                    "identifier": "RG-27",
                                    "styleColumn": "",
                                    "typeHeader": "grouper",
                                    "isTotal": false,
                                    "fixedColumn": true,
                                    "dataType": 1,
                                    "label": "Style",
                                    "sort": "ASC"
                                }
                            ],
                            "headersY":`+JSON.stringify(headersY_data)+`
                        }
                        `
                    );

                  

                }else{

                }
            }).catch(err =>{
                return res.status(400).send({
                    message: "Select query error",
                    system_msg: err
                });
                console2.log('Error', JSON.stringify(err), '1994 select_query');
            });
        }else{
            res.status(400).send({
                error: "Not Authenticated, Access Denied"
            });
        }
    } catch (e) {
        console2.log('Error', 'Catch Expection'+JSON.stringify(e), '3223-/api/reportExecution/tableSummary/FILTERSPERSTORE');
        if (e instanceof TypeError) {
            res.status(500).send({
                error: '1',
                message: 'SomeThing Wrong !'
            });
        } else {
            console2.log('Error', 'Catch Expection', '3230-/api/reportExecution/tableSummary/FILTERSPERSTORE');
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
