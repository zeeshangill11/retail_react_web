var main_table = '';
function getstoreinfo(){
	$(document).ready(function() {
	main_table=	$('#dataTable').DataTable( {
			"pageLength": 25,
			'processing': true,
			'serverSide': true,
			
	        "initComplete": function( settings, json ) {
	        	$(".data-tables").css('visibility','visible');
	        	$(".before_load_table").hide();
	        },
	        'language': {
	            'loadingRecords': '&nbsp;',
	            'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
	        },  
			
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/Cancel_getasndata/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"Type": $('#Type').val(),
						"Date":$('#Date').val(),
						"Process":$('#Process').val(),
						"Asn":$('#Asn').val(),
						"SerialNumber":$('#SerialNumber').val(),
						"StoreID":$('#StoreID').val(),		
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "id" },
				{ "data": "date" },
				{ "data": "asn" },
				{ "data": "process_status" },
				{ "data": "department" },
				{ "data": "destination" },
                { "data": "style" },
                { "data": "color" },
                { "data": "brand" },
                { "data": "action" },
                // { "data": "purchase_order" },
                // { "data": "user" },
			]
		});
	}); 
}

$('.run').click(function(){

   main_table.ajax.reload(); 
});

getstoreinfo();



function getasnDetails(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/Cancel_AsnFilters",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            // var Type = '';
            // Type += '<option value="">All Type</option>';
            // for(var i = 0; i < response_data.length; i++){
            //     Type += '<option value="'+response_data[i].process+'">'+response_data[i].process+'</option>';					
            // }
            // $("#Type").html(Type);
            // $('#Type').selectpicker('refresh');

            var Process = '';
            Process += '<option value="">All Process</option>';
            for(var i = 0; i < response_data.length; i++){
                Process += '<option value="'+response_data[i].process+'">'+response_data[i].process+'</option>';					
            }
            $("#Process").html(Process);
            $('#Process').selectpicker('refresh');

            
        }
    });
}
getasnDetails();


function StoreID(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/cancelstore_id",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);


            var StoreID = '';
            StoreID += '<option value="">All StoreID</option>';
            for(var i = 0; i < response_data.length; i++){
                StoreID += '<option value="'+response_data[i].store_id+'">'+response_data[i].store_id+'</option>';					
            }
            $("#StoreID").html(StoreID);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
StoreID();







var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                

$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

$(document).on('click','.asn_details', function(){	
		var asn_id = $(this).attr('asn_id');
		var process_status = $(this).attr('process_status');
		$(".modal-title").text('Asn Details');
			
		var mythis = $('#UserRoles');
		mythis.find('.waiting').show();  	

	$.ajax({
		type:'POST',
		data:{
			asn_id:asn_id,
			process:process_status
		},
		url: "/api/1.0.0/stockCountRecords/Cancel_ViewAsnDetails",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			mythis.find('.waiting').hide();

				
				$('#permissions_list').html('<strong>Date</strong>:'+response_data[0].date +' ' +'<strong>Destination</strong>:'+response_data[0].destination_location).css("margin-bottom","15px")

				var table=''	
					table += '<table border=1 style="text-align:center">  <thead> <tr> <th>Tag Id</th> <th>Sku</th> '+ 
					' <th>Department</th> <th>Brand</th> </tr></thead> <tbody> ' 
					
						for(i = 0 ;i<response_data.length;i++){
	
                           table +='<tr rowspan="4"> ';
							table +='<td>'+response_data[i].tag_id+'</td>'
							table +='<td>'+response_data[i].sku+'</td>'
							table +='<td>'+response_data[i].department+'</td>'
							table +='<td>'+response_data[i].brand+'</td>'
							table += '</tr>'	
						} 
					  
					
					table +='</tbody>'
					table += ' </table>';
				

			 $("#ProcessTable").html(table);
											
		}
	});	
})
