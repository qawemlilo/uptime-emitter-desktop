<template>
  <v-content>
    <monitors :monitors="monitors" v-if="!term"></monitors>
    <monitors :monitors="filteredMonitors" v-if="term"></monitors>

    <Search @search="searchPlaylist"></Search>
  </v-content>

</template>

<script>
  import { mapGetters } from 'vuex'
  import Monitors from '../components/Monitors.vue'
  import Search from '../components/Search.vue'

  export default {

    components: {
      Monitors,
      Search
    },

    data () {
      return {
        filteredMonitors: [],
        term: ""
      }
    },

    methods: {
      searchPlaylist (term) {
        this.term = term
        this.filteredMonitors = this.searchResults(term)
      }
    },

    computed: {
      ...mapGetters([
        'monitors',
        'searchResults'
      ])
    }

  }
</script>
