var main_table = [];
function ExecutiveSummaryOnHand(){
    $(document).ready(function() {
       
       const params = new URLSearchParams(window.location.search)

        var date = params.get('date');
        var store_id = params.get('store_id');
        //alert(store_id)
        var brand_id = '';
        var brand_id = params.get('brand_id');
        var department_id = '';
        var department_id = params.get('department_id');

       
        if(brand_id !==''){
            brand = brand_id;
        }
        
        if(department_id !==''){
            department = department_id
        }

       
     main_table = $('#dataTable').DataTable( {
        dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'ExecutiveSummaryOnHand'
                },{

                    extend: 'print',
                    title: 'ExecutiveSummaryOnHand'      
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
                'url':'/api/1.0.0/inventoryData/OnHandMatchingDetails',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "date": date,
                        "storeid": store_id,
                        "bid": brand,
                        "dptid":department   
                    } );
                },
            },
                
            "responsive": true,
            "columns": [
                { "data": "code" },
                { "data": "departmentname" },
                { "data": "brand" },
                { "data": "color" },
                { "data": "size" },
                { "data": "initial" },
                { "data": "counted" },
                { "data": "overs" },
            ],
            "searching": false,
             'columnDefs': [ {
                'targets': [6,7], /* column index */
                'orderable': false, /* true or false */
             }],
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

ExecutiveSummaryOnHand();
