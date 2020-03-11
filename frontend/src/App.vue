<template>
    <v-app>
      <div :style="{
        'background-color': '#81C147',
        'background-image': 'url(' + bgImage + ')',
        'background-repeat': 'repeat',
        'width': '100%',
        'height': '100%',
        'position': 'absolute'
      }" />
      <v-content fluid fill-height>
        <v-container fluid fill-height>
          <v-col cols="12">
          <div v-if="this.$store.state.isLogin">
            <index />
          </div>
          <div v-else>
            <login />
          </div>
          </v-col>
        </v-container>
      </v-content>
      <v-footer
        app
        color="blue"
      >
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import index from './components/index'
import login from './components/login'

export default {
  name: 'App',
  components: {
    index,
    login
  },
  data() {
    return {
      bgImage: require('@/assets/background.png'),
      isLogin: false
    }
  }
}
</script>

<style>
  ::-webkit-scrollbar {
      display: none;
  }
</style>