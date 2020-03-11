<template>
  <div id="user_panel">
    <v-list
        width="200"
        height="600"
        class="overflow-y-auto"
        id="scroll-target"
        dense
        >
          <div id="scroll-content">
            <v-subheader>유저목록</v-subheader>
            <v-list-item
              v-for="(user, i) in users"
              :key="i"
            >
              <v-list-item-content>
                <v-card height="70px">
                  <v-list-item>
                    <v-list-item-title
                    id="user_name"
                    class="mb-n1"
                    style="text-align: center"
                    >
                    {{user.name}}
                    <br>
                    point: {{user.score}}
                    </v-list-item-title>
                    <v-list-item-avatar
                      tile
                      size="50"
                      color="grey"
                      style="margin-left: 10px;"
                    >
                    <v-img :src="image" />
                    </v-list-item-avatar>
                  </v-list-item>
                </v-card>
              </v-list-item-content>
            </v-list-item>
          </div>

        </v-list>
  </div>
</template>

<script>
import img from '@/assets/profile.jpg'
export default { 
  data() {
    return {
      users: [],
      image: img
    }
  },
  methods: {
    
  },
  mounted() {
    this.$socket.emit('userlist', {
      name: sessionStorage.getItem('nickname'),
      room: '1'
    })
    this.$socket.on('list', data => {
      this.users = data
    })
    this.$socket.on('offline', data => {
      let arr = this.users
      let found = arr.find(user => user.id === data.id)
      let idx = arr.indexOf(found)
      if (idx > -1) arr.splice(idx, 1)
    })
  },
}
</script>

<style scoped>
  #user_panel {background-color: azure; width: 200px; height: 600; margin-right: 10px;}
</style>