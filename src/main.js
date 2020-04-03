import Vue from 'vue'
import App from './App'
// import axios from 'axios'
// axios.defaults.timeout = 5000
// Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
