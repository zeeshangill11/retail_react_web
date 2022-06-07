$(function() {
 
  $("form[name='registration']").validate({
    // Specify validation rules
    rules: {
      skucode:"required",
      product_des:"required" ,
      item_code:"required" ,
      user:"required" ,
      departmentid:"required" ,
      brand:"required" ,
      color:"required" ,
      size:"required" ,
      group_name:"required" ,
      group_description:"required" ,
      departmentname:"required" ,
      ean_no:"required" ,
      sp_net:"required" ,
      season:"required" ,
      vat:"required" ,
      sales_area:"required" ,
      sp_gross_eng:"required" ,
      sp_gross_arb:"required" ,
      supplier_item_no:"required" ,
      supplier_name:"required" ,
      type_no:"required" ,
      arabic_desc:"required",
      origin:"required" ,
      english_desc:"required" ,
      company:"required" ,
      currency:"required" ,
      cost:"required" ,
      image_url:"required" ,
      style:"required" ,
      country:"required" ,
      supplier_no:"required" ,
      po_supplier_no:"required" 

    },
    
   
    submitHandler: function(form) {
      var error = 0;
      var $this = $("[name='registration']");
      $.ajax({
         type:'POST',
         url: "/api/1.0.0/stockCountRecords/AddProduct_item_master",
         data:$("#AddProductForm").serialize(),
         success: function(data)
         {
              $("#submit").html('Add product');
              $("#submit").removeAttr('disabled');
              var response = JSON.parse(data);
                
              var error_handling = response.error22  

              
             
              
              if(error_handling !=='' && error_handling !== undefined){
                
                var sku_error = error_handling.sku_error;
                var ean_error = error_handling.ean_error;
                
                if(sku_error !== '' && sku_error!== undefined){
                  error = 1;
                  $this.find('.skucode_error').html(sku_error);
                }else{
                  $this.find('.skucode_error').html('');    
                }


                if(ean_error !== '' && ean_error!== undefined){
                  error = 1;
                  $this.find('.error_ean_no').html(ean_error);
                }else{
                  $this.find('.error_ean_no').html('');    
                }

              }
             

              if(error == 0){

                swal("Good job!", "Insert SuccessFully!", "success");
                
                setTimeout(function(){
                    window.location.href='product_item_master';
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
