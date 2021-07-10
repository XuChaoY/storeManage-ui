<template>
  <div id="app">
    <common-header></common-header>
    <router-view/>
  </div>
</template>
<script>
import commonHeader from '@/components/commonHeader'
export default {
  name:'app',
  components:{
    commonHeader
  }
}
</script>
<style lang="less">
@import './style/common.less';
</style>
