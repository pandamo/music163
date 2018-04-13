<template>
  <div id="wrapper">
    <ul class='list' id="scroller">
      <li v-for='(song,index) in playList' @dblclick='changeSong(index)' :class='{playing:$parent.playSongId==index}'>
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>
<script>
require(['jroll']);
export default {
  name: 'list',
  props: ['playList'],
  methods: {
    changeSong(index) {
      this.$parent.playSongId = index
    }
  },
  mounted() {},
  watch: {
    playList: function (val, oldVal) {
        setTimeout(() => {
          let _jr = document.getElementById('wrapper')
          new JRoll("#wrapper", { scrollBarY: true, scrollBarFade: true })
        }, 500)
    }
  }
}

</script>
<style>
#wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  overflow: hidden;
  z-index: 999;
  background-color: rgba(255, 255, 255, .05); box-shadow: 0 0 10px rgba(0, 0, 0, .1);
}
.list, .list li {
  -webkit-user-select: none;
  padding: 0;
  margin: 0;
  list-style: none;
}
.list {
  width: 200px;
  position: fixed;
 
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
  background-color: rgba(255, 255, 255, .1)
}
.playing {
  background-color: rgba(255, 255, 255, .2);  
  color: #fff !important;
}

</style>
