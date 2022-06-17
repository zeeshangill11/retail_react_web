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

export default class zplReport extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            store_list: [],
            user_list: [],
            onhandtotal: 0,
            store_id: 0,
            user_id: 0,
            uid: " ",
            epc: " ",
            error_msg: "",
        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
        var user = await common.get_user_datail();
        this.setState(user_list => ({
            user_list: user
        }));
        
        console.log(this.state.user_list)

        const server_ip = await new_config.get_server_ip();
        var main_table = ' ';
        var cookies = new Cookies();
var myToken = cookies.get('myToken');

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
                    'url': server_ip + 'stockCountRecords/GetZPLReportData_sku/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "Storeid": $('#StoreID').val(),
                                "Epc": $('#Epc').val(),
                                "uid": $('#uid').val(),
                                "date22": $('#date').val(),
                                "user_id": $('#user_id').val(),
                            });
                        },
                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "uid" },
                    /*{ "data": "epc" },*/
                    { "data": "sku" },
                    { "data": "Product_Name" },
                    { "data": "PO_NO" },
                    { "data": "Supplier_ID" },
                    { "data": "Shipment_no" },
                    { "data": "Comments" },

                    { "data": "storeid" },

                    { "data": "status" },

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
    async summaryValidate(event) {
        var error = 0;
        if (this.state.store_id == "" || this.state.store_id == null) {
            error = 1;
            document.getElementById("StoreID").style.borderColor = "red"
            this.setState({ error_msg: "Please Select Both Date!" })
        } else {
            this.setState({ error_msg: "" })
            document.getElementById("StoreID").style.borderColor = "#fff"
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
                                                Zpl Report (SKU)
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
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="StoreID" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                    </select>

                                                    <input className="mx-2" type="text" placeholder="EPC" name="Epc" id="Epc" onChange={(e) => this.setState({ epc: e.target.value })} value={this.state.epc ? this.state.epc.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="uid" name="uid" id="uid" onChange={(e) => this.setState({ uid: e.target.value })} value={this.state.uid ? this.state.uid.trim() : ""} ></input>
                                                    <DatePicker onChange={this.handleFromDateChange} selected={this.state.startDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                        id="date" name="date" placeholderText="From Date: yyyy-mm-dd"
                                                        dateFormat="yyyy-MM-dd" />

                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="userId" id="userId" onChange={(e) => this.setState({ user_id: e.target.value })} value={this.state.user_id ? this.state.user_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.user_list.map((x, y) => <option key={x.id} value={x.username}>{x.username}</option>)}
                                                    </select>

                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block" onClick={evt => this.summaryValidate(evt)}>Search</button>
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
                                                            <th>uid</th>
                                                            <th>SKU</th>
                                                            <th>Product Name</th>
                                                            <th>PO#</th>
                                                            <th>Supplier ID</th>
                                                            <th>Shipment No</th>
                                                            <th>Comment</th>

                                                            <th>storeid</th>

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
