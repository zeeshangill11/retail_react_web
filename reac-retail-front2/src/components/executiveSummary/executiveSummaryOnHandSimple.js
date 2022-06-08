import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

import Header from  '../header/header';
import TopBar from  '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
 
export default class executiveSummaryOnHandSimple extends Component {
	constructor(props) {
        console.log(props);
		super(props);
	}
	render() {
		return(
         	<>
      		<Header />
			<TopBar />
			<div className="page-container">
				<LeftBar />
				<div className="main-content">
					<div className="content-wrapper pb-4">

		                <div className="BtnAddLis">
		                    <Link to="/executiveSummary" className="btn btn-danger BtnAdd"> Back </Link>
		                </div>
		                <div className="row">
                            <div className="col-12 mt-1">
                                <div className="card">

                                    <div className="card-header">
                                        <div className="left d-inline-block">
                                            <h4 className="mb-0"> <i className="ti-stats-up" style={{color:"#000"}}></i> 
                                                One Hand
                                            </h4>
                                            <p className="mb-0 dateTime"></p>
                                        </div>
                                        <div className="right d-inline-block float-right mt-2">
                                           
                                            <img src="/asserts/images/count/Group 9.png" height='25px' />
                                            <span style={{cursor:"pointer"}} className="button_print">
                                                <img src="/asserts/images/count/Icon feather-printer.png" height='30px' className="ml-1 mr-1" />
                                            </span>
                                            
                                             <span style={{cursor:"pointer"}} className="buttons_excel2">
                                                <img src="/asserts/images/count/Group 10.png" height='30px' />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="before_load_table" style={{display:"none"}}>
                                            <img src="/asserts/images/waiting_before_table_load.gif" />
                                        </div>
                                        Coming Soon
                                        <div className="data-tables">
                                            <table id="dataTable" className="text-center mm-datatable">
                                                <thead className="bg-light text-capitalize">
                                                    <tr>
                                                        <th>Sku Code</th>
                                                        <th>Department</th>
                                                        <th>Brand</th>
                                                        <th>Color </th>
                                                        <th>Size </th>       
                                                        <th>Initial</th>
                                                        <th>Counted</th>
                                                        <th>Unexpected</th>
                                                                                             
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
		            </div>
				</div>
			</div>

          	</>
		)
	}
}