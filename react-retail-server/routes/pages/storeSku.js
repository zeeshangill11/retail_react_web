function departmentID(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getDepartment",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var department = '';
            department += '<option value="" department_id="0">All Department</option>';
            for(var i = 0; i < response_data.length; i++){
                department += '<option value="'+response_data[i].departmentid+'" department_id="'+response_data[i].departmentid+'" departmentname="'+response_data[i].departmentname+'">'+response_data[i].departmentname+'</option>';					
            }
            $("#DepartmentID").html(department);
            $('#DepartmentID').selectpicker('refresh');
        }
    });
}
function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="" store_id="0">All Stores</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storeid+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
function BrandName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getBrandName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var brand = '';
            brand += '<option value="" brand_id="0">All Brand</option>';
            for(var i = 0; i < response_data.length; i++){
                brand += '<option value="'+response_data[i].brand_name+'" brand_id="'+response_data[i].skucode+'" brand_name="'+response_data[i].brand_name+'">'+response_data[i].brand_name+'</option>';					
            }
            $("#BrandID").html(brand);
            $('#BrandID').selectpicker('refresh');
        }
    });
}
$('.close').click(function(){
	$('#summarydate').val(' ');
	summary()

})
var barChartData = [];
function StoreDiscrepency(){

	var dptid = $('#DepartmentID').val();
    var bid = $('#BrandID').val();
    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();

	$.ajax({
        type:'POST',
        data:{
            "dptid":dptid,
            "bid":bid,
            "date":date,
            "storeid":storeid
        },
        url: "/api/1.0.0/stockCountRecords/GetMinMAx",
        success: function(data)
        {
            var response_data = JSON.parse(data);

            var min = response_data[0].UNDER;
            var max = response_data[0].oveer

           
            $.ajax({
		        type:'POST',
		        data:{
		        	'min':min,
		        	'max':max,
		        	"dptid":dptid,
		            "bid":bid,
		            "date":date,
		            "storeid":storeid
		        },
		        url: "/api/1.0.0/stockCountRecords/StoreDiscrepencyTwo",
		        success: function(data)
		        {
		            var response_data2 = JSON.parse(data);
		            //console.log(response_data2[0]);
		            var abc = response_data2[0]
			            
	            	var under=[];
	            	var under_key = [];
	            	var over=[];
	            	var over_key = [];

	            	var my_data = [];
	            	$.each(abc,function(index,value){
	            		
	            		my_data.push(value);

	            		temp = index.split("_m");
	            		if(temp.length>1)
	            		{
	            			temp2 = index.split("_m");
	            			under.push(value);
	            			over.push(0)
	            			//under_key.push("-"+temp2[1]);
	            		}
	            		else
	            		{
	            			temp2 = index.split("_");
	            			over.push(value);
	            			under.push(0)
	            			//over_key.push(temp2[1]);
	            		}

	            	});
	            	var label = [];
	            	for(var i=min;i<=max;i++){
	            		label.push(i)	
	            	}

	            	//console.log(label);

	            	//console.log(my_data);

	            	// console.log(under_key);
	            	 //console.log(under);


	            	// console.log(over_key);
	            	 //console.log(over);
	            			  	
			            	

			         barChartData = {
						labels: label,
						datasets: [{
							label: 'Over',
							backgroundColor: 'green',
							data: over
						}, {
							label: 'Unders',
							backgroundColor: 'red',
							data: under
						}, {
							label: 'Overs',
							backgroundColor: 'blue',
							
							// data: ["10", "100", "120", "140", "12", "130", "20", "1", "20", "40", "10", "120", "120", "40", "60"]
						
						}]	
					};
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
									},
									gridLines: { 
										color: "#131c2b",
										borderDash: [8, 4], 
									},
								}],
								yAxes: [{
									stacked: true,
									ticks: {
										max: 900,
										min: 100,
										stepSize: 100
									},
								}]
							}
						}
					});	           	            
		        }
		    });
        }
    });
}

var barChartData = [];

// function handler(e){
//     //alert(e.target.value);
//     StoreDiscrepency();
//     $('#canvas').replaceWith('<canvas id="canvas"></canvas>');
//     new Chart(document.getElementById("canvas"), {
//         data: barChartData,
//        	type: 'bar',
       
//     });

// }

$('.run').click(function(){
	$('.report-dashboard').removeClass('hide')
   StoreDiscrepency();
	
    $('#canvas').replaceWith('<canvas id="canvas"></canvas>');
    new Chart(document.getElementById("canvas"), {
        data: barChartData,
       	type: 'bar',
       
    });	
   
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

// $(document).on('change','#DepartmentID,#BrandID,#StoreID', function(){

// 	StoreDiscrepency();
	
//     $('#canvas').replaceWith('<canvas id="canvas"></canvas>');
//     new Chart(document.getElementById("canvas"), {
//         data: barChartData,
//        	type: 'bar',
       
//     });	


    

// });



$(document).ready( function () {	

	$('#dataTableTwo').DataTable( {
		"pageLength": 10,
		'processing': true,
		'serverSide': true,
		'serverMethod': 'post',
		'ajax': {
			'url':'/api/1.0.0/stockCountRecords/getunderall/'
		},	
		"responsive": true,
		"columns": [
			{ "data": "departmentname" },
			{ "data": "brandname" },
			{ "data": "productname" },
			{ "data": "skucode" },
			{ "data": "diff" },
		]
	});
	$('#dataTableThree').DataTable( {
		"pageLength": 10,
			'processing': true,
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/getallover/'
			},	
			"responsive": true,
			"columns": [
				{ "data": "departmentname" },
				{ "data": "brandname" },
				{ "data": "productname" },
				{ "data": "skucode" },
				{ "data": "diff" },
			]
		});
	//$('#dataTableTwo').DataTable();
	//$('#dataTableThree').DataTable();
});
departmentID();
BrandName();
storeName();