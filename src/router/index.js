import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/loading',
    name: 'loading',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoadingCss.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
