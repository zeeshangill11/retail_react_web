// function Receive_today(){
//     var mythis = $('#today_status');  
//     mythis.find('.waiting').show();

//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/supply_chain_Receive_today",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             mythis.find('.waiting').show();
//             //console.log(response_data);

//             if(response_data[0].receiving_total !== null){
//                 $("#Received_Today").html('<span>'+response_data[0].receiving_total+'</span>');
//             }else{
//                 $("#Received_Today").html('<span>0</span>');
//             }
         
            
//             // $('#DeviceId').selectpicker('refresh');			

//         }
//     });
// }
// Receive_today();

// var currentdate = new Date(); 
// var datetime =  currentdate.getDate() + "/"
//                 + (currentdate.getMonth()+1)  + "/" 
//                 + currentdate.getFullYear() + " "  
//                 + currentdate.getHours() + ":"  
//                 + currentdate.getMinutes() + ":" 
//                 + currentdate.getSeconds();
//                 //console.log(datetime);
// $(".dateTime").html("<span>Last Update: "+datetime+"</span>");


// function Shipped_Today(){
//     var mythis = $('#today_status');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/supply_chain_Shipped_Today",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             mythis.find('.waiting').hide();
//            // console.log(response_data);
            
//             if(response_data[0].shipping_receiving_total !== null){
//                 $("#Shipped_Today").html('<span>'+response_data[0].shipping_receiving_total+'</span>');
//            }else{
//                 $("#Shipped_Today").html('<span>0</span>');
//             }

            
            
//         }
//     });
// }
// Shipped_Today();

// function Expected_Today(){
//     var mythis = $('#today_status');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/supply_chain_Expected_Today",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             mythis.find('.waiting').show();

//             if(response_data[0].expected_receiving_total !==null){
//                 $('#Expected_Today').html('<span>'+response_data[0].expected_receiving_total+'</span>');          

//             }else{
//                 $('#Expected_Today').html('<span>0</span>');          
//             }

             
//         }
//     });
// }
// Expected_Today();


// function Last_Week_Received(){
//     var mythis = $('#week_status');  
//     mythis.find('.waiting').show();
//     var storeid = $("#StoreID").val();

//     $.ajax({
//         type:'POST',

//         url: "/api/1.0.0/stockCountRecords/Supply_Chain_Last_Week_Received",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//              mythis.find('.waiting').show();

//             if(response_data[0].receiving_total_week !== null){
//                 $('#Last_Week_Received').html('<span>'+response_data[0].receiving_total_week+'</span>');          
//             }else{
//                 $('#Last_Week_Received').html('<span>0</span>');          

//             }
           
            
//         }
//     });
// }
// Last_Week_Received();


// function Last_Week_Expected(){
//     var mythis = $('#week_status');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/Supply_Chain_Last_Week_Expected",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//              mythis.find('.waiting').show();
//             //alert(response_data[0].expected_receiving_total)

//             if(response_data[0].week_transfered_receiving_total !== null){
//                 $('#Last_Week_Expected').html('<span>'+response_data[0].week_transfered_receiving_total+'</span>');          

//             }else{
                
//                 $('#Last_Week_Expected').html('<span>0</span>');          
//             }
            
            
//         }
//     });
// }
// Last_Week_Expected();

// function Last_Week_Shipped(){
//     var mythis = $('#week_status');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/Supply_Chain_Last_Week_Shipped",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//              mythis.find('.waiting').show();

//             if(response_data[0].Shipped_receiving_total_week !== null){
//                 $('#Last_Week_Shipped').html('<span>'+response_data[0].Shipped_receiving_total_week+'</span>');          

//             }else{
//                 $('#Last_Week_Shipped').html('<span>0</span>');          

//             }
            
            
//         }
//     });
// }
// Last_Week_Shipped();

// function Receive_Last_Month(){
//     var mythis = $('#month_status');  
//     mythis.find('.waiting').show();

//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/Supply_Chain_Receive_Last_Month",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             mythis.find('.waiting').show();
           
//             if(response_data[0].receiving_total_month !== null){
//             $('#Receive_Last_Month').html('<span>'+response_data[0].receiving_total_month+'</span>');          

//             }else{
//             $('#Receive_Last_Month').html('<span>0</span>');          
//             }

            
//         }
//     });
// }
// Receive_Last_Month();

// function Expected_Last_Month(){
//     var mythis = $('#month_status');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/Supply_Chain_Expected_Last_Month",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             mythis.find('.waiting').show();

//             if(response_data[0].expected_total_month !== null ){
//                 $('#Expected_Last_Month').html('<span>'+response_data[0].expected_total_month+'</span>');          

//             }else{
//                 $('#Expected_Last_Month').html('<span>0</span>');          

//             } 
            
//         }
//     });
// }
// Expected_Last_Month();



// function Shipped_Last_Month(){
//     var mythis = $('#month_status');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/Supply_Chain_Shipped_Last_Month",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             mythis.find('.waiting').show();

//             if(response_data[0].shipping_total_month !== null){
//                 $('#Shipped_Last_Month').html('<span>'+response_data[0].shipping_total_month+'</span>');          

//             }else{
//                 $('#Shipped_Last_Month').html('<span>0</span>');          

//             }
            
//         }
//     });
// }
// Shipped_Last_Month();

// function ExcessInAsn(){
//     var mythis = $('#ExcessInAsn');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/ExcessInAsn",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);


//             mythis.find('.waiting').show();
           
//             if(response_data[0].ExcessInAsn !== null){
//                 $('#ExcessInAsn').html('<p>'+Math.abs(response_data[0].ExcessInAsn)+'</p>');          

//             }else{
//                 $('#ExcessInAsn').html('<p>0</p>');          

//             }
            
//         }
//     });
// }
// ExcessInAsn();

// function ShortageinASN(){
//     var mythis = $('#ShortageinASN');  
//     mythis.find('.waiting').show();
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/ShortageinASN",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);

//             //console.log("shotage+++++++++++"+response_data[0].ShortageinASN);

//             mythis.find('.waiting').show();

//             if(response_data[0].ShortageinASN !== null){
//                 $('#ShortageinASN').html('<p>'+response_data[0].ShortageinASN+'</p>');
//             }else{
//                 $('#ShortageinASN').html('<p>0</p>');
//             }
           
                      

//         }
//     });
// }
// ShortageinASN();


// function storeName(){
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/getStoreName",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             var storename = '';
//             storename += '<option value="" store_id="0">All Stores</option>';
//             for(var i = 0; i < response_data.length; i++){
//                 storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                   
//             }
//             $("#StoreID").html(storename);
//             $('#StoreID').selectpicker('refresh');
//         }
//     });
// }

// $(document).ready(function(){
//     storeName();
//     function asscess(){

//         var abc = "access_asndetails";
        
//         $('.asscess').attr('href',abc);
//     }
//     asscess();
//     function shortage(){
//         var abc = "short_asndetails"
//         $('.shortage').attr('href',abc);   
//     }
//     shortage();


//      $('#supplychainbtn').click(function(){
//         //alert($('#summarydate').val())
//         //alert('ok')
//         var working = false;
//         var $this = $('#supplychainFitler');
//         var error = 0;
        

//         $(".error_msg").html('');
//         //$("#executiveSummary").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');  

//         if($this.find('[name="SoteID"]').val()=="" || $this.find('[name="SoteID"]').val()==null){
//             error=1;
//             $this.find("[data-id='StoreID']").css("border-color","red"); 
                          
//         }else{
//             $this.find("[data-id='StoreID']").css("border-color","#fff");
//         }

//         if($this.find('[name="date"]').val()=="" || $this.find('[name="date"]').val()==null){
//             error=1;
//             $this.find("[valid='Date']").css("border-color","red");              
//         }else{
//             $this.find("[valid='Date']").css("border-color","#fff");
//         }
            
//             if(error == 0){
            
//                 working = true;
//                 $("#supplychainbtn").html('Run');    
//                 $('.row.ml-0.mr-0').removeClass('hide')
//                 supplychain_ajax();
//             }else{
//              jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");

//                 return false;
//             }    
//     });
// })
