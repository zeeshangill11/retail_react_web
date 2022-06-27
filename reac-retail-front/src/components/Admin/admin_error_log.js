import React, { Component } from 'react'
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
import swal from 'sweetalert';

export default class admin_error_log extends Component {
    constructor(props) {

        super(props);
        this.state = {

        };
    }


    componentDidMount = async () => {
        var stores = await common.get_stores();
        this.setState(store_list => ({
            store_list: stores
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
                    'url': server_ip + 'inventoryData/admin_error_logReport/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                    function ( d ) {
                        return $.extend( {}, d, {
                            "storeid": $( "#StoreID" ).val(),
                        });
                    },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "date_time" },
                    { "data": "file_name" },
                    { "data": "view_file" },
                ],
                "searching": false,
                "select": true
            });
        });

        $('.run').click(function () {
            main_table.ajax.reload();
        });
        $(document).on('click','.clear_file',function(){

            $.ajax({
                type:'POST',
                url: server_ip+"inventoryData/clear_fileReport",
                success: function(data)
                {
                   
                    main_table.ajax.reload();
                    console.log(data);
        
                   // alert( $("#StoreID").val());
                }
            });
        
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
                                                Admin Error Log
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

                                                    <div className="d-inline-block mr-4 mb-0 my-2"  style={{float: "right"}}>
                                                        <button type="button" id="executiveSummary" className="btn btn-danger btn-md clear_file btn-block">Clear</button>
                                                    </div>
                                            <div className="data-tables">
                                                <table id="dataTable" className="text-center mm-datatable" style={{ width: "100%" }}>
                                                    <thead class="bg-light text-capitalize">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>File name</th>
                                                            <th>View File</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="table-striped">

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
