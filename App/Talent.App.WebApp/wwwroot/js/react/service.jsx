import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie';

let xhr = {
  post: "",
  get: ""
}

var cookies = Cookies.get('talentAuthToken');
axios.defaults.headers.common = {
  Authorization: `Bearer ${cookies}`, "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  "Access-Control-Allow-Headers": "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"};


xhr.post = function (url, data) {
  let params = qs.stringify(data)
  return new Promise((resolve, reject) => {
    axios.post(url, params).then((res) => {
    //axios({
    //  method: 'POST',
    //    url,
    //    data: params,
    //    headers: { 'Content-Type': 'application/json; charset=utf-8' }
    //}).then((res) => {
      resolve(res)
    })
  })
}

xhr.get = function (url, data) {
  let params = qs.stringify(data)  
  return new Promise((resolve, reject) => {
    axios.get(
      url,
      params      
    ).then((res) => {
      resolve(res)
    })
  })
}
export default xhr
