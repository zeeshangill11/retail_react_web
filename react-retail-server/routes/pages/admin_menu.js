var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");  



function Run_CronJob(){

    $.ajax({
        type:'POST',
        url: "/api/1.0.0/cronjobs/CronJobRun30",
        success:function(data){
            
            swal("Run Successfully !");
            

        }
    })
}

$(document).on('click','.run_cron_job', function(){
   
    Run_CronJob();
});                        

