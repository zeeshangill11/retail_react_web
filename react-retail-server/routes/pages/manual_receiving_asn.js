$(document).ready(function(){

	var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

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
            $("#storename").html(storename);
            $('#storename').selectpicker('refresh');

            $("#retail_bizlocation").html(storename);
            $('#retail_bizlocation').selectpicker('refresh');
        }
    });
}
storeName();

$('#storename').selectpicker({
    noneSelectedText : 'Select'
});

$('#retail_bizlocation').selectpicker({
    noneSelectedText : 'Select'
});
//#EpcReceive_checkall
$(document).on('change','#EpcReceive_checkall',function () {
    $('.EpcReceive').prop('checked',this.checked);
});
//.EpcReceive
$(document).on('change','.EpcReceive',function () {
  
if ($('.EpcReceive:checked').length == $('.EpcReceive').length){
  $('#EpcReceive_checkall').prop('checked',true);
 }
 else {
  $('#EpcReceive_checkall').prop('checked',false);
 }
});


$('#GetDetails').click(function(){

	var working = false;
	
	var error = 0;
	

    $(".error_msg").html('');
    //$("#GetDetails").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');	

	if($('[name="asn"]').val()==""){
		error=1;
		$('.ASN_error').html('Please Enter IBT !')				
	}else{
		$('.ASN_error').html(' ')
	}

	if ($('[name="storename"]').val() == "" 
        || $('[name="storename"]').val() == null ||
        $('[name="storename"]').val() == 'select') {
        error = 1;
        $('.storename_error22').html('Please Select !')
    } else {
        $('.storename_error22').html(' ')
    }

   

    //storename
    //retail_bizlocation


	if(error == 0){
		working = true;
		
		$("#GetDetails").attr('disabled','disabled');
		//$("#GetDetails").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');	
		$(".waiting").show();
			$.ajax({
				type:'POST',
				url: "/api/1.0.0/inventoryData/GetASNDetailsReceiveingAPI",
				data:{
					asn:$('#asn').val(),
					store:$('#storename').val()
				},
				success: function(data)
				{
					$(".waiting").hide();
					$("#GetDetails").removeAttr('disabled');
					var response = JSON.parse(data);



					if(response == 'No result found'){

						$('#ECPLIST').html('<span>No result found</span>');
					
					}else{

					var epc = '';	
	                epc +=	'<table class="table table-striped">'+
                          '<thead>'+
                             
                            '<th><input type="checkbox" id="EpcReceive_checkall"> Check All</th>'+
                            '<th>Epc</th>'+
                             
	                        '</thead>'+
	                         '<tbody>'

		                $.each(response,function(index,value){
		                	
                        epc +=  "<tr>"+
                                "<td><input type='checkbox' id='EpcReceive' class='EpcReceive' name='EpcReceive' value="+value+"></td>"+
                                "<td>"+value+"</td>"+                                  
                             	"</tr>"
     
                             

		                })
						
		            epc +=    "</tbody>"+
                        "</table>"
						

						$('#ECPLIST').html(epc);	
							
					}
					
					
				}
			});
					
		}else{

			jQuery(".error_msg").html("<div style='color:red'>Please check details !</div>");

			return false;
		}	

});

$('#ReceivedASN').on('click', function(){

	var error = 0;

	if($('[name="asn"]').val()==""){
		error=1;
		$('.ASN_error').html('Please Enter IBT !')				
	}else{
		$('.ASN_error').html(' ')
	}

	if ($('[name="storename"]').val() == "" 
        || $('[name="storename"]').val() == null ||
        $('[name="storename"]').val() == 'select') {
        error = 1;
        $('.storename_error22').html('Please Select !')
    } else {
        $('.storename_error22').html(' ')
    }

	if ($('[name="retail_bizlocation"]').val() == "" 
        || $('[name="retail_bizlocation"]').val() == null ||
        $('[name="retail_bizlocation"]').val() == 'select') {
        error = 1;
        $('.error_retail_bizlocation').html('Please Select !')
    } else {
        $('.error_retail_bizlocation').html(' ')
    }
	
	if ($('[name="storename"]').val() == $('[name="retail_bizlocation"]').val() 
		&& $('[name="storename"]').val() !=='select' 
		&& $('[name="retail_bizlocation"]').val() !== 'select') {
        error = 1;

        $('.error_msg22').html('Original location and destination not be same !')
    } else {
        $('.error_msg22').html(' ')
    }


	if(($("input[name*='EpcReceive']:checked").length)<=0){	
		error=1;
		$('.asn_asdetails_error').html('Please Chose Epc !')					
	}else{
		$('.asn_asdetails_error').html(' ')
	}

	if(error == 0 ){
		$("#ReceivedASN").attr('disabled','disabled');
		$(".waiting").show();
		$.ajax({
			type:'POST',
			url: "/api/1.0.0/inventoryData/ConfirmASNDetailsReceiveingAPI",
			data:$("#DetailsEpcForm22").serialize(),
			success: function(data){
				$("#ReceivedASN").removeAttr('disabled');
				$(".waiting").hide();

				swal("Good job!", "Received Successfully Successfully !", "success");
                    
                setTimeout(function(){
                    window.location.href='asndata';
                },2000)
			}
		})
	}

});

	


})


	

