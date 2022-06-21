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

export default class gi_cancellation extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            toDate: '',
            store_list: [],
            onhandtotal: 0,
            store_id: 0,
            EPC: " ",
            SKU: " ",
            sup_num: " ",
            shp_num: " ",
            rbi: " ",
            error_msg: "",
        };
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
                    'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
                },

                'serverMethod': 'post',
                'ajax': {
                    'url': server_ip + 'stockCountRecords/getgoodsForGi_Cancellation/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "store_id": $("#StoreID").val(),
                                //"RetailItemBatchId": $("#rbi").val(),
                                "from_my_date": $("#fromdate").val(),
                                "to_my_date": $('#todate').val(),
                                "EPC": $('#EPC').val(),
                                "SKU": $('#SKU').val(),
                                "supplier_number": $('#sup_num').val(),
                                "shipment_number": $('#shp_num').val(),
                                "Retail_Item_Batch_Id": $('#rbi').val(),
                            });
                        },
                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "date" },
                    { "data": "refno" },
                    { "data": "retail_item_batch_id" },
                    { "data": "supplier_number" },
                    { "data": "shipment_number" },
                    { "data": "store" },
                    { "data": "purchase_order" },

                    { "data": "epc" },
                    { "data": "remarks" },
                    { "data": "id" },
                    { "data": "comments" },

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
        this.setState({ toDate: date })
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
                                                GI Cancellation
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
                                                            id="fromdate" name="fromdate" placeholderText="From: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>

                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <DatePicker onChange={this.handleToDateChange} selected={this.state.toDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                            id="todate" name="todate" placeholderText="To: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>


                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="StoreID" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                    </select>

                                                    <input className="mx-2" type="text" placeholder="EPC" name="Epc" id="EPC" onChange={(e) => this.setState({ EPC: e.target.value })} value={this.state.EPC ? this.state.EPC.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="SKU" name="SKU" id="SKU" onChange={(e) => this.setState({ SKU: e.target.value })} value={this.state.SKU ? this.state.SKU.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="Supplier Number" name="sup_num" id="sup_num" onChange={(e) => this.setState({ sup_num: e.target.value })} value={this.state.sup_num ? this.state.sup_num.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="Shipment Number" name="shp_num" id="shp_num" onChange={(e) => this.setState({ shp_num: e.target.value })} value={this.state.shp_num ? this.state.shp_num.trim() : ""} ></input>

                                                    <input className="mx-2" type="text" placeholder="Retail Item Batch ID" name="rbi" id="rbi" onChange={(e) => this.setState({ rbi: e.target.value })} value={this.state.rbi ? this.state.rbi.trim() : ""} ></input>

                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block">Search</button>
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
                                                            <th>Date</th>
                                                            <th>SKU</th>
                                                            <th>Retail Item Batch Id</th>
                                                            <th>Supplier Number</th>
                                                            <th>Shipment Number</th>
                                                            <th>Store</th>
                                                            <th>Purchase Order</th>
                                                            <th>Epc</th>
                                                            <th>Remarks</th>
                                                            <th>Id</th>
                                                            <th>Status</th>
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