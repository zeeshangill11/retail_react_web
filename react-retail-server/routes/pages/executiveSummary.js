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
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                   
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');

           // alert( $("#StoreID").val());
        }
    });
}
storeName();

$(".Count22").hide();
$(".Front").hide();
$(".BackStore").hide();

$("#show_over").click(function (){
    if($('#show_over').is(":checked"))
    {
        $(".Count22").show();
        $(".Front").show();
        $(".BackStore").show();
    }
    else
    {

         $(".Count22").hide();
        $(".Front").hide();
        $(".BackStore").hide();
        
    }

});

$(document).on('change','#StoreID',function(){
    //alert( $("#StoreID").val());
    var storeName = $("#StoreID").val();

    if(storeName !== '' && storeName !== undefined){
        //$("#summarydate").val(""); 
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
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/getDepartment",
            data:{
                store_id:storeName
            },
            success: function(data)
            {
                var response_data = JSON.parse(data);
                var department = '';
                //console.log(response_data.length);
                if(response_data.length>0){
                   department += '<option value="" department_id="0">All Department</option>';
                    for(var i = 0; i < response_data.length; i++){
                        department += '<option value="'+response_data[i].departmentid+'">'+
                        response_data[i].departmentid+'</option>';                  
                    }
                    
                }else{
                    department += '<option value="" department_id="0">Department</option>';
                }

                $("#DepartmentID").html(department);
                $('#DepartmentID').selectpicker('refresh'); 

                setTimeout(function(){
                    $("#DepartmentID[name=selValue] option[value='']").val(1);
                    $('#DepartmentID').selectpicker('refresh');
                },100)
            }
        }); 

    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getColors",
        data:{
            store_id:storeName
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Color = '';
            if(response_data.length>0){
                Color += '<option value="">All Colors</option>';
                for(var i = 0; i < response_data.length; i++){
                    Color += '<option value="'+response_data[i].color+'">'+
                    unescape(response_data[i].color)+'</option>';                  
                }
                
            }else{

               Color += '<option value="">Colors</option>';
            }

            $("#Color").html(Color);
            $('#Color').selectpicker('refresh');  
            setTimeout(function(){
                $("#Color[name=selValue] option[value='']").val(1);
                $('#Color').selectpicker('refresh');
            },100)
        }
    });
    
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getSize",
        data:{
            store_id:storeName
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Size = '';
            if(response_data.length>0){
                Size += '<option value="">All Size</option>';
                for(var i = 0; i < response_data.length; i++){
                    Size += '<option value="'+response_data[i].size+'">'+
                    unescape(response_data[i].size)+'</option>';                  
                }  
            }else{

               Size += '<option value="">Size</option>';
            }
            $("#Size").html(Size);
            $('#Size').selectpicker('refresh'); 
            setTimeout(function(){
                $("#Size[name=selValue] option[value='']").val(1);
                $('#Size').selectpicker('refresh');
            },100)      
        }
    });

    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getBrandNameNew",
        data:{
            store_id:storeName
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var brand = '';

            if(response_data.length>0){

                brand += '<option value="" brand_id="0">All Brand</option>';
                for(var i = 0; i < response_data.length; i++){
                   if(response_data[i].brand_name!="")
                   {
                    brand += '<option value="'+response_data[i].brand_name+'">'+unescape(response_data[i].brand_name)+'</option>';                  
                   }
                }
            }else{
                brand += '<option value="" brand_id="0">Brand</option>';
            } 
            $("#BrandID").html(brand);
            $('#BrandID').selectpicker('refresh');
            setTimeout(function(){
                $("#BrandID[name=selValue] option[value='']").val(1);
                $('#BrandID').selectpicker('refresh');
            },100)       
        }
    });


})
$('#StoreID').selectpicker({
    noneSelectedText : 'All Store'
});



function run_cycle_count_Soh(store_name,nextstore){

    $('.stock_download_btn').prop('disabled',true);
    $('.stock_download_btn').html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
    
    var store_name22 = store_name;
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/cronjobs/run_cycle_count",
        data:{
            "store_name":store_name22,
            "token":'innovent@123'
        },
        success: function(data)
        {
            var response_data = data;
            // console.log(data.message);
            if(data.message != null 
                || data.message == 'All Done !.' 
                ){

                swal(data.message, {
                  icon: "success",
                });
                $('.stock_download_btn').html("Refresh");
                $('.stock_download_btn').prop('disabled',false);
                return false;
            }
            else{
                swal(data.message, {
                  icon: "success",
                });
                $('.stock_download_btn').html("Refresh");
                $('.stock_download_btn').prop('disabled',false);
                return false;     
            }
            
        }
    });
}

$(document).on('click','.run_job', function(){
    var storeid = $('#StoreID').val();
    if(storeid!="")
    {
        if(parseInt(jQuery("#onehand span").html())>0)
        {
            $('.alert_msg').text("");
            run_cycle_count_Soh(storeid,'');    
        }
        else
        {
            alert("Please run the report first. Then refresh");
        }
            
    }
    else
    {
        alert("Please run the report first. Then refresh");
    }
        
    
});


onehand=[];
function summary(){
    //alert('ok');
    return new Promise(function(resolve, reject) {
        var dptid = $('#DepartmentID').val();
        var bid = $('#BrandID').val();
        var date = $('#summarydate').val();
        var storeid = $('#StoreID').val();


        var size = $('#Size').val();
        var color = $('#Color').val();

        var mythis = $('#CountDynamic');

        var show_over = "no";
        if($('#show_over').is(":checked"))
        {
           show_over = "yes"; 
        }
     
       
        mythis.find('.waiting').show();
 
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/executiveSummaryController",
            data:{
                "dptid":dptid,
                "bid":bid,
                "date":date,
                "storeid":storeid,
                "size":size,
                "color":color,
                "show_over":show_over
            },
            success: function(data)
            {

                var response_data = JSON.parse(data);
                

                $.ajax({
                    type:'POST',
                    url: "/api/1.0.0/inventoryData/CriticalOutOfStocksummary",
                    data:{
                        "dptid":dptid,
                        "bid":bid,
                        "date":date,
                        "storeid":storeid

                    },
                    success: function(data2){

                        var response_data2 = JSON.parse(data2);

                       // console.log(response_data2[0].CriticalStock);
                    
                        if(response_data2[0].CriticalStock !== null){
                            mythis.find('.waiting').hide();
                            $('#CriticalStock').html('<span class="accu-onhand-vl">'+response_data2[0].CriticalStock+'</span>');
                            
                        }else{
                            mythis.find('.waiting').hide();
                            $('#CriticalStock').html('<span class="accu-onhand-vl">0</span>');
                        }

                        

                var criticalper = response_data2[0].CriticalStock;
              
                 var onehand  = response_data[0].onhandtotal;
                        
                         $.ajax({
                            type:'POST',
                            url: "/api/1.0.0/inventoryData/CriticalOutOfStocksummarypercentage",
                            data:{
                                "dptid":dptid,
                                "bid":bid,
                                "date":date,
                                "storeid":storeid,
                                "criticalper":criticalper,
                                "onehand":onehand
                            },
                            success: function(data22){

                                var response_data22 = JSON.parse(data22);
                                //console.log(response_data22);
                                //console.log("<<<<<<<<<<<"+response_data22[0].criticalperentage);
                                if(response_data22 !=='' && typeof(response_data22[0]) !=="undefined"){
                                    if(response_data22[0].criticalperentage !== null && response_data22[0].criticalperentage !== ''){
                                        mythis.find('.waiting').hide();
                                        $('#criticalper').html('<span class="accu-onhand-vl">'+response_data22[0].criticalperentage+' %</span>');
                                        
                                    }else{
                                        mythis.find('.waiting').hide();
                                        $('#criticalper').html('<span class="accu-onhand-vl">0%</span>');
                                    }
                                }else{
                                    mythis.find('.waiting').hide();
                                    $('#criticalper').html('<span class="accu-onhand-vl">0%</span>');  
                                }    
                            }

                        })

                    }

                })
               
                 
               

                if(response_data[0].onhandtotal !== null){
                    mythis.find('.waiting').hide();
                    $('#onehand').html('<span class="accu-onhand-vl">'+response_data[0].onhandtotal+'</span>');
                    
                }else{
                    mythis.find('.waiting').hide();
                    $('#onehand').html('<span class="accu-onhand-vl">0</span>');
                }
               
                if(response_data[0].inventroycount !== null){
                    mythis.find('.waiting').hide();
                    $('#inventoryCount').html('<span class="accu-count-vl">'+response_data[0].inventroycount+'</span>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#inventoryCount').html('<span class="accu-count-vl">0</span>');
                }
                if(response_data[0].counted_sf !== null){
                    mythis.find('.waiting').hide();
                    $('#frontval').html('<span class="ftbk-vl">'+response_data[0].counted_sf+'</span>'); 
                }else{
                    mythis.find('.waiting').hide();
                    $('#frontval').html('<span class="ftbk-vl">0</span>'); 
                }

                if(response_data[0].counted_sr !== null){
                    mythis.find('.waiting').hide();
                    $('#counted_sr').html('<span class="ftbk-vl">'+response_data[0].counted_sr+'</span>'); 
                }else{
                    mythis.find('.waiting').hide();
                    $('#counted_sr').html('<span class="ftbk-vl">0</span>'); 
                }
                
                if(response_data[0].missingtotal !== null){
                    mythis.find('.waiting').hide();
                    $('#undernum').html('<p>'+response_data[0].missingtotal+'</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#undernum').html('<p>0</p>');
                }

                if(response_data[0].missingpercentage !== null){
                    mythis.find('.waiting').hide();
                    $('#underper').html('<p>'+response_data[0].missingpercentage+'%</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#underper').html('<p>0%</p>');
                }
                
                if(response_data[0].overtotal !== null 
                    && response_data[0].overtotal !== undefined && response_data[0].overtotal !=='null'){
                    mythis.find('.waiting').hide();
                    $('#expectednum').html('<p>'+response_data[0].overtotal+'</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#expectednum').html('<p>0</p>');
                }
               
                if(response_data[0].onhandmatching !== null){
                    mythis.find('.waiting').hide();
                    $('#onehand2').html('<span class="accu-onhand-vl">'+response_data[0].onhandmatching+'</span>');
                    
                }else{
                    mythis.find('.waiting').hide();
                    $('#onehand2').html('<span class="accu-onhand-vl">0</span>');
                }
                
                if(response_data[0].overpercentage !== null){
                    mythis.find('.waiting').hide();
                    $('#expectedper').html('<p >'+response_data[0].overpercentage+'%</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#expectedper').html('<p>0%</p>');
                }
                
                if(response_data[0].item_accuracy !== null){
                    mythis.find('.waiting').hide();
                    $('#item_accuracy').html('<p>'+response_data[0].item_accuracy+'%</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#item_accuracy').html('<p>0%</p>');
                }

                if(response_data[0].operational_accuracy !== null){
                    mythis.find('.waiting').hide();
                    $('#item_accuracy2').html('<p>'+response_data[0].operational_accuracy+'%</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#item_accuracy2').html('<p>0%</p>');
                }

                if(response_data[0].operational_accuracy !== null){
                    mythis.find('.waiting').hide();
                    $('#operational_accuracy').html('<p>'+response_data[0].operational_accuracy+'%</p>');
                }else{
                    mythis.find('.waiting').hide();
                    $('#operational_accuracy').html('<p>0%</p>');
                }    
            }
        });
    });
}


   
   $('#executiveSummary').click(function(){
    //alert($('#summarydate').val())
    //alert('ok')
    var working = false;
    var $this = $('#executiveSummaryFitler');
    var error = 0;
    

    $(".error_msg").html('');
    //$("#executiveSummary").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');  

    if($this.find('[name="SoteID"]').val()=="" || $this.find('[name="SoteID"]').val()==null){
        error=1;
        $this.find("[data-id='StoreID']").css("border-color","red"); 
        $('.StoreID_error').html('Please Select Store!');
                      
    }else{
        $this.find("[data-id='StoreID']").css("border-color","#fff");
        $('.StoreID_error').html('');
                      
    }

    if($this.find('[name="date"]').val()=="" || $this.find('[name="date"]').val()==null){
        error=1;
        $this.find("[valid='Date']").css("border-color","red");
        $('.Date_error').html('Please Select Date !'); 

    }else{
        $this.find("[valid='Date']").css("border-color","#fff");
         $('.Date_error').html(''); 
    }
        
        if(error == 0){
        
            working = true;
            $("#executiveSummary").html('Run');    
           $('.row.ml-0.mr-0').removeClass('hide')
           summary();
        }else{
         jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");

            return false;
        }    
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

function Count(){

    var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
   
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }
    if(department !==''){
        cond +='&department_id='+department
    }
    var show_over = "no";
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }

    var abc ="executiveSummaryCount?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";
    $(".Count22").attr('href',abc);
}

function OneHandSimple(){

    var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
   
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }
    if(department !==''){
        cond +='&department_id='+department
    }

    var show_over = "no"
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }
    
    var abc = "executiveSummaryOnHandSimple?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";
    $(".OneHandSimple").attr('href',abc);
}


function BackStore(){

    var cond = '';
    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
    //alert(department)
   
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }

    if(department !==''){
        cond +='&department_id='+department
    }

    var show_over = "no"
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }

    var param = "BackStore";
    var abc= "executiveSummaryBack?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";
     $(".BackStore").attr('href',abc);
}

function Front(){

    var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
    
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }

    if(department !==''){
        cond +='&department_id='+department
    }

    var show_over = "no"
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }

    var abc ="executiveSummaryFront?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";
    $(".Front").attr('href',abc);

}



function OnHandMatching(){

    var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
    
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }

    if(department !==''){
        cond +='&department_id='+department
    }

    var show_over = "no";
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }



    var abc="executiveSummaryOnHand?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";
   
    $(".OnHandMatching").attr('href',abc);
}



function Unders(){

   var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
    
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }

    if(department !==''){
        cond +='&department_id='+department
    }
    var show_over = "no";
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }


    var abc="underOvers?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";

   
    $(".Unders").attr('href',abc);
}
   
function AllOvers(){

   var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
    
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }

    if(department !==''){
        cond +='&department_id='+department
    }

    var show_over = "no";
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }

   var  abc="AllOvers?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";

   
    $(".AllOvers").attr('href',abc);
}

function CriticalOutOfStock(){

   var cond = '';

    var date = $('#summarydate').val();
    var storeid = $('#StoreID').val();
    var brand_name = $('#BrandID').val();
    var department = $('#DepartmentID').val();
    
    if(brand_name !==''){

        cond +='&brand_id='+brand_name
    }

    if(department !==''){
        cond +='&department_id='+department
    }
    
    var show_over = "no";
    if($('#show_over').is(":checked"))
    {
       show_over = "yes"; 
    }

    var abc ="CriticalOutOfStock?date="+date+"&store_id="+storeid+"&show_over="+show_over+cond+"";
    $(".CriticalOutOfStock").attr('href',abc);
}
   
function get_iot_notification(){

    var storeid = $('#StoreID').val();
    var date = $('#summarydate').val();


    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/get_iot_notification_date",
        data:{
            store_id:storeid,
            iot_date:date
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);
          
            var return_data = response_data[0];


            var status  = 1; 
            
            if(response_data !=="" && response_data !== undefined 
                ){
                try{
                    status = parseInt(return_data.status);
                }catch{

                }
                
                if(status == 0){
                    
                    $(".alert_msg").html('<div class="alert alert-danger">Please click the refresh button for latest records !</div>');
                    // swal({
                    //     title: 'Please click the refresh button for latest records !',
                    //     icon: "warning"
                    // });
                    
                }else{
                    $('.alert_msg').text("")
                    $('#iot_notification').text(" ")

                   
                  
                }
            }else{

                swal({
                    title: 'Soh not Available for this store !',
                    icon: "warning"
                });
               
            
            }
            // console.log(return_data.status);
            
        }
    });

    
}   

function check_permissions(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getuserPermissions",
        success: function(data)
        {
            if(isJson(data)){
                response = JSON.parse(data);
                response = response.map(v => v.toLowerCase());
            }else{
                response = data ;  
            }

            if($.inArray('show_over_check', response) !== -1){
                $('#show_over_checkbox').show();
            } else {
                $('#show_over_checkbox').hide();
            }
        }
    });
}
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    } 
    return true;
}


$(document).ready(function(){
    check_permissions();
    jQuery("#executiveSummary").on("click",function (){

        $('.alert_msg').text("")
        setTimeout(function(){
            Count();
            OneHandSimple();
            BackStore();
            Front();
            OnHandMatching();
            Unders();
            AllOvers();
            CriticalOutOfStock();
            get_iot_notification();
        },500);
    });    
});

$('#StoreID').selectpicker({
    noneSelectedText : 'All Store'
});
$('#BrandID').selectpicker({
    noneSelectedText : 'All Brand'
});
$('#DepartmentID').selectpicker({
    noneSelectedText : 'All Department'
});
$('#Size').selectpicker({
    noneSelectedText : 'All Size'
});
$('#Color').selectpicker({
    noneSelectedText : 'All Color'
});
