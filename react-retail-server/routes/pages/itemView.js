var main_table = '';
function getstoreinfo(){
    $(document).ready(function() {
    main_table= $('#dataTable').DataTable( {
            dom: 'Bfrtip',

            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'Product Item Master'
                },{

                    extend: 'print',
                    title: 'Product Item Master'       
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
                'url':'/api/1.0.0/stockCountRecords/itemViewProductItem/',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "departmentid": $('#departmentid').val(),
                        "skucode":$('#skucode').val(),
                        
                    } );
                },
            }, 
            "order": [[1, 'desc']], 
            "responsive": true,
            "columns": [
                { "data": "skucode" },
                { "data": "departmentid" },
                { "data": "ean_no" },
                { "data": "arabic_desc" },
                { "data": "english_desc" },
               
            ],
            "searching": false,
            "select": true
        });
    }); 
}
getstoreinfo()
$('.run').click(function(){
    main_table.ajax.reload(); 
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


