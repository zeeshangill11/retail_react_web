var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");


function CriticalOutOfStock(date,store){

   var cond = '';

   

    
    if(date !==''){
        cond +='date='+date
    }

    if(store !==''){
        cond +='&store_id='+store
    }

    var abc = "CriticalOutOfStock?"+cond;

    $('.CriticalOutOfStock').attr('href',abc);
    
}
CriticalOutOfStock();

   
function Expected_Today(){
    var mythis = $('#expectedw');
    mythis.find('.waiting').show();
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/Expected_Today_dashboard",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            mythis.find('.waiting').hide();


            //console.log("aaaaaaa"+response_data.permission);
            if(response_data.permission !== '' || response_data.permission !== undefined){
                $('#expectedw').html('<p>'+response_data.permission+'</p>');
            }else{

                
            }

            if(response_data[0].expected_receiving_total !== null){
                $('#expectedw').html('<p>'+response_data[0].expected_receiving_total+'</p>');          

            }else{
                $('#expectedw').html('<p>0</p>');          

            } 
            
            
            
        }
    });
}
Expected_Today();


function Last_Week_Shipped(){
    var mythis = $('#shippedWait');
    mythis.find('.waiting').show();
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/Last_Week_Shipped_Dashboard",
        success: function(data)
        {
            var response_data = JSON.parse(data);

             mythis.find('.waiting').hide();
           
             if(response_data[0].Shipped_receiving_total_week>0){
                $('#shippedWait').html('<p>'+response_data[0].Shipped_receiving_total_week+'</p>');          

             }else{
                $('#shippedWait').html('<p>0</p>');          

             }
            
        }
    });
}
Last_Week_Shipped();

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

            setTimeout(function(){

                CriticalOutOfStock(response_data[0].date,store_id);
            
            },2000);

            // var mythis = $('#CriticalStock');
            // mythis.find('.waiting').show();
            $.ajax({
                    type:'POST',
                    url: "/api/1.0.0/inventoryData/CriticalOutOfStockDashobard",
                       data:{
                        'storeid':store_id,
                        "date":date
                    },
                    success: function(data)
                    {
                        var response_data = JSON.parse(data);
                        //console.log(response_data);
                        
                        
                        if(response_data[0].CriticalStock !== null){
                            //mythis.find('.waiting').hide();
                            $('#CriticalStock').html('<p>'+response_data[0].CriticalStock+'</p>');
                            
                        }else{
                            //mythis.find('.waiting').hide();
                            $('#CriticalStockk').html('<p class="accu-onhand-vl">0</p>');
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

    
     //var mythis = $('#CountDynamic');  
     //mythis.find('.waiting').show();
        
   
   //alert(store_id)

});

function Expected_Todaydetails(){
    var mythis = $('#waitnibt');
    mythis.find('.waiting').show();
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/Expected_Today_home_dashboard_details",
        success: function(data)
        {
            var response_data = JSON.parse(data);
             mythis.find('.waiting').hide();
            //console.log(response_data);
           var IBT = '';
           var Source = '';
           
            for(var i = 0; i < response_data.length; i++){
                IBT += '<span>'+response_data[i].asn+'</span><br>';
                Source += '<span>'+response_data[i].source+'</span><br>';
            }
            $("#IBT").html(IBT);
            $("#Source").html(Source);
           
        }
    });
}
Expected_Todaydetails();


function Last_Week_Shipped_dashboard_Details(){
    var mythis = $('#weekwaiting');
    mythis.find('.waiting').show();
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/Last_Week_Shipped_dashboard_Details",
        success: function(data)
        {
            var response_data = JSON.parse(data);
             mythis.find('.waiting').hide();
            //console.log(response_data);
           var shippedweek = '';
           var shippeddestination = '';
           
            for(var i = 0; i < response_data.length; i++){
                shippedweek += '<span>'+response_data[i].asn+'</span><br>';
                shippeddestination += '<span>'+response_data[i].destination+'</span><br>';
            }
            $("#shippedweek").html(shippedweek);
            $("#shippeddestination").html(shippeddestination);
           
        }
    });
}
Last_Week_Shipped_dashboard_Details();
