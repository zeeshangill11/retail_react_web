import React, { Component } from 'react'
import new_config from '../../services/config';

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

export default class problem_asn extends Component {
    constructor(props) {

        super(props);
        this.state = {
            startDate: '',
            ibt: " ",
            check: false,
        };
    }

    async onShowOverChange(event) {
        if (event.target.checked) {
            this.setState({ check: true });
        } else {
            this.setState({ check: false });
        }
    }
    componentDidMount = async () => {

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
                    'url': server_ip + 'stockCountRecords/get_problem_asn/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "from_my_date": $("#Date").val(),
                                "Asn": $('#ibt').val(),
                                "show_details": $('#show_details').val()
                            });
                        },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "asn" },
                    { "data": "db_status" },
                    { "data": "status" },

                    { "data": "packing_date" },
                    { "data": "shipping_date" },
                    { "data": "receiving_date" },
                    { "data": "packed_item" },
                    { "data": "transferred_item" },
                    { "data": "received_item" }


                ],
                "searching": false,
                "select": true
            });
        });

        $('.run').click(function () {
            main_table.ajax.reload();
        });

    }

    handleFromDateChange = date => {
        this.setState({ startDate: date })
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
                                                Problem IBT Data
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

                                                    <span id="iot_notification"></span>
                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <DatePicker onChange={this.handleFromDateChange} selected={this.state.startDate} className="form-control d-inline-block mr-2 date_picker_22"
                                                            id="Date" name="date" placeholderText="From Date: yyyy-mm-dd"
                                                            dateFormat="yyyy-MM-dd" />
                                                    </div>
                                                    <input className="mx-2" type="text" placeholder="IBT" name="ibt" id="ibt" onChange={(e) => this.setState({ ibt: e.target.value })} value={this.state.ibt ? this.state.ibt.trim() : ""} ></input>
                                                    <div className="d-inline-block" style={{ width: "150px !important" }}>
                                                        <input type="checkbox" class="d-inline-block mr-2"
                                                            id="show_details" name="show_details"
                                                            style={{ width: "15px", display: "inline-block", top: "20%", left: "94%" }} onChange={evt => this.onShowOverChange(evt)} value={this.state.check} />
                                                    </div>

                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block">Search</button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="data-tables">
                                                <table id="dataTable" class="text-center mm-datatable">
                                                    <thead class="bg-light text-capitalize">
                                                        <tr>
                                                            <th>IBT</th>

                                                            <th>DB status</th>
                                                            <th>IOT Status</th>

                                                            <th>packing date</th>
                                                            <th>shipping date</th>
                                                            <th>receiving date</th>
                                                            <th>Packed Item</th>
                                                            <th>Transferred Item</th>
                                                            <th>Received Item</th>
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
