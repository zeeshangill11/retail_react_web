function Getroles(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/GetRoles",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var role = '';
           // console.log(response_data);
            role += '<option value="select">Select Role</option>';
            for(var i = 0; i < response_data.length; i++){
                role += '<option value="'+response_data[i].role_id+'" role_id="'+response_data[i].role_id+'" role_name="'+response_data[i].role_name+'">'+response_data[i].role_name+'</option>';                   
            }
            $("#Role").html(role);
            $('#Role').selectpicker('refresh');

        }
    });
}
Getroles();


function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="select">Select Store</option>' 
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                   
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');

            //  setTimeout(function (){
               
            //     $('#StoreID[name=selValue]');
            //     $('#StoreID').selectpicker('refresh');

            // },500);
        }
    });
}
storeName();

$(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
   
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});


$(function() {
        
  $(document).on('keyup','#UserName',function(){
    var $this = $(this);
      if($this !==''){
        $('.UserName_error').html('');
      }
  })      
  // $("#StoreID").on("change",function (){
  //   // $(this).find('value[0]').prop("selected", false)
  //   alert($(this).find('value[0]'));
  //   if($(this).find('value[0]')){
  //     $(this).find('.dropdown-menu').children('a').removeClass('selected');
  //   }
    

  // });    
  $(document).on('change','#StoreID',function(){
    var $this = $(this).val();
    var error = 0;
    if($this == 'select'){
      error=1;
      $('.error_store').html('Please Select Store !') 
    }else{
      $('.error_store').html(' ')
    }
    
  })

  $(document).on('change','#Role',function(){
    var $this = $(this).val();
    var error = 0;
    if($this == 'select'){
      error=1;
      $('.error_roles').html('Please Select Role !') 
    }else{
      $('.error_roles').html(' ')
    }
    
  })   

  var validobj= $("form[name='registration']").validate({
    rules: {
      name:{
        required: true,
        minlength: 6,
        ValidationuserName:true
      },
      username:{
        required: true,
        minlength: 6,
        ValidationuserName:true,
      },
      password:{
        required:true,
        minlength:6,
        passwordFormatCheck:true,

      }
    },
    
    messages: {
      
      name:{
        minlength: "Name should be at least 6 characters "
      },
      username:{
        minlength: "User name should be at least 6 characters "
      },
      password:{
        minlength: "You have to enter at least 6 characters !"
      }
    }, 

    submitHandler: function(form) {
        
        var $this = $('#SubmitRecord');
        error = 0;
        if($this.find('[name="roles"]').val()=="" || $this.find('[name="roles"]').val()=="select"){
          error=1;
          $this.find('.error_roles').html('Please Select Role !')               
        }else{
          $this.find('.error_roles').html(' ')
        }

        if($this.find('[name="StoreID"]').val()=="" || $this.find('[name="StoreID"]').val()=="select"){
          error=1;
          $this.find('.error_store').html('Please Select Store !')               
        }else{
          $this.find('.error_store').html(' ')
        }
        
        if(error == 0){
          $.ajax({
                type:'POST',
                url: "/api/1.0.0/stockCountRecords/AddUser",
                data:$("#SubmitRecord").serialize(),
                success: function(data)
                {
                    $("#submit").html('Add');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);
                    
                    var response = JSON.parse(data);
                    
                    var username_error = response.error22  
                    if(username_error !== '' && username_error!== undefined){
                        $this.find('.UserName_error').html(username_error);
                    }else{


                        swal("Good job!", "User Added Successfully !", "success");
                    
                        setTimeout(function(){
                            window.location.href='usersinfo';
                        },2000)
                    } 
                }
          });
        }  
    }
  });

 
    $.validator.addMethod("ValidationuserName", function(value, element) {
    return this.optional( element ) || /^([a-zA-Z0-9 _-]+)$/.test( value );
    }, 'Spaces and special character are not allowed !');

    $.validator.addMethod("passwordFormatCheck", function(value, element) {
    return this.optional(element) || /^(?=.*\d)(?=.*[A-Z])(?=.*\W).*$/i.test(value);
    }, 'Password must contain one capital letter,one numerical and one special character');

  

});
$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});
$('#Role').selectpicker({
    noneSelectedText : 'Select Role'
});

// $('#submit').click(function(){

//     var $this = $('#SubmitRecord');
//     var working = false;
//     var error = 0;
//  //$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
//     $(".error_msg").html('');
//     if($this.find('[name="name"]').val()==""){
//         error=1;
//         $this.find('.error_name').html('Please Enter Name !')               
//     }else if($this.find('[name="name"]').val().length<6){
//         $this.find('.error_name').html('Name must be atleast 6 characters long !')
//         error = 1;
//     }else if ($this.find('[name="name"]').val().length>16){
//         $this.find('.error_name').html('Name must be less 16 characters long !')
//         error = 1;
//     }else{
//         $this.find('.error_name').html(' ')
//     }

//     if($this.find('[name="username"]').val()==""){
//         error=1;
//         $this.find('.error_username').html('Please Enter Username !')               
//     }
//     else if(/[^a-zA-Z0-9\-\/]/.test($this.find('[name="username"]').val())){
//         error = 1;
//         $this.find('.error_username').html('No Spaces & Special Character Are Not Allowed !')
//     }else if($this.find('[name="username"]').val().length<6){
//         $this.find('.error_username').html('Username must be atleast 6 characters long !')
//         error = 1;
//     }else if ($this.find('[name="username"]').val().length>16){
//         $this.find('.error_username').html('Username must be less 16 characters long !')
//         error = 1;
//     }else{
//         $this.find('.error_username').html(' ')
//     }

    

//     if($this.find('[name="status"]').val()==""){
//         error=1;
//         $this.find('.error_status').html('Please Select Status !')               
//     }else{
//         $this.find('.error_status').html(' ')
//     }

//     if($this.find('[name="roles"]').val()==""){
//         error=1;
//         $this.find('.error_roles').html('Please Select Roles !')               
//     }else{
//         $this.find('.error_roles').html(' ')
//     }

    // var number = /([0-9])/;
    // var alphabets = /([a-zA-Z])/;
    // var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

    // if($this.find('[name="password"]').val()==""){
    //     error=1;
    //     $this.find('#password-strength-status').html('Please Enter password !')               
    // }else if($this.find('[name="password"]').val().length<6){
    //     error = 1;
    //     $this.find('#password-strength-status').html('You have to enter at least 6 characters !')  
    // }else if ($('#password-field').val().match(number) 
    //         && $('#password-field').val().match(alphabets) 
    //         && $('#password-field').val().match(special_characters)) 
    // {
    //     error = 0;
    //     $('#password-strength-status').removeClass();
    //     $('#password-strength-status').addClass('strong-password');
    //     $('#password-strength-status').html("Strong");    
        
    // }else{
    //     error = 1;
    //     $('#password-strength-status').removeClass();
    //     $('#password-strength-status').addClass('medium-password');
    //     $('#password-strength-status').html("Medium (should include alphabets, numbers and special characters.)");
    // }
   

//     if($this.find('[name="StoreID"]').val()==""){
//         error=1;
//         $this.find('.error_store').html('Please Select Store !')               
//     }else{
//         $this.find('.error_store').html(' ')
//     }

//     if(error == 0){
//         working = true;
//         $("#submit").attr('disabled','disabled');
//         $.ajax({
//             type:'POST',
//             url: "/api/1.0.0/stockCountRecords/AddUser",
//             data:$("#SubmitRecord").serialize(),
//             success: function(data)
//             {
//                 $("#submit").html('Add');
//                 $("#submit").removeAttr('disabled');
//                 var response = JSON.parse(data);
                
//                 var response = JSON.parse(data);
                
//                 var username_error = response.error22  
//                 if(username_error !== '' && username_error!== undefined){
//                     $this.find('.UserName_error').html(username_error);
//                 }else{


//                     swal("Good job!", "User Added Successfully !", "success");
                
//                     setTimeout(function(){
//                         window.location.href='usersinfo';
//                     },2000)
//                 }
               
                    
                    
                
//             }
//         });    
//     }else{
//         jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
//         return false;
//     }
// });

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

