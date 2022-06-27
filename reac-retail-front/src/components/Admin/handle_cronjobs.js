import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

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

export default class handle_cronjobs extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            store_list: [],
            procs_list: [],
            store_id: 0,
            procs_id: 0,
            rcc: " ",
            utc: "no",
            uae: "yes",
            Status: '',
        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
        var procs = await common.get_allProcess();
        this.setState(procs_list => ({
            procs_list: procs
        }));
        console.log(this.state.procs_list)

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
                    'processing': '&nbsp; &nbsp; Please wait... <br><div className="spinner"></div>'
                },

                'serverMethod': 'post',
                'ajax': {
                    'url': server_ip + 'stockCountRecords/handlercronjobsApi/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                'Retail_CycleCountID': $('#Retail_CycleCountID').val(),
                                'Date': $('#Date').val(),
                                'status': $('#status').val(),
                                'process_type': $('#process_type').val(),
                                'store_id': $('#store_id').val(),
                            });
                        },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "id" },
                    { "data": "Retail_CycleCountID" },
                    { "data": "DateTIme" },
                    { "data": "store_id" },
                    { "data": "destinationStore" },
                    { "data": "status" },
                    { "data": "process_type" },
                    { "data": 'action' },
                ],
                "searching": false,
                "select": true
            });
        });

        $('.run').click(function () {
            main_table.ajax.reload();
        });
        $(document).on('click', '.cronjob_run', function () {
            var cronjob_id = $(this).attr('cronjob_id');

            $.ajax({
                type: 'POST',
                data: {
                    cronjob_id: cronjob_id
                },
                url: server_ip + "stockCountRecords/updateCronJobtable",
                success: function (data) {
                    var response_data = JSON.parse(data);

                    main_table.ajax.reload();



                }
            });

        });

    }

    handleFromDateChange = date => {
        this.setState({ startDate: date })
    }

    handleToDateChange = date => {
        this.setState({ endDate: date })
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
                                                Cron Jobs
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
                                                    <input className="mx-2" type="text" placeholder="Retail Cyclecount" name="rcc" id="Retail_CycleCountID" onChange={(e) => this.setState({ rcc: e.target.value })} value={this.state.rcc ? this.state.rcc.trim() : ""} ></input>
                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <DatePicker onChange={this.handleFromDateChange} selected={this.state.startDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                            id="Date" name="date" placeholderText="From Date: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>
                                                    <select className="form-control d-inline-block mr-2" name="status" id="status"
                                                        data-live-search="true" defaultValue={this.state.Status}
                                                        onChange={(e) => this.setState({ Status: e.target.value })}>
                                                        <option value="">Select Status</option>
                                                        <option value="1">Done</option>
                                                        <option value="0">Running</option>
                                                    </select>
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="procs" id="process_type" onChange={(e) => this.setState({ procs_id: e.target.value })} value={this.state.procs_id ? this.state.procs_id : 0} >
                                                        <option value="0">All procs</option>
                                                        {this.state.procs_list.map((x, y) => <option value={x.process_type}>{x.process_type}</option>)}
                                                    </select>

                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="store_id" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option key={x.storename} value={x.storename}>{x.storename}</option>)}
                                                    </select>


                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block">Search</button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="data-tables">
                                                <table id="dataTable" class="text-center mm-datatable">
                                                    <thead class="bg-light text-capitalize">
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Retail_CycleCountID</th>
                                                            <th>DateTIme</th>
                                                            <th>Source</th>
                                                            <th>Destination</th>
                                                            <th>Status</th>
                                                            <th>Process</th>
                                                            <th>Action</th>
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
