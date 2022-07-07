import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
//jQuery libraries

import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class admin_menu extends Component {
    constructor(props) {

        super(props);
        this.state = {

        };
    }


    componentDidMount = async () => {
        const server_ip = await new_config.get_server_ip();
        var cookies = new Cookies();

        var myToken = cookies.get('myToken');
        console.log(myToken)
        $(document).on('click','.run_cron_job', function(){
   
            Run_CronJob();
        }); 

        function Run_CronJob(){

            $.ajax({
                type:'POST',
                url: server_ip+"cronjobs/CronJobRun30",
                success:function(data){
                    
                    swal("Run Successfully !");
                    
        
                }
            })
        }
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
                                                Admin Menu
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
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/handle_cronjobs' className="btn btn-primary btn-block">Handle Cronjob</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/soh_details' className="btn btn-secondary btn-block">Soh Handle</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/ibtDifferences' className="btn btn-success btn-block">Notification</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/admin_error_log' className="btn btn-danger btn-block">Error Log</Link>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/problem_asn' className="btn btn-warning btn-block">Problem Asn</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/stockSummaryExtras' className="btn btn-info btn-block">Stock Summary Extra</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/enterpriseReportOld' className="btn btn-primary btn-block">Enterprise Report Old</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <button className="btn btn-secondary btn-block run_cron_job">Run Cron Job</button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/dailyStockCountReport' className="btn btn-success btn-block">Enterprise Report</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/store_payload' className="btn btn-success btn-block">Store Payload</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="but mt-2">
                                                            <Link to='/enterprise_report' className="btn btn-primary btn-block">Enterprise Report</Link>
                                                        </div>
                                                    </div>
                                                </div>
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
