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
import axios from 'axios'
import { paramsToUrl } from '../util/util.js'
export default {
  name: 'HelloWorld',
  mounted() {
    this.$WX.then(wx => {
      let queryObj = {
        timestamp: new Date().valueOf(),
        nonceStr: 'sduhi123',
        cardType: 'GROUPON'
      }
      axios.get(`http://test.jijiwuming.cn/ticket/sign${paramsToUrl(queryObj)}`).then(sign => {
        console.log(sign)
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
      /*
      wx.openAddress(res => {
        console.log('成功回调')
        console.dir(res)
      }, err => {
        console.log('失败回调')
        console.dir(err)
      }, () => {
        console.log('完成回调')
      })
      */
    })
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
