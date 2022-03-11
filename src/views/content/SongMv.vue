<template>
  <div class="search_view">
    <ul class="song_mv_list" v-if="isShowMvList">
      <li class="mv_list_item" v-for="(item, index) in mlogArr.mlogArr">
        <div class="mv_img" @click="handleClickMvImg(index)">
          <img :src="item.resource.mlogBaseData.coverUrl" alt="">
        </div>
        <div class="mv_title">{{item.resource.mlogBaseData.originalTitle}}</div>
      </li>
    </ul>
    <div class="mv" v-if="!isShowMvList">
      <div class="back_wrapper">
        <div class="back_button">&lt;</div>
      </div>
      <video controls :src="mvUrl"></video>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, onBeforeMount, reactive, toRefs} from "vue";
import axios from "axios"
import {useStore} from "vuex";

export default defineComponent({
  name: `SongMv`,
  setup() {
    let store = useStore()

    let search = reactive({
      //存储mlog数组
      mlogArr: {mlogArr: []},
      /**
       * 获取相关歌曲的mlog信息
       * */
      async getSearchList() {
        let res = await axios({
          url: "http://localhost:3000/mlog/music/rcmd",
          method: `get`,
          params: {
            // songid: 435278010,
            // songid: store.state.musicId
            songid: 435278010,
            limit: 11
          }
        })
        console.log(res.data, `mv`);
        this.mlogArr.mlogArr = res.data.data.feeds
      },

      /**
       * 点击MV图片时，的处理函数
       * @param index 点击图片的索引值
       * */
      async handleClickMvImg(index) {
        this.isShowMvList = false
        /**
         * 将mlog 转换为vid
         * */
        let res = await axios({
          url: `http://localhost:3000/mlog/to/video`,
          method: `get`,
          params: {
            id: this.mlogArr.mlogArr[index].id
          }
        })
        console.log(res.data);
        //视频的vid
        let vid = res.data.data
        console.log(vid);
        /**
         * 获取视频的播放地址
         * */
        let res1 = await axios({
          url: `http://localhost:3000/video/url`,
          method: `get`,
          params: {
            id: vid
          }
        })
        console.log(res1.data);
        this.mvUrl = res1.data.urls[0].url
        // console.log(this.mvUrl, `mvUrl`);
      },

      //是否显示mv列表
      isShowMvList: true,

      //MV的url
      mvUrl: ``
    })

    onBeforeMount(async () => {
      await search.getSearchList()
    })
    return {
      ...toRefs(search)
    }
  }
})
</script>

<style scoped lang="less">
  .search_view {
    width: 100%;
    height: 90%;
    //border: 1px solid #000;
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    min-width: 1200px;
    justify-content: center;

    .song_mv_list {
      width: 1200px;
      display: flex;
      flex-direction: row;
      //justify-content: space-around;
      flex-wrap: wrap;

      .mv_list_item {
        width: 350px;
        height: 250px;
        //border: 1px solid #000;
        margin: 10px 15px;

        .mv_img, img {
          width: 350px;
          height: 200px;
          border-radius: 10px;
          cursor: pointer;
        }

        .mv_title {
          width: 100%;
          padding-left: 10px;
          padding-right: 10px;
          padding-top: 10px;
          height: 40px;
          font-family: "楷体", serif;
          font-size: 16px;
          font-weight: bolder;
        }
      }
    }

    .mv {
      width: 100%;
      height: 100%;
      //border: 1px solid #000;

      .back_wrapper {
        width: 100%;
        height: 20px;

        .back_button {
          width: 20px;
          height: 20px;
          text-align: center;
          font-size: 20px;
          line-height: 20px;
          font-weight: bolder;
        }
      }


      video {
        width: 100%;
        //height: 90%;
      }
    }

  }
</style>