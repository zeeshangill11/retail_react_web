var full_url =  (window.location.href);
var temp     =  full_url.split( '?' );

var abc = temp[1];
var temp2 = abc.split('edit_id=');

var id = temp2[1];


function geteditrecord(){
	
	$.ajax({
		type:'POST',
		data:{
            "edit_id":id,
        },
		url: "/api/1.0.0/inventoryData/GetEditRetailApi",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			//console.log(response_data);

			if(response_data[0].id !== null){
              $('#Retail_id').val(response_data[0].id);        
            }else{
              $('#Retail_id').val(' ');
            }

			if(response_data[0].request_name !== null){
              $('#request_name').val(response_data[0].request_name);        
            }else{
              $('#request_name').val(' ');
            }

            if(response_data[0].endpoint !== null){
              $('#endpoint').val(response_data[0].endpoint);        
            }else{
              $('#endpoint').val(' ');
            }

            if(response_data[0].envoirment !== null){
                 
              $('#envoirment option[value='+response_data[0].envoirment+']').prop('selected', true);
              $('#envoirment').selectpicker('refresh');      
            }else{
                $('#envoirment').val(' ');
            }

            if(response_data[0].server_protocol !== null){
                 
              $('#server_protocol option[value='+response_data[0].server_protocol+']').prop('selected', true);
              $('#server_protocol').selectpicker('refresh');      
            }else{
                $('#server_protocol').val(' ');
            }

          

            if(response_data[0].payload !== null && response_data[0].payload !== ''){
              $('#payload').val(response_data[0].payload);  
            }else{
              $('#payload').val(' ');
            }

           
       
            //console.log("<><>>>>>>>>>>"+storej);


		}
	});
}
 geteditrecord();


$(function() {
        
  var validobj= $("form[name='registration']").validate({
    rules: {
      request_name:{
        required: true,
      },
      envoirment:{
        required:true,
      },
      endpoint:{
        required:true,
      },
      payload:{
        required:true,
      },
    },
    
    messages: {
      
      name:{
        minlength: "Request name should be at least 6 characters "
      },
    }, 

    submitHandler: function(form) {
        
       var $this = $('#SubmitRecord');
        error = 0;
        if($this.find('[name="envoirment"]').val()=="" || $this.find('[name="envoirment"]').val()=="select"){
          error=1;
          
          $this.find('.error_envoirment').html('Please Select Envoirment !')               
        }else{
          $this.find('.error_envoirment').html(' ')
        }

        if($this.find('[name="server_protocol"]').val()=="" || $this.find('[name="server_protocol"]').val()=="select"){
          error=1;

          $this.find('.error_server_protocol').html('Please Select Protocol !')               
        }else{
          $this.find('.error_server_protocol').html(' ')
        }

        
        if(error == 0){
          $.ajax({
                type:'POST',
                url: "/api/1.0.0/stockCountRecords/EditRetailApi",
                data:$("#SubmitRecord").serialize(),
                success: function(data)
                {
                    $("#submit").html('Edit Retail Api');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);
                    
                    var response = JSON.parse(data);
                  

                    swal("Good job!", "Retail Api Edit Successfully !", "success");
                    
                    setTimeout(function(){
                        window.location.href='RetailApis';
                    },2000)
                     
                }
          });
        }  
    }
  });

 
  $.validator.addMethod("ValidationuserName", function(value, element) {
  return this.optional( element ) || /^([a-zA-Z0-9 _-]+)$/.test( value );
  }, 'Spaces and special character are not allowed !');

});


