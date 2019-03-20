'use strict';

import Router from 'vue-router'
import goTo from 'vuetify/lib/components/Vuetify/goTo'

export default new Router({
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
  routes: [
    {
      path: '/',
      name: 'home',
      components: require('./views/Home.vue')
    },
    {
      path: '/monitor/:monitorId',
      name: 'monitor',
      components: require('./views/Monitor.vue')
    }
  ]
})
