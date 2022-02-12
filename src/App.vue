<template>
  <div>
    <Content></Content>
    <Header></Header>
  </div>
</template>

<style lang="less">
  @import "./assets/css/reset";
</style>

<script lang="ts">
  import {defineComponent} from "vue";
  import Header from "@/components/Header.vue";
  import Content from "@/components/Content.vue";

  export default defineComponent({
    name: `App`,
    components: {
      Header,Content
    },
    setup():void {

    }
  })
</script>