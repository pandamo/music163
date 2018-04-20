<template>
	<button :class="['recordStyle',{'cdIcon':!cdStyle},{'vinylIcon':cdStyle}]" @click='changeStyle'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <circle class='outer' fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" cx="16" cy="16" r="14" />
        <circle class='inner' fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" cx="16" cy="16" r="4" />
        <path class='light' d="M13 5a11.4 11.4 0 0 1 11.2 2.9m-1.8 1.8a9 9 0 0 0-8.8-2.4m.7 2.4a6.5 6.5 0 0 1 6.3 1.7M19 27a11.4 11.4 0 0 1-11.2-2.9m1.8-1.8a9 9 0 0 0 8.8 2.4m-.7-2.4a6.5 6.5 0 0 1-6.3-1.7" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" />
        <circle class='vinylInner' fill="#000" cx="16" cy="16" r="1.3" />
      </svg>
    </button>
</template>

<script>
export default {
  name: 'changeRecordStyleBtn',
  props:['cdStyle'],
  methods:{
  	changeStyle(){
  		this.$emit('changeFromBtn')
  	}
  }
}
</script>

<style>
.recordStyle {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 64px;
  height: 64px;
  background-color: #fff;
  z-index: 999;
  background-color: transparent;
  border-radius: 48px;
  background-size: 100% auto;
  border: none;
  cursor: pointer;
  opacity: .3;
  transition: opacity .6s
}
.recordStyle:hover{opacity: 1;}
.cdIcon svg {
  width: 50%;
  height: 50%;
  transition: all .3s;
  -webkit-filter: drop-shadow( -2px -1px 4px rgba(0, 0, 0, .3));
  filter: drop-shadow( -2px -1px 4px rgba(0, 0, 0, .3));
}
.vinylIcon svg {
  width: 100%;
  height: 100%;
  transition: all .3s;
  -webkit-filter: drop-shadow( -2px -1px 4px rgba(255, 255, 255, .3));
  filter: drop-shadow( -2px -1px 4px rgba(255, 255, 255, .3));
}
.vinylIcon .outer {
  fill: #000;
  stroke: #000;
}
.vinylIcon .inner {
  fill: #fff;
  stroke: #fff;
}
.vinylIcon .light {}
.vinylIcon .vinylInner {
  opacity: 1;
}
.cdIcon .vinylInner {
  opacity: 0;
}
</style>