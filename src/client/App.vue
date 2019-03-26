<template>
  <v-app dark>

    <Navigation :monitors="monitors"></Navigation>

    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>

    <v-snackbar :bottom="true" v-model="snackbar" :color="color" :timeout="timeout">
      {{ text }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import Home from './views/Home.vue'
import Navigation from './components/Navigation.vue'

export default {
  name: 'App',

  components: {
    Home,
    Navigation
  },

  data () {
    return {
      searchString: "",
      drawer: null,
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ],
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
      'searchResults'
    ])
  },

  methods: {

    networkOnLine() {
      this.snackbar = true;
      this.color = 'success';
      this.text = 'Yay!! You are back online :)';
    },

    networkOffLine() {
      this.snackbar = true;
      this.color = 'error';
      this.text = 'You are offline :(';
    },

    restartMonitoring() {
      this.$store.dispatch({
        type: 'RESTART_SERVER'
      });
    },

    stopMonitoring() {
      this.$store.dispatch({
        type: 'PAUSE'
      });
    }
  },


  mounted() {
    const self = this;

    this.$store.dispatch({
      type: 'FETCH_MONITORS'
    });

    if (!navigator.onLine) {
      self.networkOffLine();

      setTimeout(function () {
        self.stopMonitoring();
      }, 1000);
    }


    window.addEventListener('online',  () => {
      self.networkOnLine();
      self.restartMonitoring();
    });

    window.addEventListener('offline',  () => {
      self.networkOffLine();
      self.stopMonitoring();
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
