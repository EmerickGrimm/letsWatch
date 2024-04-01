import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import LogIn from '@/components/Login'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  mode: 'history', // Enable history mode
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn
    },
  ]
})
