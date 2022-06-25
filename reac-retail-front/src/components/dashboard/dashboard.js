import React, { Component } from "react";
import new_config from '../../services/config';
import provider from '../../services/executiveSummaryJS';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
import Cookies from 'universal-cookie';
var cookies = new Cookies();
var myToken = cookies.get('myToken');

export default class executiveSummary extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    var total_store = await this.StoreCount();
    var totalusers  = await this.totalusers();
    var storeName   = await this.storeName();
  }

  async StoreCount(){
    let server_ip = await new_config.get_server_ip();

    return fetch(server_ip + 'stockCountRecords/totalstore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'auth-token': myToken
      },
      body: "",
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var temp = responseJson;
      return temp;
    }).catch((error) => console.error(error)).finally();
  }

  async totalusers(){
    let server_ip = await new_config.get_server_ip();

    return fetch(server_ip + 'stockCountRecords/totalusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'auth-token': myToken
      },
      body: "",
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var temp = responseJson;
      return temp;
    }).catch((error) => console.error(error)).finally();
  }

  async storeName(){
    let server_ip = await new_config.get_server_ip();

    return fetch(server_ip + 'stockCountRecords/getStoreName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'auth-token': myToken
      },
      body: "",
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var temp = responseJson;
      return temp;
    }).catch((error) => console.error(error)).finally();
  }

  render() {

    return (
      <>
        <Header />
        <TopBar />
        <div className="page-container">
          <LeftBar />
          <div className="main-content">
            <div className="content-wrapper  pb-4 " id="dashboard">
              <div className="col-12 mt-1">
                <div className="cad dash_board">
                  <div className="card-header">
                    <div className="left d-inline-block">
                      <h4 className="mb-0"> <i className="ti-stats-up" style={{color:"#000"}}></i> Dashboard</h4>
                      <p className="mb-0 dateTime"></p>
                    </div>
                    <div className="right d-inline-block float-right mt-2">
                      <img src="/asserts/images/count/Group 9.png" height="30px" />
                      <span style={{cursor:"pointer"}} onclick="window.location.href='{{sitelink}}/api/1.0.0/inventoryData/GetInventoryByItem_ex/'">
                      </span>
                    </div>
                  </div>
                  <div className="row ml-2 mr-2">
                    <div className="col-md-4 pl-2 pr-2">
                      <div className="card" style={{minHeight:"100px"}}>
                        <div className="card-body p-3">
                          <Link to="/storeinfo" style={{color: "#212529",textDecoration:"none"}} target="_blank">

                            <span>Total Stores</span>
                            <img src="/asserts/images/plus-icon.png" className="float-right" height="20px" />
                            <h2 className="text-center mb-0 mt-2" id="CountDynamic">
                              <span className="waiting" style={{display:"none"}}>
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                              </span>
                              <p style={{marginBottom: "0"}} id="totalstore"></p>
                            </h2>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 pl-2 pr-2">
                      <div className="card" style={{minHeight:"100px"}}>
                        <div className="card-body p-3">
                          <Link to="/usersinfo" style={{color: "#212529",textDecoration:"none"}} target="_blank">
                            <span>Total Users</span>
                            <img src="/asserts/images/plus-icon.png" className="float-right" height="20px" />
                            <h2 className="text-center mb-0 mt-2" id="TotalUsers">
                              <span className="waiting" style={{display:"none"}}>
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                              </span>
                              <p style={{marginBottom:"0"}} id="total_users"></p>
                            </h2>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 pl-2 pr-2">
                      <div className="card" style={{minHeight: "100px"}}>
                        <div className="card-body p-3">
                          <span>Total Devices</span>
                          <Link to="/handheldDevices" style={{color: "#212529",textDecoration:"none"}} target="_blank">
                            <img src="/asserts/images/plus-icon.png" className="float-right" height="20px" />
                            <h2 className="text-center mb-0 mt-2" id="TotalDevices">
                              <span className="waiting" style={{display:"none"}}>
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                              </span>
                            </h2>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row row-eq-height dashboard-new mt-1 ml-2 mr-2">
                    <div className="col-md-8 pl-2 pr-2">
                      <div className="card activities mt-3">
                        <div className="card-body p-3" >
                          <h3 className="mainheading">Activities
                            <Link to="/AuditInfo" style={{color: "#212529",textDecoration:"none"}} target="_blank">
                              <img src="/asserts/images/icon-open-list.png" className="float-right" height="15px" />
                            </Link>  
                          </h3>
                          <div id="Activities">
                            <span className="waiting" style={{display:"none"}}>
                              <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 pl-2 pr-2">
                      <div className="card mt-3" id="CountDynamic">
                        <div className="card-body p-3">
                          <span>Last Scan</span>
                          <span className="float-right" id="DateDisplay"></span>
                          <div className="form-group mt-3">
                            <select name="StoreID" className="selectpicker form-control" 
                              id="StoreID" data-live-search="true">
                              <option value="">Store ID</option>
                            </select>
                          </div>
                          <div className="matchingg progress-sec">
                            <p className="mb-0 d-inline-block left">Matching</p>
                            <p className="mb-0 d-inline-block right matching_text">0%</p>
                            <div className="center mr-1 matching">
                              <span className="waiting" style={{display:"none"}}>
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                              </span>
                              <div className="progress" style={{height:"4px"}}>
                                <div className="progress-bar bg-warning" role="progressbar" style={{width: "100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </div>
                          </div>
                          <div className="overs progress-sec">
                            <p className="mb-0 d-inline-block left">Overs</p>
                            <p className="mb-0 d-inline-block right over_text">0%</p>
                            <div className="center overs mr-1">
                              <span className="waiting" style={{display:"none"}}>
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                              </span>
                              <div className="progress" style={{height:"4px"}}>
                                <div className="progress-bar bg-info" role="progressbar" 
                                  style={{width: "100%"}} 
                                  aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="unders progress-sec">
                            <p className="mb-0 d-inline-block left">Unders</p>
                            <p className="mb-0 d-inline-block right under_text">0%</p>
                            <div className="center unders mr-1">
                              <span className="waiting" style={{display:"none"}}>
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                              </span>
                              <div className="progress" style={{height: "4px"}}>
                                <div className="progress-bar bg-danger" role="progressbar" style={{width: "100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </div>
                          </div>
                          <div className="row row-eq-height last-scan-row">
                            <div className="col-md-6">
                              <div className="crd mainCard">
                                <div className="card-body crdBody">
                                  <p>Stock On Hand</p>
                                  <h4 id="Onhand">0</h4>
                                  <p>Count</p>
                                  <h4 id="Count">0</h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="crd mainCard">
                                <div className="card-body crdBody">
                                  <p>Back Store</p>
                                  <h4 id="back"><span className="ftbk-vl">0</span></h4>
                                  <p>Sales Floor</p>
                                  <h4 id="front"><span className="ftbk-vl">0</span></h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="main-footer">
              <div className="row ml-0 mr-0">
                <div className="col-sm-6">
                  <p className="mb-0 pt-1 light">INNOVENT IOT Platform | Release v3.2.417</p>
                  <p className="mb-0 pt-1 light">Time Zone</p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0 pt-2 light text-right">Page Load: 0.35s</p>
                </div>
              </div>
            </footer>          
          </div>
        </div>

      </>


    );
  }
}