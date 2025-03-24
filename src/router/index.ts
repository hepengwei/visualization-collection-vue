// @ts-nocheck
import { createRouter, createWebHashHistory } from "vue-router";
import ComingSoon from "components/ComingSoon.vue";
import VisualDesign from "pages/html/VisualDesign/index.vue";
import InteractiveDesign from "pages/html/InteractiveDesign/index.vue";
import BackgroundEffect from "pages/html/BackgroundEffect/index.vue";
import ComplexLayout from "pages/html/ComplexLayout/index.vue";
import AppPageFrame from "pages/html/AppPageFrame/index.vue";
import UtilitarianFunction from "pages/html/UtilitarianFunction/index.vue";
import DynamicButtons from "pages/css/DynamicButtons/index.vue";
import RichDynamicEffect from "pages/css/RichDynamicEffect/index.vue";
import GenerateRegularPolygon from "pages/css/GenerateRegularPolygon/index.vue";
import GenerateShadow from "pages/css/GenerateShadow/index.vue";
// import GenerateScrollBar from "pages/css/GenerateScrollBar/index.vue";
import ElevatorNavigation from "pages/css/ElevatorNavigation/index.vue";
import SphereCollisionExample from "pages/canvas/SphereCollisionExample.vue";
import DynamicClock from "pages/canvas/DynamicClock.vue";
import Searchlight from "pages/canvas/Searchlight.vue";
import GlobuleInteraction from "pages/canvas/GlobuleInteraction.vue";
import KillPlanetGame from "pages/canvas/KillPlanetGame.vue";
import FreeFallingBody from "pages/canvas/FreeFallingBody.vue";
import CountDown from "pages/canvas/CountDown/index.vue";
import ParticlesBg from "pages/canvas/ParticlesBg/index.vue";
import RippleFloatOnTheWater from "pages/canvas/RippleFloatOnTheWater/index.vue";
import FlowerBloom from "pages/canvas/FlowerBloom/index.vue";
import CodeBgWall from "pages/canvas/CodeBgWall.vue";
import WordDance from "pages/canvas/WordDance.vue";
import Scratch from "pages/canvas/Scratch.vue";
import MatchLine from "pages/canvas/MatchLine.vue";
import AppPage3DFrame from "pages/threejs/AppPageFrame.vue";
import CarShow from "pages/threejs/CarShow.vue";
import RubiksCube from "pages/threejs/RubiksCube/index.vue";
import ThrowDice from "pages/threejs/ThrowDice.vue";
import MapDisplay from "pages/threejs/MapDisplay.vue";
import EarthDisplay from "pages/threejs/EarthDisplay/index.vue";
import HumanPostureDetection from "pages/AIApplication/HumanPostureDetection.vue";
import NotBlockPeopleBarrage from "pages/AIApplication/NotBlockPeopleBarrage.vue";
import ImageProcessingTool from "pages/ImageProcessingTool/index.vue";
import Bar from "pages/echarts/Bar/index.vue";
import Pie from "pages/echarts/Pie/index.vue";
import Tree from "pages/echarts/Tree/index.vue";

const contentRoutes = [
  {
    path: "/html",
    children: [
      {
        path: "/html/visualDesign",
        component: VisualDesign,
      },
      {
        path: "/html/interactiveDesign",
        component: InteractiveDesign,
      },
      {
        path: "/html/backgroundEffect",
        component: BackgroundEffect,
      },
      {
        path: "/html/complexLayout",
        component: ComplexLayout,
      },
      {
        path: "/html/appPageFrame",
        component: AppPageFrame,
      },
      {
        path: "/html/utilitarianFunction",
        component: UtilitarianFunction,
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
      {
        path: "/css/richDynamicEffect",
        component: RichDynamicEffect,
      },
      {
        path: "/css/generateRegularPolygon",
        component: GenerateRegularPolygon,
      },
      {
        path: "/css/generateShadow",
        component: GenerateShadow,
      },
      // {
      //   path: "/css/generateScrollBar",
      //   component: GenerateScrollBar,
      // },
      {
        path: "/css/elevatorNavigation",
        component: ElevatorNavigation,
      },
    ],
  },
  {
    path: "/canvas",
    children: [
      {
        path: "/canvas/sphereCollisionExample",
        component: SphereCollisionExample,
      },
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
      {
        path: "/canvas/freeFallingBody",
        component: FreeFallingBody,
      },
      {
        path: "/canvas/countDown",
        component: CountDown,
      },
      {
        path: "/canvas/particlesBg",
        component: ParticlesBg,
      },
      {
        path: "/canvas/rippleFloatOnTheWater",
        component: RippleFloatOnTheWater,
      },
      {
        path: "/canvas/flowerBloom",
        component: FlowerBloom,
      },
      {
        path: "/canvas/codeBgWall",
        component: CodeBgWall,
      },
      {
        path: "/canvas/wordDance",
        component: WordDance,
      },
      {
        path: "/canvas/scratch",
        component: Scratch,
      },
      {
        path: "/canvas/matchLine",
        component: MatchLine,
      },
    ],
  },
  {
    path: "/echarts",
    children: [
      {
        path: "/echarts/bar",
        component: Bar,
      },
      {
        path: "/echarts/pie",
        component: Pie,
      },
      {
        path: "/echarts/tree",
        component: Tree,
      },
    ],
  },
  {
    path: "/threejs",
    children: [
      {
        path: "/threejs/threejsAppPageFrame",
        component: AppPage3DFrame,
      },
      {
        path: "/threejs/carShow",
        component: CarShow,
      },
      {
        path: "/threejs/rubiksCube",
        component: RubiksCube,
      },
      {
        path: "/threejs/throwDice",
        component: ThrowDice,
      },
      {
        path: "/threejs/mapDisplay",
        component: MapDisplay,
      },
      {
        path: "/threejs/earthDisplay",
        component: EarthDisplay,
      },
    ],
  },
  {
    path: "/AIApplication",
    children: [
      {
        path: "/AIApplication/humanPostureDetection",
        component: HumanPostureDetection,
      },
      {
        path: "/AIApplication/notBlockPeopleBarrage",
        component: NotBlockPeopleBarrage,
      },
    ],
  },
  {
    path: "/imageProcessingTool",
    component: ImageProcessingTool,
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
