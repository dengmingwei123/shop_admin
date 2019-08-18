import Vue from 'vue'
import Router from 'vue-router'
// 引入Login组件
import Login from '@/components/Login.vue'
// 引入Home组件
import Home from '@/components/Home.vue'
// 引入User组件
import User from '@/components/users/Users.vue'
// 引入Rights组件
import Rights from '@/components/rights/Rights.vue'
// 引入Roles组件
import Roles from '@/components/rights/Roles.vue'
// 引入Categories组件
import Categories from '@/components/product/Categories.vue'
// 引入Goods组件
import Goods from '@/components/product/Goods.vue'
// 引入GoodsAadd组件
import GoodsAdd from '@/components/product/GoodsAdd.vue'
// 引入Params组件
import Params from '@/components/product/Params.vue'
// 引入Orders组件
import Orders from '@/components/orders/Orders.vue'
// 引入Reports组件
import Reports from '@/components/reports/Reports.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: '/users', name: 'users', component: User },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/Roles', name: 'roles', component: Roles },
        { path: '/categories', name: 'categories', component: Categories },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/goods-add', name: 'goods-add', component: GoodsAdd },
        { path: '/params', name: 'params', component: Params },
        { path: '/orders', name: 'orders', component: Orders },
        { path: '/reports', name: 'reports', component: Reports }
      ]
    }
  ]
})
// 配置导航守卫
router.beforeEach((to, from, next) => {
  // to:到哪里去
  // from:从哪里来
  // next:放行
  // 看下是否有token
  let token = localStorage.getItem('token')
  // 没有token的时候,就是前往login,判断加个需求,如果是前往login的,直接放行
  if (to.path === '/login' || token) {
    // 如果有,则直接放行
    next()
  } else {
    // 如果没有,则拦截到登录页
    next('/login')
  }
})

export default router
