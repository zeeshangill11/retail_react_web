var mysql = require("mysql");
const fs = require('fs');
var DBNames = {};

// If environment is not production,
// load environment config
if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'qa') {
    require('dotenv').config();
}

var globals = {

    mainDBName : process.env.DB_SCHEMA,
    host_db : process.env.DB_HOST,
    username_db : process.env.DB_USER,
    password_db : process.env.DB_PWD,

    b_mainDBName : process.env.B_DB_SCHEMA,
    b_host_db : process.env.B_DB_HOST,
    b_username_db : process.env.B_DB_USER,
    b_password_db : process.env.B_DB_PWD,



    access_token : process.env.DB_TOKEN,
    access_token2: process.env.DB_TOKEN2
    
}


var mysqlMain;

// If environment is production use SSL
if (process.env.NODE_ENV === 'production'
     || process.env.NODE_ENV === 'qa') {
    console.log("connecting to db using ssl");
    const serverCert = [fs.readFileSync(__dirname + "/../certs/" + process.env.DB_SSL_CERT_NAME, "utf8")];
    mysqlMain = mysql.createPool({
        connectionLimit : 70,
        host     : globals.host_db,
        user     : globals.username_db,
        password : globals.password_db,
        database: globals.mainDBName,
        port: process.env.DB_PORT,
        ssl: {
            cert: serverCert
        },
        dateStrings: true,
        multipleStatements: true,
        timeout: 600000
    });
    mysql_bak = mysql.createPool({

        connectionLimit : 70,

        host     : globals.b_host_db,
        user     : globals.b_username_db,
        password : globals.b_password_db,
        database: globals.b_mainDBName,
        port: process.env.B_DB_PORT,
        ssl: {
            cert: serverCert
        },
        dateStrings: true,
        multipleStatements: true,
        timeout: 600000
    });
    /*
    setInterval(function (){
        mysqlMain.getConnection(function(err,connection){
            if(err) {
                console.log(err);
                return false;
            }
            console.log(`All Connections ${mysqlMain._allConnections.length}`);
            console.log(`Acquiring Connections ${mysqlMain._acquiringConnections.length}`);
            console.log(`Free Connections ${mysqlMain._freeConnections.length}`);
            console.log(`Queue Connections ${mysqlMain._connectionQueue.length}`);
            console.log(`connecting to db with id: ${connection.threadId}`);
            connection.release();
            // connection.query(sql,params,function(err,results,fields){
            //     
            //     if(err) {
            //         console.error(err);
            //         return cb(err);
            //     }
            //     return cb(null,{results,fields});
            // });
        });
    },3000);
    */

} else {
    console.log("connecting to db");
    mysqlMain = mysql.createPool({

        connectionLimit : 70,

        host     : globals.host_db,
        user     : globals.username_db,
        password : globals.password_db,
        database: globals.mainDBName,
        port: process.env.DB_PORT,
        dateStrings: true,
        multipleStatements: true,
        timeout: 600000
    });
   
    
}


async function queryInsert(table_name, data){
    var indexes = "(";
    var values = "(";
    for (var index in data){
        indexes = indexes + index + ",";        
        if(typeof data[index] === 'object'){
            values = values + "\'" + JSON.stringify(data[index]) + "\'" + ",";
        } else {
            values = values + "\'" + data[index] + "\'" + ",";
        }
        
    }
    indexes = indexes.substring(0, indexes.length - 1) + ") VALUES ";
    values = values.substring(0, values.length - 1) + ")";
    var query = "INSERT INTO " + table_name + " " + indexes + values;
    //console.log("dddddddddddddddd"+query);
    return new Promise((resolve,reject) => {
        mysqlMain.query(query, function (error, results, fields) {
            if (error){
                reject({status: "0", error: error});
            } else {
                resolve({status: "1", results: results});
            }
        });
    });
}

async function queryUpdate(table_name,data,update){
    var query = "UPDATE " + table_name + " SET ";
    for (var index in data){     
       if(typeof data[index] === 'object'){
            query = query + index + " = \'" + JSON.stringify(data[index]) + "\'" + ",";
       } else {
            query = query + index + " = \'" + data[index] + "\'" + ","; 
       }
       
    }
    var update_Query = " WHERE ";
    for (var index in update){     
        update_Query = update_Query + index + " = \'" + update[index] + "\'" + " AND "; 
    }

    query = query.substring(0, query.length - 1) + update_Query.substring(0, update_Query.length - 5);
    return new Promise((resolve) => {
        mysqlMain.query(query, function (error, results, fields) {
            if (error){
                resolve({status: "0", error: error});
            } else {
                resolve({status: "1", results: results});
            }
        });
    });
}


async function querySelect(table_name,where,toSelect){
    var query = "SELECT " + toSelect + " from " + table_name + " " + where;
    return new Promise((resolve,reject) => {
        mysqlMain.query(query, function (error, results, fields) {
            if (error){
                 reject({status:"0",'error':error});
            } else {
                resolve({status: "1", results: results});
            }
        });
    });
}

async function queryCustom(query){
    return new Promise((resolve,reject) => {
        mysqlMain.getConnection(function(err,connection){
            

            if(err) {
                console.log(err);
                return false;
            }
            /*console.log(`All Connections ${mysqlMain._allConnections.length}`);
            console.log(`Acquiring Connections ${mysqlMain._acquiringConnections.length}`);
            console.log(`Free Connections ${mysqlMain._freeConnections.length}`);
            console.log(`Queue Connections ${mysqlMain._connectionQueue.length}`);
            console.log(`connecting to db with id: ${connection.threadId}`);*/
           
           

            connection.query(query, function (error, results, fields) {
                if (error){
                    console.log(error);
                    reject({status:"0",'error':error});
                    connection.release();
                } else {
                    resolve({status: "1", results: results});
                    connection.release();
                }
            });
        });
    });
}

async function queryCustom2(query){
    return new Promise((resolve) => {
        mysqlMain.multipleStatements(query, function (error, results, fields) {
            if (error){
                resolve({status: "0", error: error});
            } else {
                resolve({status: "1", results: results});
            }
        });
    });
}
async function queryCustom3(query,dd){
    return new Promise((resolve) => {
        var querys = query;
        var check = dd;
        mysqlMain.query(query, function (error, results, fields) {
            if (error){
                // console.log(">>>>>>>>>>>>>>>>>>>>");
                // console.log(query);
                // console.log("<><><><><><><><><><><><><<>");
                // console.log(querys);

                // console.log(check);

                resolve({status: "0", error: error,query:query});
            } else {
                resolve({status: "1", results: results});
            }
        });
    });
}
function check_permission(page_name,permission){
    
    var pagename = permission;

    // console.log("pagenameeeeeeeeeeeeeeeeeeeeeee"+pagename);
    // console.log("permissiondddddddddddddddddd"+page_name);

        if(pagename == page_name){
            return true;
            
        }else{
            var obj =  JSON.parse(permission);
    
            for(i=0 ; i<obj.length; i++){
                    //console.log(obj[i])
                if(obj[i]==page_name)
                {

                    return true;
                    break;
                }
            }        
        }

      
}

module.exports.globals = globals;
module.exports.mysqlMain = mysqlMain;
module.exports.mysql_bak = mysql_bak;

module.exports.DBNames = DBNames;
module.exports.querySelect = querySelect;
module.exports.queryUpdate = queryUpdate;
module.exports.queryInsert = queryInsert;
module.exports.queryCustom = queryCustom;
module.exports.check_permission = check_permission;
module.exports.queryCustom3 = queryCustom3;


