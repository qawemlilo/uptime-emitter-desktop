<template>
  <v-footer app height="64">
    <v-toolbar flat>
      <v-text-field clearable prepend-icon="search" placeholder="Search" v-model="searchString" @input="searchPlaylist" @click:clear="clearField">
      </v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon dark @click="openSettings">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
  </v-footer>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Search',

  data () {
    return {
      searchString: ""
    }
  },

  computed: {
    ...mapGetters([
      'settings'
    ])
  },

  methods: {
    searchPlaylist () {
      this.$emit('search', this.searchString)
    },

    clearField () {
      this.$emit('search', '')
    },

    openSettings() {
      this.$eventBus.$emit('open-settings');
    }
  }
}
</script>
