<template>
  <div class='controller'>
  <audio :src="songSrc" id='audioPlayer' :autoplay="autoplay"  style='display:none'></audio>    
    <svgBtn :icoName='playWayIcon' @goPlay='play(playWayIcon)' class='smallIcon'/>
    <svgBtn icoName='prev' @goPlay='play("prev")'/>
    <svgBtn :icoName='playingOrpause' @goPlay='play("play")'/>
    <svgBtn icoName='next' @goPlay='play("next")'/>
    <div class="range"><button :style='rangBtnStyle'  draggable="true" @dragstart='ondragstart'></button></div>
   <!--  <input type="range" max='100' min='0' v-model='volume'/> -->
  </div>
</template>
<script>
import svgBtn from './svgBtn'
export default {
  name: 'controller',
  props:['songId','playWay'],
  data(){
    return{      
      autoplay:true,
      songSrc:'',
      playing:true,
      playerDom:undefined,
      volume:50,
      rangBtnStyle:{transform: "translateX(50px)"}
    }
  },
  components: {
    svgBtn
  },
  computed:{
    playWayIcon(){
      for(var key in this.playWay) {
         if(this.playWay[key]){
          return key
         }
      }     
    },
    playingOrpause(){
        return this.playing ? 'pause' : 'play'
    }
  },
  methods: {
    play(action){     
      this.$emit('play',action)
      if(action=='play'){
        if(this.playerDom.paused){
          this.playerDom.play();
          this.$set(this,'playing',true)
          this.$emit('play',true)         
         }else{
          this.playerDom.pause()
          this.$set(this,'playing',false)
          this.$emit('play',false)
         }
      } 
    },
    ondragstart(){
      console.log("ondragstart")
    }
  },
  watch:{
    songId:function(val,oldVal){
      this.songSrc = "//music.163.com/song/media/outer/url?id=" + val + ".mp3";
      this.playing=true
      this.$emit('play',true)
    },
    volume:function(val){
      let _rangBtnX=val-val/10
      this.rangBtnStyle.transform= "translateX("+_rangBtnX+"px)"
      this.playerDom.volume=val/100
    }
  },
  mounted() { 
    this.playerDom=document.getElementById('audioPlayer')
    this.playerDom.volume=this.volume/100
    this.playerDom.addEventListener('ended',()=>{
      this.play('next')
    })
  }
}
</script>
<style>
.controller{position: absolute;z-index:999;bottom: 60px;width: 60%;left: 20%;height: 60px;margin-left: -23px;
display: -webkit-flex;
display: -moz-flex;
display: -ms-flex;
display: -o-flex;
display: flex;
align-items: center;justify-content: center;
}
.controller svg{flex:0 0 48px;width: 48px;height: 48px;cursor: pointer; margin:0 60px;opacity: .5;transition: opacity .3s;
  filter: drop-shadow( -1px -2px 4px rgba(0,0,0,.3) );-webkit-filter: drop-shadow( -1px -2px 4px rgba(0,0,0,.3) );
}
.controller input{flex:0 0 100px;width: 100px;position: relative;margin-left: -100px}
.smallIcon{margin:0 !important;}
.controller svg:hover{opacity: 1;transition: opacity .3s}

.range{height:0;width: 100px;flex:0 0 100px;border-radius: 4px;border:2px solid rgba(255,255,255,.5);position: relative;}
.range button{width: 14px;height: 14px;border-radius: 14px;background-color: #fff;border:none;position: absolute;margin: -7px 0 0 -7px;}
::-webkit-slider-runnable-track {
  /* rang背景 */
    background: blue;
    height: 0;
    border:none;
}
::-webkit-slider-thumb {
    opacity: .9;
    margin-top: -12px;cursor: pointer;
}
::-webkit-slider-thumb :hover {
    background-color: #cad5eb;
}
</style>
