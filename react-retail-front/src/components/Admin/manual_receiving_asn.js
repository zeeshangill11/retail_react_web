import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';

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
import swal from 'sweetalert';

export default class manual_receiving_asn extends Component {
    constructor(props) {

        super(props);
        this.state = {
            IBT: " ",
            UserName: " ",
            store_list: [],
            asn_list: [],
            rb: '',
            storeid: '',
            description: '',
            checked: true,
            asnCheck: [],
        };
    }


    componentDidMount = async () => {

        let server_ip = await new_config.get_server_ip();

        var stores = await common.get_stores();
        this.setState(store_list => ({ store_list: stores }));



    }

    async getDeatils(e) {

        e.preventDefault();

        const server_ip = await new_config.get_server_ip();


        var error = 0;


        $(".error_msg").html('');
        //$("#GetDetails").html('<i className="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');	

        if ($('[name="asn"]').val() == "") {
            error = 1;
            $('.ASN_error').html('Please Enter IBT !')
        } else {
            $('.ASN_error').html(' ')
        }

        if ($('[name="storename"]').val() == ""
            || $('[name="storename"]').val() == null ||
            $('[name="storename"]').val() == 'select') {
            error = 1;
            $('.storename_error22').html('Please Select !')
        } else {
            $('.storename_error22').html(' ')
        }

        if (error === 0) {
            var data = {
                asn: this.state.IBT,
                store: this.state.storeid
            }

            var asnData = await fetch(server_ip + 'inventoryData/GetASNDetailsReceiveingAPI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(data)
            });
            var response = await asnData.json()
            if (response == 'No result found') {

                document.getElementById("ECPLIST").style.display = "block";
                $('#ECPLIST').html('<span>No result found</span>');
                document.getElementById("epc_list").style.display = "none";

            }
            else {
                this.setState(asn_list => ({ asn_list: response }));
                // console.log(this.state.asn_list)
                document.getElementById("ECPLIST").style.display = "none";
                document.getElementById("epc_list").style.display = "block";
                var checkboxes = document.getElementsByName('epc_item');
                var checkboxesChecked = [];

                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxesChecked.push(checkboxes[i].value)
                }

                this.setState({
                    asnCheck: checkboxesChecked
                })
                console.log(this.state.asnCheck)


            }

        }


    }

    async recieveAsn(e) {

        e.preventDefault();

        const server_ip = await new_config.get_server_ip();


        var error = 0;

        if ($('[name="asn"]').val() == "") {
            error = 1;
            $('.ASN_error').html('Please Enter IBT !')
        } else {
            $('.ASN_error').html(' ')
        }

        if ($('[name="storename"]').val() == ""
            || $('[name="storename"]').val() == null ||
            $('[name="storename"]').val() == 'select') {
            error = 1;
            $('.storename_error22').html('Please Select !')
        } else {
            $('.storename_error22').html(' ')
        }

        if ($('[name="retail_bizlocation"]').val() == ""
            || $('[name="retail_bizlocation"]').val() == null ||
            $('[name="retail_bizlocation"]').val() == 'select') {
            error = 1;
            $('.error_retail_bizlocation').html('Please Select !')
        } else {
            $('.error_retail_bizlocation').html(' ')
        }

        if ($('[name="storename"]').val() == $('[name="retail_bizlocation"]').val()
            && $('[name="storename"]').val() !== 'select'
            && $('[name="retail_bizlocation"]').val() !== 'select') {
            error = 1;

            $('.error_msg22').html('Original location and destination not be same !')
        } else {
            $('.error_msg22').html(' ')
        }

        if (error === 0) {
            var data = {
                storename: this.state.storeid,
                asn: this.state.IBT,
                remarks: this.state.description,
                EpcReceive: this.state.asnCheck,
                retail_bizlocation: this.state.rb
            }

            var asnData = await fetch(server_ip + 'inventoryData/ConfirmASNDetailsReceiveingAPI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(data)
            });
            var response = await asnData.json()
            if (response.status == 1) {
                swal({ title: response.title, text: response.text, icon: response.icon })
            }
            this.props.history.push('/manual_receiving_asn')

        }


    }

    // async asnCheckBox(event) {

    //     var checkboxes = document.getElementsByName('epc_item');
    //     var checkboxesChecked = [];

    //     if (event.target.checked) {
    //         for (var i = 0; i < checkboxes.length; i++) {
    //             if (checkboxes[i] != event) {
    //                 checkboxes[i].checked = event.target.checked;
    //                 checkboxesChecked.push(checkboxes[i].value)
    //             }
    //         }

    //         this.setState({
    //             asnCheck: checkboxesChecked,
    //             checked: true
    //         })
    //         console.log(this.state.asnCheck)
    //     }
    //     else {

    //         this.setState({
    //             asnCheck: checkboxesChecked,
    //             checked: false
    //         })
    //         console.log(this.state.asnCheck)
    //     }



    // }
    // async onShowOverChange(event) {
    //     const check = event.target
    //     if (event.target.checked) {
    //         let checkValue = event.target.value
    //         let data = this.state.asnCheck
    //         data.push(checkValue)
    //         this.setState({
    //             asnCheck: data,
    //             checked: check
    //         })
    //         console.log(this.state.asnCheck)
    //         console.log(this.state.checked)
    //     } else {
    //         let array = this.state.asnCheck
    //         let index = array.indexOf(event.target.value)
    //         if (index !== -1) {
    //             array.splice(index, 1);
    //             this.setState({
    //                 asnCheck: array,
    //                 checked: check
    //             });
    //         }
    //         console.log(this.state.asnCheck)
    //         console.log(this.state.checked)
    //     }
    // }
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
                                                Receive IBT
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
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <form autoComplete="off" id="AddDeviceForm" name="registration" >
                                                        <span className="error_msg"></span>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="IBT">IBT *</label>
                                                                <input type="text" className="form-control" name="asn"
                                                                    id="asn" placeholder="IBT"
                                                                    value={this.state.IBT.trim()}
                                                                    onChange={(e) => this.setState({ IBT: e.target.value })} />
                                                                <span className="error ASN_error"></span>
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="storeid">Retail Bizlocation Original *</label>
                                                                <select className="selectpicker form-control" data-live-search="true"
                                                                    name="storename" id="storename" required="" onChange={(e) => this.setState({ storeid: e.target.value })} value={this.state.storeid}>
                                                                    <option value="">Select Store</option>
                                                                    {this.state.store_list.map((x, y) => <option key={x.storeid} value={x.storename}>{x.storename}</option>)}
                                                                </select>
                                                                <span className="error storename_error22"></span>
                                                            </div>
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="storeid">Retail Bizlocation * </label>
                                                                <select className="selectpicker form-control" data-live-search="true"
                                                                    name="retail_bizlocation" id="retail_bizlocation" required="" onChange={(e) => this.setState({ rb: e.target.value })} value={this.state.rb ? this.state.rb : 0}>
                                                                    <option value="">Select Store</option>
                                                                    {this.state.store_list.map((x, y) => <option key={x.storeid} value={x.storename}>{x.storename}</option>)}
                                                                </select>
                                                                <span className="error error_retail_bizlocation"></span>
                                                            </div>
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="storeid">Remarks * </label>
                                                                <textarea type="text" className="form-control" name="Description"
                                                                    id="Description" placeholder="Description" rows="7" cols="50"
                                                                    value={this.state.description}
                                                                    onChange={(e) => this.setState({ description: e.target.value })}></textarea>
                                                                <span className="error error_msg22"></span>
                                                            </div>

                                                            <div className="form-group col-md-12" style={{ textAlign: "center" }}>
                                                                <div className="row">
                                                                    <div className="col-md-4">
                                                                        <div className="but mt-5">
                                                                            <button type="button" onClick={evt => this.recieveAsn(evt)} id="submit" className="btn btn-light btn-block">Receive</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div className="col-md-4">
                                                    <button type="button" id="GetDetails" onClick={evt => this.getDeatils(evt)} className="btn btn-light btn-md mt-4" >
                                                        Get Details
                                                    </button>
                                                    <br />
                                                    <br />
                                                    <label>IBT Details *</label>
                                                    <div className="error asn_asdetails_error"></div>
                                                    <div id="Home_all">
                                                        <div id="ECPLIST">
                                                            <span className="waiting" style={{ display: "none" }}>
                                                            </span>

                                                        </div>
                                                    </div>
                                                    <div id="epc_list" style={{ width: "100%", height: "350px", display: "none", overflow: "auto" }}>
                                                        <table id="dataTable" className="text-center mm-datatable" style={{ width: "100%" }}>
                                                            <thead className="bg-light text-capitalize">
                                                                <tr>
                                                                    <th>
                                                                        <span>
                                                                            <input type="checkbox"
                                                                                className="d-inline-block"
                                                                                id="epc_items"
                                                                                name="epc_items"
                                                                                style={{ width: "14px", height: "24px" }} value={this.state.checked}
                                                                                defaultChecked={this.state.checked} onChange={evt => this.asnCheckBox(evt)} />
                                                                        </span>
                                                                        Check All
                                                                    </th>
                                                                    <th>EPC</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.asn_list.map((listValue, index) => {

                                                                    if (listValue) {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    <span>
                                                                                        <input type="checkbox"
                                                                                            className="d-inline-block"
                                                                                            id="epc_item"
                                                                                            name="epc_item"
                                                                                            style={{ width: "14px", height: "24px" }}
                                                                                            value={listValue} defaultChecked={this.state.checked} onChange={evt => this.onShowOverChange(evt)} />
                                                                                    </span>
                                                                                </td>
                                                                                <td>{listValue}</td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div>
            </>

        )
    }
}
