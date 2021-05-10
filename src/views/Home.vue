<template>
  <div class="home">
    <el-button type="danger">按钮</el-button>
    <span>{{message}}</span>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data(){
    return {
      message:"",
    }
  },
  mounted(){
    this.getMessage();
  },
  methods:{
    getMessage(){
      axios.get("/api/demo").then((res)=>{
        if(res.status === 200){
          let data = res.data;
          this.message = data.msg;
        }
      });
    }
  }
}
</script>
