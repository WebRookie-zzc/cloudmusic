<template>
  <div>
    <Content></Content>
    <Header></Header>
    <Player></Player>
  </div>
</template>

<style lang="less">
  @import "./assets/css/reset";
</style>

<script lang="ts">
  import {defineComponent} from "vue";
  import Header from "@/components/Header.vue";
  import Content from "@/components/Content.vue";
  import Player from "@/components/Player.vue";

  export default defineComponent({
    name: `App`,
    components: {
      Header,Content, Player
    },
    setup():void {

    }
  })
</script>