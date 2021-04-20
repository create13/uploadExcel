import Home from '../views/home.vue'
import PdpData from '../views/pdpData.vue'
import LddData from '../views/lddData.vue'
export const routes = [
    {path: '/', name: 'Home', component: Home},
    { path: '/pdpData', name: 'PdpData', component: PdpData },
    { path: '/lddData', name: 'LddData', component: LddData }
]