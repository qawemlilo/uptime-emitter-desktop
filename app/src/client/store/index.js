'use strict';

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const MINUTE = (60 * 1000);
const BASE_URL = `http://localhost:3160`;

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state: {
    monitors: [],
    timers: {},
    requests: {},
    settings: {},
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
    },

    SET_REQUEST (state, payload) {
      state.requests[payload.monitorId] = payload.data.stats || {};
    },

    DELETE_MONITOR (state, payload) {
      state.monitors = state.monitors.filter((monitor) => {
        return monitor.id != payload.monitor.id;
      });
    },

    UPDATE_SETTINGS (state, payload) {
      state.settings.notifications = payload.settings.notifications;
      state.settings.sound = payload.settings.sound;
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

    getMonitor: (state) => (id) => {
      return state.monitors.find(monitor => monitor.id === id);
    },

    timers: (state) => {
      return state.timers;
    },

    getRequests: (state) => (id) => {
      return state.requests[id] || {};
    },

    settings: (state) => {
      return state.settings;
    }
  },

  actions: {
    async FETCH_MONITORS ({ commit, dispatch }) {
      try {
        let { data } = await axios({
          method:'get',
          url:'http://localhost:3160/monitors',
          responseType:'json'
        });

        commit('SET_MONITORS', data);

        dispatch('FETCH_SETTINGS');
        dispatch('SET_TIMERS');
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async TOGGLE_MONITOR_STATE ({commit, dispatch}, payload) {
      try {
        let { data } = await axios({
          method:'get',
          url:`http://localhost:3160/monitors/${payload.id}/${payload.action}`,
          responseType:'json'
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
          url:`${BASE_URL}/monitors`,
          responseType:'json',
          data: payload
        });

        // add to state
        commit('ADD_MONITOR', data);

        // trigger monitoring timer
        dispatch('ADD_TIMER', data.monitor);

        // immediately fetch update
        dispatch('FETCH_UPDATE', data.monitor.id);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async FETCH_UPDATE ({commit}, id) {
      try {
        let { data } = await axios({
          method:'get',
          url:`${BASE_URL}/monitors/${id}`,
          responseType:'json'
        });

        commit('UPDATE_MONITOR', data);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async UPDATE_MONITOR ({commit, dispatch}, payload) {
      try {
        let { data } = await axios({
          method:'post',
          url:`${BASE_URL}/monitors/${payload.id}`,
          responseType:'json',
          data: payload
        });

        commit('UPDATE_MONITOR', data);
        dispatch('FETCH_UPDATE', payload.id);
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
           dispatch('FETCH_UPDATE', monitor.id);
        }, monitor.interval * MINUTE);

        setTimeout(function () {
          dispatch('FETCH_UPDATE', monitor.id);
        }, 100)

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

    async PAUSE ({state, commit}) {
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
          url:`${BASE_URL}/restart`,
          responseType:'json'
        });

        dispatch('SET_TIMERS')
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },


    async FETCH_REQUESTS ({commit}, monitorId) {
      try {
        let { data } = await axios({
          method:'get',
          url:`${BASE_URL}/requests/${monitorId}`,
          responseType:'json'
        });

        commit('SET_REQUEST', {
          monitorId: monitorId,
          data: data
        });
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async DELETE_MONITOR ({commit}, payload) {
      try {
        commit('STOP_TIMER', {
          monitor: payload
        });

        await axios({
          method:'post',
          url:`${BASE_URL}/monitors/${payload.id}/remove`,
          responseType:'json'
        });


        commit('DELETE_MONITOR', {
          monitor: payload
        });
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async FETCH_SETTINGS ({commit}) {
      try {
        let { data } = await axios({
          method:'get',
          url:`${BASE_URL}/settings`,
          responseType:'json'
        });

        commit('UPDATE_SETTINGS', data);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async UPDATE_SETTINGS ({commit}, payload) {
      try {
        let { data } = await axios({
          method:'post',
          url:`${BASE_URL}/settings`,
          responseType:'json',
          data: payload
        });

        commit('UPDATE_SETTINGS', data);
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    },

    async OPEN_LINK ({commit}, payload) {
      try {
         await axios({
          method:'post',
          url:`${BASE_URL}/openlink`,
          responseType:'json',
          data: payload
        });
      }
      catch (e) {
        commit('LOG_ERROR', e);
      }
    }
}
});
