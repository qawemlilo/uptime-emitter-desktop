<template>
  <v-app dark>

    <Navigation :monitors="monitors" @notify="notify"></Navigation>

    <SideMenu ref="sideMenu"></SideMenu>

    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>

    <monitor ref="newMonitorDialog" :monitors="monitors"></monitor>

    <BuyMeCoffee ref="buyMeCoffee"></BuyMeCoffee>

    <Settings ref="settings" :settings="settings" v-if="settings"></Settings>

    <v-snackbar :bottom="true" :left="true" v-model="snackbar" :color="color" :timeout="timeout">
      {{ text }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import Home from './views/Home.vue'
import Navigation from './components/Navigation.vue'
import Monitor from './components/NewMonitor.vue'
import BuyMeCoffee from './components/BuyMeCoffee.vue'
import SideMenu from './components/SideMenu.vue'
import Settings from './components/Settings.vue'

export default {
  name: 'App',

  components: {
    Home,
    Navigation,
    Monitor,
    BuyMeCoffee,
    SideMenu,
    Settings
  },

  data () {
    return {
      searchString: "",
      newMonitor: false,
      snackbar: false,
      color: '',
      mode: '',
      timeout: 20000,
      text: ''
    }
  },

  computed: {
    ...mapGetters([
      'monitors',
      'timers',
      'settings'
    ])
  },

  methods: {

    notify(color, message, timeout) {
      this.snackbar = true;
      this.color = color;
      this.text = message;
      this.timeout = timeout || 20000;
    },

    networkOnLine() {
      this.notify('success', 'Yay!! You are back online :)')
    },

    networkOffLine() {
      this.notify('error', 'You are offline :(');
    },

    restartMonitoring() {
      this.$store.dispatch({
        type: 'RESTART_SERVER'
      });
    },

    newMonitorForm() {
      this.$refs.newMonitorDialog.$emit('open');
    },

    stopMonitoring() {
      this.$store.dispatch({
        type: 'PAUSE'
      });
    },

    closeBuyMeCoffee() {
      this.$refs.buyMeCoffee.$emit('close');
    },

    buyMeCoffee() {
      this.$refs.buyMeCoffee.$emit('open');
    },

    openMenu() {
      this.$refs.sideMenu.$emit('open');
    },

    openSettings() {
      this.$refs.settings.$emit('open');
    }
  },


  mounted() {

    this.$store.dispatch({
      type: 'FETCH_MONITORS'
    });

    if (!navigator.onLine) {
      this.networkOffLine();

      setTimeout(() => {
        this.stopMonitoring();
      }, 1000);
    }


    window.addEventListener('online',  () => {
      this.networkOnLine();
      this.restartMonitoring();
    });

    window.addEventListener('offline',  () => {
      this.networkOffLine();
      this.stopMonitoring();
    });

    this.$eventBus.$on('alert', (data) => {
      this.notify(data.color,data.message,data.timeout);
    });

    this.$eventBus.$on('new-monitor', () => {
      this.newMonitorForm();
    });

    this.$eventBus.$on('open-menu', () => {
      this.openMenu();
    });

    this.$eventBus.$on('open-settings', () => {
      this.openSettings();
    });
  }
}
</script>
<style>
 body {
   background: #303030;
 }

 .fade-enter-active,
 .fade-leave-active {
   transition-duration: 0.3s;
   transition-property: opacity;
   transition-timing-function: ease;
 }

 .fade-enter,
 .fade-leave-active {
   opacity: 0
 }
</style>
