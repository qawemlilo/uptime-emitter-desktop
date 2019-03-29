<template>
  <v-toolbar app v-show="$route.name=='home'" height="60px">

    <v-toolbar-side-icon medium @click="openMenu"></v-toolbar-side-icon>

    <v-spacer></v-spacer>

    <v-toolbar-title class="headline text-uppercase">
      <v-icon color="success" medium>insert_chart_outlined</v-icon>
      <span>Uptime</span>
      <span class="font-weight-light">Emitter</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn round color="success" small @click="newMonitorForm">
      <v-icon>add</v-icon> New monitor
    </v-btn>
  </v-toolbar>
</template>
<script>
import Monitor from './NewMonitor.vue'

export default {
  name: 'Search',

  components: {
    Monitor
  },

  methods: {
    newMonitorForm() {
      this.$eventBus.$emit('new-monitor');
    },

    openMenu() {
      this.$eventBus.$emit('open-menu');
    }
  }
};
</script>
