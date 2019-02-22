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
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>New Monitor</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveMonitor">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>

              <v-select v-model="serverType" :items="serverOptions" :rules="[v => !!v || 'Server Option is required']" label="Server Type" required></v-select>

              <v-text-field v-model="title" :rules="titleRules" label="Title" required></v-text-field>

              <v-text-field v-if="serverType == 'HTTP'" v-model="website" :rules="urlRules" label="Address" required></v-text-field>

              <v-text-field v-if="serverType == 'TCP'" v-model="address" :rules="urlRules" label="Address" required></v-text-field>

              <v-text-field v-if="serverType == 'TCP'" v-model="port" :rules="[v => !!v || 'Port is required']" label="Port" required></v-text-field>

              <v-select v-model="interval" :items="frequencyOptions" :rules="frequencyRules" label="Frequency (minutes)" required></v-select>
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
      monitors: Array
    },

    methods: {
      closeModal () {
        this.dialog = false;
        this.resetForm();
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
          title: this.title,
          website: this.website,
          address: this.address,
          port: this.port,
          interval: this.interval
        };

        this.$store.dispatch('ADD_MONITOR',monitor);

        this.closeModal();
      },

      openModal () {
        this.dialog = true;
      }
    },

    data () {
      return {
        notifications: false,
        sound: true,
        widgets: false,
        dialog: false,
        valid: true,
        port: null,
        title: '',
        titleRules: [
          v => !!v || 'Title is required'
        ],
        website: null,
        address: null,
        urlRules: [
          v => !!v || 'Address is required'
        ],
        serverType: 'HTTP',
        interval: 5,
        frequencyRules: [
          v => v > 0 && v < 121 || 'Frequency should be between 1 and 120 minutes'
        ],
        serverOptions: [
          'HTTP',
          'TCP'
        ],
        frequencyOptions: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,20,25,30,60,120],
        checkbox: false
      }
    },

    created() {
      let self = this;

      this.$on('close',  () => {
        self.dialog = false;
      })

      this.$on('open',  () => {
        self.dialog = true;
      })
    }

  }
</script>
