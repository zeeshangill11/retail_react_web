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

class App extends Component {

  constructor(props) {
    super(props);
    this.getState = this.getState.bind(this)
  }
  getState(){
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
            <Route path="/inventoryByItems" component={inventoryByItems} />
            <Route path="/dailyStockCountReport" component={dailyStockCountReport} />
            
            <Route path="/stockSummary" component={stockSummary} />
            
          </Switch>
          </>
     
    );
  }
}

export default App;