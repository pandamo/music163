<template>
  <div v-if='songInfo'>
    <div :class="[{'cdStyle':isCD},{'vinylStyle':!isCD}]">
      <div :class="['blurCoverBack',{'loaded':!loaded}]" :style="playerBack"></div>
      <div :class="['cdBox',{'cdSlideIn':loaded}]">
        <div class="vinylBack" v-if='!isCD'></div>
        <img :src='songInfo.cover' :class="['cd',{'pause':!playing}]"/>
        <div class="cdLlight"></div>
        <div class="cdShadow"></div>
      </div>
    </div>   
    <div class="songInfo">
      <div>{{songInfo.name}}</div>
      <div><span v-for='artist in songInfo.artist'>{{artist.name}}</span></div>
    </div>     
  </div>
</template>
<script>
import controller from './controller'
export default {
  name: 'recordPlayer',
  props: ['songInfo', 'isCD','playing'],
  components:{
    controller
  },
  data() {
    return {
      playerBack: {
        backgroundImage: ""
      },
      loaded: false,
      songSrc: ''
    }
  },
  watch: {
    songInfo: function (v, oldVal) {
      this.loaded = false;
      let _img = new Image()
      _img.src = v.cover
      _img.onload = () => {
        setTimeout(() => {
          this.loaded = true
          this.playerBack.backgroundImage = "url('" + v.cover + "')"
        }, 20)
        this.songSrc = "//music.163.com/song/media/outer/url?id=" + v.id + ".mp3"
      }
    }
  }
}

</script>
<style>
.blurCoverBack {
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center;
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  bottom: 0;
  left: -10%;
  right: 0;
  z-index: 1;
  -webkit-filter: blur(20px);
  -moz-filter: blur(20px);
  -ms-filter: blur(20px);
  filter: blur(20px);
  opacity: .7;
  transition: opacity 2s ease-in;
}
.cdBox {
  transform: translateY(1800px);
  position: absolute;
  top: -300px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}
.songInfo{  position: absolute;
  bottom: 160px;
  text-align: center;
  left: 200px;
  right: 200px;
  font-size: 20px;
  z-index: 999;
  color: #fff;
  text-shadow: -1px -1px 3px rgba(0,0,0,.3);}
.songInfo span{font-size: 80%;display: inline-block;margin:0 20px;color: #ddd}
.vinylBack, .vinylStyle .cdShadow {
  background-size: 800px auto;
  width: 800px;
  height: 800px;
  position: absolute;
}
.vinylStyle .cd {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3e %3cpath fill='#0e0e0e' d='M569.05 37.48C368.83-55.9 130.85 30.74 37.48 230.95c-93.37 200.23-6.74 438.22 193.47 531.58 200.22 93.36 438.2 6.74 531.57-193.47 93.37-200.22 6.74-438.22-193.47-531.58zM400 600.5c-110.73 0-200.5-89.76-200.5-200.5 0-110.73 89.77-200.5 200.5-200.5S600.5 289.27 600.5 400c0 110.74-89.77 200.5-200.5 200.5z'/%3e %3cpath opacity='.1' fill='none' stroke='%23C9C9C9' stroke-width='.5' stroke-miterlimit='10' d='M798 394.02c0 220.91-179.09 400-400 400-218.7 0-396-177.3-396-396C2 181.5 177.52 5.98 394.04 5.98c214.35 0 388.12 173.77 388.12 388.12 0 212.2-172.03 384.24-384.24 384.24-210.08 0-380.4-170.31-380.4-380.4 0-207.98 168.61-376.59 376.6-376.59 205.9 0 372.82 166.92 372.82 372.83 0 203.84-165.25 369.1-369.1 369.1-201.8 0-365.4-163.6-365.4-365.41 0-199.8 161.96-361.76 361.75-361.76 197.8 0 358.14 160.35 358.14 358.14 0 195.81-158.74 354.55-354.56 354.55-193.85 0-351-157.15-351-351 0-191.92 155.57-347.5 347.5-347.5 190 0 344.02 154.02 344.02 344.02 0 188.1-152.49 340.58-340.59 340.58-186.21 0-337.17-150.96-337.17-337.17 0-184.36 149.45-333.8 333.8-333.8 182.51 0 330.47 147.95 330.47 330.46 0 180.68-146.48 327.16-327.16 327.16-178.88 0-323.9-145.01-323.9-323.9 0-177.08 143.57-320.64 320.66-320.64 175.32 0 317.44 142.12 317.44 317.44 0 173.57-140.7 314.27-314.27 314.27-171.83 0-311.13-139.3-311.13-311.13 0-170.1 137.9-308.01 308.02-308.01 168.41 0 304.94 136.52 304.94 304.93 0 166.73-135.16 301.9-301.89 301.9-165.06 0-298.87-133.82-298.87-298.88 0-163.4 132.47-295.88 295.88-295.88 161.78 0 292.92 131.15 292.92 292.93 0 160.15-129.83 289.99-289.99 289.99-158.56 0-287.09-128.54-287.09-287.1 0-156.97 127.25-284.22 284.22-284.22 155.4 0 281.38 125.98 281.38 281.38 0 153.85-124.72 278.57-278.57 278.57-152.3 0-275.77-123.47-275.77-275.78 0-150.79 122.23-273.02 273.02-273.02 149.27 0 270.29 121.01 270.29 270.29 0 147.78-119.8 267.59-267.59 267.59-146.3 0-264.91-118.6-264.91-264.92 0-144.84 117.42-262.26 262.26-262.26 143.4 0 259.64 116.24 259.64 259.64 0 141.96-115.08 257.05-257.04 257.05-140.55 0-254.48-113.94-254.48-254.48 0-139.14 112.8-251.93 251.93-251.93 137.75 0 249.41 111.67 249.41 249.41 0 136.37-110.55 246.92-246.91 246.92-135 0-244.45-109.45-244.45-244.45 0-133.65 108.35-242 242-242 132.32 0 239.58 107.26 239.58 239.58 0 131-106.19 237.19-237.18 237.19-129.69 0-234.82-105.13-234.82-234.82 0-128.39 104.08-232.46 232.47-232.46 127.1 0 230.14 103.03 230.14 230.14 0 125.83-102 227.84-227.84 227.84-124.57 0-225.56-100.99-225.56-225.56 0-123.33 99.98-223.31 223.3-223.31 122.1 0 221.08 98.98 221.08 221.07 0 120.88-97.99 218.86-218.87 218.86-119.66 0-216.67-97-216.67-216.67 0-118.47 96.04-214.5 214.5-214.5 117.3 0 212.37 95.07 212.37 212.36 0 116.1-94.13 210.23-210.24 210.23-114.95 0-208.13-93.18-208.13-208.13 0-113.8 92.25-206.06 206.05-206.06 112.66 0 204 91.33 204 204 0 111.53-90.42 201.95-201.96 201.95-110.42 0-199.93-89.51-199.93-199.94'/%3e %3cpath opacity='1' fill='none' stroke='black' stroke-miterlimit='10' d='M795 394.1c0 218.13-176.84 394.97-394.98 394.97C184.07 789.07 9 614 9 398.04c0-213.8 173.32-387.1 387.12-387.1 211.65 0 383.24 171.57 383.24 383.23 0 209.55-169.87 379.41-379.41 379.41-207.45 0-375.62-168.16-375.62-375.61 0-205.38 166.49-371.86 371.86-371.86 203.32 0 368.14 164.82 368.14 368.14 0 201.29-163.17 364.46-364.46 364.46-199.27 0-360.81-161.54-360.81-360.82 0-197.28 159.92-357.2 357.2-357.2 195.31 0 353.64 158.33 353.64 353.63 0 193.36-156.74 350.1-350.1 350.1-191.42 0-346.6-155.17-346.6-346.6 0-189.5 153.63-343.13 343.13-343.13 187.62 0 339.7 152.09 339.7 339.7 0 185.74-150.56 336.3-336.3 336.3-183.88 0-332.94-149.06-332.94-332.93 0-182.04 147.57-329.62 329.61-329.62 180.22 0 326.32 146.1 326.32 326.32 0 178.42-144.64 323.05-323.06 323.05-176.63 0-319.82-143.19-319.82-319.82 0-174.87 141.76-316.62 316.63-316.62 173.11 0 313.45 140.34 313.45 313.46 0 171.38-138.93 310.32-310.32 310.32-169.67 0-307.22-137.55-307.22-307.22 0-167.98 136.17-304.15 304.15-304.15 166.3 0 301.1 134.81 301.1 301.1 0 164.64-133.46 298.1-298.1 298.1-162.98 0-295.1-132.13-295.1-295.11 0-161.36 130.8-292.17 292.16-292.17 159.74 0 289.24 129.5 289.24 289.25 0 158.14-128.2 286.34-286.35 286.34-156.57 0-283.49-126.92-283.49-283.48 0-155 125.65-280.65 280.65-280.65 153.45 0 277.85 124.4 277.85 277.84 0 151.92-123.15 275.07-275.07 275.07-150.4 0-272.31-121.92-272.31-272.32 0-148.89 120.7-269.59 269.59-269.59 147.4 0 266.9 119.5 266.9 266.9 0 145.93-118.3 264.22-264.23 264.22-144.47 0-261.59-117.11-261.59-261.58 0-143.02 115.95-258.97 258.97-258.97 141.6 0 256.38 114.79 256.38 256.38 0 140.18-113.63 253.82-253.81 253.82-138.78 0-251.28-112.5-251.28-251.28 0-137.4 111.38-248.77 248.77-248.77 136.01 0 246.27 110.26 246.27 246.28 0 134.66-109.16 243.81-243.81 243.81-133.31 0-241.38-108.06-241.38-241.37 0-131.98 106.99-238.96 238.96-238.96 130.66 0 236.58 105.91 236.58 236.57 0 129.35-104.86 234.2-234.21 234.2-128.06 0-231.86-103.8-231.86-231.86 0-126.77 102.77-229.54 229.54-229.54 125.5 0 227.25 101.74 227.25 227.25 0 124.25-100.72 224.98-224.98 224.98-123 0-222.72-99.72-222.72-222.73 0-121.78 98.72-220.5 220.5-220.5 120.56 0 218.3 97.73 218.3 218.3 0 119.35-96.76 216.1-216.12 216.1-118.16 0-213.95-95.78-213.95-213.95 0-116.98 94.83-211.81 211.81-211.81 115.81 0 209.7 93.88 209.7 209.7 0 114.65-92.95 207.6-207.6 207.6-113.5 0-205.52-92.02-205.52-205.53 0-112.37 91.1-203.47 203.46-203.47'/%3e %3c/svg%3e");
  width: 800px;
  height: 800px;
  padding: 198px;
}
.vinylStyle .cd, .vinylStyle .cdLlight {
  width: 800px;
  height: 800px;
  -webkit-mask: radial-gradient(transparent, transparent 17px, rgba(255, 255, 255, .4) 19px, #000 19px);
  mask: radial-gradient(transparent 17px, rgba(255, 255, 255, .4) 19px, #000 19px);
  z-index: 1;
}

.vinylStyle .cdLlight {
  box-shadow: none;
  background: -moz-linear-gradient(-25deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 70%);
  background: -webkit-linear-gradient(-25deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 70%);
  background: linear-gradient(115deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 70%);
}
.cdStyle .cd {
  -webkit-mask: radial-gradient(transparent, transparent 70px, rgba(255, 255, 255, .4) 72px, #000 72px);
  mask: radial-gradient(transparent 70px, rgba(255, 255, 255, .4) 72px, #000 72px);
}
.vinylStyle .cdBox::after {
  border: none;
  width: 34px;
  height: 34px;
  box-shadow: -2px 0px 15px rgba(0, 0, 0, .3) inset, -1px 0 0 rgba(255, 255, 255, .25), 0 0 0 rgba(255, 255, 255, .3) inset
}
.vinylStyle .cdShadow {
  background-image: none;
  box-shadow: -2px -1px 20px rgba(0, 0, 0, .8);
}
.cdBox::after {
  content: '';
  width: 72px;
  height: 72px;
  border-radius: 500px;
  -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, .5) inset;
  box-shadow: -2px 1px 15px rgba(0, 0, 0, .3) inset, -1px 0px 0px rgba(255, 255, 255, .25), 1px 0px 0px rgba(255, 255, 255, .3) inset;
  position: absolute;
  border: 35px solid rgba(255, 255, 255, .1);
  z-index: 4;
}
.loaded {
  opacity: 0;
  transition: opacity .3s;
}
.cdSlideIn { 
  animation: slideDown ease-in-out .6s forwards;
}
.cd {
  width: 500px;
  height: 500px;
  border-radius: 500px;
  position: absolute;
}
.cdSlideIn .cd {
  -webkit-animation: roll linear 6s infinite .8s;
  animation: roll linear 6s infinite .8s;
}
.cdLlight {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 500px;
  -webkit-mask: radial-gradient(transparent, transparent 35px, rgba(255, 255, 255, .4) 37px, #000 37px);
  mask: radial-gradient(transparent 35px, rgba(255, 255, 255, .4) 37px, #000 37px);
  box-shadow: 0 0 2px rgba(255, 255, 255, .5) inset;
  background: -moz-linear-gradient(-25deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-linear-gradient(-25deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(115deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%);
  z-index: 2;
}
.cdShadow {
  width: 500px;
  height: 500px;
  border-radius: 500px;
  position: absolute;
  box-shadow: -2px -1px 20px rgba(0, 0, 0, .3);
  z-index: 3;
}
.pause {
    animation-play-state: paused !important;
  }

@keyframes roll {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes roll {
  0% {
    -webkit-transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes slideDown {
  0% {
    transform: translateY(-1200px);
  }
  100% {
    transform: translateY(0);
  }
}
@-webkit-keyframes slideDown {
  0% {
    -webkit-transform: translateY(-1200px);
  }
  100% {
    -webkit-transform: translateY(0);
  }
}

</style>
