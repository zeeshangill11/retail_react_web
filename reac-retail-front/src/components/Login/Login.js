import React, { Component } from "react";
import new_config from '../../services/config';
import { Route, Redirect } from 'react-router';
import executiveSummary from '../executiveSummary/executiveSummary';
import Cookies from 'universal-cookie';



export default class Login extends Component {

  constructor(props) {

    super(props);

    this.onUserNameeChange = this.onUserNameeChange.bind(this);

    this.onPasswordChange = this.onPasswordChange.bind(this);
 
    this.state = {
      id: null,
      username: "",
      password: "",
      messageStatus: "",
      msg:""
    };
  }

  onUserNameeChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }


  validate_and_send = async () => {
    var cookies = new Cookies();
   
    var username    = this.state.username;
    var password    = this.state.password;

    var server_ip = await new_config.get_server_ip();


    this.setState({waiting:"1"});

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
      
console.log(responseJson.token)
      if(responseJson.error=="0")
      {
        this.setState({
          msg:responseJson.message,
          messageStatus:'1'
        });
        cookies.set('myToken', responseJson.token, { path: '/' });
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
  };
  render() {
    const messageStatus = this.state.messageStatus;
    const waiting = this.state.waiting;
    return (
         <>
            <link rel="stylesheet" href="./css/login.css"/>
            <div className="main h-100">
              <div className="container" id="login_form_main">
                <div className="row">
                  <div className="col-lg-8 offset-lg-2 col-md-6 offset-md-3">
                    <form  id="login_form" className="box" >
                      <h1 className="text-center white mb-4 font-weight-bold">Welcome Back</h1>
                      
                      <div className="field">
                        
                        {(() => {
                          if (messageStatus=="1") {
                            return (
                              <div className="alert alert-success">{this.state.msg} </div>
                            )
                          } else if (messageStatus=="2") {
                            return (
                               <div className="alert alert-danger">{this.state.msg} </div>
                            )
                          } else {
                            return (
                              ''
                            )
                          }
                        })()}
                      </div>
                      
                      <div className="form-group mb-2">

                        <input type="text" id="username" placeholder="Username" 
                        className="form-control pb-4 pl-0"
                        onChange={evt => this.onUserNameeChange(evt)} value={this.state.username}
                        /> 

                      </div>
                      
                      <div className="error error_username"> </div>
                      
                      <div className="form-group">
                        <input type="password" id="password"  placeholder="Password" 
                          className="form-control pb-4 pl-0"
                          onChange={evt => this.onPasswordChange(evt)} value={this.state.password}
                        /> 
                      </div>
                      <div className="error error_password"> </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="Rememberme" id="Rememberme"/>
                        <label className="form-check-label" > Remember me </label>
                      </div>
                      <input type="hidden" id="token" name="token" value="123456"/>
                      
                      <button type="button" onClick={ () => this.validate_and_send()}  className="mt-4 w-100">
                        {waiting=="1" ? (
                          <span>Please Wait <img src="./asserts/images/loading.gif" /></span>
                        ) : (
                            <span>Login</span>
                        )} 
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
       
   
    );
  }

  

}
