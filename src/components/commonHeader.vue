<!-- 头部组件 -->
<template>
  <div class="common_header">
      <div class="container">
          <div class="title">仓库管理系统</div>
          <div class="user_info">
              <div class="info" v-if="username">
                  <span @click="logoutShow">{{username}}</span>
                  <div class="logout" v-if="logoutFlag" @click="logout()">
                      <span>退出登录</span>
                  </div>
              </div>
              <div class="login" v-else @click="login"><span>登录</span></div>
          </div>
      </div>
      <common-dialog v-model="visible" title="用户登录" @submit="checkLogin">
          <div class="content">
              <el-form label-width="80px" :mode="user">
                  <el-form-item label="用户名：">
                      <el-input v-model="user.username" type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="密码：">
                      <el-input v-model="user.password" type="password"></el-input>
                  </el-form-item>
              </el-form>
          </div>
      </common-dialog>
  </div> 
</template>

<script>
import {mapState} from 'vuex'
import commonDialog from './commonDialog';
export default {
    name:'commonHeader',
    components:{
        commonDialog
    },
    data(){
        return {
            logoutFlag:false,
            visible:false,
            user:{
                username:"",
                password:""
            }
        }
    },
    computed:{
        ...mapState(["username"])
    },
    created(){
        this.$store.commit('updateUsername', sessionStorage.getItem('username'));
        this.$store.commit('updateAuthority', sessionStorage.getItem('authority'))
    },
    methods:{
        //登录
        login(){
            this.visible = true;
        },
        //确认登录
        async checkLogin(){
            await this.$store.dispatch('loginAction', this.user);
            this.visible = false;
        },
        //点击用户显示退出登录
        logoutShow(){
            this.logoutFlag = !this.logoutFlag;
        },
        //退出登录
        async logout(){
            await this.$store.dispatch('logoutAction');
            this.logoutFlag = false;
        },
    }
}
</script>

<style lang="less" scope>
.common_header{
    width:100%;
    height:68px;
    background-color:pink;
    .container{
        margin:0 auto;
        padding:0 35px;
        width:60%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content: space-between;
        box-sizing:border-box;
        background-color:red;
        .title{
            font-size:28px;
        }
        .user_info{
            .info{
                position: relative;
                font-size:18px;
                cursor: pointer;
                .logout{
                    margin-top:8px;
                    position: absolute;
                    background-color:#fff;
                    width:120px;
                    height:36px;
                    line-height:36px;
                    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.3);
                    border-radius: 4px;
                    text-align: center;
                    cursor: pointer;
                    z-index: 9999;
                }
            }
            .login{
                font-size:18px;
                cursor: pointer;
            }
        }
    }
}
</style>