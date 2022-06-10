import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import { withRouter } from "react-router-dom";

import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';

class edithandhelddevice extends Component {
	constructor(props) {
		super(props);
		var edit_id = props.match.params.id;
		this.state = {
			store_list: [],
			id: edit_id,
			username: '',
			device_unique_id: '',
			description: '',
			device_ip: '',
			ns_connection: '',
			server_ip: '',
			ss_connection: '',
			status: '',
			hidden_password: '',
			password: '',
			storeid: '',
		};

	}
	async componentDidMount() {
		var stores = await common.get_stores();
		this.setState(store_list => ({ store_list: stores }));
		var main_data = await this.geteditrecord();
		if (main_data[0].username !== null) { this.setState({ username: main_data[0].username }) }
		if (main_data[0].device_unique_id !== null) { this.setState({ device_unique_id: main_data[0].device_unique_id }) }
		if (main_data[0].description !== null) { this.setState({ description: main_data[0].description }) }
		if (main_data[0].device_ip !== null) { this.setState({ device_ip: main_data[0].device_ip }) }
		if (main_data[0].ns_connection !== null) { this.setState({ ns_connection: main_data[0].ns_connection }) }
		if (main_data[0].server_ip !== null) { this.setState({ server_ip: main_data[0].server_ip }) }
		if (main_data[0].ss_connection !== null) { this.setState({ ss_connection: main_data[0].ss_connection }) }
		if (main_data[0].status !== null) { this.setState({ status: main_data[0].status }) }
		if (main_data[0].password !== null) { this.setState({ hidden_password: main_data[0].password }) }
		if (main_data[0].storeid !== null) { this.setState({ storeid: main_data[0].storeid }) }
		
	}
	async handleSubmit(event) {
		event.preventDefault();

		let server_ip = await new_config.get_server_ip();

		fetch(server_ip + 'stockCountRecords/EditHandHeldDevice', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Connection': 'keep-alive',
			},
			body: "hidden_id=" + this.state.id +
				"&UserName=" + this.state.username +
				"&DeviceID=" + this.state.device_unique_id +
				"&Description=" + this.state.description +
				"&DeveiceIP=" + this.state.device_ip +
				"&NonSecureIP=" + this.state.ns_connection +
				"&ServerIP=" + this.state.server_ip +
				"&SecureIP=" + this.state.ss_connection +
				"&status=" + this.state.status +
				"&hidden_password=" + this.state.hidden_password +
				"&password=" + this.state.password +
				"&StoreID=" + this.state.storeid,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				var temp = responseJson;
				//console.log(temp);
				//return <Redirect to='/handheldDevices' />
				this.props.history.push('/handheldDevices');

			}).catch((error) => console.error(error)).finally();
	}
	async geteditrecord() {
		let server_ip = await new_config.get_server_ip();
		return fetch(server_ip + 'stockCountRecords/GetHandHeldDeviceRecord', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Connection': 'keep-alive',
			},
			body: "edit_id=" + this.state.id,
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
						<div className="content-wrapper pb-4">
							<div className="row">
								<div className="col-12 mt-1">
									<div className="card">
										<div className="card-header">
											<div className="left d-inline-block">
												<h4 className="mb-0">
													<i className="ti-stats-up" style={{ color: "#000" }}></i>
													Edit HandHeld Device
												</h4>
												<p className="mb-0 dateTime"></p>
											</div>
											<div className="right d-inline-block float-right mt-2">
												<img src="/asserts/images/count/Group 9.png" height="30px" />
												<img src="/asserts/images/count/Icon feather-printer.png" height="30px" className="ml-1 mr-1" />
											</div>
										</div>
										<div className="card-body">
											<form autoComplete="off" id="AddDeviceForm" name="registration" onSubmit={this.handleSubmit.bind(this)}>
												<span className="error_msg"></span>
												<div className="form-row">

													<div className="form-group col-md-6">
														<label htmlFor="UserName">Username *</label>
														<input type="text" className="form-control" name="UserName"
															id="UserName" placeholder="User Name"
															defaultValue={this.state.username}
															onChange={(e) => this.setState({ username: e.target.value })} />
														<span className="error UserName_error"></span>
													</div>

													<div className="form-group col-md-6">
														<label htmlFor="Password">Password</label>
														<input type="password" className="form-control" name="password" id="Password" placeholder="Password"
															onChange={(e) => this.setState({ password: e.target.value })} />
														<input type="hidden" name="hidden_password" id="hidden_password" defaultValue={this.state.hidden_password} />
														<span className="error Password_error"></span>
													</div>

													<div className="form-group col-md-6">
														<label htmlFor="DeviceID">Device ID *</label>
														<input type="text" className="form-control" name="DeviceID" id="DeviceID" placeholder="Device ID"
															defaultValue={this.state.device_unique_id}
															onChange={(e) => this.setState({ device_unique_id: e.target.value })} />
														<span className="error DeviceID_error"></span>
													</div>

													<div className="form-group col-md-6">
														<label htmlFor="status">Status *</label>
														<select className="form-control selectpicker" id="Status"
															data-live-search="true" name="roles" value={this.state.status}
															onChange={(e) => this.setState({ status: e.target.value })}>
															<option value="1">Active</option>
															<option value="0">Disable</option>
														</select>
														<span className="error error_status"></span>
													</div>

													<div className="form-group col-md-6">
														<label htmlFor="DeveiceIP">3rd Party Server IP *</label>
														<input type="text" name="DeveiceIP"
															id="DeveiceIP" className="form-control" placeholder="3rd Party Server IP"
															defaultValue={this.state.device_ip}
															onChange={(e) => this.setState({ device_ip: e.target.value })} />
														<span className="error error_DeveiceIP"></span>
													</div>
													<div className="form-group col-md-6">
														<label htmlFor="NonSecureIP">3rd Party IP Server Protocol *</label>
														<select className="form-control selectpicker" name="NonSecureIP"
															id="NonSecureIP" data-live-search="true" value={this.state.ns_connection}
															onChange={(e) => this.setState({ ns_connection: e.target.value })}>
															<option value="HTTP">HTTP</option>
															<option value="HTTPS">HTTPS</option>
														</select>


														<span className="error error_NonSecureIP"></span>
													</div>
													<div className="form-group col-md-6">
														<label htmlFor="ServerIP">Server IP *</label>
														<input type="text" name="ServerIP" id="ServerIP" className="form-control" placeholder="ServerIP"
															defaultValue={this.state.server_ip} onChange={(e) => this.setState({ server_ip: e.target.value })} />
														<span className="error error_ServerIP"></span>
													</div>
													<div className="form-group col-md-6">
														<label htmlFor="SecureIP">Inovent IP Protocol *</label>
														<select className="form-control selectpicker" name="SecureIP"
															value={this.state.ss_connection} id="SecureIP" data-live-search="true"
															onChange={(e) => this.setState({ ss_connection: e.target.value })}>
															<option value="HTTP">HTTP</option>
															<option value="HTTPS">HTTPS</option>
														</select>

														<span className="error error_SecureIP"></span>
													</div>

													<input type="hidden" name="hidden_id" id="hidden_id" defaultValue={this.state.id} />
													<div className="form-group col-md-6">
														<label htmlFor="Description">Description *</label>
														<textarea type="text" className="form-control" name="Description"
															id="Description" placeholder="Description" rows="7" cols="50"
															defaultValue={this.state.description}
															onChange={(e) => this.setState({ description: e.target.value })}></textarea>
														<span className="error error_Description"></span>
													</div>
													<div className="form-group col-md-6">
														<label htmlFor="StoreID">Storename *</label>
														<select className="selectpicker form-control" data-live-search="true"
															name="StoreID" id="StoreID" required="" value={this.state.storeid}
															onChange={(e) => this.setState({ storeid: e.target.value })}>
															<option value="">Store ID</option>
															{this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
														</select>
														<span className="error error_StoreID"></span>
													</div>

													<div className="form-group col-md-12" style={{ textAlign: "center" }}>
														<div className="row">
															<div className="col-md-4">
																<div className="but mt-5">
																	<button type="submit" id="submit" className="btn btn-primary btn-block">Edit Device</button>
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

export default withRouter(edithandhelddevice);