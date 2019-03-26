<template>
  <v-footer app height="64">
    <v-toolbar flat>
      <v-text-field
      clearable
      prepend-icon="search"
      placeholder="Search"
      v-model="searchString"
      @input="searchPlaylist"
      @click:clear="clearField"
      >
      </v-text-field>

      <v-spacer></v-spacer>


      <v-btn icon dark @click="openSettings">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>

    <settings ref="settings"></settings>
  </v-footer>
</template>

<script>

import Settings from './Settings.vue'

export default {
  name: 'Search',

  components: {
    Settings
  },

  data () {
    return {
      searchString: ""
    }
  },

  methods: {
    searchPlaylist () {
      this.$emit('search', this.searchString)
    },

    clearField () {
      this.$emit('search', '')
    },

    openSettings() {
      this.$refs.settings.$emit('open');
    }
  }
}
</script>
