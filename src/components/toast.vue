<template>
  <div :class="[{'toast':!isMObile},{'hide':!show},{'mobileToast':isMObile}]" v-html='msg'></div>
</template>
<script>
export default {
  name: 'toast',
  props: ['msg'],
  data() {
    return {
      isMObile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      show: false
    }
  },
  watch: {
    'msg': function(nVal, oVal) {
      if (nVal) {
        this.show = true
        setTimeout(() => {
          this.show = false
        }, 2000)
      }
    }
  }
}

</script>
<style>
.toast {
  position: fixed;
  bottom: 200px;
  right: 0;
  padding: 30px;
  background-color: rgba(255, 255, 255, .1);
  color: rgba(255, 255, 255, .7);
  text-align: center;
  border-radius: 3px 0 0 3px;
  box-shadow: -2px -1px 2px rgba(0,0,0,.05);
  z-index: 999;
  font-size: 14px;
  transition: transform .6s;;
}
.hide{
  transform:translateX(350px);transition: transform .6s;  padding: 0 !important;
}
.mobileToast{opacity: 1;
  background-color: rgba(0,0,0,.4);
  bottom: 0;
  position: fixed;
  width: 100vw;
  text-align: center;
  z-index: 9999;
  color: #fff;
  padding: 3vw;
  transition: opacity .6s;}

.hide.mobileToast{
  opacity:0;
transition: opacity .6s;padding: 0;}

</style>
