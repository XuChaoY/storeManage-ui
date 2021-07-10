import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/utils/http';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authority:0,
    username:null,
    tab:'goods'
  },
  mutations: {
    updateUsername(state, username){
      state.username = username;
    },
    updateAuthority(state, value){
      state.authority = value || state.authority;
    }
  },
  actions: {
    loginAction({state}, {username, password}){
      return new Promise((resolve, reject)=>{
        http.post("/api/user/login", {username, password}).then((res)=>{
            let data = res.data;
            if(data.username){
              state.username = data.username;
              state.authority = data.authority
              sessionStorage.setItem('username', data.username);
              sessionStorage.setItem('authority', data.authority);
              resolve();
            }else{
              reject();
            }
        });
      });
    },
    logoutAction({state}){
      return new Promise((resolve, reject)=>{
        http.get("/api/user/logout").then((res)=>{
          sessionStorage.removeItem("username");
          sessionStorage.removeItem("authority");
          state.authority = 0;
          state.username = null;
          resolve()
        });
      });
    }
  },
  modules: {
  }
})
