/* eslint-disable no-undef */
/* eslint-disable camelcase */
import Toast from './cordova/android/toast'
import UI from './cordova/android/ui'
import Thirdparty from './cordova/android/thirdparty'
import System from './cordova/android/system'
import Location from './cordova/android/location'
import BarcodeScanner from './cordova/android/barcodescanner'
import Common from './common/Common'
import WX from './weixin/wx'
// 引入axios用于请求签名等
import axios from 'axios'

function paramsToUrl(obj) {
  let sortKeys = Object.keys(obj)
  let str = '?'
  for (let key of sortKeys) {
    str += `${key}=${obj[key]}&`
  }
  str = str.substring(0, str.length - 1)
  return str
}

const wx = window.wx
// 微信签名和ready事件封装
function getWeixinSign() {
  let jsApiList = [
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
  let timestamp = new Date().valueOf()
  let nonceStr = 'Wm3WZYTPz0wzccnW'
  let queryObj = {
    noncestr: nonceStr,
    timestamp,
    url: window.location.href
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
let nativeAPIPlugin = {}
/**
 * 获取设备事件
 *
 * @param {Boolean} isCordova 是否cordova平台
 * @returns {Promise}
 */
function getDeviceReady(isCordova) {
  if (isCordova) {
    return new Promise((resolve, reject) => {
      // cordova 平台
      document.addEventListener(
        'deviceready',
        function() {
          console.log('deviceready')
          // 添加事件回调
          document.addEventListener(
            'resume',
            () => {
              if (window.onResume) window.onResume()
            },
            false
          )
          document.addEventListener(
            'pause',
            () => {
              if (window.onPause) window.onPause()
            },
            false
          )
          resolve()
        },
        false
      )
      // 若无事件被监听则失败
      setTimeout(reject, 4000, 'deviceready事件不存在')
    })
  } else {
    // 微信
    return getWeixinSign()
  }
}
// 插件使用
nativeAPIPlugin.install = function(Vue, options) {
  // true为cordova，false为H5，H5接口暂时留空
  let plat = options.platform
  let deviceReadyEvent = getDeviceReady(plat).catch(err => {
    // 对于异常进行输出
    console.dir(err)
    throw err
  })
  // 公共组件注入
  Vue.prototype.$Common = deviceReadyEvent.then(() => {
    let common = new Common(plat)
    return common instanceof Common ? common : undefined
  })
  if (plat) {
    Vue.prototype.$Toast = deviceReadyEvent.then(() => {
      let toast = new Toast()
      return toast instanceof Toast ? toast : undefined
    })
    Vue.prototype.$UI = deviceReadyEvent.then(() => {
      let ui = new UI()
      return ui instanceof UI ? ui : undefined
    })
    Vue.prototype.$ThirdParty = deviceReadyEvent.then(() => {
      let thirdparty = new Thirdparty()
      return thirdparty instanceof Thirdparty ? thirdparty : undefined
    })
    Vue.prototype.$System = deviceReadyEvent.then(() => {
      let system = new System()
      return system instanceof System ? system : undefined
    })
    Vue.prototype.$Location = deviceReadyEvent.then(() => {
      let location = new Location()
      return location instanceof Location ? location : undefined
    })
    Vue.prototype.$BarcodeScanner = deviceReadyEvent.then(() => {
      let barcodescanner = new BarcodeScanner()
      return barcodescanner instanceof BarcodeScanner
        ? barcodescanner
        : undefined
    })
  } else {
    Vue.prototype.$WX = deviceReadyEvent.then(() => {
      let wxapi = new WX()
      return wxapi instanceof WX ? wxapi : undefined
    })
  }
}
export default nativeAPIPlugin
