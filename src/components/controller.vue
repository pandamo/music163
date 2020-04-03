<template>
  <div :class="['controller',{'mobileControll':isMobile}]">
    <audio id="audioPlayer" :src="songSrc" :autoplay="autoplay" controls="" style='display:none'></audio>
    <svgBtn  :icoName='playWayIcon' @goPlay='play(playWayIcon)' class='smallIcon' />
    <svgBtn icoName='prev' @goPlay='play("prev")' />

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class='bigIcon' @click='play("play")'>
  <path v-show='!playing' fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12v24l18-12-18-12z"/>
<path v-show='playing' fill="none" stroke="#fff" stroke-width="3" d="M18 14 v20 M30 14 v20"  stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="24" r="22" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" opacity=".3"/>
  <circle id='cc' cx="24" cy="24" r="22" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" style="transform:rotate(-90deg);transform-origin:center" stroke-dasharray='0 140' stroke-dashoffset='0'/>
</svg>
    <svgBtn icoName='next' @goPlay='play("next")' />
    <svgBtn icoName='listIcon' class='smallIcon' @goPlay='toggleList' v-if='isMobile'/>
    <div  class="volumeBar">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class='speakerIcon' @click='muteOnoff'>
        <path fill='#fff' d="M3.503 7.688H1.518a.5.5 0 0 0-.5.5v7.623a.5.5 0 0 0 .5.5h1.985a.5.5 0 0 0 .5-.5V8.188a.5.5 0 0 0-.5-.5zm9.121-3.067a.497.497 0 0 0-.477-.036L5.602 7.534a.5.5 0 0 0-.294.456v8.02c0 .196.115.375.294.456l6.545 2.949a.498.498 0 0 0 .706-.456V5.041a.499.499 0 0 0-.229-.42z" />
        <g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round">
          <path d="M14.549 9.806c.562.562.907 1.338.907 2.194 0 .858-.346 1.634-.907 2.194" v-show='speakerIconVolume[0]' />
          <path d="M16.703 7.65a6.137 6.137 0 0 1 1.8 4.349c0 1.7-.688 3.235-1.8 4.351" v-show='speakerIconVolume[1]' />
          <path d="M18.856 18.503C20.52 16.84 21.548 14.54 21.548 12s-1.028-4.839-2.692-6.503" v-show='speakerIconVolume[2]' />
        </g>
      </svg>
      <input type="range" min='0' max='1' step='.01' v-model='volume' />
    </div>
  </div>
</template>
<script>
import svgBtn from './svgBtn'
export default {
  name: 'controller',
  props: ['songId', 'playWay', 'mp3'],
  data() {
    return {
      autoplay: true,
      songSrc: '',
      playing: false,
      playerDom: undefined,
      volume: parseFloat(localStorage.getItem('volume')) || 0.5,
      volumeTmp: parseFloat(localStorage.getItem('volume')) || 0.5,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      percent: 0
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
      return [
        parseFloat(this.volume) > 0,
        parseFloat(this.volume) > 0.33,
        parseFloat(this.volume) > 0.66
      ]
    }
  },
  methods: {
    play(action) {
      this.$emit('play', action)
      if (action === 'play') {
        let _pause = !!this.playerDom.paused
        if (this.playerDom.paused) {
          this.playerDom.play()
        } else {
          this.playerDom.pause()
        }
        this.$emit('play', _pause)
        this.$set(this, 'playing', _pause)
      }
    },
    toggleList() {
      this.$parent.toggle = !this.$parent.toggle
    },
    audioError() {
      this.$emit('canNotPlay', '歌曲加载失败，自动播放下一首')
      setTimeout(() => {
        this.$emit('play', 'next')
      }, 2000)
    },
    muteOnoff() {
      this.volume = this.volume ? 0 : parseFloat(this.volumeTmp)
    },
    showProgress() {
      let percent = this.percent // 百分比
      let _line = document.getElementById('cc')
      let _r = 22 // 半径
      let perimeter = Math.PI * 2 * _r
      _line.attributes['stroke-dasharray'].value =
        '' +
        parseFloat(perimeter * percent).toFixed(2) +
        ' ' +
        parseFloat(perimeter * (1 - percent)).toFixed(2) +
        ''
      _line.attributes['stroke-width'].value = percent === 0 ? '0' : '2'
    }
  },
  watch: {
    songId: function(val, oldVal) {
      // 如果传的mp3路径直接替换播放路径
      this.songSrc = this.mp3
        ? this.mp3
        : String(val).indexOf('.mp3') > 0
          ? val
          : '//music.163.com/song/media/outer/url?id=' + val + '.mp3'
      // this.playing = true
      this.$emit('play', true)

      setTimeout(() => {
        if (this.playerDom.error) {
          this.audioError()
        }
      }, 1500)
    },
    volume: function(val) {
      this.playerDom.volume = val
      if (val !== 0) {
        this.volumeTmp = val
      }
      localStorage.setItem('volume', val)
    },
    percent: function(val) {
      this.showProgress()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.playerDom = document.getElementById('audioPlayer')
      this.playerDom.volume = this.volume
      this.playerDom.addEventListener('ended', () => {
        if (this.playWay.repeatOne) {
          this.playerDom.play()
        } else {
          this.$emit('play', 'next')
        }
      })
      this.playerDom.addEventListener('playing', () => {
        setInterval(() => {
          this.percent = parseFloat(
            (this.playerDom.currentTime / this.playerDom.duration).toFixed(2)
          )
        }, 500)
        this.$emit('play', 'play')
        this.playing = true
      })
      this.playerDom.addEventListener('pause', () => {
        this.$emit('play', 'pause')
        this.playing = false
      })
      if (!this.$parent.isMobile) {
        document.addEventListener('keyup', e => {
          // 方向键控制播放和音量
          switch (e.keyCode) {
            case 32:
              this.play('play')
              break
            case 39:
              this.percent = 0
              this.play('next')
              break
            case 37:
              this.percent = 0
              this.play('prev')
              break
            case 38:
              this.volume =
                parseFloat(this.volume) > 0.9
                  ? 1
                  : (parseFloat(this.volume) + 0.1).toFixed(2)
              break
            case 40:
              this.volume =
                parseFloat(this.volume) < 0.1
                  ? 0
                  : (parseFloat(this.volume) - 0.1).toFixed(2)
              break
          }
        })
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
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.controller svg {
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  margin: 0 60px;
  opacity: 0.5;
  border-radius: 50%;
  filter: drop-shadow(-1px -2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.6s;
}
.controller svg.bigIcon {
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
}
.controller svg:active {
  opacity: 0.8;
  transition: all 0.6s;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.controller input {
  flex: 0 0 100px;
  width: 100px;
  position: relative;
  margin-left: -100px;
}

.smallIcon {
  margin: 0 !important;
}

.volumeBar {
  flex: 0;
  position: relative;
  opacity: 0.5;
  transition: opacity 0.6s;
}

.volumeBar:hover {
  opacity: 1;
  transition: opacity 0.6s;
}

.volumeBar .speakerIcon {
  opacity: 0.5;
  position: absolute;
  margin-top: -11px;
  margin-left: -25px;
  width: 24px;
  height: 24px;
}

.controller input[type="range"] {
  cursor: pointer;
  -webkit-appearance: none;
  padding: 0;
  background: transparent;
  font: inherit;
  font-size: 0;
  position: absolute;
  margin-top: -2px;
  margin-left: 0 !important;
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
  background: rgba(255, 255, 255, 0.5);
}
.mobileControll {
  width: 100vw;
  left: 0;
  bottom: 6vh;
  height: 20vw;
  margin: 0;
  padding: 0 4vw;
}
/* .mobileControll .smallIcon, */
.mobileControll .volumeBar {
  display: none;
}
.mobileControll path {
  transition: all 0.3s;
}
.mobileControll svg {
  height: 12vw;
  margin: 0;
  width: 12vw;
  flex: 0 0 12vw;
}
.mobileControll .smallIcon {
  flex: 0 0 8vw;
  width: 8vw;
  height: 8vw;
}

.mobileControll .bigIcon {
  height: 15vw;
  flex: 0 0 15vw;
  border-width: 0.5vw;
}
</style>
