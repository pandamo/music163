<template>
  <div :class="['toast',{'hide':!msg},{'mobileToast':isMObile}]" v-html='msg'></div>
</template>
<script>
export default {
  name: 'toast',
  props: ['msg'],
  data() {
    return {
      isMObile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}

</script>
<style>
.toast {
  position: absolute;
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
	transform: translateX(350px);transition: transform .6s;  padding: 0 !important;
}
.mobileToast{bottom: 25vh;padding:3vw;left: 0;	transform: translateX(0);transition: transform .6s; }
.hide.mobileToast{transform: translateX(100vw) !important;}

</style>
