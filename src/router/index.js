import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";

/** Components */
import isLogin from "./isLogin";
import isLogout from "./isLogout";

import systemRouter from "../modules/system/router";

const routes = [
  {
    path: "/",
    name: "home",
    ...systemRouter,
    beforeEnter: [isLogin],
  },
  {
    path: "/login",
    name: "login",
    component: () => import('../modules/auth/views/Login.vue'),
    beforeEnter: [isLogout],
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('../components/Welcome.vue')
  },
  {
    path: "/:pathMatch(.*)",
    component: () => import("../components/PageNotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Si se cambia de ruta siempre tomara la posición superior
    return { top: 0 };
  },
});

// Iniciar NProgress antes de cambiar de ruta
router.beforeEach((to, from, next) => {
  NProgress.configure({
    showSpinner: false,
    template: `<div class="bar" style="height: 4px; background-color: #0085f1; border-radius: 10px" role="bar">
            <div class="peg"></div>
        </div>
        <div class="spinner" role="spinner">
            <div class="spinner-icon"></div>
        </div>`,
  });
  NProgress.start();
  next();
});

// Detener NProgress una vez que la ruta haya terminado de cargarse
router.afterEach(() => {
  NProgress.done();
});

export default router;
