<template>
  <div>
    <div :class="['blurCoverBack',{'loaded':!loaded}]" :style="playerBack"></div>
    <div :class="['cdBox',{'cdSlideIn':loaded}]">
      <img :src='songInfo.cover' class="cd" />
      <div class="light"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'player',
  props: ['songInfo'],
  data() {
    return {
      playerBack: {
        backgroundImage: ""
      },
      loaded: false
    }
  },
  created() {

  },
  mounted() {

  },
  watch: {
    songInfo: function (v, oldVal) {
      this.loaded = false
      let _img = new Image()
      _img.src = v.cover
      _img.onload = () => {
        setTimeout(() => {
          this.loaded = true
          this.playerBack.backgroundImage = "url('" + v.cover + "')"
        }, 500)

      }
    }
  }
}

</script>
<style>
.blurCoverBack {
  background-repeat: no-repeat;
  background-size: 150% auto;
  background-position: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  -webkit-filter: blur(20px);
  -moz-filter: blur(20px);
  -ms-filter: blur(20px);
  filter: blur(20px);
  opacity: .7;
  transition: opacity .6s ease-in;
}
.cdBox {
  transform:translateY(1800px);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loaded {
  opacity: 0;
  transition: opacity .3s
}
.cdSlideIn{
   -webkit-animation: slideUp ease-in-out .6s forwards  ;
  animation: slideUp ease-in-out .6s forwards ; 
}
.cd {
  width: 500px;
  height: 500px;
  margin: -100px 0 0 100px;
  border-radius: 500px;
  position: relative;
  
  -webkit-mask: radial-gradient(transparent, transparent 70px, rgba(255, 255, 255, .4) 72px, #000 72px);
  mask: radial-gradient(transparent 70px, rgba(255, 255, 255, .4) 72px, #000 72px);
}
.cdSlideIn .cd{ -webkit-animation: roll linear 30s infinite 1s;
  animation: roll linear 30s infinite 1s; }
.cdBox::before{
   margin: -300px 0 0 -200px;
  left: 50vw;
  top: 50vh;
  content: ''; width: 500px;height: 500px; border-radius: 500px; box-shadow: 0 0 20px rgba(0,0,0,.5);position: absolute; 
}
.cdBox::after{
    margin: -121px 0 0 -21px;
  left: 50vw;
  top: 50vh;
  content: '';
  width: 72px;
  height: 72px;
  border-radius: 500px;
  -webkit-box-shadow: 0 0 20px rgba(0,0,0,.5) inset;
  box-shadow: 0 0 20px rgba(0,0,0,.5) inset;
  position: absolute;
  border: 35px solid rgba(255,255,255,.1);
}
.light {  
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 500px;
  margin: -100px 0 0 -500px;
  -webkit-mask: radial-gradient(transparent, transparent 35px, rgba(255, 255, 255, .4) 37px, #000 37px);
  mask: radial-gradient(transparent 70px, rgba(255, 255, 255, .4) 72px, #000 72px);
  box-shadow: 0 0 2px rgba(255, 255, 255, .5) inset;
  background: -moz-linear-gradient(-75deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50.1%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-linear-gradient(-75deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50.1%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(105deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50.1%, rgba(255, 255, 255, 0) 100%);
}

@keyframes roll {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes roll {
  0% {
    -webkit-transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes slideUp {
  0% {
    transform:translateY(1800px);
  }
  100% {
    transform:translateY(0);
  }
}
@-webkit-keyframes slideUp {
  0% {
    -webkit-transform:translateY(1800px);
  }
  100% {
    -webkit-transform:translateY(0);
  }
}

</style>
