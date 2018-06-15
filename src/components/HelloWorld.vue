<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li>
        <a @click="jumptoanother" target="_blank">
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
/// <reference path="../plugins/nativePlugin.d.ts"/>
// import axios from 'axios'
// import { paramsToUrl } from '../util/util.js'
export default {
  name: 'HelloWorld',
  mounted() {
    this.$Common.then(common => {
      console.log('ok')
      common.share('莫失莫忘',
        '仙四的老歌送给老哥',
        'http://img1.imgtn.bdimg.com/it/u=1745875165,3906740002&fm=27&gp=0.jpg',
        'https://test.jijiwuming.cn/test.html',
        () => { console.log('分享成功') },
        err => { console.dir(err) },
        () => { console.log('取消分享') },
        () => { console.log('完成分享') },
        'AppMessage',
        'music',
        'https://test.jijiwuming.cn/test.mp3'
      )
    })
    /*
    this.$WX.then(wx => {
      // 选取卡券测试
      let queryObj = {
        timestamp: new Date().valueOf(),
        nonceStr: 'sduhi123',
        cardType: 'GROUPON'
      }
      axios.get(`http://test.jijiwuming.cn/ticket/sign${paramsToUrl(queryObj)}`).then(res => {
        let sign = res.data
        wx.chooseCard(undefined, queryObj.cardType, undefined, queryObj.timestamp, queryObj.nonceStr, undefined, sign, res => {
          console.log('成功回调')
          console.dir(res)
        }, err => {
          console.log('失败回调')
          console.dir(err)
        }, () => {
          console.log('完成回调')
        })
      })
      // 收货地址测试
      wx.openAddress(res => {
        console.log('成功回调')
        console.dir(res)
      }, err => {
        console.log('失败回调')
        console.dir(err)
      }, () => {
        console.log('完成回调')
      })
    })
    */
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    jumptoanother() {
      this.$router.push('test')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
