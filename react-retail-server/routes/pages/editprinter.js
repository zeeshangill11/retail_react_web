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
            $("#StoreIDD").html(storename);
            $('#StoreIDD').selectpicker('refresh');
        }
    });
}
storeName();
$('#StoreIDD').selectpicker({
    noneSelectedText : 'Select Role'
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
		url: "/api/1.0.0/stockCountRecords/GetEditPrinterRecord",
		success: function(data)
		{
		  	
            var response_data = JSON.parse(data);
			
			
			if(response_data[0].name !== null){
              
                $('#Name').val(response_data[0].name);        
            }else{
               
                $('#Name').val(' ');
            }

            if(response_data[0].port !== null){
                
                $('#port').val(response_data[0].port);        
            }else{
               
                $('#port').val(' ');
            }

            if(response_data[0].port !== null){
               
                $('#ip').val(response_data[0].ip);        
            }else{
               
                $('#ip').val(' ');
            }

			$('#id').val(response_data[0].id);
			
			if(response_data[0].remarks !== null){
               
                $('#remarks').val(response_data[0].remarks);        
            }else{
               
                $('#remarks').val(' ');
            }
            


            if(response_data[0].status !== null){
                $('#Status option[value='+response_data[0].status+']').prop('selected', true);
                $('#Status').selectpicker('refresh');
                    
            }else{
               
                $('#Status').val(' ');
            }


                var mydata = response_data[0].storeid; 
                    


                if(isJson(mydata)){
                    var json = $.parseJSON(mydata);
                        
                    let optArr = [];
                      for (var i = 0; i < json.length; i++) {
                        optArr.push(json[i]);

                        //console.log(optArr);

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

// 	var $this = $('#AddPrinterForm');
//     var working = false;
//     var error = 0;
//     //$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
// 	$(".error_msg").html('');

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

//     if($this.find('[name="remarks"]').val()==""){
//         error=1;
//         $this.find('.error_remarks').html('Please Enter Remarks !')               
//     }else{
//         $this.find('.error_remarks').html(' ')
//     }

//     if($this.find('[name="ip"]').val()==""){
//         error=1;
//         $this.find('.error_ip').html('Please Enter IP !')               
//     }else{
//         $this.find('.error_ip').html(' ')
//     }

//     if($this.find('[name="port"]').val()==""){
//         error=1;
//         $this.find('.error_port').html('Please Enter port !')               
//     }else{
//         $this.find('.error_port').html(' ')
//     }

//     if($this.find('[name="stoid"]').val()=="" || $this.find('[name="stoid"]').val()==null){
//         error=1;
//         $this.find('.error_stoid').html('Please Select Store !')               
//     }else{
//         $this.find('.error_stoid').html(' ')
//     }
    
//     if(error == 0){
// 		working = true;
// 		$("#submit").attr('disabled','disabled');
	
// 		$.ajax({
// 			type:'POST',
// 			url: "/api/1.0.0/stockCountRecords/EditPrinter",
// 			data:$("#AddPrinterForm").serialize(),
// 			success: function(data)
// 			{
// 				$("#submit").html('UPDATE');
// 				$("#submit").removeAttr('disabled');
// 				var response = JSON.parse(data);

				
// 				swal("Good job!", "Printer Updated Successfully !", "success");
				
// 			setTimeout(function(){
// 				window.location.href='printer';	
// 			},2000)
				
// 			}
// 		});
// 	}else{
// 		jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
//         return false;
// 	}
// });

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
    var validobj= $("form[name='EditPrinterForm']").validate({
    rules: {
      name:{
        required: true,
      },
      status:{
        required:true,
      },
      remarks:{
        required:true,
      },
      ip:{
        required:true,
      },
      port:{
        required:true,
      },
    },
    
    submitHandler: function(form) {

        var $this = $('#AddPrinterForm');
        var working = false;
        var error = 0;

        if($this.find('[name="stoid"]').val()=="" || $this.find('[name="stoid"]').val()==null 
            || $this.find('[name="stoid"]').val()=='select'){
            error=1;
            $this.find('.error_stoid').html('Please Select Store !')               
        }else{
            $this.find('.error_stoid').html(' ')
        }
        if(error == 0){
            working = true;
            $.ajax({
                type:'POST',
                url: "/api/1.0.0/stockCountRecords/EditPrinter",
                data:$("#AddPrinterForm").serialize(),
                success: function(data)
                {
                    $("#submit").html('UPDATE');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);


                    swal("Good job!", "Printer Updated Successfully !", "success");

                    setTimeout(function(){
                    window.location.href='printer'; 
                    },2000)

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