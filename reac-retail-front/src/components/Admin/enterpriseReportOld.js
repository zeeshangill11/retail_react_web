import React, { Component } from 'react'
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
// import { Link } from "react-router-dom";

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
// import swal from 'sweetalert';

export default class enterpriseReportOld extends Component {
    constructor(props) {

        super(props);
        this.state = {
            store_list: [],
            store_id: 0,
            startDate: '',
            endDate: '',
            ibt: " ",
            check: false,
        };
    }

    async onShowOverChange(event) {
        if (event.target.checked) {
            this.setState({ check: true });
        } else {
            this.setState({ check: false });
        }
    }
    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
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
                    'url': server_ip + 'inventoryData/getStockCountOldDataReprt/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "storeid": $("#StoreID").val(),
                                "from_my_date": $("#Date").val(),
                                "to_my_date": $('#EndDate').val(),
                            });
                        },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "date" },
                    { "data": "storename" },
                    { "data": "onhandtotal" },
                    { "data": "inventroycount" },
                    { "data": "item_accuracy" },
                    { "data": "operational_accuracy" },
                    { "data": "onhandmatching" },
                    { "data": "missingtotal" },
                    { "data": "overtotal" },
                    { "data": "critical_out_of_stock" },
                    { "data": "counted_sf" },
                    { "data": "counted_sr" },

                ],
                "searching": false,
                "select": true
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
                                                Stock Summary Details
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
                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <DatePicker onChange={this.handleFromDateChange} selected={this.state.startDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                            id="Date" name="date" placeholderText="From Date: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>
                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <DatePicker onChange={this.handleToDateChange} selected={this.state.endDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                            id="EndDate" name="date" placeholderText="End Date: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="StoreID" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option key={x.storename} value={x.storename}>{x.storename}</option>)}
                                                    </select>

                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block">Search</button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="data-tables">
                                                <table id="dataTable" class="text-center mm-datatable" style={{ width: "100%" }}>
                                                    <thead class="bg-light text-capitalize">
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
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </>
        )
    }
}
