function StoreCount(){
    //alert('ok');
    return new Promise(function(resolve, reject) {
      
        var mythis = $('#CountDynamic');
      
        mythis.find('.waiting').show();
        total_store = [];
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/totalstore/",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                total_store.push(response_data);
              
                if(response_data[0].total_store !== null){
                    mythis.find('.waiting').hide();
                    $('#totalstore').html('<p style="margin-bottom: 0" class="accu-onhand-vl">'+response_data[0].total_store+'</p>');
                    
                }else{
                    mythis.find('.waiting').hide();
                    $('#totalstore').html('<p style="margin-bottom: 0" class="accu-onhand-vl">0</p>');
                }
               

               
            }
        });
    });
}
StoreCount();
function totalusers(){
    //alert('ok');
    return new Promise(function(resolve, reject) {
      
        var mythis = $('#TotalUsers');
      
        mythis.find('.waiting').show();
        total_users = [];
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/totalusers/",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                total_users.push(response_data);
              
                if(response_data[0].total_users !== null){
                    mythis.find('.waiting').hide();
                    $('#total_users').html('<p style="margin-bottom: 0" class="accu-onhand-vl">'+response_data[0].total_users+'</p>');
                    
                }else{
                    mythis.find('.waiting').hide();
                    $('#total_users').html('<p style="margin-bottom: 0" class="accu-onhand-vl">0</p>');
                }
               

               
            }
        });
    });
}
totalusers();

function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="" store_id="0">Select Store</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storename+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();

$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});


$(document).on('change','#StoreID', function(){
    
    var mythis = $('#DateDisplay');
    mythis.find('.waiting').show(); 
   
   var store_id = $('#StoreID').val();

   var over = '';
   var missing = '';
     
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoresDetailsDashboard",
        data:{
            'store_id':store_id
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);


            var date = response_data[0].date;

            //console.log(response_data);
            
            if(response_data[0].date !== null){
                mythis.find('.waiting').hide();
                $('#DateDisplay').html('<span class="ftbk-vl">'+response_data[0].date+'</span>'); 
            }else{
                mythis.find('.waiting').hide();
                $('#DateDisplay').html('<span class="ftbk-vl">No Time Given</span>'); 
            }


            // var mythis = $('#CriticalStock');
            // mythis.find('.waiting').show();
           
           

            $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/getStoresPercentage",
            data:{
                'store_id':store_id,
                "date":date

            },
            success: function(data)
            {
                 var response_data = JSON.parse(data);
                 missing = response_data[0].missingpercentage;
                 over = response_data[0].overpercentage;
                 matching = response_data[0].matching;

                 //alert(response_data[0].onhandtotal);
                if(response_data[0].onhandtotal !== null){
                //mythis.find('.waiting').hide();
                    $('#Onhand').html('<span class="ftbk-vl">'+response_data[0].onhandtotal+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#Onhand').html('<span class="ftbk-vl">0</span>'); 
                }

                if(response_data[0].inventroycount !== null){
                //mythis.find('.waiting').hide();
                    $('#Count').html('<span class="ftbk-vl">'+response_data[0].inventroycount+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#Count').html('<span class="ftbk-vl">0</span>'); 
                } 

                if(response_data[0].front !== null){
                    //mythis.find('.waiting').hide();
                    $('#front').html('<span class="ftbk-vl">'+response_data[0].front+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#front').html('<span class="ftbk-vl">0</span>'); 
                } 
                if(response_data[0].back !== null){
                    //mythis.find('.waiting').hide();
                    $('#back').html('<span class="ftbk-vl">'+response_data[0].back+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#back').html('<span class="ftbk-vl">0</span>'); 
                } 


                    if(over>0 && over !== null){
                         //mythis.find('.waiting').hide();
                     $("#dashboard .progress-sec .center.overs").css("width", over + "%");
                     $(".over_text").html('<span>'+over+'%</span>')
                    }else{
                         //mythis.find('.waiting').hide();
                     $("#dashboard .progress-sec .center.overs").css("width", 0 + "%");
                     $(".over_text").html('<span>0 %</span>')  
                    }


                    if(missing>0 && missing !== null){
                        // mythis.find('.waiting').hide();
                        $("#dashboard .progress-sec .center.unders").css("width", missing + "%");
                        $(".under_text").html('<span>'+missing+'%</span>')
                    }else{
                        // mythis.find('.waiting').hide();
                        $("#dashboard .progress-sec .center.unders").css("width", 0 + "%");
                        $(".under_text").html('<span>0 %</span>')
                    }

                     if(matching>0 && matching !== null){
                        // mythis.find('.waiting').hide();
                         $("#dashboard .matchingg .matching").css("width", matching + "%");
                        $(".matching_text").html('<span>'+matching+'%</span>')
                    }else{
                        // mythis.find('.waiting').hide();
                     $("#dashboard .matchingg .matching").css("width", 0+ "%");
                     $(".matching_text").html('<span>0 %</span>')
                    }
                }
        });


        }
    });

    
     //var mythis = $('#CountDynamic');  
     //mythis.find('.waiting').show();
        
   
   //alert(store_id)

});

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

$(document).on('change','#StoreID', function(){
    
    var mythis = $('#DateDisplay');
    mythis.find('.waiting').show(); 
   
   var store_id = $('#StoreID').val();

   var over = '';
   var missing = '';
     
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoresDetailsDashboard",
        data:{
            'store_id':store_id
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);


            var date = response_data[0].date;

            //console.log(response_data);
            
            if(response_data[0].date !== null){
                mythis.find('.waiting').hide();
                $('#DateDisplay').html('<span class="ftbk-vl">'+response_data[0].date+'</span>'); 
            }else{
                mythis.find('.waiting').hide();
                $('#DateDisplay').html('<span class="ftbk-vl">No Time Given</span>'); 
            }


            // var mythis = $('#CriticalStock');
            // mythis.find('.waiting').show();
            $.ajax({
                    type:'POST',
                    url: "/api/1.0.0/inventoryData/TotalDevicesHandheldDevices",
                       data:{
                        'storeid':store_id,
                        "date":date
                    },
                    success: function(data)
                    {
                        var response_data = JSON.parse(data);
                        //console.log(response_data);
                        
                        
                        if(response_data[0].total_handheld_devices !== null){
                           
                            $('#TotalDevices').html('<p>'+response_data[0].total_handheld_devices+'</p>');
                            
                        }else{
                            //mythis.find('.waiting').hide();
                            $('#TotalDevices').html('<p class="accu-onhand-vl">0</p>');
                        }

                            
                    }
                });
           

            $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/getStoresPercentage",
            data:{
                'store_id':store_id,
                "date":date

            },
            success: function(data)
            {
                 var response_data = JSON.parse(data);
                 missing = response_data[0].missingpercentage;
                 over = response_data[0].overpercentage;
                 matching = response_data[0].matching;

                 //alert(response_data[0].onhandtotal);
                if(response_data[0].onhandtotal !== null){
                //mythis.find('.waiting').hide();
                    $('#Onhand').html('<span class="ftbk-vl">'+response_data[0].onhandtotal+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#Onhand').html('<span class="ftbk-vl">0</span>'); 
                }

                if(response_data[0].inventroycount !== null){
                //mythis.find('.waiting').hide();
                    $('#Count').html('<span class="ftbk-vl">'+response_data[0].inventroycount+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#Count').html('<span class="ftbk-vl">0</span>'); 
                } 

                if(response_data[0].front !== null){
                    //mythis.find('.waiting').hide();
                    $('#front').html('<span class="ftbk-vl">'+response_data[0].front+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#front').html('<span class="ftbk-vl">0</span>'); 
                } 
                if(response_data[0].back !== null){
                    //mythis.find('.waiting').hide();
                    $('#back').html('<span class="ftbk-vl">'+response_data[0].back+'</span>'); 
                }else{
                    //mythis.find('.waiting').hide();
                    $('#back').html('<span class="ftbk-vl">0</span>'); 
                } 


                    if(over>0 && over !== null){
                         //mythis.find('.waiting').hide();
                     $("#dashboard .progress-sec .center.overs").css("width", over + "%");
                     $(".over_text").html('<span>'+over+'%</span>')
                    }else{
                         //mythis.find('.waiting').hide();
                     $("#dashboard .progress-sec .center.overs").css("width", 0 + "%");
                     $(".over_text").html('<span>0 %</span>')  
                    }


                    if(missing>0 && missing !== null){
                        // mythis.find('.waiting').hide();
                        $("#dashboard .progress-sec .center.unders").css("width", missing + "%");
                        $(".under_text").html('<span>'+missing+'%</span>')
                    }else{
                        // mythis.find('.waiting').hide();
                        $("#dashboard .progress-sec .center.unders").css("width", 0 + "%");
                        $(".under_text").html('<span>0 %</span>')
                    }

                     if(matching>0 && matching !== null){
                        // mythis.find('.waiting').hide();
                         $("#dashboard .matchingg .matching").css("width", matching + "%");
                        $(".matching_text").html('<span>'+matching+'%</span>')
                    }else{
                        // mythis.find('.waiting').hide();
                     $("#dashboard .matchingg .matching").css("width", 0+ "%");
                     $(".matching_text").html('<span>0 %</span>')
                    }
                }
        });


        }
    });

    var abc = 'handheldDevices?storeid='+store_id;
    $('.handheldDevices').attr('href',abc);
     //var mythis = $('#CountDynamic');  
     //mythis.find('.waiting').show();
        
   
   //alert(store_id)

});


function DevicesHandHeld(){
    var mythis = $('#TotalDevices');
    mythis.find('.waiting').show();
    $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/TotalDevicesHandheldDevices",
        
            success: function(data)
            {
                var response_data = JSON.parse(data);
                //console.log(response_data);
                
                
                if(response_data[0].total_handheld_devices !== null){
                    mythis.find('.waiting').hide();
                    $('#TotalDevices').html('<p>'+response_data[0].total_handheld_devices+'</p>');
                    
                }else{
                    mythis.find('.waiting').hide();
                    $('#TotalDevices').html('<p class="accu-onhand-vl">0</p>');
                }

                    
            }
        });
    
}
DevicesHandHeld();



function activities(){
    
    var mythis = $('#Activities');
    mythis.find('.waiting').show();
    $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/Activities",
        
            success: function(data)
            {
                var response_data = JSON.parse(data);
                //console.log(response_data);
                mythis.find('.waiting').hide();

                var activities = '';   
                var log_type = '';
                var device_id = '';
                var store_id = '';
                var date = '';
                var audit_text = '';
                var retail_cycleCount_id = '';
                var user_id = '';

                    
                    
                $.each(response_data, function (i, e) {
                   

                    if(e.date !== '' 
                        && e.date !== null){

                        date =  e.date+' -- '+e.audit_text;   
                    }
                    if(e.storeid !=='' 
                        && e.deviceid !== null){
                        audit_text =  '-- '+e.audit_text;
                    }
                    if(e.log_type !== '' 
                        && e.log_type !== null){
                      log_type =  '-- logType -- '+e.log_type;   
                    }
                    if(e.deviceid !== '' 
                        && e.deviceid !== null){
                        
                        device_id = '-- Device ID -- '+e.deviceid;
                    }
                    //console.log(typeof e.storeid);
                    if(e.storeid !=='' 
                        && e.store_id !== null && e.store_id !== 'null'){
                        store_id  = '-- StoreID -- '+e.storeid; 
                    }

                    if(e.Retail_CycleCountID !=='' 
                        && e.Retail_CycleCountID !== null && e.Retail_CycleCountID !== 'null'){
                        retail_cycleCount_id  = '-- retail_cycleCount_id -- '+e.Retail_CycleCountID; 
                    }

                    
                    $("#Activities").append("<p class='cardBodyData'>"+date+audit_text+log_type+device_id+store_id+retail_cycleCount_id);//this will add to the at the end of #prodDeccarea
                });
                
                  
            }
        });
}
activities();