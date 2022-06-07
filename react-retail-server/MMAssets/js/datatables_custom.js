
var oldExportAction = function (self, e, dt, button, config) {
    if (button[0].className.indexOf('buttons-excel') >= 0) {
        if ($.fn.dataTable.ext.buttons.excelHtml5.available(dt, config)) {
            $.fn.dataTable.ext.buttons.excelHtml5.action.call(self, e, dt, button, config);
        }
        else {
            $.fn.dataTable.ext.buttons.excelFlash.action.call(self, e, dt, button, config);
        }
    } else if (button[0].className.indexOf('buttons-print') >= 0) {
        $.fn.dataTable.ext.buttons.print.action(e, dt, button, config);
    }
};

var count_before_check =0;
//e, dt, button, config
var newExportAction22 = function (e, dt, button, config) {
    var self = this;
    var oldStart = dt.settings()[0]._iDisplayStart;

    dt.one('preXhr', function (e, s, data) {
        
        data.start = 0;
        data.length = 2147483647;

        dt.one('preDraw', function (e, settings) {
            
            count_before_check =count_before_check +1;
            if(count_before_check ==2)
            {   
                oldExportAction(self, e, dt, button, config);
                count_before_check =0;    
            }
           

            dt.one('preXhr', function (e, s, data) {
                
                settings._iDisplayStart = oldStart;
                data.start = oldStart;
            });

           
            setTimeout(dt.ajax.reload, 0);

            
            return false;
        });
    });

   
    dt.ajax.reload();
};
//e, dt, button, config
var newExportAction = function () {

}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    
    
    CSV += ReportTitle + '\r\n\n';

    
    if (ShowLabel) {

        var row = "";
         
        var table = $(".dataTable thead");
        table.find('th').each(function (i, el) {
            if( $(this).text()!="Action" 
                && $(this).text()!="ZPL" 
                && $(this).text()!="Permissions"
                && $(this).text()!="Qr Code"

                )
            {
                row += $(this).text()+ ','; 
            }
           
        }); 

        row = row.slice(0, -1);
        
        CSV += row + '\r\n';
    }
   
   
    if(arrData.length>0){


       

            
                
           
               
                setTimeout(function(){
                  for (var i = 0; i < arrData.length; i++) {
                    var row2 = "";
                    //var value22='';
                    for (var index in arrData[i]) {
                        if(index!="action" 
                            && index!="zplbutton" 
                            && index!="viewpermissions" 
                            && index!="qr_code" 


                            )
                        {
                            if(index )
                            {
                               row2 += '"'+ arrData[i][index] + '",';
                            }
                            else
                            {

                                 row2 += '"-",';  
                                // value22=arrData[i][index];
                                // value22 = value22.split("null").join("");
                                
                                
                            }
                            
                        }
                        
                    }

                    row2 = row2.replace(/<A[^>]*>|<\/A>/g, "");
                    row2 = row2.replace(/<img[^>]*>/gi,""); 
                    row2 = row2.replace(/<input[^>]*>|<\/input>/gi, ""); 
                    row2 = row2.replace(/<button[^>]*>|<\/button>/gi, "");

                    row2.slice(0, row.length - 1);
                    
                    
                    CSV += row2 + '\r\n';
                }

                if (CSV == '') {        
                    alert("Invalid data");
                    return;
                }

                var fileName = ReportTitle;
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV); 
                var link = document.createElement("a");    
                link.href = uri;
                if(uri){        
                    link.style = "visibility:hidden";
                    link.download = fileName + ".csv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    $('#dataTable_processing').hide();
                }       
                swal.close();
                },1000)
                
               


           



    }else{
        swal({
            title: 'Empty Report !',
            icon: "warning"
        });
        return false;
    }    

    
   
}


$(document).ready(function (){ 

    $(document).on("click",".buttons_excel2",function (){
        
       var dataa = main_table.ajax.params();
       dataa.length = 10000000000000000;
       dataa.export_excel = 'yes';
       var ajax_url = main_table.ajax.url();
       var ajax_url22 = main_table.ajax.url();
       ajax_url22 = ajax_url22.split('/')
       ajax_url22 = ajax_url22[4]; 
        
        if (!window.location.origin){
         
          window.location.origin = window.location.protocol + "//" + (window.location.port ? ':' + window.location.port : '');      
        }

        url2 = window.location.origin;




        var total_val = $(".dataTables_info").text();
        total_val     = total_val.split('of')
        total_val     = (total_val[1]).split(' ');
        total_val     = total_val[1];
        total_val     = total_val.split(",").join("");
        
       
        if(parseInt(total_val) >=1000 )
        {
         
            swal({
              title: "Are you sure?",
              text: " You might be some wait because total : "+(total_val),
              icon: "warning",
              buttons: ["cancel", "Download"],
              dangerMode: true,
            })
            .then(download => { 
                $('#dataTable_processing').show();
                $.ajax({
                    type:'POST',
                    url:url2+ajax_url,
                    data:dataa,
                    success:function(data){

                        var response_set = JSON.parse(data)

                        var result_set = response_set.aaData;

                        JSONToCSVConvertor(result_set, ajax_url22, true);
                       
                    }
                })

            }) 
            .catch(err => {
              if (err) {
                
              } else {
                swal.stopLoading();
                swal.close();
              }
            });

        }
        else
        {
            $('#dataTable_processing').show();
            $.ajax({
            type:'POST',
            url:url2+ajax_url,
            data:dataa,
            success:function(data){

            var response_set = JSON.parse(data)

            var result_set = response_set.aaData;

            JSONToCSVConvertor(result_set, ajax_url22, true);

            }
            })
        } 
       
        
      
       
    });

    $(document).on('click','.button_print',function(){
       
        $(this).parents('.card').find('.buttons-print').click();

        var mythis = $(this);
        setTimeout(function (){
            mythis.parents(".card").find(".buttons-print").click(); 
        }, 2000);
       
    });

    $(document).on('click','.button_print_count',function(){
        if($(".datepicker22").val()!="" && $("#StoreID").val()!="")
        {
            $(this).parents('.card').find('.buttons-print').click();
            var mythis = $(this);
            setTimeout(function (){
                mythis.parents(".card").find(".buttons-print").click(); 
            }, 2000);
        }
    });

    $(document).on("click",".buttons_excel_count",function (){

        if($(".datepicker22").val()!="" && $("#StoreID").val()!="")
        {
            $(this).parents(".card").find(".buttons-excel").click(); 
            var mythis = $(this);
            setTimeout(function (){
                mythis.parents(".card").find(".buttons-excel").click(); 
            }, 2000);
        }    
    });



   
});
