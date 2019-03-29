<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img
          src="https://cdn.vuetifyjs.com/images/lists/ali.png"
          height="300px"
        >
          <v-layout
            column
            fill-height
          >
            <v-card-title>
              <v-btn dark icon>
                <v-icon>chevron_left</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn dark icon class="mr-3">
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-card-title>

            <v-spacer></v-spacer>

            <v-card-title class="white--text pl-5 pt-5">
              <div class="display-1 pl-5 pt-5">Ali Conners</div>
            </v-card-title>
          </v-layout>
        </v-img>

        <v-list two-line>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">phone</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>(650) 555-1234</v-list-tile-title>
              <v-list-tile-sub-title>Mobile</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>(323) 555-6789</v-list-tile-title>
              <v-list-tile-sub-title>Work</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">mail</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>aliconnors@example.com</v-list-tile-title>
              <v-list-tile-sub-title>Personal</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>ali_connors@example.com</v-list-tile-title>
              <v-list-tile-sub-title>Work</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">location_on</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>1400 Main Street</v-list-tile-title>
              <v-list-tile-sub-title>Orlando, FL 79938</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

  import Monitor from './NewMonitor.vue'

  export default {

    components: {
      Monitor
    },

    props: {
      monitors: Array
    },

    methods: {

      addNewMonitor() {
        this.$refs.newMonitorDialog.$emit('open');
      },

      getIcon(active, isUp) {
        let icon = "";

        if (active && isUp) {
          icon = "thumb_up";
        }
        else if (active && !isUp) {
          icon = "thumb_down";
        }
        else if (!active) {
          icon = "wifi_off";
        }

        return icon;
      },

      getClass(active, isUp) {
        let klass = "";

        if (active && isUp) {
          klass = "success";
        }
        else if (active && !isUp) {
          klass = "error";
        }
        else if (!active && !isUp) {
          klass = "grey";
        }

        return klass;
      },

      turnOn() {
        this.$refs.newMonitorDialog.$emit('open');
      },

      percentage(totalDownTimes, totalRequests) {
        let uptime = totalRequests - totalDownTimes;

        return Math.round((uptime / totalRequests) * 100);
      },

      toggleMonitor(monitorId) {
        this.$nextTick(() => {
          this.$store.dispatch('TOGGLE_MONITOR_STATE', monitorId);
        });
      }
    },

    data () {
      return {
        styles: {
          active: 'success'
        },
        classes: {
          active: 'success',

        }
      }
    }

  }
</script>

<style scoped>
  .selected {
    background-color:  orange !important;
  }
  .even {
    background-color: #505050
  }
  .playlist {
    overflow: auto
  }
</style>
