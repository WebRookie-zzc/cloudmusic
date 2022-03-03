<template>
  <div class="player">
<!--    左侧正在播放的歌曲的信息-->
    <div class="left_info">
      <img :src="musicDetail.musicDetail[0].al.picUrl" alt="" @click="isShowLyric = !isShowLyric">
      <div class="left_name">{{musicDetail.musicDetail[0].name}}</div>
      <ul class="singer_name">
        <li v-for="item in musicDetail.musicDetail[0].ar">{{item.name}}</li>
      </ul>
    </div>
<!--    播放控制条-->
    <div class="play_banner_wrapper" @mousemove="playBalMouseMove" @mouseup="playBalMouseUp">
<!--      上面的播放控制按钮-->
      <div class="top_control_button_wrapper">
        <div class="last_button"></div>
        <div class="play_button" v-if="!isPlaySong" @click="handleClickPlayBtn"></div>
        <div class="pause_button" v-else @click="handleClickPauseBtn"></div>
        <div class="next_button"></div>
      </div>
<!--      下面的播放进度条-->
      <div class="bottom_control_bar_wrapper">
        <span class="have_play_time">{{songHavePlayTimeStr}}</span>
        <div class="all_bar"
             @mouseenter="allBarMouseenter"
             @mouseleave="allBarMouseLeave"
             @mousedown="playBalMouseDown">
          <div class="have_play_bar" ref="playBar"></div>
<!--          可拖动调节进度的小球-->
          <div class="play_ball" ref="playBall"
               @mouseup="playBalMouseUp"></div>
        </div>
        <span class="all_time">{{songLengthStr}}</span>
      </div>
    </div>
<!--    右侧播放信息-->
    <div class="right_info">
      <div class="SQ" title="无损音质"></div>
<!--      音量-->
      <div class="volume"
           @mouseenter="isShowVolumeBox = true"
           @mouseleave="isShowVolumeBox = false; handleVolumeBarMouseleave()">
<!--        音量条容器-->
        <div class="volume_bar_wrapper"
             v-if="isShowVolumeBox"
             @mousemove="handleVolumeBarMousemove">
<!--          总音量条-->
          <div class="volume_all_bar"
               @mousedown="handleVolumeBarMousedown"
               ref="volumeAllBar"
               @mouseleave="handleVolumeBarMouseleave">
<!--            实际音量条-->
            <div class="volume_now_bar" ref="volumeNowBar"></div>
<!--            音量小球-->
            <div class="volume_ball" ref="volumeBall"></div>
          </div>
        </div>
      </div>
      <div class="playListInfo" title="打开播放列表"></div>
    </div>
    <audio :src="musicUrl" ref="audio"
           @timeupdate="handleTimeUpdate"
           @play="startPlay(1)"
           @pause="pausePlay"></audio>
    <teleport to="body">
      <div class="player_content" v-show="isShowLyric">
        <div class="img_wrapper" ref="rotate">
          <div class="left_img">
            <img :src="musicDetail.musicDetail[0].al.picUrl" alt="">
          </div>
        </div>
        <div class="out_comment_wrapper">
          <!--                  评论容器-->
          <ul class="comment_wrapper">
            <li class="title">热门评论</li>
            <li class="comment_item" v-for="item in commentList.commentList">
              <div class="img"><img :src="item.user.avatarUrl" alt=""></div>
              <div class="content">
                <span style="color: #00f">{{item.user.nickname}}:</span>{{item.content}}
              </div>
            </li>
          </ul>
        </div>
        <div class="baseInfo">
          <div class="title">{{musicDetail.musicDetail[0].name}}</div>
          <div class="name_wrapper">
            <div v-for="item in musicDetail.musicDetail[0].ar" class="name">{{item.name}}&nbsp;</div>
          </div>
<!--          歌词外部容器-->
          <div class="lyric_out_wrapper" ref="innerLyric">
<!--            歌词内部容器-->
            <ul class="lyric_inner_wrapper">
              <li class="lyric_item" v-for="(item, index) in lastArr.lastArr" :class="{active: lyricIndex === index}">{{item.lyric}}</li>
            </ul>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, reactive, ref, watch} from "vue";
import axios from "axios";
import {useStore} from "vuex";
import {parse} from "@vue/compiler-sfc";

  export default defineComponent({
    name: `Player`,
    setup() {
      let store = useStore()

      let musicId = computed(() => store.state.musicId)

      // 神女劈观的歌曲 id 1910911958
      // let musicId = ref<number>(1910911958)

      //计算属性：放入audio中的url
      let musicUrl = computed(() => `https://music.163.com/song/media/outer/url?id=${store.state.musicId}.mp3`)

      //获取audio dom
      let audio = ref()

      //监视musicUrl的变化
      watch(musicId, async newValue => {
        console.log(`检测到了ID的变化`);
        //切歌的时候及时清除定时器，防止旋转不可控
        clearInterval(rotateTimer)
        await getDetailMusic()
        await getLyric()
        handleLyric()
        await getCommentList()
        audio.value.play()
      })

      /**
       * @date 2022.2.15
       * @brief 音乐播放器
       * */

      //歌曲详情
      let musicDetail = reactive({musicDetail: [{name: ``,al: {picUrl:``}, ar: []}]})

      //当前播放歌曲的总毫米数
      let songLength = ref<number>(0)

      /**
       * 获取歌曲详情
       * */
      async function getDetailMusic() {
        let res = await axios({
          url: `http://localhost:3000/song/detail`,
          method: `get`,
          params: {
            ids: store.state.musicId
          }
        })
        console.log(res.data.songs,111);
        musicDetail.musicDetail = res.data.songs
        songLength.value = res.data.songs[0].dt
      }

      /**
       * @date 2022.2.15
       * @brief 歌词滚动功能
       * @addition 元宵节快乐 (*^▽^*)
       * */

      //是否显示歌词
      let isShowLyric = ref<boolean>(false)

      //原始歌词数据
      let originLyric = ref<string>(``)

      /**
       * 获取歌词
       * */
      async function getLyric() {
        let res = await axios({
          url: `http://localhost:3000/lyric`,
          method: `get`,
          params: {
            id: store.state.musicId
          }
        })
        // console.log(res.data.lrc.lyric);
        originLyric.value = res.data.lrc.lyric
      }

      /**
       * 处理歌词
       */

      // //处理后的歌词
      let lastArr = reactive({lastArr:[{time: 0, lyric: ``}]})

      function handleLyric() {
        lastArr.lastArr = []
        let lineArr = originLyric.value.split(`\n`)
        let timeArr:string[] = []
        let lyricArr:string[] = []
        lineArr.forEach(item => {
          timeArr.push(item.split(`]`)[0].slice(1))
          lyricArr.push(item.split(`]`)[1])
        })
        //再处理时间
        let timeLastArr:number[] = []
        for(let i = 0; i < timeArr.length; i++) {
          let min:number = Number(timeArr[i].split(`:`)[0])
          let sec:number = Number(timeArr[i].split(`:`)[1])
          timeLastArr[i] = min * 60 + sec
        }
        //最终处理完成的歌词数组
        for(let i = 0; i < lineArr.length-1; i++) {
          lastArr.lastArr.push({time: timeLastArr[i], lyric: lyricArr[i]})
        }
      }

      //获取歌词的dom元素
      let innerLyric = ref()

      //正在播放的歌词的索引值
      let lyricIndex = ref<number>()

      /**
       * 更新正在播放的歌词
       * */
      function updatePlayerLyric() {
        for(let i = 0; i < lastArr.lastArr.length; i++) {
          if(lastArr.lastArr[i].time > audio.value.currentTime) {
            lyricIndex.value = i - 1;
            innerLyric.value.scrollTop = (lyricIndex.value - 5) * 35
            break
          }
        }
      }

      //存储歌曲评论
      let commentList = reactive({commentList:[]})

          /**
           * 获取歌曲评论
           */
      async function getCommentList() {
        let res = await axios({
          url: `http://localhost:3000/comment/music`,
          method: `get`,
          params: {
            id: store.state.musicId,
            limit: 5
          }
        })
            console.log(res.data);
        commentList.commentList = res.data.hotComments
      }

      /**
       * 处理audio更新事件事件 (timeupdate)
       * */
      function handleTimeUpdate() {
        // console.log(audio.value.currentTime);
        if(!isPlayBarMousedown.value) songHavePlayTime.value = audio.value.currentTime
        changePlayBar()
        changeBallPosition()

        updatePlayerLyric()
      }

      /**
       * @date 2022.3.2
       * @brief 播放时旋转图标
       * */

      //要旋转的dom元素
      let rotate = ref()

      //元素所处于的度数
      let picDegree:number = 0;

      //旋转元素的定时器
      let rotateTimer:number;

      /**
       * 旋转 dom 元素
       * */
      function rotateElement() {
        picDegree = picDegree + 1.25;
        if(picDegree === 360) {
          picDegree = 0;
        }
        rotate.value.style.transform = `rotate(${picDegree}deg)`
      }

      /**
       * 处理audio 开始播放的事件
       * @param flag 0 表示从头开始播放 1 表示从中断处开始播放
       * */
      function startPlay(flag:number) {
        isPlaySong.value = true
        if(flag === 0) {picDegree = 0}
        rotateTimer = setInterval(rotateElement, 50)
      }

      /**
       * 处理暂停播放的事件
       * */
      function pausePlay() {
        isPlaySong.value = false
        clearInterval(rotateTimer)
      }

      /**
       * 自定义控件的播放
       * */

      //处理后的歌曲的总时长
      let songLengthStr = computed(() => {
        let temp:number = songLength.value / 1000 / 60
        temp = Number(temp.toFixed(2))
        let minNum:number = parseInt(temp.toString())
        let temp1 = (temp - minNum) * 60
        let secNum:number = parseInt(temp1.toString())
            console.log(secNum.toString().length)
        if(secNum === 0) {return `${minNum}:00`}
        else if(secNum.toString().length === 1) {return `${minNum}:0${secNum}`}
            return `${minNum}:${secNum}`
      })

      //歌曲是否播放，播放的状态
      let isPlaySong = ref<boolean>(false)

      /**
       * 处理点击播放按钮的事件
       * */
      function handleClickPlayBtn() {
        audio.value.play()
      }

      /**
       * 处理点击暂停按钮的事件
       * */
      function handleClickPauseBtn() {
        audio.value.pause()
      }

      //歌曲已经播放的时长
      let songHavePlayTime = ref<number>(0)

      //处理后的字符串的已经播放的时长
      let songHavePlayTimeStr = computed(() => {
        let temp:number = songHavePlayTime.value / 60
        let minNum:number = parseInt(temp.toString())
        let temp1:number = (temp - minNum) * 60
        temp1 = parseInt(temp1.toString())
        let secNum:number = temp1
        if(secNum === 0) {return `${minNum}:00`}
        else if(secNum.toString().length === 1) {return `${minNum}:0${secNum}`}
        return `${minNum}:${secNum}`
      })

      //播放条元素
      let playBar = ref()

      /**
       * 调整播放条的进度
       * */
      function changePlayBar() {
        if(isPlayBarMousedown.value) return
        let barWidth:number = audio.value.currentTime / (songLength.value / 1000) * 400
        playBar.value.style.width = `${barWidth}px`
      }

      //可拖动小球元素
      let playBall = ref()

      //小球是否处于鼠标拖动的状态
      let isMouseDown = ref<boolean>(false)

      //是否显示进度小球
      let isShowBall = ref<boolean>(false)

      /**
       * 播放改变小球的位置
       * */
      function changeBallPosition() {
        if(isPlayBarMousedown.value) return
        //仅仅当鼠标不处于鼠标拖动状态时，小球才自动随着播放进度移动
        let leftValue:number = audio.value.currentTime / (songLength.value / 1000 ) * 400 - 5
        playBall.value.style.left = `${leftValue}px`
      }

      /**
       * 鼠标进入播放条事件的处理函数
       * */
      function allBarMouseenter() {
        // isShowBall.value = true
        playBall.value.style.opacity = 1
      }

      /**
       * 鼠标移出播放进度条事件的处理函数
       * */
      function allBarMouseLeave() {
        // isShowBall.value = false
        playBall.value.style.opacity = 0
      }

      //播放进度条是否处于鼠标按下的状态
      let isPlayBarMousedown = ref<boolean>(false)

      //点击播放小球时的起始位置
      let ballStartLeftPosition:number = 0;
      //松开鼠标时，小球的应该处于的位置
      let ballEndLeftPosition:number = 0

      /**
       * 处理进度条的按下事件，用于调节播放进度
       * @param event 事件对象
       * */
      function playBalMouseDown(event:any) {
        isPlayBarMousedown.value = true
        ballStartLeftPosition = event.clientX
        /**
         * 点击进度条时，小球移动到点击的位置
         * */
        //小球新的left值
        let ballNewLeftValue:number = event.clientX - playBar.value.getBoundingClientRect().x
        playBall.value.style.left = `${ballNewLeftValue - 5}px`
        //进度条随小球位置的改变而改变
        playBar.value.style.width = `${ballNewLeftValue}px`
      }

      /**
       * 处理进度条鼠标移动事件，用于调节播放进度
       * @param event 事件对象
       * */
      function playBalMouseMove(event:any) {
        if(!isPlayBarMousedown.value) return
        //仅当鼠标点击进度小球，才能调节进度

        /**
         * 小球和进度条的拖动移动
         * */
        //小球新的left值
        let ballNewLeftValue:number = event.clientX - playBar.value.getBoundingClientRect().x
        if(ballNewLeftValue < 0) ballNewLeftValue = 0
        else if(ballNewLeftValue > 400) ballNewLeftValue = 400
        playBall.value.style.left = `${ballNewLeftValue - 5}px`
        //进度条随小球位置的改变而改变
        playBar.value.style.width = `${ballNewLeftValue}px`

        /**
         * 改变左侧的时间
         * */
        //播放进度条的长度
        let playBarWidth:number = Number(playBar.value.style.width.split('p')[0])
        songHavePlayTime.value = songLength.value  / 1000 * playBarWidth / 400
      }

      /**
       * 处理进度条的鼠标离开事件，用于调节播放进度
       * @param event 事件对象
       * */
      function playBalMouseUp(event:any) {
        isPlayBarMousedown.value = false
        //播放进度条的长度
        let playBarWidth:number = Number(playBar.value.style.width.split('p')[0])
        audio.value.currentTime = songLength.value  / 1000 * playBarWidth / 400
        audio.value.play()
      }

      /**
       * @brief 音量控制
       * @date 2022.03.04
       * */

      //是否显示音量控制盒子
      let isShowVolumeBox = ref<boolean>(false)

      //音量条是否按下
      let isVolumeBarMousedown = ref<boolean>(false)

      //总音量条dom对象
      let volumeAllBar = ref()

      //实际音量条dom对象
      let volumeNowBar = ref()

      //音量小球dom
      let volumeBall = ref()

      /**
       * 处理音量条鼠标按下的事件
       * @param event 事件对象
       * */
      function handleVolumeBarMousedown(event:any) {
        isVolumeBarMousedown.value = true
        let volumeNowBarHeightNum:number = 100 - (event.clientY - volumeAllBar.value.getBoundingClientRect().y)
        if(volumeNowBarHeightNum < 0) volumeNowBarHeightNum = 0
        else if(volumeNowBarHeightNum > 100) volumeNowBarHeightNum = 100
        volumeNowBar.value.style.height = `${volumeNowBarHeightNum}px`
        volumeBall.value.style.bottom = `${volumeNowBarHeightNum - 5}px`
        audio.value.volume = volumeNowBarHeightNum / 100
      }

      /**
       * 处理音量条鼠标移动事件
       * */
      function handleVolumeBarMousemove(event:any) {
        if(!isVolumeBarMousedown.value) return
        //仅鼠标按下时才能调节音量
        let volumeNowBarHeightNum:number = 100 - (event.clientY - volumeAllBar.value.getBoundingClientRect().y)
        if(volumeNowBarHeightNum < 0) volumeNowBarHeightNum = 0
        else if(volumeNowBarHeightNum > 100) volumeNowBarHeightNum = 100
        volumeNowBar.value.style.height = `${volumeNowBarHeightNum}px`
        volumeBall.value.style.bottom = `${volumeNowBarHeightNum - 5}px`
        audio.value.volume = volumeNowBarHeightNum / 100
      }

      /**
       * 处理音量条鼠标移出事件
       * */
      function handleVolumeBarMouseleave() {
        isVolumeBarMousedown.value = false
      }

      onBeforeMount(async () => {
        await getDetailMusic()
        await getLyric()
        handleLyric()
        await getCommentList()
      })

      return {
        store,
        musicUrl,
        getDetailMusic,
        musicDetail,
        audio,

        getLyric,
        handleTimeUpdate,
        originLyric,
        lastArr,
        innerLyric,
        lyricIndex,
        updatePlayerLyric,
        isShowLyric,

        commentList,

        rotate,
        startPlay,
        pausePlay,

        songLength,
        songLengthStr,
        isPlaySong,
        handleClickPlayBtn,
        handleClickPauseBtn,
        songHavePlayTime,
        songHavePlayTimeStr,
        playBar,
        playBall,
        isShowBall,
        allBarMouseenter,
        allBarMouseLeave,
        isPlayBarMousedown,
        playBalMouseDown,
        playBalMouseMove,
        playBalMouseUp,

        //音量控制
        isShowVolumeBox,
        isVolumeBarMousedown,
        handleVolumeBarMousedown,
        volumeAllBar,
        volumeNowBar,
        volumeBall,
        handleVolumeBarMousemove,
        handleVolumeBarMouseleave
      }
    }
  })
</script>

<style scoped lang="less">
  .player {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70px;
    //border: 2px solid red;
    padding-left: 100px;
    background-color: #fff;
    border-top: 3px solid #ccc;
    //overflow: hidden;
    display: flex;

    .left_info {
      width: 300px;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;

      img {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        &:hover {
          cursor: pointer;
        }
      }

      .left_name, .singer_name {
        font-size: 16px;
        //margin-left: 20px;
        line-height: 30px;
        font-weight: bolder;
      }

      .singer_name {
        display: flex;
        font-weight: normal;
        font-size: 14px;

        li {
          padding-right: 10px;
        }
      }
    }

    audio {
      position: absolute;
      left: 450px;
      top: 10px;
      width: 1000px;
    }
  }

  /* 播放控件 */
  .play_banner_wrapper {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 1000px;
    //border: 1px solid #000;

    .top_control_button_wrapper {
      width: 500px;
      height: 40px;
      //border: 1px solid #000;
      display: flex;
      justify-content: center;
      align-items: center;

      .last_button, .play_button, .next_button, .pause_button{
        width: 30px;
        height: 30px;
        //border: 1px solid #000;
        border-radius: 50%;
        margin-left: 20px;

        &:hover {
          cursor: pointer;
        }
      }

      .last_button {
        background-image: url("../assets/Player/last.png");
        background-size: 25px 25px;
        background-position: center center;
        background-repeat: no-repeat;
      }

      .play_button {
        background-image: url("../assets/Player/24gf-play.png");
        background-size: 18px 18px;
        background-position: center center;
        background-repeat: no-repeat;
        transition: .5s;

        &:hover {
          background-color: rgba(0,0,0,.1);
        }
      }

      .pause_button {
        background-image: url("../assets/Player/pause.png");
        background-size: 18px 18px;
        background-position: center center;
        background-repeat: no-repeat;
        transition: .5s;

        &:hover {
          background-color: rgba(0,0,0,.1);
        }
      }

      .next_button {
        background-image: url("../assets/Player/next.png");
        background-size: 25px 25px;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }

    .bottom_control_bar_wrapper {
      width: 600px;
      height: 10px;
      //background-color: #666666;
      margin-top: 5px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 10px;
        line-height: 10px;
        user-select:none;
      }

      .all_bar {
        width: 400px;
        height: 3px;
        background-color: #ccc;
        margin-left: 20px;
        margin-right: 20px;
        position: relative;

        .have_play_bar {
          background-color: #FFA500;
          width: 0;
          height: 3px;
        }

        /* 可拖动小球 */
        .play_ball {
          width: 10px;
          height: 10px;
          position: relative;
          top: -6.5px;
          left: -5px;
          background-color: #fff;
          border: 1px solid #aaa;
          border-radius: 50%;
          opacity: 0;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }

  .right_info {
    width: 150px;
    height: 40px;
    //border: 1px solid #000;
    position: absolute;
    bottom: 5px;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .SQ, .playListInfo, .volume{
      width: 40px;
      height: 40px;
      background: url("../assets/Player/SQ.png") no-repeat center center;
      background-size: 30px 30px;
      cursor: pointer;
    }
    .playListInfo {
      background: url("../assets/Player/playList.png") no-repeat center center;
      background-size: 25px 25px;
    }

    .volume {
      background: url("../assets/Player/volume.png") no-repeat center center;
      background-size: 30px 30px;
      margin-left: 10px;
      position: relative;

      .volume_bar_wrapper {
        width: 30px;
        height: 110px;
        position: relative;
        top: -110px;
        left: 5px;
        //border: 1px solid #000;
        display: flex;
        border-radius: 5px;
        background: #fff;
        justify-content: center;
        box-shadow: 0 0 10px #888888;

        .volume_all_bar {
          margin-top: 8px;
          margin-bottom: 2px;
          width: 6px;
          height: 100px;
          background: #cccccc;
          position: relative;
          border-radius: 10px;

          .volume_now_bar {
            position: absolute;
            bottom: 0;
            width: 6px;
            height: 100px;
            background: #C20C0C;
            border-radius: 10px;
          }

          .volume_ball {
            width: 10px;
            height: 10px;
            background: #C20C0C;
            border-radius: 50%;
            position: absolute;
            bottom: 95px;
            left: -2px;
          }
        }
      }
    }
  }

  .player_content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 70px;
    //border: 3px solid #0f0;
    background-color: #eae6e6;
    z-index: 10000;

    .img_wrapper {
      width: 300px;
      height: 300px;
      background-color: #222;
      position: absolute;
      left: 200px;
      top: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }

    .left_img {
      width: 200px;
      height: 200px;
      //position: absolute;
      //left: 200px;
      //top: 250px;
      border-radius: 50%;
      &:hover {
        cursor: pointer;
      }

      img {
        width: 200px;
        height: 200px;
        //border-radius: 30px;
        border-radius: 50%;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .baseInfo {
      width: 1000px;
      margin-left: 500px;
      margin-top: 100px;
      z-index: 9999;

      .title {
        font-weight: bolder;
        text-align: center;
        font-size: 30px;
      }

      .name_wrapper {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      }

      .lyric_out_wrapper {
        height: 400px;
        margin-top: 30px;
        text-align: center;
        position: relative;
        display: flex;
        justify-content: center;
        overflow-y: scroll;
        overflow-x: hidden;
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
        transition: .3s;

        .lyric_inner_wrapper {
          position: absolute;
          transition: .3s;

          li {
            height: 35px;
            line-height: 35px;
            font-size: 18px;
            color: #aaa;
            transition: .3s;
            font-family: "楷体", serif;
            z-index: 1000;

          }

          .active {
            font-size: 25px;
            font-weight: bolder;
            color: #C20C0C;
          }
        }
      }
    }

    .out_comment_wrapper {
      width: 100%;
      height: 250px;
      position: absolute;
      bottom: 0;
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 50px;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }

    .comment_wrapper {
      //position: absolute;
      //top: 30px;
      //right: 30px;
      //width: 600px;
      //bottom: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      .title {
        font-size: 20px;
        color: #000;
        font-family: "楷体", serif;
        font-weight: bolder;
        border-radius: 20px;
        border:1px solid #000;
        background-color: #ccc;
        text-align: center;
      }

      .comment_item{
        display: flex;
        width: 100%;
        height: 70px;
        padding-top: 10px;
        padding-right: 5px;

        .img{
          width: 50px;
          height: 100%;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        .content {
          padding-left: 10px;
        }
      }
    }
  }
</style>