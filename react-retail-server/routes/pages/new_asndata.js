    var main_table = '';

	$(document).ready(function() {
	main_table=	$('#dataTable').DataTable( {
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
			'processing': true,
            "initComplete": function( settings, json ) {
                // $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/new_getasndata/',
				"data": 
				function ( d ) {
                    return $.extend( {}, d, {
                        "source": $('#source').val(),
                        "Date":$('#Date').val(),
                        "Asn":$('#Asn').val(),
                    } );
                },
			},	
			"responsive": true,
			"columns": [
				{ "data": "date" },
                { "data": "asn" },
                { "data": "source" },
                { "data": "destination" },
                { "data": "packed_item" },
                { "data": "transferred_item" },
                { "data": "received_item" },
                { "data": "status" },
                { "data": "action" },
			],
            "searching": false,
            'columnDefs': [ {
                'targets': [7,8], /* column index */
                'orderable': false, /* true or false */
             }],
            "order": [[ 0, 'desc' ]],
		});
	}); 

$('.run').click(function(){

    var $this = $('#StoreID');
    var error = 0;

    // var StoreID = $('#source').val();
    // if(StoreID == ''){
    //     error = 1;

    //     $('.error_source').html('<span>Plesae Select Store</span>');
    // }else{
    //     $('.error_source').html('<span></span>');
    // }
    

    if(error == 0){
    
        $(".data-tables").css('visibility','visible');
        main_table.ajax.reload();
    }
});


function getasnDetails(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var Type = '';
            Type += '<option value="all_store">All Store</option>';
            for(var i = 0; i < response_data.length; i++){
                Type += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#source").html(Type);
            $('#source').selectpicker('refresh');
             
        }
    });
}
getasnDetails();



function GetDateASN(){
    var datesArray = [];
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/GetAsnDataDate",
            success: function(data)
            {
                var response_data = JSON.parse(data);
                var temp='';
                var new_date='';
                for(var i  = 0; i < response_data.length; i++){
                    temp     = (response_data[i].date).split("-");
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
GetDateASN();


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");



$(document).on('click','.cancel_asn', function(){

	var asn_id = $(this).attr('asn_id')	
    $.ajax({
        type:'POST',
        data:{
        	asn_id:asn_id,
        	
        },
        url: "/api/1.0.0/stockCountRecords/New_CancelRequestAsn",
        success: function(data)
        {
            var response_data = JSON.parse(data);
   			main_table.ajax.reload();         
        }

    });
});

$(document).on('click','.asn_details', function(){  

    var asn_id = $(this).attr('asn_id');
   
    window.location.href="view_asndetails?asn_id="+asn_id;
});

$(document).on('click','.asn_info_model', function(){   

    var asn_id = $(this).attr('asn_id');
    var process_status = $(this).attr('process_status');    
    window.open("view_asndetails?asn_id="+asn_id+"&process="+process_status, '_blank'); 
    //window.location.href="view_asndetails?asn_id="+asn_id+"&process="+process_status;
});