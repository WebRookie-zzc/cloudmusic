<template>
  <div class="player">
    <div class="left_info">
      <img :src="musicDetail.musicDetail[0].al.picUrl" alt="" @click="isShowLyric = !isShowLyric">
      <div class="left_name">{{musicDetail.musicDetail[0].name}}</div>
      <ul class="singer_name">
        <li v-for="item in musicDetail.musicDetail[0].ar">{{item.name}}</li>
      </ul>
    </div>
    <audio :src="musicUrl" controls ref="audio" @timeupdate="handleTimeUpdate"></audio>
    <teleport to="body">
      <div class="player_content" v-show="isShowLyric">
        <div class="left_img">
          <img :src="musicDetail.musicDetail[0].al.picUrl" alt="">
        </div>
        <!--                  评论容器-->
        <ul class="comment_wrapper">
          <li class="title">热门评论 >></li>
          <li class="comment_item" v-for="item in commentList.commentList">
            <div class="img"><img :src="item.user.avatarUrl" alt=""></div>
            <div class="content">
              <span style="color: #00f">{{item.user.nickname}}:</span>{{item.content}}
            </div>
          </li>
        </ul>
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
        console.log(res.data.songs);
        musicDetail.musicDetail = res.data.songs
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
        updatePlayerLyric()
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

        commentList
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
    overflow: hidden;

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

  .player_content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 70px;
    //border: 3px solid #0f0;
    background-color: #eae6e6;
    z-index: 10000;

    .left_img {
      width: 300px;
      height: 300px;
      position: absolute;
      left: 200px;
      top: 250px;
      &:hover {
        cursor: pointer;
      }

      img {
        width: 400px;
        height: 400px;
        border-radius: 30px;
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
        height: 650px;
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

    .comment_wrapper {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 600px;
      bottom: 0px;
      overflow-y: scroll;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      .title {
        font-size: 40px;
        color: #C20C0C;
        font-family: "楷体", serif;
        font-weight: bolder;
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