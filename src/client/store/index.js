'use strict';

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const MINUTE = (60 * 1000);

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state: {
    monitors: [],
    timers: {},
    errors: []
  },

  mutations: {
    SET_MONITORS (state, payload) {
      state.monitors = payload.monitors;
    },

    ADD_MONITOR (state, payload) {
      state.monitors.push(payload.monitor);
    },

    TOGGLE_MONITOR_STATE (state, payload) {
      let monitor = state.monitors.find(monitor => monitor.id === payload.monitor.id);

      monitor.active = payload.monitor.active;
    },

    UPDATE_MONITOR (state, payload) {
      let monitor = state.monitors.find(monitor => monitor.id === payload.monitor.id);

      Object.assign(monitor, payload.monitor);
    },

    ADD_TIMER (state, payload) {
      state.timers[payload.id] = payload.timer;
    },

    STOP_TIMER (state, payload) {
      let timer = state.timers[payload.monitor.id];
      clearInterval(timer);
      timer = null;
    },

    LOG_ERROR (state, error) {
      state.errors.push(error);
    }
  },

  getters: {
    searchResults: (state) => (searchString) => {
      return state.monitors.filter((monitor) => {
        return searchString && monitor.title.toLowerCase().includes(searchString.toLowerCase()) || searchString && monitor.host.toLowerCase().includes(searchString.toLowerCase());
      });
    },

    monitors: (state) => {
      return state.monitors;
    },

    timers: (state) => {
      return state.timers;
    }
  },

  actions: {
    async FETCH_MONITORS ({ commit }) {
      try {
        let { data } = await axios({
          method:'get',
          url:'http://localhost:3160/monitors',
          responseType:'json'
        });

        commit('SET_MONITORS', data);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async TOGGLE_MONITOR_STATE ({commit, dispatch}, id) {
      try {
        let { data } = await axios({
          method:'get',
          url:`http://localhost:3160/monitors/${id}/toggle`,
          responseType:'json',
          data: id
        });

        commit('TOGGLE_MONITOR_STATE', data);

        if (data.monitor.active) {
          dispatch('ADD_TIMER', data.monitor);
        }
        else {
          commit('STOP_TIMER', data);
        }
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async ADD_MONITOR ({commit, dispatch}, payload) {
      try {
        let { data } = await axios({
          method:'post',
          url:'http://localhost:3160/monitors',
          responseType:'json',
          data: payload
        });

        // add to state
        commit('ADD_MONITOR', data);

        // trigger monitoring interval
        dispatch('ADD_TIMER', data.monitor);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async UPDATE_MONITOR ({commit}, id) {
      try {
        let { data } = await axios({
          method:'get',
          url:`http://localhost:3160/monitors/${id}`,
          responseType:'json'
        });

        commit('UPDATE_MONITOR', data);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async ADD_TIMER ({state, commit, dispatch}, monitor) {
      if (monitor.active) {
        // create interval to do reguler checks
        let timer = setInterval(function () {
           // fetch the latest monitor state
           dispatch('UPDATE_MONITOR', monitor.id);
        }, monitor.interval * MINUTE);

        // save new timer
        commit('ADD_TIMER', {
          timer: timer,
          id: monitor.id
        });
      }
      else if (state.timers && state.timers[monitor.id]) {
        commit('STOP_TIMER', {
          monitor: monitor
        });
      }
    },

    async SET_TIMERS ({state, dispatch}) {
      state.monitors.forEach(function (monitor) {
        dispatch('ADD_TIMER', monitor);
      });
    },

    async PAUSE ({state, commit, dispatch}) {
      dispatch('PAUSE_SERVER');

      state.monitors.forEach(function (monitor) {
        commit('STOP_TIMER', {
          monitor: monitor
        });
      });
    },


    async RESTART_SERVER ({commit, dispatch}) {
      try {
        await axios({
          method:'get',
          url:`http://localhost:3160/restart`,
          responseType:'json'
        });

        dispatch('SET_TIMERS')
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },


    async PAUSE_SERVER ({commit}) {
      try {
        await axios({
          method:'get',
          url:`http://localhost:3160/pause`,
          responseType:'json'
        });
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },
  }
});
