import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';

//jQuery libraries

import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class dailyStockCountReport extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            endDate: ''
        };
    }
    componentDidMount = async () => {


        const server_ip = await new_config.get_server_ip();

        var main_table = ' ';

        $(document).ready(function() {
            main_table = $('#dataTable').DataTable( {
                //dom: 'Bfrtip',
                 dom: 'Blrtip',
                buttons: [
                    {
                        extend: 'excelHtml5', 
                        title: 'Stock Summary Details',
                        exportOptions: {
                            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11 ]
                        }
                    },{
    
                        extend: 'print', 
                        title: 'Stock Summary Details',
                        exportOptions: {
                            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11 ]
                        }     
                    },
                ],
                "pageLength": 25,
                'processing': true,
                "initComplete": function( settings, json ) {
                    $(".data-tables").css('visibility','visible');
                    //$(".before_load_table").hide();
                },
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
                },  
                'serverSide': false,
                 'select': true,
                'serverMethod': 'post',
                'ajax': {
                    'url':server_ip+'inventoryData/executiveSummaryDateWise/',
                    "data": 
                    function ( d ) {
                        return $.extend( {}, d, {
                            "from_my_date":$( "#FromDate" ).val(),
                            "to_my_date":$( "#ToDate" ).val(),
                        } );
                    },
                },  
                "responsive": true,
                "columns": [
                    { "data": "date" },
                    { "data": "storename" },
                    { "data": "onhandtotal" },
                    { "data": "inventroycount" },
                    { "data": "item_accuracy" },
                    { "data": "operational_accuracy" },
                    { "data": "onhandmatching"},
                    { "data": "missingtotal"},
                    { "data": "overtotal"},
                    { "data": "critical_out_of_stock"},
                    { "data": "counted_sf"},
                    { "data": "counted_sr"},
    
                ],
                'columnDefs': [ {
                   'targets': [0], /* column index */
                    'orderable': false, /* true or false */
                 }],
                "searching": false,
            });
        });
        $('.run').click(function () {

            main_table.ajax.reload();
        });
    }
    async summaryValidate(event) {
        var error = 0;
        if (this.state.startDate == "" || this.state.startDate == null || this.state.endDate == "" || this.state.endDate == null) {
            error = 1;
            document.getElementById("FromDate").style.borderColor = "red"
            document.getElementById("ToDate").style.borderColor = "red"
            this.setState({ error_msg: "Please Select Both Date!" })
        } else {
            this.setState({ error_msg: "" })
            document.getElementById("StoreID").style.borderColor = "#fff"
        }
        

    }

    async onFromDateChange(event) {
        this.setState({ startDate: event.target.value });
        console.log(this.state.startDate)
    }
    async onToDateChange(event) {
        this.setState({ endDate: event.target.value });
        console.log(this.state.endDate)
    }

    render() {
        return (
            <>
                <Header />
                <TopBar />
                <div className="page-container">
                    <LeftBar />
                    <div className="content-wrapper pb-4">

                        <div className="row">
                            <div className="col-12 mt-1">
                                <div className="card">

                                    <div className="card-header">
                                        <div className="left d-inline-block">
                                            <h4 className="mb-0"> <i className="ti-stats-up" style={{ color: "#000" }}></i>
                                                Daily Stock Count Report
                                            </h4>
                                            <p className="mb-0 dateTime"></p>
                                        </div>
                                        <div className="right d-inline-block float-right mt-2">

                                            <img src="/asserts/images/count/Group 9.png" height='25px' />
                                            <span style={{ cursor: "pointer" }} className="button_print">
                                                <img src="/asserts/images/count/Icon feather-printer.png" height='30px' className="ml-1 mr-1" />
                                            </span>

                                            <span style={{ cursor: "pointer" }} className="buttons_excel2">
                                                <img src="/asserts/images/count/Group 10.png" height='30px' />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="card-body">
                                            <div className="filters pl-1 pt-3 pb-3 pr-3" id="executiveSummaryFitler">
                                                <h4 className="d-inline-block mr-4 mb-0  text-light">Filters</h4>
                                                <div className="mb-0 filter-size">

                                                    <input className="form-control d-inline-block mr-2 datepicker22"
                                                        style={{ color: "#fff !important", width: "160px !important", background: "transparent" }}
                                                        id="FromDate" onChange={(e) => this.setState({ startDate: e.target.value })} value={this.state.startDate ? this.state.startDate : ' '}
                                                        placeholder="From: yyyy-mm-dd" autocomplete="off" type="date"></input>
                                                    <input className="form-control d-inline-block mr-2 datepicker22"
                                                        style={{ color: "#fff !important", width: "160px !important", background: "transparent" }}
                                                        id="ToDate" onChange={(e) => this.setState({ endDate: e.target.value })} value={this.state.endDate ? this.state.endDate : ' '}
                                                        placeholder="From: yyyy-mm-dd" autocomplete="off" type="date"></input>
                                                    <span id="iot_notification"></span>
                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block" onClick={evt => this.summaryValidate(evt)} >Search</button>
                                                    </div>
                                                    <div className="error_block">
                                                        <span className="error error_msg">{this.state.error_msg}</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="data-tables">
                                                <table id="dataTable" className="text-center mm-datatable_inventory">
                                                    <thead className="bg-light text-capitalize">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Store Name</th>
                                                            <th>On hand</th>
                                                            <th>Count</th>
                                                            <th>Item Count Accuracy</th>
                                                            <th>Operational Accuracy</th>
                                                            <th>On hand Matching</th>
                                                            <th>Unders</th>
                                                            <th>Overs</th>
                                                            <th>Critical out of stock</th>
                                                            <th>Front Store</th>
                                                            <th>Back store</th>
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
