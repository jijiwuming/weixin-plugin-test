import { Request } from './request'
import axios from 'axios'
const wx = window.wx
const jsApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'translateVoice',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
]
const appid = window.appid
let sessionID = localStorage.getItem('XIAOBUSESSION')
let url = window.location.href
if (url && url.includes('#')) {
  url = url.split('#')[0]
}
/**
 * 通用的签名请求
 *
 * @returns {Promise}
 */
function getWxSigned() {
  return new Promise((resolve, reject) => {
    Request(
      '/wx/jssdk/config',
      {
        APPID: appid,
        URL: url
      },
      sessionID
    ).then(res => {
      let { APPID, TIMESTAMP, NONCE_STR, SIGN } = res.BODY
      wx.config({
        debug: false,
        appId: APPID,
        timestamp: TIMESTAMP,
        nonceStr: NONCE_STR,
        signature: SIGN,
        jsApiList
      })
      wx.ready(() => {
        resolve()
      })
      wx.error(err => {
        reject(err)
      })
    })
  })
}
/**
 * 对象转请求字符串
 *
 * @param {Object} obj 对象
 * @returns {String} 字符串
 */
function paramsToUrl(obj) {
  let sortKeys = Object.keys(obj)
  let str = '?'
  for (let key of sortKeys) {
    str += `${key}=${obj[key]}&`
  }
  str = str.substring(0, str.length - 1)
  return str
}
/**
 * 自己测试服务器上的签名
 *
 * @returns {Promise}
 */
function getWxSignedMe() {
  let timestamp = new Date().valueOf()
  let nonceStr = 'Wm3WZYTPz0wzccnW'
  let queryObj = {
    noncestr: nonceStr,
    timestamp,
    url
  }
  return new Promise((resolve, reject) => {
    axios
      .get(`https://test.jijiwuming.cn/sign${paramsToUrl(queryObj)}`)
      .then(res => {
        let data = res.data
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx01163e61e7b916d4', // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature: data, // 必填，签名
          jsApiList // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
          // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
          // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
          // 则可以直接调用，不需要放在ready函数中。
          /**
           * config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后
           * config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
           * 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
           */
          resolve()
        })
        wx.error(err => {
          /**
           * config信息验证失败会执行error函数
           * 如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看
           * 也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
           */
          reject(err)
        })
      })
  })
}
export { getWxSigned, getWxSignedMe }
