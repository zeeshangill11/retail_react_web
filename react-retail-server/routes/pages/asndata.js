var main_table = '';
var checkboxValue = 'false';


function getstoreinfo(){
	$(document).ready(function() {

	main_table=	$('#dataTable').DataTable({
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'IBT Data'
                },{

                    extend: 'print',
                    title: 'IBT Data'       
                },
            ],
			"pageLength": 25,
            "order": [[ 0, "desc" ]],	
			'processing': true,
			'serverSide': true,
			 "initComplete": function( settings, json ) {
                // $(".data-tables").css('visibility','visible');
                 $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/getasndata/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"from_my_date":$( "#FromDate" ).val(),	
                        "to_my_date" :$('#ToDate').val(),
                        "source": $('#source').val(),
                        "Destination" :$('#Destination').val(),
                        "Status" :$('#Status').val(),
						"Remarks" :$('#Remarks').val(),
						"Asn":$('#Asn').val()
						
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "asn" },
				{ "data": "source" },
				{ "data": "destination" },
                { "data": "packed_item_new" },
                { "data": "transferred_item_new" },
                { "data": "received_item_new" },
                { "data": "status" },
                { "data": "packing_date" },
                { "data": "packing_remarks" },
                { "data": "shipping_date" },
                { "data": "shipping_remarks" },
                { "data": "receiving_date" },
                { "data": "receiving_remarks" },
			],
			"searching": false,
			"select": true,
            "order": [[ 0, 'desc' ]],
		});
	}); 
}

$('.run').click(function(){
    var $this = $('#AsnForm');
    var working = false;
    var error = 0;

    var FromDate = new Date($('#FromDate').val());
    var ToDate = new Date($('#ToDate').val());
    
    var Source = $('#source').val();
    var Destination = $('#Destination').val();

   
    // if(Source =='' && Destination == ''){
    //     error = 1;
    //   $this.find('.Source_error').html('Please Select Atleast one Source or Destination !');  
    
    // }else{
    //     $this.find('.Source_error').html('');
    // }

    if(FromDate !== '' && ToDate!==''){
        
         
        if (FromDate > ToDate){
            error = 1;
            $this.find('.Date_error').html('From Date must be less then To Date !'); 
        } else{
           $this.find('.Date_error').html('');  
        }  
    }

   
    if(error == 0){
        
        $(".data-tables").css('visibility','visible');
        $(".before_load_table").hide();
            


        working = true;
        main_table.ajax.reload();
    }  
})

getstoreinfo();

function getasnDetails(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var Type = '';
            Type += '<option value="all_source">All Source</option>';
            for(var i = 0; i < response_data.length; i++){
                Type += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#source").html(Type);
            $('#source').selectpicker('refresh');
        }
    });
}
getasnDetails();

function getAsnDestination(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getAsnDestination",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var destination = '';
            destination += '<option value="all_destination">All Destination</option>';
            for(var i = 0; i < response_data.length; i++){
                destination += '<option value="'+response_data[i].destination+'">'+response_data[i].destination+'</option>';					
            }
            $("#Destination").html(destination);
            $('#Destination').selectpicker('refresh');
        }
    });
}
getAsnDestination();


function getAsnStatus(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getAsnStatus",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var status = '';
            status += '<option value="">All Status</option>';
            for(var i = 0; i < response_data.length; i++){
                status += '<option value="'+response_data[i].status+'">'+response_data[i].status+'</option>';					
            }
            $("#Status").html(status);
            $('#Status').selectpicker('refresh');
        }
    });
}
getAsnStatus();



var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

$(document).on('click','.asn_info_model', function(){	

	var asn_id = $(this).attr('asn_id');
	var process_status = $(this).attr('process_status');
    window.open("view_asndetails?asn_id="+asn_id+"&process="+process_status, '_blank');	
   //window.location.href="view_asndetails?asn_id="+asn_id+"&process="+process_status;
});



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
					' <th>Department</th> <th>Brand</th> </tr></thead> <tbody> ' 
					
						for(i = 0 ;i<response_data.length;i++){
							// console.log('dddddddd');
							// console.log(response_data[i].tag_id);
                           table +='<tr rowspan="4"> ';
							table +='<td>'+response_data[i].tag_id+'</td>'
							table +='<td>'+response_data[i].sku+'</td>'
							// table +='<td>0</td>'
							//table +='<td>'+response_data[i].destination_location+'</td>'
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

$(document).on('click','.asn_details', function(){	

	var asn_id = $(this).attr('asn_id');
	var process_status = $(this).attr('process_status');

    window.location.href="view_asndetails?asn_id="+asn_id+"&process_status="+process_status;
});

$('#source').selectpicker({
    noneSelectedText : 'All Source'
})

$('#Destination').selectpicker({
    noneSelectedText : 'All Destination'
});

$('#Status').selectpicker({
    noneSelectedText : 'All Status'
});