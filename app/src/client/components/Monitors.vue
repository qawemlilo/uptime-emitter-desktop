<template>
  <v-card>
    <v-card-title primary-title color="dark" class="mb-0">
      <div class="headline">Monitors</div>
    </v-card-title>

    <v-card-title primary-title v-if="monitors.length === 0">
      <div style="width:100%;text-align:center">
        <v-btn round color="error" dark @click="newMonitorForm">
          <v-icon>add</v-icon> Create your first monitor
        </v-btn>
      </div>
    </v-card-title>

    <v-list two-line class="mt-0">
      <v-list-tile
        v-for="(monitor, index) in monitors"
        :key="index"
        :class="[{even: index % 2 == 0}]"
        >
        <v-list-tile-avatar medium @click="goTo(monitor.id)" style="cursor: pointer">
          <v-progress-circular :size="50" color="primary" indeterminate v-if="monitor.totalRequests === 0"></v-progress-circular>
          <v-icon :class="getClass(monitor.active, monitor.isUp)"  v-if="monitor.totalRequests > 0">{{ getIcon(monitor.active, monitor.isUp) }}</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content @click="goTo(monitor.id)" style="cursor: pointer">
          <v-list-tile-title>
            {{ monitor.title }}
            <v-icon ml="5" :color="getClass(monitor.active, monitor.isUp)" v-if="monitor.totalRequests > 0">trending_up</v-icon>
            <span v-if="monitor.totalRequests > 0">{{percentage(monitor.totalDownTimes, monitor.totalRequests)}}%</span>
          </v-list-tile-title>
          <v-list-tile-sub-title>{{ monitor.website }}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-spacer></v-spacer>

        <v-list-tile-action>
          <v-switch :input-value="monitor.active" @change="toggleMonitor(monitor.id, $event)"></v-switch>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>

  export default {

    props: {
      monitors: Array
    },

    methods: {

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

        return parseFloat((uptime / totalRequests) * 100).toFixed(2);
      },

      toggleMonitor(monitorId,active) {
        this.$nextTick(() => {
          this.$store.dispatch('TOGGLE_MONITOR_STATE', {
            id: monitorId,
            action: active ? 'start' : 'stop'
          });
        });
      },

      goTo(monitorId) {
        this.$router.push('/monitor/' + monitorId);
      },

      newMonitorForm() {
        this.$eventBus.$emit('new-monitor');
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
