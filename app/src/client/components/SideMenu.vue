<template>
  <v-navigation-drawer v-model="drawer" absolute temporary>

    <v-list dense>
      <v-list-tile @click="openMonitors">
        <v-list-tile-action>
          <v-icon>insert_chart_outlined</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>Monitors</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile @click="openSettings">
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div style="text-align:center;bottom:1rem;position:fixed;width:100%">
      <p class="mb-1">Are you enjoying using this app?</p>
      <v-btn round color="orange" class="mt-0" @click="buyMeCoffee">
        <v-icon>sentiment_satisfied</v-icon> Please buy me coffe
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      sheet: false,
      drawer: false
    }
  },

  methods: {
    buyMeCoffee() {
      this.$store.dispatch('OPEN_LINK', {
        link: 'https://www.buymeacoffee.com/wrFJ6ftAi'
      });
    },

    openSettings() {
      this.$eventBus.$emit('open-settings');
      this.drawer = false;
    },

    openMonitors() {
      this.$router.push({path: '/'});
      this.drawer = false;
    }
  },

  created() {
    this.$on('close',  () => {
      this.drawer = false;
    });

    this.$on('open',  () => {
      this.drawer = true;
    });
  }
}
</script>
