// $('#submit').click(function(){

// 	var $this = $('#AddPrinterForm');
//     var working = false;
//     var error = 0;

// 	//$("#submit").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
// 	$(".error_msg").html('');

// 	if($this.find('[name="name"]').val()==""){
//         error=1;
//         $this.find('.error_name').html('Please Enter Name !');          
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

// 	if(error == 0){
// 		working = true;
// 		$("#submit").attr('disabled','disabled');
// 		$.ajax({
// 			type:'POST',
// 			url: "/api/1.0.0/stockCountRecords/AddPrinter",
// 			data:$("#AddPrinterForm").serialize(),
// 			success: function(data)
// 			{
// 				$("#submit").html('SUBMIT');
// 				$("#submit").removeAttr('disabled');
// 				var response = JSON.parse(data);
				
// 				swal("Good job!", "Printer Added Successfully !", "success");

// 				setTimeout(function(){
// 					window.location.href="printer";	
// 				},2000)	
// 			}
// 		});
// 	}else{
// 		jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
//         return false;
// 	}	
// });
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
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();

$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
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

$(function() {
    $(document).on('change','#StoreID',function(){
        var $this = $(this).val();
       
        var error = 0;
        if($this == 'select'){
          error=1;
          $('.error_stoid').html('Please Select Store !') 
        }else{
          $('.error_stoid').html(' ')
        }
    }) 

    var validobj= $("form[name='AddPrinterForm']").validate({
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
                url: "/api/1.0.0/stockCountRecords/AddPrinter",
                data:$("#AddPrinterForm").serialize(),
                success: function(data)
                {
                    $("#submit").html('SUBMIT');
                    $("#submit").removeAttr('disabled');
                    var response = JSON.parse(data);

                    swal("Good job!", "Printer Added Successfully !", "success");

                    setTimeout(function(){
                    window.location.href="printer"; 
                    },2000) 
                }
            });

            
        }
        
    }
  });
});

