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
        url: "/api/1.0.0/stockCountRecords/GetEditStoreRecord",
        success: function(data)
        {
            
            var response_data = JSON.parse(data);
            
            //console.log(response_data);
            if(response_data[0].storename !== null){
              
                $('#StoreName').val(response_data[0].storename);        
            }else{
               
                $('#StoreName').val(' ');
            }

            if(response_data[0].store_location !== null){
                
                $('#StoreLocation').val(response_data[0].store_location);        
            }else{
               
                $('#StoreLocation').val(' ');
            }

            if(response_data[0].lat_lng !== null){
               
                $('#LatLng').val(response_data[0].lat_lng);        
            }else{
               
                $('#LatLng').val(' ');
            }

            $('#id').val(response_data[0].storeid);
            
            if(response_data[0].store_country !== null){
               
                $('#CountryName').val(response_data[0].store_country);        
            }else{
               
                $('#CountryName').val(' ');
            }

            if(response_data[0].store_company !== null){
               
                $('#Company').val(response_data[0].store_company);        
            }else{
               
                $('#Company').val(' ');
            }
            


            if(response_data[0].status !== null){
                $('#Status option[value='+response_data[0].status+']').prop('selected', true);
                $('#Status').selectpicker('refresh');
                    
            }else{
               
                $('#Status').val(' ');
            }
          
            if(response_data[0].  store_type !== null){
              $('#store_type option[value='+response_data[0].store_type+']').prop('selected', true);
              $('#store_type').selectpicker('refresh');
                    
            }else{
               
              $('#Status').val(' ');
            }          
        }
    });
}
geteditrecord();

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
        
        $.ajax({
         type:'POST',
         url: "/api/1.0.0/stockCountRecords/EditStore",
         data:$("#AddStoreForm").serialize(),
         success: function(data)
         {
             $("#submit").html('SUBMIT');
             $("#submit").removeAttr('disabled');
             var response = JSON.parse(data);

             swal("Good job!", "Store Updated Successfully !", "success");
                
                
             setTimeout(function(){
                 window.location.href='storeinfo';
             },2000)     
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
	
