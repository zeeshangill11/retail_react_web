import React, { Component } from "react";
import new_config from '../../services/config';
import common from '../../services/commonFunctionsJS';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from  '../header/header';
import TopBar from  '../topBar/topBar';
import LeftBar from '../leftBar/leftBar';

//jQuery libraries
import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';
import Cookies from 'universal-cookie';
 
export default class stockSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store_list: [],
      summarydate:'',
      date_state:[],
      store_id:0,
    }
  }
  handleDateChange = date => {
    this.setState({summarydate: date})
  }
  async onStoreIdChange (event) {
    this.setState({store_id: event.target.value});

    let server_ip = await new_config.get_server_ip();
    var store_id = this.state.store_id;
    if (store_id != null && store_id != undefined && store_id != "") {
      //Get dates
      var dates = await common.get_dates(store_id);
      this.setState(date_state => ({ date_state: dates }));
    } else {
      var arr = [];
      this.setState(size_list => ({ date_state: arr }));
    }
  }
  async componentDidMount() {
    var server_ip = await new_config.get_server_ip();
    var stores = await common.get_stores();
    this.setState(store_list => ({
      store_list: stores
    }));
    var main_table='';
    var main_table2='';
    var main_table3='';
    var main_table4='';
    var cookies = new Cookies();
var myToken = cookies.get('myToken');
    $(document).ready(function() {
      $(".before_load_table").hide();
      $(".visibile").hide();
      var date = $('#summarydate').val();
      
      main_table =  $('#dataTable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                title: 'StockSummary'
            },{

              extend: 'print',
              title: 'StockSummary'   
            },
        ],
        "pageLength": 25,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        "scrollX": false,   
        'responsive': true,
        "paging": false,
        'ajax': {
          'url':server_ip+'stockCountRecords/stockSummaryReport/',
          'beforeSend': function (request) {
            request.setRequestHeader("auth-token", myToken);
        },
          "data": 
          function ( d ) {
            return $.extend( {}, d, {
              "my_date": $('#summarydate').val(),
              "store_id":$('#StoreID').val(),
            });
          },
          complete: function (data) {
                      var sumresult = data['responseJSON'];
                  },

        },
        "columns": [
          { "data": "date"},
          { "data": "store" },
          { "data": "department" },
          { "data": "accuracy" },
          { "data": "uia" },
          { "data": "expected" },
          { "data": "counted" },
          { "data": "unexpected" },
          { "data": "missing" },
          { "data": "expectedsr" },
          { "data": "expectedsf" },
          { "data": "countedsr" },
          { "data": "countedsf" },
          { "data": "scanned" }
        ],
        "footerCallback": function ( row, data, start, end, display ) {
          var api = this.api(), data;
          var data22  = ''

          data22 = data[0].aatotal_sum;
          
          //if(isJson(data22)){
            var check = JSON.parse(data22);
            var total = check[0];
          //}
          var intVal = function ( i ) {
                  return typeof i === 'string' ?
                      i.replace(/[\$,]/g, '')*1 :
                      typeof i === 'number' ?
                          i : 0;
              };
          var monTotal = api
                  .column( 0 )
                  .data()
                  .reduce( function (a, b) {
                      return "";
                  }, 0 );
      
          var monTotal = api
                  .column( 1 )
                  .data()
                  .reduce( function (a, b) {
                      return "";
                  }, 0 );
          
          var tueTotal = api
                  .column( 2 )
                  .data()
                  .reduce( function (a, b) {
                    return "";
                  }, 0 );   
             
          
          var Accuracy = api
                  .column( 3 )
                  .data()
                  .reduce( function (a, b) {
                     return 'Total';
                  }, 0 );
          
          var UIA = api
                  .column( 4 )
                  .data()
                  .reduce( function (a, b) {
                      return total.uiasum;
                  }, 0 );
          var Expected = api
                  .column( 5 )
                  .data()
                  .reduce( function (a, b) {
                      return total.expectedsum;
                  }, 0 );
          var Couted = api
                  .column( 6 )
                  .data()
                  .reduce( function (a, b) {
                      return total.countedsum;
                  }, 0 );  

          var Overs = api
                  .column( 7 )
                  .data()
                  .reduce( function (a, b) {
                      return total.unexpectedsum;
                  }, 0 );  

          var Unders = api
                  .column( 8 )
                  .data()
                  .reduce( function (a, b) {
                      return total.missingsum;
                  }, 0 );  

          var Expected_sf = api
                  .column( 9 )
                  .data()
                  .reduce( function (a, b) {
                      return total.expectedsfsum;
                  }, 0 );   

          var Expected_sr = api
                .column( 10 )
                .data()
                .reduce( function (a, b) {
                    return total.expectedsrsum;
                }, 0 ); 

          var Counted_sf = api
                .column( 11 )
                .data()
                .reduce( function (a, b) {
                    return total.countedsfsum;
                }, 0 ); 

          var Counted_sr = api
                .column( 12 )
                .data()
                .reduce( function (a, b) {
                    return total.countedsrsum;
                }, 0 );                    

          var Scanned = api
                .column( 13 )
                .data()
                .reduce( function (a, b) {
                    return total.scannedsum;
                }, 0 ); 
          // Update footer by showing the total with the reference of the column index 
          $( api.column( 0 ).footer() ).html('');
          $( api.column( 1 ).footer() ).html(monTotal);
          $( api.column( 2 ).footer() ).html(tueTotal);
          $( api.column( 3 ).footer() ).html(Accuracy);
          $( api.column( 4 ).footer() ).html(UIA);
          $( api.column( 5 ).footer() ).html(Expected);
          $( api.column( 6 ).footer() ).html(Couted);
          $( api.column( 7 ).footer() ).html(Overs);
          $( api.column( 8 ).footer() ).html(Unders);
          $( api.column( 9 ).footer() ).html(Expected_sf);
          $( api.column( 10 ).footer() ).html(Expected_sr);
          $( api.column( 11 ).footer() ).html(Counted_sf);
          $( api.column( 12 ).footer() ).html(Counted_sr);
          $( api.column( 13 ).footer() ).html(Scanned);
        },
        'columnDefs': [ {
          'targets': [2,3,4], /* column index */
          'orderable': false, /* true or false */
        }],
        "searching": false,
        "scrollY": 500,   
      });

      $("#dataTable").append(
        $('<tfoot/>').append("<tr><th></th>"+ 
          "<th></th><th></th> "+ 
          " <th></th>"+ 
          " <th id=''></th> "+ 
          " <th  id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th>"+ 
          " <th id=''></th> </tr>").css("color","#fff")
      );

      main_table2=$('#dataTableTwoo').DataTable( {
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excel',
            title: 'Top20Under'
          }
        ],
        "pageLength": 25,
        'processing': true,
  

        'serverSide': true,
        'serverMethod': 'post',
        "paging": false,
        'ajax': {
          'url':server_ip+'stockCountRecords/gettop20under/',
          "data": 
          function ( d ) {
            return $.extend( {}, d, {
              "my_date": $('#summarydate').val(),
              "store_id":$('#StoreID').val(),
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
          { "data": "supplier_item_no" },
        ],
        "searching": false,
        "scrollY": 500,
        "footerCallback": function ( row, data, start, end, display ) {
          var api = this.api(), data;
          var data22  = ''

          data22 = data[0].aatotalsum;
          //if(isJson(data22)){
            var check = JSON.parse(data22);
            var total = check[0];
          //}
          var intVal = function ( i ) {
                  return typeof i === 'string' ?
                      i.replace(/[\$,]/g, '')*1 :
                      typeof i === 'number' ?
                          i : 0;
              };
    
          var monTotal = api
                  .column( 0 )
                  .data()
                  .reduce( function (a, b) {
                      return "";
                  }, 0 );
        

          var monTotal = api
                  .column( 1 )
                  .data()
                  .reduce( function (a, b) {
                      return "";
                  }, 0 );
          
       
          
          var Total = api
                  .column( 2 )
                  .data()
                  .reduce( function (a, b) {
                     return "Total";
                  }, 0 );
          
          var sum_expected = api
                  .column( 3 )
                  .data()
                  .reduce( function (a, b) {
                     return total.sum_expected;
                  }, 0 );
          
          var sum_diff = api
                  .column( 4 )
                  .data()
                  .reduce( function (a, b) {
                      return total.sum_diff;
                  }, 0 );
          var Expected = api
                  .column( 5 )
                  .data()
                  .reduce( function (a, b) {
                      return '';
                  }, 0 );
          $( api.column( 0 ).footer() ).html(monTotal);
          $( api.column( 1 ).footer() ).html(monTotal);
         
          $( api.column( 2 ).footer() ).html(Total);
          $( api.column( 3 ).footer() ).html(sum_expected);
          $( api.column( 4 ).footer() ).html(sum_diff);
          $( api.column( 5 ).footer() ).html(Expected);              
        },
        'columnDefs': [ {
          'targets': [3,4,5], /* column index */
          'orderable': false, /* true or false */
          "visible": false, 
                  "targets": 5 
        }],
      });

      $("#dataTableTwoo").append(
        $("<tfoot class='foot'/>").append("<tr>"+ 
        "<th></th>"+ 
          "<th></th> "+ 
          "<th></th>"+ 
         
          " <th></th> "+
          " <th></th> "+
          " <th></th> "+ 
          " <th></th> "+ 
         "</tr>").css("color","#fff")
      );

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
        "paging": false,

        'ajax': {
          'url': server_ip+'stockCountRecords/gettop20over/',
          "data": function(d) {
            return $.extend({}, d, {
              "my_date": $('#summarydate').val(),
              "store_id": $('#StoreID').val(),
            });
          },
        },
        "responsive": true,
        "columns": [
          {"data": "departmentname"},
          {"data": "brandname"},
          {"data": "skucode"},
          {"data": "expected"},
          {"data": "diff"},
          {"data": "diffper"},
          {"data": "supplier_item_no"}, 
        ],
        "searching": false,
        "scrollY": 500,
        "footerCallback": function(row, data, start, end, display) {
          var api = this.api(),
            data;
          var data22 = ''

          data22 = data[0].aatotalsum;

          //if (isJson(data22)) {
            var check = JSON.parse(data22);
            var total = check[0];
          //}
          var intVal = function(i) {
            return typeof i === 'string' ?
              i.replace(/[\$,]/g, '') * 1 :
              typeof i === 'number' ?
              i : 0;
          };

          var monTotal = api
            .column(0)
            .data()
            .reduce(function(a, b) {
              return "";
            }, 0);


          var monTotal = api
            .column(1)
            .data()
            .reduce(function(a, b) {
              return "";
            }, 0);
          var Total = api
            .column(2)
            .data()
            .reduce(function(a, b) {
              return "Total";
            }, 0);
          var sum_expected = api
            .column(3)
            .data()
            .reduce(function(a, b) {
              return total.sum_expected;
            }, 0);
          var sum_diff = api
            .column(4)
            .data()
            .reduce(function(a, b) {
              return total.sum_diff;
            }, 0);
          var Expected = api
            .column(5)
            .data()
            .reduce(function(a, b) {
              return '';
            }, 0);
          $(api.column(0).footer()).html(monTotal);
          $(api.column(1).footer()).html(monTotal);

          $(api.column(2).footer()).html(Total);
          $(api.column(3).footer()).html(sum_expected);
          $(api.column(4).footer()).html(sum_diff);
          $(api.column(5).footer()).html(Expected);

        },
        'columnDefs': [{
          'targets': [3, 4, 5],
          /* column index */
          'orderable': false,
          /* true or false */
          "visible": false,
          "targets": 5

        }],
      });

      $("#dataTableThree").append(
        $('<tfoot/>').append("<tr>"+ 
        "<th></th>"+ 
          "<th></th> "+ 
          " <th></th> "+
          " <th></th> "+
          " <th></th> "+
          " <th></th> "+ 
          " <th></th> "+ 
         "</tr>").css("color","#fff")
      );

      main_table4 = $('#dataTableFour').DataTable({
        dom: 'Bfrtip',
        buttons: [
        {
          extend: 'excel',
          title: 'RealtimeDiscrepancy'
        }, {
          extend: 'print',
          title: 'RealtimeDiscrepancy'
        }, ],
        "pageLength": 25,
        'processing': true,  
        'serverSide': true,
        'serverMethod': 'post',
        'ajax': {
          'url': server_ip+'inventoryData/RealtimeDiscrepancy12/',
          "data": function(d) {
            return $.extend({}, d, {
              "my_date": $('#summarydate').val(),
              "store_id": $('#StoreID').val(),
            });
          },
        },
        "responsive": true,
        "columns": [
          {"data": "skucode"},
          {"data": "departmentname"},
          {"data": "brandname"},
          {"data": "size"},
          {"data": "color"},
          {"data": "remaining"},
          {"data": "expected"},
          {"data": "counted"},
          {"data": "countedsf"},
          {"data": "countedsr"}, 
        ],
        "scrollY": 500,
        "footerCallback": function(row, data, start, end, display) {
          var api = this.api(),
            data;
          var data22 = data[0].realtimesum;
          //if (isJson(data22)) {
            var check = JSON.parse(data22);
            var total = check[0];
          //}
          var intVal = function(i) {
            return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
          };
          var monTotal = api.column(0).data().reduce(function(a, b) {
            return "";
          }, 0);
          var monTotal = api.column(1).data().reduce(function(a, b) {
            return "";
          }, 0);
          var tueTotal = api.column(2).data().reduce(function(a, b) {
            return "";
          }, 0);
          var Total = api.column(3).data().reduce(function(a, b) {
            return "";
          }, 0);
          var Accuracy = api.column(4).data().reduce(function(a, b) {
            return '';
          }, 0);
          var UIA = api.column(5).data().reduce(function(a, b) {
            return 'Total';
          }, 0);
          var expected = api.column(6).data().reduce(function(a, b) {
            return total.expected;
          }, 0);
          var counted = api.column(7).data().reduce(function(a, b) {
            return total.counted;
          }, 0);
          var countedsf = api.column(8).data().reduce(function(a, b) {
            return total.countedsf;
          }, 0);
          var countedsr = api.column(9).data().reduce(function(a, b) {
            return total.countedsr;
          }, 0);
          // Update footer by showing the total with the reference of the column index 
          $(api.column(0).footer()).html('');
          $(api.column(1).footer()).html(monTotal);
          $(api.column(2).footer()).html(tueTotal);
          $(api.column(3).footer()).html(Total);
          $(api.column(4).footer()).html(Accuracy);
          $(api.column(5).footer()).html(UIA);
          $(api.column(6).footer()).html(expected);
          $(api.column(7).footer()).html(counted);
          $(api.column(8).footer()).html(countedsf);
          $(api.column(9).footer()).html(countedsr);
        },
        "scrollY": 500,
        "oLanguage": {
          "sSearch": "Sku Search: "
        },
      });
      $("#dataTableFour").append(
        $('<tfoot/>').append("<tr>"+ 
        "<th></th>"+ 
          "<th></th> "+ 
          "<th></th>"+ 
          " <th></th> "+ 
          "<th>Total</th>"+ 
          " <th id='Remaining'></th>"+ 
          " <th id='Expected2'></th>"+ 
          " <th id='Counted2'></th>"+ 
          " <th id='CountedSF2'></th>"+ 
          " <th id='CountedSR2'></th>"+ 
         "</tr>").css("color","#fff")
      );

      $('.run').on('click',function(){
        var error = 0;
        $(".error_msg").html('');
        if($('#stockSummaryFilter').find('[name="StoreID"]').val()=="" || $('#stockSummaryFilter').find('[name="StoreID"]').val()==null){
          error=1;
          $('#stockSummaryFilter').find('.StoreID_error').html('Please Select Store !')       
        }else{
          $('#stockSummaryFilter').find('.StoreID_error').html(' ')
        }

        if($('#stockSummaryFilter').find('[name="Date"]').val()=="" || $('#stockSummaryFilter').find('[name="Date"]').val()==null){
          error=1;
          $('#stockSummaryFilter').find('.Date_error').html('Please Select Date !')       
        }else{
          $('#stockSummaryFilter').find('.Date_error').html(' ')
        }

        if(error == 0){    
          $(".before_load_table").show();
          main_table.ajax.reload();
          main_table2.ajax.reload();
          main_table3.ajax.reload();
          main_table4.ajax.reload();
          $(".data-tables").css('visibility','visible');
          $(".before_load_table").hide();
          $(".visibile").show();
        }
      })

    });

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
                      <h4 className="mb-0"> <img src="/asserts/images/count/Icon ionic-ios-flower.png" alt="" />
                        STOCK SUMMARY
                      </h4>
                      <p className="mb-0 dateTime"></p>
                    </div>
                    <div className="right d-inline-block float-right mt-2">
                      <img src="/asserts/images/count/Group 9.png" height="30px" />
                      <span style={{cursor:"pointer"}} className="button_print_count">
                      <img src="/asserts/images/count/Icon feather-printer.png" height="30px" className="ml-1 mr-1" />
                      </span>
                      <span style={{cursor:"pointer"}} className="buttons_excel_count">
                      <img src="/asserts/images/count/Group 10.png" height="30px" />
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="containerr">
                      <form id="stockSummaryFilter" className="custom-filter ">
                        <div className="row">
                          <h4 className="light d-inline-block mr-4 mb-0">Filters</h4>
                          <div className="col-md-2">
                            <div className="form-group">
                              <select 
                                name="StoreID" className="form-control selectpicker" 
                                id="StoreID" data-live-search="true"
                                onChange={evt => this.onStoreIdChange(evt)}>
                                <option value="0">All Name</option>
                                {this.state.store_list.map((x, y) => <option value={x.storename}>{x.storename}</option>)}
                              </select>
                              <span className="error StoreID_error"></span>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <DatePicker onChange={this.handleDateChange} selected={this.state.summarydate} className="form-control d-inline-block mr-2 date_picker_22" 
                        id="summarydate"  includeDates={this.state.date_state} name="Date" placeholderText="Ex: yyyy-mm-dd" 
                        dateFormat="yyyy-MM-dd"/>
                              <span className="error Date_error"></span>
                            </div>
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
                    </div>
                    <br/>
                    <div className="before_load_table" >
                      <img src="/asserts/images/waiting_before_table_load.gif" />
                    </div>
                    <div className="visibile cardd2">
                      <div className="data-tables stocksummeryy visibile cardd2">
                        <table id="dataTable" className="text-center mm-datatable">
                          <thead className="bg-light text-capitalize">
                            <tr>
                              <th>Date</th>
                              <th>Store</th>
                              <th>Department</th>
                              <th>Accuracy</th>
                              <th>UIA</th>
                              <th>Expected</th>
                              <th>Counted</th>
                              <th>Overs</th>
                              <th>Unders</th>
                              <th>Expected SF</th>
                              <th>Expected SR</th>
                              <th>Counted SF</th>
                              <th>Counted SR</th>
                              <th>Scanned</th>
                            </tr>
                          </thead>
                          <tbody>
                            <span className="waiting" style={{display: "none"}}>
                            <img src="https://i.postimg.cc/3xVJyMYr/Eclipse-1s-200px.gif" alt="" width='32px' height='32px' />
                            </span>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-5 visibile">
                <div className="card hide">
                  <div className="card-body">
                    <h4 className="header-title">Count Progress</h4>
                    <div>
                      <img src="/asserts/images/graph.png" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row stockSummaryTable visibile cardd2" style={{margin: "0px", width:"100%"}}>
                <div className="col-6 mt-5">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="left d-inline-block">Top 20 Under</h4>
                      <div className="right d-inline-block float-right mt-2">
                        <span style={{cursor:"pointer"}} className="buttons_excel_count">
                        <img src="/asserts/images/count/Group 10.png" height="30px" />
                        </span>    
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="before_load_table">
                        <img src="/asserts/images/waiting_before_table_load.gif" />
                      </div>
                      <div className="data-tables stocksummery">
                        <table id="dataTableTwoo" className="text-center mm-dataTableTwoo">
                          <thead className="bg-light text-capitalize">
                            <tr>
                              <th>Department</th>
                              <th>Brand</th>
                              <th>SKU</th>
                              <th>Expected</th>
                              <th>Diff</th>
                              <th>Diff&nbsp;%</th>
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
                      <h4 className="left d-inline-block">Top 20 Over</h4>
                      <div className="right d-inline-block float-right mt-2">
                        <span style={{cursor:"pointer"}} className="buttons_excel_count">
                        <img src="/asserts/images/count/Group 10.png" height="30px" />
                        </span>    
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="before_load_table">
                        <img src="/asserts/images/waiting_before_table_load.gif" />
                      </div>
                      <div className="data-tables datatable-primary stocksummery">
                        <table id="dataTableThree" className="text-center mm-datatable3">
                          <thead className="bg-light text-capitalize" style={{color: "#000"}}>
                            <tr>
                              <th>Department</th>
                              <th>Brand</th>
                              <th>SKU</th>
                              <th>Expected</th>
                              <th>Diff</th>
                              <th>Diff&nbsp;%</th>
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
              <div className="col-12 mt-5 visibile cardd2">
                <div className="card">
                  <div className="card-header">
                    <div className="left d-inline-block">
                      <h4 className="mb-0"> <i className="ti-stats-up" style={{color:"#000"}}></i> 
                        Realtime Discrepancy
                      </h4>
                      <p className="mb-0 dateTime"></p>
                    </div>
                    <div className="right d-inline-block float-right mt-2">
                      <img src="/asserts/images/count/Group 9.png" height="30px" />
                      <span style={{cursor:"pointer"}} className="button_print_count">
                      <img src="/asserts/images/count/Icon feather-printer.png" height="30px" className="ml-1 mr-1" />
                      </span>
                      <span style={{cursor:"pointer"}} className="buttons_excel_count">
                      <img src="/asserts/images/count/Group 10.png" height="30px" />
                      </span>    
                    </div>
                  </div>
                  <div className="card-body">
                    <h4 className="header-title"></h4>
                    <div className="data-tables">
                      <table id="dataTableFour" className="text-center mm-dataTableFour">
                        <thead className="bg-light text-capitalize">
                          <tr>
                            <th>SKU</th>
                            <th>Dept. Name</th>
                            <th>Brand</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th>Delta</th>
                            <th>Expected</th>
                            <th>Counted</th>
                            <th>Counted SF</th>
                            <th>Counted SR</th>
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