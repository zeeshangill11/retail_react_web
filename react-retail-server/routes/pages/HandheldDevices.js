const params = new URLSearchParams(window.location.search)

var storeid = params.get('storeid');

if(storeid !==''){
	var store_name = storeid;
}

var main_table = [];
function gethandhelddevice(){
	$(document).ready(function() {
	main_table = $('#dataTable').DataTable( {
			dom: 'Bfrtip',
	        buttons: [
	            {
	                extend: 'excel',
	                action: newExportAction,
	                title: 'HandHeldDevice'
	            },{

                	extend: 'print',
                	title: 'HandHeldDevice'		
                },
	        ],
			"pageLength": 25,
			'processing': true,
			"initComplete": function( settings, json ) {
	        	$(".data-tables").css('visibility','visible');
	        	$(".before_load_table").hide();
	        },
	        'language': {
	            'loadingRecords': '&nbsp;',
	            'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
	        },  
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/gethandhelddevice',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"StoreID": $( "#StoreID" ).val(),
						"DeviceID":$('#DeviceID').val(),
						storeid:store_name	
					} );
				},
			},
				
			"responsive": true,
			"columns": [
				{ "data": "username" },
				{ "data": "description" },
				{ "data": "status" },
				{ "data": "storeid" },
				{ "data": "uuid" },
                { "data": "qr_code" },
                { "data": "action" },
			],
			 'columnDefs': [ {
                'targets': [2,5,6], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
		})
	}); 
}
$('.run').click(function(){
   
    var location = $( "#StoreID" ).val();
	var deveice =	$( "#DeviceID" ).val();
	main_table.ajax.reload();
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

gethandhelddevice();

// Delete Record..
$(document).on('click','.deleteRecord', function(){
	var id = $(this).attr('del_id');

	swal({
	  title: "Are you sure?",
	  text: "You won't be able to revert this !",
	  icon: "warning",
	  buttons: true,
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
  		$.ajax({
			type:'POST',
			url: "/api/1.0.0/stockCountRecords/DeleteDeviceHandheld",
			data:"id="+id,
			success: function(data)
			{
				var response = JSON.parse(data);
				
				swal("Poof! Your Record has been deleted !", {
			      icon: "success",
			    });
				main_table.ajax.reload();
			}
		});
	    
	  } else {
	    swal("Your Record is safe !");
	  }
	});
});
function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="" store_id="0">Select Location</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();


function DevieceID(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getDevieceID",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var deveicename = '';
            deveicename += '<option value="" deveice_id="0">Device</option>';
            for(var i = 0; i < response_data.length; i++){
                deveicename += '<option value="'+response_data[i].device_unique_id+'" deveice_id="'+response_data[i].device_unique_id+'">'+response_data[i].device_unique_id+'</option>';                 
            }
           // console.log(deveicename);
            $("#DeviceID").html(deveicename);
            $('#DeviceID').selectpicker('refresh');
        }
    });
}
DevieceID();


$(document).on('click','.handhelddevices', function(){
	var device_id = $(this).attr('device_id');

	//alert(device_id);

	$(".modal-title").text('QrCode');
			
		var mythis = $('#UserInfo');
		mythis.find('.waiting').show();
	
		$.ajax({
		type:'POST',
		data: "device_id="+device_id,
		url: "/api/1.0.0/stockCountRecords/qrcodeRequset",
		success: function(data)
		{
			var response_data = (data);
			
			

			mythis.find('.waiting').hide();
			
			$("#store_list").html(response_data).css("text-align","center");								
		}
	});	

});


$(document).on('click','.HandheldEdit', function(){
	var edit_id = $(this).attr('edit_id');
	window.location.href='edithandhelddevice?edit_id='+edit_id;
});





$('#StoreID').selectpicker({
    noneSelectedText : 'Location'
});

$('#DeviceID').selectpicker({
    noneSelectedText : 'Device'
});
