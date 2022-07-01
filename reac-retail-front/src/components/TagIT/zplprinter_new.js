import React, { Component } from "react";
import new_config from '../../services/config';
import provider from '../../services/executiveSummaryJS';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
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
            store_id: 0,
            store_type: 0,
            zpl: 0,
            printer: 0,
            t_devices: 0,
            uid: '',
            qty: '',
            product_name: '',
            ProductName_ar: '',
            sku: '',
            RetailProduct_color: '',
            Retail_product_Price: '',
            Retail_Product_VAT: '',
            SupplierName: '',
            Retail_Product_Size: '',
            Retail_Product_Season: '',
            Retail_Product_Gender: '',
            Retail_Product_SP_VAT_EN: '',
            Retail_Product_SupplierItemNum: '',
            Department: '',
            Brand: '',
            Style: '',
            PO: '',
            SupplierId: '',
            Shipment: '',
            Comments: '',
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

        this.setState({
            product_name: uidresponse[0].english_desc,
            ProductName_ar: uidresponse[0].arabic_desc,
            sku: uidresponse[0].skucode,
            RetailProduct_color: uidresponse[0].color,
            Retail_product_Price: uidresponse[0].sp_net,
            Retail_Product_VAT: uidresponse[0].vat,
            SupplierName: uidresponse[0].supplier_name,
            Retail_Product_Size: uidresponse[0].size,
            Retail_Product_Season: uidresponse[0].season,
            Retail_Product_Gender: uidresponse[0].sales_area,
            Retail_Product_SP_VAT_EN: uidresponse[0].sp_gross_eng,
            Retail_Product_SupplierItemNum: uidresponse[0].supplier_item_no,
            Department: uidresponse[0].dept,
            Brand: uidresponse[0].brand,
            Style: uidresponse[0].type_no,
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
                                                                            class="d-inline-block"
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
                                                                                            <input type="text" className="form-control" name="PO"
                                                                                                id="PO" placeholder="PO#" required={this.state.store_type=='WareHouse'? true: false}
                                                                                                value={this.state.PO} onChange={(e) => this.setState({ PO: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error PO_error"></span>
                                                                                        </div>
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="SupplierId" style={{ color: "#000" }}>Supplier Id</label>
                                                                                            <input type="text" className="form-control" name="SupplierId"
                                                                                                id="SupplierId" placeholder="Supplier Id" required={this.state.store_type=='WareHouse'? true: false}
                                                                                                value={this.state.SupplierId} onChange={(e) => this.setState({ SupplierId: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error SupplierId_error"></span>
                                                                                        </div>
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="Shipment" style={{ color: "#000" }}>Shipment#</label>
                                                                                            <input type="text" className="form-control" name="Shipment" 
                                                                                                id="Shipment" placeholder="Shipment #" required={this.state.store_type=='WareHouse'? true: false}
                                                                                                value={this.state.Shipment} onChange={(e) => this.setState({ Shipment: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error Shipment_error"></span>
                                                                                        </div>
                                                                                        <div className="form-group col-md-6">
                                                                                            <label htmlFor="Comments" style={{ color: "#000" }}>Comments</label>
                                                                                            <input type="text"  className="form-control" name="Comments"
                                                                                                id="Comments" placeholder="Comments" required={this.state.store_type=='WareHouse'? true: false}
                                                                                                value={this.state.Comments} onChange={(e) => this.setState({ Comments: e.target.value })} style={{ color: "#000" }} />
                                                                                            <span className="error Comments_error"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div className="modal-footer">
                                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                                <button type="button" className="btn btn-success">Ok</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2">
                                                                <form autoComplete="off" id="AddPrintForm" name="print">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="UUID" style={{ color: "#000" }}>UUID</label>
                                                                            <input type="text" className="form-control" name="UUID"
                                                                                id="UUID" placeholder="UUID" required
                                                                                value={this.state.uid} onChange={evt => this.onUidChange(evt)} style={{ color: "#000" }} />
                                                                            <span className="error UUID_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="QTY" style={{ color: "#000" }}>QTY</label>
                                                                            <input type="number" className="form-control" name="QTY"
                                                                                id="QTY" placeholder="QTY" required
                                                                                value={!this.state.qty? 1: this.state.qty} style={{ color: "#000" }} />
                                                                            <span className="error QTY_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="Product Name" style={{ color: "#000" }}>Product Name</label>
                                                                            <input type="text" className="form-control" name="Product Name" disabled
                                                                                id="Product Name" placeholder="Product Name" required
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
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="RetailProduct_color" style={{ color: "#000" }}>RetailProduct_color</label>
                                                                            <input type="text" disabled className="form-control" name="RetailProduct_color"
                                                                                id="RetailProduct_color" placeholder="RetailProduct_color" required
                                                                                value={this.state.RetailProduct_color} style={{ color: "#000" }} />
                                                                            <span className="error RetailProduct_color_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="Retail_product_Price" style={{ color: "#000" }}>Retail_product_Price</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_product_Price"
                                                                                id="Retail_product_Price" placeholder="Retail_product_Price" required
                                                                                value={this.state.Retail_product_Price} style={{ color: "#000" }} />
                                                                            <span className="error Retail_product_Price_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Retail_Product_VAT" style={{ color: "#000" }}>Retail_Product_VAT</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_VAT"
                                                                                id="Retail_Product_VAT" placeholder="Retail_Product_VAT" required
                                                                                value={this.state.Retail_Product_VAT} />
                                                                            <span className="error Retail_Product_VAT_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="SupplierName" style={{ color: "#000" }}>SupplierName</label>
                                                                            <input type="text" disabled className="form-control" name="SupplierName"
                                                                                id="SupplierName" placeholder="SupplierName" required
                                                                                value={this.state.SupplierName} />
                                                                            <span className="error SupplierName_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Retail_Product_Size" style={{ color: "#000" }}>Retail_Product_Size</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_Size"
                                                                                id="Retail_Product_Size" placeholder="Retail_Product_Size" required
                                                                                value={this.state.Retail_Product_Size} />
                                                                            <span className="error Retail_Product_Size_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Retail_Product_Season" style={{ color: "#000" }}>Retail_Product_Season</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_Season"
                                                                                id="Retail_Product_Season" placeholder="Retail_Product_Season" required
                                                                                value={this.state.Retail_Product_Season} />
                                                                            <span className="error Retail_Product_Season_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Retail_Product_Gender" style={{ color: "#000" }}>Retail_Product_Gender</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_Gender"
                                                                                id="Retail_Product_Gender" placeholder="Retail_Product_Gender" required
                                                                                value={this.state.Retail_Product_Gender} />
                                                                            <span className="error Retail_Product_Gender_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Retail_Product_SP_VAT_EN" style={{ color: "#000" }}>Retail_Product_SP_VAT_EN</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_SP_VAT_EN"
                                                                                id="Retail_Product_SP_VAT_EN" placeholder="Retail_Product_SP_VAT_EN" required
                                                                                value={this.state.Retail_Product_SP_VAT_EN} />
                                                                            <span className="error Retail_Product_SP_VAT_EN_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Retail_Product_SupplierItemNum" style={{ color: "#000" }}>Retail_Product_SupplierItemNum</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_Product_SupplierItemNum"
                                                                                id="Retail_Product_SupplierItemNum" placeholder="Retail_Product_SupplierItemNum" required
                                                                                value={this.state.Retail_Product_SupplierItemNum} />
                                                                            <span className="error Retail_Product_SupplierItemNum_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Department" style={{ color: "#000" }}>Department</label>
                                                                            <input type="text" disabled className="form-control" name="Department"
                                                                                id="Department" placeholder="Department" required
                                                                                value={this.state.Department} />
                                                                            <span className="error Department_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Brand" style={{ color: "#000" }}>Brand</label>
                                                                            <input type="text" disabled className="form-control" name="Brand"
                                                                                id="Brand" placeholder="Brand" required
                                                                                value={this.state.Brand} />
                                                                            <span className="error Brand_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6" style={{ display: "none" }}>
                                                                            <label htmlFor="Style" style={{ color: "#000" }}>Style</label>
                                                                            <input type="text" disabled className="form-control" name="Style"
                                                                                id="Style" placeholder="Style" required
                                                                                value={this.state.Style} />
                                                                            <span className="error Style_error"></span>
                                                                        </div>
                                                                        <div className="but mt-5 text-center" style={{ margin: "auto" }}>
                                                                            <button type="submit" id="submit" className="btn btn-primary btn-block">Print</button>
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
                                                                <input type="text" disabled className="form-control" name="EPC"
                                                                    id="EPC" placeholder="EPC" required
                                                                    value='' />
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
                                                                        name="zplId" id="zplId" onChange={(e) => this.setState({ zpl: e.target.value })} value={this.state.zpl} >
                                                                        <option value="">Select ZPL</option>
                                                                        {this.state.zpl_list.map((x, y) => <option value={x.zpl}>{x.name}</option>)}
                                                                    </select>
                                                                    <select className="form-select my-2" style={{ color: "#000" }} data-live-search="true"
                                                                        name="printerId" id="printerId" onChange={(e) => this.setState({ printer: e.target.value })} value={this.state.printer} >
                                                                        <option value="">Select Printer</option>
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
