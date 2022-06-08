var full_url =  (window.location.href);
var temp     =  full_url.split( '?' );

var abc = temp[1];
var temp2 = abc.split('run_id=');

var id = temp2[1];


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime); 
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

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

			if(response_data[0].request_name !== null){
              $('#request_name').html(response_data[0].request_name);        
            }else{
              $('#request_name').val(' ');
            }

			if(response_data[0].envoirment !== null){
                 
             	$('#envoirment').html(response_data[0].envoirment);
             	$('#envoirment22').val(response_data[0].envoirment)
                  
            }else{
                $('#envoirment').html(' ');
                $('#envoirment22').val('');
            }	

            if(response_data[0].endpoint !== null){
              $('#endpoint').val(response_data[0].endpoint);        
            }else{
              $('#endpoint').val(' ');
            }
  

            if(response_data[0].payload !== null && response_data[0].payload !== ''){
              $('#payload').val(response_data[0].payload);  
            }else{
              $('#payload').val(' ');
            }

            if(response_data[0].server_protocol !== null){
                 
             
              $('#server_protocol').val(response_data[0].server_protocol);      
            }else{
                $('#server_protocol').val(' ');
            }


		}
	});
}
geteditrecord();


$(function() {
        
  var validobj= $("#SendRetailRequest").validate({
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
    
   
    submitHandler: function(form) {
        
       var $this = $('#SendRetailRequest');
        error = 0;
        if(error == 0){
          $.ajax({
                type:'POST',
                url: "/api/1.0.0/cronjobs/RunRetailsApis",
                data:$("#SendRetailRequest").serialize(),
                success: function(data)
                {
                   
                    var response = (data);
                   
                    if(response !==''){
                      var pretty = JSON.stringify(response, undefined, 2);

                      var ugly = document.getElementById('ResultApi').value;
                      document.getElementById('ResultApi').value = pretty;
                    }
                     
                }
          });
        }  
    }
  });

 
  $.validator.addMethod("ValidationuserName", function(value, element) {
  return this.optional( element ) || /^([a-zA-Z0-9 _-]+)$/.test( value );
  }, 'Spaces and special character are not allowed !');

});