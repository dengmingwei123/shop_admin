// 引入vue
import Vue from 'vue'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入根组件
import App from './App'
// 引入共同样式
import '@/assets/common.css'

// 引入路由
import router from './router'
// 引入axios
import axios from 'axios'
// 引入moment
import moment from 'moment'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 使用富文本编辑器
Vue.use(VueQuillEditor)

// 在Vue的原型中添加axios方法
Vue.prototype.axios = axios

// 设置默认值
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.Authorization = localStorage.getItem('token')

// 截取请求
axios.interceptors.request.use(
  function(config) {
    config.baseURL = 'http://localhost:8888/api/private/v1/'
    config.headers.Authorization = localStorage.getItem('token')
    // 返回配置
    return config
  },
  function(err) {
    return Promise.reject(err)
  }
)

Vue.config.productionTip = false
// 使用moment过滤时间
Vue.filter('my-filter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

// 使用element-ui
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
