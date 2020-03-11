<template>
  <div>
    <v-progress-linear
      background-color="blue"
      background-opacity="0.3"
      active
      height="12"
      striped
      :value="value"
    >

    </v-progress-linear>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  data() {
    return {
      value: 100,
      polling: null
    }
  },
  mounted() {
    this.$socket.on('timer', data => {
      this.value = data
    })
  },
}
</script>

<style scoped>
</style>