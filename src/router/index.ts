import { createRouter, createWebHashHistory } from "vue-router";
import ComingSoon from "components/ComingSoon.vue";
import VisualDesign from "pages/html/VisualDesign/index.vue";
import BackgroundEffect from "pages/html/BackgroundEffect/index.vue";
import DynamicButtons from "pages/css/DynamicButtons/index.vue";
import DynamicClock from "pages/canvas/DynamicClock.vue";
import Searchlight from "pages/canvas/Searchlight.vue";
import GlobuleInteraction from "pages/canvas/GlobuleInteraction.vue";
import KillPlanetGame from "pages/canvas/KillPlanetGame.vue";

const contentRoutes = [
  {
    path: "/html",
    children: [
      {
        path: "/html/visualDesign",
        component: VisualDesign,
      },
      {
        path: "/html/backgroundEffect",
        component: BackgroundEffect,
      },
    ],
  },
  {
    path: "/css",
    children: [
      {
        path: "/css/dynamicButtons",
        component: DynamicButtons,
      },
    ],
  },
  {
    path: "/canvas",
    children: [
      {
        path: "/canvas/dynamicClock",
        component: DynamicClock,
      },
      {
        path: "/canvas/searchlight",
        component: Searchlight,
      },
      {
        path: "/canvas/globuleInteraction",
        component: GlobuleInteraction,
      },
      {
        path: "/canvas/killPlanetGame",
        component: KillPlanetGame,
      },
    ],
  },
  {
    path: "/",
    redirect: "/html/visualDesign",
  },
  {
    path: "/:pathMatch(.*)*",
    component: ComingSoon,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: contentRoutes,
});

export default router;
