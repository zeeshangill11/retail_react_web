const get_server_ip = async () => {

  
  try {
    var url_string = 'http://localhost:8082/api/1.0.0/';
    return url_string;

  } catch (error) {

  }
}

export default {get_server_ip}