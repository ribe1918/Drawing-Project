<template>
  <v-container fill-height="100%">
    <v-col cols="12">
      <v-row
        align="center"
        justify="center"
        height="100%"
      >
        <v-card
          id="login-card"
          min-width="300"
          outlined
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">LOGIN</div>
              <v-divider></v-divider>
              <v-text-field
                v-model="textValue"
                class="mt-n2"
                label="Enter your NickName"
                single-line
                outlined
                dense
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn
            class="mt-n9"
            small
            block
            color="#81C147"
            height="40"
            v-on:click="onClick()"
            >
            Play!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      textValue: '',
      urlValue: ''
    }
  },
  methods: {
    onClick(){
      if (this.textValue === null || this.textValue === '') return alert('이름을 입력해주세요')
      sessionStorage.setItem('nickname', this.textValue)
      this.$store.state.isLogin = true
      this.$socket.emit('nickname', {
        id: this.$socket.id,
        name: this.textValue,
        room: '1',
        score: 0
      })
      // this.$router.push('/index')
    }
  },
}
</script>

<style scoped>
</style>
