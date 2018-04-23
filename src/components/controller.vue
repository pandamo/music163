<template>
  <div class='controller'>
    <audio :src="songSrc" id='audioPlayer' :autoplay="autoplay" controls="" style='display:none'></audio>
    <svgBtn :icoName='playWayIcon' @goPlay='play(playWayIcon)' class='smallIcon' />
    <svgBtn icoName='prev' @goPlay='play("prev")' />
    <svgBtn :icoName='playingOrpause' @goPlay='play("play")' />
    <svgBtn icoName='next' @goPlay='play("next")' />
    <div class="volumeBar">
      <input type="range" min='0' max='1' step='.01' v-model='volume' />
    </div>
  </div>
</template>
<script>
import svgBtn from './svgBtn'
export default {
  name: 'controller',
  props: ['songId', 'playWay'],
  data() {
    return {
      autoplay: true,
      songSrc: '',
      playing: '',
      playerDom: undefined,
      volume: parseFloat(localStorage.getItem('volume')) || 0.5
    }
  },
  components: {
    svgBtn
  },
  computed: {
    playWayIcon() {
      for (var key in this.playWay) {
        if (this.playWay[key]) {
          return key
        }
      }
    },
    playingOrpause() {
      return this.playing ? 'pause' : 'play'
    }
  },
  methods: {
    play(action) {
      this.$emit('play', action)
      if (action == 'play') {
        let _pause=!!this.playerDom.paused
        if (this.playerDom.paused) {
          this.playerDom.play();
        } else {
          this.playerDom.pause()
        }
        this.$emit('play', _pause)
        this.$set(this, 'playing', _pause)
      }
    },   
    audioError() {
      this.$emit('canNotPlay', '歌曲加载失败，自动播放下一首')
      this.$emit('play', 'next')
    }
  },
  watch: {
    songId: function (val, oldVal) {
      this.songSrc = "//music.163.com/song/media/outer/url?id=" + val + ".mp3";
      this.playing = true
      this.$emit('play', true);
      setTimeout(() => {
        if (!!this.playerDom.error) {
          this.audioError()
        }
      }, 500)
    },
    volume: function (val) {
      this.playerDom.volume = val
      localStorage.setItem('volume', val)  
    }
  },
  mounted() {
    this.playerDom = document.getElementById('audioPlayer')
    this.playerDom.volume = this.volume; 
    this.playerDom.addEventListener('ended',()=>{
      if(this.playWay.repeatOne){
          this.playerDom.play()
      }else{
        this.$emit('play', 'next')
      }
    })
    this.playerDom.addEventListener('playing',()=>{
       this.$emit('play', 'play')
    })
    this.playerDom.addEventListener('pause',()=>{
      this.$emit('play', 'pause')
    })
     document.addEventListener('keyup',(e)=>{
      //方向键控制播放和音量
     switch (e.keyCode) {
          case 32:
            this.play('play')
          break;
          case 39:
            this.play('next')
          break;
          case 37:
            this.play('prev')
          break;
          case 38:
            this.volume=parseFloat(this.volume)>.9?1:(parseFloat(this.volume)+.1).toFixed(2);
          break;
          case 40:
            this.volume=parseFloat(this.volume)<.1?0:(parseFloat(this.volume)-.1).toFixed(2);
          break;
        }
     })
  }
}

</script>
<style>
.controller {
  position: absolute;
  z-index: 999;
  bottom: 60px;
  width: 60%;
  left: 20%;
  height: 60px;
  margin-left: -23px;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  justify-content: center;
}
.controller svg {
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  margin: 0 60px;
  opacity: .5;
  transition: opacity .3s;
  filter: drop-shadow( -1px -2px 4px rgba(0, 0, 0, .3));
  -webkit-filter: drop-shadow( -1px -2px 4px rgba(0, 0, 0, .3));
}
.controller input {
  flex: 0 0 100px;
  width: 100px;
  position: relative;
  margin-left: -100px
}
.smallIcon {
  margin: 0 !important;
}
.controller svg:hover {
  opacity: 1;
  transition: opacity .3s
}
.volumeBar {
  width: 100px;
  flex: 0;
  position: relative;
  opacity: .5;
  transition: opacity .6s
}
.volumeBar:hover {
  opacity: 1;
  transition: opacity .6s
}
.controller input[type='range'] { padding: 0; background: transparent; font: inherit;font-size: 0;position: absolute;margin-top: -2px;margin-left: 0 !important }
::-webkit-slider-thumb { -webkit-appearance: none;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  margin-top: -4px;cursor: pointer;} 
::-webkit-slider-runnable-track{  box-sizing: border-box;
  border: none;
  width: 100px;
  height: 6px; border-radius: 6px;
  background: rgba(255,255,255,.5);}


</style>
