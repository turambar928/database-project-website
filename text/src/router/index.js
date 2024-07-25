import { createRouter, createWebHistory } from 'vue-router'
import AppBarComponent from '../components/AppBar.vue'
import MyContentComponent from '../components/MyContent.vue'
import MySidebarComponent from '../components/MySidebar.vue'

const routes = [
  {
    path: '/',
    name: 'AppBar',
    component: AppBarComponent
  },
  {
    path: '/content',
    name: 'MyContent',
    component: MyContentComponent
  },
  {
    path: '/sidebar',
    name: 'MySidebar',
    component: MySidebarComponent
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
