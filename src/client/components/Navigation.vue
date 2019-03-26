<template>
  <v-toolbar app v-show="$route.name=='home'" height="60px">

    <v-toolbar-title class="headline text-uppercase">
      <v-icon color="success" medium>insert_chart_outlined</v-icon>
      <span>Uptime</span>
      <span class="font-weight-light">Emitter</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon small fab color="success" @click="addNewMonitor">
      <v-icon>add</v-icon>
    </v-btn>

    <monitor ref="newMonitorDialog" :monitors="monitors"></monitor>
  </v-toolbar>
</template>
<script>
import Monitor from './NewMonitor.vue'

export default {
  name: 'Search',

  props: {
    monitors: Array
  },

  components: {
    Monitor
  },

  methods: {
    addNewMonitor() {
      this.$refs.newMonitorDialog.$emit('open');
    }
  }
};
</script>
