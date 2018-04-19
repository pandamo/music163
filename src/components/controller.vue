<template>
  <div class='controller'>
    <audio :src="songSrc" id='audioPlayer' :autoplay="autoplay" style='display:none'></audio>
    <svgBtn :icoName='playWayIcon' @goPlay='play(playWayIcon)' class='smallIcon' />
    <svgBtn icoName='prev' @goPlay='play("prev")' />
    <svgBtn :icoName='playingOrpause' @goPlay='play("play")' />
    <svgBtn icoName='next' @goPlay='play("next")' />
    <div class="volumeBar">
      <div class="range" @click='setVolume'></div>
      <button :style='rangBtnStyle' @mousedown='mouseDown'></button>
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
      playing: true,
      playerDom: undefined,
      volume: parseInt(localStorage.getItem('volume'))||50,
      volumeBtnTranX: 0,
      mouseMoving:false,
      rangBtnStyle:{ transform: "translateX(50px)"},
      preVolume:parseInt(localStorage.getItem('volume'))||50
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
        if (this.playerDom.paused) {
          this.playerDom.play();
          this.$set(this, 'playing', true)
          this.$emit('play', true)
        } else {
          this.playerDom.pause()
          this.$set(this, 'playing', false)
          this.$emit('play', false)
        }
      }
    },
    setVolume(e){
      this.volume=e.offsetX
    },
    mouseDown(e) {
      this.volumeBtnTranX = e.clientX;
      this.preVolume = this.volume;
      document.onmousemove=this.mouseMove//注意document对象！！！
      document.onmouseup=this.mouseUp      
    },
    mouseMove(e) {
      let _vol = e.clientX - this.volumeBtnTranX + this.preVolume        
      if (_vol <= 100 && _vol >= 0) {
        this.volume = _vol       
      }      
    },
    mouseUp(e) {
      this.volumeBtnTranX = e.clientX;
      document.onmousemove=null
      document.onmousemove=null
      localStorage.setItem('volume',this.volume)     
    }
  },
  watch: {
    songId: function (val, oldVal) {
      this.songSrc = "//music.163.com/song/media/outer/url?id=" + val + ".mp3";
      this.playing = true
      this.$emit('play', true);
      setTimeout(()=>{
        if(!this.playerDom.duration){
          console.log('该歌曲已下架。')
          this.play('next')
        }        
      },2000)
    },
    volume: function (val) {
      let _volumValue=val/100,_btnTX=val/5
      this.rangBtnStyle.transform = "translateX(" + val + "px)"
      this.playerDom.volume = _volumValue
    }
  },
  mounted() {
    this.playerDom = document.getElementById('audioPlayer')    
    this.playerDom.volume = this.volume / 100;
    this.rangBtnStyle.transform = "translateX(" + this.volume + "px)"
    
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
.volumeBar{width: 100px;flex:0;position: relative;height: 0;opacity: .5;transition: opacity .6s}
.volumeBar:hover{opacity: 1;transition: opacity .6s}

.range {
  opacity: .5;
  height: 5px;
  width: 100px;  
  border-radius: 4px;
  position: absolute;
  background-color: #fff
}
.volumeBar button {
  cursor: pointer;
  width: 14px;
  height: 14px;
  border-radius: 14px;
  background-color:#fff;
  border: none;
  position: absolute;
  margin:-4px 0 0 -7px;
}

</style>
