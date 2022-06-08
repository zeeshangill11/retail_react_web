$(function() {
 
  $("form[name='registration']").validate({
    // Specify validation rules
    rules: {
      StoreName: {
        required: true,
        ValidationStoreName:true
      },
      status:"required",
      StoreLocation:"required",
      LatLng:"required",
      CountryName:"required",
      Company:"required"

    },
    
    messages: {
      
      status:"Please Select Status !",
      StoreLocation:"Please Enter Store Location !",
      LatLng:"Please Add Lat Long !",
      CountryName:"Please Enter Country name !",
      Company:"Please Enter Company name !"
      
    }, 
    submitHandler: function(form) {
      var $this = $("[name='registration']");
      $.ajax({
         type:'POST',
         url: "/api/1.0.0/stockCountRecords/AddStore",
         data:$("#AddStoreForm").serialize(),
         success: function(data)
         {
             $("#submit").html('Add Store');
             $("#submit").removeAttr('disabled');
             var response = JSON.parse(data);
                
             var storename_error = response.error22  
                if(storename_error !== '' && storename_error!== undefined){
                    $this.find('.StoreName_error').html(storename_error);
                }else{

                    swal("Good job!", "Store Added Successfully !", "success");
                
                    setTimeout(function(){
                        window.location.href='storeinfo';
                    },2000)     
                }

               
         }
        });
    }
  });
 
  jQuery.validator.addMethod("ValidationStoreName", function(value, element) {
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
