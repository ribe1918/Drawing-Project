<template>
  <canvas
  v-on:mouseup="mouseUp"
  v-on:mousedown="mouseclick"
  v-on:mousemove="updateCoordinates()"
  id="canvas"
  width="800"
  height="600"
  />
</template>

<script>
export default {
  name: 'canvas-game',
  created() {
    this.getState()
  },
  data () {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      drawer: '',
      isActive: false,
      messages: null
    }
  },
  methods: {
    draw (x1, y1, x2, y2, color) {
      this.ctx.beginPath()
      this.ctx.lineCap = 'round'
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 10
      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x2, y2)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    getState () {
      this.$socket.emit('dpS', {
        name: sessionStorage.getItem('nickname'),
        room: '1',
      })
      this.$socket.on('display', (data) => {
        const canvasPic = new Image()
        canvasPic.src = data
        canvasPic.onload = () => {
          this.ctx.drawImage(canvasPic, 0, 0)
        }
      })
    },
    mouseclick () {
      this.x = event.offsetX
      this.y = event.offsetY
      this.isActive = true
    },
    mouseUp () {
      this.isActive = false
      this.$socket.emit('saveState', this.$el.toDataURL())
    },
    updateCoordinates () {
      if(this.isActive !== true) return
      this.$socket.emit('mousemove', {
        name: sessionStorage.getItem('nickname'),
        room: '1',
        id: this.$socket.id,
        x1: this.x,
        y1: this.y,
        x2: event.offsetX,
        y2: event.offsetY,
        isActive: this.isActive,
        color: this.$store.state.colorCode,
        score: 0
      })
      this.mouseclick()
    }
  },
  mounted () {
    this.ctx = this.$el.getContext('2d')
    this.$socket.on('draw', data => {
      this.draw(data.x1, data.y1, data.x2, data.y2, data.color)
    })
    this.$socket.on('clear', () => {
      this.ctx.clearRect(0, 0, 800, 600)
    })
  }
}
</script>

<style scoped>
  * { padding: 0; margin: 0; }
  canvas { background: white; }
</style>
