<template>
<div v-show='songInfo' class="mobilePLayer">
  <div class="cdStyle">
    <div :class="['blurCoverBack',{'loaded':!loaded}]" :style="playerBack"></div>
    <div class="cdBox" :style='moveStyle' @touchstart='touchStart' @touchmove='touchMove' @touchend='toucheEnd'>
      <div class="cdLlight"></div>
      <div  :class="[{'cdShadow':loaded},{'pause':!playing || touching}]" ></div>
      <img :src='cover' :class="[{'cd':loaded},{'pause':!playing || touching}]" id='cd' />
    </div>
  </div>
  <div class="songInfo">
    <div>{{songInfo.name}}</div>
    <div><span>{{artists}}</span></div>
  </div>
</div>
</template>

<script>
// import controller from './controller'
export default {
  name: 'recordPlayerMobile',
  props: ['songInfo', 'cdStyle', 'playing'],
  data() {
    return {
      playerBack: {
        backgroundImage: ''
      },
      loaded: false,
      songSrc: '',
      touchStartX: 0,
      endX: 0,
      touching: false,
      touchAction: '',
      opacity: 1,
      cover: ''
    }
  },
  computed: {
    artists() {
      if (this.songInfo.artist) {
        return this.songInfo.artist.map(v => v.name).join(',')
      }
    },
    moveStyle: function () {
      // 图标动态样式
      if (this.touching) {
        return {
          transform: 'translateX(' + this.endX + 'px)',
          // 'transition-duration':'0s',
          opacity: this.opacity
          // animation:'inherit'
        }
      } else if (this.loaded) {
        return {
          transform: 'translateX(0px)',
          'transition-duration': '.8s',
          opacity: 1
          // animation:'roll linear 6s infinite 2s'
        }
      }

      /*  let arr = new Array();
      arr.push('transform:');//注意：先移动后旋转，实现原地旋转；先旋转后移动，位置按照旋转后的新坐标系确定
      arr.push('translateX('+this.endX+'px) ');
      arr.push('translateX('+this.endX+'px) ');
      return arr.join(""); */
    }
  },
  methods: {
    initRecodPlayer(songInfo) {
      this.loaded = false
      let _img = new Image()
      let _src = songInfo.cover + '?param=400y400'
      _img.src = _src
      // console.log('_img.src: ', _img.src)
      this.songSrc = '//music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3'
      _img.onload = () => {
        this.loaded = true
        setTimeout(() => {
          this.playerBack.backgroundImage = "url('" + _src + "')"
          this.cover = _src
        }, 20)
      }
    },
    touchStart(e) {
      
      this.touchStartX = e.touches[0].clientX
      this.opacity = 1
      // console.log('touchStart:'+this.touchStartX);
    },
    touchMove(e) {
      this.touching = true
      // let _dom = document.getElementById('cd')
      this.endX = e.touches[0].clientX - this.touchStartX
      let _opacity = 1 - Math.abs(this.endX / 300)
      this.opacity = _opacity > 0 ? Math.abs(_opacity).toFixed(2) : 0
      // console.log(Math.abs(1-Math.abs(this.endX/200)));

      if (this.endX > 120) {
        this.touchAction = 'prev'
        // console.log('next');
      }
      if (this.endX < -120) {
        this.touchAction = 'next'
        // console.log('prev');
      }

      /*   _dom.style['-webkit-animation']='initial'
      _dom.style.animation='initial'
      _dom.style.transform='translateX('+moveX+'px)'
      _dom.style['-webkit-transform']='translateX('+moveX+'px)' */
    },
    toucheEnd(e) {
      this.touching = false
      this.endX = 0
      /* setTimeout(()=>{
        this.initRecodPlayer()
      },1000) */
      this.play(this.touchAction)
    },
    play(action) {
      this.$emit('swipeCd', action)
      this.touchAction = ''
      // this.opacity=1
      /* if (action == 'play') {
        let _pause = !!this.playerDom.paused
        if (this.playerDom.paused) {
          this.playerDom.play();
        } else {
          this.playerDom.pause()
        }
        this.$emit('play', _pause)
        this.$set(this, 'playing', _pause)
      } */
    }
  },
  watch: {
    songInfo: function (v, oldVal) {
      console.log('songInfo: ', v)
      this.initRecodPlayer(v)
    }
  },
  created() {
    this.initRecodPlayer(this.songInfo)
  }
}
</script>

<style scoped>
.mobilePLayer .cdBox {
  width: 100vw;
  height: 100vw;
  border-radius: 50%;
  top: 5vh;
  box-shadow: -2vw -1vw 5vw rgba(0,0,0,.3);
}
.cdStyle{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.cd,
.cdShadow,
.cdLlight,
.cdShadow {
  width: 100vw;
  height: 100vw;
  border-radius: 50vw;
  min-width: inherit;
  min-height: inherit;
  mask: radial-gradient(transparent, transparent 14vw, rgba(255, 255, 255, 0.4) 14.1vw, #000 14.2vw);
}

/* .vinylBack,.vinylStyle .cdLlight,.cdShadow{width: 120vw;height: 120vw;}
.vinylStyle .cd{width: 55vw;height: 55vw;min-width: inherit;min-height: inherit}
.vinylStyle .cdLlight{min-width: inherit;min-height: inherit} */
.songInfo {
  top: 122vw;
}

.cdStyle .cd {
    padding: .5vw;
  mask: radial-gradient(transparent,
      transparent 16vw,
      rgba(255, 255, 255, 0.4) 16.1vw,
      #000 16.2vw) !important;
  
}

.cdLlight {
  mask: radial-gradient(transparent,
      transparent 7vw,
      rgba(255, 255, 255, 0.4) 7.1vw,
      #000 7.2vw) !important;
  -webkit-mask: radial-gradient(transparent,
      transparent 7vw,
      rgba(255, 255, 255, 0.4) 7.1vw,
      #000 7.2vw) !important;
}

.cdBox::after {
  width: 14vw;
  height: 14vw;
  border-width: 7vw;
}
</style>
