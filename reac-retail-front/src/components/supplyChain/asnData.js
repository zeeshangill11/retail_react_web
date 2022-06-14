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

export default class asnData extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            endDate: '',
            store_list: [],
            asn_list: [],
            status_list: [],
            onhandtotal: 0,
            store_id: 0,
            asn_id: 0,
            status_id: 0,
            Remarks: ' ',
            IBT: ' '
        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
        var asn = await common.get_asnDestination();
        this.setState(asn_list => ({
            asn_list: asn
        }));
        var status = await common.get_allStatus();
        console.log(status)
        this.setState(status_list => ({
            status_list: status
        }));

        const server_ip = await new_config.get_server_ip();
        var main_table = ' ';

        $(document).ready(function () {

            main_table = $('#dataTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        title: 'IBT Data'
                    }, {

                        extend: 'print',
                        title: 'IBT Data'
                    },
                ],
                "pageLength": 25,
                "order": [[0, "desc"]],
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
                    'url': server_ip + 'stockCountRecords/getasndata/',
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "from_my_date": $("#FromDate").val(),
                                "to_my_date": $('#ToDate').val(),
                                "source": $('#StoreID').val(),
                                "Destination": $('#AsnID').val(),
                                "Status": $('#StatusID').val(),
                                "Remarks": $('#Remarks').val(),
                                "Asn": $('#IBT').val()

                            });
                        },
                },
                "responsive": true,
                "columns": [
                    { "data": "asn" },
                    { "data": "source" },
                    { "data": "destination" },
                    { "data": "packed_item_new" },
                    { "data": "transferred_item_new" },
                    { "data": "received_item_new" },
                    { "data": "status" },
                    { "data": "packing_date" },
                    { "data": "packing_remarks" },
                    { "data": "shipping_date" },
                    { "data": "shipping_remarks" }
                ],
                "searching": false,
                "select": true,
                "order": [[0, 'desc']],
            });
        });

        $('.run').click(function () {

            main_table.ajax.reload();
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
                                                IBT Data
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
                                                    <DatePicker onChange={this.handleFromDateChange} selected={this.state.startDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                        id="FromDate" name="FromDate" placeholderText="From Date: yyyy-mm-dd"
                                                        dateFormat="yyyy-MM-dd" />

                                                    <DatePicker onChange={this.handleToDateChange} selected={this.state.endDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                        id="ToDate" name="ToDate" placeholderText="To Date: yyyy-mm-dd"
                                                        dateFormat="yyyy-MM-dd" />

                                                    <span id="iot_notification"></span>
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="StoreID" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                    </select>
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="AsnID" id="AsnID" onChange={(e) => this.setState({ asn_id: e.target.value })} value={this.state.asn_id ? this.state.asn_id : 0} >
                                                        <option value="">All Destination</option>
                                                        {this.state.asn_list.map((x, y) => <option value={x.destination}>{x.destination}</option>)}
                                                    </select>
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StatusID" id="StatusID" onChange={(e) => this.setState({ status_id: e.target.value })} value={this.state.status_id ? this.state.status_id : 0} >
                                                        <option value="">All Status</option>
                                                        {this.state.status_list.map((x, y) => <option value={x.status}>{x.status}</option>)}
                                                    </select>
                                                    <input className="mx-2" type="text" placeholder="Remarks" name="Remarks" id="Remarks" onChange={(e) => this.setState({ Remarks: e.target.value })} value={this.state.Remarks ? this.state.Remarks.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="IBT" name="IBT" id="IBT" onChange={(e) => this.setState({ IBT: e.target.value })} value={this.state.IBT ? this.state.IBT.trim() : ""} ></input>
                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block" >Search</button>
                                                    </div>
                                                    <div className="error_block">
                                                        <span className="error error_msg">{this.state.error_msg}</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="data-tables">
                                                <table id="dataTable" class="text-center mm-datatable">
                                                    <thead class="bg-light text-capitalize">
                                                        <tr>
                                                            <th>IBT</th>
                                                            <th>Source</th>
                                                            <th>Destination</th>
                                                            <th>Packed Items</th>
                                                            <th>Transfer Items</th>
                                                            <th>Received Items</th>
                                                            <th>Status</th>
                                                            <th>Packing Date</th>
                                                            <th>Packing Remarks</th>
                                                            <th>Shipping Date</th>
                                                            <th>Shipping Remarks</th>
                                                            {/* <th>Receiving Date</th>
                                                            <th>Receiving Remarks</th> */}
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
