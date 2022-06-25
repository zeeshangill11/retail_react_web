import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { Link, withRouter } from "react-router-dom";
import swal from 'sweetalert';

import Header from  '../header/header';
import TopBar from  '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
import Cookies from 'universal-cookie';

var cookies = new Cookies();
var myToken = cookies.get('myToken');
class addstore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      StoreName:'',
      status:1,
      StoreLocation:'',
      LatLng:'',
      CountryName:'',
      Company:'',
      store_type:'WareHouse',
    };

  }
  async componentDidMount (){
  }
  async handleSubmit(event) {
    event.preventDefault();

    let server_ip = await new_config.get_server_ip();

    fetch( server_ip+'stockCountRecords/AddStore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
      },
      body: "StoreName="+this.state.StoreName+
            "&status="+this.state.status+
            "&StoreLocation="+this.state.StoreLocation+
            "&LatLng="+this.state.LatLng+
            "&CountryName="+this.state.CountryName+
            "&Company="+this.state.Company+
            "&store_type="+this.state.store_type
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var temp = responseJson;
      if (temp.status == 1) {
        swal({title: temp.title,text: temp.text,icon: temp.icon})
      }
      this.props.history.push('/storeInfo')
    }).catch((error) => console.error(error)).finally();
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
						  <div className="row">
						    <div className="col-12 mt-1">
						      <div className="card">
						        <div className="card-header">
						          <div className="left d-inline-block">
						            <h4 className="mb-0"> 
						              <i className="ti-stats-up" style={{color:"#000"}}></i> 
						              Add Store
						            </h4>
						            <p className="mb-0 dateTime"></p>
						          </div>
						          <div className="right d-inline-block float-right mt-2">
						            <img src="/asserts/images/count/Group 9.png" height="30px" />
						            <img src="/asserts/images/count/Icon feather-printer.png" height="30px" className="ml-1 mr-1" />
						          </div>
						        </div>
						        <div className="card-body">
						          <form autoComplete="off" id="AddStoreForm" name="registration" onSubmit={this.handleSubmit.bind(this)}>
						            <span className="error_msg"></span>
						            <div className="form-row">
						              <div className="form-group col-md-6">
						                <label htmlFor="Name">Storename *</label>
						                <input type="text" className="form-control" name="StoreName" id="StoreName" placeholder="Store Name" defaultValue={this.state.StoreName} 
						                	onChange={ (e) => this.setState({ StoreName: e.target.value }) }/>
						                <span className="error StoreName_error"></span>
						              </div>
						              <div className="form-group col-md-6">
						                <label htmlFor="status">Status *</label>
						                <select className="form-control selectpicker" name="status" id="Status" value={this.state.status}
						                 	onChange={ (e) => this.setState({ status: e.target.value }) }>
						                  <option value="1">Active</option>
						                  <option value="0">Disable</option>
						                </select>
						                <span className="error error_status"></span>
						              </div>
						              <div className="form-group col-md-6">
						                <label htmlhtmlFor="storename">Store Location *</label>
						                <input type="text" name="StoreLocation" 
						                  id="StoreLocation" 
						                  className="form-control" placeholder="Store Location"
						                  defaultValue={this.state.StoreLocation} 
						                  onChange={ (e) => this.setState({ StoreLocation: e.target.value }) }/>
						                <span className="error error_StoreLocation"></span>
						              </div>
						              <div className="form-group col-md-6">
						                <label htmlFor="storename">Lat Lng *</label>
						                <input type="text" name="LatLng" id="LatLng" className="form-control" placeholder="LatLng" defaultValue={this.state.LatLng} 
							                onChange={ (e) => this.setState({ LatLng: e.target.value }) }/>
						                <span className="error error_LatLng"></span>
						              </div>
						              <div className="form-group col-md-6">
						                <label htmlFor="storename">Country name *</label>
						                <input type="text" name="CountryName" id="CountryName" className="form-control" placeholder="Country Name" 
						                 	defaultValue={this.state.CountryName} 
						                 	onChange={ (e) => this.setState({ CountryName: e.target.value }) }/>
						                <span className="error error_CountryName"></span>  
						              </div>
						              <div className="form-group col-md-6">
						                <label htmlFor="storename">Company *</label>
						                <input type="text" name="Company" id="Company" className="form-control" placeholder="Company Name" defaultValue={this.state.Company} 
							                onChange={ (e) => this.setState({ Company: e.target.value }) }/>
						                <span className="error error_Company"></span>  
						              </div>
						              <div className="form-group col-md-6">
						                <label htmlFor="type">Store Type *</label>
						                <select className="form-control selectpicker" name="store_type" id="store_type" data-live-search="true" value={this.state.store_type}
						                	onChange={ (e) => this.setState({ store_type: e.target.value }) } >
						                  <option value="WareHouse">WareHouse</option>
						                  <option value="StoreFront">StoreFront</option>
						                </select>
						                <span className="error error_status"></span>
						              </div>
						              <div className="form-group  col-md-12" style={{textAlign:"center"}}>
						                <div className="row">
						                  <div className="col-md-4">
						                    <div className="but mt-5">
						                      <button type="submit" id="submit" className="btn btn-primary btn-block">Add Store
						                      </button>
						                    </div>
						                  </div>
						                </div>
						              </div>
						            </div>
						          </form>
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
export default withRouter(addstore)