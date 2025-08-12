import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";

import Login from "@/views/login/index.vue";
import Dashboard from "@/views/dashboard/index.vue";
import Students from "@/views/students/index.vue";
import Admission from "@/views/students/admission.vue";
import About from "@/views/dashboard/about.vue";
import User from "@/views/user/index.vue";
import Role from "@/views/user/role.vue";
import Permission from "@/views/user/permission.vue";
import CollectFees from "@/views/fees/collect-fees.vue";
import CollectedList from "@/views/fees/collected-list.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Dashboard,
  },
  {
    path: "/students",
    name: "students",
    component: Students,
  },
  {
    path: "/students/admission",
    name: "admission",
    component: Admission,
  },
  {
    path: "/fees",
    redirect: "/fees/collect",
  },
  {
    path: "/fees/collect",
    name: "collect-fees",
    component: CollectFees,
  },
  {
    path: "/fees/collected",
    name: "collected-list",
    component: CollectedList,
  },
  {
    path: "/home/about",
    name: "about",
    component: About,
  },

  {
    path: "/user",
    name: "user",
    component: User,
  },
  {
    path: "/role",
    name: "role",
    component: Role,
  },
  {
    path: "/permission",
    name: "permission",
    component: Permission,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.path === "/" && !token) {
    next();
  } else if (to.path === "/" && token) {
    next("/home");
  } else if (token) {
    next();
  } else {
    next("/");
  }
});
export default router;
