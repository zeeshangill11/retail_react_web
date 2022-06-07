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
                storename += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
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
      Password:{
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
                url: "/api/1.0.0/stockCountRecords/AddHandHeldDevice",
                data:$("#AddDeviceForm").serialize(),
                success: function(data)
                {
                    //$("#submit").html('SUBMIT');
                    //$("#submit").removeAttr('disabled');
                     var response = JSON.parse(data);
                    
                    var username_error = response.error22  
                    if(username_error !== '' && username_error!== undefined){
                        $this.find('.UserName_error').html(username_error);
                    }else{
                        
                        swal("Good job!", "Device Added Successfully !", "success");
                       
                        setTimeout(function(){
                            window.location.href="handheldDevices";
                        },2000);
                    }   
                   
                }
            });  
        }   
    }


  });

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


	
	
	
	
// $('#submit').click(function(){

//     var working = false;
//     var $this = $('#AddDeviceForm');
//     var error = 0;
    

    
//    // $("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
//     $(".error_msg").html('');

//     if($this.find('[name="UserName"]').val()==""){
//         error=1;
//         $this.find('.UserName_error').html('Please Enter UserName !')               
//     }else{
//         $this.find('.UserName_error').html(' ')
//     }

//     if($this.find('[name="Password"]').val()==""){
//         error=1;
//         $this.find('.Password_error').html('Please Enter Password !')               
//     }else{
//         $this.find('.Password_error').html(' ')
//     }

//     if($this.find('[name="DeviceID"]').val()==""){
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

//     if($this.find('[name="Description"]').val()==""){
//         error=1;
//         $this.find('.error_Description').html('Please Enter Description !')               
//     }else{
//         $this.find('.error_Description').html(' ')
//     }
//     if($this.find('[name="StoreID"]').val()=="" || $this.find('[name="StoreID"]').val()==null){
//         error=1;
//         $this.find('.error_StoreID').html('Please Select Store ID !')               
//     }else{
//         $this.find('.error_StoreID').html(' ')
//     }

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
            
//     if(error == 0){
//         working = true;
//         //$("#submit").attr('disabled','disabled');
//         var form=$("#AddDeviceForm");
//         $.ajax({
//             type:'POST',
//             url: "/api/1.0.0/stockCountRecords/AddHandHeldDevice",
//             data:form.serialize(),
//             success: function(data)
//             {
//                 //$("#submit").html('SUBMIT');
//                 //$("#submit").removeAttr('disabled');
//                  var response = JSON.parse(data);
                
//                 var username_error = response.error22  
//                 if(username_error !== '' && username_error!== undefined){
//                     $this.find('.UserName_error').html(username_error);
//                 }else{
                    
//                     swal("Good job!", "Device Added Successfully !", "success");
                   
//                     setTimeout(function(){
//                         window.location.href="handheldDevices";
//                     },2000);
//                 }
               
                
               
//             }
//         });
                    
//         }else{

//             jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");

//             return false;
//         }   

// });