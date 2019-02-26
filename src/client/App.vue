<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <v-icon color="success" medium>insert_chart_outlined</v-icon>
        <span>Uptime</span>
        <span class="font-weight-light">Emitter</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-divider></v-divider>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>


    <v-content>
      <monitors :monitors="monitors" v-if="!searchString"></monitors>
      <monitors :monitors="filteredMonitors" v-if="searchString"></monitors>
      <v-snackbar :bottom="true" v-model="snackbar" :color="color" :timeout="timeout">
        {{ text }}
        <v-btn dark flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-content>


    <v-footer app height="64">
      <v-toolbar flat>
        <v-text-field
        clearable
        prepend-icon="search"
        placeholder="Search"
        v-model="searchString"
        @input="searchPlaylist"
        >
        </v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-footer>
  </v-app>
</template>

<style>

 body {
   background: #303030;
 }
</style>
<script>
import Monitors from './components/Monitors.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'App',

  components: {
    Monitors
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
      filteredMonitors: [],
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
    searchPlaylist () {
      this.filteredMonitors = this.searchResults(this.searchString)
    },

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
