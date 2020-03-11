import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import index from '../components/index'
import menu from '../components/menu'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/menu',
    name: 'menu',
    component: menu
  }
]

const router = new VueRouter({
  routes
})

export default router
