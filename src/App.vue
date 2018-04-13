<template>
  <div id="app"> 
    <!-- 左边播放列表 -->
    <list :playList='playList'/>

    <!-- 唱片 -->
    <player :songInfo='playList[playSongId]' :isCD='isCD'/>

    <!-- 唱片样式切换 -->
    <button :class="['recordStyle',{'cdIcon':isCD},{'vinylIcon':!isCD}]" @click='isCD=!isCD'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <circle class='outer' fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" cx="16" cy="16" r="14"/>
        <circle class='inner' fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" cx="16" cy="16" r="4"/>
        <path class='light' d="M13 5a11.4 11.4 0 0 1 11.2 2.9m-1.8 1.8a9 9 0 0 0-8.8-2.4m.7 2.4a6.5 6.5 0 0 1 6.3 1.7M19 27a11.4 11.4 0 0 1-11.2-2.9m1.8-1.8a9 9 0 0 0 8.8 2.4m-.7-2.4a6.5 6.5 0 0 1-6.3-1.7" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10"/>
        <circle class='vinylInner' opacity='0' fill="#000" cx="16" cy="16" r="1.3"/>
      </svg>
    </button>
    
  </div>
</template>

<script>

import list from './components/list'
import player from './components/player'

export default {
  name: 'App',
  components: {
    list,player
  },
  data() {
    return {
      api:'https://bird.ioliu.cn/netease/playlist?id=',
      staticApi:'../static/demoData.json',
      playList: [],
      playSongId:2,
      listId:location.search.split('=')[1]?location.search.split('=')[1]:53208352,
      isCD:true,//true:false
      randomPlay:true,
      randomPlayList:[]
    }
  },
  methods:{
    shuffle(arr){
      let m = arr.length, i;
        while (m) {
        i = (Math.random() * m--) >>> 0;
        [arr[m], arr[i]] = [arr[i], arr[m]]
        }
        return arr;
    }
  },
  mounted () {
    this.$http.get(this.api+this.listId,{ timeout: 1000 }).then((resp)=>{
      //console.log(resp.data.playlist.tracks)
      this.playList= resp.data.playlist.tracks.map((v,i)=>{
        const  {id,name,al,dt}=v //al专辑信息，dt歌曲时长
        return {id:id,name:name,cover:al.picUrl,length:dt}
      })
    }).catch((error)=>{
      //bird.ioliu.cn的接口挂了.....调用静态接口
      this.$http.get(this.staticApi).then((resp)=>{
        this.playList= resp.data;
        if(this.randomPlay){
          this.randomPlayList=this.shuffle([...resp.data]);
        }
      })
    })
  }
}
</script>
<style>
  * { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-box-sizing: border-box; box-sizing: border-box; }
html,body { width: 100%; height: 100%;overflow: hidden;}
body {-webkit-overflow-scrolling: touch; -webkit-font-smoothing: antialiased;
  font: 12px/1.5 Microsoft YaHei,tahoma,arial,Hiragino Sans GB,\\5b8b\4f53,sans-serif;background-color: #000;
  color: #666;}
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td, hr, button, article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section, sumary { margin: 0; padding: 0; }
input, select, textarea { border: 0; -webkit-appearance: none; appearance: none;outline: none; border-radius: 0; }
ol, ul { list-style: none; }
img, a { -webkit-touch-callout: none; }
a, a:active, a:hover { text-decoration: none; }
a, button, input, textarea { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }
p{text-align:justify;text-justify:inter-ideograph;}
:focus {outline: 0;}
img,embed,object,video{ max-width: 100%; }
.recordStyle{position: absolute;right: 20px;top: 20px;width: 64px;height: 64px;background-color: #fff;z-index: 999;background-color: transparent;border-radius: 48px; background-size: 100% auto;border: none; cursor: pointer;}
.recordStyle svg{}
.cdIcon svg{width: 50%;height: 50%; transition: all ease-in-out .3s;-webkit-filter: drop-shadow( -2px -1px 4px rgba(0,0,0,.3) ); filter: drop-shadow( -2px -1px 4px rgba(0,0,0,.3) );}
.vinylIcon svg{width: 100%;height: 100%; transition: all ease-in-out .3s;-webkit-filter: drop-shadow( -2px -1px 4px rgba(255,255,255,.3) ); filter: drop-shadow( -2px -1px 4px rgba(255,255,255,.3) );}
.vinylIcon .outer{ fill:#000; stroke:#000;}
.vinylIcon .inner{ fill:#fff;stroke:#fff; }
.vinylIcon .light{ }
.vinylIcon .vinylInner{ opacity:1; }

</style>

