var main_table = [];
function ExecutiveSummaryReport(){
    $(document).ready(function() {
    main_table = $('#dataTable').DataTable( {
            "pageLength": 25,
            'processing': true,
            'serverSide': true,
            'serverMethod': 'post',
            'ajax': {
                'url':'/api/1.0.0/stockCountRecords/ExecutiveSummaryReport',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "StoreID": $( "#StoreID" ).val(),
                        "DeviceID":$('#DeviceID').val(),    
                    } );
                },
            },
                
            "responsive": true,
            "columns": [
                { "data": "code" },
                { "data": "initial" },
                { "data": "counted" },
                { "data": "unexpected" },
                { "data": "missing" },
                { "data": "expected" },
            ],
            "searching": false,
        })
    }); 
}

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");                              

ExecutiveSummaryReport();

