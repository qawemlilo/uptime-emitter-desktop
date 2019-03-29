<template>
  <div class="text-xs-center">
    <v-bottom-sheet v-model="sheet">
      <v-card tile>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title><v-icon color="primary">info</v-icon> Please consider buying me coffee if you're enjoying using this app</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn round color="orange" style="padding:.5rem" @click="buyMeCoffee">
                <v-icon>sentiment_satisfied</v-icon> Buy me coffe
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sheet: false
    }
  },

  methods: {
    buyMeCoffee() {
      this.$store.dispatch('OPEN_LINK', {
        link: 'https://www.buymeacoffee.com/wrFJ6ftAi'
      });
    }
  },

  created() {
    this.$on('close',  () => {
      this.sheet = false;
    });

    this.$on('open',  () => {
      this.sheet = true;
    });
  }
}
</script>
