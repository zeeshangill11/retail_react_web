var main_table = '';
function getstoreinfo(){
	$(document).ready(function() {
		const params = new URLSearchParams(window.location.search)

        var asn_id = params.get('asn_id');

        var process_status = params.get('process_status');
        
        var process_asn = params.get('process');
        var hide_column = false;
        if(process_asn == 'packing'){
        	hide_column = 6;
        }



	main_table=	$('#dataTable').DataTable( {
		dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'IBT Details'
                },{

                    extend: 'print',
                    title: 'IBT Details'       
                },
            ],
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
				'url':'/api/1.0.0/stockCountRecords/ViewAsnDetails/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"Date":$('#Date').val(),
						"Source":$('#Source').val(),
						"SerialNumber":$('#SerialNumber').val(),
						"asn_id":asn_id,
						"process_status":process_status,
						"process_asn":process_asn
					});
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "date" },
				{ "data": "asn" },
				{ "data": "tag_id" },
				{ "data": "sku" },
				// { "data": "process" },
				{ "data": "department" },
				{ "data": "original_location" },
				{ "data": "destination" },
                // { "data": "style" },
                { "data": "process_status" },
                { "data": "brand" },
                { "data": "shipment_number" },
                
			],
			"searching": false,
			"order": [[ 0, 'desc' ]],
			"columnDefs": [
			    { "visible": false, "targets": hide_column }
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
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            
	        var source = '';
            source += '<option value="">All Sources</option>';
            for(var i = 0; i < response_data.length; i++){
                source += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#Source").html(source);
            $('#Source').selectpicker('refresh');
        }
    });
}
getasnDetails();


function AsnFiltersStatus(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/AsnFiltersStatus",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data)
	        var status = '';
            status += '<option value="">All Process</option>';
            for(var i = 0; i < response_data.length; i++){
                status += '<option value="'+response_data[i].status+'">'+response_data[i].status+'</option>';					
            }
            $("#Process").html(status);
            $('#Process').selectpicker('refresh');
        }
    });
}
AsnFiltersStatus();
 


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

$(document).on('click','.asn_details', function(){	
		var asn_id = $(this).attr('asn_id');
		var process_status = $(this).attr('process_status');
		//alert(asn_id)
		$(".modal-title").text('Asn Details');
			
		var mythis = $('#UserRoles');
		mythis.find('.waiting').show();  	

	$.ajax({
		type:'POST',
		data:{
			asn_id:asn_id,
			process:process_status
		},
		url: "/api/1.0.0/stockCountRecords/ViewAsnDetails",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			//console.log(response_data);
			mythis.find('.waiting').hide();

			//console.log(response_data[0].destination_location);
				$('#permissions_list').html('<strong>Date</strong>:'+response_data[0].date +' ' +'<strong>Destination</strong>:'+response_data[0].destination_location).css("margin-bottom","15px")

				var table=''	
					table += '<table border=1 style="text-align:center">  <thead> <tr> <th>Tag Id</th> <th>Sku</th> '+ 
					' <th>Department</th> <th>Brand</th> <th>Shipment no</th>  </tr></thead> <tbody> ' 
					
						for(i = 0 ;i<response_data.length;i++){
							
                           table +='<tr rowspan="4"> ';
							table +='<td>'+response_data[i].tag_id+'</td>'
							table +='<td>'+response_data[i].sku+'</td>'
							// table +='<td>0</td>'
							//table +='<td>'+response_data[i].destination_location+'</td>'
							table +='<td>'+response_data[i].department+'</td>'
							table +='<td>'+response_data[i].brand+'</td>'
							table +='<td>'+response_data[i].shipment_number+'</td>'
							table += '</tr>'	
						} 
					  
					
					table +='</tbody>'
					table += ' </table>';
				

			 $("#ProcessTable").html(table);
										
		}
	});	
})



