import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

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

export default class zplInfo extends Component {
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
                    'url': server_ip + 'stockCountRecords/getzplinfo/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "id" },
                    { "data": "name" },
                    { "data": "zplbutton" },
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

        $(document).on('click', '.deleteRecord', function () {
            var del_id = $(this).attr('del_id');
            if (window.confirm('Are you really wants to delete the device ?')) {
                fetch(server_ip + 'stockCountRecords/zplDelete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Connection': 'keep-alive',
                    },
                    body: "id=" + del_id,
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        var temp = responseJson;
                        if (temp.status == 1) {
                            main_table.ajax.reload();
                        }
                        console.log(temp);
                    }).catch((error) => console.error(error)).finally();
            }

        });
        $(document).on('click', '.store_zpl_id', function () {
            var zpl_id = $(this).attr('zpl_id');
            $(".modal-title").text('ZPL');
            var mythis = $('#FORM').show();
            mythis.find('.waiting').show();

                fetch(server_ip + 'stockCountRecords/ViewZPLModel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Connection': 'keep-alive',
                    },
                    body: "zpl_id=" + zpl_id,
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        var response_data = JSON.parse(responseJson);

                        mythis.find('.waiting').hide();

                        var list = '<div class="text-wrap" style="overflow: auto;">' + response_data[0].zpl + '</div>';
                        
                        $("#store_list").html(list);
                    }).catch((error) => console.error(error)).finally();

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
                                                ZPL
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
                                                <div className="mb-0 filter-size">

                                                    <div className="d-inline-block mr-4 mb-05 my-2">
                                                        <Link to="/addzpl" type="button" id="" className="btn btn-danger BtnAdd">Add User</Link>
                                                    </div>

                                                </div>

                                            </div>
                                            <div className="data-tables">
                                                <table id="dataTable" className="text-center mm-datatable" style={{ width: "100%" }}>
                                                    <thead className="bg-light text-capitalize">
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>ZPL</th>
                                                            <th>Store Name</th>
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
                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">ZPL Stores</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form id="FORM">

                                <div className="edit-manage"></div>
                                <div className="modal-body" style={{ height: "560px" }}>
                                    <div className="load" style={{ textAlig: "center" }}>
                                        <span className="waiting" style={{ display: "none;" }}>
                                            <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                                        </span>
                                    </div>

                                    <div id="store_list">

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
