<template>
  <div class="content">
<!--    左侧菜单-->
    <div class="left_menu">
      <ul class="left_base_menu">
        <li class="left_menu_item"><router-link to="/home" active-class="active">发现音乐</router-link></li>
        <li class="left_menu_item"><router-link to="/podcast" active-class="active">播客</router-link></li>
        <li class="left_menu_item"><router-link to="/audio" active-class="active">视频</router-link></li>
        <li class="left_menu_item"><router-link to="/streaming" active-class="active">直播</router-link></li>
      </ul>
      <div class="left_mine_menu">
        <div class="mine_title" @click="isShowMineSong = ~isShowMineSong; getMineSong()">
          <span>创建的歌单</span>
          <div class="fold_img"></div>
        </div>
        <div class="mine_songs" v-show="isShowMineSong">
          <div class="mine_create_songs"
               v-for="(item, index) in store.state.userPlayList"
               @click="handleClickPlaylist(index)">
              <div class="like_img" v-if="index === 0"></div>
              <span v-if="index === 0">我喜欢的音乐</span>
              <div class="song_img" v-if="index !== 0"></div>
              <span v-if="index !== 0">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
<!--    右侧内容-->
    <div class="right_content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive, ref, toRefs} from "vue";
import {useStore} from "vuex";
import axios from "axios";

axios.defaults.withCredentials = true

export default defineComponent({
  name: `Content`,
  components: {},
  setup() {
    /**
     * @date 2022.2.6
     * @brief 左侧导航菜单
     * */

    let store = useStore()

    //是否展开用户歌单
    let isShowMineSong = ref(0)

    let userPlayList = reactive({playlist: []})
    //用于存储用户歌单


    /**
     * 获取用户歌单
     * */
    async function getMineSong() {
      if(userPlayList.playlist.length === 0 && store.state.logInfo.status) {
        console.log(`向服务器发送请求，获取用户歌单`);
        //当本地没有用户歌单时，才向服务器发送请求
        let res = await axios({
          url: `http://localhost:3000/user/playlist?uid=${store.state.logInfo.profile.userId}`,
          method: "get",
        })
        console.log(res.data, 111)
        if(res.data.code === 200) {
          console.log(res.data.playlist);
          userPlayList.playlist = res.data.playlist
        }
      }
    }

    /**
     * 点击歌单时的处理函数
     * @param index 歌单的索引值
     * */
    function handleClickPlaylist(index:number) {
      store.dispatch(`getSongsListInOnePlaylist`, index)
    }

    onBeforeMount(async () => {
      await store.dispatch(`getUserPlayList`)
    })

    return {
      store,

      isShowMineSong,
      userPlayList,
      getMineSong,
      ...toRefs(userPlayList),
      handleClickPlaylist
    }
  }

})
</script>

<style scoped lang="less">
  .content {
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;

    .left_menu {
      width: 240px;
      height: 100%;
      padding-left: 20px;
      padding-top: 20px;
      border-right: 3px solid #ccc;
      overflow: hidden;

      .left_base_menu {

        text-decoration: none;

        .left_menu_item {
          margin-top: 10px;
          padding-left: 30px;
          width: 220px;
          height: 30px;
          font-size: 20px;
          line-height: 30px;
          //background: rgb(220, 220, 220);
          font-family: "楷体",sans-serif;
          font-weight: bolder;
          border-radius: 15px 0 0 15px;
          text-align: center;
          overflow: hidden;

          a {
            display: block;
            text-decoration: none;
            color: #000;
            width: 100%;
            height: 100%;
            border-radius: 15px 0 0 15px;

            &.active {
              background: rgb(220, 220, 220);
            }
          }
        }
      }

      .left_mine_menu {
        padding-left: 30px;
        margin-top: 30px;
        .mine_title {
          height: 20px;
          width: 220px;
          font-size: 18px;
          line-height: 20px;
          color: #aaa;
          display: flex;
          user-select:none;

          &:hover {
            cursor: pointer;
          }

          .fold_img {
            margin-left: 5px;
            background: url("../assets/Content/fold.png") no-repeat center center;
            background-size: 16px 16px;
            width: 20px;
            height: 20px;
          }
        }
      }

      .mine_songs {
        padding-left: 10px;
       .mine_like, .mine_create_songs {
         margin-top: 10px;
         width: 220px;
         height: 25px;
         font-size: 16px;
         line-height: 25px;
         display: flex;
         user-select:none;
         cursor: pointer;

         .song_img, .like_img {
           width: 25px;
           height: 25px;
           background: url("../assets/Content/like.png") no-repeat center center;
           background-size: 20px 20px;
         }

         .song_img {
           background: url("../assets/Content/song.png") no-repeat center center;
           background-size: 20px 20px;
         }
       }
      }
    }

    .right_content {
      width: 100%;
      height: 100%;
      padding: 25px;
    }
  }
</style>