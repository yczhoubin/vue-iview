import Vue from 'vue'
import Router from 'vue-router'
// import HomePage from '@/view/home-page.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: resolve => require(['../view/index.vue'], resolve),
      children: [
        {
          path: '',
          component: resolve => require(['../view/home-page.vue'], resolve)
        },
        {
          path: '/components',
          component: resolve => require(['../view/demo/index.vue'], resolve)
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../view/login/login.vue'], resolve)
    }
  ]
})
