<template>
  <v-container fluid fill-height>
    <v-col
    cols="12"
    >
      <v-row
        justify="center"
      >
        <v-card
          class="mt-n12"
          height="50"
          width="250"
          flat
          tile
          align="center"
        >
          <div id="word"
            style="margin-left: 10px;margin-top: 7px; letter-spacing: 20px;"
          >
            <h2>
              {{answer}}
            </h2>
          </div>
        </v-card>
      </v-row>
      <v-row
        justify="center"
      >
        <v-card
          height="40"
          width="1320"
          flat
        >
          <timer class="my-3"/>
        </v-card>
      </v-row>
      <v-row
        align="center"
        justify="center"
        class="mt-n5"
      >
        <v-layout
          align-center
          justify-center
        >
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
        >
          {{ text }}
          <v-btn
            color="blue"
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
          <user />
          <canvas-game />
          <chat />
        </v-layout>
      </v-row>
      <v-row
        justify="center"
      >
        <v-card
          height="50"
          width="1320"
          class="mt-n5"
          align="center"
          justify="center"
        >
          <v-menu
            :close-on-content-click="false"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="indigo"
                text
                dark
                v-on="on"
                style="margin-top: 7px"
                width="400px"
              >
                Color Picker
              </v-btn>
              <v-btn
                dark
                color="green"
                text
                style="margin-top: 7px"
                v-on:click="clearAll()"
                width="400px"
              >
                Clear
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-color-picker 
                  hide-inputs
                  type="hex"
                  v-model="color"
                />
                {{this.$store.state.colorCode = this.color}}
              </v-list>
            </v-card>
          </v-menu>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
  import chat from '@/components/chat'
  import user from '@/components/user'
  import timer from '@/components/timer'

  export default {
    name:'index',
    components: {
      chat,
      user,
      timer
    },
    data () {
      return {
        text: '',
        snackbar: false,
        timeout: 10000,
        type: 'hex',
        hex: '#FF0000',
        answer: ''
      }
    },
    computed: {
      color: {
        get () {
          return this[this.type]
        },
        set (v) {
          this[this.type] = v
        }
      }
    },
    methods: {
      clearAll () {
        this.$socket.emit('ClearAll')
      }
    },
    mounted () {
      this.$socket.on('word', data => {
        let nick = sessionStorage.getItem('nickname')
        this.text = `${nick}님의 차례입니다. 정답 : ${data}을 그려주세요`
        this.answer = data
        this.snackbar = true
        console.log(data)
      })
      this.$socket.on('clsans', () => {
        this.answer = ''
      })
    }
  }
</script>