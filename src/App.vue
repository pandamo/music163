<template>
<div id="app">

  <transition name='fade'>
   <loadingCover v-if='!inited && isMobile'></loadingCover>
  </transition>
  <!-- 左边播放列表 -->
  <list :sondList='sondList' :songId='curSongId' @changeSong='playSong' :isMobile='isMobile' />

  <!-- 右边播放器 -->

  <!-- 唱片-->
  <player :songInfo='curSongInfo' :cdStyle='cdStyle' :playing='playing' @swipeCd='goPlay' />

  <!-- 唱片样式切换 -->
  <changeRecordStyleBtn :cdStyle='cdStyle' @changeFromBtn='changeStyle' v-if='!isMobile' />

  <!-- 控制按钮 -->
  <controller :songId='curSongId' @play="goPlay" :playWay='playWay' @canNotPlay='popToast' />

  <svgBtn icoName='keyIcon' class='keyTips' @click.native='popToast("→：播下一首<br> ←：播上一首<br>↑ ：增加音量<br>↓ ：减少音量")' v-if='!isMobile' />

  <small class="author" v-if='!isMobile'>
    QQ: 1562714
    <br>weChat: Pandamo
    <br>pandamo@gmail.com</small>
  <small v-else style='position: fixed;  top: 4vw;  right: 2vw;  text-align: right;'>30CM MusicBox</small>

  <!--  toast -->
  <toast :msg='toastMessage' />
</div>
</template>
<script>
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
import loadingCover from './components/loadingCover'
import list from './components/list'
import changeRecordStyleBtn from './components/changeRecordStyleBtn'
import controller from './components/controller'
import toast from './components/toast'
import svgBtn from './components/svgBtn'
// import recordPlayer from './components/recordPlayer'
// import recordPlayerMobile from './components/recordPlayerMobile'
// const recordPlayer = () => import('./../src/components/recordPlayer.vue')
// const recordPlayerMobile = () => import('./../src/components/recordPlayerMobile.vue')

// 判断是否手机，加载相应唱片样式
const player = isMobile ? () => import('./../src/components/recordPlayerMobile.vue') : (resolve) => {
  require(['./../src/components/recordPlayer.vue'], resolve)
}

export default {
  name: 'App',
  components: {
    loadingCover,
    list,
    player,
    changeRecordStyleBtn,
    controller,
    toast,
    svgBtn
  },
  data() {
    return {
      api: 'https://bird.ioliu.cn/netease/playlist?id=',
      staticApi: '../static/demoData.json',
      sondList: [], // 歌曲列表
      normalPlayList: [], // 顺序播放列表
      randomPlayList: [], // 随机播放列表（只存序号）
      curSongIndex: 0, // 当前播放到第几首
      curSongId: '', // 当前播放歌曲的ID
      curSongInfo: {}, // 当前播放歌曲信息
      songListId: location.search.split('=')[1] ? location.search.split('=')[1] : 53208352, // 网易云播放列表ID
      cdStyle: localStorage.getItem('cdStyle') ? JSON.parse(localStorage.getItem('cdStyle')) : true, // true:激光产品样式，false:黑胶唱片样式
      playWay: isMobile ? {
        randomPlay: 0,
        normalPlay: 1,
        repeatOne: 0
      } : localStorage.getItem('payWay') ? JSON.parse(localStorage.getItem('payWay')) : {
        randomPlay: 0,
        normalPlay: 1,
        repeatOne: 0
      },
      playing: undefined,
      normalPlayNext: true,
      toastMessage: '',
      isMobile: isMobile,
      inited: false
    }
  },
  watch: {
    curSongId: function (val, oldVal) {
      this.curSongInfo = this.sondList.find((v, i) => v.id === val)
    },
    curSongIndex: function (val, oldVal) {
      if (this.playWay.randomPlay) {
        this.curSongId = this.sondList[this.randomPlayList[val]].id
      } else {
        let _prevSongIndex = this.sondList.findIndex((v, i) => this.curSongInfo.id == v.id) // 之前播放歌曲的排序
        if (_prevSongIndex === 0) {
          // 之前播放第一首
          this.curSongId = this.normalPlayNext ? this.sondList[_prevSongIndex + 1].id : this.sondList[this.sondList.length - 1].id
        } else if (_prevSongIndex === this.sondList.length - 1) {
          // 之前播放最后一首
          this.curSongId = this.normalPlayNext ? this.sondList[0].id : this.sondList[_prevSongIndex - 1].id
        } else {
          this.curSongId = this.normalPlayNext ? this.sondList[_prevSongIndex + 1].id : this.sondList[_prevSongIndex - 1].id
        }
      }
    }
  },
  methods: {

    playSong(songid) {
      // 切换歌曲
      this.curSongId = songid
    },
    goPlay(action) {
      // console.log(action)
      // 接收控制按钮的动作
      switch (action) {
        case 'play': // 播放or暂停
          this.playing = true
          break
        case 'pause': // 播放or暂停
          this.playing = false
          break
        case 'next': // 播放下一首
          console.log('播放下一首')
          if (this.curSongIndex < this.sondList.length - 1) {
            this.curSongIndex++
          } else {
            this.curSongIndex = 0
          }
          this.playing = true
          this.normalPlayNext = true
          break
        case 'prev': // 播放上一首
          if (this.curSongIndex === 0) {
            this.curSongIndex = this.sondList.length - 1
          } else {
            this.curSongIndex--
          }
          this.playing = true
          this.normalPlayNext = false
          break
        case 'randomPlay':
          // 切换到顺序播放
          this.playWay.randomPlay = 0
          this.playWay.normalPlay = 1
          this.normalPlayNext = true
          break
        case 'normalPlay':
          // 切换到重复播放一首
          this.playWay.normalPlay = 0
          this.playWay.repeatOne = 1
          break
        case 'repeatOne':
          // 切换到随机播放
          this.creatRandomList()
          this.playWay.repeatOne = 0
          this.playWay.randomPlay = 1
          break
      }
      this.savePlayWay()
    },
    changeStyle() {
      this.cdStyle = !this.cdStyle
      localStorage.setItem('cdStyle', this.cdStyle)
    },
    shuffle(arr) {
      let _normalArry = [...this.normalPlayList]
      let _randomArry = []
      for (let n = _normalArry.length; n > 0; n--) {
        var ran = Math.floor(Math.random() * _normalArry.length)
        _randomArry.push(_normalArry.splice(ran, 1)[0])
      };
      return new Promise((resolve, reject) => {
        resolve(_randomArry)
      })
    },
    creatRandomList() {
      // 创建随机播放列表
      this.shuffle([...this.sondList]).then((newArr) => {
        this.randomPlayList = newArr
        // this.curSongId = this.sondList[newArr[0]].id
      })
    },
    creatPlayList(length) {
      for (let _pLength = 0; _pLength < length; _pLength++) {
        this.normalPlayList[_pLength] = _pLength
      }
      if (this.playWay.randomPlay) {
        this.shuffle([...this.sondList]).then((newArr) => {
          this.randomPlayList = newArr
          this.curSongId = this.sondList[newArr[0]].id
        })
      } else {
        this.curSongId = this.sondList[0].id
      }
    },
    getNetData() {
      // 从bird.ioliu.cn获取列表
      this.$http.get(this.api + this.songListId, {
        timeout: 3000
      }).then((resp) => {
        if (resp.data.playlist.tracks.length > 1) {
          this.sondList = resp.data.playlist.tracks.map((v, i) => {
            const {
              id,
              name,
              al,
              dt,
              ar
            } = v // al专辑信息，dt歌曲时长,ar作者
            let _ar = ar.map((p) => {
              return {
                name: p.name
              }
            })
            let _coverImg = al.picUrl + (this.isMobile ? '?param=400y400' : '?param=800y800')
            return {
              id: id,
              name: name,
              cover: _coverImg,
              length: dt,
              artist: _ar,
              album: al.name
            }
          })
          this.creatPlayList(resp.data.playlist.tracks.length)
          this.inited = true
        } else {
          this.getLocalData()          
        }
      }).catch(() => {
        // bird.ioliu.cn的接口挂了,调用静态接口
        this.getLocalData()
      })
    },
    getLocalData() {
      if (localStorage.getItem('payWay')) {
        this.playWay = JSON.parse(localStorage.getItem('payWay'))
      }
      // 从静态接口获取列表
      this.$http.get(this.staticApi).then((resp) => {
        console.log('从静态接口获取列表: ', resp)
        this.sondList = resp.data
        this.creatPlayList(resp.data.length)
      })
      this.inited = true
    },
    savePlayWay() {
      // 保存播放方式
      localStorage.setItem('payWay', JSON.stringify(this.playWay))
    },
    popToast(message) {
      if (!this.toastMessage) {
        this.toastMessage = message
        setTimeout(() => {
          this.toastMessage = ''
        }, 2000)
      }
    }
  },
  created() {
    this.getLocalData()
    // this.getNetData()
  }
}
</script>

<style src='./assets/css/musicbox163.css'></style>
