import React, { Component } from "react";
import new_config from '../../services/config';
import provider from '../../services/executiveSummaryJS';
import common from '../../services/commonFunctionsJS';

 
//jQuery libraries
 
import 'jquery/dist/jquery.min.js';
 
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 
 
 



export default class handheldDevices extends Component {

	
	
	constructor(props) {
  	super(props);
    this.state = {
	    datatable:[], 
	   
    };
    
   

	}
  
	async componentDidMount()
	{

		
		var server_ip = await new_config.get_server_ip();
		const params = new URLSearchParams(window.location.search)

		var storeid = params.get('storeid');

		if(storeid !==''){
			var store_name = storeid;
		}

		var main_table = [];
		alert(server_ip);
		$(document).ready(function() {
			alert('a');
			main_table = $('#dataTable').DataTable({
				dom: 'Bfrtip',
		        buttons: [
		            {
		                extend: 'excel',
		              
		                title: 'HandHeldDevice'
		            },{

	                	extend: 'print',
	                	title: 'HandHeldDevice'		
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
		            'processing': '&nbsp; &nbsp; Please wait... <br><div className="spinner"></div>'
		        },  
				'serverSide': true,
				'serverMethod': 'post',
				'ajax': {
					'url':server_ip+'stockCountRecords/gethandhelddevice',
					"data": 
					function ( d ) {
						return $.extend( {}, d, {
							"StoreID": "0002115",
							"DeviceID":""
						
						} );
					},
				},
					
				"responsive": true,
				"columns": [
					{ "data": "username" },
					{ "data": "description" },
					{ "data": "status" },
					{ "data": "storeid" },
					{ "data": "uuid" },
	                { "data": "qr_code" },
	                { "data": "action" },
				],
				 'columnDefs': [ {
	                'targets': [2,5,6], /* column index */
	                'orderable': false, /* true or false */
	             }],
				"searching": false,
			})
		}); 
	

		$('.run').click(function(){
   		alert('aa');
			var location = $( "#StoreID" ).val();
			var deveice =	$( "#DeviceID" ).val();
			main_table.ajax.reload();
		});





	}
  render() {
	 	
   	var datatable = this.state.datatable;		
   
  
    return (  
      <>
      <div >
        
      		<button className="run">RUN</button>
          <div className="data-tables">
              <table id="dataTable" className="text-center mm-datatable" >
                  <thead className="text-capitalize">
                      <tr>  
                          <th>UserName</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Location</th>
                          <th>UUID</th>
                          <th>Qr Code</th>
                          <th>Action</th>                                           
                      </tr>
                  </thead>
                  <tbody>

                  </tbody>
              </table>
          </div>

       </div>
      </>
    );


  }

  

}
