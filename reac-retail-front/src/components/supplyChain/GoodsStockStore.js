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

export default class GoodsStockStore extends Component {
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
            sup_num: ' ',
            shp_num: ' ',
            sku: " ",
            epc: " ",
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

        var cookies = new Cookies();
var myToken = cookies.get('myToken');
        $(document).ready(function () {

            main_table=$('#dataTable').DataTable( {
                dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excel',
                            title: 'GoodsStockStore'
                        },{
        
                            extend: 'print',
                            title: 'GoodsStockStore'       
                        },
                    ],
                    "pageLength": 25,
                    "order": [[ 0, "desc" ]],
                    'processing': true,
                    'serverSide': true,
                     "initComplete": function( settings, json ) {
                        $(".data-tables").css('visibility', 'visible');
                        
                    },
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
                    }, 
                    'serverMethod': 'post',
                    'ajax': {
                        'url':server_ip+'stockCountRecords/getgoodsstore/',
                        'beforeSend': function (request) {
                            request.setRequestHeader("auth-token", myToken);
                        },
                        "data": 
                        function ( d ) {
                            return $.extend( {}, d, {
                                "store_id": $( "#StoreID" ).val(),
                                // "RetailItemBatchId":$( "#RetailItemBatchId" ).val(),
                                "from_my_date":$( "#FromDate" ).val(),	
                                "to_my_date" :$('#ToDate').val(),
                                "EPC" :$('#EPC').val(),
                                "SKU" :$('#SKU').val(),
                                "supplier_number" :$('#supplier_number').val(),
                                "shipment_number" :$('#shipment_number').val(),
                                "Retail_Item_Batch_Id" :$('#Retail_Item_Batch_Id').val(),
                            } );
                        },
                    },	
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
                    'columnDefs': [ {
                        'targets': [2,,3,5], /* column index */
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
                                            Goods Stock Store
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

                                                    <input className="mx-2" type="text" placeholder="EPC" name="epcID" id="epcID" onChange={(e) => this.setState({ epc: e.target.value })} value={this.state.epc ? this.state.epc.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="SKU" name="skuID" id="skuID" onChange={(e) => this.setState({ sku: e.target.value })} value={this.state.sku ? this.state.sku.trim() : ""} ></input>
                                                    
                                                    <input className="mx-2" type="text" placeholder="Supplier Number" name="supplier_number" id="supplier_number" onChange={(e) => this.setState({ sup_num: e.target.value })} value={this.state.sup_num ? this.state.sup_num.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="Shipment Number" name="shipment_number" id="shipment_number" onChange={(e) => this.setState({ shp_num: e.target.value })} value={this.state.shp_num ? this.state.shp_num.trim() : ""} ></input>
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
                                    <th>Comments</th>        
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
