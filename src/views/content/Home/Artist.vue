<template>
  <div class="artist" ref="singers" @scroll="scroll">
<!--    顶部选择栏-->
    <div class="top_bar">
      <div class="lang_bar item_bar">
        <div class="title">语种:</div>
        <ul class="lang_item_wrapper item_wrapper">
          <li class="lang_item item"
              v-for="(item, index) in area"
              :class="{active: index === areaIndex}"
              @click="changeArea(index)">{{item.name}}</li>
        </ul>
      </div>
      <div class="item_bar">
        <div class="title">分类:</div>
        <ul class="lang_item_wrapper item_wrapper">
          <li class="lang_item item"
              v-for="(item, index) in type"
              :class="{active: index === typeIndex}">{{item.name}}</li>
        </ul>
      </div>
    </div>
<!--    下面歌手的具体内容-->
    <ul class="singers_content">
      <li class="singer_item"
          v-for="item in singerList.singerList">
        <img :src="item.img1v1Url" alt="">
        <div class="singer_name">{{item.name}}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive, ref} from "vue";
import axios from "axios";

  export default defineComponent({
    name: "Artist",
    setup() {
      /**
       * @date 2022.2.14
       * @brief 歌手页面
       * */

      //歌手地区列表
      let area = reactive([
          {name: `全部`, typeNum: -1,},
            {name: `华语`, typeNum: 7},
            {name: `欧美`, typeNum: 96},
            {name: `日本`, typeNum: 8,},
            {name:`韩国`, typeNum: 16},
            {name: `其他`, typeNum: 0}
      ])
      //地区活跃的索引值
      let areaIndex = ref<number>(0)

      //歌手类型
      let type = reactive([
        {name: `全部`,typeNum: -1},
        {name: `男歌手`, typeNum: 2},
        {name: `女歌手`, typeNum: 3},
        {name: `乐队`, typeNum: 4}
      ])
      let typeIndex = ref<number>(0)

      //歌手页数
      let offset = ref<number>(1)

      //用于存储请求来的歌手数据
      let singerList = reactive({singerList:[]})

      /**
       * 获取歌手列表
       * */
      async function getSinger() {
        let res = await axios({
          url: `http://localhost:3000/artist/list`,
          method: `get`,
          params: {
            type: type[typeIndex.value].typeNum,
            area: area[areaIndex.value].typeNum,
            limit: 15 * offset.value
          }
        })
        console.log(res.data);
        singerList.singerList = res.data.artists
      }

      /**
       * 地区切换处理函数
       * @param index 点击的索引值
       * */
      async function changeArea(index:number) {
        offset.value = 1
        areaIndex.value = index
        await getSinger()
      }

      async function changeType(index:number) {
        offset.value = 1
        typeIndex.value = index
        await getSinger()
      }

      //滚动延时定时器，防止高频触发
      let scrollTimer:number = -1;

      //获取dom
      let singers = ref()

      /**
       * 处理滚动事件
       * */
      function scroll() {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(async () => {
          if(singers.value.scrollTop + singers.value.clientHeight === singers.value.scrollHeight){
            offset.value++;
            await getSinger()
          }
        }, 200)
      }

      onBeforeMount( async () => {
        await getSinger()
      })

      return {
        area,
        areaIndex,
        type,
        typeIndex,
        offset,
        singerList,
        changeArea,
        singers,
        scroll
      }
    }
  })
</script>

<style scoped lang="less">
  .artist {
    overflow: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    width: 1150px;
    padding: 30px;
    //border: 2px solid #000;

    .item_bar {
      color: #000;
      display: flex;
      margin-top: 20px;

      .title {
<<<<<<< HEAD
        width: 100px;
=======
        margin-right: 20px
>>>>>>> 9f1452e (2022.2.14)
      }

      .item_wrapper {
        display: flex;

        .item {
          width: 50px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 8px;
          margin-right: 30px;
          &:hover {
            cursor: pointer;
          }
          //border: 1px solid #000;
        }

        .active {
          color: #f00;
          background-color: rgba(255, 0, 0, .1);
        }
      }
    }

    .singers_content {
      margin-top: 30px;
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .singer_item {
        margin-top: 10px;
        margin-right: 9px;
        margin-left: 9px;
        width: 200px;
        height: 230px;
        font-size: 15px;
        color: #000;
        text-align: center;

        img {
          width: 200px;
          height: 200px;
          border-radius: 10px;
        }
      }
    }
  }
</style>