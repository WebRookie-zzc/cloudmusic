<template>
  <div class="exclusive">
    <h2 v-if="!store.state.logInfo.status">请先登录。。。。</h2>
    <div v-else class="exclusive_wrapper">
      <div class="mine_playlist">
        <div class="playlist_title">你的雷达歌单</div>
        <div class="button_box">
          <div class="before_button">&lt;</div>
          <div class="next_button">&gt;</div>
        </div>
        <div class="playlist_item_box">
          <ul class="playlist_item_wrapper">
            <li class="play_item" v-for="(item, index) in recommendPlaylist.recommendPlaylist">
              <img :src="item.picUrl" alt="playlist">
              <div class="playlist_name">{{item.name}}</div>
              <div class="play_button"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive} from "vue";
  import {useStore} from "vuex";
import axios from "axios";

  export default defineComponent({
    name: `Exclusive`,
    setup() {
      let store = useStore()
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

      onBeforeMount(async () => {
        await getRecommendPlaylist()
      })

      return {
        store,

        recommendPlaylist
      }
    }
  })
</script>

<style scoped lang="less">

</style>