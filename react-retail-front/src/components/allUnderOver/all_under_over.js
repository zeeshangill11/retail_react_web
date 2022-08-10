import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from '../header/header';
import TopBar from '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';

//jQuery libraries

import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';
import Cookies from 'universal-cookie';

export default class inventoryByItems extends Component {
  constructor(props) {

    super(props);
    this.state = {
      store_list: [],
      date_state: [],
      store_id: 0,
      summarydate: '',
      show_over: 'no',
      error_msg: "",
    };
  }

  async onStoreIdChange(event) {
    this.setState({ store_id: event.target.value });

    let server_ip = await new_config.get_server_ip();
    var store_id = this.state.store_id;
    if (store_id != null && store_id != undefined && store_id != "") {
      //Get dates
      var dates = await common.get_dates(store_id);
      this.setState(date_state => ({ date_state: dates }));
    } else {
      var arr = [];
      this.setState(date_state => ({ date_state: arr }));
    }
  }

  async onShowOverChange(event) {
    if (event.target.checked) {
      this.setState({ show_over: 'yes' });
    } else {
      this.setState({ show_over: 'no' });
    }
  }

  handleDateChange = date => {
    this.setState({ summarydate: date })
  }

  componentDidMount = async () => {
    var stores = await common.get_stores();
    this.setState(store_list => ({
      store_list: stores
    }));

    const server_ip = await new_config.get_server_ip();

    var store_id = 0;
    var summarydate = '';
    var gettop20 = [];
    var main_table = '';
    var main_table2 = '';
    var main_table3 = '';
    var cookies = new Cookies();
    var myToken = cookies.get('myToken');
    $(document).ready(function () {

      $(".data-tables").css('visibility', 'hidden');
      $(".visibile").hide();

      main_table2 = $('#dataTableTwoo').DataTable({
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excel',
            title: 'Top20Under'
          }],
        "pageLength": 25,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        "paging": true,
        'ajax': {
          'url': server_ip + 'stockCountRecords/gettop20under_all/',
          'beforeSend': function (request) {
            request.setRequestHeader("auth-token", myToken);
          },
          "data": function (d) {
            var yes_no = 'no';
            if ($('#show_over').prop('checked')) {
              yes_no = 'yes';
            }
            return $.extend({}, d, {
              "my_date": $('#summarydate').val(),
              "store_id": $('#StoreID').val(),
              "show_over": yes_no,
            });
          },
        },
        "responsive": true,
        "columns": [
          { "data": "departmentname" },
          { "data": "brandname" },
          { "data": "skucode" },
          { "data": "expected22" },
          { "data": "diff" },
          { "data": "diffper" },
          { "data": "suppliername" },
          { "data": "supplier_item_no" }
        ],
        "searching": false,
        "scrollY": 500,
        'columnDefs': [{
          'targets': [3, 4, 5],
          'orderable': false,
          "visible": false,
          "targets": 3
        }],
      });
      main_table3 = $('#dataTableThree').DataTable({
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excel',
            title: 'Top20Over'
          }],
        "pageLength": 25,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        'ajax': {
          'url': server_ip + 'stockCountRecords/gettop20over_all/',
          "data": function (d) {
            var yes_no = 'no';
            if ($('#show_over').prop('checked')) {
              yes_no = 'yes';
            }
            return $.extend({}, d, {
              "my_date": $('#summarydate').val(),
              "store_id": $('#StoreID').val(),
              "show_over": yes_no,
            });
          },
        },
        "responsive": true,
        "columns": [
          { "data": "departmentname" },
          { "data": "brandname" },
          { "data": "skucode" },
          { "data": "expected" },
          { "data": "diff" },
          { "data": "diffper" },
          { "data": "suppliername" },
          { "data": "supplier_item_no" },
        ],
        "searching": false,
        "scrollY": 500,
        'columnDefs': [{
          'targets': [3, 4, 5],
          'orderable': false,
          "visible": false,
          "targets": 5
        }
        ],
      });


    });
    $('.run').click(function () {
      var error = 0;
      var $this = $('#stockSummaryFilter');
      store_id = $('#StoreID').val();
      summarydate = $('#summarydate').val();

      $(".error_msg").html('');

      if (store_id == "" || store_id == null) {
        error = 1;
        $this.find('.StoreID_error').html('Please Select Store !')
      } else {
        $this.find('.StoreID_error').html(' ')
      }

      if (summarydate == "" || summarydate == null) {
        error = 1;
        $this.find('.Date_error').html('Please Select Date !')
      } else {
        $this.find('.Date_error').html(' ')
      }
      if (error == 0) {
        $(".visibile").show();
        $(".before_load_table").show();
        main_table2.ajax.reload();
        main_table3.ajax.reload();
        $(".data-tables").css('visibility', 'visible');
        $(".before_load_table").hide();


        setTimeout(function () {
          $('.mm-dataTableTwoo tr th:eq(2)').click();
          $('.mm-datatable3 tr th:eq(2)').click();
        }, 2000)
      }
    });
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
                        <h4 className="mb-0"> <i className="ti-stats-up" style={{ color: "#000" }}></i>
                          Inventory
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
                        <form id="stockSummaryFilter" className="custom-filter ">
                          <div className="row">
                            <h4 className="light d-inline-block mr-4 mb-0">Filters</h4>
                            <div className="col-md-2">
                              <div className="form-group">
                                <select className="form-control" name="StoreID" id="StoreID"
                                  onChange={evt => this.onStoreIdChange(evt)} value={this.state.f_storeid} >
                                  <option value="">Select Store</option>
                                  {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                                </select>
                                <span className="error StoreID_error"></span>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <DatePicker onChange={this.handleDateChange} selected={this.state.summarydate} className="form-control"
                                  id="summarydate" includeDates={this.state.date_state} name="summarydate" placeholderText="Ex: yyyy-mm-dd"
                                  dateFormat="yyyy-MM-dd" />
                                <span className="error Date_error"></span>
                              </div>
                            </div>

                            <div className="col-md-2" id="show_over_checkbox">
                              <span style={{ marginLeft: "40px" }}>
                                <label htmlFor="show_over">Show overs</label>
                                <input type="checkbox" className="d-inline-block mr-2"
                                  id="show_over" name="show_over" value='yes' style={{ width: "20px" }}
                                  onChange={evt => this.onShowOverChange(evt)} />
                              </span>
                            </div>

                            <div className="col-md-2">
                              <div className="form-group">
                                <button type="button"
                                  className="btn btn-primary btn-md run ml-4"
                                  id="run_stock">Search</button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="row stockSummaryTable visibile cardd2" style={{ margin: "0px", width: "100%" }}>
                          <div className="col-6 mt-5">
                            <div className="card">
                              <div className="card-header">
                                <h4 className="light left d-inline-block" style={{ color: "#373E43" }}>All Unders</h4>
                                <div className="right d-inline-block float-right mt-2">
                                  <span style={{ cursor: "pointer" }} className="buttons_excel_count">
                                    <img src="/assets/images/count/Group 10.png" height="30px" alt="" />
                                  </span>
                                </div>
                              </div>
                              <div className="card-body">
                                <div className="before_load_table">
                                  <img src="/assets/images/waiting_before_table_load.gif" alt="" />
                                </div>
                                <div className="data-tables stocksummery">
                                  <table id="dataTableTwoo" className="text-center mm-dataTableTwoo">
                                    <thead className="bg-primary text-capitalize">
                                      <tr>
                                        <th>Department</th>
                                        <th>Brand</th>
                                        <th>SKU</th>
                                        <th>Expected</th>
                                        <th>Diff</th>
                                        <th>Diff&nbsp;%</th>
                                        <th>Suppliername</th>
                                        <th>Supplier Item No.</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 mt-5">
                            <div className="card">
                              <div className="card-header">
                                <h4 className="light left d-inline-block" style={{ color: "#373E43" }}>All Overs</h4>
                                <div className="right d-inline-block float-right mt-2">
                                  <span style={{ cursor: "pointer" }} className="buttons_excel_count">
                                    <img src="/assets/images/count/Group 10.png" height="30px" alt="" />
                                  </span>
                                </div>
                              </div>
                              <div className="card-body">
                                <div className="before_load_table">
                                  <img src="/assets/images/waiting_before_table_load.gif" alt="" />
                                </div>
                                <div className="data-tables datatable-primary stocksummery">
                                  <table id="dataTableThree" className="text-center mm-datatable3">
                                    <thead className="bg-light text-capitalize" style={{ color: "#000" }}>
                                      <tr>
                                        <th>Department</th>
                                        <th>Brand</th>
                                        <th>SKU</th>
                                        <th>Expected</th>
                                        <th>Diff</th>
                                        <th>Diff&nbsp;%</th>
                                        <th>Suppliername</th>
                                        <th>Supplier Item No.</th>
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
                </div>

              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}