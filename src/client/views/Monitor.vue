<template>
  <v-layout row>

    <v-flex xs12 md12>
      <v-card>
        <v-sheet
           class="v-sheet--offset mx-auto"
           :color="statusColor"
           elevation="12"
           height="60px"
         >
          <v-layout
            column
            fill-height
          >
            <v-card-title>
              <v-btn dark lg icon @click="goBack">
                <v-icon>chevron_left</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

              <v-toolbar-title>
                {{monitor.title}}
                <v-icon>{{statusIcon}}</v-icon>
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-card-title>

            <v-spacer></v-spacer>
          </v-layout>
        </v-sheet>

        <v-divider></v-divider>

       <v-divider></v-divider>
        <v-list two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mouse</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{monitor.website || monitor.address + ':' + monitor.port}}</v-list-tile-title>
              <v-list-tile-sub-title>Check every {{monitor.interval}} minute(s)</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>link</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="error">thumb_down</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{monitor.totalDownTimes}}</v-list-tile-title>
              <v-list-tile-sub-title>Total Downtimes</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{new Date(monitor.lastDownTime).toLocaleString()}}</v-list-tile-title>
              <v-list-tile-sub-title>Last Downtime</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="success">import_export</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{monitor.totalRequests}}</v-list-tile-title>
              <v-list-tile-sub-title>Total Requests</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

import { mapGetters } from 'vuex'

export default {

  data () {
    return {
      monitor: {}
    }
  },

  computed: {
    statusIcon() {
      let icon = "";

      if (!this.monitor.active) {
        icon = "wifi_off";
      }
      else if (this.monitor.isUp) {
        icon = "thumb_up";
      }
      else {
        icon = "thumb_down";
      }

      return icon;
    },

    statusColor() {
      let klass = "";

      if (!this.monitor.active) {
        klass = "grey";
      }
      else if (this.monitor.isUp) {
        klass = "success";
      }
      else {
        klass = "error";
      }

      return klass;
    },

    ...mapGetters([
      'getMonitor'
    ])
  },

  methods: {
    goBack() {
      this.$router.back();
    }
  },

  created () {
    const monitorId = this.$route.params.monitorId;

    this.monitor = this.getMonitor(monitorId);
  }
}
</script>
