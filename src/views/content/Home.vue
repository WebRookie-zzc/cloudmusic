<template>
  <div class="home_page">
<!--    顶部导纳栏-->
    <div class="home_nav">
      <ul class="nav_list">
        <li class="nav_item"><router-link to="/home/recommend">个性推荐</router-link></li>
        <li class="nav_item"><router-link to="/home/exclusive">专属定制</router-link></li>
        <li class="nav_item"><router-link to="/home/singers">歌手</router-link></li>
      </ul>
    </div>

<!--    下侧内容-->
    <div class="home_content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: `Home`,

})
</script>

<style lang="less" scoped>
  .home_page {

    .home_nav {
      width: 100%;
      height: 30px;

      ul.nav_list {
        display: flex;
        height: 100%;

        .nav_item {
          margin-left: 5px;
          margin-right: 5px;
          font-weight: bolder;
          font-family: "楷体",serif;
          font-size: 18px;
          line-height: 30px;
          height: 30px;

          a {
            text-decoration: none;
            color: #000;

            &.active {
              font-size: 24px;
              border-bottom: 3px solid #f00;
            }
          }
        }
      }
    }

    .home_content {
      position: absolute;
      left: 240px;
      right: 0;
      top: 80px;
      bottom: 70px;
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      display: flex;
      justify-content: center;
    }
  }
</style>