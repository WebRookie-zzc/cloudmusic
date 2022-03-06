<template>
<<<<<<< HEAD
<<<<<<< HEAD
  <div class="exclusive" ref="exclusive" @scroll="scroll">
    <h2 v-if="!store.state.logInfo.status">请先登录。。。。</h2>
    <div v-if="store.state.logInfo.status" class="exclusive_wrapper"  @scroll="scroll">
      <div class="mine_playlist">
        <div class="playlist_title">你的雷达歌单</div>
        <div class="button_box">
          <div class="before_button"
               @click="isMoveWrapperUl = false">&lt;</div>
          <div class="next_button"
               @click="isMoveWrapperUl = true">&gt;</div>
        </div>
        <div class="playlist_item_box">
          <ul class="playlist_item_wrapper" :class="{playlist_item_wrapper_tran:isMoveWrapperUl}">
=======
  <div class="exclusive">
=======
  <div class="exclusive" ref="exclusive" @scroll="scroll">
>>>>>>> 9f1452e (2022.2.14)
    <h2 v-if="!store.state.logInfo.status">请先登录。。。。</h2>
    <div v-if="store.state.logInfo.status" class="exclusive_wrapper"  @scroll="scroll">
      <div class="mine_playlist">
        <div class="playlist_title">你的雷达歌单</div>
        <div class="button_box">
          <div class="before_button"
               @click="isMoveWrapperUl = false">&lt;</div>
          <div class="next_button"
               @click="isMoveWrapperUl = true">&gt;</div>
        </div>
        <div class="playlist_item_box">
<<<<<<< HEAD
          <ul class="playlist_item_wrapper">
>>>>>>> 3fac76e (2022.2.12)
=======
          <ul class="playlist_item_wrapper" :class="{playlist_item_wrapper_tran:isMoveWrapperUl}">
>>>>>>> 9f1452e (2022.2.14)
            <li class="play_item" v-for="(item, index) in recommendPlaylist.recommendPlaylist">
              <img :src="item.picUrl" alt="playlist">
              <div class="playlist_name">{{item.name}}</div>
              <div class="play_button"></div>
            </li>
          </ul>
        </div>
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9f1452e (2022.2.14)
<!--      我的音乐假期-->
      <div class="mine_music_holiday">
        <div class="holiday_title">我的音乐假期</div>
        <ul class="holiday_item_wrapper">
          <li class="holiday_item" v-for="item in belowPlaylist.belowPlaylist">
            <img :src="item.picUrl" alt="">
            <div class="holiday_name">{{item.name}}</div>
          </li>
        </ul>
<!--        返回顶部按钮-->
        <teleport to="body">
          <div class="scroll_to_top"
               @click="exclusive.scrollTop = 0"></div>
        </teleport>
      </div>
<<<<<<< HEAD
=======
>>>>>>> 3fac76e (2022.2.12)
=======
>>>>>>> 9f1452e (2022.2.14)
    </div>
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
<<<<<<< HEAD
import {defineComponent, onBeforeMount, reactive, ref} from "vue";
=======
import {defineComponent, onBeforeMount, reactive} from "vue";
>>>>>>> 3fac76e (2022.2.12)
=======
import {defineComponent, onBeforeMount, reactive, ref} from "vue";
>>>>>>> 9f1452e (2022.2.14)
  import {useStore} from "vuex";
import axios from "axios";

  export default defineComponent({
    name: `Exclusive`,
    setup() {
      let store = useStore()
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 3fac76e (2022.2.12)
=======

>>>>>>> 9f1452e (2022.2.14)
      /**
       * @date 2022.2.8
       * @brief 推荐歌单
       * */

      //用于存储获取到的推荐歌单
      let recommendPlaylist = reactive({recommendPlaylist: []})

      /**
       * 获取推荐歌单(登录后才可以调用)
       * */
      async function getRecommendPlaylist() {
        let res = await axios({
          url: `http://localhost:3000/recommend/resource`,
          method: "post",
          params: {
            cookie: store.state.cookie
          }
        })
        console.log(res.data);
        recommendPlaylist.recommendPlaylist = res.data.recommend
      }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9f1452e (2022.2.14)
      //是否移动 wrapper_box
      let isMoveWrapperUl = ref(false)

      //页码数
      let pageNum = ref(3)

      //存储下部的推荐歌单
      let belowPlaylist = reactive({belowPlaylist: []})

      /**
       * 获取推荐歌单
       * */
      async function getPlaylistRec() {
        let res = await axios({
          url: `http://localhost:3000/personalized`,
          method: `get`,
          params: {
            category: 0,
            limit: 5 * pageNum.value
          }
        })
        console.log(res.data);
        belowPlaylist.belowPlaylist = res.data.result
      }

      /**
       * @date 2022.2.14
       * @brief 当滚轮画到底部时，再请求数据
       * */

      //获取dom元素
      let exclusive = ref();

      //滚动事件的定时器，防止高频触发scroll事件
      let scrollTimer:number;

      /**
       * 处理滚动事件
       * */
      function scroll() {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(async() => {
          console.log(exclusive.value.offsetHeight);
          console.log(exclusive.value.scrollTop);
          if(exclusive.value.scrollTop + exclusive.value.clientHeight === exclusive.value.scrollHeight){
            //当滚轮滑到底部的时候
            pageNum.value += 2
            await getPlaylistRec()
          }
        }, 200)
      }

      onBeforeMount(async () => {
        await getRecommendPlaylist()
        await getPlaylistRec()
<<<<<<< HEAD
=======
      onBeforeMount(async () => {
        await getRecommendPlaylist()
>>>>>>> 3fac76e (2022.2.12)
=======
>>>>>>> 9f1452e (2022.2.14)
      })

      return {
        store,

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9f1452e (2022.2.14)
        recommendPlaylist,
        isMoveWrapperUl,
        pageNum,
        getPlaylistRec,
        belowPlaylist,
        scroll,
        exclusive
<<<<<<< HEAD
=======
        recommendPlaylist
>>>>>>> 3fac76e (2022.2.12)
=======
>>>>>>> 9f1452e (2022.2.14)
      }
    }
  })
</script>

<style scoped lang="less">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9f1452e (2022.2.14)
  .exclusive {
    overflow: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  .exclusive_wrapper {
    width: 1150px;
    padding: 30px;

    .mine_playlist {
      width: 100%;
      position: relative;

      .playlist_title {
        font-family: "楷体", serif;
        font-weight: bolder;
        font-size: 25px;
        width: 150px;
        height: 30px;
        line-height: 30px;
        color: #000;
        }

      .button_box {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 50px;
        height: 20px;
        display: flex;

        .before_button, .next_button {
          border-radius: 50%;
          height: 20px;
          width: 20px;
          font-size: 20px;
          background: #ccc;
          text-align: center;
          user-select: none;

          &:hover {
            cursor: pointer;
          }
          //border: 2px solid #aaa;
        }

        .next_button {
          margin-left: 5px;
        }
      }

      .playlist_item_box {
        width: 100%;
        height: 250px;
        overflow: hidden;
        margin-top: 20px;

        .playlist_item_wrapper_tran{
          transform: translate(-654px, 0);
        }

        ul.playlist_item_wrapper {
          width: 1680px;
          display: flex;
          flex-direction: row;
          transition: .5s;
          .play_item {
            width: 200px;
            height: 240px;
            margin-left: 9px;
            margin-right: 9px;
            margin-top: 1px;
            position: relative;

            img {
              width: 200px;
              height: 200px;
              border-radius: 15px;
            }

            .play_button {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: rgba(255, 255, 255, .8) url("../../../assets/Content/Recommend/play_red.png") no-repeat center center;
              background-size: 25px 25px;
              position: absolute;
              right: 5px;
              bottom: 45px;
            }
          }
        }
      }
    }

    .mine_music_holiday {
      width: 100%;

      .holiday_title {
        width: 150px;
        font-family: "楷体", serif;
        font-weight: bolder;
        font-size: 25px;
        height: 30px;
        line-height: 30px;
        color: #000;
      }

      .holiday_item_wrapper {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .holiday_item {
          width: 200px;
          height: 240px;
          margin-right: 9px;
          margin-left: 9px;

          img {
            width: 200px;
            height: 200px;
            border-radius: 15px;
          }
        }
      }
    }
}

  body {
    position: relative;
  }
  .scroll_to_top {
    position: absolute;
    bottom: 100px;
    right: 30px;
    background: url("../../../assets/Content/goToTop.png") no-repeat;
    background-size: 30px 30px;
    width: 30px;
    height: 30px;
    z-index: 98;
    &:hover {
     cursor: pointer;
    }
  }
<<<<<<< HEAD
=======

>>>>>>> 3fac76e (2022.2.12)
=======
>>>>>>> 9f1452e (2022.2.14)
</style>