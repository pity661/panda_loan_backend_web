import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueDND from 'awe-dnd'
Vue.use(VueDND)

import { Loading, Message } from 'element-ui'
import HomePage from './views/HomePage.vue'

import Login from './views/Login.vue'
import Password from './views/Password.vue'
import ResetPassword from './views/Resetpass.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'


// 产品编辑
import Product from './views/product/Product.vue'
import ProductDetail from './views/product/ProductDetail.vue'
//产品发布渠道版本
import ClientVersion from './views/client_version/ClientVersion.vue'
//app的tab编辑
import TabModule from './views/tab_module/TabModule.vue'
// 挡板操作
import Template from './views/template/Template.vue'

let routes = [
    {
        path: '/',
        component: Home,
        name: '版本管理',
        iconCls: 'fa fa-wrench',
        leaf: true,//只有一个节点
        children: [
            { path: '/clientVersion', component: ClientVersion, meta: { requireAuth: true }, name: '版本管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '产品管理',
        iconCls: 'fa fa-edit',
        leaf: true,//只有一个节点
        children: [
            { path: '/product', component: Product, meta: { requireAuth: true }, name: '产品管理' },
            { path: '/productDetail/:id', component: ProductDetail,  meta: { requireAuth: true }, name: '产品详情', hidden: true }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '菜单管理',
        iconCls: 'fa fa-th-large',
        leaf: true,//只有一个节点
        children: [
            { path: '/tabModule', component: TabModule, meta: { requireAuth: true }, name: '菜单管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '挡板管理',
        iconCls: 'fa fa-th-list',
        leaf: true,//只有一个节点
        children: [
            { path: '/template', component: Template, meta: { requireAuth: true }, name: '挡板管理' },
        ]
    },
    {
        path: '/home',
        component: HomePage,
        name: '',
        hidden: true
    },
    {
        path: '/',
        redirect: { path: '/login' },
        hidden: true
    },
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/password',
        component: Password,
        name: '',
        hidden: true
    },
    {
        path: '/resetpass',
        component: ResetPassword,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

const router = new VueRouter({
	base: "/panda_loan_backend_web/",
    routes
})

//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
        if (sessionStorage.getItem('token')) {// 判断是否登录
            next()
        } else {// 没登录则跳转到登录界面
            next({
                path: '/login',
                //这里传递fullPath，是为了登录之后作为return back
                query: { redirect: to.fullPath }
            })
        }
    } else {
        next()
    }
})
export default router;
