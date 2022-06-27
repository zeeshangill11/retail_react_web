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

export default class soh_details extends Component {
    constructor(props) {

        super(props);
        this.state = {
            store_list: [],
            store_id: 0,
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
                    'url': server_ip + 'inventoryData/soh_detailsController/',
                    'beforeSend': function (request) {
                        request.setRequestHeader("auth-token", myToken);
                    },
                    "data":
                        function (d) {
                            return $.extend({}, d, {
                                "storeid": $("#StoreID").val(),
                                "Company": $("#Company").val(),
                                "Country": $("#Country").val(),
                            });
                        },

                },
                "order": [[1, 'desc']],
                "responsive": true,
                "columns": [
                    { "data": "check_all" },
                    { "data": "storeid" },
                    { "data": "storename" },
                    { "data": "yesterday_soh" },
                    { "data": "on_hand_matching" },
                    { "data": "counted" },
                    { "data": "action" },

                ],
                "searching": false,
                "select": true
            });
        });

        $('.run').click(function () {
            main_table.ajax.reload();
        });

        $('#Check_all').change(function () {
            $('.check_all_inner').prop('checked',this.checked);
        });
        function getSoh(var_my_this,store_name,nextstore){
            var my_this = var_my_this;
            my_this.parents('td').find('.msg_div').html("Please Wait...");
            my_this.prop('disabled',true);
            my_this.html("Please wait");
            
            $.ajax({
                 type:'POST',
                url: server_ip +"cronjobs/StockSummaryDump",
                data:{
                    store_id:store_name
                },
                success:function(data){
                     my_this.html("Consume SOH");
                     my_this.prop('disabled',false);
                     my_this.parents('td').find('.msg_div').html(data.message);
                    //swal("SOH Dump Successfully !");
                    
        
                }
            })
        }

        function CleanSoh(store_name,nextstore){

            var store_name22 = store_name;
            
            swal({
              text: 'Please Enter Password',
              content: "input",
              button: {
                text: "Delete",
                closeModal: false,
              },
            })
            .then(result => {
              if (!result) throw null;
               
                $.ajax({
                    type:'POST',
                    url: server_ip +"cronjobs/CleanSOH",
                    data:{
                        "store_id":store_name22,
                        "password":result
                    },
                    success: function(data)
                    {
                        
                    var response_data = JSON.parse(data);
                    var result_set = response_data.toString();
                   
                    if(result_set == "Incorrect Password !"){
                        swal({
                            title: 'Incorrect password',
                            icon: "warning"
                        })
                        swal.stopLoading();
                    }else if(result_set == "Clean Successfully !"){
                        swal("Poof! Soh Clean Successfully !", {
                            icon: "success",
                        });
                        swal.stopLoading();
                        swal.close();
                    }
                        
                        
                    }
                });
                
            })
            .catch(err => {
              if (err) {
                swal("Oh noes!", "The AJAX request failed!", "error");
              } else {
                swal.stopLoading();
                swal.close();
              }
            });  
            
            
        }

        function run_cycle_count_Soh(var_my_this,store_name,nextstore){
            var my_this = var_my_this;
            var store_name22 = store_name;
        
            my_this.parents('td').find('.msg_div').html("Please Wait...");
            my_this.prop('disabled',true);
            my_this.html("Please wait");
            
            $.ajax({
                type:'POST',
                url: server_ip + "cronjobs/run_cycle_count",
                data:{
                    "store_name":store_name22,
                    "token":'innovent@123'
                },
                success: function(data)
                {
                    
                    var response_data = (data);
                    console.log(response_data.message);
                    if(response_data.message != null || response_data.message == 'All Done !.' )
                    {
                        my_this.html("Run CycleCount");
                        my_this.prop('disabled',false);
                        my_this.parents('td').find('.msg_div').html(data.message);
                        /*swal("Poof! Cycle Count run Successfully !", {
                            icon: "success",
                        });*/
                        return false;    
                    }else {
                        my_this.parents('td').find('.msg_div').html('Error !');
                    }
                }
            });
        }

        $(document).on('click','.consume_soh', function(){
            var my_this     =   $(this);
            var store_name  =   $(this).attr('store_name');
            getSoh(my_this,store_name,'');
        });
        
        
        $(document).on('click','.clean_soh', function(){
            var store_name = $(this).attr('store_name');
            CleanSoh(store_name,'');
        });
        
        
        $(document).on('click','.run_soh', function(){
            var my_this     =   $(this);
            var store_name  = $(this).attr('store_name');
            run_cycle_count_Soh(my_this,store_name,'');
        });


    }

    handleFromDateChange = date => {
        this.setState({ startDate: date })
    }

    handleToDateChange = date => {
        this.setState({ endDate: date })
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
                                                Soh Detail
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
                                                    <select className="form-control d-inline-block mr-2" data-live-search="true"
                                                        name="StoreID" id="StoreID" onChange={(e) => this.setState({ store_id: e.target.value })} value={this.state.store_id ? this.state.store_id : 0} >
                                                        <option value="">All Stores</option>
                                                        {this.state.store_list.map((x, y) => <option key={x.storename} value={x.storename}>{x.storename}</option>)}
                                                    </select>


                                                    <div className="d-inline-block mr-4 mb-0 w-25 my-2">
                                                        <button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block">Search</button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="data-tables">
                                                <table id="dataTable" className="text-center mm-datatable" style={{ width: "100%" }}>
                                                    <thead className="bg-light text-capitalize">
                                                        <tr>
                                                            <th style={{width: "20px", padding: "0px !important"}}>Check all <input type="checkbox" name="check_all" value="" id="Check_all" style={{width :"20px", display: "block"}}/></th>
                                                            <th>Store ID</th>
                                                            <th>Store Name</th>
                                                            <th>On hand matching Soh Yesterday</th>
                                                            <th>On Hand Matching</th>
                                                            <th>Counted</th>
                                                            <th style={{width: '25% !important'}}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="table-striped">

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
