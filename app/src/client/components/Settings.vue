<template>
  <div>
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="dark">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveSettings">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-list three-line subheader>

              <v-list-tile avatar>
                <v-list-tile-action>
                  <v-checkbox v-model="settings.notifications"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Notifications</v-list-tile-title>
                  <v-list-tile-sub-title>Enable desktop notifications</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-action>
                  <v-checkbox v-model="settings.sound"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Sound</v-list-tile-title>
                  <v-list-tile-sub-title>Enable sound in notifications</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>

          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>

export default {

  props: {
    settings: Object
  },

  data () {
    return {
      dialog: false
    }
  },

  methods: {
    closeModal () {
      this.dialog = false;
    },

    openModal () {
      this.dialog = true;
    },

    saveSettings () {
      this.$store.dispatch('UPDATE_SETTINGS', this.settings);

      this.$eventBus.$emit('alert', {
        color: 'primary',
        message: 'Settings updated',
        timeout: 5000
      });
    }
  },

  created() {
    this.$on('close',  () => {
      this.dialog = false;
    });

    this.$on('open',  () => {
      this.dialog = true;
    });
  }
}
</script>
