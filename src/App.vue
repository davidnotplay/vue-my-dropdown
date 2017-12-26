<template>
  <div id="app">
    <dropdown :visible="visible" @clickout="visible = false" @positioned="showPosition">
      <span @click="visible = !visible" class="click-here">Click here</span>
      <div class="dialog" slot="dropdown">dialog</div>
    </dropdown>
 </div>
</template>

<script>
import dropdown from './vue-my-dropdown'

export default {
  name: 'app',

  data() {
    return { visible: false }
  },

  components: { dropdown },

  methods: {
    showPosition(r) {
      console.log(r)
    }
  }
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

.click-here {
  display: inline-block;
  padding: 3px;
  cursor: pointer;
  box-sizing: border-box;
}

.dialog{
  background: #eee;
  border: 1px solid #ccc;
  padding: .8rem;
  box-shadow: 1px 1px 6px 0 #999;
}
</style>
