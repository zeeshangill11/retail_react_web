var full_url =  (window.location.href);
var temp     =  full_url.split( '?' );

var abc = temp[1];
var temp2 = abc.split('edit_id=');

var id = temp2[1];

    
    
function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName", 
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="select">Select Store</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function geteditrecord(){
    
    $.ajax({
        type:'POST',
        data:{
            "edit_id":id,
        },
        url: "/api/1.0.0/stockCountRecords/GetHandHeldDeviceRecord",
        success: function(data)
        {
            var response_data = JSON.parse(data);

            //console.log(response_data);

            if(response_data[0].username !== null){
                $('#UserName').val(response_data[0].username);        
            }else{
                $('#UserName').val(' ');
            }

            

            if(response_data[0].device_unique_id !== null){
                $('#DeviceID').val(response_data[0].device_unique_id);        
            }else{
                $('#DeviceID').val(' ');
            }

            if(response_data[0].description !== null){
                $('#Description').val(response_data[0].description);        
            }else{
                $('#Description').val(' ');
            }

            // if(response_data[0].last_sync !== null){
            //     $('#LastSync').val(response_data[0].last_sync);        
            // }else{
            //     $('#LastSync').val(' ');
            // }

            // if(response_data[0].last_usages !== null){
            //     $('#LastUsages').val(response_data[0].last_usages);        
            // }else{
            //     $('#LastUsages').val(' ');
            // }

            if(response_data[0].device_ip !== null){
                $('#DeveiceIP').val(response_data[0].device_ip);        
            }else{
                $('#DeveiceIP').val(' ');
            }

            if(response_data[0].ns_connection !== null && response_data[0].ns_connection !== ''){
                $('#NonSecureIP option[value='+response_data[0].ns_connection+']').prop('selected', true);
                $('#NonSecureIP').selectpicker('refresh');      
            }else{
                   
                $('#NonSecureIP').val(' ');
            }

            if(response_data[0].server_ip !== null){
                $('#ServerIP').val(response_data[0].server_ip);        
            }else{
                $('#ServerIP').val(' ');
            }

            if(response_data[0].ss_connection !== null && response_data[0].ss_connection !== ''){
                $('#SecureIP option[value='+response_data[0].ss_connection+']').prop('selected', true);
                $('#SecureIP').selectpicker('refresh');      
            }else{
                   
                $('#SecureIP').val(' ');
            }

            if(response_data[0].status !== null){
                 
                $('#Status option[value='+response_data[0].status+']').prop('selected', true);
                $('#Status').selectpicker('refresh');      
            }else{
                $('#Status').val(' ');
            }

            $('#hidden_id').val(response_data[0].id)
            $('#hidden_password').val(response_data[0].password);
            
            var storej = response_data[0].storeid; 
       
            if(isJson(storej)){

              var json = $.parseJSON(storej);
            
              let optArr = [];
              for (var i = 0; i < json.length; i++) {
                optArr.push(json[i]);
              }
              $('#StoreID').selectpicker('val', optArr);
              $('#StoreID').selectpicker('refresh'); 

            }

           
            //console.log(response_data[0].storeid);

            if(response_data[0].storeid !== null && response_data[0].storeid !== ''){
                $('#StoreID option[value='+response_data[0].storeid+']').prop('selected', true);
                $('#StoreID').selectpicker('refresh');      
            }else{
                   
                $('#StoreID').val(' ');
            }   


        }
    });
}
 geteditrecord();

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

$(function() {

  $(document).on('change','#StoreID',function(){
    var $this = $(this).val();
   
    var error = 0;
    if($this == 'select'){
      error=1;
      $('.error_StoreID').html('Please Select Store !') 
    }else{
      $('.error_StoreID').html(' ')
    }
    
  }) 

    var validobj= $("form[name='registration']").validate({
    rules: {
      UserName:{
        required: true,
      },
      DeviceID:{
        required:true,
      },
      DeveiceIP:{
        required:true,
      },
      NonSecureIP:{
        required:true,
      },
      ServerIP:{
        required:true,
      },
      SecureIP:{
        required:true,
      },
      Description:{
        required:true,
      },
      StoreID:{
        required:true,
      },
    },
    
    submitHandler: function(form) {

        var $this = $('#AddDeviceForm');
        var error = 0;
        if($this.find('[name="StoreID"]').val()=="" 
            || $this.find('[name="StoreID"]').val()==null 
            || $this.find('[name="StoreID"]').val()=='select'){
            error=1;
            $this.find('.error_StoreID').html('Please Select Store ID !')               
        }else{
            $this.find('.error_StoreID').html(' ')
        }

        if(error == 0){

            $.ajax({
             type:'POST',
             url: "/api/1.0.0/stockCountRecords/EditHandHeldDevice",
             data:$("#AddDeviceForm").serialize(),
             success: function(data)
             {
                 $("#submit").html('SUBMIT');
                 $("#submit").removeAttr('disabled');
                 var response = JSON.parse(data);
                    
                    swal("Good job!", "Device Updated Successfully !", "success");
                    
                    
                setTimeout(function(){
                     window.location.href='handheldDevices';
                },2000)     
             }
         });
        }
       
        
    }
  });
});



// $('#submit').click(function(){

// 	var $this = $('#AddDeviceForm');
//     var working = false;
//     var error = 0;

// 	//$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Edit...');
// 	$(".error_msg").html('');

//     if($this.find('[name="UserName"]').val()==""){
//         error=1;
//         $this.find('.UserName_error').html('Please Enter UserName !')               
//     }else{
//         $this.find('.UserName_error').html(' ')
//     }

//     // if($this.find('[name="Password"]').val()==""){
//     //     error=1;
//     //     $this.find('.Password_error').html('Please Enter Password !')               
//     // }else{
//     //     $this.find('.Password_error').html(' ')
//     // }

// 	if($this.find('[name="DeviceID"]').val()==""){
//         error=1;
//         $this.find('.DeviceID_error').html('Please Enter Device !')               
//     }else{
//         $this.find('.DeviceID_error').html(' ')
//     }

//     if($this.find('[name="status"]').val()==""){
//         error=1;
//         $this.find('.error_status').html('Please Select Status !')               
//     }else{
//         $this.find('.error_status').html(' ')
//     }
//     // if($this.find('[name="LastSync"]').val()==""){
//     //     error=1;
//     //     $this.find('.error_LastSync').html('Please Last Sync !')               
//     // }else{
//     //     $this.find('.error_LastSync').html(' ')
//     // }
//     // if($this.find('[name="LastUsages"]').val()==""){
//     //     error=1;
//     //     $this.find('.error_LastUsages').html('Please Enter Last Usages !')               
//     // }else{
//     //     $this.find('.error_LastUsages').html(' ')
//     // }

//     if($this.find('[name="DeveiceIP"]').val()==""){
//         error=1;
//         $this.find('.error_DeveiceIP').html('Please Enter Device IP !')               
//     }else{
//         $this.find('.error_DeveiceIP').html(' ')
//     }

//     if($this.find('[name="NonSecureIP"]').val()==""){
//         error=1;
//         $this.find('.error_NonSecureIP').html('Please Enter Non Secure IP !')               
//     }else{
//         $this.find('.error_NonSecureIP').html(' ')
//     }

//     if($this.find('[name="ServerIP"]').val()==""){
//         error=1;
//         $this.find('.error_ServerIP').html('Please Enter Server IP !')               
//     }else{
//         $this.find('.error_ServerIP').html(' ')
//     }
//     if($this.find('[name="SecureIP"]').val()==""){
//         error=1;
//         $this.find('.error_SecureIP').html('Please Secure IP !')               
//     }else{
//         $this.find('.error_SecureIP').html(' ')
//     }

//     if($this.find('[name="Description"]').val()==""){
//         error=1;
//         $this.find('.error_Description').html('Please Enter Description !')               
//     }else{
//         $this.find('.error_Description').html(' ')
//     }
//     if($this.find('[name="StoreID"]').val()=="" || $this.find('[name="StoreID"]').val()== null){
//         error=1;
//         $this.find('.StoreID_error').html('Please Select Store !')               
//     }else{
//         $this.find('.StoreID_error').html(' ')
//     }
	
// 	if(error == 0){
// 		working = true;
// 		$("#submit").attr('disabled','disabled');
// 		$.ajax({
// 			type:'POST',
// 			url: "/api/1.0.0/stockCountRecords/EditHandHeldDevice",
// 			data:$("#AddDeviceForm").serialize(),
// 			success: function(data)
// 			{
// 				$("#submit").html('SUBMIT');
// 				$("#submit").removeAttr('disabled');
// 				var response = JSON.parse(data);
				
//                 swal("Good job!", "Device Updated Successfully !", "success");
				
				
// 				setTimeout(function(){
// 					window.location.href='handheldDevices';
// 				},2000)		
// 			}
// 		});
// 	}else{
// 		jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
//         return false;
// 	}	
// });
$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});
	
