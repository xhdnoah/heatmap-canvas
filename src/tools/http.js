'use strict'
// import Global from '@/tools/globals'
import axios from 'axios'
import router from '@/router'
import Config from '@/tools/config'

axios.interceptors.request.use(config => {
  // loading
  config.timeout = 10000
  config.baseURL = Config.httpUrl
  config.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': window.sessionStorage.getItem('Authorization'),
    'storeToken': window.sessionStorage.getItem('storeToken')
  }

  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  console.log(response)
  return response
}, error => {
  return Promise.reject(error.response)
})


const serializeFun = JSON.stringify

function getAxiosArgs(method, url, data, doSerialize = false) {
  const axiosArgs = {}

  if (doSerialize) {
    return Object.assign({
      method,
      url,
      data: serializeFun(data)
    }, axiosArgs)
  } else {
    return Object.assign({
      method,
      url,
      params: data
    }, axiosArgs)
  }
}

function checkStatus(response) {
  console.log(response)
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 如果 http 状态码是 401 ，则跳转到登录页
  if (response && (response.status === 401 || response.status === 404)) {
    // router.push({path: '/login'})
    // 异常状态下，把错误信息返回去
    return {
      status: 404,
      msg: '网络异常'
    }
  }

}


export default {
  post(url, data) {
    return axios(getAxiosArgs('post', url, data, true))
      .then((response) => {
        return checkStatus(response)
      })
  },
  put(url, data) {
    return axios(getAxiosArgs('put', url, data, true))
      .then((response) => {
        return checkStatus(response)
      })
  },
  get(url, params) {
    return axios(getAxiosArgs('get', url, params))
      .then((response) => {
        return checkStatus(response)
      })
  },
  delete(url, params) {
    return axios(getAxiosArgs('delete', url, params))
      .then((response) => {
        return checkStatus(response)
      })
  },
}
