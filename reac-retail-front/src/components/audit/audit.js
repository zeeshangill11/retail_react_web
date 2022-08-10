import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//jQuery libraries

import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';


import Cookies from 'universal-cookie';

export default class audit extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            store_list: [],
            log_list: [],
            store_id: 0,
            log_id: 0,
            rcc: " ",
            utc: "no",
            uae: "yes",
            error_msg: "",
        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
        var log = await common.get_logType();
        this.setState(log_list => ({
            log_list: log
        }));
        console.log(this.state.log_list)

        const server_ip = await new_config.get_server_ip();
        var main_table = ' ';
        var cookies = new Cookies();

        var myToken = cookies.get('myToken');
        console.log(myToken)


        $(document).ready(function () {

            main_table = $('#dataTable').DataTable({
                dom: 'Bfrtip',

                buttons: [
                    {
                        extend: 'excel',
                        title: 'AsnData'
                    }, {

                        extend: 'print',
                        title: 'AsnData'
                    },
                ],
                "pageLength": 25,
                'processing': true,
                'serverSide': true,
                "initComplete": function (settings, json) {
                    $(".data-tables").css('visibility', 'visible');
                    //$(".before_load_table").hide();
                },
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
                },

                'serverMethod': 'post',
                'ajax': {
                    'url': server_ip + 'stockCountRecords/getauditinfo/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "retail_cyclecount_id": $("#rcc").val(),
                                "LogType": $("#LogType").val(),
                                "date": $("#date").val(),
                                "StoreID": $("#StoreID").val(),
                                // "show_uae_time":checkboxValue,
                                // "show_utc_time":checkboxutc_time,	
                            });
                        },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "auditid" },
                    { "data": "audit_text" },
                    { "data": "date" },
                    { "data": "log_type" },
                    { "data": "storeid" },
                    { "data": "Retail_CycleCountID" },
                    { "data": "audit_json" },
                    { "data": "deviceid" },
                ],
                "searching": false,
                "select": true
            });
        });

        $('.run').click(function () {
            main_table.ajax.reload();
        });
        var checkboxValue = false
        $(document).on('change', '#uae_time', function () {
            checkboxValue = $(this).is(':checked');
            $('#utc_time').prop('checked', false)
            main_table.ajax.reload();
        });
        var checkboxutc_time = false;
        $(document).on('change', '#utc_time', function () {
            checkboxutc_time = $(this).is(':checked');
            $('#uae_time').prop('checked', false)
            main_table.ajax.reload();
        });

    }

    handleFromDateChange = date => {
        this.setState({ startDate: date })
    }

    handleToDateChange = date => {
        this.setState({ endDate: date })
    }


    async onTimeChange(event) {
        if (this.state.uae == "yes") {
            this.setState({ utc: 'yes' });
            this.setState({ uae: 'no' });
            console.log(this.state.utc)
            console.log(this.state.uae)
        } else {
            this.setState({ uae: 'yes' });
            this.setState({ utc: 'no' });
            console.log(this.state.utc)
            console.log(this.state.uae)
        }
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
                                                Audit Info
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

                                                    <span id="iot_notification"></span>
                                                    <input className="mx-2" type="text" placeholder="Retail Cyclecount" name="rcc" id="rcc" onChange={(e) => this.setState({ rcc: e.target.value })} value={this.state.rcc ? this.state.rcc.trim() : ""} ></input>
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="LogType" id="LogType" onChange={(e) => this.setState({ log_id: e.target.value })} value={this.state.log_id ? this.state.log_id : 0} >
                                                        <option value="0">All Log</option>
                                                        {this.state.log_list.map((x, y) => <option  value={x.log_type}>{x.log_type}</option>)}
                                                    </select>

                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="StoreID" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                    </select>
                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <DatePicker onChange={this.handleFromDateChange} selected={this.state.startDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                            id="date" name="date" placeholderText="From Date: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>

                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block">Search</button>
                                                    </div>

                                                    <div class="d-inline-block">
                                                        <label>Uae Time</label>
                                                        <input type="checkbox"
                                                            class="d-inline-block"
                                                            id="uae_time"
                                                            name="uae_time"
                                                            style={{ width: "25px" }} />
                                                    </div>
                                                    <div class="d-inline-block">
                                                        <label>Utc Time</label>
                                                        <input type="checkbox"
                                                            class="d-inline-block"
                                                            id="utc_time"
                                                            name="utc_time"
                                                            style={{ width: "25px" }} />
                                                    </div>
                                                    <div className="error_block">
                                                        <span className="error error_msg">{this.state.error_msg}</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="data-tables">
                                                <table id="dataTable" class="text-center mm-datatable" style={{ width: "100%" }}>
                                                    <thead class="bg-light text-capitalize">
                                                        <tr>
                                                            <th>AuditId</th>
                                                            <th>Audit Text</th>
                                                            <th>Date</th>
                                                            <th>Log Type</th>
                                                            <th>Store Name</th>
                                                            <th>Retail CycleCount</th>
                                                            <th>Audit Json</th>
                                                            <th>DeviceId</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </>
        )
    }
}
