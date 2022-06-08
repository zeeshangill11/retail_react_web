$(function() {
        
  var validobj= $("form[name='registration']").validate({
    rules: {
      request_name:{
        required: true,
      },
      username:{
        required: true,
        minlength: 6,
        ValidationuserName:true,
      },
      envoirment:{
        required:true,
      },
      endpoint:{
        required:true,
      },
      server_protocol:{
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
                url: "/api/1.0.0/stockCountRecords/addretailapi",
                data:$("#SubmitRecord").serialize(),
                success: function(data)
                {
                    $("#submit").html('Add Retail Api');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);
                    
                    var response = JSON.parse(data);
                    
                 

                    swal("Good job!", "Retail Api Added Successfully !", "success");
                    
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



var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

