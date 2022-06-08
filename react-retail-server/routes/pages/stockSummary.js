var departmentsData = [];
var storeData = [];
var summaryData = [];
var gettop20 = [];
var gettop20our =[];
var main_table='';
var main_table2='';
var main_table3='';
var main_table4='';
var currentRequest = null;    
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
				storename += '<option value="" store_id="0">All Stores</option>';
				for(var i = 0; i < response_data.length; i++){
					storename += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
				}
				$("#StoreID").html(storename);
				$('#StoreID').selectpicker('refresh');
			}
		});
	}
storeName();

$(document).on('change','#StoreID',function(){

	var storeName = $("#StoreID").val();
	if(storeName !== '' && storeName !== undefined){
	 var datesArray = [];
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/getStockCountDate",
            data:{
                store_id:storeName
            },
            success: function(data)
            {
                var response_data = JSON.parse(data);
                var temp='';
                var new_date='';
                for(var i  = 0; i < response_data.length; i++){
                    temp     = (response_data[i].stockcountdate).split("-");
                    new_date = temp[2]+"-"+temp[1]+"-"+temp[0];
                    datesArray.push({'date':new_date});
                    //console.log(new_date);
                }

               // var enableDates = [{date: "09-02-2021"},{date: "05-02-2021"},{date: "07-12-2018"},{date: "10-12-2018"},{date: "12-12-2018"},{date: "14-12-2018"},{date: "17-12-2018"},{date: "19-12-2018"},{date: "21-12-2018"},{date: "24-12-2018"}, {date: "26-12-2018"},{date: "28-12-2018"}];   
               var enableDates=datesArray;
                var enableDatesArray=[];  
                var sortDatesArry = [];   
                for (var i = 0; i < enableDates.length; i++) {  
                     var dt = enableDates[i].date.replace('-', '/').replace('-', '/');  
                     var dd, mm, yyy;  
                     if (parseInt(dt.split('/')[0]) <= 9 || parseInt(dt.split('/')[1]) <= 9) {  
                            dd = parseInt(dt.split('/')[0]);  
                            mm = parseInt(dt.split('/')[1]);  
                            yyy = dt.split('/')[2];  
                            enableDatesArray.push(dd + '/' + mm + '/' + yyy);  
                            sortDatesArry.push(new Date(yyy + '/' + dt.split('/')[1] + '/' + dt.split('/')[0]));  
                        }  
                        else {  
                            enableDatesArray.push(dt);  
                            sortDatesArry.push(new Date(dt.split('/')[2] + '/' + dt.split('/')[1] + '/' + dt.split('/')[0] + '/'));  
                        }  
                }  
                var maxDt = new Date(Math.max.apply(null, sortDatesArry));  
                var minDt = new Date(Math.min.apply(null, sortDatesArry));  
                $(".datepicker33").datepicker("destroy"); 
                $('.datepicker33').datepicker({  
                  format: "yyyy-mm-dd",  
                  autoclose: true,  
                  startDate: minDt,  
                  endDate: maxDt,  
                  beforeShowDay: function (date) {  
                     var dt_ddmmyyyy = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();  
                     return (enableDatesArray.indexOf(dt_ddmmyyyy) != -1);  
                  } 

                });  

                $(".datepicker33").datepicker("refresh"); 
              
               //console.log(datesArray);
                
            }
        });
    }    

});

$('#StoreID').selectpicker({
    liveSearch: true,
	maxOptions: 1,
	noneSelectedText: 'Select Store'
});



	

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
	
function abc43(){

	$(document).ready(function() {

	var date = $('#summarydate').val();
	
	main_table =	$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction22,
                    title: 'StockSummary'
                },{

                	extend: 'print',
                	title: 'StockSummary'		
                },
            ],
			
			"pageLength": 25,
			'processing': true,

	   //      "initComplete": function( settings, json ) {
	   //      	$(".data-tables").css('visibility','visible');
	   //      	 $(".before_load_table").hide();
	   //      	$('.mm-datatable tr th:first-child').click();
				// $('.mm-datatable12 .sorting').click();
	   //      },
	   //      'language': {
	   //          'loadingRecords': '&nbsp;',
	   //          'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>',
	            
	   //      },  
			'serverSide': true,
			'serverMethod': 'post',
			"scrollX": false,
		
			
			'responsive': true,
			"paging": false,


			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/stockSummaryReport/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"my_date": $('#summarydate').val(),
						"store_id":$('#StoreID').val(),
					});
				},
				complete: function (data) {
                    var sumresult = data['responseJSON'];
                },

			},
	
			
			"columns": [
				{ "data": "date"},
				// { "data": "SKU_code"},
				{ "data": "store" },
				{ "data": "department" },
			
				{ "data": "accuracy" },
				{ "data": "uia" },
				{ "data": "expected" },
				{ "data": "counted" },
				{ "data": "unexpected" },
				{ "data": "missing" },
				{ "data": "expectedsr" },
				{ "data": "expectedsf" },
				{ "data": "countedsr" },
				{ "data": "countedsf" },
				{ "data": "scanned" }
			],
			"footerCallback": function ( row, data, start, end, display ) {
	            var api = this.api(), data;
	            	var data22  = ''

	 				data22 = data[0].aatotal_sum;
	 				
	 				if(isJson(data22)){
	 					var check = JSON.parse(data22);
	 					var total = check[0];
	 				}
	 				
	 				 //console.log(total);	
	        
	 				
	            var intVal = function ( i ) {
	                return typeof i === 'string' ?
	                    i.replace(/[\$,]/g, '')*1 :
	                    typeof i === 'number' ?
	                        i : 0;
	            };
	 	
	            var monTotal = api
	                .column( 0 )
	                .data()
	                .reduce( function (a, b) {
	                    return "";
	                }, 0 );
				

	            var monTotal = api
	                .column( 1 )
	                .data()
	                .reduce( function (a, b) {
	                    return "";
	                }, 0 );
					
			 var tueTotal = api
	                .column( 2 )
	                .data()
	                .reduce( function (a, b) {
	                  return "";
	                }, 0 );		
	           
					
		     var Accuracy = api
	                .column( 3 )
	                .data()
	                .reduce( function (a, b) {
	                   return 'Total';
	                }, 0 );
					
		     var UIA = api
	                .column( 4 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.uiasum;
	                }, 0 );
	         var Expected = api
	                .column( 5 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.expectedsum;
	                }, 0 );
	         var Couted = api
	                .column( 6 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.countedsum;
	                }, 0 );  

	          var Overs = api
	                .column( 7 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.unexpectedsum;
	                }, 0 );  

	           var Unders = api
	                .column( 8 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.missingsum;
	                }, 0 );  

	            var Expected_sf = api
	                .column( 9 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.expectedsfsum;
	                }, 0 );   

                 var Expected_sr = api
                .column( 10 )
                .data()
                .reduce( function (a, b) {
                    return total.expectedsrsum;
                }, 0 ); 

                 var Counted_sf = api
                .column( 11 )
                .data()
                .reduce( function (a, b) {
                    return total.countedsfsum;
                }, 0 ); 

                 var Counted_sr = api
                .column( 12 )
                .data()
                .reduce( function (a, b) {
                    return total.countedsrsum;
                }, 0 );                    

                 var Scanned = api
                .column( 13 )
                .data()
                .reduce( function (a, b) {
                    return total.scannedsum;
                }, 0 ); 
				
					
	            // Update footer by showing the total with the reference of the column index 
		    	$( api.column( 0 ).footer() ).html('');
	            $( api.column( 1 ).footer() ).html(monTotal);
	            $( api.column( 2 ).footer() ).html(tueTotal);
	            $( api.column( 3 ).footer() ).html(Accuracy);
	            $( api.column( 4 ).footer() ).html(UIA);
	            $( api.column( 5 ).footer() ).html(Expected);
	            $( api.column( 6 ).footer() ).html(Couted);
	            $( api.column( 7 ).footer() ).html(Overs);
	            $( api.column( 8 ).footer() ).html(Unders);
	            $( api.column( 9 ).footer() ).html(Expected_sf);
	            $( api.column( 10 ).footer() ).html(Expected_sr);
	            $( api.column( 11 ).footer() ).html(Counted_sf);
	            $( api.column( 12 ).footer() ).html(Counted_sr);
	            $( api.column( 13 ).footer() ).html(Scanned);

	        },
			'columnDefs': [ {
				'targets': [2,3,4], /* column index */
				'orderable': false, /* true or false */
			 }],
			 "searching": false,
			  "scrollY": 500,		
			});
		
	});

}
$("#dataTable").append(
   $('<tfoot/>').append("<tr><th></th>"+ 
   	"<th></th><th></th> "+ 
   	// " <th></th>"+ 
   	" <th></th>"+ 
   	" <th id=''></th> "+ 
   	"<th  id=''></th>"+ 
   	" <th id=''></th>"+ 
 
   	" <th id=''></th>"+ 
   	" <th id=''></th>"+ 
   	" <th id=''></th>"+ 
   	" <th id=''></th>"+ 
   	" <th id=''></th>"+ 
   	" <th id=''></th>"+ 
   	" <th id=''></th> </tr>").css("color","#fff")
);

var ctx = document.getElementById("barChart");
var barChart = new Chart(ctx, {
    type: 'bar',
    options: {
		title: {
			display: true,
			text: 'Chart'
		},
		 legend: {
	        labels: {
	            fontColor: "white",
	            fontSize: 16
	        },
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
					autoSkip: false,
					   maxTicksLimit: 25,
					 fontColor: "#fff", // this here
				},
				gridLines: { 
					color: "#131c2b",
					borderDash: [8, 4], 
				},
			}],
			yAxes: [{
				stacked: true,
				ticks: {
					mirror: false,
					 fontColor: "#fff", // this here
				},
			}]
		}
	}
});

//graph................

function GraphData(){                        


     var date = $('#summarydate').val();
     var store_id = $('#StoreID').val();     
            
     $.ajax({
         type:'POST',
         data:{
             date:date,
             store_id:store_id
         },
         url: "/api/1.0.0/stockCountRecords/getStockCountData",

         success: function(data)
         {
             var responseData = JSON.parse(data);
             //console.log(responseData);

             var overs=[];
             var unders=[];
             var counted=[];
             var department=[]
             for(var i = 0; i < responseData.length; i++){
                    
                    

                 var overss='';
                 var underss='';
                 var counteds='';
                    
                 overss = responseData[i].unexpected;
                 underss = responseData[i].missing;
                 counteds = responseData[i].counted;

                    

                 overs.push(overss);
                 unders.push(underss);                                   
                 counted.push(counteds); 

                 department.push(responseData[i].department);
                    
                 
                                                    
             }
             var main_data=[];
             
            	main_data.push({
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
                });

                
           
            barChart.data.datasets.pop();
            barChart.data.labels = department;
            barChart.data.datasets= main_data;
            barChart.update();
  
              
         }
     });
 
}


//GraphData();


function gettop20under(){
	$(document).ready(function() {
	main_table2=$('#dataTableTwoo').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction22,
                    title: 'Top20Under'
                }
            ],
			"pageLength": 25,
			'processing': true,

	        // "initComplete": function( settings, json ) {
	        //  	$(".data-tables").css('visibility','visible');
	        //  	$(".before_load_table").hide();
	        // // },
	        // // 'language': {
	        // //     'loadingRecords': '&nbsp;',
	        // //     'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
	        // },  

			'serverSide': true,
			'serverMethod': 'post',
			"paging": false,
			
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/gettop20under/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"my_date": $('#summarydate').val(),
						"store_id":$('#StoreID').val(),
					});
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "departmentname" },
				{ "data": "brandname" },
				{ "data": "skucode" },
				{ "data": "expected22" },
				{ "data": "diff" },
				{ "data": "diffper" },
				{ "data": "supplier_item_no" },
			],
			"searching": false,
			"scrollY": 500,
			"footerCallback": function ( row, data, start, end, display ) {
			 	 var api = this.api(), data;
	            	var data22  = ''

	 				data22 = data[0].aatotalsum;
	 				
	 				if(isJson(data22)){
	 					var check = JSON.parse(data22);
	 					var total = check[0];
	 				}
	 				
	 				 //console.log(total);	
	        
	 				
	            var intVal = function ( i ) {
	                return typeof i === 'string' ?
	                    i.replace(/[\$,]/g, '')*1 :
	                    typeof i === 'number' ?
	                        i : 0;
	            };
	 	
	            var monTotal = api
	                .column( 0 )
	                .data()
	                .reduce( function (a, b) {
	                    return "";
	                }, 0 );
				

	            var monTotal = api
	                .column( 1 )
	                .data()
	                .reduce( function (a, b) {
	                    return "";
	                }, 0 );
					
		   
					
	            var Total = api
	                .column( 2 )
	                .data()
	                .reduce( function (a, b) {
	                   return "Total";
	                }, 0 );
					
		     var sum_expected = api
	                .column( 3 )
	                .data()
	                .reduce( function (a, b) {
	                   return total.sum_expected;
	                }, 0 );
					
		     var sum_diff = api
	                .column( 4 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.sum_diff;
	                }, 0 );
	         var Expected = api
	                .column( 5 )
	                .data()
	                .reduce( function (a, b) {
	                    return '';
	                }, 0 );
	     

	            $( api.column( 0 ).footer() ).html(monTotal);
	            $( api.column( 1 ).footer() ).html(monTotal);
	           
	            $( api.column( 2 ).footer() ).html(Total);
	            $( api.column( 3 ).footer() ).html(sum_expected);
	            $( api.column( 4 ).footer() ).html(sum_diff);
	            $( api.column( 5 ).footer() ).html(Expected);
	                 	 	
			},
			'columnDefs': [ {
				'targets': [3,4,5], /* column index */
				'orderable': false, /* true or false */
				"visible": false, 
                "targets": 5 
			}],
		});
	});
}


$("#dataTableTwoo").append(
	$("<tfoot class='foot'/>").append("<tr>"+ 
	"<th></th>"+ 
   	"<th></th> "+ 
   	"<th></th>"+ 
   
   	" <th></th> "+
   	" <th></th> "+
   	" <th></th> "+ 
   	" <th></th> "+ 
   "</tr>").css("color","#fff")
);

function gettop20over(){
	$(document).ready(function() {
	main_table3=$('#dataTableThree').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction22,
                    title: 'Top20Over'
                }
            ],
			"pageLength": 25,
			'processing': true,

	        // "initComplete": function( settings, json ) {
	        //  	$(".data-tables").css('visibility','visible');
	        //  	$(".before_load_table").hide();
	        // // },
	        // // 'language': {
	        // //     'loadingRecords': '&nbsp;',
	        // //     'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
	        // },  

			'serverSide': true,
			'serverMethod': 'post',
			"paging": false,
			
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/gettop20over/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"my_date": $('#summarydate').val(),
						"store_id":$('#StoreID').val(),
					});
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "departmentname" },
				{ "data": "brandname" },
				{ "data": "skucode" },
				{ "data": "expected" },
				{ "data": "diff" },
				{ "data": "diffper" },
				{ "data": "supplier_item_no" },
			],
			"searching": false,
			"scrollY": 500,
			"footerCallback": function ( row, data, start, end, display ) {
			 	 var api = this.api(), data;
	            	var data22  = ''

	 				data22 = data[0].aatotalsum;
	 				
	 				if(isJson(data22)){
	 					var check = JSON.parse(data22);
	 					var total = check[0];
	 				}
	 				
	 				 //console.log(total);	
	        
	 				
	            var intVal = function ( i ) {
	                return typeof i === 'string' ?
	                    i.replace(/[\$,]/g, '')*1 :
	                    typeof i === 'number' ?
	                        i : 0;
	            };
	 	
	            var monTotal = api
	                .column( 0 )
	                .data()
	                .reduce( function (a, b) {
	                    return "";
	                }, 0 );
				

	            var monTotal = api
	                .column( 1 )
	                .data()
	                .reduce( function (a, b) {
	                    return "";
	                }, 0 );
					
		   
					
	            var Total = api
	                .column( 2 )
	                .data()
	                .reduce( function (a, b) {
	                   return "Total";
	                }, 0 );
					
		     var sum_expected = api
	                .column( 3 )
	                .data()
	                .reduce( function (a, b) {
	                   return total.sum_expected;
	                }, 0 );
					
		     var sum_diff = api
	                .column( 4 )
	                .data()
	                .reduce( function (a, b) {
	                    return total.sum_diff;
	                }, 0 );
	         var Expected = api
	                .column( 5 )
	                .data()
	                .reduce( function (a, b) {
	                    return '';
	                }, 0 );
	     

	            $( api.column( 0 ).footer() ).html(monTotal);
	            $( api.column( 1 ).footer() ).html(monTotal);
	           
	            $( api.column( 2 ).footer() ).html(Total);
	            $( api.column( 3 ).footer() ).html(sum_expected);
	            $( api.column( 4 ).footer() ).html(sum_diff);
	            $( api.column( 5 ).footer() ).html(Expected);
	                 	 	
			},
			'columnDefs': [ {
				'targets': [3,4,5], /* column index */
				'orderable': false, /* true or false */
				"visible": false, 
                "targets": 5 
                
			}],
		});
	});
}
$("#dataTableThree").append(
	$('<tfoot/>').append("<tr>"+ 
	"<th></th>"+ 
   	"<th></th> "+ 
 
   	" <th></th> "+
   	" <th></th> "+
   	" <th></th> "+
   	" <th></th> "+ 
   	" <th></th> "+ 
   "</tr>").css("color","#fff")
);


function Realtime(){

	
$(document).ready(function() {
main_table4=$('#dataTableFour').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction22,
                    title: 'RealtimeDiscrepancy'
                },{

                	extend: 'print',
                	title: 'RealtimeDiscrepancy'		
                },
                
            ],
			"pageLength": 25,
			'processing': true,

	        // "initComplete": function( settings, json ) {
	        //  	$(".data-tables").css('visibility','visible');
	        //  	$(".before_load_table").hide();
	        
	        // },  

			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/inventoryData/RealtimeDiscrepancy12/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"my_date": $('#summarydate').val(),
						"store_id":$('#StoreID').val(),
					});
				},
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
			],
			"scrollY": 500,
			"footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
            //console.log(data);
				var data22 = data[0].realtimesum;
				if(isJson(data22)){
					var check = JSON.parse(data22);
					var total = check[0];
				}
 			//console.log(total);	
        
 				
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 	
            var monTotal = api
                .column( 0 )
                .data()
                .reduce( function (a, b) {
                    return "";
                }, 0 );
			

            var monTotal = api
                .column( 1 )
                .data()
                .reduce( function (a, b) {
                    return "";
                }, 0 );
				
	    var tueTotal = api
                .column( 2 )
                .data()
                .reduce( function (a, b) {
                  return "";
                }, 0 );
				
            var Total = api
                .column( 3 )
                .data()
                .reduce( function (a, b) {
                   return "";
                }, 0 );
				
	     var Accuracy = api
                .column( 4 )
                .data()
                .reduce( function (a, b) {
                   return '';
                }, 0 );
				
	     var UIA = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return 'Total';
                }, 0 );
         var expected = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return total.expected;
                }, 0 );
         var counted = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return total.counted;
                }, 0 );  

          var countedsf = api
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return total.countedsf;
                }, 0 );  

           var countedsr = api
                .column( 9 )
                .data()
                .reduce( function (a, b) {
                    return total.countedsr;
                }, 0 );  
            	
            // Update footer by showing the total with the reference of the column index 
	    	$( api.column( 0 ).footer() ).html('');
            $( api.column( 1 ).footer() ).html(monTotal);
            $( api.column( 2 ).footer() ).html(tueTotal);
            $( api.column( 3 ).footer() ).html(Total);
            $( api.column( 4 ).footer() ).html(Accuracy);
            $( api.column( 5 ).footer() ).html(UIA);
            $( api.column( 6 ).footer() ).html(expected);
            $( api.column( 7 ).footer() ).html(counted);
            $( api.column( 8 ).footer() ).html(countedsf);
            $( api.column( 9 ).footer() ).html(countedsr);
            
            
        },
			
		"scrollY": 500,
		 "oLanguage": {
		    "sSearch": "Sku Search: "
		 },
		});
	}); 	 
}


$("#dataTableFour").append(
	$('<tfoot/>').append("<tr>"+ 
	"<th></th>"+ 
   	"<th></th> "+ 
   	"<th></th>"+ 
   	" <th></th> "+ 
   	"<th>Total</th>"+ 
   	" <th id='Remaining'></th>"+ 
   	" <th id='Expected2'></th>"+ 
   	" <th id='Counted2'></th>"+ 
   	" <th id='CountedSF2'></th>"+ 
   	" <th id='CountedSR2'></th>"+ 
   "</tr>").css("color","#fff")
);

setTimeout(function(){

	abc43();
	gettop20under();
	gettop20over();
	Realtime();

},1000);	

$('.run').on('click',function(){
	
	
   
   	var working = false;
	var $this = $('#stockSummaryFilter');
	var error = 0;

	

  $(".error_msg").html('');


    if($this.find('[name="StoreID"]').val()=="" || $this.find('[name="StoreID"]').val()==null){
		error=1;

		$this.find('.StoreID_error').html('Please Select Store !')				
	}else{
		$this.find('.StoreID_error').html(' ')
	}

	if($this.find('[name="Date"]').val()=="" || $this.find('[name="Date"]').val()==null){
		error=1;
		$this.find('.Date_error').html('Please Select Date !')				
	}else{
		$this.find('.Date_error').html(' ')
	}

 	if(error == 0){
 

 			
		$(".before_load_table").show();
			
			
		setTimeout(function(){

			GraphData();
			main_table.ajax.reload();
			main_table2.ajax.reload();
			main_table3.ajax.reload();
			main_table4.ajax.reload();	
		},1000);
			
		setTimeout(function(){

			$("#run_stock").html('Search');
			$(".data-tables").css('visibility','visible');
			$('.card').removeClass('hide');
	        $(".before_load_table").hide();
	        $('.visibile').removeClass('cardd2');

        	$('.mm-datatable tr th:first-child').click();

			$('.mm-dataTableTwoo tr th:eq(2)').click();

			$('.mm-datatable3 tr th:eq(2)').click();
        	
			$('.mm-dataTableFour tr th:first-child').click();
		},2000);
		
	}else{
		jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
		return false;
	}
});