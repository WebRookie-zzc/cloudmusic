<template>
  <div class="player">
<!--    左侧正在播放的歌曲的信息-->
    <div class="left_info">
      <img :src="musicDetail.musicDetail[0].al.picUrl" alt="" @click="isShowLyric = !isShowLyric">
      <div class="song_info">
        <div class="left_name">{{musicDetail.musicDetail[0].name}}</div>
        <ul class="singer_name">
          <li v-for="item in musicDetail.musicDetail[0].ar">{{item.name}}</li>
        </ul>
      </div>
    </div>
<!--    播放控制条-->
    <div class="play_banner_wrapper" @mousemove="playBalMouseMove" @mouseup="playBalMouseUp">
<!--      上面的播放控制按钮-->
      <div class="top_control_button_wrapper">
        <div class="last_button" @click="clickLastSongBtn"></div>
        <div class="play_button" v-if="!isPlaySong" @click="handleClickPlayBtn"></div>
        <div class="pause_button" v-else @click="handleClickPauseBtn"></div>
        <div class="next_button" @click="clickNextSongBtn"></div>
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
<!--      随机播放按钮-->
      <div class="song_shuffle" title="随机播放" v-if="playlistState === 0" @click="changePlaylistState"></div>
<!--      顺序播放按钮-->
      <div class="song_order" title="顺序播放" v-if="playlistState === 1" @click="changePlaylistState"></div>
<!--      单曲循环-->
      <div class="song_only" title="单曲循环" v-if="playlistState === 2" @click="changePlaylistState"></div>
      <div class="song_mv" @click="handleClickMvBtn"></div>
      <div class="SQ" title="无损音质"></div>
<!--      音量-->
      <div class="volume"
           @mouseenter="handleVolumeBtnMouseenter"
           @mouseleave="isShowVolumeBox = false; handleVolumeBarMouseleave()"
           @mouseup="handleVolumeBarMouseleave">
<!--        音量条容器-->
        <div class="volume_bar_wrapper"
             v-if="isShowVolumeBox"
             @mousemove="handleVolumeBarMousemove">
<!--          总音量条-->
          <div class="volume_all_bar"
               @mousedown="handleVolumeBarMousedown"
               ref="volumeAllBar"
               @mouseup="handleVolumeBarMouseleave">
<!--            实际音量条-->
            <div class="volume_now_bar" ref="volumeNowBar"></div>
<!--            音量小球-->
            <div class="volume_ball" ref="volumeBall"></div>
          </div>
        </div>
      </div>
<!--      歌词的开闭开关-->
      <div class="lyric" @click="isShowLyric = !isShowLyric" title="歌词"></div>
      <div class="playListInfo" title="打开播放列表" @click="handleClickPlaylistBtn"></div>
    </div>
    <audio :src="musicUrl" ref="audio"
           @timeupdate="handleTimeUpdate"
           @play="startPlay(1)"
           @pause="pausePlay"
           @ended="endedPlay"></audio>
    <teleport to="body">
      <div class="player_content" v-show="isShowLyric">
        <div class="img_wrapper" ref="rotate">
          <div class="left_img">
            <img :src="musicDetail.musicDetail[0].al.picUrl" alt="">
          </div>
        </div>
        <div class="out_comment_wrapper">
          <div class="comment_write" @click="isShowWrittenCommentMask = true; writtenCommentType = 1">写评论</div>
          <!--                  评论容器-->
          <div class="comment_add_wrapper">
            <ul class="comment_wrapper">
              <li class="title">热门评论</li>
              <li class="comment_item" v-for="(item, index) in commentList.commentList">
                <div class="img"><img :src="item.user.avatarUrl" alt=""></div>
                <div class="content_wrapper">
                  <div class="content">
                    <div class="comment_span_wrapper">
                      <span style="color: #00f">{{item.user.nickname}}:</span>{{item.content}}
                    </div>
                  </div>
                  <div class="comment_date_and_like_btn">
                    <div class="comment_date">{{item.timeStr}}</div>
                    <div class="right_do">
                      <div class="comment_like" title="点赞"
                           :class="{active: item.liked }"
                           @click="handleClickLike(0, index)">
<!--                        <img :src="getLikeImgSrc(0, index)" alt="">-->
                        {{item.likedCount}}
                      </div>
                      <div class="comment_share" title="分享"></div>
                      <div class="comment_reply" title="回复评论"
                           @click="isShowWrittenCommentMask = true; replyCommentId = item.commentId; writtenCommentType = 2"></div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
<!--            最新评论-->
            <div class="new_comment">
              <div class="new_comment_title">新版评论</div>
              <ul class="new_comment_wrapper">
                <li class="comment_item" v-for="(item, index) in newCommentArr.newCommentArr" :key="index">
                  <div class="img"><img :src="item.user.avatarUrl" alt=""></div>
                  <div class="content_wrapper">
                    <div class="content">
                      <div class="comment_span_wrapper">
                        <span style="color: #00f">{{item.user.nickname}}:</span>{{item.content}}
                      </div>
                    </div>
                    <div class="comment_date_and_like_btn">
                      <div class="comment_date">{{item.timeStr}}</div>
                      <div class="right_do">
                        <div class="comment_like" title="点赞"
                             :class="{active: item.liked }"
                             @click="handleClickLike(1, index)">
<!--                          <img :src="getLikeImgSrc(1, index)" alt="">-->
                          {{item.likedCount}}
                        </div>
                        <div class="comment_share" title="分享"></div>
                        <div class="comment_reply" title="回复评论"
                             @click="isShowWrittenCommentMask = true; replyCommentId = item.commentId ;writtenCommentType = 2"></div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="show_more_wrapper">
                <div class="show_more_button" @click="getMoreComment">更多精彩评论 > </div>
              </div>
            </div>
          </div>
        </div>
        <div class="baseInfo">
          <div class="title">{{musicDetail.musicDetail[0].name}}</div>
          <div class="name_wrapper">
            <div v-for="item in musicDetail.musicDetail[0].ar" class="name">{{item.name}}&nbsp;</div>
          </div>
<!--          歌词外部容器-->
          <div class="lyric_out_wrapper" ref="innerLyric">
<!--            鼠标拖动时显示的线-->
<!--            <div class="dashed_line"></div>-->
<!--            歌词内部容器-->
            <ul class="lyric_inner_wrapper"
                @mousedown="mousedownLyricInnerWrapper"
                @mousemove="mousemoveLyricInnerWrapper"
                @mouseup="mouseupLyricInnerWrapper">
              <li class="lyric_item"
                  v-for="(item, index) in lastArr.lastArr"
                  :class="{active: lyricIndex === index}"
                  @click=""
                  @mousedown="mousedownLyricInnerWrapper($event, index)">{{item.lyric}}</li>
            </ul>
          </div>
        </div>
      </div>
    </teleport>

<!--    显示歌单里面的歌曲-->
    <teleport to="body">
<!--      外容器-->
      <div class="playlist_detail_out_wrapper" v-if="isShowPlaylistDetail" ref="playlistDetailOutWrapper">
        <div class="playlist_detail_title">当前播放列表</div>
<!--        可以滚动的内容器-->
        <ul class="playlist_detail_inner_wrapper">
          <li class="playlist_detail_item"
              v-for="(item, index) in store.state.playingPlaylist.songs"
              :class="{active: index === store.state.playingSongIndex,
                       even: index % 2 === 1}"
              @click.stop="handleClickOneSong(index)">
            <div class="song_name">{{item.name}}</div>
            <div class="singer_name">
              <span v-for="singer in item.ar">{{singer.name}}</span>&nbsp;
            </div>
            <div class="time_length">{{getSongTimeLengthInList(item.dt)}}</div>
<!--            删除按钮-->
<!--            stop: 阻止事件冒泡 -->
            <div class="delete_song" @click.stop="deleteSongInPlaylist(index)"></div>
          </li>
        </ul>
      </div>
    </teleport>

<!--    写评论遮罩层-->
    <teleport to="body">
      <div class="comment_written_mask" v-if="isShowWrittenCommentMask">
        <div class="comment_wrapper">
          <div class="close_comment" @click="isShowWrittenCommentMask = false">X</div>
          <textarea name="" id="" cols="30" rows="10" v-model="commentWritten"></textarea>
          <div class="comment_submit" @click="sendComment()">评论</div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, reactive, ref, toRefs, watch} from "vue";
import axios from "axios";
import {useStore} from "vuex";
import {parse} from "@vue/compiler-sfc";
import {useRoute, useRouter} from "vue-router";

  export default defineComponent({
    name: `Player`,
    setup() {
      let store = useStore()

      let musicId = computed(() => store.state.musicId)

      let router = useRouter()

      let route = useRoute()

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
        await newComment.getNewComment(1)

        newComment.currentPageNum = 1
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

      ///处理后的歌词
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
            if(dragLyric.isLyricMousedown === false && dragLyric.clickLyricIndex === -1) {
              //鼠标按下歌词时候不能自动滚动
              innerLyric.value.scrollTop = (lyricIndex.value - 5) * 35
            }
            break
          }
        }
      }

      //存储歌曲评论
      let commentList = reactive({commentList:[{user: {}, liked: false, likedCount:0, commentId: 0}]})

          /**
           * 获取歌曲评论
           */
      async function getCommentList() {
        let res = await axios({
          url: `http://localhost:3000/comment/music`,
          method: `get`,
          params: {
            id: store.state.musicId,
            limit: 5,
            cookie: store.state.cookie,
            time: new Date()
          }
        })
            console.log(res.data, `歌曲评论信息`);
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
       * 处理播放完当前音乐的事件
       * */
      function endedPlay() {
        //顺序播放
        if(playlistDetail.playlistState === 1) {
          store.commit(`changePlayingSongIndex`, store.state.playingSongIndex + 1)
        }else if(playlistDetail.playlistState === 2) {
          //单曲循环
          audio.value.play()
        }else{
          //随机播放
          let newIndex = Math.floor(Math.random() * store.state.playingPlaylist.songs.length)
          store.commit(`changePlayingSongIndex`, newIndex)
        }
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

      /**
       * 鼠标进入音量按钮的处理函数
       * */
      function handleVolumeBtnMouseenter() {
        isShowVolumeBox.value = true
        //等元素被创造出来在调节样式
        setTimeout(() => {
          volumeNowBar.value.style.height = `${audio.value.volume * 100}px`
          volumeBall.value.style.bottom = `${audio.value.volume * 100 - 5}px`
        }, 1)
      }

      /**
       * @brief 展示正在播放的歌单
       * @date 2022.3.5
       * */
      let playlistDetail = reactive({
        /**
         * 处理列表中的歌曲的时长
         * @param timeLength 歌曲总的毫秒数
         * */
          getSongTimeLengthInList(timeLength:number) {
            let temp = timeLength / 60000
            //分钟数
            let minNum:number = parseInt(temp.toString())
            let temp1 = (temp - minNum) * 60
            //秒数
            let secNum:number = parseInt(temp1.toString())
            if(secNum.toString().length === 1) return `${minNum}:0${secNum}`
            else return `${minNum}:${secNum}`
          },

          //是否显示播放列表详情
          isShowPlaylistDetail: false,

          /**
           * 点击列表按钮时，进行列表详情的显示和隐藏
           * */
          handleClickPlaylistBtn() {
            this.isShowPlaylistDetail = !this.isShowPlaylistDetail
            this.playingSongToCenter()
          },

          /**
           * 点击列表详情中的单曲时，切换正在播放的音乐
           * @index 点击单曲的索引值
           * */
          handleClickOneSong(index:number) {
            store.commit(`changePlayingSongIndex`, index)
          },

          /**
           * 点击上一首按钮的处理按钮
           * */
          clickLastSongBtn() {
            store.commit(`changePlayingSongIndex`, store.state.playingSongIndex - 1)
          },

          /**
           * 点击下一首按钮的处理函数
           * */
          clickNextSongBtn() {
            store.commit(`changePlayingSongIndex`, store.state.playingSongIndex + 1)
          },

          /**
           * @date 2022.3.5
           * @brief 展开歌单详情列表的时候，让正在播放的音乐尽可能显示在中间
           * */


          /**
           * 让正在播放的歌曲显示在列表的中央
           * */
          playingSongToCenter() {
            if(!this.isShowPlaylistDetail) return
            setTimeout(() => {
              playlistDetailOutWrapper.value.scrollTop = (store.state.playingSongIndex - 10) * 33
            }, 10)
          },

          //歌单播放的状态 0表示随机播放 1表示顺序播放 2表示单曲循环、
          playlistState: 1,

          /**
           * 点击播放方式时，改变播放方式
           * */
          changePlaylistState() {
            this.playlistState += 1
            if(this.playlistState === 3) this.playlistState = 0
          },

          /**
           * 点击删除按钮时，删除播放列表中的歌曲
           * @param index 要删除歌曲的索引值
           * */
          deleteSongInPlaylist(index:number) {
            console.log(`delete 按钮`);
            store.commit(`deleteElementOfPlayPlaylist`, index)
          }
      })

      //要滚动的dom元素
      let playlistDetailOutWrapper = ref()

      /**
       * @brief 歌词的拖拽和点击跳转播放点击的歌词
       * @date 2022.03.08
       * */
      let dragLyric = reactive({
        /**
         * 点击歌词时跳转到此歌词处播放
         * @param index 点击歌词的索引值
         * */
        clickJumpPlay(index:number) {
          // console.log(lastArr.lastArr);
          //如果点击的正在播放的那一句歌词，那么不动作
          if(index === lyricIndex.value){
          }else{
            audio.value.currentTime = lastArr.lastArr[index].time
          }
          //若处于暂停的状态，点击歌词应该变为播放状态
          audio.value.play()
        },

        //歌词内容器是否处于鼠标按下的状态
        isLyricMousedown: false,

        //歌词内容器是否处于鼠标移动的状态
        isLyricMousemove: false,

        //鼠标按下时的位置
        mousedownPositionY: 0,

        //鼠标按下并移动时的位置
        mousemovePositionY: 0,

        //歌词点击时滚动条位置
        mousedownScrollTopValue: 0,

        //鼠标按下的歌词的索引值 -1 表示没有按下
        clickLyricIndex : -1,

        //改变index的定时器(setTimeOut)
        changeIndexTimer: -1,

        /**
         * 鼠标调节歌词的位置, 处理鼠标按下事件
         * @param event 事件对象
         * @param index 鼠标按下的歌词的索引值
         * */
        mousedownLyricInnerWrapper(event:any, index = -1) {
          this.isLyricMousedown = true
          this.mousedownPositionY = event.screenY
          // console.log(innerLyric.value, `mousedown 的dom`);
          this.mousedownScrollTopValue = innerLyric.value.scrollTop
          if(index !== -1) {
            //不为-1 说明传入了值
            this.clickLyricIndex = index
          }
        },

        /**
         * 鼠标调节歌词的位置, 处理鼠标按下并移动事件
         * @param event 事件对象
         * */
        mousemoveLyricInnerWrapper(event:any) {
          if(this.isLyricMousedown) {
            this.isLyricMousemove = true

            //当鼠标按下时才动作
            this.mousemovePositionY = event.screenY
            // console.log(playlistDetailOutWrapper.value, `mousemove的dom`);
            innerLyric.value.scrollTop = this.mousedownScrollTopValue + ( this.mousedownPositionY - this.mousemovePositionY)
            // console.log(innerLyric.value.scrollTop);
          }
        },

        /**
         * 鼠标调节歌词的位置, 处理鼠标抬起事件
         * @param event 事件对象
         * */
        mouseupLyricInnerWrapper(event:any) {
          if(!this.isLyricMousemove) {
            //这里是点击
              this.clickJumpPlay(this.clickLyricIndex)
            this.clickLyricIndex = -1
          }else {
            //这里是拖动
            clearTimeout(this.changeIndexTimer)
            this.changeIndexTimer = setTimeout(() => {
              //拖动后两秒后再回滚到播放的位置
              this.clickLyricIndex = -1
            }, 1000)
          }
          this.isLyricMousedown = false
          this.isLyricMousemove = false
        }
      })

      /**
       * @brief 新版评论
       * @date 2022.03.09
       * */
      let newComment = reactive({
        //存储新版数组的数组
        newCommentArr: {newCommentArr:[{user:{}, liked: false, likedCount: 0, commentId: 0}]},

        //上次请求使用的cursor
        cursor: 0,

        //当前的页数
        currentPageNum: 1,

        /**
         * 获取新版评论
         * @param pageNum 页数
         * */
        async getNewComment(pageNum:number) {
          let res = {data:{data:{comments:[], cursor: 0}}};
          if(pageNum === 1) {
            res = await axios({
              url: `http://localhost:3000/comment/new`,
              method: `get`,
              params: {
                type: 0,
                pageSize: 10,
                id: store.state.musicId,
                sortType: 3,
                pageNum,
                time: new Date()
              }
            })
            this.newCommentArr.newCommentArr = res.data.data.comments
            this.cursor = res.data.data.cursor
          }else {
              res = await axios({
              url: `http://localhost:3000/comment/new`,
              method: `get`,
              params: {
                type: 0,
                pageSize: 10,
                id: store.state.musicId,
                sortType: 3,
                pageNo: pageNum,
                cursor: this.cursor,
                time: new Date()
              }
            })
            this.newCommentArr.newCommentArr.push(...res.data.data.comments)
            this.cursor = res.data.data.cursor
          }
          console.log(`新版评论`,res.data.data)
        },

        /**
         * 点击获取更多评论按钮的处理函数
         * */
        async getMoreComment() {
          this.currentPageNum += 1
          await this.getNewComment(this.currentPageNum)
        },

        /**
         * 根据是否点赞显示点赞图标的颜色
         * @param type 0表示热门评论 1表示新版评论
         * @param index
         * */
        getLikeImgSrc(type:number, index:number) {
          if(type === 1) {
            //热门评论
            if(this.newCommentArr.newCommentArr[index]) return require(`../assets/Player/like_black.png`)
            else return require(`../assets/Player/like_red.png`)
          }else if(type === 0) {
            if(commentList.commentList[index]) return require(`../assets/Player/like_black.png`)
            else return require(`../assets/Player/like_red.png`)
          }
        },

        /**
         * 点赞处理函数
         * @param type 0表示热门评论 1表示新版评论
         * @param index
         * */
        async handleClickLike(type:number, index:number) {
          if(type === 0) {
            //热门评论
            if(commentList.commentList[index].liked) {
              //取消点赞
              commentList.commentList[index].likedCount -= 1
              await this.likeComment(0, index, 0)
            }else{
              //点赞
              commentList.commentList[index].likedCount += 1
              await this.likeComment(0, index, 1)
            }
            commentList.commentList[index].liked = !commentList.commentList[index].liked
          }else if(type === 1) {
            //最新评论
            if(this.newCommentArr.newCommentArr[index].liked) {
              //取消点赞
              this.newCommentArr.newCommentArr[index].likedCount -= 1
              await this.likeComment(1, index, 0)
            }else{
              //点赞
              this.newCommentArr.newCommentArr[index].likedCount += 1
              await this.likeComment(1, index, 1)
            }
            this.newCommentArr.newCommentArr[index].liked = !this.newCommentArr.newCommentArr[index].liked
          }
        },

        /**
         * 给评论点赞
         * @param type 评论的类型
         * @param index 评论的索引值
         * @param t 点赞或取消点赞
         * */
        async likeComment(type:number, index:number, t:number) {
          let commentArr = [commentList.commentList, this.newCommentArr.newCommentArr]
          console.log(commentArr[type][index].commentId, `点赞评论id`)
          let res = await axios({
              url: `http://localhost:3000/comment/like`,
              method: `get`,
              params: {
                id: store.state.logInfo.profile.userId,
                cid: commentArr[type][index].commentId,
                t,
                type: 0,
                cookie: store.state.cookie,
                time: new Date()
              }
            })
          console.log(res.data);
        },

        /**
         * 写评论和回复评论
         * */
        //是否显示写评论遮罩层
        isShowWrittenCommentMask: false,
        //和v-modle绑定的 用户写的评论
        commentWritten: ``,

        //回复评论的id
        replyCommentId: null,

        //写评论的类型
        writtenCommentType: 1,

        /**
         * 发表评论
         * @param t 1表示发送评论 2 表示回复评论
         * */
        async sendComment() {
          this.isShowWrittenCommentMask = false
          await axios({
            url: `http://localhost:3000/comment`,
            method: `get`,
            params: {
              t: this.writtenCommentType,
              type: 0,
              id: store.state.musicId,
              content: this.commentWritten,
              commentId: this.replyCommentId,
              cookie: store.state.cookie
            }
          })
          this.replyCommentId = null
        },
        /**
         * 处理MV按钮的点击事件
         * */
      handleClickMvBtn() {
        isShowLyric.value = false
          router.push('/search')
        }
      })

      onBeforeMount(async () => {
        await getDetailMusic()
        await getLyric()
        handleLyric()
        await getCommentList()

        await newComment.getNewComment(1)
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
        endedPlay,

        //音量控制
        isShowVolumeBox,
        isVolumeBarMousedown,
        handleVolumeBarMousedown,
        volumeAllBar,
        volumeNowBar,
        volumeBall,
        handleVolumeBarMousemove,
        handleVolumeBarMouseleave,
        handleVolumeBtnMouseenter,

        //歌单里面歌曲的显示
        ...toRefs(playlistDetail),
        playlistDetailOutWrapper,

        ...toRefs(dragLyric),
        ...toRefs(newComment),
        newComment,
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
      width: 400px;
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;

      img {
        width: 67px;
        height: 67px;
        border-radius: 10px;
        &:hover {
          cursor: pointer;
        }
      }

      .song_info {
        width: 300px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 30px;
        //border: 1px solid #000;

        .left_name, .singer_name {
          width: 300px;
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
    width: 800px;
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
        cursor: pointer;

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
    width: 240px;
    height: 40px;
    //border: 1px solid #000;
    position: absolute;
    bottom: 5px;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;

    .SQ, .playListInfo, .volume, .song_shuffle, .song_order, .song_only .lyric{
      width: 40px;
      height: 40px;
      background: url("../assets/Player/SQ.png") no-repeat center center;
      background-size: 30px 30px;
      cursor: pointer;
    }

    .lyric {
      width: 40px;
      height: 40px;
      background: url("../assets/Player/lyric.png") no-repeat center center;
      background-size: 40px 40px;
      cursor: pointer;
    }

    .playListInfo {
      background: url("../assets/Player/playList.png") no-repeat center center;
      background-size: 25px 25px;
    }

    .song_shuffle {
      background: url("../assets/Player/shuffle.png") no-repeat center center;
      background-size: 25px 25px;
    }

    .song_order {
      background: url("../assets/Player/order.png") no-repeat center center;
      background-size: 25px 25px;
    }

    .song_only {
      width: 40px;
      height: 40px;
      background: url("../assets/Player/only.png") no-repeat center center;
      background-size: 25px 25px;
      cursor: pointer;
    }

    .song_mv {
      width: 40px;
      height: 40px;
      background: url("../assets/Player/mv.png") no-repeat center center;
      background-size: 35px 35px;
      cursor: pointer;
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
        z-index:4;

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
    z-index: 3;

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

        ///*拖动显示的线*/
        //.dashed_line {
        //  width: 50%;
        //  height: 1px;
        //  border: 1px dashed #000;
        //  position: absolute;
        //  top: 205px;
        //  left: 30%;
        //}

        .lyric_inner_wrapper {
          position: absolute;
          transition: .3s;
          user-select: none;
          cursor: pointer;

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
      display: flex;
      justify-content: center;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      .comment_write {
        width: 150px;
        font-size: 20px;
        line-height: 30px;
        text-align: center;
        padding-left: 30px;
        font-family: "楷体", serif;
        font-weight: bold;
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: #ccc;
        border-radius: 20px;
        border: 1px solid #ccc;
        background: url("../assets/Player/write_comment.png") no-repeat 10px center;
        background-size: 16px 16px;
        background-color: #fff;
        user-select: none;
        cursor: pointer;
      }
    }

    .comment_add_wrapper {
      width: 1000px;
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
        //height: 70px;
        padding-top: 10px;
        padding-right: 5px;
        flex-direction: row;
        flex-wrap: nowrap;
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;

        .img{
          width: 50px;
          height: 100%;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        .content_wrapper {
          width: 100%;
        }

        .content {
          padding-left: 20px;
          //height: 150px;
          min-height: 53px;
        }

        .comment_date_and_like_btn {
          padding-left: 20px;
          padding-right: 20px;
          display: flex;
          justify-content: space-between;
          height: 20px;

          .right_do {
            display: flex;
            flex-direction: row;
            user-select: none;

            .comment_like {
              width: 60px;
              height: 20px;
              line-height: 20px;
              cursor: pointer;
              background: url("../assets/Player/like_black.png") no-repeat 2px center;
              background-size: 16px 16px;
              padding-left: 20px;

              &.active {
                background: url("../assets/Player/like_red.png") no-repeat 2px center;
                background-size: 16px 16px;
              }

              img {
                width: 16px;
                height: 16px;
              }
            }

            .comment_share {
              width: 20px;
              height: 20px;
              background: url("../assets/Player/share.png") no-repeat center center;
              background-size: 16px 16px;
              cursor: pointer;
            }

            .comment_reply {
              width: 20px;
              height: 20px;
              background: url("../assets/Player/reply.png") no-repeat center center;
              background-size: 16px 16px;
              margin-left: 20px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

    .new_comment {margin-top: 30px;
      width: 100%;

      .new_comment_title {
        font-size: 20px;
        color: #000;
        font-family: "楷体", serif;
        font-weight: bolder;
        border-radius: 20px;
        border:1px solid #000;
        background-color: #ccc;
        text-align: center;
      }

      .new_comment_wrapper {
        width: 100%;

        .comment_item{
          display: flex;
          width: 100%;
          //height: 70px;
          padding-top: 10px;
          padding-right: 5px;
          flex-direction: row;
          flex-wrap: nowrap;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;

          .img{
            width: 50px;
            height: 100%;

            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }

          .content_wrapper {
            width: 100%;
          }

          .content {
            padding-left: 20px;
            //height: 150px;
            min-height: 53px;
          }

          .comment_date_and_like_btn {
            padding-left: 20px;
            padding-right: 20px;
            display: flex;
            justify-content: space-between;
            height: 20px;

            .right_do {
              display: flex;
              flex-direction: row;
              user-select: none;

              .comment_like {
                width: 60px;
                height: 20px;
                line-height: 20px;
                cursor: pointer;
                padding-left: 20px;
                background: url("../assets/Player/like_black.png") no-repeat 2px center;
                background-size: 16px 16px;

                &.active {
                  background: url("../assets/Player/like_red.png") no-repeat 2px center;
                  background-size: 16px 16px;
                }
              }

              .comment_share {
                width: 20px;
                height: 20px;
                background: url("../assets/Player/share.png") no-repeat center center;
                background-size: 16px 16px;
                cursor: pointer;
              }

              .comment_reply {
                width: 20px;
                height: 20px;
                background: url("../assets/Player/reply.png") no-repeat center center;
                background-size: 16px 16px;
                margin-left: 20px;
                cursor: pointer;
              }
            }
          }
        }

      }

      .show_more_wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
        height: 60px;
      }

      .show_more_button {
        width: 200px;
        text-align: center;
        border: 1px solid #ccc;
        font-weight: bolder;
        font-family: "楷体", serif;
        background-color: #fff;
        height: 30px;
        font-size: 20px;
        line-height: 30px;
        border-radius: 20px;
        user-select: none;
        cursor: pointer;
      }
    }

  .playlist_detail_out_wrapper {
    position: absolute;
    right: 0;
    top: 70px;
    bottom: 70px;
    //border: 1px solid #000;
    width: 400px;
    z-index: 10000;
    background: #fff;
    padding: 20px 10px 20px 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc;
    overflow-x: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 5px;
      border-radius: 5px;
      height: 100%;
      background-color: #666666;
    }

    &::-webkit-scrollbar-track {
      width: 5px;
      border-radius: 5px;
      height: 100%;
      background-color: #ddd;
    }

    &::-webkit-scrollbar-thumb {
      width: 5px;
      border-radius: 20px;
      height: 50px;
      background-color: #C20C0C;
    }

    .playlist_detail_title {
      height: 30px;
      font-size: 20px;
      line-height: 30px;
      font-family: "楷体", serif;
      font-weight: bolder;
    }

    .playlist_detail_inner_wrapper {
      display: flex;
      flex-direction: column;
      width: 360px;

      .playlist_detail_item {
        width: 100%;
        height: 25px;
        line-height: 25px;
        border: 1px solid #aaa;
        margin-bottom: 8px;
        padding-left: 25px;
        font-size: 8px;
        display: flex;
        flex-direction: row;
        user-select: none;
        cursor: pointer;
        border-radius: 12.5px;

        /* 偶数的 item 加深背景颜色 */
        &.even {
          background-color: #dcdcdc;
        }

        &:hover {
          .time_length {
            color: #666;
          }

          .delete_song {
            opacity: 1;
          }
        }

        &.active {
          color: #C20C0C;
          font-weight: bolder;
          background-image : url('../assets/Player/playing.png');
          background-size: 10px 10px;
          background-repeat: no-repeat;
          background-position: 10px center;
          border: 1px solid #C20C0C;
          .time_length {
            color: #C20C0C;
          }
        }

        .song_name, .singer_name {
          width: 150px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .singer_name {
          width: 100px;
          margin-left: 10px;
          margin-right: 10px;
          font-size: 5px;
          span {
            font-size: 5px;
          }
        }

        .time_length {
          width: 70px;
          color: #bbb;
        }

        .delete_song {
          width: 25px;
          height: 25px;
          background: url("../assets/Player/delete.png") no-repeat center center;
          background-size: 15px 15px;
          opacity: 0;
          transition: .5s;
        }
      }
    }
  }

  .comment_written_mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .comment_wrapper {
      background-color: #fff;
      width: 400px;
      height: 330px;
      padding: 40px 20px 20px;
      position: relative;
      border-radius: 20px;

      .close_comment {
        position: absolute;
        top: 10px;
        right: 20px;
        user-select: none;
        font-size: 20px;
        font-weight: bolder;
        color: #000;
        //margin-bottom: 20px;
        cursor: pointer;
      }

      textarea {
        width: 360px;
        height: 200px;
        font-weight: bolder;
        font-size: 18px;
        padding: 10px;
        font-family: "楷体", serif;
      }

      .comment_submit {
        position: absolute;
        right: 30px;
        bottom: 30px;
        width: 100px;
        height: 30px;
        background-color: #C20C0C;
        border-radius: 20px;
        font-size: 20px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-weight: bolder;
        font-family: "楷体", serif;
        user-select: none;
        cursor: pointer;
      }
    }
  }
</style>