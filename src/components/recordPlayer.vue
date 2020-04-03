<template>
  <div v-if='songInfo'>
    <div :class="[{'cdStyle':cdStyle},{'vinylStyle':!cdStyle}]">
      <div :class="['blurCoverBack',{'loaded':!loaded}]" :style="playerBack"></div>
      <div :class="['cdBox',{'cdSlideIn':loaded}]">
        <div class="vinylBack" v-if='!cdStyle'></div>
         <div  :class="[{'cdShadow':loaded},{'pause':!playing}]" ></div>
        <div class="cdLlight"></div>
        <img :src='cover' :class="['cd',{'pause':!playing}]"/>
      </div>
    </div>
    <div class="songInfo">
      <div>{{songInfo.name}}</div>
      <div><span>{{artists}}</span></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'recordPlayer',
  props: ['songInfo', 'cdStyle', 'playing'],
  computed: {
    artists() {
      if (this.songInfo.artist) {
        return this.songInfo.artist.map(v => v.name).join(',')
      }
    }
  },
  data() {
    return {
      playerBack: {
        backgroundImage: ''
      },
      loaded: false,
      songSrc: '',
      cover: ''
    }
  },
  methods: {
    initRecodPlayer(songInfo) {
      this.loaded = false
      let _img = new Image()
      let _src = songInfo.cover + '?param=800y800'
      _img.src = _src
      this.songSrc = '//music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3'
      _img.onload = () => {
        setTimeout(() => {
          this.playerBack.backgroundImage = "url('" + _src + "')"
          this.cover = _src
          this.loaded = true
        }, 20)
      }
    }
  },
  watch: {
    songInfo: function(v, oldVal) {
      this.initRecodPlayer(v)
    }
  },
  created() {
    this.initRecodPlayer(this.songInfo)
  }
}
</script>
