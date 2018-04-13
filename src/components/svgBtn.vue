<template>
  <svg viewBox="0 0 32 32" v-if='icoName' @click='emit()'>
    <g v-html="svgCode"></g>    
  </svg>
</template>
<script>
const icons = require('./icons').icons
export default {
  name: 'svgBtn', 
  props: ['icoName'],
  computed:{
    svgCode(){
      return icons[this.icoName]
    }
  },
  methods: {   
    emit(){
      this.$emit('goPlay',this.icoName)
    }
  },
  mounted() {
    
  }
  
}

</script>
<style>

</style>