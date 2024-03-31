import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'

Vue.use(Router)
// eslint-disable-next-line
export default new Router({
  routes: [
    {
      path: '/',
      name: 'register',
      component: Register
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})
