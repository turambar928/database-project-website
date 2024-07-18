import { createRouter, createWebHistory } from 'vue-router'
import DashboardComponent from '../components/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardComponent
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
