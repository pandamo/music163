<template>
  <div id="app">
    <!-- 左边播放列表 -->
    <list :sondList='sondList' :songId='curSongId' @changeSong='playSong' />


    <!-- 唱片 -->
    <recordPlayer :songInfo='curSongInfo' :cdStyle='cdStyle' :playing='playing'/>


    <!-- 唱片样式切换 -->
    <changeRecordStyleBtn :cdStyle='cdStyle' @changeFromBtn='changeStyle' />


    <!-- 控制按钮 -->
    <controller :songId='curSongId' @play="goPlay" :playWay='playWay' @canNotPlay='popToast'/>

    <svgBtn icoName='keyIcon' class='keyTips' @click.native='popToast("→：播下一首<br> ←：播上一首<br>↑ ：增加音量<br>↓ ：减少音量")'/>

    <!-- toast -->
    <toast :msg='toastMessage'/>
  </div>
</template>
<script>
import list from './components/list'
import recordPlayer from './components/recordPlayer'
import changeRecordStyleBtn from './components/changeRecordStyleBtn'
import controller from './components/controller'
import toast from './components/toast'
import svgBtn from './components/svgBtn'
export default {
  name: 'App',
  components: {
    list,
    recordPlayer,
    changeRecordStyleBtn,
    controller,
    toast,
    svgBtn
  },
  data() {
    return {
      api: 'https://bird.ioliu.cn/netease/playlist?id=',
      staticApi: '../static/demoData.json',
      sondList: [], //歌曲列表
      normalPlayList: [], //顺序播放列表
      randomPlayList: [], //随机播放列表（只存序号）
      curSongIndex: 0, //当前播放到第几首
      curSongId: '', //当前播放歌曲的ID
      curSongInfo: {}, //当前播放歌曲信息
      songListId: location.search.split('=')[1] ? location.search.split('=')[1] : 53208352, //网易云播放列表ID
      cdStyle: localStorage.getItem('cdStyle')?JSON.parse(localStorage.getItem('cdStyle')):true, //true:激光产品样式，false:黑胶唱片样式
      playWay:localStorage.getItem('payWay')?JSON.parse(localStorage.getItem('payWay')):{randomPlay: 1,normalPlay: 0,repeatOne: 0},
      playing:true,
      normalPlayNext:true,
      showToast:false,
      toastMessage:''
    }
  },
  watch: {    
    curSongId: function (val, oldVal) {
        this.curSongInfo = this.sondList.find((v, i) => v.id == val)
    },
    curSongIndex: function (val, oldVal) {      
      if(this.playWay.randomPlay){
        this.curSongId = this.sondList[this.randomPlayList[val]].id
      }else{
        let _prevSongIndex=this.sondList.findIndex((v, i) => this.curSongInfo.id == v.id)//之前播放歌曲的排序
        if(_prevSongIndex===0){
          //之前播放第一首
          this.curSongId = this.normalPlayNext?this.sondList[_prevSongIndex+1].id:this.sondList[this.sondList.length-1].id;
        }else if(_prevSongIndex===this.sondList.length-1){
          //之前播放最后一首
          this.curSongId = this.normalPlayNext?this.sondList[0].id:this.sondList[_prevSongIndex-1].id
        }else{          
          this.curSongId = this.normalPlayNext?this.sondList[_prevSongIndex+1].id:this.sondList[_prevSongIndex-1].id;
        }        
      }
    }
  },
  methods: {    
    playSong(songid) {
      //切换歌曲
      this.curSongId = songid;
    },
    goPlay(action) {
      //接收控制按钮的动作      
      switch (action) {
        case 'play': //播放or暂停
          this.playing=!this.playing
          break;
        case 'next': //播放下一首
          if (this.curSongIndex < this.sondList.length - 1) {
            this.curSongIndex++
          } else {
            this.curSongIndex = 0
          }
          this.playing=true
          this.normalPlayNext=true
          break;
        case 'prev': //播放上一首
          if (this.curSongIndex === 0) {
            this.curSongIndex = this.sondList.length - 1           
          } else {
            this.curSongIndex--
          }
          this.playing=true
          this.normalPlayNext=false
          break;
        case 'randomPlay':
        //切换到顺序播放
         this.playWay.randomPlay=0
         this.playWay.normalPlay=1
         this.normalPlayNext=true
          break;
        case 'normalPlay': 
        //切换到重复播放一首
         this.playWay.normalPlay=0
         this.playWay.repeatOne=1
          break;
        case 'repeatOne': 
        //切换到随机播放
        this.creatRandomList()
         this.playWay.repeatOne=0
         this.playWay.randomPlay=1
          break;
      }
      this.savePlayWay()
    },
    changeStyle() {
      this.cdStyle = !this.cdStyle
      localStorage.setItem('cdStyle',this.cdStyle)
    },
    shuffle(arr) {
      let _normalArry = [...this.normalPlayList],
        _randomArry = []
      for (let n = _normalArry.length; n > 0; n--) {
        var ran = Math.floor(Math.random() * _normalArry.length);
        _randomArry.push(_normalArry.splice(ran, 1)[0]);
      };
      return new Promise((resolve, reject) => {
        resolve(_randomArry)
      })
    },
    creatRandomList() {
      //创建随机播放列表
      this.shuffle([...this.sondList]).then((newArr) => {
        this.randomPlayList = newArr        
        //this.curSongId = this.sondList[newArr[0]].id
      });
    },
    getNetData() {
      //从bird.ioliu.cn获取列表
      this.$http.get(this.api + this.songListId, { timeout: 1000 }).then((resp) => {
        this.sondList = resp.data.playlist.tracks.map((v, i) => {
          const { id, name, al, dt, ar } = v //al专辑信息，dt歌曲时长,ar作者
          let _ar = ar.map((p) => { return { name: p.name } })
          return { id: id, name: name, cover: al.picUrl, length: dt, artist: _ar, album: al.name }
        })
      }).catch((error) => {
        //bird.ioliu.cn的接口挂了.....调用静态接口
        this.getLocalData()
      })
    },
    getLocalData() {
      if(localStorage.getItem('payWay')){
      this.playWay=JSON.parse(localStorage.getItem('payWay'))
    }
      //从静态接口获取列表
      this.$http.get(this.staticApi).then((resp) => {
        this.sondList = resp.data;
        
        this.normalPlayList = resp.data.map((v, n) => { return n }); //创建顺序播放列表    

        if (this.playWay.randomPlay) {
          this.shuffle([...this.sondList]).then((newArr) => {
            this.randomPlayList = newArr        
            this.curSongId = this.sondList[newArr[0]].id
          });
        }else{
           this.curSongId = this.sondList[0].id
        }
      })
    },
    savePlayWay(){
      //保存播放方式
      localStorage.setItem('payWay',JSON.stringify(this.playWay))
    },
    popToast(message){
      if(!this.showToast){
        this.showToast=true
        this.toastMessage=message
        setTimeout(()=>{
          this.showToast=false
          this.toastMessage=''
        },2000)
      }
      
    }
  },
  created() {    
    //this.getNetData();
    this.getLocalData();
    //this.toast('歌曲加载失败，自动播放下一首')
  }
}

</script>
<style>
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
  font: 12px/1.5 Microsoft YaHei, tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  background-color: #000;
  color: #666;
}
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td, hr, button, article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section, sumary {
  margin: 0;
  padding: 0;
}
input, select, textarea {
  border: 0;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  border-radius: 0;
}
ol, ul {
  list-style: none;
}
img, a {
  -webkit-touch-callout: none;
}
a, a:active, a:hover {
  text-decoration: none;
}
a, button, input, textarea {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
p {
  text-align: justify;
  text-justify: inter-ideograph;
}
:focus {
  outline: 0;
}
img, embed, object, video {
  max-width: 100%;
}


::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: rgba(0, 0, 0, .2);
}

</style>
