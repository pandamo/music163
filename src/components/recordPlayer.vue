<template>
  <div v-if='songInfo'>
    <div :class="[{'cdStyle':cdStyle},{'vinylStyle':!cdStyle}]">
      <div :class="['blurCoverBack',{'loaded':!loaded}]" :style="playerBack"></div>
      <div :class="['cdBox',{'cdSlideIn':loaded}]">
        <div class="vinylBack" v-if='!cdStyle'></div>
        <div class="cdLlight"></div>
        <img :src='songInfo.cover' :class="['cd',{'pause':!playing}]"/>
        <div class="cdShadow"></div>
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
  props: ['songInfo', 'cdStyle','playing'],
  computed:{
    artists(){
      if(this.songInfo.artist){
        return this.songInfo.artist.map(v=> v.name).join(',')
      }
    }
  },
  data() {
    return {
      playerBack: {
        backgroundImage: ""
      },
      loaded: false,
      songSrc: ''
    }
  },
  methods:{
    initRecodPlayer(songInfo){
      this.loaded = false;
      let _img = new Image()
      _img.src = songInfo.cover
      _img.onload = () => {        
        setTimeout(() => {
          this.loaded = true
          this.playerBack.backgroundImage = "url('" + songInfo.cover + "')"
        }, 20)
        this.songSrc = "//music.163.com/song/media/outer/url?id=" + songInfo.id + ".mp3"
      }
    }
  },
  watch: {
    songInfo: function (v, oldVal) {
      this.initRecodPlayer(v)
    }
  },
  created(){
    this.initRecodPlayer(this.songInfo)
  }
}

</script>
