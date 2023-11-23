/** 
 * 地球展示c
 */
<script setup lang="ts">
import { ref, Ref, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { AppstoreOutlined } from "@ant-design/icons-vue";
import {
  Scene,
  BufferGeometry,
  SphereGeometry,
  PlaneGeometry,
  Material,
  PointsMaterial,
  MeshBasicMaterial,
  SpriteMaterial,
  ShaderMaterial,
  Mesh,
  Points,
  Sprite,
  BufferAttribute,
  Color,
  Object3D,
  Texture,
  Vector3,
  DoubleSide,
  CanvasTexture,
} from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ResourceManager from "constants/ResourceManager";
import earthVertex from "./earthShaders/vertex.vs?raw";
import earthFragment from "./earthShaders/fragment.fs?raw";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";
import useInitialize from "hooks/threejs/useInitialize";
import useMoveTo from "hooks/useMoveTo";
import Border2 from "components/LargeScreenBorder/Border2.vue";
import luminousPointData from "./luminousPointData";
import { getTextWidth } from "utils/util";
import { lon2xyz, distoryObject } from "utils/threejsUtil";
import { flyArc } from "./flyLine";
import pageBg from "images/threejs/pageBg.png";
import topBg from "images/threejs/topBg.png";
import shine from "images/threejs/shine.png";
import radialGradient from "images/threejs/radialGradient.png";
import earth from "images/threejs/earth.jpeg";
import glow from "images/threejs/glow.png";
import aperture from "images/threejs/aperture.png";
import lightColumn from "images/threejs/lightColumn.png";

const cameraInitPosition = { x: 0, y: 20, z: 110 }; // 相机初始位置
const earthRadius = 50; // 地球半径
const lightColumnStartColor = 0xe4007f; // 起始地址的光柱颜色
const lightColumnEndColor = 0xffffff; // 结束地址的光柱颜色
const fluctuatingApertureSize = earthRadius * 0.12; // 波动光圈大小
const fluctuatingApertureColor = 0xe99f68; // 波动光圈颜色
const flyLineOptions = {
  color: 0xf3ae76, // 航线的颜色
  arrowColor: 0xff7714, // 航线箭头的颜色
  speed: 0.005, // 飞行速度
};
const timeValue = 100;
const uniforms = {
  glowColor: {
    value: new Color(0x41b1b4),
  },
  scale: {
    type: "f",
    value: -1.0,
  },
  bias: {
    type: "f",
    value: 1.0,
  },
  power: {
    type: "f",
    value: 3.3,
  },
  time: {
    type: "f",
    value: timeValue,
  },
  isHover: {
    value: false,
  },
  map: {
    value: null,
  },
};
// 图片资源列表
const resourceList = [
  { name: "pageBg", url: pageBg },
  { name: "radialGradient", url: radialGradient },
  { name: "earth", url: earth },
  { name: "glow", url: glow },
  { name: "aperture", url: aperture },
  { name: "lightColumn", url: lightColumn },
];

let showMainPage: boolean = true;
let resourceManager: ResourceManager | null = null; // 图片资源管理器
let fluctuatingApertureList: Mesh[] = []; // 所有标注点的波动光圈对象
let flyLineList: Points[] = []; // 所有航线对象

const { t } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);
const topBoxRef = ref<HTMLDivElement | null>(null);
const leftBoxRef = ref<HTMLDivElement | null>(null);
const rightBoxRef = ref<HTMLDivElement | null>(null);
const controlsRef = ref<OrbitControls | null>(null);
const earthObjRef = ref<Object3D | null>(null); // 大地球对象(包含大气层)

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

// 创建星空并添加到场景中
const createStarrySky = (scene: Scene) => {
  const vertices: number[] = [];
  for (let i = 0; i < 500; i++) {
    const x = 800 * Math.random() - 300;
    const y = 800 * Math.random() - 300;
    const z = 800 * Math.random() - 300;
    vertices.push(x, y, z);
  }

  const starrySkyGeometry = new BufferGeometry();
  starrySkyGeometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(vertices), 3)
  );

  const starrySkyMaterial = new PointsMaterial({
    size: 2,
    sizeAttenuation: true, // 尺寸衰减
    color: 0x41b1b4,
    transparent: true,
    opacity: 1,
    map: resourceManager?.textures.radialGradient,
  });

  const starrySky = new Points(starrySkyGeometry, starrySkyMaterial);
  scene.add(starrySky);
};

// 创建大地球对象并添加到场景中
const createEarthObj = (scene: Scene) => {
  // 初始化一个大地球对象
  const earthObj = new Object3D();
  // 创建地球几何体
  const earthGeometry = new SphereGeometry(earthRadius, 50, 50);
  // 创建地球材质
  if (resourceManager?.textures?.earth) {
    // @ts-ignore
    uniforms.map.value = resourceManager.textures.earth as Texture;
  }
  const earthMaterial = new ShaderMaterial({
    uniforms,
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    //   wireframe: true, // 显示模型线条
  });
  earthMaterial.needsUpdate = true;
  // 创建地球球体;
  const earth = new Mesh(earthGeometry, earthMaterial);
  earth.name = "earth";
  // 将地球球体添加到大地球对象中
  earthObj.add(earth);

  // 创建地球大气层几何体
  const earthBorderGeometry = new SphereGeometry(earthRadius + 10, 60, 60);
  // 创建地球大气层几何体
  const earthBorderMaterial = new PointsMaterial({
    color: 0x81ffff, //设置颜色，默认 0xFFFFFF
    transparent: true,
    sizeAttenuation: true,
    opacity: 0.1,
    vertexColors: false, // 定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
    size: 0.01, // 定义粒子的大小。默认为1.0
  });
  // 创建地球大气层
  const earthBorder = new Points(earthBorderGeometry, earthBorderMaterial);
  // 将地球大气层添加到大地球对象中
  earthObj.add(earthBorder);

  // 创建地球辉光
  const glowMaterial = new SpriteMaterial({
    map: resourceManager?.textures.glow,
  });
  const glow = new Sprite(glowMaterial);
  glow.scale.set(earthRadius * 3, earthRadius * 3, 1);
  earthObj.add(glow);

  scene.add(earthObj);
  earthObjRef.value = earthObj;
};

// 创建标注点
const createMarkupPoint = (lon: number, lat: number, isStartCity = false) => {
  const markupPoint = new Object3D();

  // 创建光柱底座矩形平面
  const baseGeometry = new PlaneGeometry(1, 1);
  const baseMaterial = new MeshBasicMaterial({
    color: 0x41b1b4,
    map: resourceManager?.textures.aperture,
    transparent: true, // 使用背景透明的png贴图，注意开启透明计算
    opacity: 1,
    depthWrite: false, // 禁止写入深度缓冲区数据
  });
  const baseMesh = new Mesh(baseGeometry, baseMaterial);
  const coord = lon2xyz(earthRadius * 1.001, lon, lat); // 经纬度转球面坐标
  const size = earthRadius * 0.05;
  baseMesh.scale.set(size, size, size);
  baseMesh.position.set(coord.x, coord.y, coord.z);
  const coordVec3 = coord.clone().normalize();
  baseMesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), coordVec3);
  markupPoint.add(baseMesh);

  // 创建波动光圈
  const fluctuatingApertureMeterial = baseMaterial.clone();
  fluctuatingApertureMeterial.color = new Color(fluctuatingApertureColor);
  const fluctuatingAperture = new Mesh(
    baseGeometry,
    fluctuatingApertureMeterial
  );
  // 经纬度转球面坐标
  fluctuatingAperture.scale.set(
    fluctuatingApertureSize,
    fluctuatingApertureSize,
    fluctuatingApertureSize
  );
  // 在对象中添加自定义数据
  fluctuatingAperture.userData = {
    size: fluctuatingApertureSize,
    scale: Math.random() * 1.0,
  };
  fluctuatingAperture.position.set(coord.x, coord.y, coord.z);
  fluctuatingAperture.position.copy(baseMesh.position);
  fluctuatingAperture.quaternion.copy(baseMesh.quaternion);
  markupPoint.add(fluctuatingAperture);
  fluctuatingApertureList.push(fluctuatingAperture);

  // 创建光柱(两各相互垂直交叉平面组成)
  const lightColumn = new Object3D();
  const height = earthRadius * 0.25;
  const geometry = new PlaneGeometry(earthRadius * 0.05, height);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 0, height / 2);
  const material = new MeshBasicMaterial({
    map: resourceManager?.textures.lightColumn,
    color: isStartCity ? lightColumnStartColor : lightColumnEndColor,
    transparent: true,
    side: DoubleSide,
    depthWrite: false, // 禁止写入深度缓冲区数据
  });
  const mesh = new Mesh(geometry, material);
  // 两个光柱交叉叠加
  lightColumn.add(mesh, mesh.clone().rotateZ(Math.PI / 2)); // 几何体绕x轴旋转了，所以mesh旋转轴变为z
  // 经纬度转球面坐标
  const sphereCoord = lon2xyz(earthRadius, lon, lat); // SphereCoord球面坐标
  lightColumn.position.set(sphereCoord.x, sphereCoord.y, sphereCoord.z); //设置mesh位置
  lightColumn.quaternion.setFromUnitVectors(
    new Vector3(0, 0, 1),
    sphereCoord.clone().normalize()
  );
  markupPoint.add(lightColumn);

  return markupPoint;
};

// 创建标注点上空的地名标签
const createSpriteLabel = (lon: number, lat: number, name: string) => {
  const canvas = document.createElement("canvas");
  const fontSize = 20;
  const fontWeight = 500;
  const marginLeftRight = 16;
  const marginTopBottom = 8;
  const textWidth = getTextWidth(name, fontSize, fontWeight);
  canvas.width = textWidth + 2 * marginLeftRight;
  canvas.height = fontSize + 2 * marginTopBottom;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "#41B1B460";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontWeight} ${fontSize}px SourceHanSansCN-Bold`;
  ctx.strokeStyle = "#ffffff";
  ctx.strokeText(name, marginLeftRight, marginTopBottom + fontSize - 2);

  const material = new SpriteMaterial({
    map: new CanvasTexture(canvas),
    transparent: true,
  });
  const sprite = new Sprite(material);
  sprite.scale.set(canvas.width * 0.1, canvas.height * 0.1, 1);
  const coord = lon2xyz(earthRadius * 1.001, lon, lat); // 经纬度转球面坐标
  sprite.position.set(coord.x * 1.1, coord.y * 1.1, coord.z * 1.1);
  return sprite;
};

// 创建所有标注点并添加到大地球对象上
const addMarkupPoint = () => {
  luminousPointData.forEach((item) => {
    const lightColumn1 = createMarkupPoint(item.start.E, item.start.N, true);
    earthObjRef.value?.add(lightColumn1);
    const label1 = createSpriteLabel(
      item.start.E,
      item.start.N,
      item.start.name
    );
    earthObjRef.value?.add(label1);

    item.endArray.forEach((item2) => {
      const lightColumn2 = createMarkupPoint(item2.E, item2.N);
      earthObjRef.value?.add(lightColumn2);
      const label2 = createSpriteLabel(item2.E, item2.N, item2.name);
      earthObjRef.value?.add(label2);
    });
  });
};

// 创建航线并添加到大地球对象上
const addFlyLine = () => {
  luminousPointData.forEach((item) => {
    item.endArray.forEach((item2) => {
      const arcLine = flyArc(
        earthRadius,
        item.start.E,
        item.start.N,
        item2.E,
        item2.N,
        flyLineOptions
      );
      earthObjRef.value?.add(arcLine);
      flyLineList.push(arcLine.userData["flyLine"]);
    });
  });
};

const initializeHandle = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  if (containerRef.value) {
    resourceManager = new ResourceManager(resourceList, () => {
      // 添加背景图
      if (resourceManager?.textures?.pageBg) {
        scene.background = resourceManager.textures.pageBg;
      }

      camera.position.set(
        cameraInitPosition.x,
        cameraInitPosition.y,
        cameraInitPosition.z
      );

      createStarrySky(scene);
      createEarthObj(scene);
      addMarkupPoint();
      addFlyLine();

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1; // 动态阻尼系数
      controlsRef.value = controls;
    });
  }
};

const renderHandle = () => {
  // 给所有标注点的波动光圈添加动画
  fluctuatingApertureList.forEach((mesh: Mesh) => {
    mesh.userData.scale = mesh.userData.scale + 0.01;
    const newScale = mesh.userData.size * mesh.userData.scale;
    mesh.scale.set(newScale, newScale, newScale);
    if (newScale <= fluctuatingApertureSize * 1.5) {
      (mesh.material as Material).opacity = Math.max(
        ((newScale - fluctuatingApertureSize) / fluctuatingApertureSize) * 0.5,
        1
      ); // 透明度在0~1之间逐渐增加
    } else if (
      newScale > fluctuatingApertureSize * 1.5 &&
      newScale <= fluctuatingApertureSize * 2
    ) {
      (mesh.material as Material).opacity = Math.min(
        1 -
          ((newScale - fluctuatingApertureSize) / fluctuatingApertureSize) *
            0.3,
        0
      ); // 透明度在0~1之间逐渐减小
    } else {
      mesh.userData.scale = 1;
    }
  });

  // 给航线添加飞行动画
  flyLineList.forEach((fly) => {
    fly.rotation.z += flyLineOptions.speed;
    // @ts-ignore
    if (fly.rotation.z >= fly.flyEndAngle) fly.rotation.z = 0;
  });

  // 动态修改着色器参数
  uniforms.time.value =
    uniforms.time.value < -timeValue ? timeValue : uniforms.time.value - 1;

  controlsRef.value?.update();
};

const { sceneRef, resize } = useInitialize(
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

onUnmounted(() => {
  distoryObject(earthObjRef.value, sceneRef.value);
});
</script>

<template>
  <div class="container" ref="containerRef">
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
        <Border2 :title="t('common.moduleTitle')">
          {{ t("common.customizeContent") }}
        </Border2>
      </div>
      <div class="item">
        <Border2>
          {{ t("common.customizeContent") }}
        </Border2>
      </div>
    </div>
    <div class="rightBox" ref="rightBoxRef">
      <div class="item">
        <Border2 :title="t('common.moduleTitle')">
          {{ t("common.customizeContent") }}
        </Border2>
      </div>
      <div class="item">
        <Border2>
          {{ t("common.customizeContent") }}
        </Border2>
      </div>
    </div>
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
