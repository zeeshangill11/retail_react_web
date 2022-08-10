import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
import "react-datepicker/dist/react-datepicker.css";

//jQuery libraries

import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';


import Cookies from 'universal-cookie';

export default class printerInfo extends Component {
    constructor(props) {

        super(props);
        this.state = {
            store_list: [],
            company_list: [],
            country_list: [],
            store_id: 0,
            country_id: 0,
            company_id: 0,
            error_msg: "",
        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
        }));
        var company = await common.get_storeCompany();
        this.setState(company_list => ({
            company_list: company
        }));
        var country = await common.get_storeCountry();
        this.setState(country_list => ({
            country_list: country
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
                    'processing': '&nbsp; &nbsp; Please wait... <br><div className="spinner"></div>'
                },

                'serverMethod': 'post',
                'ajax': {
                    'url': server_ip + 'stockCountRecords/getprinter/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "id" },
                    { "data": "name" },
                    { "data": "ip" },
                    { "data": "port" },
                    { "data": "storeid" },
                    { "data": "status" },
                    { "data": "remarks" },
                    { "data": "action" },

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
                                                Printer Info
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
                                        <div className="card-body" style={{overflowY: "auto"}}>

                                            <div className="data-tables">
                                                <table id="dataTable" className="text-center mm-datatable" style={{width: "100%"}}>
                                                    <thead className="bg-light text-capitalize">
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>IP</th>
                                                            <th>Port</th>
                                                            <th>StoreName</th>
                                                            <th>Status</th>
                                                            <th>Remarks</th>
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
