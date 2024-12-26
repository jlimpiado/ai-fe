import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import {clearSessionData, getSessionData} from "@/helpers.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const userData = getSessionData();
        if(userData) {
          clearSessionData();
        }
        next();
      }
    },
    {
      path: '/dashboard',
      component: () => import("/src/views/LayoutView.vue"),
      beforeEnter: (to, from, next) => {
        const userData = getSessionData();
        if(!userData) return next('/');
        next();
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import("/src/views/DashboardView.vue"),
        },
        {
          path: 'allmedia',
          name: 'allmedia',
          children: [
            {
              path: '',
              component: () => import("/src/views/MediaView.vue"),
            },
            {
              path: 'article-form/:action(create|edit)/:id?',
              name: 'article-form',
              props: true,
              component: () => import("/src/views/ArticleFormView.vue"),
            }
          ]
        },
        {
          path: 'accounts',
          name: 'accounts',
          beforeEnter: (to, from, next) => {
            const userData = getSessionData();
            if(userData.type === "WRITER") {
              return next('/dashboard');
            }
            next();
          },
          children: [
            {
              path: '',
              component: () => import("/src/views/AccountsView.vue"),
            },
            {
              path: 'user-form/:action(create|edit)/:id?',
              name: 'user-form',
              props: true,
              component: () => import("/src/views/UserFormView.vue"),
            },
            {
              path: 'company-form/:action(create|edit)/:id?',
              name: 'company-form',
              props: true,
              component: () => import("/src/views/CompanyFormView.vue"),
            }
          ]
        },
      ]
    },
  ],
})

export default router
