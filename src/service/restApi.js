import http from '@/tools/http'
import Config from '@/tools/config'

/**
 * 设置品牌logo所在位置
 * @param data
 * @returns {*}
 */
export const setBrandLogo = (data) => http.post('/store/cnmobile/sku_zone', data)

export const getBrandInfoList = () => http.get('/store/cnmobile/sku_zone')

export const deleteBrand = name => http.delete(`/store/cnmobile/sku_zone/${name}`)
/**
 * 获取店铺平面图
 */

export const getStorePlan = () => {
  let queryObject = {
    'attributions': JSON.stringify(['store_img'])
  }
  return http.get('/store/info', queryObject)
}

export const getBrandImg = () => {
  return http.get('/store/hotzone_cameras')
}

export const getStoreAttributeData = (time_ranges, attributes, timeout = 10000) => {
  return http.get('/statistic/attribute_query', {
    time_ranges,
    attributes,
  }, timeout)
}


/**
 * 请求摄像头列表数据（获取的是原始数据）
 */
export const getStoreCameraList = (time_ranges, attributes = JSON.stringify(['rankinglist_stay_time_camera'])) =>
  http.get('/statistic/attribute_query', {
    time_ranges,
    attributes
  })


/**
 * 店铺热区 摄像头信息
 */
export const getCamerasPosition = () => http.get('/store/hotzone_cameras')

/**
 * 自动登录
 * @param callback
 */
export const login = (orgId, callback) => {
  fetch(`${Config.httpUrl}/account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      username: "cnmobile",
      password: "cnmobile"
    })
  }).then((res) => {
    if (res.status === 200) {
      return res.json()
    }
  }).then(res => {
    if (res.code === 200) {
      let storeVisited = _.find(res.data.stores, store => store.org_id === orgId)
      if (storeVisited) {
        window.sessionStorage.setItem('Authorization', res.data.auth_token.toString())
        window.sessionStorage.setItem('storeToken', storeVisited.store_token) // 暂时storeToken写死，不适用于多家店铺。

        // 初始化
        callback()
      } else {
        console.log('orgId不匹配！')
      }
    }
  }).catch(err => {
    console.log("err", err)
  })
}

export const uploadCanvas = (image) => {
  fetch('http://img.retailwell.com/upload', {
    method: 'POST',
    headers: {
      "Content-Type": "multipart/*"
    },
    body: image
  }).then((res) => {
    this.upLoadUrl.push(res.uri)
  })
}

export default {
  setBrandLogo,
  getStorePlan,
  getStoreCameraList,
  getCamerasPosition,
  getBrandInfoList,
  getStoreAttributeData,
  login,
  deleteBrand,
  uploadCanvas
}
