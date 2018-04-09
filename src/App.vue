<template>
  <div id="app"> 
    <list :playList='playList'/>
    <player :songInfo='playList[playSongId]'/>
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
      playList: [],
      playSongId:0,
      listId:location.search.split('=')[1]?location.search.split('=')[1]:53208352
    }
  },
  mothods:{
    playSong(index){
      console.log()
    }
  },
  mounted () {

    this.$http.get(this.api+this.listId).then((resp)=>{
      //console.log(resp.data.playlist.tracks)
      this.playList= resp.data.playlist.tracks.map((v,i)=>{
        const  {id,name,al,dt}=v //al专辑信息，dt歌曲时长
        return {id:id,name:name,cover:al.picUrl,length:dt}
      })
    })
  }
}
</script>
<style>
  * { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-box-sizing: border-box; box-sizing: border-box; }
html,body { width: 100%; height: 100%;}
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
</style>

