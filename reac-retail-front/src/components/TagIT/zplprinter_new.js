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
            device_list: [],
            percentage_list: [],
            activity_list: [],
            store_id: 0,
            zpl: 0,
            printer: 0,
            t_devices: 0,
            date: '',
            matching: 0,
            over: 0,
            unders: 0,
            onhand: 0,
            backStore: 0,
            count: 0,
            SalesFloor: 0
        };

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

        console.log(this.state.printer_list)

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
                                                                <button type="button" className="btn btn-secondary float-right">
                                                                    Details
                                                                </button>
                                                            </div>

                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2">
                                                                <form autoComplete="off" id="AddDeviceForm" name="registration">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="UUID" style={{ color: "#000" }}>UUID</label>
                                                                            <input type="text" className="form-control" name="UUID"
                                                                                id="UUID" placeholder="UUID" required
                                                                                value='' />
                                                                            <span className="error UUID_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="QTY" style={{ color: "#000" }}>QTY</label>
                                                                            <input type="text" className="form-control" name="QTY"
                                                                                id="QTY" placeholder="QTY" required
                                                                                value='' />
                                                                            <span className="error QTY_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="Product Name" style={{ color: "#000" }}>Product Name</label>
                                                                            <input type="text" className="form-control" name="Product Name" disabled
                                                                                id="Product Name" placeholder="Product Name" required
                                                                                value='' />
                                                                            <span className="error ProductName_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="SKU" style={{ color: "#000" }}>SKU</label>
                                                                            <input type="text" disabled className="form-control" name="SKU"
                                                                                id="SKU" placeholder="SKU" required
                                                                                value='' />
                                                                            <span className="error SKU_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="RetailProduct_color" style={{ color: "#000" }}>RetailProduct_color</label>
                                                                            <input type="text" disabled className="form-control" name="RetailProduct_color"
                                                                                id="RetailProduct_color" placeholder="RetailProduct_color" required
                                                                                value='' />
                                                                            <span className="error RetailProduct_color_error"></span>
                                                                        </div>
                                                                        <div className="form-group col-md-6">
                                                                            <label htmlFor="Retail_product_Price" style={{ color: "#000" }}>Retail_product_Price</label>
                                                                            <input type="text" disabled className="form-control" name="Retail_product_Price"
                                                                                id="Retail_product_Price" placeholder="Retail_product_Price" required
                                                                                value='' />
                                                                            <span className="error Retail_product_Price_error"></span>
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
                                                                    <select className="form-control mr-2" style={{ color: "#000" }} data-live-search="true"
                                                                        name="StoreID" id="StoreID" onChange={evt => this.onStoreIdChange(evt)} value={this.state.store_id} >
                                                                        <option value="">Select Store ID</option>
                                                                        {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                                    </select>
                                                                    <select className="form-control mr-2 my-2" style={{ color: "#000" }} data-live-search="true"
                                                                        name="zplId" id="zplId" onChange={(e) => this.setState({ zpl: e.target.value })} value={this.state.zpl} >
                                                                        <option value="">Select ZPL</option>
                                                                        {this.state.zpl_list.map((x, y) => <option value={x.zpl}>{x.name}</option>)}
                                                                    </select>
                                                                    <select className="form-control mr-2 my-2" style={{ color: "#000" }} data-live-search="true"
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
                                        <p className="mb-0 p-2 light time-load-text text-light">Page Load: 0.35s</p>
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
