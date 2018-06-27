// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import bComponents from './view/components/index.js'
import util from './lib/util.js';

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(bComponents)
/* eslint-disable no-new */

window.DEMO = window.DEMO || {};
window.DEMO.Util = util;
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
