<template>
  <v-footer app height="64">
    <v-toolbar flat>
      <v-text-field
      clearable
      prepend-icon="search"
      placeholder="Search"
      v-model="searchString"
      @input="searchPlaylist"
      >
      </v-text-field>
      <v-spacer></v-spacer>
    </v-toolbar>
  </v-footer>
</template>
