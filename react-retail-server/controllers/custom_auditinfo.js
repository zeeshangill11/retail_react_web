const mysql = require("./mysqlCluster.js");
var dateFormat = require("dateformat");
var now = new Date();

function send(audit_text,audit_json,log_type,deviceid,storeid,user_id,retail_cycleCountID) {
    var now = new Date();
    var error = 0;

    var audit_text_c = audit_text;
    var audit_json_c = audit_json;
    var log_type_c = log_type;



    var deviceid_c = deviceid;
    var storeid_c = storeid;
    var user_id_c = user_id;

    var retail_cycleCountID_c = retail_cycleCountID;

    
   

    var db_audit_text = '';
    var db_audit_json = '';
    var db_log_type = '';

    var db_deviceid = '';
    var db_storeid = '';
    var db_user_id = '';
    var db_retail_cycleCountID = '';
    
    var dateTime  = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
        
    

    if(audit_text_c =='' && typeof (audit_text_c) == undefined){

        error = 1;

    }else{
        db_audit_text = audit_text_c;
        //console.log("db_audit_text"+db_audit_text);
    }
    if(audit_json_c =='' && typeof (audit_json_c) == undefined){

        error = 1;
    }else{

        db_audit_json = audit_json_c;
        //console.log("db_audit_json"+db_audit_json);
    }

    if(log_type_c =='' && typeof (log_type_c) == undefined){
        error = 1;

    }else{

        db_log_type = log_type_c;
        //console.log("db_log_type"+db_log_type);
    }

    if(deviceid_c =='' && typeof (deviceid_c) == undefined){
        
        error = 1;

    }else{

        db_deviceid = deviceid_c;
        //console.log("db_deviceid"+db_deviceid);
    }

    if(storeid_c =='' && typeof (storeid_c) == undefined){

        error = 1; 
        
    }else{

        db_storeid = storeid_c;
        //console.log("db_storeid"+db_storeid);
    }

    if(user_id_c =='' && typeof (user_id_c) == undefined){
        
        error = 1; 

    }else{
        db_user_id = user_id_c;
       // console.log("db_user_id"+db_user_id);
    }


    if(retail_cycleCountID_c =='' &&  retail_cycleCountID_c == undefined){
        
        error = 1; 

    }else{
        db_retail_cycleCountID = retail_cycleCountID_c;
       // console.log("db_user_id"+db_user_id);
    }



    if(error == 0){
        

        var new_query = `INSERT INTO tb_audit
                            (audit_text, audit_json, log_type, date, 
                            deviceid, storeid, user_id,Retail_CycleCountID) 
                            VALUES ('`+db_audit_text+`','`+db_audit_json+`',
                            '`+db_log_type+`','`+dateTime+`','`+db_deviceid+`','`+db_storeid+`','`+db_user_id+`',
                            '`+db_retail_cycleCountID+`'
                            )`;
            
            console.log(new_query);
            mysql.queryCustom(new_query).then(function(result) {
                if (result.status == "1") {
                    //console.log(dataType);
                } else {
                    console.log('Error')
                }
            })
            .catch(function(error) {
                console.log(error);
            }); 
        }
}

module.exports.send = send;