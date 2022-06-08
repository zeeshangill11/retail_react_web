import React, { Component } from "react";
import new_config from '../../services/config';
import provider from '../../services/executiveSummaryJS';
import common from '../../services/commonFunctionsJS';
import { Link } from "react-router-dom";

import Header from  '../header/header';
import TopBar from  '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';
 
export default class executiveSummary extends Component {

	async onStoreIdChange (event) {
		this.setState({store_id: event.target.value});

		let server_ip = await new_config.get_server_ip();
		var store_id = this.state.store_id;
		if (store_id != null && store_id != undefined && store_id != "") {

			//Get Departments
			var departments = await common.get_departments(store_id);
			this.setState(dept_list => ({dept_list: departments}));

		  //Get Brands
		  var brands = await common.get_brands(store_id);
			this.setState(brand_list => ({brand_list: brands}));

		  //Get Colors
		  var colors = await common.get_colors(store_id);
			this.setState(color_list => ({color_list: colors}));

		  //Get Sizes
		  var sizes = await common.get_sizes(store_id);
			this.setState(size_list => ({size_list: sizes}));
		} else {
			var arr = [];
			this.setState(dept_list => ({dept_list: arr}));
			this.setState(brand_list => ({brand_list: arr}));
			this.setState(color_list => ({color_list: arr}));
			this.setState(size_list => ({size_list: arr}));
		}
	}

	async onDateChange (event) {
		this.setState({summarydate: event.target.value});
	}

	async onShowOverChange (event) {
		if (event.target.checked) {
			this.setState({show_over: 'yes'});
		}
	}

	async summaryValidate(event){
		var working = false;
		var error = 0;
		if(this.state.store_id =="" || this.state.store_id==null){
      error=1;
      document.getElementById("StoreID").style.borderColor = "red"
      this.setState({error_msg : "Please Select Store!"})
    }else{
      this.setState({error_msg : ""})
      document.getElementById("StoreID").style.borderColor = "#fff"
    }

    if (error === 0) {
	    if(this.state.summarydate==="" || this.state.summarydate===null){
	      error=1;
	      this.setState({error_msg : "Please Select Date !"})
	      document.getElementById('summarydate').style.borderColor = "red"
	    }else {
	      this.setState({error_msg : ""})
	    	document.getElementById('summarydate').style.borderColor = "#fff"
	    }
    }
    if (error === 0) {
    	
    	await this.summary(event)
    }

	}
	async summary_main_detail()
	{
		
		let server_ip = await new_config.get_server_ip();
		var dptid = document.getElementById('DepartmentID').value;
		var bid = document.getElementById('BrandID').value;
		var date = this.state.summarydate;
		var storeid = document.getElementById('StoreID').value;
		var size = document.getElementById('Size').value;
		var color = document.getElementById('Color').value;
		var mythis = document.getElementById('CountDynamic');
		var show_over = "no";
    if(document.getElementById('show_over').checked){
      show_over = "yes"; 
    }

		return fetch( server_ip+'inventoryData/executiveSummaryController', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded',
	      'Connection': 'keep-alive',
	    },
	    body: "dptid="+dptid+"&bid="+bid+"&date="+date+"&storeid="+storeid+"&size="+size+"&color="+color+"&show_over="+show_over,
		})
	  .then((response) => response.json())
	  .then((responseJson) => {
			var temp = responseJson; 
			return temp;

	  }).catch((error) => console.error(error)).finally();

	}
	async criticalOutOfStocksummary()
	{
		
		let server_ip = await new_config.get_server_ip();
		var dptid = document.getElementById('DepartmentID').value;
		var bid = document.getElementById('BrandID').value;
		var date = this.state.summarydate;
		var storeid = document.getElementById('StoreID').value;
		var show_over = "no";
    if(document.getElementById('show_over').checked){
      show_over = "yes"; 
    }

		return fetch( server_ip+'inventoryData/CriticalOutOfStocksummary', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded',
	      'Connection': 'keep-alive',
	    },
	    body: "dptid="+dptid+"&bid="+bid+"&date="+date+"&storeid="+storeid,
		})
	  .then((response) => response.json())
	  .then((responseJson) => {
			var temp = responseJson; 
			return temp;

	  }).catch((error) => console.error(error)).finally();

	}
	async criticalOutOfStockPercentagesummary()
	{
		
		let server_ip = await new_config.get_server_ip();
		var dptid = document.getElementById('DepartmentID').value;
		var bid = document.getElementById('BrandID').value;
		var date = this.state.summarydate;
		var storeid = document.getElementById('StoreID').value;
		var size = document.getElementById('Size').value;
		var color = document.getElementById('Color').value;
		var mythis = document.getElementById('CountDynamic');
		var show_over = "no";
    if(document.getElementById('show_over').checked){
      show_over = "yes"; 
    }

		return fetch( server_ip+'inventoryData/CriticalOutOfStocksummarypercentage', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded',
	      'Connection': 'keep-alive',
	    },
	    body: "dptid="+dptid+"&bid="+bid+"&date="+date+"&storeid="+storeid+"&criticalper="+this.state.CriticalStock+"&onehand="+this.state.onhandtotal,
		})
	  .then((response) => response.json())
	  .then((responseJson) => {
			var temp = responseJson; 
			return temp;

	  }).catch((error) => console.error(error)).finally();

	}
	async summary(event){

		var main_data = await this.summary_main_detail();
		if(main_data[0].onhandtotal !== null){
			this.setState({onhandtotal : main_data[0].onhandtotal})
    }
    else{ this.setState({onhandtotal : 0}) }

		var main_data2 = await this.criticalOutOfStocksummary();
		
		if(main_data2[0].CriticalStock !== null){
			this.setState({CriticalStock : main_data2[0].CriticalStock})
    }
    else{ this.setState({CriticalStock : 0}) }

    var main_data3 = await this.criticalOutOfStockPercentagesummary();

  	if(main_data3[0].criticalperentage !== null){
			this.setState({criticalperentage : main_data3[0].criticalperentage})
    }
    else{ this.setState({criticalperentage : 0}) }


    if(main_data[0].inventroycount !== null){
			this.setState({inventroycount : main_data[0].inventroycount})
		}
		else{ this.setState({inventroycount : 0}) }

		if(main_data[0].counted_sf !== null){
			this.setState({counted_sf : main_data[0].counted_sf})
		}
		else{ this.setState({counted_sf : 0}) }

		if(main_data[0].counted_sr !== null){
			this.setState({counted_sr : main_data[0].counted_sr})
		}else{ this.setState({counted_sr : 0}) }

		if(main_data[0].missingtotal !== null){
			this.setState({missingtotal : main_data[0].missingtotal})
		}
		else{ this.setState({missingtotal : 0}) }

		if(main_data[0].missingpercentage !== null){
			this.setState({missingpercentage : main_data[0].missingpercentage})
		}
		else{ this.setState({missingpercentage : 0}) }

		if(main_data[0].overtotal !== null 
		  && main_data[0].overtotal !== undefined && main_data[0].overtotal !=='null')
		{
			this.setState({overtotal : main_data[0].overtotal})
		}
		else{ this.setState({overtotal : 0}) }

		if(main_data[0].onhandmatching !== null){
			this.setState({onhandmatching : main_data[0].onhandmatching})
		}
		else{ this.setState({onhandmatching : 0}) }

		if(main_data[0].overpercentage !== null){
			this.setState({overpercentage : main_data[0].overpercentage})
		}
		else{ this.setState({overpercentage : 0}) }

		if(main_data[0].item_accuracy !== null){
			this.setState({item_accuracy : main_data[0].item_accuracy})
		}
		else{ this.setState({item_accuracy : 0}) }

		if(main_data[0].operational_accuracy !== null){
			this.setState({operational_accuracy : main_data[0].operational_accuracy})
		}
		else{ this.setState({operational_accuracy : 0}) }

		console.log(main_data2);

	
	}
	constructor(props) {
  	super(props);
    this.state = {
      store_list:[],
      dept_list:[],
      brand_list:[],
      color_list:[],
      size_list:[],
      respone1:[],
      onhandtotal:0,
      inventroycount:0,
			counted_sf:0,
			counted_sr:0,
			missingtotal:0,
			missingpercentage:0,
			overtotal:0,
			onhandmatching:0,
			overpercentage:0,
			item_accuracy:0,
			operational_accuracy:0,
			CriticalStock:0,
			criticalperentage:0,
			store_id:0,
			summarydate:'',
			show_over:'no',
      error_msg:""
    };

	}
  async componentDidMount ()
  {
  	var stores = await common.get_stores();
  	this.setState(store_list => ({
		  store_list: stores
		}));

		let all_data = await provider.get_report();
		/*

	 fetch( server_ip+'login/web_login2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
      },

      body: JSON.stringify({
        "username": username,
        "password": password,
        "token": "123456",
         "waiting":"0"
      })

    })
    .then((response) => response.json())
    .then((responseJson) => {
      

      if(responseJson.error=="0")
      {
        this.setState({
          msg:responseJson.message,
          messageStatus:'1'
        });
       
        setTimeout(() => {
           this.props.history.push('/executiveSummary');
        }, 2000);

      }
      else
      {
        this.setState({
          msg:responseJson.message,
          messageStatus:'2'
        });
      }
     
      this.setState({waiting:"0"});
    
   
     

    }).then(() => {
    
    
    }).catch((error) => console.error(error)).finally();
	*/

  }

 
  render() {
	 	/*provider.get_report().then(function (data){
	 		//console.log(data);
	 	});*/


 	  

    return (
         <>
      <Header />
			<TopBar />
			<div className="page-container">
				<LeftBar />
				<div className="main-content">
					<div className="content-wrapper pb-4 ">
						<div className="body-sec pl-2 pr-2" id="executive-summary-count-dashboard">
							<div className="card mb-5 pb-3">
								<div className="card-header">
									<div className="left d-inline-block">
										<h4 className="mb-0">Stock Count Summary</h4>
										<p className="mb-0 dateTime"></p>
									</div>
									<div className="right d-inline-block float-right mt-2"> 
										
										<span  className="run_job">
								            <button className="btn btn-danger stock_download_btn">Refresh</button>
								                        
								        </span> 
								    </div>
								</div>
								<div className="card-body p-1">
									<div className="alert_msg"></div>
									<div className="filters pl-1 pt-3 pb-3 pr-3" id="executiveSummaryFitler">
										<h4 className="d-inline-block mr-4 mb-0  text-light">Filters</h4>
										<div className="form-group d-inline-block mb-0">
											<select className="sw150 d-inline-block mr-2 selectpicker" data-live-search="true" 
											name="StoreID" id="StoreID"  onChange={evt => this.onStoreIdChange(evt)} value={this.state.f_storeid} >
												<option value="">Store ID</option>
												{this.state.store_list.map((x,y) => <option value={x.storename}>{x.storename}</option> ) } 
											</select>
											<select className="sw150 d-inline-block mr-2 selectpicker" data-live-search="true" 
											name="DepartmentID" id="DepartmentID" value={this.state.f_departmentid} >
												<option value="">All Department</option>
												{this.state.dept_list.map((x,y) => <option value={x.departmentid}>{x.departmentid}</option> ) } 
											</select>
											<select className="sw150 d-inline-block selectpicker" data-live-search="true" 
											name="BrandID" id="BrandID" onChange={evt => this.onBrandIdChange(evt)} value={this.state.f_brandid} >
												<option value="">All Brands</option>
												{this.state.brand_list.map((x,y) => <option value={x.brand_name}>{x.brand_name}</option> ) } 
											</select>
											<select className="sw150 d-inline-block selectpicker" data-live-search="true" 
											name="Color" id="Color" onChange={evt => this.onColorChange(evt)} value={this.state.f_color} >
												<option value="">All Colors</option>
												{this.state.color_list.map((x,y) => <option value={x.color}>{x.color}</option> ) }
											</select>
											<select className="sw150 d-inline-block selectpicker" data-live-search="true" 
											name="Size" id="Size" onChange={evt => this.onSizeChange(evt)} value={this.state.f_size} >
												<option value="">All Sizes</option>
												{this.state.size_list.map((x,y) => <option value={x.size}>{x.size}</option> ) }
											</select>
											<input type="date" onChange={evt => this.onDateChange(evt)} className="form-control d-inline-block mr-2 datepicker33" id="summarydate" name="date" 
											 placeholder="Ex: yyyy-mm-dd" autoComplete="off" /> 
							
								 			<span id="show_over_checkbox" >Show overs 
					              <input type="checkbox" className="form-control d-inline-block mr-2" id="show_over"  name="show_over" value='1' onChange={evt => this.onShowOverChange(evt)}/>
					            </span> 
                      <span id="iot_notification"></span>

					        			</div>
										<div className="d-inline-block w-25">
											<button type="button" id="executiveSummary" className="btn btn-primary btn-md run btn-block" onClick={evt => this.summaryValidate(evt)}>Run</button>
										</div>
									</div>
									<div className="error_block">
                    <span className="error error_msg">{this.state.error_msg}</span>
                	</div>
									<div className="row ml-0 mr-0 hide" id="CountDynamic">
										<div className="col-md-8">
											<div className="row">
												<div className="col-md-6 pl-1 pr-1 pr-md-2">
													<div className="card-box p-3 top-cards item-accuracy-card">
														<h4>Item-Count <span>Accuracy</span></h4>
														<h2 className="text-center">
                              <span className="waiting" style={{display:"none"}} >
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" className="waiting_inner" />
                              </span>
                              <span id="item_accuracy"><p>{this.state.item_accuracy}%</p></span>
                          	</h2>
                          </div>
												</div>
												<div className="col-md-6 pl-1 pr-1 pl-md-2">
													<div className="card-box p-3 top-cards item-accuracy-card">
														<h4>Operational <span>Accuracy</span></h4>
														<h2 className="text-centerOn Hand Matching">
                              <span className="waiting" style={{display:"none"}} >
                      	        <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" className="waiting_inner" />
                              </span>
                              <span id="operational_accuracy"><p>{this.state.operational_accuracy}%</p></span>
                          	</h2> 
                					</div>
												</div>
											</div>
											<div className="row mt-3">
												<div className="col-md-4 pl-1 pr-1  pr-md-2">
													<div className="card-box p-4 item-accuracy-count">
														<h4 className="d-inline-block mb-0">On Hand</h4>
														<Link to="/executiveSummaryOnHandSimple" params={{ date: this.state.summarydate }} className="OneHandSimple cursor_pointer"> 
															<img src="./asserts/images/icon-open-list.png" className="float-right"  /> 
														</Link>
														<h2 className="text-center mb-4 mt-4 lower-font">
                              <span className="waiting" style={{display:"none"}} >
                                  <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt=""  />
                              </span>
	                            <span id="onehand"><span className="accu-onhand-vl">{this.state.onhandtotal}</span></span>
			                      </h2> 
			                    </div>
												</div>
												<div className="col-md-4 pl-1 pr-1  pr-md-2 pl-md-2">
													<div className="card-box p-4 item-accuracy-count">
														<h4 className="d-inline-block mb-0">Count</h4>
														<h2 className="text-center mb-4 mt-4 lower-font">
                              <span className="waiting" style={{display:"none"}} >
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" />
                              </span>
                              <span id="inventoryCount"><span className="accu-count-vl">{this.state.inventroycount}</span></span>
                            </h2> 
			                    </div>
												</div>
												<div className="col-md-4 pl-1 pr-1 pl-md-2">
													<div className="card-box px-3 py-2 item-accuracy-front-back">
														<h4 className="d-inline-block mb-0">Front</h4>
														<h2 className="text-center mb-1 mt-1 sec-lower-font">
                              <span className="waiting" style={{display:"none"}} >
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" />
                              </span>
                              <span id="frontval"><span className="ftbk-vl">{this.state.counted_sf}</span></span>
                            </h2>
			                    </div>
													<div className="card-box px-3 py-2  mt-2 item-accuracy-front-back">
														<h4 className="d-inline-block mb-0">Back Store</h4>
														<h2 className="text-center mb-1 mt-1 sec-lower-font">
                              <span className="waiting" style={{display:"none"}} >
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt=""  />
                              </span>
                              <span id="counted_sr"><span className="ftbk-vl">{this.state.counted_sr}</span></span>
                            </h2> 
                          </div>
												</div>
											</div>
										</div>
										<div className="col-md-4">
											<div className="card-box-dark p-3 mb-2 black-right-card">
												<h4 className="d-inline-block mb-0 text-light">On Hand Matching</h4>
												<div>
													<h3 className="mb-0  d-inline-block"><span className="small-text">Count</span>
                          	<span className="waiting" style={{display:"none"}} >
                              <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt=""  />
                            </span>
                            <span id="onehand2"><span className="accu-onhand-vl">{this.state.onhandmatching}</span></span>
                        	</h3>
													<h3 className="mb-0  d-inline-block float-right"><span></span> 
                      			<span className="waiting" style={{display:"none"}} >
                              <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' 
                              height='32px' />
                          	</span>
                      			<span id="item_accuracy2" className="mt-2" ><p>{this.state.operational_accuracy}%</p></span>
                  				</h3>
                  			</div>
											</div>
											<div className="card-box-dark p-3 mb-2 black-right-card">
												<h4 className="d-inline-block mb-0 text-danger">Unders</h4>
												<Link to="/underOvers"  className="Unders cursor_pointer"> <img src="./asserts/images/icon-open-list.png" className="float-right h_15" /> </Link>
												<div>
													<h3 className="mb-0  d-inline-block"><span className="small-text">Count</span>
                            <span className="waiting" style={{display:"none"}} >
                              <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt=""  />
                            </span>
                            <span id="undernum"><p>{this.state.missingtotal}</p></span>
                          </h3>
													<h3 className="mb-0  d-inline-block float-right"><span className="small-text">Percentage</span>
                            <span className="waiting" style={{display:"none"}} >
                                <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt=""  />
                            </span>
                            <span id="underper" className="d-inline-block"><p>{this.state.missingpercentage}%</p></span>
                        	</h3> 
                        </div>
											</div>
											<div className="card-box-dark p-3 mb-2 black-right-card">
												<h4 className="d-inline-block mb-0 text-success">Overs</h4>
												<Link to="/AllOvers"  className="AllOvers cursor_pointer"> <img src="./asserts/images/icon-open-list.png" className="float-right h_15" /> </Link>
												<div>
													<h3 className="mb-0  d-inline-block"><span className="small-text">Count</span>
                            <span className="waiting" style={{display:"none"}} >
                              <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt=""  />
                            </span>
                            <span id="expectednum"><p>{this.state.overtotal}</p></span>
                        	</h3>
													<h3 className="mb-0  d-inline-block float-right"><span className="small-text">Percentage</span>
                            <span className="waiting" style={{display:"none"}} >
                              <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px'
                              height='32px' />
                            </span>
                            <span id="expectedper" className="d-inline-block"><p>{this.state.overpercentage}%</p></span>
                        	</h3>
                        </div>
											</div>
											<div className="card-box-dark p-3 mb-2 black-right-card">
												<h4 className="d-inline-block mb-0 text-danger">Critical Out Of Stock</h4>
												<Link to="/CriticalOutOfStock"  className="CriticalOutOfStock cursor_pointer"> <img src="./asserts/images/icon-open-list.png" className="float-right h_15" /> </Link>
												<div>
													<h3 className="mb-0 mt-3 d-inline-block">
                            <span className="small-text">Count</span> 
                            <span id="CriticalStock"><span className="accu-onhand-vl">{this.state.CriticalStock}</span></span>
                          </h3>
													<h3 className="mb-0 mt-3 d-inline-block float-right" id="criticalper">
														<span className="small-text">Percentage</span>
                            <span class="accu-onhand-vl">{this.state.criticalperentage} %</span>
                          </h3>
                        </div>
											</div>
										</div>
									</div>
									<p className="mb-0 p-2 light time-load-text">Page Load: 0.35s</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

          </>
       
   
    );
  }

  

}
