import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Admin' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    redirect: { name: 'quiz-constructor' },
    children: [
      {
        path: 'quiz-constructor',
        name: 'quiz-constructor',
        component: () => import('../views/Admin/QuizConstructor.vue'),
      },
      {
        path: 'answers-constructor',
        name: 'answers-constructor',
        component: () => import('../views/Admin/AnswersConstructor.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
