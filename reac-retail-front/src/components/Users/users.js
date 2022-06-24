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

export default class users extends Component {
    constructor(props) {

        super(props);
        this.state = {
            name: " ",
            u_name: " "
        };
    }


    componentDidMount = async () => {

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
                    'url': server_ip + 'stockCountRecords/getusersinfo/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "Name": $("#name").val(),
                                "UserName": $('#u_name').val(),
                            });
                        },
                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "id" },
                    { "data": "name" },
                    { "data": "username" },
                    { "data": "role_name" },
                    { "data": "storeid" },
                    { "data": "status" },
                    { "data": "last_login" },
                    { "data": 'action' },
                ],
                "searching": false,
                "select": true
            });
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
                    <div className="content-wrapper pb-4">

                        <div className="row">
                            <div className="col-12 mt-1">
                                <div className="card">

                                    <div className="card-header">
                                        <div className="left d-inline-block">
                                            <h4 className="mb-0"> <i className="ti-stats-up" style={{ color: "#000" }}></i>
                                                Users Info
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

                                                    <input className="mx-2" type="text" placeholder="Name" name="name" id="name" onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name ? this.state.name.trim() : ""} ></input>
                                                    <input className="mx-2" type="text" placeholder="User Name" name="u_name" id="u_name" onChange={(e) => this.setState({ u_name: e.target.value })} value={this.state.u_name ? this.state.u_name.trim() : ""} ></input>


                                                    <div className="d-inline-block mr-4 mb-0 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run">Search</button>
                                                    </div>

                                                    <div className="d-inline-block mr-4 mb-05 my-2">
                                                        <Link to="/addUser" type="button" id="" className="btn btn-danger BtnAdd">Add User</Link>
                                                    </div>

                                                </div>

                                            </div>
                                            <div class="data-tables">
                                                <table id="dataTable" class="text-center mm-datatable">
                                                    <thead class="bg-light text-capitalize">
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>UserName</th>
                                                            <th>Roles</th>
                                                            <th>Stores</th>
                                                            <th>Status</th>
                                                            <th>Last login</th>
                                                            <th>Action</th>
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
