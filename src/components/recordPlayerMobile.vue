<template> 
  <div v-if='songInfo'>
    <div class="cdStyle">
      <div :class="['blurCoverBack',{'loaded':!loaded}]" :style="playerBack"></div>
      <div class="cdBox" :style='moveStyle'  @touchstart='touchStart' @touchmove='touchMove' @touchend='toucheEnd'>
        <div class="cdLlight"></div>
        <img :src='songInfo.cover' :class="[{'cd':loaded},{'pause':!playing || touching}]" id='cd'/>
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
import controller from './controller'
export default {
  name: 'recordPlayerMobile',
  props: ['songInfo', 'cdStyle','playing'],  
  data() {
    return {
      playerBack: {
        backgroundImage: ""
      },
      loaded: false,
      songSrc: '',
      touchStartX:0,
      endX:0,
      touching:false,
      touchAction:'',
      opacity:1
    }
  },
   computed:{
    artists(){
      if(this.songInfo.artist){
        return this.songInfo.artist.map(v=> v.name).join(',')
      }
    },
    moveStyle:function(){//图标动态样式
    if(this.touching){
      return {
        transform:'translateX('+this.endX+'px)',
        //'transition-duration':'0s',
        opacity:this.opacity,
        //animation:'inherit'
      }
    }else if(this.loaded){
       return {
        transform:'translateX(0px)',
        'transition-duration':'.8s',
        opacity:1,
        //animation:'roll linear 6s infinite 2s'
      }
    }
   
     /*  let arr = new Array();
      arr.push('transform:');//注意：先移动后旋转，实现原地旋转；先旋转后移动，位置按照旋转后的新坐标系确定
      arr.push('translateX('+this.endX+'px) ');
      arr.push('translateX('+this.endX+'px) ');
      return arr.join(""); */
    }
  },
  methods:{
    initRecodPlayer(songInfo){
      this.loaded = false;
      let _img = new Image()
      _img.src = songInfo.cover
      //console.log(songInfo.cover);
      
      _img.onload = () => {        
        setTimeout(() => {
          this.loaded = true
          this.playerBack.backgroundImage = "url('" + songInfo.cover + "')"
        }, 20)
        this.songSrc = "//music.163.com/song/media/outer/url?id=" + songInfo.id + ".mp3"
      }
    },
    touchStart(e){      
      this.touching=true
      this.touchStartX = e.touches[0].clientX;     
      this.opacity=1  
      //console.log('touchStart:'+this.touchStartX);
      
    },
    touchMove(e){     
      let _dom=document.getElementById('cd') 
     this.endX = e.touches[0].clientX-this.touchStartX;
     let _opacity=1-Math.abs(this.endX/300)
     this.opacity=_opacity>0?Math.abs(_opacity).toFixed(2):0
    // console.log(Math.abs(1-Math.abs(this.endX/200)));
     
    if(this.endX>150){
      this.touchAction='next'
      //console.log('next'); 
    } 
    if(this.endX<-150){
      this.touchAction='prev'
      //console.log('prev');      
    }
      
    /*   _dom.style['-webkit-animation']='initial'
      _dom.style.animation='initial'
      _dom.style.transform='translateX('+moveX+'px)'
      _dom.style['-webkit-transform']='translateX('+moveX+'px)' */
      
    },
    toucheEnd(e){
      this.touching=false ;
      this.endX=0
      /* setTimeout(()=>{
        this.initRecodPlayer()
      },1000) */
      this.play(this.touchAction)    
    },
    play(action) {
      
      this.$emit('swipeCd', action)
      this.touchAction=''
      //this.opacity=1
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
      this.initRecodPlayer(v)
    }
  },
  created(){
    this.initRecodPlayer(this.songInfo)
  }
}

</script>
<style scoped>
.blurCoverBack{background-size: cover;top: -10vh;
  left: -10vw;
  width: 120vw;
  height: 120vh;}
.cdBox{overflow: hidden;  top: -30vh;}
.cdStyle{width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;}
.cd,.cdShadow,.cdLlight,.cdShadow{width: 100vw;height: 100vw;border-radius:50vw;min-width: inherit;min-height: inherit}
/* .vinylBack,.vinylStyle .cdLlight,.cdShadow{width: 120vw;height: 120vw;}
.vinylStyle .cd{width: 55vw;height: 55vw;min-width: inherit;min-height: inherit}
.vinylStyle .cdLlight{min-width: inherit;min-height: inherit} */
.songInfo{bottom:15vh}
.cdStyle .cd{mask:radial-gradient(transparent, transparent 14vw, rgba(255, 255, 255, .4) 14.1vw, #000 14.2vw) !important;;-webkit-mask:radial-gradient(transparent, transparent 14vw, rgba(255, 255, 255, .4) 14.1vw, #000 14.2vw) !important;}
.cdLlight{mask:radial-gradient(transparent, transparent 7vw, rgba(255, 255, 255, .4) 7.1vw, #000 7.2vw) !important;-webkit-mask:radial-gradient(transparent, transparent 7vw, rgba(255, 255, 255, .4) 7.1vw, #000 7.2vw) !important}
.cdBox::after{width: 14vw;height: 14vw;border-width: 7vw}
</style>
