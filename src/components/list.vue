<template>
<div id="wrapper">  
  <ul class='list' id="scroller">
    <li v-for='(song,index) in playList' @click='changeSong(index)' :class='{playing:$parent.playSongId==index}'>
      {{ song.name }}
    </li>
  </ul>
</div>
</template>
<script>


export default {
  name: 'list',
  props:['playList'],  
  methods:{
    changeSong(index) {
      this.$parent.playSongId=index
    }
  },
  mounted() {
    
    //var JRoll = require('jroll');
   // new JRoll("#jroll")
  },
  watch:{
    playList:function(val,oldVal){
      require(['jroll'], function(JRoll) {
       setTimeout(()=>{
        let _jr=document.getElementById('wrapper')
        new JRoll("#wrapper", {scrollBarY:true,scrollBarFade:true})
       },500)
    });
    }
  }
}
</script>
<style>
#wrapper{position: absolute;top: 0;bottom: 0;left: 0;width: 200px; overflow: hidden;z-index: 999; background-color:rgba(0,0,0,.2);}
  .list,.list li{padding: 0;margin: 0;list-style: none;}
  .list{width: 200px; position: fixed;box-shadow: 0 0 10px rgba(0,0,0,.3);}
  .list li{width: 200px;white-space:nowrap;word-break:keep-all;text-overflow: ellipsis; overflow: hidden; padding-right: 2em; cursor: pointer;text-shadow: 0 1px 1px rgba(0,0,0,.8);color: #fff;font-size: 16px;padding:.3em 1em;}
  .list li:hover,.list li:active{background-color: rgba(0,0,0,.3)}
  .playing{background-color: rgba(255,255,255,.2)}
</style>
