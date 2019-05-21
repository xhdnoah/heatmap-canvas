/* eslint-disable no-useless-escape */
import Config from '@/tools/config'

export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  let results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
export const formatSeconds = (sec) => {
  let data = [{
      value: parseInt(sec / 3600),
      unit: '时'
    },
    {
      value: parseInt((sec % 3600) / 60),
      unit: '分'
    },
    {
      value: parseInt((sec % 3600) % 60),
      unit: '秒'
    }
  ]
  let index = _.findIndex(data, o => o.value !== 0)
  if (index === -1 || !_.isNumber(sec)) {
    return '0分0秒'
  }
  data = _.slice(data, index, index + 2)
  return _.join(_.map(data, function (o) {
    return o.value + o.unit
  }), '')
}
export const getTimeRangeUtc = () => {
  let dates = arguments[0]
  var dateStart = dates[0]
  var dateEnd = dates[1]
  return [getStartOfDay(dateStart), getEndOfDay(dateEnd)]
}
export const toZeroPoint = (dateTime) => {
  return dateTime - (dateTime % (24 * 60 * 60) + 8 * 3600) % (24 * 3600)
  // return dateTime - (dateTime + 8 * 3600) % (24 * 3600)
}
export const startDayUtc = date => toZeroPoint(moment(date).format('X'))
export const endDayUtc = date => toZeroPoint(moment(date).add(1, 'days').format('X'))

export const getStartOfDay = (date) => {
  return moment(date).startOf('day').unix()
}
export const getEndOfDay = (date) => {
  return moment(date).endOf('day').unix()
}
export const appendImageUrl = imageUrl => "url('" + imageUrl + "')"
export const appendPrefixStaticUrl = (str, cleanCache = true) => {
  if (cleanCache) {
    return Config.imageUrl + str + '?' + new Date().getTime()
  } else {
    return Config.imageUrl + str
  }

}
// 获取图片的高和宽
export const getImageSize = (url) => {
  if (url) {
    return new Promise(resolve => {
      let img = new Image()
      img.onload = () => {
        resolve([_.floor(img.height), _.floor(img.width)])
      }
      img.src = url
    })
  } else {
    return [0, 0]
  }
}
// 随机产生7个字符的字符串
export const randKey = () => {
  return btoa(Math.random()).substr(5, 7)
}

export const getResizedWidthPixel = pixels =>
  parseInt((pixels / 1920) * window.innerWidth)
/**
 * 根据原始固定像素值占浏览器高度比例计算resize后的实际高度
 * @param pixels
 * @returns {number}
 */
export const getResizedHeightPixel = pixels =>
  parseInt((pixels / 1080) * window.innerHeight)

export default {
  getEndOfDay,
  getStartOfDay,
  getTimeRangeUtc,
  formatSeconds,
  appendImageUrl,
  appendPrefixStaticUrl,
  getImageSize,
  randKey,
  getResizedHeightPixel,
  getResizedWidthPixel
}
