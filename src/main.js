import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import * as Sortable from 'sortablejs/Sortable.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
//import VueRouter from 'vue-router'
// import store from './vuex/store'
// import Vuex from 'vuex'
import router from './router'
import resources from './resources'
import axios from './http'
// import { ApolloClient, createNetworkInterface } from 'apollo-client'
// import VueApollo from 'vue-apollo'

import 'font-awesome/css/font-awesome.min.css'
// Create the apollo client
// const apolloClient = new ApolloClient({
//   networkInterface: createNetworkInterface({
//     uri: 'http://120.77.72.16:8080/api/graphql',
//     transportBatching: true,
//   }),
//   connectToDevTools: true,
// })
// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient,
// })

// Install the vue plugin
// Vue.use(VueApollo)
Vue.use(ElementUI)
Vue.use(Sortable)
// Vue.use(VueRouter)
// Vue.use(Vuex)
Vue.prototype.$ajax = axios;

// const router = new VueRouter({
// 	routes
// })

new Vue({
	el: '#app',
	//template: '<App/>',
	router,
	// store,
  // apolloProvider,
	//components: { App }
	render: h => h(App)
}).$mount('#app')

