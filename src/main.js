// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import nativeAPIPlugin from './plugins/nativePlugin'

Vue.config.productionTip = false

// 生产环境开启使用原生插件
Vue.use(nativeAPIPlugin, {
  platform: false
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
