$('#submit').click(function(){

	var working = false;
	var $this = $('#UserGroupsForm');
	var error = 0;
	

    $(".error_msg").html('');
    //$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');	

	if($this.find('[name="RoleName"]').val()==""){
		error=1;
		$this.find('.RoleName_error').html('Please Enter Role !')				
	}else{
		$this.find('.RoleName_error').html(' ')
	}

	

	if(($("input[name*='user_permission']:checked").length)<=0){	
		error=1;
		$this.find('.user_permission_error').html('Please Chose Permission !')					
	}else{
		$this.find('.user_permission_error').html(' ')
	}

	



	if(error == 0){
		working = true;
		$("#submit").attr('disabled','disabled');
			$.ajax({
				type:'POST',
				url: "/api/1.0.0/stockCountRecords/AddUserRole",
				data:$("#UserGroupsForm").serialize(),
				success: function(data)
				{
					$("#submit").html('SUBMIT');
					$("#submit").removeAttr('disabled');
					var response = JSON.parse(data);
					//console.log(response);
					
					swal("Good job!", "Role Added Successfully !", "success"); 
					
					
					setTimeout(function(){
						window.location.href="UserRoles";
					},2000);
				}
			});
					
		}else{

			jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");

			return false;
		}	

});

	// $('#Home').change(function () {
	//     $('.home_inner').prop('checked',this.checked);
	// });
	// $('.home_inner').change(function () {
	  
	// if ($('.home_inner:checked').length == $('.home_inner').length){
	//   $('#Home').prop('checked',true);
	//  }
	//  else {
	//   $('#Home').prop('checked',false);
	//  }
	// });


	// $('#Users').change(function () {
	//     $('.inner_users').prop('checked',this.checked);
	// });

	// $(document).on('change','.inner_users',function () {
	// 	// $('#Users').change(function (){
	// 	//$('.admin_check').check();
	// 	//$('#Users').prop('checked',true);
	// 	 $('.admin_check').prop('checked',true);
	// 	//$(":checkbox").check();
	// 	// });

	//  if ($('.inner_users:checked').length == $('.inner_users').length){
	//   $('#Users').prop('checked',true);
	//  }
	//  else {
	//   $('#Users').prop('checked',false);
	//  }
	// });

	// $('#Count').change(function () {
	//     $('.count_inner').prop('checked',this.checked);
	// });

	$('.inner_pages input').change(function(){
		if ($(this).prop('checked')) {
			
		    $(this).parents('li').find("input").prop('checked',true)
		    $(this).parents('li').find("input").prop('checked',true)
		} else {
		    $(this).parents('li').find("input").prop('checked',false)
		    $(this).parents('li').find("input").prop('checked',false)
		}
	})

	


	



	// $('#Tagit').change(function () {
	//     $('.inner_zplprinter').prop('checked',this.checked);
	// });

	// $('.inner_zplprinter').change(function () {
	// 	$('.hidden_zplprinter').prop('checked',true);
	//  if ($('.inner_zplprinter:checked').length == $('.inner_zplprinter').length){
	//   $('#Tagit').prop('checked',true);
	//  }
	//  else {
	//   $('#Tagit').prop('checked',false);
	//  }
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
                storename += '<option value="'+response_data[i].storeid+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();
// Delete Record..
