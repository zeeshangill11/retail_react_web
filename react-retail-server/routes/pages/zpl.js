var main_table = '';
function getzplinfo(){
	$(document).ready(function() {
		main_table = $('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'ZPL'
                },{

                	extend: 'print',
                	title: 'ZPL'		
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
				'url':'/api/1.0.0/stockCountRecords/getzplinfo/'
			},	
			"responsive": true,
			"columns": [
				{ "data": "id" },
				{ "data": "name" },
				{ "data": "zplbutton" },
				{ "data": "storeid" },
				{ "data": "status" },
				{ "data": "remarks" },
				{ "data": "action" },
			],
			'columnDefs': [ {
                'targets': [2,3,4,6], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
			 "order": [[ 0, "desc" ]]
		});
	}); 
}


getzplinfo();
var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

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
			url: "/api/1.0.0/stockCountRecords/zplDelete",
			data:"id="+id,
			success: function(data)
			{
				var response = JSON.parse(data);
				
				swal("Poof! Your Record has been deleted !", {
			      icon: "success",
			    });
				main_table.ajax.reload();
				if(response.title != 'Error'){
					// initiazeTable().then(function(response){
					// }).catch(function(error){
					// 	console.log(error);
					// 	resolve(0);
					// });
				}
			}
		});
	    
	  } else {
	    swal("Your Record is safe !");
	  }
	});

});

$(document).on('click','.ZPLEdit', function(){
	
	var edit_id = $(this).attr('edit_id');
	window.location.href='editzpl?edit_id='+edit_id;
		
});
$(document).on('click','.storename', function(){	
		var store_id = $(this).attr('store_id');

		// store_id = store_id.split('[').join('');
		// store_id = store_id.split(']').join('');

		
		$(".modal-title").text('Store Name');
		//alert(store_id)
		var mythis = $('#FORM');
		mythis.find('.waiting').show();  	

	$.ajax({
		type:'POST',
		data: "storeid="+store_id,
		url: "/api/1.0.0/stockCountRecords/ViewStoresZPL",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			console.log(response_data);
			mythis.find('.waiting').hide();
			
			var list = '';
			list += '<ul>';
			for(i = 0 ;i<response_data.length;i++){
				
				list += '<li>'+response_data[i].storeid+'</li>';	
			}			
			list +='</ul>';

			$("#store_list").html(list);								
		}
	});	
})


$(document).on('click','.store_zpl_id', function(){	

		var zpl_id = $(this).attr('zpl_id');


		
		$(".modal-title").text('ZPL');
			
		var mythis = $('#FORM');
		mythis.find('.waiting').show();  	

	$.ajax({
		type:'POST',
		data: "zpl_id="+zpl_id,
		url: "/api/1.0.0/stockCountRecords/ViewZPLModel",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			
			mythis.find('.waiting').hide();

			
			var list = '<div class="text-wrap" style="overflow: auto;">'+response_data[0].zpl+'</div>';
			// list += '<ul>';
			
				
			
					
			// list +='</ul>';

			$("#store_list").html(list);								
		}
	});	
})