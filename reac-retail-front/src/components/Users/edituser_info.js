import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";
import swal from 'sweetalert';
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

export default class edituser extends Component {
    constructor(props) {

        super(props);
        var edit_id = props.match.params.id;
        this.state = {
            id: edit_id,
            Name: " ",
            UserName: " ",
            store_list: [],
            role_list: [],
            Role: '',
            Status: '',
            Password: '',
            storeid: '',
        };
    }


    componentDidMount = async () => {

        var stores = await common.get_stores();
        this.setState(store_list => ({ store_list: stores }));

        var rol = await common.get_allRoles();
        this.setState(role_list => ({ role_list: rol }));


        var main_data = await this.geteditrecord();
        if (main_data[0].name !== null) { this.setState({ Name: main_data[0].name }) }
        if (main_data[0].username !== null) { this.setState({ UserName: main_data[0].username }) }
        if (main_data[0].role_id !== null) { this.setState({ Role: main_data[0].role_id }) }
        if (main_data[0].status !== null) { this.setState({ Status: main_data[0].status }) }
        if (main_data[0].storeid !== null) { this.setState({ storeid: main_data[0].storeid }) }
        
    }
    async geteditrecord() {
        var cookies = new Cookies();
        var myToken = cookies.get('myToken');
        let server_ip = await new_config.get_server_ip();
        return fetch(server_ip + 'stockCountRecords/GetEditUserRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'keep-alive',
                'auth-token': myToken
            },
            body: "edit_id=" + this.state.id,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                var temp = responseJson;
                return temp;
            }).catch((error) => console.error(error)).finally();
    }
    async handleSubmit(event) {
        event.preventDefault();


        const server_ip = await new_config.get_server_ip();
        var cookies = new Cookies();
        var myToken = cookies.get('myToken');

        fetch(server_ip + 'stockCountRecords/EditUserRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'keep-alive',
                'auth-token': myToken
            },
            body: "name=" + this.state.Name +
                "&username=" + this.state.UserName +
                "&password=" + this.state.Password +
                "&roles=" + this.state.Role +
                "&StoreID=" + this.state.storeid +
                "&status=" + this.state.Status +
                "&id=" + this.state.id,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                var temp = responseJson;
                if (temp.status == 1) {
                    swal({ title: temp.title, text: temp.text, icon: temp.icon })
                }
                this.props.history.push('/users')
            }).catch((error) => console.error(error)).finally();
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
                                                Edit UserInfo
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
                                            <form autoComplete="off" id="AddDeviceForm" name="registration" onSubmit={this.handleSubmit.bind(this)}>
                                                <span className="error_msg"></span>
                                                <input type="hidden" name="hidden_id" id="hidden_id" value={this.state.id} />

                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="Name">Name *</label>
                                                        <input type="text" className="form-control" name="Name"
                                                            id="Name" placeholder="Name"
                                                            value={this.state.Name}
                                                            onChange={(e) => this.setState({ Name: e.target.value })} />
                                                        <span className="error Name_error"></span>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="UserName">Username *</label>
                                                        <input type="text" className="form-control" name="UserName"
                                                            id="UserName" placeholder="User Name"
                                                            value={this.state.UserName}
                                                            onChange={(e) => this.setState({ UserName: e.target.value })} />
                                                        <span className="error UserName_error"></span>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="Password">Password *</label>
                                                        <input type="password" className="form-control" name="Password"
                                                            id="Password" placeholder="Password"
                                                            value={this.state.Password}
                                                            onChange={(e) => this.setState({ Password: e.target.value })} />
                                                        <span className="error Password_error"></span>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="status">Status *</label>
                                                        <select className="form-control selectpicker" name="status" id="Status"
                                                            data-live-search="true" value={this.state.Status}
                                                            onChange={(e) => this.setState({ Status: e.target.value })}>
                                                            <option value="1">Active</option>
                                                            <option value="0">Disable</option>
                                                        </select>
                                                        <span className="error error_status"></span>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="Password">Role *</label>
                                                        <select className="selectpicker form-control" data-live-search="true"
                                                            name="Role" id="Role" required="" value={this.state.Role}
                                                            onChange={(e) => this.setState({ Role: e.target.value })}>
                                                            <option value="">Select Role</option>
                                                            {this.state.role_list.map((x, y) => <option value={x.role_name}>{x.role_name}</option>)}
                                                        </select>
                                                        <span className="error Password_error"></span>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="Password">Select Store *</label>
                                                        <select className="selectpicker form-control" data-live-search="true"
                                                            name="StoreID" id="storeID" required="" onChange={(e) => this.setState({ storeid: e.target.value })} value={this.state.storeid}>
                                                            <option value="">Store ID</option>
                                                            {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                                        </select>
                                                        <span className="error error_StoreID"></span>
                                                    </div>


                                                    <div className="form-group col-md-12" style={{ textAlign: "center" }}>
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <div className="but mt-5">
                                                                    <button type="submit" id="submit" className="btn btn-primary btn-block">Edit User</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div>
            </>

        )
    }
}
