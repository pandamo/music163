<template>
  <svg viewBox="0 0 48 48" v-if='icoName' @click='emit()'>
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
.keyTips{
  position: absolute;top: 100px;right:37px;width: 32px;height: 32px;z-index: 999;cursor: pointer;opacity: .4;transition: opacity .6s;
}
.keyTips:hover{opacity: 1;}
</style>