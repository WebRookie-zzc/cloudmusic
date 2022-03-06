<template>
  <div>
    <Content></Content>
    <Header></Header>
<<<<<<< HEAD
    <Player></Player>
=======
>>>>>>> 3fac76e (2022.2.12)
  </div>
</template>

<style lang="less">
  @import "./assets/css/reset";
</style>

<script lang="ts">
  import {defineComponent} from "vue";
  import Header from "@/components/Header.vue";
  import Content from "@/components/Content.vue";
<<<<<<< HEAD
  import Player from "@/components/Player.vue";
=======
>>>>>>> 3fac76e (2022.2.12)

  export default defineComponent({
    name: `App`,
    components: {
<<<<<<< HEAD
      Header,Content, Player
=======
      Header,Content
>>>>>>> 3fac76e (2022.2.12)
    },
    setup():void {

    }
  })
</script>