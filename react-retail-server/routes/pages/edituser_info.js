var full_url =  (window.location.href);
var temp     =  full_url.split( '?' );

var abc = temp[1];
var temp2 = abc.split('edit_id=');

var id = temp2[1];



function Getroles(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/GetRoles",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var role = '';
            //console.log(response_data);
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
            //console.log(response_data);
            var storename = '';
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
		url: "/api/1.0.0/stockCountRecords/GetEditUserRecord",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			//console.log(response_data);

			if(response_data[0].id !== null){
                $('#user_id').val(response_data[0].id);        
            }else{
                $('#user_id').val(' ');
            }

			if(response_data[0].name !== null){
                $('#Name').val(response_data[0].name);        
            }else{
                $('#Name').val(' ');
            }

            if(response_data[0].username !== null){
                $('#UserName').val(response_data[0].username);        
            }else{
                $('#UserName').val(' ');
            }

            if(response_data[0].role_id !== null){
                 
                $('#Role option[value='+response_data[0].role_id+']').prop('selected', true);
                $('#Role').selectpicker('refresh');      
            }else{
                $('#Role').val(' ');
            }




            if(response_data[0].status !== null){
               
                $('#Status option[value='+response_data[0].status+']').prop('selected', true);
                $('#Status').selectpicker('refresh');      
            }else{
                $('#Status').val(' ');
            }

            $('#id').val(response_data[0].id)
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

            
            if(!isJson(storej) ){

                if(response_data[0].storeid !== null && response_data[0].storeid !== ''){
                    $('#StoreID option[value='+response_data[0].storeid+']').prop('selected', true);
                    $('#StoreID').selectpicker('refresh');      
                }else{
                    $('#StoreID').val(' ');
                }

             }
       
            //console.log("<><>>>>>>>>>>"+storej);


		}
	});
}
 geteditrecord();

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
        
  $(document).on('change','#Role',function(){
    var $this = $(this).val();
    var error = 0;
    if($this == 'select'){
      error=1;
      $('.error_roles').html('Please Select Roles !') 
    }else{
      $('.error_roles').html(' ')
    }
    
  }) 

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
        minlength:6,
        passwordFormatCheck:true,

      },
      roles:{
        required:true,
      },
      StoreID:{
        required:true,
      },
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
          $this.find('.error_roles').html('Please Select Roles !')               
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
                url: "/api/1.0.0/stockCountRecords/EditUserRecord",
                data:$("#SubmitEditRecord").serialize(),
                success: function(data)
                {
                    // $("#submit").html('User Update');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);

                    
                    swal("Good job!", "User Updated Successfully !", "success");
                    // swal("Update Successfully");
                        
                        
                    setTimeout(function(){
                       window.location.href='usersinfo';
                    },2000) 
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

// $('#submit').click(function(){

//     var $this = $('#SubmitEditRecord');
//     var working = false;
//     var error = 0;
// 	//$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
//     $(".error_msg").html(''); 
//     if($this.find('[name="name"]').val()==""){
//         error=1;
//         $this.find('.error_name').html('Please Enter Name !')               
//     }
//     else if($this.find('[name="name"]').val().length<6){
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



//     var number = /([0-9])/;
//     var alphabets = /([a-zA-Z])/;
//     var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

//     if($this.find('[name="password"]').val() !==""){
//         error=1;
//         $this.find('#password-strength-status').html('Please Enter password !') 

//         if($this.find('[name="password"]').val().length<6){
//             error = 1;
//             $this.find('#password-strength-status').html('You have to enter at least 6 characters !')   
//         }else if ($('#password-field').val().match(number) 
//             && $('#password-field').val().match(alphabets) 
//             && $('#password-field').val().match(special_characters)) 
//         {
//             error = 0;
//             $('#password-strength-status').removeClass();
//             $('#password-strength-status').addClass('strong-password');
//             $('#password-strength-status').html("Strong");    
        
//         }else{
//             error = 1;
//             $('#password-strength-status').removeClass();
//             $('#password-strength-status').addClass('medium-password');
//             $('#password-strength-status').html("Medium (should include alphabets, numbers and special characters.)");
//         }
//     }else{
//        $this.find('#password-strength-status').html(' ')  
//     }    


    

  


//     if($this.find('[name="status"]').val()==""){
//         error=1;
//         $this.find('.error_status').html('Please Select Status !')               
//     }else{
//         $this.find('.error_status').html(' ')
//     }

//     if($this.find('[name="StoreID"]').val()==""){
//         error=1;
//         $this.find('.error_store').html('Please Select StoreID !')               
//     }else{
//         $this.find('.error_store').html(' ')
//     }


//     if($this.find('[name="roles"]').val()==""){
//         error=1;
//         $this.find('.error_roles').html('Please Select Roles !')               
//     }else{
//         $this.find('.error_roles').html(' ')
//     }

//     if(error == 0){
//         working = true;
//         $("#submit").attr('disabled','disabled');
//         $.ajax({
//             type:'POST',
//             url: "/api/1.0.0/stockCountRecords/EditUserRecord",
//             data:$("#SubmitEditRecord").serialize(),
//             success: function(data)
//             {
//                 $("#submit").html('UPDATE');
//                 $("#submit").removeAttr('disabled');
//                 var response = JSON.parse(data);

                
//                 swal("Good job!", "User Updated Successfully !", "success");
//                 // swal("Update Successfully");
                    
                    
//                 setTimeout(function(){
//                    window.location.href='usersinfo';
//                 },2000) 
//             }
//         });    
//     }else{
//         jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
//         return false;
//     }
// });

$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});
$('#Role').selectpicker({
    noneSelectedText : 'Select Role'
});