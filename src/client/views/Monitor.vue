<template>
  <v-layout row>

    <editMonitor ref="editMonitor" :monitor="monitor"></editMonitor>

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

              <v-menu light offset-y left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dark
                    icon
                    v-on="on"
                  >
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-tile @click="editMonitor">
                    <v-list-tile-title><v-icon>edit</v-icon> Edit Monitor</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="toggleMonitor('stop')" v-if="this.monitor.active">
                    <v-list-tile-title><v-icon color="error">power_settings_new</v-icon> Stop Monitor</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="toggleMonitor('start')" v-if="!this.monitor.active">
                    <v-list-tile-title><v-icon color="success">power_settings_new</v-icon> Restart Monitor</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="deleteMonitor">
                   <v-list-tile-title><v-icon color="error">delete</v-icon> Delete Monitor</v-list-tile-title>
                  </v-list-tile>
                </v-list>

              </v-menu>
            </v-card-title>

            <v-spacer></v-spacer>
          </v-layout>
        </v-sheet>

        <v-divider></v-divider>

        <v-list two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mouse</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{monitor.website || monitor.address + ':' + monitor.port}}</v-list-tile-title>
              <v-list-tile-sub-title>Checks every {{monitor.interval}} minute(s)</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>link</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="success">thumb_up</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ upTime(monitor.totalDownTimes, monitor.totalRequests) }}%</v-list-tile-title>
              <v-list-tile-sub-title>Uptime</v-list-tile-sub-title>
            </v-list-tile-content>
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
              <v-list-tile-title>{{ timeHuman(monitor.lastDownTime) }}</v-list-tile-title>
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

import editMonitor from '../components/EditMonitor.vue'
import { mapGetters } from 'vuex'

export default {

  components: {
    editMonitor
  },

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
    },

    upTime(totalDownTimes, totalRequests) {
      let uptime = totalRequests - totalDownTimes;

      return parseFloat((uptime / totalRequests) * 100).toFixed(2);
    },

    timeHuman(time) {
      return new Date(time).toLocaleString()
    },

    editMonitor() {
      this.$refs.editMonitor.$emit('open');
    },

    deleteMonitor() {
      this.$store.dispatch('DELETE_MONITOR', this.monitor);
      this.$router.push({path: '/'})
    },

    toggleMonitor(action) {
      this.$nextTick(() => {
        this.$store.dispatch('TOGGLE_MONITOR_STATE', {
          id: this.monitor.id,
          action: action
        });
      });
    }

  },

  created () {
    const monitorId = this.$route.params.monitorId;

    this.monitor = this.getMonitor(monitorId);
  }
}
</script>
