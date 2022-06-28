import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddTutorial from "./components/add-tutorial.component";
import Tutorial from "./components/tutorial.component";
import TutorialsList from "./components/tutorials-list.component";
import Login from "./components/Login/Login";

import executiveSummary from "./components/executiveSummary/executiveSummary";
import executiveSummaryOnHandSimple from "./components/executiveSummary/executiveSummaryOnHandSimple";
import underOvers from "./components/executiveSummary/underOvers";
import AllOvers from "./components/executiveSummary/AllOvers";
import CriticalOutOfStock from "./components/executiveSummary/CriticalOutOfStock";
import executiveSummaryCount from "./components/executiveSummary/executiveSummaryCount";
import executiveSummaryFront from "./components/executiveSummary/executiveSummaryFront";
import executiveSummaryBack from "./components/executiveSummary/executiveSummaryBack";

import handheldDevices from "./components/handheldDevices/handheldDevices";
import edithandhelddevice from "./components/handheldDevices/edithandhelddevice";
import addhandheldDevice from "./components/handheldDevices/addhandheldDevice";
import inventoryByItems from "./components/inventory/inventoryByItems";
import dailyStockCountReport from "./components/DailyStockCount/dailyStockCountReport";

import stockSummary from "./components/stockSummary/stockSummary";
import all_under_over from "./components/allUnderOver/all_under_over";
import asnData from "./components/supplyChain/asnData";
import GoodsSummary from "./components/supplyChain/GoodsSummary";
import GoodsStockStore from "./components/supplyChain/GoodsStockStore";
import GoodsStockWareHouse from "./components/supplyChain/GoodsStockWareHouse";
import zplReport from "./components/TagIT/zplReport";
import zplReport_sku from "./components/TagIT/zplReport_sku";
import transferCancellation from "./components/transferCancellation/transferCancellation";
import gi_cancellation from "./components/transferCancellation/gi_cancellation";
import storeinfo from "./components/Stores/storeInfo";
import printerInfo from "./components/Printers/printerInfo";
import zplInfo from "./components/Zpl/zplInfo";
import ibtDifferences from "./components/ibtDifferences/ibtDifferences";
import audit from "./components/audit/audit";
import rolesInfo from "./components/roles/rolesInfo";
import users from "./components/Users/users";
import addUser from "./components/Users/addUser";
import edituser_info from "./components/Users/edituser_info";
import addzpl from "./components/Zpl/addzpl";
import editzpl from "./components/Zpl/editzpl";
import editroles from "./components/roles/editroles";
import addUserRole from "./components/roles/addUserRoles";
import admin_menu from "./components/Admin/admin_menu";
import handle_cronjobs from "./components/Admin/handle_cronjobs";
import soh_details from "./components/Admin/soh_details";
import admin_error_log from "./components/Admin/admin_error_log";
import problem_asn from "./components/Admin/problem_asn";
import enterpriseReportOld from "./components/Admin/enterpriseReportOld";
import stockSummaryExtras from "./components/Admin/stockSummaryExtras";

class App extends Component {

  constructor(props) {
    super(props);
    this.getState = this.getState.bind(this)
  }
  getState() {
    this.props.giveMeState(this.state)
  }
  render() {

    return (
      <>
        <Switch>
          <Route exact path={["/", "/tutorials"]} component={TutorialsList} />
          <Route exact path="/add" component={AddTutorial} />
          <Route path="/tutorials/:id" component={Tutorial} />
          <Route path="/login" component={Login} />

          <Route path="/executiveSummary" component={executiveSummary} />
          <Route path="/executiveSummaryOnHandSimple" component={executiveSummaryOnHandSimple} />
          <Route path="/underOvers" component={underOvers} />
          <Route path="/AllOvers" component={AllOvers} />
          <Route path="/executiveSummaryCount" component={executiveSummaryCount} />
          <Route path="/executiveSummaryFront" component={executiveSummaryFront} />
          <Route path="/executiveSummaryBack" component={executiveSummaryBack} />
          <Route path="/CriticalOutOfStock" component={CriticalOutOfStock} />

          <Route path="/handheldDevices" component={handheldDevices} />
          <Route path="/edithandhelddevice/:id" component={edithandhelddevice} />
          <Route path="/addhandheldDevice" component={addhandheldDevice} />

          <Route path="/inventorybyitem" component={inventoryByItems} />

          <Route path="/dailyStockCountReport" component={dailyStockCountReport} />

          <Route path="/stockSummary" component={stockSummary} />
          {/* Supply chain Reports */}
          <Route path="/all_under_over" component={all_under_over} />
          <Route path="/asndata" component={asnData} />
          <Route path="/GoodsSummary" component={GoodsSummary} />
          <Route path="/GoodsStockStore" component={GoodsStockStore} />
          <Route path="/GoodsStockWareHouse" component={GoodsStockWareHouse} />
          {/* Target IT Reports */}
          <Route path="/zplReport" component={zplReport} />
          <Route path="/zplReport_sku" component={zplReport_sku} />
          {/* Admin Reports */}
          <Route path="/transferCancellation" component={transferCancellation} />
          <Route path="/gi_cancellation" component={gi_cancellation} />
          <Route path="/storeinfo" component={storeinfo} />
          <Route path="/printerInfo" component={printerInfo} />
          <Route path="/zplInfo" component={zplInfo} />
          <Route path="/ibtDifferences" component={ibtDifferences} />
          <Route path="/audit" component={audit} />
          <Route path="/rolesInfo" component={rolesInfo} />
          <Route path="/users" component={users} />
          <Route path="/addUser" component={addUser} />
          <Route path="/edituser_info/:id" component={edituser_info} />
          <Route path="/addzpl" component={addzpl} />
          <Route path="/editzpl/:id" component={editzpl} />
          <Route path="/addUserRoles" component={addUserRole} />
          <Route path="/editroles/:id" component={editroles} />
          <Route path="/admin_menu" component={admin_menu} />
          <Route path="/handle_cronjobs" component={handle_cronjobs} />
          <Route path="/soh_details" component={soh_details} />
          <Route path="/admin_error_log" component={admin_error_log} />
          <Route path="/problem_asn" component={problem_asn} />
          <Route path="/enterpriseReportOld" component={enterpriseReportOld} />
          <Route path="/stockSummaryExtras" component={stockSummaryExtras} />

        </Switch>

      </>

    );
  }
}

export default App;