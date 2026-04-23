import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AuthUser from '../components/AuthUser.vue'
import ProfilUser from '../components/ProfilUser.vue'
import ListeTrajet from '../components/ListeTrajet.vue'
import AboutUs from '../components/AboutUs.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: AuthUser },
  { path: '/profil', component: ProfilUser },
  { path: '/trajets', component: ListeTrajet },
  { path: '/about', component: AboutUs }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
