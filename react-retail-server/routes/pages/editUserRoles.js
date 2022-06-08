	var full_url =  (window.location.href);
    var temp     =  full_url.split( '?' );

	var abc = temp[1];
	var temp2 = abc.split('edit_id=');

	var id = temp2[1];
	

	$('.inner_pages input').change(function(){

		if ($(this).prop('checked')) {
			
		    $(this).parents('li').find("input").prop('checked',true)
		    $(this).parents('li').find("input").prop('checked',true)
		} else {
		    $(this).parents('li').find("input").prop('checked',false)
		    $(this).parents('li').find("input").prop('checked',false)
		}
	})

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
// Delete Record..
function geteditrecord(){

	$.ajax({
		type:'POST',
		data:{
            "edit_id":id,
        },
		url: "/api/1.0.0/stockCountRecords/GetEditRolesRecord",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			//console.log(response_data);

			if(response_data[0].role_name !== null){
                
                $('#RoleName').val(response_data[0].role_name);        
            }else{
               
                $('#RoleName').val(' ');
            }


            $('#Id').val(response_data[0].role_id);
            
            var mydata = response_data[0].user_permission; 
            var data = response_data[0].user_permission;


          
            $("input[value='"+data+"']").attr("checked", "checked");


           
        	

        	
        	if(isJson(mydata)){
	    		var json = $.parseJSON(mydata);
	    		//console.log(json);
				for(i=0 ; i<json.length; i++){
					$("input[value='"+json[i]+"']").attr("checked", "checked");	
				}	
        	}
	        	
		}
	});
}
 geteditrecord();

 $('#submit').click(function(){
 	var $this = $('#UserGroupsForm');
 	var working = false;
 	var error = 0;

 	$(".error_msg").html('');
	//$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
	
	
	if($this.find('[name="RoleName"]').val()==""){
		error=1;
		$this.find('.RoleName_error').html('Please Enter Role !')				
	}else{
		$this.find('.RoleName_error').html(' ')
	}

	// if($this.find('[name="SoteID"]').val()==""){
	// 	error=1;
	// 	$this.find('.SoteID_error').html('Please Select Role !')				
	// }else{
	// 	$this.find('.SoteID_error').html(' ')	
	// }

	if(($("input[name*='user_permission']:checked").length)<=0){	
		error=1;
		$this.find('.user_permission_error').html('Please Chose Permission !')					
	}else{
		$this.find('.user_permission_error').html(' ')
	}

	// if($this.find('[name="CreatedDate"]').val()==""){
		
	// 	error=1;
	// 	$this.find('.CreatedDate_error').html('Please Select Date !')					
	// }else{
	// 	$this.find('.CreatedDate_error').html(' ')
	// }

	if(error == 0){
		working = true;
		$("#submit").attr('disabled','disabled');
		$.ajax({
			type:'POST',
			url: "/api/1.0.0/stockCountRecords/EditRoles",
			data:$("#UserGroupsForm").serialize(),
			success: function(data)
			{
				$("#submit").html('UPDATE');
				$("#submit").removeAttr('disabled');
				var response = JSON.parse(data);
				
				swal("Good job!", "Role Updated SuccessFully !", "success"); 
				
				
				setTimeout(function(){
					window.location.href='UserRoles';
				},2000)		
			}
		});	
	}else{
		jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
		return false;
	}	
});