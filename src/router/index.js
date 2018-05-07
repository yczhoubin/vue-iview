import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import HomePage from '@/view/home-page.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
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
          component: resolve => require(['../view/components/index.vue'], resolve),
          // children: [
          //   {
          //     path: '',
          //     component: resolve => require(['../view/components/index.vue'], resolve)
          //   },
          //   {
          //     path: 'inputUnit',
          //     component: resolve => require(['../view/components/input/input-unit.vue'], resolve)
          //   },
          //   {
          //     path: '/image-preview',
          //     component: resolve => require(['../view/components/image-preview/image-preview.vue'], resolve)
          //   }
          // ]
        }
      ]
    }
    // {
    //   path: '/home',
    //   component: resolve => require(['../view/home-page.vue'], resolve)
    // },
    // {
    //   path: '/components',
    //   component: resolve => require(['../view/components/input/input-unit.vue'], resolve),
    //   children: [{
    //       path: 'inputUnit',
    //       component: resolve => require(['../view/components/input/input-unit.vue'], resolve)
    //     },
    //     {
    //       path: '/image-preview',
    //       component: resolve => require(['../view/components/image-preview/image-preview.vue'], resolve)
    //     }
    //   ]
    // }
  ]
})
