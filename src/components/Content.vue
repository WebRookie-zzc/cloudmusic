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
          <div class="mine_create_songs" v-for="(item, index) in userPlayList.playlist">
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
<<<<<<< HEAD
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
=======
      <router-view></router-view>
>>>>>>> 3fac76e (2022.2.12)
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "vue";
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

<<<<<<< HEAD
<<<<<<< HEAD
    let userPlayList = reactive({playlist: []})
    //用于存储用户歌单

=======
    //用于存储用户歌单
    let userPlayList = reactive({
      playlist: [
        {
          "subscribers": [],
          "subscribed": false,
          "creator": {
            "defaultAvatar": false,
            "province": 360000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 360100,
            "birthday": 0,
            "userId": 3346081755,
            "userType": 0,
            "nickname": "不会HTML的菜鸡",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165401327420,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "authenticationTypes": 0,
            "avatarDetail": null,
            "avatarImgIdStr": "109951165401327429",
            "backgroundImgIdStr": "109951162868126486",
            "anchor": false,
            "avatarImgId_str": "109951165401327429"
          },
          "artists": null,
          "tracks": null,
          "updateFrequency": null,
          "backgroundCoverId": 0,
          "backgroundCoverUrl": null,
          "titleImage": 0,
          "titleImageUrl": null,
          "englishTitle": null,
          "opRecommend": false,
          "recommendInfo": null,
          "subscribedCount": 0,
          "cloudTrackCount": 0,
          "userId": 3346081755,
          "totalDuration": 0,
          "coverImgId": 109951166933121520,
          "privacy": 0,
          "trackUpdateTime": 1643173133328,
          "trackCount": 26,
          "updateTime": 1642253370388,
          "commentThreadId": "A_PL_0_5036314168",
          "coverImgUrl": "https://p1.music.126.net/9VVOXvIO4WHk1R7mVMSkhw==/109951166933121523.jpg",
          "specialType": 5,
          "anonimous": false,
          "createTime": 1590498593931,
          "highQuality": false,
          "newImported": false,
          "trackNumberUpdateTime": 1642253370388,
          "playCount": 10,
          "adType": 0,
          "description": null,
          "tags": [],
          "ordered": false,
          "status": 0,
          "name": "不会HTML的菜鸡喜欢的音乐",
          "id": 5036314168,
          "coverImgId_str": "109951166933121523",
          "sharedUsers": null,
          "shareStatus": null
        },
        {
          "subscribers": [],
          "subscribed": false,
          "creator": {
            "defaultAvatar": false,
            "province": 360000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 360100,
            "birthday": 0,
            "userId": 3346081755,
            "userType": 0,
            "nickname": "不会HTML的菜鸡",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165401327420,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "authenticationTypes": 0,
            "avatarDetail": null,
            "avatarImgIdStr": "109951165401327429",
            "backgroundImgIdStr": "109951162868126486",
            "anchor": false,
            "avatarImgId_str": "109951165401327429"
          },
          "artists": null,
          "tracks": null,
          "updateFrequency": null,
          "backgroundCoverId": 0,
          "backgroundCoverUrl": null,
          "titleImage": 0,
          "titleImageUrl": null,
          "englishTitle": null,
          "opRecommend": false,
          "recommendInfo": null,
          "subscribedCount": 0,
          "cloudTrackCount": 0,
          "userId": 3346081755,
          "totalDuration": 0,
          "coverImgId": 109951166654674930,
          "privacy": 0,
          "trackUpdateTime": 1643173362339,
          "trackCount": 19,
          "updateTime": 1643173362224,
          "commentThreadId": "A_PL_0_5352592913",
          "coverImgUrl": "https://p1.music.126.net/2LcjMMpl4Ijid812gkEooQ==/109951166654674931.jpg",
          "specialType": 0,
          "anonimous": false,
          "createTime": 1606445191314,
          "highQuality": false,
          "newImported": false,
          "trackNumberUpdateTime": 1643173362224,
          "playCount": 4,
          "adType": 0,
          "description": null,
          "tags": [],
          "ordered": false,
          "status": 0,
          "name": "日常",
          "id": 5352592913,
          "coverImgId_str": "109951166654674931",
          "sharedUsers": null,
          "shareStatus": null
        },
        {
          "subscribers": [],
          "subscribed": false,
          "creator": {
            "defaultAvatar": false,
            "province": 360000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 360100,
            "birthday": 0,
            "userId": 3346081755,
            "userType": 0,
            "nickname": "不会HTML的菜鸡",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165401327420,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "authenticationTypes": 0,
            "avatarDetail": null,
            "avatarImgIdStr": "109951165401327429",
            "backgroundImgIdStr": "109951162868126486",
            "anchor": false,
            "avatarImgId_str": "109951165401327429"
          },
          "artists": null,
          "tracks": null,
          "updateFrequency": null,
          "backgroundCoverId": 0,
          "backgroundCoverUrl": null,
          "titleImage": 0,
          "titleImageUrl": null,
          "englishTitle": null,
          "opRecommend": false,
          "recommendInfo": null,
          "subscribedCount": 0,
          "cloudTrackCount": 0,
          "userId": 3346081755,
          "totalDuration": 0,
          "coverImgId": 109951165671947090,
          "privacy": 0,
          "trackUpdateTime": 1643899114303,
          "trackCount": 12,
          "updateTime": 1626365227197,
          "commentThreadId": "A_PL_0_5351437362",
          "coverImgUrl": "https://p1.music.126.net/499AYZ3epP1T7GJYvnJZZQ==/109951165671947083.jpg",
          "specialType": 0,
          "anonimous": false,
          "createTime": 1606363434675,
          "highQuality": false,
          "newImported": false,
          "trackNumberUpdateTime": 1626365227197,
          "playCount": 2,
          "adType": 0,
          "description": null,
          "tags": [],
          "ordered": false,
          "status": 0,
          "name": "歌单2",
          "id": 5351437362,
          "coverImgId_str": "109951165671947083",
          "sharedUsers": null,
          "shareStatus": null
        },
        {
          "subscribers": [],
          "subscribed": false,
          "creator": {
            "defaultAvatar": false,
            "province": 360000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 360100,
            "birthday": 0,
            "userId": 3346081755,
            "userType": 0,
            "nickname": "不会HTML的菜鸡",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165401327420,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "authenticationTypes": 0,
            "avatarDetail": null,
            "avatarImgIdStr": "109951165401327429",
            "backgroundImgIdStr": "109951162868126486",
            "anchor": false,
            "avatarImgId_str": "109951165401327429"
          },
          "artists": null,
          "tracks": null,
          "updateFrequency": null,
          "backgroundCoverId": 0,
          "backgroundCoverUrl": null,
          "titleImage": 0,
          "titleImageUrl": null,
          "englishTitle": null,
          "opRecommend": false,
          "recommendInfo": null,
          "subscribedCount": 0,
          "cloudTrackCount": 0,
          "userId": 3346081755,
          "totalDuration": 0,
          "coverImgId": 109951166919194720,
          "privacy": 0,
          "trackUpdateTime": 1644040052994,
          "trackCount": 446,
          "updateTime": 1644040052939,
          "commentThreadId": "A_PL_0_5347140534",
          "coverImgUrl": "https://p1.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg",
          "specialType": 0,
          "anonimous": false,
          "createTime": 1606286497541,
          "highQuality": false,
          "newImported": false,
          "trackNumberUpdateTime": 1644040052939,
          "playCount": 4,
          "adType": 0,
          "description": null,
          "tags": [],
          "ordered": false,
          "status": 0,
          "name": "新建歌单1",
          "id": 5347140534,
          "coverImgId_str": "109951166919194723",
          "sharedUsers": null,
          "shareStatus": null
        }
      ],
      // playlist: ``
    })
>>>>>>> 3fac76e (2022.2.12)
=======
    let userPlayList = reactive({playlist: []})
    //用于存储用户歌单
    // let userPlayList = reactive({
    //   playlist: [
    //     {
    //       "subscribers": [],
    //       "subscribed": false,
    //       "creator": {
    //         "defaultAvatar": false,
    //         "province": 360000,
    //         "authStatus": 0,
    //         "followed": false,
    //         "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
    //         "accountStatus": 0,
    //         "gender": 0,
    //         "city": 360100,
    //         "birthday": 0,
    //         "userId": 3346081755,
    //         "userType": 0,
    //         "nickname": "不会HTML的菜鸡",
    //         "signature": "",
    //         "description": "",
    //         "detailDescription": "",
    //         "avatarImgId": 109951165401327420,
    //         "backgroundImgId": 109951162868126480,
    //         "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
    //         "authority": 0,
    //         "mutual": false,
    //         "expertTags": null,
    //         "experts": null,
    //         "djStatus": 0,
    //         "vipType": 0,
    //         "remarkName": null,
    //         "authenticationTypes": 0,
    //         "avatarDetail": null,
    //         "avatarImgIdStr": "109951165401327429",
    //         "backgroundImgIdStr": "109951162868126486",
    //         "anchor": false,
    //         "avatarImgId_str": "109951165401327429"
    //       },
    //       "artists": null,
    //       "tracks": null,
    //       "updateFrequency": null,
    //       "backgroundCoverId": 0,
    //       "backgroundCoverUrl": null,
    //       "titleImage": 0,
    //       "titleImageUrl": null,
    //       "englishTitle": null,
    //       "opRecommend": false,
    //       "recommendInfo": null,
    //       "subscribedCount": 0,
    //       "cloudTrackCount": 0,
    //       "userId": 3346081755,
    //       "totalDuration": 0,
    //       "coverImgId": 109951166933121520,
    //       "privacy": 0,
    //       "trackUpdateTime": 1643173133328,
    //       "trackCount": 26,
    //       "updateTime": 1642253370388,
    //       "commentThreadId": "A_PL_0_5036314168",
    //       "coverImgUrl": "https://p1.music.126.net/9VVOXvIO4WHk1R7mVMSkhw==/109951166933121523.jpg",
    //       "specialType": 5,
    //       "anonimous": false,
    //       "createTime": 1590498593931,
    //       "highQuality": false,
    //       "newImported": false,
    //       "trackNumberUpdateTime": 1642253370388,
    //       "playCount": 10,
    //       "adType": 0,
    //       "description": null,
    //       "tags": [],
    //       "ordered": false,
    //       "status": 0,
    //       "name": "不会HTML的菜鸡喜欢的音乐",
    //       "id": 5036314168,
    //       "coverImgId_str": "109951166933121523",
    //       "sharedUsers": null,
    //       "shareStatus": null
    //     },
    //     {
    //       "subscribers": [],
    //       "subscribed": false,
    //       "creator": {
    //         "defaultAvatar": false,
    //         "province": 360000,
    //         "authStatus": 0,
    //         "followed": false,
    //         "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
    //         "accountStatus": 0,
    //         "gender": 0,
    //         "city": 360100,
    //         "birthday": 0,
    //         "userId": 3346081755,
    //         "userType": 0,
    //         "nickname": "不会HTML的菜鸡",
    //         "signature": "",
    //         "description": "",
    //         "detailDescription": "",
    //         "avatarImgId": 109951165401327420,
    //         "backgroundImgId": 109951162868126480,
    //         "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
    //         "authority": 0,
    //         "mutual": false,
    //         "expertTags": null,
    //         "experts": null,
    //         "djStatus": 0,
    //         "vipType": 0,
    //         "remarkName": null,
    //         "authenticationTypes": 0,
    //         "avatarDetail": null,
    //         "avatarImgIdStr": "109951165401327429",
    //         "backgroundImgIdStr": "109951162868126486",
    //         "anchor": false,
    //         "avatarImgId_str": "109951165401327429"
    //       },
    //       "artists": null,
    //       "tracks": null,
    //       "updateFrequency": null,
    //       "backgroundCoverId": 0,
    //       "backgroundCoverUrl": null,
    //       "titleImage": 0,
    //       "titleImageUrl": null,
    //       "englishTitle": null,
    //       "opRecommend": false,
    //       "recommendInfo": null,
    //       "subscribedCount": 0,
    //       "cloudTrackCount": 0,
    //       "userId": 3346081755,
    //       "totalDuration": 0,
    //       "coverImgId": 109951166654674930,
    //       "privacy": 0,
    //       "trackUpdateTime": 1643173362339,
    //       "trackCount": 19,
    //       "updateTime": 1643173362224,
    //       "commentThreadId": "A_PL_0_5352592913",
    //       "coverImgUrl": "https://p1.music.126.net/2LcjMMpl4Ijid812gkEooQ==/109951166654674931.jpg",
    //       "specialType": 0,
    //       "anonimous": false,
    //       "createTime": 1606445191314,
    //       "highQuality": false,
    //       "newImported": false,
    //       "trackNumberUpdateTime": 1643173362224,
    //       "playCount": 4,
    //       "adType": 0,
    //       "description": null,
    //       "tags": [],
    //       "ordered": false,
    //       "status": 0,
    //       "name": "日常",
    //       "id": 5352592913,
    //       "coverImgId_str": "109951166654674931",
    //       "sharedUsers": null,
    //       "shareStatus": null
    //     },
    //     {
    //       "subscribers": [],
    //       "subscribed": false,
    //       "creator": {
    //         "defaultAvatar": false,
    //         "province": 360000,
    //         "authStatus": 0,
    //         "followed": false,
    //         "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
    //         "accountStatus": 0,
    //         "gender": 0,
    //         "city": 360100,
    //         "birthday": 0,
    //         "userId": 3346081755,
    //         "userType": 0,
    //         "nickname": "不会HTML的菜鸡",
    //         "signature": "",
    //         "description": "",
    //         "detailDescription": "",
    //         "avatarImgId": 109951165401327420,
    //         "backgroundImgId": 109951162868126480,
    //         "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
    //         "authority": 0,
    //         "mutual": false,
    //         "expertTags": null,
    //         "experts": null,
    //         "djStatus": 0,
    //         "vipType": 0,
    //         "remarkName": null,
    //         "authenticationTypes": 0,
    //         "avatarDetail": null,
    //         "avatarImgIdStr": "109951165401327429",
    //         "backgroundImgIdStr": "109951162868126486",
    //         "anchor": false,
    //         "avatarImgId_str": "109951165401327429"
    //       },
    //       "artists": null,
    //       "tracks": null,
    //       "updateFrequency": null,
    //       "backgroundCoverId": 0,
    //       "backgroundCoverUrl": null,
    //       "titleImage": 0,
    //       "titleImageUrl": null,
    //       "englishTitle": null,
    //       "opRecommend": false,
    //       "recommendInfo": null,
    //       "subscribedCount": 0,
    //       "cloudTrackCount": 0,
    //       "userId": 3346081755,
    //       "totalDuration": 0,
    //       "coverImgId": 109951165671947090,
    //       "privacy": 0,
    //       "trackUpdateTime": 1643899114303,
    //       "trackCount": 12,
    //       "updateTime": 1626365227197,
    //       "commentThreadId": "A_PL_0_5351437362",
    //       "coverImgUrl": "https://p1.music.126.net/499AYZ3epP1T7GJYvnJZZQ==/109951165671947083.jpg",
    //       "specialType": 0,
    //       "anonimous": false,
    //       "createTime": 1606363434675,
    //       "highQuality": false,
    //       "newImported": false,
    //       "trackNumberUpdateTime": 1626365227197,
    //       "playCount": 2,
    //       "adType": 0,
    //       "description": null,
    //       "tags": [],
    //       "ordered": false,
    //       "status": 0,
    //       "name": "歌单2",
    //       "id": 5351437362,
    //       "coverImgId_str": "109951165671947083",
    //       "sharedUsers": null,
    //       "shareStatus": null
    //     },
    //     {
    //       "subscribers": [],
    //       "subscribed": false,
    //       "creator": {
    //         "defaultAvatar": false,
    //         "province": 360000,
    //         "authStatus": 0,
    //         "followed": false,
    //         "avatarUrl": "http://p1.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg",
    //         "accountStatus": 0,
    //         "gender": 0,
    //         "city": 360100,
    //         "birthday": 0,
    //         "userId": 3346081755,
    //         "userType": 0,
    //         "nickname": "不会HTML的菜鸡",
    //         "signature": "",
    //         "description": "",
    //         "detailDescription": "",
    //         "avatarImgId": 109951165401327420,
    //         "backgroundImgId": 109951162868126480,
    //         "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
    //         "authority": 0,
    //         "mutual": false,
    //         "expertTags": null,
    //         "experts": null,
    //         "djStatus": 0,
    //         "vipType": 0,
    //         "remarkName": null,
    //         "authenticationTypes": 0,
    //         "avatarDetail": null,
    //         "avatarImgIdStr": "109951165401327429",
    //         "backgroundImgIdStr": "109951162868126486",
    //         "anchor": false,
    //         "avatarImgId_str": "109951165401327429"
    //       },
    //       "artists": null,
    //       "tracks": null,
    //       "updateFrequency": null,
    //       "backgroundCoverId": 0,
    //       "backgroundCoverUrl": null,
    //       "titleImage": 0,
    //       "titleImageUrl": null,
    //       "englishTitle": null,
    //       "opRecommend": false,
    //       "recommendInfo": null,
    //       "subscribedCount": 0,
    //       "cloudTrackCount": 0,
    //       "userId": 3346081755,
    //       "totalDuration": 0,
    //       "coverImgId": 109951166919194720,
    //       "privacy": 0,
    //       "trackUpdateTime": 1644040052994,
    //       "trackCount": 446,
    //       "updateTime": 1644040052939,
    //       "commentThreadId": "A_PL_0_5347140534",
    //       "coverImgUrl": "https://p1.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg",
    //       "specialType": 0,
    //       "anonimous": false,
    //       "createTime": 1606286497541,
    //       "highQuality": false,
    //       "newImported": false,
    //       "trackNumberUpdateTime": 1644040052939,
    //       "playCount": 4,
    //       "adType": 0,
    //       "description": null,
    //       "tags": [],
    //       "ordered": false,
    //       "status": 0,
    //       "name": "新建歌单1",
    //       "id": 5347140534,
    //       "coverImgId_str": "109951166919194723",
    //       "sharedUsers": null,
    //       "shareStatus": null
    //     }
    //   ],
    //   // playlist: ``
    // })
>>>>>>> 9f1452e (2022.2.14)

    /**
     * 获取用户歌单
     * */
    async function getMineSong() {
      if(!userPlayList.playlist && store.state.logInfo.status) {
        console.log(`向服务器发送请求，获取用户歌单`);
        //当本地没有用户歌单时，才向服务器发送请求
        let res = await axios({
          url: `http://localhost:3000/user/playlist?uid=${store.state.logInfo.profile.userId}`,
          method: "get",
        })
        console.log(res.data)
        if(res.data.code === 200) {
          console.log(res.data.playlist);
          userPlayList.playlist = res.data.playlist
        }
      }
    }

    return {
      store,

      isShowMineSong,
      userPlayList,
      getMineSong,
      ...toRefs(userPlayList)
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
<<<<<<< HEAD
<<<<<<< HEAD
          font-family: "楷体",sans-serif;
=======
          font-family: "楷体";
>>>>>>> 3fac76e (2022.2.12)
=======
          font-family: "楷体",sans-serif;
>>>>>>> 9f1452e (2022.2.14)
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