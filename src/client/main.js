import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/vuetify'
import App from './App.vue'

import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'

import store from './store'


Vue.use(Vuetify);
Vue.use(Vuex);

Vue.config.productionTip = true;

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
