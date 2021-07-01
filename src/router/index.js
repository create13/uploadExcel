import {createRouter, createWebHistory} from 'vue-router'
import * as myModule from './router'

const routers = createRouter({
    history: createWebHistory(),
    routes: myModule.routes
})
export default routers;