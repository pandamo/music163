<template>
  <div class='controller'>
  <audio :src="songSrc" ref='audioPlayer' id='audioPlayer' :autoplay="autoplay" controls="" style='margin:50px 0 0 0;position:fixed;z-index:9999'></audio>  
    <svgBtn icoName='prev' @goPlay='action("prev")'/>
    <svgBtn icoName='play' @goPlay='action("play")'/>
    <svgBtn icoName='next' @goPlay='action("next")'/>
  </div>
</template>
<script>
import svgBtn from './svgBtn'
export default {
  name: 'controller',
  props:['songId'],
  data(){
    return{      
      autoplay:false,
      songSrc:''
    }
  },
  components: {
    svgBtn
  },
  methods: {
    action(way){     
      this.$emit('play',way)
      if(way=='play'){
        if(this.$refs.audioPlayer.paused){
          this.$refs.audioPlayer.play()
         }else{
          this.$refs.audioPlayer.pause()
         }
      } 
    }
  },
  watch:{
    songId:function(val,oldVal){
      this.songSrc = "//music.163.com/song/media/outer/url?id=" + val + ".mp3"
    }
  },
  mounted() { 
   
  }
}
</script>
<style>
.controller{position: absolute;z-index:999;bottom: 60px;width: 60%;left: 20%;height: 60px;
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
