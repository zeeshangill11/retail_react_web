const mysql = require("./mysqlCluster.js");
var mysqlMain2 = mysql.mysqlMain;
//const logger = require('pino')()
var dateFormat = require("dateformat");

const pino = require('pino');
var path = require("path");
var fs        = require('fs');
const logger = pino({
  prettyPrint: true
})

function log(type,system_msg,custom_msg) {
    var dataType = '';
    var system_msg_db = '';
    var custom_msg_db = '';
    var fs        = require('fs');
    var now       = new Date();
    var path = require("path");
    //console.log(data);
    if (typeof type !== 'undefined') {
        dataType = type;
    }

  
    if (typeof system_msg !== 'undefined') {
        system_msg_db = system_msg;
    }

    if (typeof custom_msg !== 'undefined') {
        custom_msg_db = custom_msg;
    }


    if(dataType !== '' || system_msg_db !== '' || custom_msg_db !== ''){

        var new_query = "INSERT INTO `logs`" +
            "(`type` ,`system_msg`,`custom_msg`) " +
            "VALUES " +
            "('" + escape(type) + "',"+ 
            "'"+escape(system_msg_db)+"','"+escape(custom_msg_db)+"')";
        
           

            if(dataType=="Error")
            {
                logger.error(custom_msg_db+system_msg_db);
            }
            else if(dataType=="Error")
            {
                logger.info(custom_msg_db+system_msg_db);
            }
            else
            {
                logger.info(custom_msg_db+system_msg_db);
            }

            var dateTime2  = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            var dateTime  = dateFormat(now, "yyyy-mm-dd");

            var message = dateTime2+custom_msg_db+system_msg_db+'<br>';

            var full_path = path.join(__dirname, '../MMAssets/css/error_log/error_log.html');
            

            // var read_Dir = path.join(__dirname, '../MMAssets/css/error_log/');
            // var s = 0; 
            // fs.readdirSync(read_Dir).forEach(file => {
            //     s = s+1;
            //     console.log(s+'>>>'+file)
            // });


//             fs.appendFile(full_path,message, function (err) {
//                 if (err) throw err;
//                 console.log('Saved!');
//             });


//         console.log(new_query)
           



       
    }else{
        console.log(dataType);
    }
}


function execution_info(controller_name){
   
 console.log("==================="+controller_name);
}


function log_entry22(end_point22,payload22)
{
    try{
        var now       = new Date();
        var dateTime2  = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

        var end_point = end_point22;
        var payload = payload22;
        var log_dump = [];
        var temp = [

            end_point,
            JSON.stringify(payload),
            dateTime2
            
        ];

        log_dump.push(temp);
        log_enty_query = " INSERT INTO  api_log (`end_point`, `payload`,`date_time`) VALUES ? "; 
        mysqlMain2.query(log_enty_query, [log_dump],function(err) {
            if(err)
            {
                log('Error', JSON.stringify(err), 'Logic API ERROR ');
            }
        });
    } catch (e) {
        log('Error', 'Catch Expection'+JSON.stringify(e), '48-log_entry');
       
    }    
}

function log_entry_unique(var_end_point,var_payload,var_storename)
{
    try{

        var now         = new Date();
        var end_point   = var_end_point;
        var payload     = var_payload;
        var storename   = var_storename;

        var dateTime2   = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
        var start_time  = dateFormat(now, "yyyy-mm-dd")+" 00:00:00";
        var end_time    = dateFormat(now, "yyyy-mm-dd")+" 23:59:59";


         var select_query = "SELECT * FROM api_log where  "+
            " date_time >= '"+start_time+"' "+
            " and date_time <='"+end_time+"' "+
            " and end_point ='"+end_point+"' "+
            " and storename ='"+storename+"' ";

       
    
        mysql.queryCustom(select_query).then(function(result) {

           if(result.results.length>0)
           {
               console.log("already exist ")
           }
           else
           {
                var log_dump = [];
                var temp = [
                    end_point,
                    JSON.stringify(payload),
                    dateTime2,
                    storename
                ];

                log_dump.push(temp);
                log_enty_query = " INSERT INTO  api_log (`end_point`, `payload`,`date_time`,storename) VALUES ? "; 
                
                mysqlMain2.query(log_enty_query, [log_dump],function(err) {
                    if(err)
                    {
                        log('Error', JSON.stringify(err), 'Logic API ERROR ');
                    }
                });
           }

        });


       
      


    } catch (e) {
        log('Error', 'Catch Expection'+JSON.stringify(e), ' log_entry_unique');
       
    }    
}


module.exports.log = log;
module.exports.execution_info = execution_info;
module.exports.log_entry = log_entry22;
module.exports.log_entry_unique = log_entry_unique;
