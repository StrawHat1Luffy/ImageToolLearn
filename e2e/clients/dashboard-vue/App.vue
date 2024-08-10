<template>
  <dashboard :ImageToolLearn="ImageToolLearn" />
</template>

<script>
import Vue from 'vue'
import ImageToolLearn from '@ImageToolLearn/core'
import { Dashboard } from '@ImageToolLearn/vue'

export default {
  name: 'App',
  components: {
    Dashboard,
  },
  computed: {
    ImageToolLearn: () => new ImageToolLearn(),
  },
}
</script>

<style src="@ImageToolLearn/core/dist/style.css"></style>
<style src="@ImageToolLearn/dashboard/dist/style.css"></style>
