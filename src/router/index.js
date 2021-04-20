import {createRouter, createWebHistory} from 'vue-router'
import {routes} from './router'
const routers = createRouter({
    history: createWebHistory(),
    routes
})
export default routers;