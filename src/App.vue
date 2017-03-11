<template>
  <div id="app">
 </div>
</template>

<script>
import dropdown from './vue-my-dropdown'

export default {
  name: 'app',

  data() {
    return {
      dd1: {
        visible: false,
        onClick: () => {
          this.dd1.visible = !this.dd1.visible
        },
        clickOut: () => { this.dd1.visible = false }
      },

      dd2: {
        visible: false,
        onClick: () => { this.dd2.visible = !this.dd2.visible },
        clickOut: () => { this.dd2.visible = false }
      }
    }
  },

  components: { dropdown }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.dialog{
  background: #ddd;
  border: 1px solid #ccc;
  padding: .8rem;
}
</style>
