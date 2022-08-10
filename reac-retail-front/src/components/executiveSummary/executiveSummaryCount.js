import React, { Component } from "react";
import new_config from '../../services/config';
// import common from '../../services/commonFunctionsJS';
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
 
export default class executiveSummaryCount extends Component {
    constructor(props) {
      super(props);
    }
    async componentDidMount() {
        var server_ip = await new_config.get_server_ip();
        const params = new URLSearchParams(window.location.search)

        var date = this.props.location.state.date;
        var store_id = this.props.location.state.store_id;

        var show_over = this.props.location.state.show_over;
        
        var brand = this.props.location.state.brand_id;
        var department = this.props.location.state.department_id;

        var cookies = new Cookies();
var myToken = cookies.get('myToken');
        var main_table = [];
        $(document).ready(function () {
        
        main_table = $('#dataTable').DataTable( {
         dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
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
              'url':server_ip+'inventoryData/CountExecutiveSummary',
              'beforeSend': function (request) {
                request.setRequestHeader("auth-token", myToken);
            },
              "data": 
              function ( d ) {
                return $.extend( {}, d, {
                  "date": date,
                  "storeid": store_id,
                  "bid": brand,
                  "dptid":department,
                  "show_over":show_over  
                });
              },
            },
            "responsive": true,
            "columns": [
				{ "data": "epc" },
				{ "data": "item_code" },
				{ "data": "user" },
				{ "data": "zone" },
				{ "data": "brand" },
				{ "data": "color" },
				{ "data": "season" },
				{ "data": "supplier_name" },
				{ "data": "price" },
				{ "data": "total_price" },
            ],
            'columnDefs': [ {
                'targets': [6,7], /* column index */
                'orderable': false, /* true or false */
             }],
            "searching": false,
        })
        });


        $('.run').click(function () {
            alert('aa');
            main_table.ajax.reload();
        });
    }
    render() {
        return(
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
					                            Count 
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
                                        <div className="before_load_table">
                                            <img src="/asserts/images/waiting_before_table_load.gif" />
                                        </div>
                                        <div className="data-tables">
                                            <table id="dataTable" className="text-center mm-datatable">
                                                <thead className="bg-light text-capitalize">
                                                    <tr>
                                                      	<th>Epc</th>
					                                    <th>Item Code</th>
					                                    <th>User</th>
					                                    <th>Zone</th>
					                                    <th>Brand</th>
					                                    <th>Color</th>
					                                    <th>Season</th>
					                                    <th>Supplier Name</th>
					                                    <th>Price</th>
					                                    <th>Total Price</th>                                   
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                </tbody>
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
        )
    }
}