import { createRouter, createWebHashHistory } from 'vue-router';

import LayoutPage from './pages/LayoutPage.vue';
import HomePage from './pages/HomePage.vue';
import MembersListPage from './pages/members/MembersList.vue';
import AddEditMemberPage from './pages/members/AddEditMember.vue';
import TopicsListPage from './pages/topics/TopicsList.vue';
import AddEditTopicPage from './pages/topics/AddEditTopic.vue';
import TopicDetailsPage from './pages/topics/TopicDetails.vue';
import LoginPage from './pages/auth/LoginPage.vue';
import SignupPage from './pages/auth/SignupPage.vue';
import PageNotFound from './pages/PageNotFound.vue';
import store from './store/index.js';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: LayoutPage,
      redirect: '/login',
      children: [
        {
          name: 'home',
          path: '/home',
          component: HomePage,
          meta: {
            index: 1,
            requiresAuth: true,
          },
        },
        {
          name: 'members',
          path: '/members',
          props: true,
          component: MembersListPage,
          meta: {
            index: 2,
            requiresAuth: true,
          },
        },
        {
          name: 'addEditMember',
          path: '/members-edit',
          props: true,
          component: AddEditMemberPage,
          meta: {
            index: 3,
            requiresAuth: true,
          },
        },
        {
          name: 'topics',
          path: '/topics',
          props: true,
          component: TopicsListPage,
          meta: {
            index: 4,
            requiresAuth: true,
          },
        },
        {
          name: 'topicDetail',
          path: '/topic/detail',
          props: true,
          component: TopicDetailsPage,
          meta: {
            index: 5,
            requiresAuth: true,
          },
        },
        {
          name: 'addEditTopic',
          path: '/topic/edit',
          props: true,
          component: AddEditTopicPage,
          meta: {
            index: 6,
            requiresAuth: true,
          },
        },
      ],
    },
    {
      name: 'login',
      path: '/login',
      props: true,
      component: LoginPage,
      meta: {
        index: 'login',
        requiresNoAuth: true,
      },
    },
    {
      name: 'signup',
      path: '/signup',
      props: true,
      component: SignupPage,
      meta: {
        index: 'signup',
        requiresNoAuth: true,
      },
    },
    {
      name: 'pageNotFound',
      path: '/:PageNotFound(.*)',
      component: PageNotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // store token to localStorage so as you can refresh the page without logging out
  const token = store.getters.token;
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (from.path == '/' && to.path == '/login' && token) {
    next('/home');
  } else {
    next();
  }
});

export default router;
