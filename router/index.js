import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Empresas from '../components/Empresas.vue';
import Ocorrencias from '../components/Ocorrencias.vue';
import Admin from '../views/Admin.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/empresas',
    name: 'Empresas',
    component: Empresas,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ocorrencias/:empresaId/:empresaNome',
    name: 'Ocorrencias',
    component: Ocorrencias,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAdmin: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const currentUser = store.state.user;
  const currentUserRole = store.state.role;

  if (requiresAuth && !currentUser) {
    next('/');
  } else if (requiresAdmin && (!currentUser || currentUserRole !== 'admin')) {
    next('/');
  } else {
    next();
  }
});

export default router;
