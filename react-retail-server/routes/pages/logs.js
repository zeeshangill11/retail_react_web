var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");


var main_table = '';
function logs(){
  $(document).ready(function() {
    main_table=$('#dataTable').DataTable( {

          dom: 'Bfrtip',
          buttons: [
              {
                  extend: 'excel',
                  action: newExportAction,
                  title: 'logs'
              },{

                  extend: 'print',
                  title: 'logs'    
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
              'url':  '/api/1.0.0/api/getCustomLogs',
              "data": 
              function ( d ) {
                  return $.extend( {}, d, {
                      "Type": $('#Type').val(),
                      "Date":$('#Date').val(),    
                  } );
              },     
          },  
          "responsive": true,
          "columns": [
              { "data": "id" },
              { "data": "type" },
              { "data": "datetime" },
               { "data": "custom_msg" },
              { "data": "system_msg" },
             
          ],
          'columnDefs': [ {
                 /* column index */
                'orderable': false, /* true or false */
             }],
          "searching": false,
      });

  }); 
}
logs();

$('.run').click(function(){
  // alert($('#Date').val());
  main_table.ajax.reload();
});