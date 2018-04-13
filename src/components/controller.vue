<template>
  <div class='controller'>
    <svgBtn icoName='prev' @goPlay='action'/>
    <svgBtn icoName='play' @goPlay='action'/>
    <svgBtn icoName='next' @goPlay='action'/>
  </div>
</template>
<script>
import svgBtn from './svgBtn'
export default {
  name: 'controller',
  data(){
    return{
      player:this.$parent.$refs.audioPlayer,
      playing:false
    }
  },
  components: {
    svgBtn
  },
  methods: {
    action(way){
      switch(way){
        case 'play':
         if(this.player.paused){
          this.player.play()
         }else{
          this.player.pause()
         }
        break;
      }
      
    }
  },
  mounted() { 
   console.log(this.player)
  }
}
</script>
<style>
.controller{position: absolute;z-index:999;bottom: 120px;width: 60%;left: 20%;height: 60px;
display: -webkit-flex;
display: -moz-flex;
display: -ms-flex;
display: -o-flex;
display: flex;
align-items: center;;justify-content: center;
}
.controller svg{flex:0 0 48px;width: 48px;height: 48px;cursor: pointer; margin:0 60px;opacity: .5;transition: opacity .3s;
  filter: drop-shadow( -1px -2px 4px rgba(0,0,0,.3) );-webkit-filter: drop-shadow( -1px -2px 4px rgba(0,0,0,.3) );
}
.controller svg:hover{opacity: 1;transition: opacity .3s}
</style>
