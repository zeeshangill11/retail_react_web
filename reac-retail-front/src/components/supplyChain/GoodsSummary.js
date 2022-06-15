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

export default class GoodsSummary extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            endDate: '',
            store_list: [],
            store_id: 0,
            BachId: ' '
        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));

        const server_ip = await new_config.get_server_ip();
        var main_table = ' ';

        $(document).ready(function () {

            //$(".before_load_table").hide();
            main_table = $('#dataTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        title: 'GoodsStockStore'
                    }, {

                        extend: 'print',
                        title: 'GoodsStockStore'
                    },
                ],
                "pageLength": 25,
                "order": [[0, "desc"]],
                'processing': true,
                'serverSide': true,
                "initComplete": function (settings, json) {
                    $(".data-tables").css('visibility', 'visible');

                },
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
                },
                'serverMethod': 'post',
                'ajax': {
                    'url': server_ip + 'stockCountRecords/getgoodssummary/',
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "store_id": $("#StoreID").val(),
                                "RetailItemBatchId": $("#RetailItemBatchId").val(),
                                "from_my_date": $("#FromDate").val(),
                                "to_my_date": $('#ToDate').val(),
                            });
                        },
                },
                "responsive": true,
                "columns": [
                    { "data": "store" },
                    { "data": "retail_item_batch_id" },
                    { "data": "item_count" },
                    { "data": "date" }


                ],
                'columnDefs': [{
                    'targets': [0, 1, 2, 3], /* column index */
                    'orderable': false, /* true or false */
                }],
                "searching": false,
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
                                            Goods Summary
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
                                                    <input className="mx-2" type="text" placeholder="Retail Item BatchId" name="Retail_Item_Batch_Id" id="Retail_Item_Batch_Id" onChange={(e) => this.setState({ BachId: e.target.value })} value={this.state.BachId ? this.state.BachId.trim() : ""} ></input>

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
                                                            <th>Store</th>
                                                            <th>Retail Item Batch Id</th>
                                                            <th>Item Count</th>
                                                            <th>Date</th>

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
