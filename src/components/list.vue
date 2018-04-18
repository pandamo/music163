<template>
    <ul class='list'>
      <li v-for='(song,index) in sondList' @click='playThis(song.id)' :class='{playing:songId==song.id}'  :id="'s'+song.id">
        {{ song.name }}
      </li>
    </ul>
</template>
<script> 
export default {
  name: 'list',
  props: ['sondList','songId'],
  data(){
    return {
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
          document.getElementById('s'+id).scrollIntoView({block: "center",behavior: "smooth"})
          //option参数兼容性一般        
        })      
    }
  },
  watch: {   
    songId:function(val,oldVal){
        this.autoScroll(val)    
    }
  }
}

</script>
<style>
.list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
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

.list li {
  width: 200px;
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

</style>
