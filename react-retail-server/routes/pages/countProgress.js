departmentsRecords = [];
departmentsName = [];
overs = [];
unders = [];
counted = [];
$('.close').click(function(){
	$('#summarydate').val(' ');
	departments()

})
function buildSearchData(){
	
	var obj = {
		"my_date22" : $('#summarydate').val(),
			  
   };
   //console.log(obj)
   return obj;
}
function departments(){
	return new Promise(function(resolve, reject) {
		var date = $('#summarydate').val();
				
		$.ajax({
			type:'POST',
			data:{
				"date":date
			},
			url: "/api/1.0.0/stockCountRecords/getStockCountData",
			success: function(data)
			{
				var responseData = JSON.parse(data);
				
				for(var i = 0; i < responseData.length; i++){
					//console.log(responseData[i].store);
					if(responseData[i].department != null){
						departmentsName.push(responseData[i].department);
					}
					
					var overDept = responseData.filter(x => x.departmentid === responseData[i].departmentid);
					var overss = 0;
					var underss = 0;
					var counteds = 0;
					for(var y = 0; y < overDept.length; y++){
						overss += parseFloat(overDept[y].unexpected);
						underss += parseFloat(overDept[y].missing);
						counteds += parseFloat(overDept[y].expected);

						
						
					}
					overs.push(overss);
					unders.push(underss);									
					counted.push(counteds);	
													
				}
				resolve(1);		
			}
		})
				
			
		
		
	});  
} 
function handler(e){
    //alert(e.target.value);
    departments();
}
window.onload = function() {
	departments().then(function(response){
		
		//console.log(overs);
		//console.log(unders);
	
		//console.log(counted);
		var barChartData = {
			labels: departmentsName,
			datasets: [{
				label: 'Match',
				backgroundColor: 'green',
				data: counted
			}, {
				label: 'Unders',
				backgroundColor: 'red',
				data: unders
			}, {
				label: 'Overs',
				backgroundColor: 'blue',
				data: overs
			}]	
		};
		//alert('a');
		//console.log(barChartData);
		setTimeout(function(){
		var ctx = document.getElementById('canvas').getContext('2d');
		window.myBar = new Chart(ctx, {
			type: 'bar',
			data: barChartData,
			options: {
				title: {
					display: true,
					text: 'Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false
				},
				responsive: true,
				scales: {
					xAxes: [{
						stacked: true,
						ticks: {
							mirror: false,
						}
					}],
					yAxes: [{
						stacked: true
					}]
				}
			}
		});
		},599);

	}).catch(function(error){
		console.log(error);
		resolve(0);
	});	
};
