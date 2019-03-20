import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'

import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'

import store from './store'
import router from './router'

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.use(VueRouter);

Vue.config.productionTip = true;

new Vue({
  render: h => h(App),
  router: router,
  store
}).$mount('#app')
