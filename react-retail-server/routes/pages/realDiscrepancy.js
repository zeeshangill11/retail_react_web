function loader(){
	Swal.fire({
		title: 'Please Wait',
		willOpen: () => {
			Swal.showLoading()
		}
	});
}
loader();
Realtimedisc= [];
function Realtime(){

	$(document).ready(function() {
		$('#dataTable').DataTable( {
			"pageLength": 25,
			'processing': true,
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/inventoryData/RealtimeDiscrepancy'
			},	
			"responsive": true,
			"columns": [
				{ "data": "skucode" },
				{ "data": "departmentname" },
				{ "data": "brandname" },
				{ "data": "size" },
				{ "data": "color" },
				{ "data": "remaining" },
				{ "data": "expected" },
				{ "data": "counted" },
				{ "data": "countedsf" },
				{ "data": "countedsr" },
				
			]
		});
	}); 	 
}
Realtime();