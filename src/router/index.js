import Vue from 'vue'
import Router from 'vue-router'
// Async Components
const Home = () => import(/* webpackChunkName: "Home" */ /* webpackPrefetch: true */ '@/components/Home')
const Doodle = () => import(/* webpackChunkName: "Doodle" */ /* webpackPrefetch: true */ '@/components/Doodle')

const SetBrandLogo = () => import(/* webpackChunkName: "SetBrandLogo" */ /* webpackPrefetch: true */ '@/components/SetBrandLogo')


Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/wx/',
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/doodle',
      name: 'Doodle',
      component: Doodle
    }, {
      path: '/setBrandLogo',
      name: 'SetBrandLogo',
      component: SetBrandLogo
    }
  ]
})
