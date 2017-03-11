<template>
    <div>
        <dropdown :visible="visible" :position="position">
          <span @click="visible = !visible">link</span>
          <div slot="dropdown"></div>
        </dropdown>
      </div>
</template>
<script>
  import dropdown from 'src/vue-my-dropdown.vue'

  export default {
    data() {
      return {
        visible: false
      }
    },
    components: { dropdown }
  }

</script>
