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
                storename += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#StoreIDD").html(storename);
            $('#StoreIDD').selectpicker('refresh');
        }
    });
}
storeName();

function getUserData(){
 
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getUserData",
        success: function(data)
        {
           
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var Type = '';
            Type += '<option value="">Restrict User</option>';
            for(var i = 0; i < response_data.length; i++){
                Type += '<option value="'+response_data[i].id+'">'+response_data[i].username+'</option>';                   
            }
            $("#restrict_user").html(Type);
            $('#restrict_user').selectpicker('refresh'); 
        }
    });
}
getUserData();

$('#StoreIDD').selectpicker({
    noneSelectedText : 'Select Store'
});

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
		url: "/api/1.0.0/stockCountRecords/GetEditZip",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			//console.log(response_data);

			if(response_data[0].name !== null){
                $('#Name').val(response_data[0].name);        
            }else{
                $('#Name').val(' ');
            }

            if(response_data[0].remarks !== null){
                $('#remarks').val(response_data[0].remarks);        
            }else{
                $('#remarks').val(' ');
            }

            if(response_data[0].zpl !== null){
                $('#zpl').val(response_data[0].zpl);        
            }else{
                $('#zpl').val(' ');
            }
 	        setTimeout(function(){
                if(response_data[0].status !== null){

                    $('#Status option[value='+response_data[0].status+']').prop('selected', true);
                    $('#Status').selectpicker('refresh');      
                }else{
                    $('#Status').val(' ');
                }
            },2000);
            setTimeout(function(){

                if(response_data[0].restrict_user !== null){
                    var restrict_user2 = response_data[0].restrict_user; 
                    restrict_user2 = JSON.parse(restrict_user2);
                    for(var k=0; k<restrict_user2.length; k++)
                    {
                        $('#restrict_user option[value='+restrict_user2[k]+']').prop('selected', true);
                    }
                    
                    $('#restrict_user').selectpicker('refresh');      
                }else{
                    $('#restrict_user').val(' ');
                }

            },2000);
            

                $('#ID').val(response_data[0].id);


            	var mydata = response_data[0].storeid; 
                    


                if(isJson(mydata)){
                    var json = $.parseJSON(mydata);
                        
                    let optArr = [];
                    for (var i = 0; i < json.length; i++) {
                        optArr.push(json[i]);
                    }
                 
                  $('#StoreIDD').selectpicker('val', optArr);
                  $('#StoreIDD').selectpicker('refresh');
                }else{
                    if(response_data[0].storeid !== null){ 
                        $('#StoreIDD option[value='+response_data[0].storeid+']').prop('selected', true);
                        $('#StoreIDD').selectpicker('refresh');      
                    }else{
                        $('#StoreIDD').val(' ');
                    } 
                } 
                 
                

                
			      

				
            
		}
	});
}
 geteditrecord();

// $('#submit').click(function(){

// 	var $this = $('#AddZPLForm');
//     var working = false;
//     var error = 0;
// 	//$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');

// 	if($this.find('[name="name"]').val()==""){
//         error=1;
//         $this.find('.error_name').html('Please Enter Name !')               
//     }else{
//         $this.find('.error_name').html(' ')
//     }

//     if($this.find('[name="status"]').val()==""){
//         error=1;
//         $this.find('.error_status').html('Please Select Status !')               
//     }else{
//         $this.find('.error_status').html(' ')
//     }
//     if($this.find('[name="StoreIDD"]').val()=="" || $this.find('[name="StoreIDD"]').val()==null){
//         error=1;
//         $this.find('.error_stoid').html('Please Select Store !')               
//     }else{
//         $this.find('.error_stoid').html(' ')
//     }

//     if($this.find('[name="remarks"]').val()==""){
//         error=1;
//         $this.find('.error_remarks').html('Please Select Store!')               
//     }else{
//         $this.find('.error_remarks').html(' ')
//     }

//     if($this.find('[name="zpl"]').val()==""){
//         error=1;
//         $this.find('.error_zpl').html('Please Enter ZPL!')               
//     }else{
//         $this.find('.error_zpl').html(' ')
//     }


// 	if(error == 0){
// 		working = true;
// 		$("#submit").attr('disabled','disabled');
// 		$.ajax({
// 			type:'POST',
// 			url: "/api/1.0.0/stockCountRecords/EditZpl",
// 			data:$("#AddZPLForm").serialize(),
// 			success: function(data)
// 			{
// 				$("#submit").html('UPDATE');
// 				$("#submit").removeAttr('disabled');
// 				var response = JSON.parse(data);
				    
//                 swal("Good job!", "ZPL Updated Successfully !", "success");    
				
				
							
// 				setTimeout(function(){
// 					window.location.href='zpl';
// 				},2000)			
// 			}
// 		});
// 	}else{
// 		jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
//         return false;
// 	}	
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

$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});

$(function() {
    $(document).on('change','#StoreIDD',function(){
        var $this = $(this).val();
       
        var error = 0;
        if($this == 'select'){
          error=1;
          $('.error_stoid').html('Please Select Store !') 
        }else{
          $('.error_stoid').html(' ')
        }
    })
    var validobj= $("#AddZPLForm").validate({
    rules: {
      name:{
        required: true,
      },
      zpl:{
        required:true,
      },
      remarks:{
        required:true,
      },
      status:{
        required:true,
      },
    },
    
    submitHandler: function(form) {

        var $this = $('#AddZPLForm');
        var working = false;
        var error = 0;
        // alert($this.find('[name="StoreIDD"]').val());
        if($this.find('[name="StoreIDD"]').val()=="" || $this.find('[name="StoreIDD"]').val()==null 
            || $this.find('[name="StoreIDD"]').val()=='select' || $this.find('[name="StoreIDD"]').val() == undefined){
            error=1;
            $this.find('.error_stoid').html('Please Select Store !')               
        }else{
            $this.find('.error_stoid').html(' ')
        }
        if(error == 0){
            working = true;
            $.ajax({
                type:'POST',
                url: "/api/1.0.0/stockCountRecords/EditZpl",
                data:$("#AddZPLForm").serialize(),
                success: function(data)
                {
                    $("#submit").html('UPDATE');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);

                    swal("Good job!", "ZPL Updated Successfully !", "success");    



                    setTimeout(function(){
                    window.location.href='zpl';
                    },2000)         
                }
            });
        }  
    }
  });
});