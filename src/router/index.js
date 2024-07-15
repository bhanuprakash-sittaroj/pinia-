import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Header from '../components/Header.vue';
import Component from '../components/homeModule/headerComponent/headerComponent.vue'
import Login from '../components/login/login.vue'

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/about", component: About },
    { path: "/header", component: Header },
    { path: "/component", component: Component }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
