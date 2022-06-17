import React, { Component } from "react";
import new_config from '../../services/config';
import provider from '../../services/executiveSummaryJS';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

import Header from  '../header/header';
import TopBar from  '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
 
//jQuery libraries
 
import 'jquery/dist/jquery.min.js';
 
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 
 
import Cookies from 'universal-cookie';



export default class handheldDevices extends Component {

	
	
	constructor(props) {
		super(props);
		this.state = {
			datatable:[], 
		 	store_list:[],
		};
	}

	async componentDidMount()
	{
		var stores = await common.get_stores();
	  	this.setState( store_list => ({store_list: stores}) );
		
		var server_ip = await new_config.get_server_ip();
		const params = new URLSearchParams(window.location.search)

		var storeid = params.get('storeid');

		if(storeid !==''){
			var store_name = storeid;
		}
		
var cookies = new Cookies();
var myToken = cookies.get('myToken');

		var main_table = [];
		$(document).ready(function() {
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
					'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
					"data": 
					function ( d ) {
						return $.extend( {}, d, {
							"StoreID": $("#StoreID").val(),
							"DeviceID":$("#DeviceID").val()
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
				'columnDefs': [{
					'targets': [2,5,6], /* column index */
					'orderable': false, /* true or false */
				}],
				"searching": false,
			})
			$(document).on("click",'.deleteRecord',function() {
				var del_id = $(this).attr('del_id');
				if (window.confirm('Are you really wants to delete the device ?')) {
					fetch( server_ip+'stockCountRecords/DeleteDeviceHandheld', {
					    method: 'POST',
					    headers: {
					      'Content-Type': 'application/x-www-form-urlencoded',
					      'Connection': 'keep-alive',
					    },
					    body: "id="+del_id,
					})
					.then((response) => response.json())
					.then((responseJson) => {
						var temp = responseJson; 
						if(temp.status == 1){
							main_table.ajax.reload();
						}
						console.log(temp);
					}).catch((error) => console.error(error)).finally();
				}
			})
		}); 
		$('.run').click(function(){
			main_table.ajax.reload();
		});





	}
	render() {
		
		var datatable = this.state.datatable;		
	 
	
		return ( 
			<>
			<Header />
			<TopBar />
			<div className="page-container">
			  <LeftBar />
			  <div className="main-content">
			    <div className="content-wrapper pb-4">
			      <div className="BtnAddLis">
			        <Link to="/executiveSummary" className="btn btn-danger BtnAdd"> Back </Link>
			      </div>
			      <div className="row">
			        <div className="col-12 mt-1">
			          <div className="card">
			            <div className="card-header">
			              <div className="left d-inline-block">
			                <h4 className="mb-0"> <i className="ti-stats-up" style={{color:"#000"}}></i> 
			                  One Hand
			                </h4>
			                <p className="mb-0 dateTime"></p>
			              </div>
			              <div className="right d-inline-block float-right mt-2">
			                <img src="/asserts/images/count/Group 9.png" height='25px' />
			                <span style={{cursor:"pointer"}} className="button_print">
			                <img src="/asserts/images/count/Icon feather-printer.png" height='30px' className="ml-1 mr-1" />
			                </span>																						
			                <span style={{cursor:"pointer"}} className="buttons_excel2">
			                <img src="/asserts/images/count/Group 10.png" height='30px' />
			                </span>
			              </div>
			            </div>
			            <div className="card-body">
			              <div className="container">
			                <div className="row custom-filter">
			                  <h4 className="light d-inline-block mr-4 mb-0">Filters</h4>
			                  <div className="col-md-2">
			                    <form action="" >
			                      <div className="form-group">
			                        <select 
			                          name="StoreID" className="form-control selectpicker" 
			                          id="StoreID" data-live-search="true">
			                          <option value="0">Location</option>
			                          {this.state.store_list.map((x,y) => <option value={x.storename}>{x.storename}</option> ) }
			                        </select>
			                      </div>
			                    </form>
			                  </div>
			                  <div className="col-md-2">
			                    <form>
			                      <div className="form-group">
			                        <select 
			                          name="DeviceID" className="form-control selectpicker" 
			                          id="DeviceID" data-live-search="true">
			                          <option value="0">DeviceID</option>
			                        </select>
			                      </div>
			                    </form>
			                  </div>
			                  <div className="col-md-3 mb-3">
			                    <div className="form-group" style={{marginLeft: "-15px"}}>          
			                    <button type="button" 
			                      className="btn btn-danger btn-md run btn-block" 
			                      >Search</button>
			                  </div>
			                </div>
			                <div className="col-md-3">
			                  <Link className="btn btn-danger BtnAdd float-right" to="/addhandheldDevice">Add Deveice</Link>
			                </div>
			              </div>
			            </div>
			            <div className="before_load_table" style={{display:"none"}}>
			              <img src="/asserts/images/waiting_before_table_load.gif" />
			            </div>
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
			                <tbody></tbody>
			              </table>
			            </div>
			          </div>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
			</div>
		</>
		);


	}

	

}
