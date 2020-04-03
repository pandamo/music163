<template>
  <div :class='[isMobile?"mobileList":"list",{"toggle":toggle && isMobile}]' @click='toggleShow'>
    <ul>
      <li v-for='song in sondList' :key='song.id'  @click='playThis(song.id)' :class='{playing:songId==song.id}'  :id="'s'+song.id">
        {{ song.name }} <small>{{ artists(song.artist) }}</small>
      </li>
    </ul>
  </div>
</template>
<script>
import svgBtn from './svgBtn'
export default {
  name: 'list',
  props: ['sondList', 'songId', 'isMobile', 'toggle'],
  components: { svgBtn },
  data() {
    return {
      // toggle: false
    }
  },
  methods: {
    artists(artists) {
      if (artists) {
        return ' - ' + artists.map(v => v.name).join(',')
      }
    },
    toggleShow() {
      this.$parent.toggle = !this.$parent.toggle
    },
    playThis(id) {
      this.$emit('changeSong', id)
    },
    autoScroll() {
      // 列表滚动到歌曲名称
      this.$nextTick(() => {
        // vue的$refs不保证已经渲染完，采用获取DOM方式
        document
          .getElementById('s' + this.songId)
          .scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
    }
  },
  watch: {
    songId: function(val, oldVal) {
      this.autoScroll()
    }
  },
  created() {}
}
</script>
<style>
.list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: -1px;
  width: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.list,
.list li {
  -webkit-user-select: none;
  padding: 0;
  margin: 0;
  list-style: none;
}
.list svg {
  display: none;
  width: 10vw;
  height: 10vw;
  flex: 0 0 10vw;
}
.list li,
.mobileList li {
  white-space: nowrap;
  word-break: keep-all;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 0.3em 1em;
}
.list li:hover,
.list li:active {
  background-color: rgba(0, 0, 0, 0.2);
}
.playing {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff !important;
}

.mobileList svg {
  display: block;
  margin: 2vw 0 0 52vw;
  transition: margin 0.3s;
}
/* .toggle{width:100vw;left:0}
.toggle svg{margin-left: 38vw !important;transition:margin .5s;background-color: transparent}
.toggle line{opacity:0;transform: rotate(0deg)}
.toggle line:first-child{transform: rotate(45deg);transform-origin:center;transition:all .3s;  transform-box: fill-box;opacity:1}
.toggle line:last-child{transform: rotate(-45deg);transform-origin:center;transition:all .3s;  transform-box: fill-box;opacity:1} */
.mobileList {
  position:fixed;
  width: 100vw;
  left: 0;
  top: 100vh;
  bottom: 0;
  /* transform: translateY(100vh); */
  z-index: 9999;
  overflow: hidden;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0) !important;
  box-shadow: none !important;
  transition: opacity 0.3s ease-in-out;
}

.mobileList ul {
  position: fixed;
  top: 0;
  height: 70vh;
  width: 100vw;
  transform: translateY(100vh);
  overflow: auto;
  background-color: #fff;
  border-radius: 5vw 5vw 0 0;
  left: 0;
  right: 0;
  padding: 5vw 3vw;
  transition: transform 0.5s ease-in;
}

.mobileList.toggle {
  top: 0;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.7) !important;
  transition: opacity 0.3s ease-in-out;
}
.toggle ul {
  transition: transform 0.5s ease-out;
  transform: translateY(30vh);
}

.toggle::after{display: block;}
.mobileList li {
  text-shadow: none;
  color: #222;
  padding:2vw 3vw;
}
.mobileList small {
  color: #b3b3b3;
}
.mobileList .playing {
  background-color: #efefef;
  color: initial !important;
  border-radius: 10vw;
}
</style>
