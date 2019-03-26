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
            <v-toolbar-title>Edit Monitor</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveMonitor">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>

              <v-select v-model="serverType" :items="serverOptions" :rules="[v => !!v || 'Server Protocol is required']" label="Server Protocol" required></v-select>

              <v-text-field v-model="title"  :rules="titleRules" label="Title" required></v-text-field>

              <v-text-field v-if="serverType == 'HTTP'" v-model="website" :rules="urlRules" label="Address" required></v-text-field>

              <v-text-field v-if="serverType == 'TCP'" v-model="address" :rules="urlRules" label="Address" required></v-text-field>

              <v-text-field v-if="serverType == 'TCP'" v-model="port" :rules="[v => !!v || 'Port is required']" label="Port" required></v-text-field>

              <v-text-field v-model="interval" :rules="frequencyRules" label="Frequency (minutes)" required></v-text-field>

              <v-subheader class="mt-2 ml-0 pl-0">Expected Response</v-subheader>

              <v-text-field v-model="statusCode" :rules="statusCodeRules" label="Status Code" required></v-text-field>
            </v-form>
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
      monitor: Object
    },

    methods: {
      closeModal () {
        this.dialog = false;
      },

      validate () {
        let valid = false;

        if (this.$refs.form.validate()) {
          this.snackbar = true;
          valid = true;
        }

        return valid;
      },

      resetForm () {
        this.title = '';
        this.website = '';
        this.address = '';
        this.port = null;
        this.interval = 5;

        this.$refs.form.resetValidation();
        this.$refs.form.reset();
      },

      saveMonitor () {
        if (!this.validate()) {
          return false;
        }

        let monitor = {
          id: this.monitor.id,
          title: this.title,
          website: this.website,
          address: this.address,
          port: this.port,
          interval: this.interval,
          statusCode: this.statusCode
        };


        this.$store.dispatch('UPDATE_MONITOR',monitor);

        this.closeModal();
      },

      openModal () {
        this.dialog = true;
      }
    },

    data () {
      return {
        dialog: false,
        valid: true,
        port: this.monitor.port,
        title: this.monitor.title,
        titleRules: [
          v => !!v || 'Title is required'
        ],
        website: this.monitor.website,
        address: this.monitor.address,
        statusCode: this.monitor.expect && this.monitor.expect.statusCode ? this.monitor.expect.statusCode : 200,
        urlRules: [
          v => !!v || 'Address is required'
        ],
        serverType: this.monitor.website ? 'HTTP' : 'TCP',
        interval: this.monitor.interval ? this.monitor.interval : 5,
        frequencyRules: [
          v => v > 0 && v <= 1440 || 'Frequency should be from 1 to 1440 minutes'
        ],
        statusCodeRules: [
          v => v > 0 && v <= 1440 || 'Frequency should be from 1 to 1440 minutes'
        ],
        serverOptions: [
          'HTTP',
          'TCP'
        ]
      }
    },

    created() {
      let self = this;

      this.$on('close',  () => {
        self.dialog = false;
      });

      this.$on('open',  () => {
        self.dialog = true;
      });
    }

  }
</script>
