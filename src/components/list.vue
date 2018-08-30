<template>
  <div :class='["list",{"mobileList":isMobile},{"toggle":toggle}]'>
    <svgBtn icoName='listIcon' @click.native='toggle=!toggle'/>
    <ul>
      <li v-for='song in sondList' :key='song.id'  @click='playThis(song.id)' :class='{playing:songId==song.id}'  :id="'s'+song.id">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>
<script> 
import svgBtn from './svgBtn'
export default {
  name: 'list',
  props: ['sondList','songId','isMobile'],
  components:{svgBtn},
  data(){
    return {
      toggle:false
    }
  },
  methods: {
    playThis(id) {
      this.$emit('changeSong',id)
    },
    autoScroll(id){
    //列表滚动到歌曲名称 
        this.$nextTick(()=>{
          //vue的$refs不保证已经渲染完，采用获取DOM方式
          if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){

            document.getElementById('s'+id).scrollIntoView({block: "center",behavior: "smooth"})
          }
          //option参数兼容性一般        
        })      
    }
  },
  watch: {   
    songId:function(val,oldVal){
        this.autoScroll(val)    
    }
  },
  created(){
      
  }
}

</script>
<style>
.toggle{margin-left: 0 !important;transition:margin .3s}
.list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: -1px;
  width: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 999;
  background-color: rgba(255, 255, 255, .05); box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  
}

.list, .list li {
  -webkit-user-select: none;
  padding: 0;
  margin: 0;
  list-style: none;
}
.list svg{display: none;width: 10vw;height: 10vw; flex:0 0 10vw}
.list li {
  white-space: nowrap;
  word-break: keep-all;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  text-shadow:-1px -1px 1px rgba(0, 0, 0, .5);
  color: rgba(255,255,255,.7);
  font-size: 14px;
  padding: .3em 1em;
}
.list li:hover, .list li:active {
  background-color: rgba(0, 0, 0, .2)
}
.playing {
  background-color: rgba(255, 255, 255, .2);  
  color: #fff !important;
}
.mobileList{width: 50vw;height:100vh;display: flex;flex-direction: column;overflow: visible;margin-left: -50vw;transition:margin .3s;
background-color: rgba(0,0,0,.8);z-index: 9999;}
.mobileList ul{width: 50vw;flex: 1;overflow: auto;padding-bottom: 5vw;}
.mobileList svg{display: block;  margin:2vw 0 0 52vw;transition:margin .3s;}
.toggle svg{margin-left: 38vw !important;transition:margin .5s;background-color: transparent}
.toggle line{opacity:0;transform: rotate(0deg)}
.toggle line:first-child{transform: rotate(45deg);transform-origin:center;transition:all .3s;  transform-box: fill-box;opacity:1}
.toggle line:last-child{transform: rotate(-45deg);transform-origin:center;transition:all .3s;  transform-box: fill-box;opacity:1}

</style>
