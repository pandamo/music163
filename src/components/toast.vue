<template>
  <div :class="['toast',{'hide':!msg}]">{{msg}}</div>
</template>
<script>
export default {
  name: 'toast',
  props: ['msg'],
  data() {
    return {

    }
  }
}

</script>
<style>
.toast {
  position: absolute;
  bottom: 200px;
  right: 0;
  width: 250px;
  height: 60px;
  background-color: rgba(255, 255, 255, .1);
  color: rgba(255, 255, 255, .7);
  text-align: center;
  border-radius: 3px 0 0 3px;
  box-shadow: -2px -1px 2px rgba(0,0,0,.05);
  z-index: 999;
  line-height: 60px;
  font-size: 14px;
  transition: all .6s;
}
.hide{
	transform: translateX(250px);transition: all .6s;
}

</style>
