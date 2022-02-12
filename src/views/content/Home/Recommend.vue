<template>
  <div class="home_recommend">
<!--    轮播图-->
    <div class="banner"
         @mouseenter="handleHover"
         @mouseleave="handleHoverLeave">
<!--      轮播图的每一个item-->
      <div class="banner_item"
           v-for="(item, index) in imgClassArr"
           :class="imgClassArr[index]">
        <img :src="getBannerImg(index)">
        <div class="bottom_text">{{gettypeTitle(index)}}</div>
      </div>
      <ul class="banner_dot">
        <li v-for="(item, index) in imgClassArr" :class="{active_dot: index === activeIndex}"
            @mouseenter="changeBanner(activeIndex, index)"></li>
      </ul>
      <div class="left_button"
           v-if="isShowChangeButton"
           @click="changeBanner(activeIndex, activeIndex - 1)">&lt;</div>
      <div class="right_button"
           v-if="isShowChangeButton"
           @click="changeBanner(activeIndex, activeIndex + 1)">&gt;</div>
    </div>
<!--    推荐内容-->
    <div class="recommend_content">
<!--      推荐歌单-->
      <div class="recommend_playlist">
        <div class="recommend_playlist_title">推荐歌单&nbsp;>></div>
        <ul class="playlist_item_wrapper">
          <li class="recommend_mine playlist_item">
            <div class="calender">
              <div class="date">{{new Date().getDate()}}</div>
            </div>
          </li>
          <li class="playlist_item"
              v-for="(item, index) in recommendPlaylistList.playlistList"
              @mouseenter="playListHoverIndex = index"
              @mouseleave="playListHoverIndex = -1">
            <img :src="item.picUrl" alt="playlist">
            <div class="playlist_name">{{item.name}}</div>
            <div class="play_num">{{handlePlayNum(item.playCount)}}</div>
            <div class="play_button"
                 v-if="playListHoverIndex === index"></div>
          </li>
        </ul>
      </div>
<!--      独家放送-->
      <div class="exclusive_play">
        <div class="exclusive_title">独家放送 >></div>
        <ul class="exclusive_play_wrapper">
          <li class="exclusive_play_item" v-for="(item, index) in exclusive">
            <img :src="item.sPicUrl" alt="独家放送">
            <div class="exclusive_name">{{item.name}}</div>
            <div class="play_button"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, onBeforeMount, ref, toRefs} from "vue";
import axios from "axios";
import store from "@/store";

export default defineComponent({
  name: `Recommend`,
  setup() {
    /**
     * @date 2022.2.7
     * @brief 轮播图
     * @finished 2022.2.7
     * */

    //用于存储轮播图数据
    // let banner = reactive({banner_data:[{imageUrl: ``,typeTitle: ``}]})
        // todo: 这里需要更改(将下面注释掉， 上面的注释打开) (这里只是避免向服务器发送过多的请求而导致Ip被封)
    let banner = reactive({banner_data: [
            {
              "imageUrl": "http://p1.music.126.net/2aL-PK29Xw34oWvWu714lw==/109951167022572455.jpg",
              "targetId": 1915838314,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915838314",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4252003.-407149595.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/qmrjqhdWg7gZjkVtI6LC4A==/109951167021959719.jpg",
              "targetId": 1915079946,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915079946",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4257989.-407209045.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/mcgylPeJmxqrRRFpCGAKvQ==/109951167022595959.jpg",
              "targetId": 7233059122,
              "adid": null,
              "targetType": 1000,
              "titleColor": "red",
              "typeTitle": "歌单",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "7233059122",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4279996.-407060161.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/DqJ4TTyklC206Z2o3cRzTw==/109951167022613520.jpg",
              "targetId": 1915875397,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915875397",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4299975.-407123393.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/fpJVo4rBVNSDoYnfWNMUtw==/109951167022609845.jpg",
              "targetId": 136738906,
              "adid": null,
              "targetType": 10,
              "titleColor": "red",
              "typeTitle": "新碟首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "136738906",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4299976.-407235837.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/PVAqeTF7w49qJm0jVXNW9g==/109951167022630558.jpg",
              "targetId": 1915292143,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915292143",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4259984.-407211870.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/wDVkT9O05mQ8zOEBU1BTEA==/109951167022627744.jpg",
              "targetId": 1915579951,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915579951",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4259985.-567324112.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/fJd4sVqnsRrH90KW6IXAsg==/109951167022645957.jpg",
              "targetId": 1915002109,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915002109",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4242001.-407121507.null"
            },
            {
              "imageUrl": "http://p1.music.126.net/5Kq6tpW1PavrNf9CAayVzA==/109951167022658641.jpg",
              "targetId": 1915545250,
              "adid": null,
              "targetType": 1,
              "titleColor": "red",
              "typeTitle": "新歌首发",
              "url": null,
              "exclusive": false,
              "monitorImpress": null,
              "monitorClick": null,
              "monitorType": null,
              "monitorImpressList": null,
              "monitorClickList": null,
              "monitorBlackList": null,
              "extMonitor": null,
              "extMonitorInfo": null,
              "adSource": null,
              "adLocation": null,
              "adDispatchJson": null,
              "encodeId": "1915545250",
              "program": null,
              "event": null,
              "video": null,
              "song": null,
              "scm": "1.music-homepage.homepage_banner_force.banner.4242002.-407303223.null"
            }
          ]})

    //用于存放图片的顺序 仅 类名为 two 的在中间
    let imgClassArr = reactive(['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'one'])

    //记录哪一张轮播图处于活跃状态
    let activeIndex = ref(0)
    //是否显示换页的按钮
    let isShowChangeButton = ref(false)

    /**
     * 获取并存储轮播图数据
     * */
    async function getBannerData() {
      if(!banner.banner_data[0].imageUrl) {
      //   //当存储的没有轮播图的数据时，才向服务器发送请求
        console.log(`向服务器请求轮播图数据`);
        let res = await axios({
          url: `http://localhost:3000/banner`,
          method: `get`,
          params : {
            type: 0 //0表示请求PC端的数据
          }
        })
        console.log(res.data);
        banner.banner_data = res.data.banners
      }
    }

    //轮播图切换的定时器  这里注意：没有放到 return 中
    let bannerTimer:number;

    /**
     * 通过定时器进行轮播图的切换
     * */
    function runBanner() {
      bannerTimer = setInterval( () => {
        changeBanner(activeIndex.value, activeIndex.value + 1)
      }, 2000)
    }

    /**
     * 切换轮播图
     * @param currentPage 当前页面数
     * @param nextPage 下一页的页码数
     * */
    function changeBanner(currentPage:number,nextPage:number):void {
      if(nextPage === 9) {
        nextPage = 0
      }else if(nextPage === -1) {
        nextPage = 8
      }
      if(nextPage > currentPage) {
        //向后跳转
        // console.log(`向后跳转`);
        for(let i = 0; i < nextPage - currentPage; i++) {
          imgClassArr.unshift(imgClassArr[imgClassArr.length - 1])
          // console.log(imgClassArr);
          imgClassArr.pop()
        }
        //变化角标
        activeIndex.value = nextPage
      }else if(nextPage < currentPage) {
        //向前跳转
        // console.log(`向前跳转`);
        for(let i = 0; i < currentPage - nextPage; i++) {
          imgClassArr.push(imgClassArr[0])
          // console.log(imgClassArr);
          imgClassArr.shift()
        }
        //变化角标
        activeIndex.value = nextPage
      }
    }

    /**
     * 处理鼠标移入banner的事件
     * */
    function handleHover() {
      isShowChangeButton.value = true
      clearInterval(bannerTimer)
    }

    /**
     * 处理移出banner事件
     * */
    function handleHoverLeave() {
      isShowChangeButton.value = false
      runBanner();
    }

    /**
     * 获取轮播图图片
     * @param index 索引值
     * @return 图片地址
     * */
    function getBannerImg(index: number):string {
      if(banner.banner_data[index] && banner.banner_data[index].imageUrl) {
        return banner.banner_data[index].imageUrl
      }else {
        return ``
      }
    }

    /**
     * 获取轮播图类型
     * @param index 索引值
     * @return 类型
     * */
    function gettypeTitle(index:number):string {
      if(banner.banner_data[index] && banner.banner_data[index].typeTitle) {
        return banner.banner_data[index].typeTitle
      }else {
        return ``
      }
    }

    /**
     * @date 2022.2.8
     * @brief 获取歌单推荐列表
     * @finished 2022.2.8
     * */

    //用于存储获得的推荐列表
    //     let recommendPlaylistList = reactive({playlistList:[{id:``}]});
    let recommendPlaylistList = reactive({playlistList:[
          {
            "id": 7084238898,
            "type": 0,
            "name": "华语轻音｜发呆是唯一不用付费的宇宙遨游",
            "copywriter": null,
            "picUrl": "https://p1.music.126.net/h03pxoeOJTHfkfXDG1T6uw==/109951166650522607.jpg",
            "canDislike": false,
            "trackNumberUpdateTime": 1644294130008,
            "playCount": 94498,
            "trackCount": 31,
            "highQuality": false,
            "alg": "featured"
          },
          {
            "id": 3136952023,
            "type": 0,
            "name": "今天从《Cool》听起|私人雷达",
            "copywriter": "猜你喜欢",
            "picUrl": "https://p1.music.126.net/lmdhbX5d8aUER1Ft_sjnGw==/109951165497458276.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1644271200000,
            "playCount": 10029455400,
            "trackCount": 35,
            "highQuality": false,
            "alg": "official_image_album_sub"
          },
          {
            "id": 2345048322,
            "type": 0,
            "name": "节奏控 | 那些超带感的英文歌",
            "copywriter": "根据你喜欢的单曲《Try》推荐",
            "picUrl": "https://p1.music.126.net/DTA1vQiLtNxZZe7dDWI6Qg==/109951164187665128.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1643860640451,
            "playCount": 48619480,
            "trackCount": 176,
            "highQuality": false,
            "alg": "bysong_profile_ol"
          },
          {
            "id": 2939912482,
            "type": 0,
            "name": "随机播放 秀翻全场",
            "copywriter": "根据你喜欢的单曲《Cool》推荐",
            "picUrl": "https://p1.music.126.net/Js42j1BC_c0YT_NeelIDGg==/109951165767133396.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1643473476249,
            "playCount": 4758071,
            "trackCount": 483,
            "highQuality": false,
            "alg": "bysong_profile_ol"
          },
          {
            "id": 312734124,
            "type": 0,
            "name": "【节奏控】超带感的英文歌（经典篇）",
            "copywriter": "根据你喜欢的单曲《Try》推荐",
            "picUrl": "https://p1.music.126.net/hjj85ZazuFZbxE-Ul2meKw==/3273246127527246.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1552357902857,
            "playCount": 152150880,
            "trackCount": 138,
            "highQuality": false,
            "alg": "bysong_profile_ol"
          },
          {
            "id": 2829883282,
            "type": 0,
            "name": "听你爱的Cool|华语私人雷达",
            "copywriter": "猜你喜欢",
            "picUrl": "https://p1.music.126.net/uUPFyHWYrtjbgh9JfRjQDg==/109951165665086344.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1644271200000,
            "playCount": 1082923390,
            "trackCount": 35,
            "highQuality": false,
            "alg": "official_image_red"
          },
          {
            "id": 35885845,
            "type": 0,
            "name": "BGM一响可把自己给NB坏了",
            "copywriter": "根据你喜欢的单曲《Cool》推荐",
            "picUrl": "https://p1.music.126.net/Quithl8hjPrGKl_Crr3A8g==/109951164854235374.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1642232595587,
            "playCount": 8854216,
            "trackCount": 664,
            "highQuality": false,
            "alg": "bysong_profile_ol"
          },
          {
            "id": 531321323,
            "type": 0,
            "name": "将回忆酿成烈酒入喉 从此不再挽留不再回头",
            "copywriter": "根据你喜欢的单曲《你的答案》推荐",
            "picUrl": "https://p1.music.126.net/CGqadcEvUW_59LXcuS43aw==/109951162819954007.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1643539529454,
            "playCount": 119010840,
            "trackCount": 237,
            "highQuality": false,
            "alg": "bysong_profile_ol"
          },
          {
            "id": 3217571376,
            "type": 0,
            "name": "原神璃月OST (已添加璃月角色OST）",
            "copywriter": "根据你喜欢的单曲《Qilin's Prance 麟跃幽岩》推荐",
            "picUrl": "https://p1.music.126.net/Wv2fCavTpqlf2nQrZqHo4Q==/109951166982163961.jpg",
            "canDislike": true,
            "trackNumberUpdateTime": 1644241991309,
            "playCount": 930395,
            "trackCount": 101,
            "highQuality": false,
            "alg": "bysong_profile_ol"
          }
        ]})

    /**
     * 获取推荐歌单的列表
     * */
    async function getRecommendPlaylistList() {
      //验证退出登录状态
      // await axios.get(`http://localhost:3000/logout`)
      if(!recommendPlaylistList.playlistList[0].id) {
        //当本地没有推荐内容时，才向服务器请求数据
        console.log(`想服务器请求推荐数据`);
        let res = await axios({
          url : `http://localhost:3000/personalized`,
          // url: `http://localhost:3000/recommend/personalized`,
          method: `get`,
          params: {
            limit: 9,
            cookie: store.state.cookie
          }
        })
        console.log(res.data.result);
        recommendPlaylistList.playlistList = res.data.result
      }
    }

    /**
     * 处理播放量文字
     * */
    function handlePlayNum(playNum:any):string {
      let temp:string = ``;
      if(playNum === undefined) {
        playNum = 0
      }
      if(playNum < 10000) {
        return playNum.toString()
      }else if (playNum < 1_0000_0000) {
        temp = playNum.toString()
        temp = temp.slice(0,-4)
        return `${temp}万`
      }else {
        temp = playNum.toString()
        temp = temp.slice(0,-8)
        return `${temp}亿`
      }
    }

    //记录鼠标移入的歌单的index值
    let playListHoverIndex = ref(-1)

    /**
     * @date 2022.2.8
     * @brief 独家放送功能
     * @finished 2022.2.8
     * */

    //用于存储获取到的独家放送的列表
    let exclusiveList = reactive({exclusive: [
            {
              "id": 14498287,
              "url": "",
              "picUrl": "https://p2.music.126.net/bXBBCrVEKtMZCnAwA8bnXQ==/109951166995281428.jpg",
              "sPicUrl": "https://p2.music.126.net/z_XrKvWDuk2Na6LniN3hGA==/109951166995281863.jpg",
              "type": 5,
              "copywriter": "惊喜呈现| 姜贞羽：热爱舞台上的每一个瞬间",
              "name": "惊喜呈现| 姜贞羽：热爱舞台上的每一个瞬间",
              "alg": "featured"
            },
            {
              "id": 14496631,
              "url": "",
              "picUrl": "https://p2.music.126.net/IVEDKgbd--myWBukXgreNg==/109951166983018052.jpg",
              "sPicUrl": "https://p2.music.126.net/lx35fbctK2npbgPUwt2FXw==/109951166983009311.jpg",
              "type": 5,
              "copywriter": "《超级面对面》第252期 Alan Walker：和Walkers一起遨游宇宙",
              "name": "《超级面对面》第252期 Alan Walker：和Walkers一起遨游宇宙",
              "alg": "featured"
            },
            {
              "id": 14495768,
              "url": "",
              "picUrl": "https://p2.music.126.net/quOJOo3nZ984XzHQYxoJ0w==/109951166983027523.jpg",
              "sPicUrl": "https://p2.music.126.net/7LVq4AnJCMPrMhN-PYP28A==/109951166983028013.jpg",
              "type": 5,
              "copywriter": "惊喜呈现：Yamy郭颖携手二手玫瑰玩转港味复古风",
              "name": "惊喜呈现：Yamy郭颖携手二手玫瑰玩转港味复古风",
              "alg": "featured"
            }
          ]})

    /**
     * 获取独家放送列表
     * */
    async function getExclusiveList() {
      if(!exclusiveList.exclusive) {
        console.log(`请求独家放送列表`)
        let res = await axios({
          url: `http://localhost:3000/personalized/privatecontent`,
          method: `get`,
        })
        console.log(res.data);
        exclusiveList.exclusive = res.data.result
      }
    }

    /**
     *
     * 挂载之前请求轮播图数据
     * */
    onBeforeMount(async () => {
      await getBannerData()
      runBanner()

      await getRecommendPlaylistList()
      await getExclusiveList()
    })

    return {
      banner,
      imgClassArr,
      activeIndex,
      isShowChangeButton,
      handleHover,
      handleHoverLeave,
      changeBanner,
      getBannerData,
      getBannerImg,
      gettypeTitle,

      recommendPlaylistList,
      getRecommendPlaylistList,
      handlePlayNum,
      playListHoverIndex,

      ...toRefs(exclusiveList)
    }
  }
})
</script>

<style scoped lang="less">
  .home_recommend {
    width: 1150px;
    //border: 1px solid #ccc;
    .banner {
      position: relative;

      .banner_item {
        width: 540px;
        height: 200px;
        position: absolute;
        border-radius: 10px;
        overflow: hidden;
        left: 305px;
        transition: .3s;
        transform: scale(.9, .9);

        img {
          width: 100%;
          height: 100%;
        }

        .bottom_text {
          font-size: 14px;
          color: #fff;
          background: #f00;
          width: 70px;
          height: 20px;
          line-height: 20px;
          position: absolute;
          bottom: 0;
          right: 0;
          text-align: center;
          border-radius: 10px 0 10px 0;
        }
      }

      .banner_dot {
        width: 500px;
        height: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 300px;
        top: 230px;

        .active_dot {
          background-color: #000;
        }

        li {
          width: 5px;
          height: 5px;
          background: #ddd;
          border-radius: 50%;
          margin-left: 5px;
        }
      }

    /* 配置轮播图的class */
      .one {
        transform: scale(.9, .9) translate(-300px, 0);
        z-index: 2;
      }

      .three {
        transform: scale(.9, .9) translate(300px, 0);
        z-index: 2;
      }

      .two {
        z-index: 3;
        transform: scale(1, 1)
      }
      .left_button, .right_button {
        width: 30px;
        font-size: 25px;
        color: #fff;
        background-color: #cccccc;
        position: absolute;
        left: 100px;
        top: 90px;
        border-radius: 50%;
        text-align: center;
        z-index: 4;

        &:hover {
          cursor: pointer;
        }
      }

      .right_button {
        position: absolute;
        top: 90px;
        left: 1000px
      }
    }

    .recommend_content {
      width: 1150px;
      position: absolute;
      top: 250px;
      //border-top: 1px solid #000;

      .recommend_playlist {
        width: 100%;
        //display: flex;
        //height: 100px;
        //border-top: 1px solid #000;

        .recommend_playlist_title {
          width: 300px;
          height: 30px;
          font-size: 25px;
          line-height: 30px;
          font-family: "楷体",serif;
          font-weight: bolder;
        }

        .playlist_item_wrapper {
          margin-top: 30px;
          width: 1150px;
          display: flex;
          flex-wrap: wrap;

          .recommend_mine {
            .calender {
              width: 210px;
              height: 210px;
              background-color: rgba(255,0,0,.6);
              border-radius: 20px;
              background-image: url("../../../assets/Content/Recommend/calender.png");
              background-position: center center;
              background-size: 150px 150px;
              background-repeat: no-repeat;

              .date {
                font-size: 40px;
                font-weight: bolder;
                position: absolute;
                left: 95px;
                top: 110px;
                color: #000;
              }
            }
          }

          .playlist_item {
            width: 210px;
            height: 250px;
            //border-radius: 20px;
            overflow: hidden;
            margin: 10px;
            position: relative;

            &:hover {
              cursor: pointer;
            }

            img {
              width: 210px;
              height: 210px;
              border-radius: 20px;
            }

            .play_num {
              height: 15px;
              width: 60px;
              padding-left: 20px;
              color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              background: rgba(0, 0, 0, .5) url("../../../assets/Content/Recommend/play_white.png") no-repeat left center;
              background-size: 15px 15px;
              padding-right: 5px;
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

      .exclusive_play {
        width: 1150px;
        margin-top: 40px;

        .exclusive_title {
          width: 300px;
          height: 30px;
          font-size: 25px;
          line-height: 30px;
          font-family: "楷体",serif;
          font-weight: bolder;
        }

        .exclusive_play_wrapper {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;

          .exclusive_play_item {
            width: 356px;
            height: 230px;
            margin-left: 20px;
            position: relative;

            &:hover {
              cursor: pointer;
            }

            img {
              width: 356px;
              height: 200px;
              border-radius: 10px;
            }

            .play_button {
              background: rgba(0, 0, 0, .8) url("../../../assets/Content/Recommend/play_dot_white.png") no-repeat center center;
              background-size: 15px 15px;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              position: absolute;
              right: 10px;
              top: 10px;
              border: 2px solid #aaa;
            }
          }
        }
      }
    }
  }
</style>