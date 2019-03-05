<template>
  <v-content>
    <monitors :monitors="monitors" v-if="!searchString"></monitors>
  </v-content>

</template>

<script>

  import Monitor from './Monitors.vue'

  export default {

    components: {
      Monitor
    },

    props: {
      monitors: Array,
      searchString: String
    },

    components: {
      Monitors
    },

    data () {
      return {
        filteredMonitors: []
      }
    },

    computed: {
      ...mapGetters([
        'monitors',
        'searchResults'
      ])
    },

    methods: {
      searchPlaylist () {
        this.filteredMonitors = this.searchResults(this.searchString)
      }
    }

  }
</script>
