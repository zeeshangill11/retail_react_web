import new_config from './config';

import Cookies from 'universal-cookie';
var cookies = new Cookies();
var myToken = cookies.get('myToken');
const get_stores = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getStoreName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_departments = async (store_id) =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch(server_ip+'stockCountRecords/getDepartment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
    body: "store_id="+store_id,
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_brands = async (store_id) =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getBrandNameNew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
    body: "store_id="+store_id,
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_colors = async (store_id) =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getColors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
    body: "store_id="+store_id,
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_sizes = async (store_id) =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getSize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
    body: "store_id="+store_id,
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_dates = async (store_id) =>  {
  let server_ip = await new_config.get_server_ip();
  var datesArray = [];
    return fetch( server_ip+'stockCountRecords/getStockCountDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'auth-token': myToken
        },
        body: JSON.stringify({
          store_id:store_id
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {   
      var response_data = (responseJson);
      for(var i  = 0; i < (response_data.length); i++){
            datesArray.push(new Date(response_data[i].stockcountdate));
        }
      return datesArray;
      //this.setState({date_state: datesArray});
    }).catch((error) => console.error(error)).finally();
}


const get_asnDestination = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getAsnDestination', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}


const get_allStatus = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getAsnStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_user_datail = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getUsers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}
const get_storeCompany = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/getStoreCompany', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}
const get_storeCountry = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/store_country', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_logType = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/log_type', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_allRoles = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/GetRoles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

const get_allProcess = async () =>  {
	let server_ip = await new_config.get_server_ip();
	return fetch( server_ip+'stockCountRecords/SelectFiltersCronjob', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'auth-token': myToken
    },
	})
  .then((response) => response.json())
  .then((responseJson) => {
		var temp = responseJson; 
		return temp;

  }).catch((error) => console.error(error)).finally();
}

export default {get_stores,get_departments,get_brands,get_colors,get_sizes,get_dates, get_asnDestination,get_allStatus, get_user_datail, get_storeCompany, get_storeCountry, get_logType, get_allRoles, get_allProcess}