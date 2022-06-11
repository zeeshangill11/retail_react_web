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

export default class inventoryByItems extends Component {
    constructor(props) {

        super(props);
        this.state = {
            store_list: [],
            brand_list: [],
            color_list: [],
            size_list: [],
            respone1: [],
            onhandtotal: 0,
            inventroycount: 0,
            counted_sf: 0,
            counted_sr: 0,
            missingtotal: 0,
            missingpercentage: 0,
            overtotal: 0,
            onhandmatching: 0,
            overpercentage: 0,
            item_accuracy: 0,
            operational_accuracy: 0,
            CriticalStock: 0,
            criticalperentage: 0,
            store_id: 0,
            summarydate: '',
            show_over: 'no',
            error_msg: "",
            bnd: " ",
            dept: " ",
            sku: " ",
            epc: " ",
            clr: " ",
            siz: " "
        };
    }

    async onStoreIdChange(event) {
        this.setState({ store_id: event.target.value });

        let server_ip = await new_config.get_server_ip();
        var store_id = this.state.store_id;
        if (store_id != null && store_id != undefined && store_id != "") {

            //Get Brands
            var brands = await common.get_brands(store_id);
            this.setState(brand_list => ({ brand_list: brands }));

            //Get Colors
            var colors = await common.get_colors(store_id);
            this.setState(color_list => ({ color_list: colors }));

            //Get Sizes
            var sizes = await common.get_sizes(store_id);
            this.setState(size_list => ({ size_list: sizes }));
        } else {
            var arr = [];
            this.setState(brand_list => ({ brand_list: arr }));
            this.setState(color_list => ({ color_list: arr }));
            this.setState(size_list => ({ size_list: arr }));
        }
    }

    async summaryValidate(event) {
        var working = false;
        var error = 0;
        if (this.state.store_id == "" || this.state.store_id == null) {
            error = 1;
            document.getElementById("StoreID").style.borderColor = "red"
            this.setState({ error_msg: "Please Select Store!" })
        } else {
            this.setState({ error_msg: "" })
            document.getElementById("StoreID").style.borderColor = "#fff"
        }
        

    }




    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));

        const server_ip = await new_config.get_server_ip();

        var main_table = ' ';

        $(document).ready(function () {


            main_table = $('#dataTable_inventory').DataTable({
                dom: 'Bfrtip',

                buttons: [
                    {
                        extend: 'excel',
                        title: 'InventoryData Data'
                    }, {
                        extend: 'print',
                        title: 'InventoryData Data'
                    },
                ],
                "pageLength": 25,
                'processing': true,

                "initComplete": function (settings, json) {
                    $(".data-tables").css('visibility', 'visible');
                    //$(".before_load_table").hide();
                },
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
                },

                'serverSide': true,
                'serverMethod': 'post',
                'ajax': {
                    'url': server_ip + 'inventoryData/GetInventoryByItem',
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "StoreID": $('#StoreID').val(),
                                "epc": $('#epcID').val(),
                                "SKU": $('#skuID').val(),
                                "DepartmentID": $('#DepartmentID').val(),
                                "BrandID": $('#BrandID').val(),
                                "Color": $('#Color').val(),
                                "Size": $('#Size').val(),
                            });
                        },
                },

                "responsive": true,
                "columns": [
                    //{ "data": "departmentname" },
                    { "data": "epc" },

                    { "data": "item_code" },
                    { "data": "store_id" },
                    { "data": "brand_name" },
                    { "data": "color" },
                    { "data": "size" },
                    // { "data": "zone" },
                    { "data": "ItemDispostion" },
                    { "data": "action" },


                ],
                'columnDefs': [{
                    'targets': [3, 4, 5, 6, 7], /* column index */
                    'orderable': false, /* true or false */
                }],
                "searching": false,

            })
        });
        $('.run').click(function () {
            
            main_table.ajax.reload();
        });
    }

    render() {
        return (
            <>
                <Header />
                <TopBar />
                <div className="page-container">
                    <LeftBar />
                    <div className="main-content">
                        <div className="content-wrapper pb-4">


                            <div className="row">
                                <div className="col-12 mt-1">
                                    <div className="card">

                                        <div className="card-header">
                                            <div className="left d-inline-block">
                                                <h4 className="mb-0"> <i className="ti-stats-up" style={{ color: "#000" }}></i>
                                                    Inventory
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
                                                    <div className="form-group d-inline-block mb-0 filter-size">
                                                        <select className="sw150 d-inline-block mr-2 selectpicker mx-2" data-live-search="true"
                                                            name="StoreID" id="StoreID" onChange={evt => this.onStoreIdChange(evt)} value={this.state.f_storeid} >
                                                            <option value="">Store ID</option>
                                                            {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                        </select>

                                                        <input className="mx-2" type="text" placeholder="EPC" name="epcID" id="epcID" onChange={(e) => this.setState({ epc: e.target.value })} value={this.state.epc ? this.state.epc.trim() : ""} ></input>
                                                        <input className="mx-2" type="text" placeholder="SKU" name="skuID" id="skuID" onChange={(e) => this.setState({ sku: e.target.value })} value={this.state.sku ? this.state.sku.trim() : ""} ></input>
                                                        <input className="mx-2" type="text" placeholder="Department Name" name="DepartmentID" id="DepartmentID" onChange={(e) => this.setState({ dept: e.target.value })} value={this.state.dept ? this.state.dept.trim() : ""} ></input>

                                                        <select className="sw150 d-inline-block selectpicker mx-2" data-live-search="true"
                                                            name="BrandID" id="BrandID" onChange={(e) => this.setState({ bnd: e.target.value })} value={this.state.bnd ? this.state.bnd : ' '} >
                                                            <option value="">All Brands</option>
                                                            {this.state.brand_list.map((x, y) => <option value={x.brand_name}>{x.brand_name}</option>)}
                                                        </select>
                                                        <select className="sw150 d-inline-block selectpicker mx-2" data-live-search="true"
                                                            name="Color" id="Color" onChange={(e) => this.setState({ clr: e.target.value })} value={this.state.clr ? this.state.clr : ' '} >
                                                            <option value="">All Colors</option>
                                                            {this.state.color_list.map((x, y) => <option value={x.color}>{x.color}</option>)}
                                                        </select>
                                                        <select className="sw150 d-inline-block selectpicker mx-2" data-live-search="true"
                                                            name="Size" id="Size" onChange={(e) => this.setState({ siz: e.target.value })} value={this.state.siz ? this.state.siz : ' '} >
                                                            <option value="">All Sizes</option>
                                                            {this.state.size_list.map((x, y) => <option value={x.size}>{x.size}</option>)}
                                                        </select>

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
                                                    <table id="dataTable_inventory" className="text-center mm-datatable_inventory">
                                                        <thead className="bg-light text-capitalize">
                                                            <tr>
                                                                <th>EPC</th>
                                                                <th>SKU</th>
                                                                <th>Store</th>
                                                                <th>Brand Name</th>

                                                                <th>Color</th>
                                                                <th>Size</th>

                                                                <th>Item Dispostion</th>
                                                                <th>Action</th>

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
                </div>
            </>
        )
    }
}