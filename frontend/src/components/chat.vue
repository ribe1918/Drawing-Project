<template>
  <div id="chat_panel">
    <v-list
    width="300"
    height="552"
    class="overflow-y-auto"
    id="target"
    dense
    >
      <div id="contents">
        <v-subheader>Chat</v-subheader>
        <v-list-item
          dense
          v-for="(msg, i) in msgs"
          :key="i"
        >
          <v-list-item-content>
            {{msg.name}}: {{msg.msg}}
          </v-list-item-content>
        </v-list-item>
      </div>

    </v-list>
    <v-text-field
      v-model="msg"
      label="chat"
      placeholder="Type your guess here"
      solo
      @keyup.13="submitMessageFunc"
    />
  </div>
</template>

<script>
export default {
  name: 'MessageList',
  data() {
    return {
      msg: '',
      msgs: [],
      vlist: 0,
      target: null,
    }
  },
  methods: {
    submitMessageFunc () {
      if (this.msg.length === 0) return false
      this.$socket.emit('submitMessage', {
        name: sessionStorage.getItem('nickname'),
        room: '1',
        msg : this.msg
      })
      this.msg = ''
    }
  },
  mounted() {
    this.vlist = document.getElementById('contents')
    this.target = document.getElementById('target')
    this.$socket.on('chat', async data => {
      await this.msgs.push(data)
      await this.target.scrollBy({
        left: 0,
        top: this.vlist.offsetHeight,
        behavior: 'smooth'
      })
    })
  },
}
</script>

<style scoped>
  #chat_panel {width: 300px; height: 600; margin-left: 10px; margin-top: 30px;}

</style>