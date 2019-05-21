// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'normalize.css'
// import 'iview/dist/styles/iview.css'
import 'swiper/dist/css/swiper.css'
import {
  randKey
} from "@/tools/utils"
import VueBus from "@/config/vue-bus"





// import iView from 'iview'
import {
  Row,
  Col,
  Icon,
  Form,
  FormItem,
  Input,
  InputNumber,
  Avatar,
  Upload,
  Button,
  Message
} from 'iview'

Vue.component('Row', Row)
Vue.component('Col', Col)
Vue.component('Icon', Icon)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.component('Input', Input)
Vue.component('InputNumber', InputNumber)
Vue.component('Avatar', Avatar)
Vue.component('Upload', Upload)
Vue.component('Button', Button)

Vue.use(VueBus)
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.prototype.$Message = Message

// set locale
moment.locale('zh-cn')
// Vue.use(iView)

Vue.prototype.randKey = randKey

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
