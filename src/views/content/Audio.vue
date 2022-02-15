<template>
  <div class="audio">
    <div class="audio_all_wrapper">
<!--      最新MV-->
      <div class="audio_wrapper">
        <div class="top_bar">
          <div class="title">最新MV >> </div>
          <ul class="type_wrapper">
            <li class="type_item"
                v-for="(item, index) in typeList"
                :class="{active: index === newMVIndex}"
                @click="changeNewMV(index)">{{item}}</li>
          </ul>
        </div>
        <ul class="audio_content">
          <li class="audio_item"
              v-for="item in newMVList.newMVList">
            <img :src="item.cover" alt="">
            <div class="name">{{item.name}}-{{item.artistName}}</div>
          </li>
        </ul>
      </div>
<!--      网易出品MV-->
      <div class="audio_wrapper">
        <div class="top_bar">
          <div class="title">网易出品 >> </div>
        </div>
        <ul class="audio_content">
          <li class="audio_item"
              v-for="item in wyCreateMV.wyCreateMV">
            <img :src="item.cover" alt="">
            <div class="name">{{item.name}}-{{item.artistName}}</div>
          </li>
        </ul>
      </div>
<!--      MV排行-->
      <div class="mvRank">
        <div class="top_bar">
          <div class="title">MV排行榜 >> </div>
          <ul class="area_type">
            <li class="area_item"
                v-for="(item, index) in typeList"
                :class="{active: index === wyCreateIndex}"
                @click="changeRankList(index)">{{item}}</li>
          </ul>
        </div>
        <ul class="rank_content">
          <li class="rank_item" v-for="(item ,index) in rankList.rankList">
            <div class="rank_num">{{index+1}}</div>
            <div class="img">
              <img :src="item.cover" alt="">
            </div>
            <div class="name">{{item.name}}<br/>{{item.artistName}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive, ref} from "vue";
import axios from "axios";
  export default defineComponent({
    name: `Audio`,
    setup() {
      /**
       * @date 2022.2.14
       * @brief MV页面
       * @finished 2022.2.14
       * */

      //类型列表
      let  typeList:Array<string> = [`内地`, `港台`, `欧美`, `日本`, `韩国`]

      //最新MV类型索引
      let newMVIndex = ref<number>(0)

      //存储请求的最新MV的列表
      let newMVList = reactive({newMVList:[]})

      /**
       * 获取最新MV列表
       * */
      async function getNewMVList() {
        let res = await axios({
          url: `http://localhost:3000/mv/first`,
          method: `get`,
          params: {
            limit: 8,
            area: typeList[newMVIndex.value]
          }
        })
        // console.log(res.data);
        newMVList.newMVList = res.data.data
      }

      /**
       * 改变最新MV的类型
       * @param index 点击的索引值
       * */
      async function changeNewMV(index:number) {
        newMVIndex.value = index
        await getNewMVList()
      }

      //存储网易出品列表
      let wyCreateMV = reactive({wyCreateMV:[]})

      //排行活跃索引
      let wyCreateIndex = ref<number>(0)

      //获取网易出品列表
      async function getWyCreateMV() {
        let res = await axios({
          url: `http://localhost:3000/mv/exclusive/rcmd`,
          method: `get`,
          params: {
            limit: 8
          }
        })
        console.log(res.data);
        wyCreateMV.wyCreateMV = res.data.data
      }

      //存储排行榜列表
      let rankList = reactive({rankList: []})

      /**
       * 获取排行榜列表
       * */
      async function getRankList() {
        let res = await axios({
          url: `http://localhost:3000/top/mv`,
          method: `get`,
          params: {
            limit: 10,
            area: typeList[wyCreateIndex.value]
          }
        })
        console.log(res.data);
        rankList.rankList = res.data.data
      }

      /**
       * 改变排行榜列表
       * */
      async function changeRankList(index:number) {
        wyCreateIndex.value = index
        getRankList()
      }

      onBeforeMount(async () => {
        await getNewMVList()
        await getWyCreateMV()
        await getRankList()
      })

      return {
        typeList,

        newMVIndex,
        newMVList,
        getNewMVList,
        changeNewMV,

        wyCreateMV,
        wyCreateIndex,

        rankList,
        changeRankList
      }
    }
  })
</script>

<style lang="less" scoped>
  .audio {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 210px;
    right: 0;
    top: 0;
    bottom: 70px;
    overflow: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .audio_all_wrapper {
      width: 1150px;
      height: 100%;
      padding: 30px;
      //border: 1px solid #000;

      .audio_wrapper {
        width: 100%;
        margin-top: 20px;

        .top_bar {
          width: 100%;
          height: 25px;
          position: relative;

          .title {
            width: 150px;
            color: #000;
            //font-family: "楷体", serif;
            font-size: 25px;
            line-height: 25px;
            font-weight: bolder;
          }

          .type_wrapper {
            position: absolute;
            right: 0;
            top: 10px;
            display: flex;

            .type_item {
              margin-left: 15px;
              font-size: 14px;
              width: 50px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              border-radius: 8px;
              color: #ccc;
              &:hover {
                cursor:pointer;
                color: #000;
              }
            }

            .active {
              color: #f00;
              background-color: rgba(255, 0, 0, .1);
              &:hover {
                color: #f00;
              }
            }
          }
        }

        .audio_content{
          display: flex;
          flex-wrap: wrap;
          margin-top: 20px;

          .audio_item {
            width: 250px;
            height: 180px;
            margin-left: 11px;
            margin-right: 11px;
            margin-top: 10px;

            img {
              width: 250px;
              height: 150px;
              border-radius: 15px;
            }
          }
        }
      }

      .mvRank {
        margin-top: 30px;
          .top_bar {
            width: 100%;
            height: 25px;
            position: relative;

            .title {
              width: 150px;
              color: #000;
              //font-family: "楷体", serif;
              font-size: 25px;
              line-height: 25px;
              font-weight: bolder;
            }

            .area_type {
              position: absolute;
              right: 0;
              top: 10px;
              display: flex;
            }

            .area_item {
              margin-left: 15px;
              font-size: 14px;
              width: 50px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              border-radius: 8px;
              color: #ccc;
              &:hover {
                cursor:pointer;
                color: #000;
              }
            }

            .active {
              color: #f00;
              background-color: rgba(255, 0, 0, .1);
              &:hover {
                color: #f00;
              }
            }
          }

        .rank_content {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          margin-top: 30px;
          justify-content: center;
          align-items: center;

          .rank_item {
            width: 500px;
            height: 150px;
            padding-top: 15px;
            //padding-right: 15px;
            display: flex;
            padding-left: 22.5px;
            padding-right: 22.5px;
            border: 1px solid #ddd;

            .rank_num {
              line-height: 120px;
              font-weight: bolder;
              font-size: 40px;
              color: #ccc;
              width: 50px;
              text-align: center;
            }

            .img {
              width: 220px;
              height: 130px;

              img {
                width: 220px;
                height: 130px;
                border-radius: 15px;
              }
            }
            .name {
              width: 200px;
              height: 130px;
              padding-top: 30px;
              font-size: 15px;
              padding-left: 20px;
            }
          }
        }
      }
    }
  }


</style>