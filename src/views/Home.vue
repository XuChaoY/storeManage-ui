<template>
  <div class="home">
    <div class="tab_panel">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="'tab_'+ index" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="container_panel">
      <router-view/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex'; 
export default {
  name: 'Home',
  data(){
    return {
      message:"",
      tabs:[],
      activeName:"goods"
    }
  },
  computed:{
    ...mapState(["authority", "username"])
  },
  watch:{
    authority:{
      handler(val){
        if(val > 0){
          this.tabs = [
            {
              label:"库存管理",
              value:'goods'
            },
            {
              label:"账单管理",
              value:'account'
            }
          ]
        }else{
          this.tabs = [
            {
              label:"库存管理",
              value:'goods'
            }
          ]
        }
      },
      immediate:true
    },
    username(val){
      if(!val){
        this.activeName = 'goods'
      }
    },
    activeName(val){
      if(val === 'goods'){
        this.$router.push('/goods');
      }else if(val === 'account'){
        this.$router.push('./account')
      }
    }
  },
  methods:{
    handleClick(tab){
      if(tab.name === 'goods'){
        this.$router.push('/goods');
      }else if(tab.name === 'account'){
        this.$router.push('./account')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home{
  .tab_panel{
    width: 60%;
    margin:0 auto;
  }
  .container_panel{
    width: 60%;
    margin:0 auto;
  }
}
</style>
