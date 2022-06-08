const mysql = require("./controllers/mysqlCluster.js");
var fileWriter = require('fs')

function insertInfo(user_id){
    return new Promise((resolve,reject) => {
        function randomStr(len, arr) { 
            return new Promise((resolve) => {
                len = len - 14;
                var ans = ''; 
                for (var i = len; i > 0; i--) { 
                    ans += arr[Math.floor(Math.random() * arr.length)]; 
                } 
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                var current_date_time = utc.getFullYear() + "" + (utc.getMonth() + 1) + "" + utc.getDate() + "" +  utc.getHours() + "" + utc.getMinutes() + "" + utc.getSeconds();
                ans += current_date_time;
                resolve(ans);
            });
        } 
        function history(user_id){
            return new Promise((resolve) => {
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                var current_date_time = utc.getFullYear() + "-" + (utc.getMonth() + 1) + "-" + utc.getDate() + " " +  utc.getHours() + ":" + utc.getMinutes() + ":" + utc.getSeconds();
                
                var history = {
                    "insert_history": {
                        "user_id": user_id,
                        "timestamp": current_date_time
                    }
                };
                resolve(history);
            });
        }
        randomStr(64, '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
            .then(function(result){
                var sync_id = result;
                history(user_id)
                    .then(function(result){
                        var insertInfo = {
                            "sync_devices": {
                                "ON": "1"
                            },
                            "sync_id": sync_id,
                            "history": result
                        };
                        resolve(insertInfo);
                    })
                    .catch(function(error){
                        errorLogger(error);
                        reject(error);
                    })
            })
            .catch(function(error){
                errorLogger(error);
                reject(error);
            })
    });
}
function updateInfo(user_id, table_name, sync_id, newData,restaurant_id){
    return new Promise((resolve,reject) => {
        var difference = [];
        mysql.querySelect(table_name,"where sync_id = '" + sync_id + "'","*",restaurant_id)
            .then(function(response){
                var currentData = response.results[0];
                for(var key in newData){
                    if(newData[key] != currentData[key]){
                        console.log("KEY " + key + " | TYPE " + typeof newData[key])
                        if(typeof newData[key] == "object"){
                            var old = JSON.parse(currentData[key]);
                            for (var key2 in newData[key]){
                                if(old[key2] != newData[key][key2]){
                                    difference.push({column: key2, old_value: old[key2], new_value: newData[key][key2]});
                                }
                            }
                            
                        } else {
                            difference.push({column: key, old_value: currentData[key], new_value: newData[key]});
                        }
                        
                    }
                }
                var currentHistory = JSON.parse(currentData['history']);
                var currentHistoryUpdated = currentHistory.updated;
                if(currentHistoryUpdated == undefined){
                    currentHistoryUpdated = [];
                }
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                var current_date_time = utc.getFullYear() + "-" + (utc.getMonth() + 1) + "-" + utc.getDate() + " " +  utc.getHours() + ":" + utc.getMinutes() + ":" + utc.getSeconds();
                currentHistoryUpdated.push({user_id: user_id, dateTime: current_date_time, updated_fields: difference});
                currentHistory.updated = currentHistoryUpdated;
                resolve({status: "1", sync_devices: {"ON":"1"}, history: currentHistory})
            })
            .catch(function (error){
                resolve({status: "0", error: error})
            });
    });

}
function MainDBupdateInfo(user_id, table_name, sync_id, newData){
    return new Promise((resolve,reject) => {
        var difference = [];
        mysql.MainDBquerySelect(table_name,"where sync_id = '" + sync_id + "'","*",)
            .then(function(response){
                var currentData = response.results[0];
                for(var key in newData){
                    if(newData[key] != currentData[key]){
                        console.log("KEY " + key + " | TYPE " + typeof newData[key])
                        if(typeof newData[key] == "object"){
                            var old = JSON.parse(currentData[key]);
                            for (var key2 in newData[key]){
                                if(old[key2] != newData[key][key2]){
                                    difference.push({column: key2, old_value: old[key2], new_value: newData[key][key2]});
                                }
                            }
                            
                        } else {
                            difference.push({column: key, old_value: currentData[key], new_value: newData[key]});
                        }
                        
                    }
                }
                var currentHistory = JSON.parse(currentData['history']);
                var currentHistoryUpdated = currentHistory.updated;
                if(currentHistoryUpdated == undefined){
                    currentHistoryUpdated = [];
                }
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                var current_date_time = utc.getFullYear() + "-" + (utc.getMonth() + 1) + "-" + utc.getDate() + " " +  utc.getHours() + ":" + utc.getMinutes() + ":" + utc.getSeconds();
                currentHistoryUpdated.push({user_id: user_id, dateTime: current_date_time, updated_fields: difference});
                currentHistory.updated = currentHistoryUpdated;
                resolve({status: "1", sync_devices: {"ON":"1"}, history: currentHistory})
            })
            .catch(function (error){
                resolve({status: "0", error: error})
            });
    });

}
function errorLogger(appendText){
    var now = new Date();
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    var current_date_time = utc.getFullYear() + "-" + (utc.getMonth() + 1) + "-" + utc.getDate() + " " +  utc.getHours() + ":" + utc.getMinutes() + ":" + utc.getSeconds();
    
    var data = "**************************************\n[" + current_date_time + "]\n" + appendText + "**************************************\n";
    if(Array.isArray(appendText)){
        data = "**************************************\n[" + current_date_time + "]\n" + appendText.toString() + "**************************************\n";
    }
    if(typeof appendText === 'object' && appendText !== null){
        if(JSON.stringify(appendText) == "{}"){
            data = "**************************************\n[" + current_date_time + "]\n" + appendText + "\n";
        } else {
            data = "**************************************\n[" + current_date_time + "]\n" + JSON.stringify(appendText) + "\n";
        }
        
    }
    fileWriter.promises.appendFile("./errorLog.txt",data);
}


module.exports.errorLogger = errorLogger;
module.exports.insertInfo = insertInfo;
module.exports.updateInfo = updateInfo;
module.exports.MainDBupdateInfo = MainDBupdateInfo;