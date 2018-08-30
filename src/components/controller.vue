<template>
  <div :class="['controller',{'mobileControll':isMobile}]">
    <audio :src="songSrc" id='audioPlayer' :autoplay="autoplay" controls="" style='display:none'></audio>
    <svgBtn  :icoName='playWayIcon' @goPlay='play(playWayIcon)' class='smallIcon' />
    <svgBtn icoName='prev' @goPlay='play("prev")' />
    <svgBtn :icoName='playingOrpause' @goPlay='play("play")' />
    <svgBtn icoName='next' @goPlay='play("next")' />
    <div  class="volumeBar">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class='speakerIcon' @click='muteOnoff'>
        <path fill='#fff' d="M3.503 7.688H1.518a.5.5 0 0 0-.5.5v7.623a.5.5 0 0 0 .5.5h1.985a.5.5 0 0 0 .5-.5V8.188a.5.5 0 0 0-.5-.5zm9.121-3.067a.497.497 0 0 0-.477-.036L5.602 7.534a.5.5 0 0 0-.294.456v8.02c0 .196.115.375.294.456l6.545 2.949a.498.498 0 0 0 .706-.456V5.041a.499.499 0 0 0-.229-.42z" />
        <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M18.856 18.503C20.52 16.84 21.548 14.54 21.548 12s-1.028-4.839-2.692-6.503" v-show='speakerIconVolume[2]' />
        <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M16.703 7.65a6.137 6.137 0 0 1 1.8 4.349c0 1.7-.688 3.235-1.8 4.351" v-show='speakerIconVolume[1]' />
        <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M14.549 9.806c.562.562.907 1.338.907 2.194 0 .858-.346 1.634-.907 2.194" v-show='speakerIconVolume[0]' />
      </svg>
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
      playing: false,
      playerDom: undefined,
      volume: parseFloat(localStorage.getItem('volume')) || 0.5,
      volumeTmp: parseFloat(localStorage.getItem('volume')) || 0.5,
      isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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
    },
    speakerIconVolume() {
      return [parseFloat(this.volume) > 0, parseFloat(this.volume) > .33, parseFloat(this.volume) > .66]

    }
  },
  methods: {
    play(action) {
      this.$emit('play', action)
      if (action == 'play') {
        let _pause = !!this.playerDom.paused
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
      setTimeout(()=>{
        this.$emit('play', 'next')
      },1000)
    },
    muteOnoff() {
      this.volume = this.volume ? 0 : parseFloat(this.volumeTmp)
    }
  },
  watch: {
    songId: function(val, oldVal) {
      this.songSrc = "//music.163.com/song/media/outer/url?id=" + val + ".mp3";
      //this.playing = true
      this.$emit('play', true);
      
      
      setTimeout(() => {
        if (!!this.playerDom.error) {
          this.audioError()
        }
      }, 1500)
    },
    volume: function(val) {
      this.playerDom.volume = val
      if (val != 0) {
        this.volumeTmp = val
      }
      localStorage.setItem('volume', val)
    }
  },
  mounted() {
    this.playerDom = document.getElementById('audioPlayer')
    this.playerDom.volume = this.volume;
    this.playerDom.addEventListener('ended', () => {
      if (this.playWay.repeatOne) {
        this.playerDom.play()
      } else {
        this.$emit('play', 'next')
      }
    })
    this.playerDom.addEventListener('playing', () => {
      this.$emit('play', 'play')
      this.playing = true
    })
    this.playerDom.addEventListener('pause', () => {
      this.$emit('play', 'pause')
      this.playing = false
    })
    document.addEventListener('keyup', (e) => {
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
          this.volume = parseFloat(this.volume) > .9 ? 1 : (parseFloat(this.volume) + .1).toFixed(2);
          break;
        case 40:
          this.volume = parseFloat(this.volume) < .1 ? 0 : (parseFloat(this.volume) - .1).toFixed(2);
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
  transition: opacity .6s
}

.controller svg:hover {
  opacity: .8;
  transition: opacity .3s
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

.volumeBar {
  flex: 0;
  position: relative;
  opacity: .5;
  transition: opacity .6s
}

.volumeBar:hover {
  opacity: 1;
  transition: opacity .6s
}

.volumeBar .speakerIcon {
  opacity: .5;
  position: absolute;
  margin-top: -11px;
  margin-left: -25px;
}

.controller input[type='range'] {
  cursor: pointer;
  -webkit-appearance: none;
  padding: 0;
  background: transparent;
  font: inherit;
  font-size: 0;
  position: absolute;
  margin-top: -2px;
  margin-left: 0 !important
}

::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  margin-top: -4px;
}

::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-sizing: border-box;
  border: none;
  width: 100px;
  height: 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, .5);
}
.mobileControll{width: 100vw;left: 0;bottom:2vh;height: 20vw;margin: 0}
.mobileControll .smallIcon,.mobileControll .volumeBar{display: none;}
.mobileControll svg{flex: 0 0 10vw;
  height: 10vw;
  margin: 0 11vw;
  width: 10vw;}
</style>
