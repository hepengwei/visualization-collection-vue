/** * 地图展示 */
<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { AppstoreOutlined } from "@ant-design/icons-vue";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { geoMercator } from "d3-geo";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";
import useInitialize from "hooks/threejs/useInitialize";
import useMoveTo from "hooks/useMoveTo";
import Border1 from "components/LargeScreenBorder/Border1.vue";
import pageBg from "images/threejs/pageBg.png";
import topBg from "images/threejs/topBg.png";
import shine from "images/threejs/shine.png";

const cameraInitPosition = { x: 0, y: -20, z: 80 }; // 相机初始位置
const mapInitPosition = { x: 0, y: 6, z: 0 }; // 地图初始位置
const mapDepth = 6; // 地图板块深度
const mapColor = "#008170"; // 地图表面颜色
const mapSideColor = "#1AACAC"; // 地图侧面颜色
const mapHoverColor = "#005B41"; // hover后的地图表面颜色

const raycaster: THREE.Raycaster = new THREE.Raycaster(); // 射线对象
let controls: OrbitControls | null = null;
let map: THREE.Object3D | null = null; // 3D地图对象
let mouse: THREE.Vector2 | null = null;
let lastPick: any = null;
let showMainPage: boolean = true;

const { t } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);
const tooltipRef = ref<HTMLDivElement | null>(null);
const topBoxRef = ref<HTMLDivElement | null>(null);
const leftBoxRef = ref<HTMLDivElement | null>(null);
const rightBoxRef = ref<HTMLDivElement | null>(null);

// 显示主面板
const { restart: topRestart, reverse: topReverse } = useMoveTo(
  topBoxRef,
  "toBottom",
  0.6
);
const { restart: leftRestart, reverse: leftReverse } = useMoveTo(
  leftBoxRef,
  "toRight",
  0.8,
  0.5
);
const { restart: rightRestart, reverse: rightReverse } = useMoveTo(
  rightBoxRef,
  "toLeft",
  0.8,
  0.5
);

// 显示或隐藏主面板
const showOrHideMainPage = () => {
  if (showMainPage) {
    topReverse();
    leftReverse();
    rightReverse();
  } else {
    topRestart();
    leftRestart();
    rightRestart();
  }
  showMainPage = !showMainPage;
};

// 创建地图对象并添加到场景中
const createMap = (data: Record<string, any>, scene: THREE.Scene) => {
  // 初始化一个地图对象
  map = new THREE.Object3D();
  // 墨卡托投影转换
  const projection = geoMercator()
    .center([104.0, 37.5])
    .scale(80)
    .translate([0, 0]);

  data.features.forEach(
    (elem: {
      type: string;
      properties: Record<string, any>;
      geometry: { type: string; coordinates: any[] };
    }) => {
      // 创建一个省份3D对象
      const province = new THREE.Object3D();
      // 每个的 坐标 数组
      const { coordinates } = elem.geometry;
      // 循环坐标数组
      coordinates.forEach((multiPolygon: any[]) => {
        multiPolygon.forEach((polygon) => {
          const shape = new THREE.Shape();

          // 给每个省的边界画线
          const lineGeometry = new THREE.BufferGeometry();
          const pointsArray = [];
          for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i]);
            if (i === 0) {
              shape.moveTo(x, -y);
            } else {
              shape.lineTo(x, -y);
            }
            pointsArray.push(new THREE.Vector3(x, -y, mapDepth));
          }
          lineGeometry.setFromPoints(pointsArray);

          const extrudeSettings = {
            depth: mapDepth,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1,
          };
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material1 = new THREE.MeshBasicMaterial({
            color: mapColor,
            transparent: true,
            opacity: 0.92,
          });
          const material2 = new THREE.MeshBasicMaterial({
            color: mapSideColor,
            transparent: true,
            opacity: 0.92,
          });

          const mesh = new THREE.Mesh(geometry, [material1, material2]);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: "white",
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          // 将省份的属性 加进来
          // @ts-ignore
          province.properties = elem.properties;
          province.add(mesh);
          province.add(line);
        });
      });
      map?.add(province);
    }
  );
  map.position.set(mapInitPosition.x, mapInitPosition.y, mapInitPosition.z);

  scene.add(map);
};

// 加载地图数据
const loadMapData = (scene: THREE.Scene) => {
  const loader = new THREE.FileLoader();
  loader.load("./public/json/ChinaMap.json", (data: string | ArrayBuffer) => {
    const jsondata = JSON.parse(data as string);
    createMap(jsondata, scene);
  });
};

const onMouseMove = (e: any) => {
  if (tooltipRef.value) {
    if (!mouse) {
      mouse = new THREE.Vector2();
    }
    const { clientX, clientY } = e;
    if (new THREE.Vector2())
      mouse.x =
        ((clientX - globalContext.value.menuWidth) /
          (window.innerWidth - globalContext.value.menuWidth)) *
          2 -
        1;
    mouse.y =
      -(
        (clientY - globalContext.value.headHeight) /
        (window.innerHeight - globalContext.value.headHeight)
      ) *
        2 +
      1;

    tooltipRef.value.style.left = `${
      clientX - globalContext.value.menuWidth + 4
    }px`;
    tooltipRef.value.style.top = `${
      clientY - globalContext.value.headHeight + 4
    }px`;
  }
};

const initializeHandle = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  if (containerRef.value) {
    // 添加背景图
    scene.background = new THREE.TextureLoader().load(pageBg);
    camera.position.set(
      cameraInitPosition.x,
      cameraInitPosition.y,
      cameraInitPosition.z
    );
    renderer.shadowMap.enabled = true;

    controls = new OrbitControls(camera, renderer.domElement);

    loadMapData(scene);
  }
};

const showTip = () => {
  if (tooltipRef.value) {
    // 显示省份的信息
    if (lastPick) {
      const { properties } = lastPick.object.parent;
      tooltipRef.value.textContent = properties.name;
      tooltipRef.value.style.visibility = "visible";
    } else {
      tooltipRef.value.style.visibility = "hidden";
    }
  }
};

const renderHandle = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
  if (map && mouse) {
    // 恢复上一次清空的
    if (lastPick) {
      lastPick.object.material[0].color.set(mapColor);
      lastPick.object.material[1].color.set(mapSideColor);
      if (tooltipRef.value) {
        tooltipRef.value.style.visibility = "hidden";
      }
    }
    lastPick = null;
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouse as THREE.Vector2, camera);
    // 算出射线 与当场景相交的对象有那些
    const intersects = raycaster.intersectObjects(scene.children, true);
    lastPick = intersects.find(
      (item: any) => item.object.material && item.object.material.length === 2
    );
    if (lastPick && lastPick.object?.parent?.properties?.name) {
      lastPick.object.material[0].color.set(mapHoverColor);
      lastPick.object.material[1].color.set(mapHoverColor);
      showTip();
    }
  }
  controls?.update();
};

const { resize } = useInitialize(
  containerRef,
  initializeHandle,
  null,
  renderHandle
);

watch(
  () => globalContext.value.menuWidth,
  () => {
    resize();
  }
);
</script>

<template>
  <div class="container" @mousemove="onMouseMove" ref="containerRef">
    <div class="switch" @click="showOrHideMainPage">
      <AppstoreOutlined />
    </div>
    <div class="topBox" ref="topBoxRef">
      <img :src="topBg" alt="" class="topBg" />
      <img :src="shine" alt="" class="shine" />
      <div class="leftLine" />
      <div class="rightLine" />
      <div class="title">
        <span>
          {{ t("page.threeJs3D.visualizationPlatform") }}
        </span>
      </div>
    </div>
    <div class="leftBox" ref="leftBoxRef">
      <div class="item">
        <Border1 :title="t('common.moduleTitle')">
          {{ t("common.customizeContent") }}
        </Border1>
      </div>
      <div class="item">
        <Border1>
          {{ t("common.customizeContent") }}
        </Border1>
      </div>
    </div>
    <div class="rightBox" ref="rightBoxRef">
      <div class="item">
        <Border1 :title="t('common.moduleTitle')">
          {{ t("common.customizeContent") }}
        </Border1>
      </div>
      <div class="item">
        <Border1>
          {{ t("common.customizeContent") }}
        </Border1>
      </div>
    </div>
    <div class="tooltip" ref="tooltipRef"></div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: #000808;
  overflow: hidden;
  position: relative;

  .switch {
    position: absolute;
    top: 40px;
    right: 20px;
    z-index: 2;
    cursor: pointer;
    :deep(svg) {
      width: 32px;
      height: 32px;
      path {
        fill: #00c6c6;
      }
    }
  }

  $topBoxHeight: 80px;
  $leftBoxWidth: 30%;
  $rightBoxWidth: 30%;

  .topBox {
    position: absolute;
    top: 0;
    width: 100%;
    height: $topBoxHeight;
    z-index: 1;
    transform: translate(0px, -$topBoxHeight);

    img {
      width: 100%;
      height: 61px;
    }
    $marginTop: 20px;
    $lineWidth: 120px;
    $lineHeight: 4px;
    .topBg {
      position: absolute;
      top: $marginTop;
      left: 0;
      right: 0;
      width: 100%;
      height: 61px;
    }
    .shine {
      position: absolute;
      top: $marginTop + 31px;
      left: 0;
      right: 0;
      width: 808px;
      height: 55px;
      margin: 0 auto;
    }
    .leftLine {
      position: absolute;
      top: calc($marginTop - calc($lineHeight / 2));
      left: 4%;
      width: $lineWidth;
      height: $lineHeight;
      border-radius: calc($lineHeight / 2);
      background-image: linear-gradient(to left, #b5eff6, #008f8f, #003d3d);
    }
    .rightLine {
      position: absolute;
      top: calc($marginTop - calc($lineHeight / 2) + 1px);
      right: 4%;
      width: $lineWidth;
      height: $lineHeight;
      border-radius: calc($lineHeight / 2);
      background-image: linear-gradient(to right, #b5eff6, #008f8f, #003d3d);
    }
    .title {
      position: absolute;
      top: 16px;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        text-align: center;
        font-size: 32px;
        font-weight: 600;
        font-family: "SourceHanSansCN-Bold" !important;
        background-image: linear-gradient(
          to right,
          #003d3d,
          #008f8f,
          #00cfcf,
          #008f8f,
          #003d3d
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
  }
  .leftBox {
    position: absolute;
    left: 0;
    top: $topBoxHeight;
    width: $leftBoxWidth;
    height: calc(100% - $topBoxHeight);
    z-index: 1;
    transform: translate(-$leftBoxWidth, 0px);

    .item {
      width: 100%;
      height: 40%;
      padding: 20px;
      &:last-child {
        height: 60%;
      }
    }
  }
  .rightBox {
    position: absolute;
    right: 0;
    top: $topBoxHeight;
    width: $rightBoxWidth;
    height: calc(100% - $topBoxHeight);
    z-index: 1;
    transform: translate($leftBoxWidth, 0px);

    .item {
      width: 100%;
      height: 40%;
      padding: 14px;
      &:last-child {
        height: 60%;
      }
    }
  }
  .tooltip {
    position: absolute;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    background-color: #ffffff;
    border-radius: 4px;
    visibility: hidden;
    z-index: 10;
  }
}
</style>
