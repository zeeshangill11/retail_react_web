import React, { Component } from "react";
import new_config from '../../services/config';
import provider from '../../services/executiveSummaryJS';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from 'sweetalert';
import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';

//jQuery libraries

import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

import Cookies from 'universal-cookie';
var cookies = new Cookies();
var myToken = cookies.get('myToken');




export default class zplprinter_new extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store_list: [],
            zpl_list: [],
            printer_list: [],
            epc_list: [],
            store_id: 0,
            store_type: 0,
            zpl: 0,
            printer: 'RFID',
            t_devices: 0,
            uid: '',
            qty: 1,
            product_name: ' ',
            ProductName_ar: ' ',
            sku: ' ',
            sku_withoutZero: ' ',
            RetailProduct_color: ' ',
            Retail_product_Price: ' ',
            Retail_Product_VAT: ' ',
            SupplierName: ' ',
            Retail_Product_Size: ' ',
            Retail_Product_Season: ' ',
            Retail_Product_Gender: ' ',
            Retail_Product_SP_VAT_EN: ' ',
            Retail_Product_SupplierItemNum: ' ',
            Department: ' ',
            Brand: ' ',
            Style: ' ',
            PO: ' ',
            SupplierId: ' ',
            Shipment: ' ',
            Comments: ' ',
            epc: ' ',
            count: 0,
            show_over: [],
            checked: true,
        };

    }



    async onUidChange(event) {

        this.setState({ uid: event.target.value });

        let server_ip = await new_config.get_server_ip();
        var data = {
            'uid': this.state.uid
        }

        var uid = await fetch(server_ip + 'stockCountRecords/ZplDataProductMaster_new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(data)
        });
        var uidresponse = await uid.json()
        console.log(uidresponse)

        this.setState({
            product_name: uidresponse[0].english_desc,
            ProductName_ar: uidresponse[0].arabic_desc,
            sku: '000000' + uidresponse[0].skucode,
            sku_withoutZero: uidresponse[0].skucode,
            RetailProduct_color: uidresponse[0].color,
            Retail_product_Price: uidresponse[0].sp_net,
            Retail_Product_VAT: uidresponse[0].vat,
            SupplierName: uidresponse[0].supplier_name,
            Retail_Product_Size: uidresponse[0].size,
            Retail_Product_Season: uidresponse[0].season,
            Retail_Product_Gender: uidresponse[0].sales_area,
            Retail_Product_SP_VAT_EN: uidresponse[0].sp_gross_eng,
            Retail_Product_SupplierItemNum: uidresponse[0].supplier_item_no,
            Department: uidresponse[0].departmentname,
            Brand: uidresponse[0].brand,
            Style: uidresponse[0].style,
        })


    }

    async onStoreIdChange(event) {
        this.setState({ store_id: event.target.value });

        let server_ip = await new_config.get_server_ip();

        // Get the zpl against store Id

        var data = {
            'store_id': this.state.store_id
        }

        var zpl = await fetch(server_ip + 'stockCountRecords/getZPL_new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(data)
        });
        var zplresponse = await zpl.json()

        this.setState(zpl_list => ({
            zpl_list: zplresponse
        }));


        // Get the printer against store Id


        var printer = await fetch(server_ip + 'stockCountRecords/getPrinterInfo_new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(data)
        });
        var printeresponse = await printer.json()

        this.setState(printer_list => ({
            printer_list: printeresponse
        }));

        var std = document.getElementById(this.state.store_id);
        var stType = std.getAttribute('store_type');
        this.setState({ store_type: stType })

        console.log(this.state.store_type)

    }

    async componentDidMount() {

        let server_ip = await new_config.get_server_ip();

        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
        // const script = document.createElement("script");    
        // script.async = true;    
        // script.src = "../../js/BrowserPrint-Zebra-1.0.216.min.js";    
        // this.body.appendChild(script);  

    }

    async handlePrint(event) {

        const server_ip = await new_config.get_server_ip();

        var data = {
            'StoreID': this.state.store_id,
            'ProductName': this.state.product_name,
            'SKU': this.state.sku,
            'SKU_without_zero': this.state.sku_withoutZero,
            'Retail_Product_Color': this.state.RetailProduct_color,
            'Retail_Product_Price': this.state.Retail_product_Price,
            'Retail_Product_VAT': this.state.Retail_Product_VAT,
            'SupplierName': this.state.SupplierName,
            'Retail_Product_Size': this.state.Retail_Product_Size,
            'Retail_Product_Season': this.state.Retail_Product_Season,
            'Retail_Product_Gender': this.state.Retail_Product_Gender,
            'Retail_Product_SP_VAT_EN': this.state.Retail_Product_SP_VAT_EN,
            'Retail_Product_SupplierItemNum': this.state.Retail_Product_SupplierItemNum,
            'department': this.state.department,
            'brand': this.state.Brand,
            'style': this.state.Style,
            'ZPL': this.state.zpl,
            'Printer': this.state.printer,
            'PO_NO': this.state.PO,
            'Supplier_ID': this.state.SupplierId,
            'Shipment_no': this.state.Shipment,
            'Comments': this.state.Comments,
            'UID': this.state.uid,
            'qty': this.state.qty,
            'current_epc': this.state.epc,
            'ProductName_ar': this.state.ProductName_ar
        }

        var printData = await fetch(server_ip + 'stockCountRecords/AddPrinterForm_new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(data)
        });
        var response = await printData.json()
        this.setState({ epc_list: response.split(",") })

        document.getElementById("epc_list").style.display = "block";

        var checkboxes = document.getElementsByName('epc_item');
        var checkboxesChecked = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkboxes[i].checked) {
                checkboxesChecked.push(checkboxes[i].value);
            }
        }
        this.setState({ show_over: checkboxesChecked})
        console.log(this.state.show_over);
    }
    // async handleSubmit(event) {
    //     event.preventDefault();


    //     const server_ip = await new_config.get_server_ip();
    //     var cookies = new Cookies();
    //     var myToken = cookies.get('myToken');

    //     fetch(server_ip + 'stockCountRecords/AddPrinterForm_new', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Connection': 'keep-alive',
    //             'auth-token': myToken
    //         },
    //         body: 
    //             "qty="+ this.state.qty+
    //             "&current_epc="+ this.state.epc+
    //             "&ZPL="+ this.state.zpl+
    //             "&StoreID="+ this.state.store_id+
    //             "&Printer="+ this.state.printer+
    //             "&SKU="+this.state.sku+
    //             "&SKU_without_zero="+ this.state.sku.split('000000') +
    //             "&UID="+ this.state.uid +
    //             "&SupplierName="+ this.state.SupplierName+
    //             "&ProductName="+this.state.ProductName+
    //             "&ProductName_ar="+this.state.ProductName_ar+
    //             "&Retail_Product_Price="+ this.state.Retail_product_Price+
    //             "&Retail_Product_VAT="+ this.state.Retail_Product_VAT+
    //             "&Retail_Product_Color="+ this.state.Retail_Product_Color+
    //             "&Retail_Product_Size="+ this.state.Retail_Product_Size+ 
    //             "&Retail_Product_Season="+ this.state.Retail_Product_Season+
    //             "&Retail_Product_Gender="+ this.state.Retail_Product_Gender+   
    //             "&Retail_Product_SP_VAT_EN="+ this.state.Retail_Product_SP_VAT_EN+
    //             "&Retail_Product_SupplierItemNum="+ this.state.Retail_Product_SupplierItemNum+
    //             "&PO_NO="+ this.state.PO+
    //             "&Supplier_ID="+ this.state.SupplierId+
    //             "&Shipment_no="+ this.state.Shipment+
    //             "&Comments="+ this.state.Comments+
    //             "&brand="+ this.state.Brand+
    //             "&department="+ this.state.Department+
    //             "&style="+ this.state.style, 
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             var temp = responseJson;
    //             if (temp.status == 1) {
    //                 swal({ title: temp.title, text: temp.text, icon: temp.icon })
    //             }
    //             this.props.history.push('/users')
    //         }).catch((error) => console.error(error)).finally();
    // }
    async onShowOverChange(event) {
        const check = event.target
        if (event.target.checked) {
            let checkValue = event.target.value
            let data = this.state.show_over
            data.push(checkValue)
            this.setState({ 
                show_over: data,
                checked: check
             })
            console.log(this.state.show_over)
        } else {
            let array = this.state.show_over
            let index = array.indexOf(event.target.value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({ 
                    show_over: array,
                    checked: check
                 });
            }
            console.log(this.state.show_over)
        }
    }

    render() {

        return (
            <>
                <Header />
                <TopBar />
                <div className="page-container">
                    <LeftBar />
                    <div className="main-content">
                        <div className="content-wrapper pb-4 ">
                            <div className="body-sec pl-2 pr-2" id="executive-summary-count-dashboard">
                                <div className="card mb-5 pb-3">
                                    <div className="card-header">
                                        <div className="left d-inline-block">
                                            <h4 className="mb-0"> <i className="ti-stats-up" style={{ color: "#000" }}></i>
                                                ZPL Printer
                                            </h4>
                                            <p className="mb-0 dateTime"></p>
                                        </div>
                                        <div className="right d-inline-block float-right mt-2">

                                            <img src="/asserts/images/count/Group 9.png" height='25px' />

                                        </div>
                                    </div>
                                    <div className="card-body p-1">

                                        <div className="row ml-0 mr-0 hide" id="CountDynamic">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-5 pl-1 pr-1 pr-md-2">
                                                        <div className="p-3 top-cards item-accuracy-card" style={{ background: "#fff", color: "#000" }}>
                                                            <div style={{ padding: "10px" }}>
                                                                <div className="float-left">
                                                                    <h4 className="float-left">Total Stores</h4>
                                                                    <span>
                                                                        <input type="checkbox"
                                                                            className="d-inline-block"
                                                                            id="utc_time"
                                                                            name="utc_time"
                                                                            style={{ width: "14px", height: "24px" }} />
                                                                    </span>

                                                                </div>
                                                                <button type="button" className="btn btn-secondary float-right" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                                    Details
                                                                </button>
                                                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div className="modal-dialog">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header">
                                                                                <h5 className="modal-title" id="exampleModalLabel">Details</h5>
                                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                            </div>
                                                                            <div className="modal-body">
                                                                                <form autoComplete="off" id="AddDetailsForm" name="print">
                                                                                    <div className="form-row">
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="PO" style={{ color: "#000" }}>PO</label>
                                                                                            <input type="text" className="form-control" name="PO_NO"
                                                                                                id="PO_NO" placeholder="PO#" required={this.state.store_type === 'WareHouse' ? true : false}
                                                                                                value={this.state.PO} onChange={(e) => this.setState({ PO: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error PO_error"></span>
                                                                                        </div>
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="SupplierId" style={{ color: "#000" }}>Supplier Id</label>
                                                                                            <input type="text" className="form-control" name="Supplier_ID"
                                                                                                id="Supplier_ID" placeholder="Supplier Id" required={this.state.store_type === 'WareHouse' ? true : false}
                                                                                                value={this.state.SupplierId} onChange={(e) => this.setState({ SupplierId: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error SupplierId_error"></span>
                                                                                        </div>
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="Shipment" style={{ color: "#000" }}>Shipment#</label>
                                                                                            <input type="text" className="form-control" name="Shipment_no"
                                                                                                id="Shipment_no" placeholder="Shipment #" required={this.state.store_type === 'WareHouse' ? true : false}
                                                                                                value={this.state.Shipment} onChange={(e) => this.setState({ Shipment: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error Shipment_error"></span>
                                                                                        </div>
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="Comments" style={{ color: "#000" }}>Comments</label>
                                                                                            <input type="text" className="form-control" name="Comments"
                                                                                                id="Comments" placeholder="Comments" required={this.state.store_type === 'WareHouse' ? true : false}
                                                                                                value={this.state.Comments} onChange={(e) => this.setState({ Comments: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error Comments_error"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div className="modal-footer">
                                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                                <button type="button" className="btn btn-success" data-bs-dismiss="modal">Ok</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2">
                                                                <form autoComplete="off" id="PrinterForm" name="PrinterForm">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="UUID" style={{ color: "#000" }}>UUID</label>
                                                                            <input type="text" className="form-control" name="UID"
                                                                                id="UID" placeholder="UUID" required
                                                                                value={this.state.uid} onChange={evt => this.onUidChange(evt)} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="StoreID"
                                                                                id="StoreID" placeholder="StoreID" required
                                                                                value={this.state.store_id} style={{ color: "#000" }} />
                                                                            <span className="error UUID_error"></span>
                                                                            <input type="hidden" className="form-control" name="ZPL"
                                                                                id="ZPL" placeholder="ZPL" required
                                                                                value={this.state.zpl} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="PO_NO"
                                                                                id="PO_NO" placeholder="PO_NO" required
                                                                                value={this.state.PO} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="Supplier_ID"
                                                                                id="Supplier_ID" placeholder="Supplier_ID" required
                                                                                value={this.state.SupplierId} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="Shipment_no"
                                                                                id="Shipment_no" placeholder="Shipment_no" required
                                                                                value={this.state.Shipment} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="Comments"
                                                                                id="Comments" placeholder="Comments" required
                                                                                value={this.state.Comments} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="current_epc"
                                                                                id="current_epc" placeholder="current_epc" required
                                                                                value={this.state.epc} style={{ color: "#000" }} />
                                                                            <input type="hidden" className="form-control" name="Printer"
                                                                                id="Printer" placeholder="Printer" required
                                                                                value={this.state.printer} style={{ color: "#000" }} />
                                                                            <input type="hidden" disabled className="form-control" name="Retail_Product_VAT"
                                                                                id="Retail_Product_VAT" placeholder="Retail_Product_VAT" required
                                                                                value={this.state.Retail_Product_VAT} />
                                                                            <input type="hidden" disabled className="form-control" name="SupplierName"
                                                                                id="SupplierName" placeholder="SupplierName" required
                                                                                value={this.state.SupplierName} />
                                                                            <input type="hidden" disabled className="form-control" name="Retail_Product_Size"
                                                                                id="Retail_Product_Size" placeholder="Retail_Product_Size" required
                                                                                value={this.state.Retail_Product_Size} />
                                                                            <input type="hidden" disabled className="form-control" name="Retail_Product_Season"
                                                                                id="Retail_Product_Season" placeholder="Retail_Product_Season" required
                                                                                value={this.state.Retail_Product_Season} />
                                                                            <input type="hidden" disabled className="form-control" name="Retail_Product_Gender"
                                                                                id="Retail_Product_Gender" placeholder="Retail_Product_Gender" required
                                                                                value={this.state.Retail_Product_Gender} />
                                                                            <input type="hidden" disabled className="form-control" name="Retail_Product_SP_VAT_EN"
                                                                                id="Retail_Product_SP_VAT_EN" placeholder="Retail_Product_SP_VAT_EN" required
                                                                                value={this.state.Retail_Product_SP_VAT_EN} />
                                                                            <input type="hidden" disabled className="form-control" name="Retail_Product_SupplierItemNum"
                                                                                id="Retail_Product_SupplierItemNum" placeholder="Retail_Product_SupplierItemNum" required
                                                                                value={this.state.Retail_Product_SupplierItemNum} />
                                                                            <input type="hidden" disabled className="form-control" name="department"
                                                                                id="department" placeholder="Department" required
                                                                                value={this.state.Department} />
                                                                            <input type="hidden" disabled className="form-control" name="brand"
                                                                                id="brand" placeholder="Brand" required
                                                                                value={this.state.Brand} />
                                                                            <input type="hidden" disabled className="form-control" name="style"
                                                                                id="style" placeholder="Style" required
                                                                                value={this.state.Style === null ? '' : this.state.Style} />
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="QTY" style={{ color: "#000" }}>QTY</label>
                                                                            <input type="number" className="form-control" name="qty"
                                                                                id="QTY" placeholder="QTY" required
                                                                                value={!this.state.qty === 0 ? 1 : this.state.qty} onChange={(e) => this.setState({ qty: e.target.value })} style={{ color: "#000" }} />
                                                                            <span className="error QTY_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="Product Name" style={{ color: "#000" }}>Product Name</label>
                                                                            <input type="text" className="form-control" name="ProductName" disabled
                                                                                id="ProductName" placeholder="Product Name" required
                                                                                value={this.state.product_name} style={{ color: "#000" }} />
                                                                            <input type="hidden" id="ProductName_ar"
                                                                                name="ProductName_ar" value={this.state.ProductName_ar}
                                                                            />
                                                                            <span className="error ProductName_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="SKU" style={{ color: "#000" }}>SKU</label>
                                                                            <input type="text" disabled className="form-control" name="SKU"
                                                                                id="SKU" placeholder="SKU" required
                                                                                value={this.state.sku} style={{ color: "#000" }} />
                                                                            <span className="error SKU_error"></span>
                                                                            <input type="hidden" disabled className="form-control" name="SKU_without_zero"
                                                                                id="SKU_without_zero" placeholder="SKU_without_zero" required
                                                                                value={this.state.sku_withoutZero} style={{ color: "#000" }} />
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="RetailProduct_color" style={{ color: "#000" }}>RetailProduct_color</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_Color"
                                                                                id="Retail_Product_Color" placeholder="RetailProduct_color" required
                                                                                value={this.state.RetailProduct_color} style={{ color: "#000" }} />
                                                                            <span className="error RetailProduct_color_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="Retail_product_Price" style={{ color: "#000" }}>Retail_product_Price</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_Price"
                                                                                id="Retail_Product_Price" placeholder="Retail_product_Price" required
                                                                                value={this.state.Retail_product_Price} style={{ color: "#000" }} />
                                                                            <span className="error Retail_product_Price_error"></span>

                                                                        </div>

                                                                        <div class="d-grid gap-2 col-6 mx-auto  mt-5">
                                                                            <button class="btn btn-primary btn-block" id="printButton" onClick={evt => this.handlePrint(evt)} type="button">Print</button>
                                                                        </div>
                                                                        <div id="epc_list" style={{ width: "100%", marginTop: "7%", display: "none" }}>
                                                                            <table id="dataTable" class="text-center mm-datatable" style={{ width: "100%" }}>
                                                                                <thead class="bg-light text-capitalize">
                                                                                    <tr>
                                                                                        <th>ID</th>
                                                                                        <th>EPC</th>
                                                                                        <th>Print</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {this.state.epc_list.map((listValue, index) => {

                                                                                        if (listValue) {
                                                                                            return (
                                                                                                <tr key={index}>
                                                                                                    <td>{index}</td>
                                                                                                    <td>{listValue}</td>
                                                                                                    <td>
                                                                                                        <span>
                                                                                                            <input type="checkbox"
                                                                                                                className="d-inline-block"
                                                                                                                id="epc_item"
                                                                                                                name="epc_item" value={listValue} defaultChecked={this.state.checked}
                                                                                                                style={{ width: "14px", height: "24px" }} onChange={evt => this.onShowOverChange(evt)} />
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        }
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 pl-1 pr-1 pl-md-2">
                                                        <div className="p-3 top-cards item-accuracy-card" style={{ height: "381px", background: "#fff", color: "#000" }}>
                                                            <h4>Image Preview Not Available</h4>
                                                            <div className="text-center" style={{ paddingTop: "54px" }}>
                                                                <img src="https://i.postimg.cc/TYC09mDX/sss-Capture.png" alt="img" />
                                                            </div>
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="EPC" style={{ color: "#000" }}>EPC</label>
                                                                <input type="text" disabled className="form-control" name="current_epc"
                                                                    id="EPC" placeholder="EPC" required
                                                                    value={this.state.epc} />
                                                                <span className="error EPC_error"></span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 pl-1 pr-1 pl-md-2">
                                                        <div className="card-box p-3 top-cards item-accuracy-card" style={{ height: "381px", background: "#fff", color: "#000" }}>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <select className="form-select" style={{ color: "#000" }} data-live-search="true"
                                                                        name="StoreID" id="StoreID" onChange={evt => this.onStoreIdChange(evt)} value={this.state.store_id} >
                                                                        <option value="">Select Store ID</option>
                                                                        {this.state.store_list.map((x, y) => <option id={x.storename} value={x.storename} store_type={x.store_type}>{x.storename}</option>)}
                                                                    </select>
                                                                    <select className="form-select my-2" style={{ color: "#000" }} data-live-search="true"
                                                                        name="ZPL" id="zplId" onChange={(e) => this.setState({ zpl: e.target.value })} value={this.state.zpl} >
                                                                        <option value="">Select ZPL</option>
                                                                        {this.state.zpl_list.map((x, y) => <option value={x.zpl}>{x.name}</option>)}
                                                                    </select>
                                                                    <select className="form-select my-2" style={{ color: "#000" }} data-live-search="true"
                                                                        name="printerId" id="printerId" onChange={(e) => this.setState({ printer: e.target.value })} value={this.state.printer} >
                                                                        <option value="RFID">RFID</option>
                                                                        {this.state.printer_list.map((x, y) => <option value={x.name}>{x.name}</option>)}
                                                                    </select>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
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


        );
    }
}
