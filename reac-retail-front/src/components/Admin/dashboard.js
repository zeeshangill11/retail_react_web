import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
import Cookies from 'universal-cookie';

export default class dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store_list: [],
            t_stores_list: [],
            users_list: [],
            device_list: [],
            percentage_list: [],
            activity_list: [],
            store_id: 0,
            t_stores: 0,
            t_users: 0,
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

        // Get the handled Devices against store Id

        var data = {
            'storeid': this.state.store_id
        }

        var deviceWithId = await fetch(server_ip + 'inventoryData/TotalDevicesHandheldDevices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(data)
        });
        var response = await deviceWithId.json()

        this.setState(device_list => ({
            device_list: response
        }));
        this.setState({ t_devices: this.state.device_list[0].total_handheld_devices });


        // Get the store detail Dashboard...................................
        var dashboardData = {
            'store_id': this.state.store_id
        }

        var dashboard = await fetch(server_ip + 'stockCountRecords/getStoresDetailsDashboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(dashboardData)
        });
        var dashboardResponse = await dashboard.json()

        this.setState({ date: dashboardResponse[0].date })

        // Get the Percentage Data against store Id...............................
        var dataPercentage = {
            'store_id': this.state.store_id,
            'date': this.state.date,
        }

        var LastScan = await fetch(server_ip + 'stockCountRecords/getStoresPercentage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(dataPercentage)
        });
        var LastScanresponse = await LastScan.json()

        this.setState(percentage_list => ({
            percentage_list: LastScanresponse
        }));

        this.setState({
            matching: this.state.percentage_list[0].matching,
            over: this.state.percentage_list[0].overpercentage,
            unders: this.state.percentage_list[0].missingpercentage,
            onhand: this.state.percentage_list[0].onhandtotal,
            backStore: this.state.percentage_list[0].back,
            count: this.state.percentage_list[0].inventroycount,
            SalesFloor: this.state.percentage_list[0].front,
        })


    }

    async componentDidMount() {

        let server_ip = await new_config.get_server_ip();

        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));

        var t_stores = await common.storeCount();
        this.setState(t_stores_list => ({
            t_stores_list: t_stores
        }));

        var users = await common.totalUsers();
        this.setState(users_list => ({
            users_list: users
        }));

        var device = await common.totalHandledDevices();
        this.setState(device_list => ({
            device_list: device
        }));
        console.log(device)

        this.setState({ t_stores: this.state.t_stores_list[0].total_store });
        this.setState({ t_users: this.state.users_list[0].total_users });
        this.setState({ t_devices: this.state.device_list[0].total_handheld_devices });

        // Get the Activites Data
        var Activities = await fetch(server_ip + 'inventoryData/Activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
        });
        var Activitiesresponse = await Activities.json()

        this.setState(activity_list => ({
            activity_list: Activitiesresponse
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
                                                Dashboard
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
                                                    <div className="col-md-4 pl-1 pr-1 pr-md-2">
                                                        <div className="card-box p-3 top-cards item-accuracy-card">
                                                            <h4 className="float-left">Total Stores</h4>
                                                            <Link to='/storeinfo' className="OneHandSimple cursor_pointer">
                                                                <img src="./asserts/images/plus-icon.png" className="float-right" />
                                                            </Link>
                                                            <h2 className="text-center">
                                                                <span className="waiting" style={{ display: "none" }} >
                                                                    <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" className="waiting_inner" />
                                                                </span>
                                                                <span id="item_accuracy"><p>{this.state.t_stores}</p></span>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 pl-1 pr-1 pl-md-2">
                                                        <div className="card-box p-3 top-cards item-accuracy-card">
                                                            <h4 className="float-left">Total Users</h4>
                                                            <Link to='/users' className="OneHandSimple cursor_pointer">
                                                                <img src="./asserts/images/plus-icon.png" className="float-right" />
                                                            </Link>
                                                            <h2 className="text-center">
                                                                <span className="waiting" style={{ display: "none" }} >
                                                                    <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" className="waiting_inner" />
                                                                </span>
                                                                <span id="operational_accuracy"><p>{this.state.t_users}</p></span>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 pl-1 pr-1 pl-md-2">
                                                        <div className="card-box p-3 top-cards item-accuracy-card">
                                                            <h4 className="float-left">Total Devices</h4>
                                                            <Link to='/handheldDevices' className="OneHandSimple cursor_pointer">
                                                                <img src="./asserts/images/plus-icon.png" className="float-right" />
                                                            </Link>
                                                            <h2 className="text-center">
                                                                <span className="waiting" style={{ display: "none" }} >
                                                                    <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" className="waiting_inner" />
                                                                </span>
                                                                <span id="operational_accuracy"><p>{this.state.t_devices}</p></span>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-md-8 pl-1 pr-1  pr-md-2" >
                                                        <div className="card-box p-4 item-accuracy-count" style={{ height: "286px", overflowY: "auto" }}>
                                                            <h4 className="d-inline-block mb-0 my-2">Activities</h4>
                                                            <Link to='/audit' className="OneHandSimple cursor_pointer">
                                                                <img src="./asserts/images/icon-open-list.png" className="float-right" />
                                                            </Link>
                                                            <div>
                                                                {this.state.activity_list.map((x, y) => <p style={{ fontSize: "13px", margin: "0px" }}>{x.date + '--' + x.audit_text + '--Log Type--' + x.log_type + '--Device ID--' + x.deviceid + '--Store ID--' + x.storeid + '--Retail CycleCount ID--' + x.Retail_CycleCountID}</p>)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4 pl-1 pr-1 pl-md-2">
                                                        <div className="card-box px-3 py-2 item-accuracy-front-back">
                                                            <h4 className="float-left">Last Scan</h4>
                                                            <h4 className="float-right">{this.state.date}</h4>
                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2">
                                                                <select className="form-control mr-2" data-live-search="true"
                                                                    name="StoreID" id="StoreID" onChange={evt => this.onStoreIdChange(evt)} value={this.state.store_id} >
                                                                    <option value="">Select Store ID</option>
                                                                    {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2" style={{ paddingBottom: "20px" }}>
                                                                <p className="float-left">Matching</p>
                                                                <p className="float-right matching_text">{this.state.matching}%</p>
                                                                <div className="center mr-1 matching">

                                                                </div>
                                                            </div>
                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2" style={{ paddingBottom: "20px" }}>
                                                                <p className="float-left">Overs</p>
                                                                <p className="float-right matching_text">{this.state.over}%</p>
                                                                <div className="center mr-1 matching">

                                                                </div>
                                                            </div>
                                                            <div className="matchingg progress-sec mb-1 mt-1 sec-lower-font my-2" style={{ paddingBottom: "20px" }}>
                                                                <p className="float-left">Unders</p>
                                                                <p className="float-right matching_text">{this.state.unders}%</p>
                                                                <div className="center mr-1 matching">

                                                                </div>
                                                            </div>
                                                            <div className="progress my-2" style={{ height: "4px" }}>
                                                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-6" style={{ padding: "0px" }}>
                                                                    <div className="text-center">
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}><b>Stock On Hand</b></p>
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}>{this.state.onhand}</p>
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}><b>Count</b></p>
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}>{this.state.count}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6" style={{ padding: "0px" }}>
                                                                    <div className="text-center">
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}><b>Back Store</b></p>
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}>{this.state.backStore}</p>
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}><b>Sales Floor</b></p>
                                                                        <p style={{ margin: "0px", fontSize: "13px" }}>{this.state.SalesFloor}</p>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {/* <h2 className="text-center mb-1 mt-1 sec-lower-font">
                                                                <span className="waiting" style={{ display: "none" }} >
                                                                    <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" />
                                                                </span>
                                                                <span id="frontval"><span className="ftbk-vl">{this.state.counted_sf}</span></span>
                                                            </h2> */}
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
