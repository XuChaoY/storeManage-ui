import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Goods from '../views/goods.vue'
import Account from '../views/account.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/goods',
    children:[
      {
        path:'goods',
        name:'goods',
        component:Goods
      },
      {
        path:'account',
        name:'account',
        component:Account
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
