/**
 * 添加鼠标准星
 */
import { Ref, ShallowRef } from "vue";
import {
  Scene,
  PerspectiveCamera,
  Vector2,
  Vector3,
  Raycaster,
  Object3D,
} from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
  // @ts-ignore
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

let frameCount = 0;
const RAY_INTERVAL = 6; // 每 N 帧检测一次

export const addCrosshair = (
  scene: Scene,
  container: HTMLDivElement | null,
  labelRendererRef: ShallowRef<CSS2DRenderer | null>,
  raycasterRef: ShallowRef<Raycaster | null>,
  reticleRef: ShallowRef<CSS2DObject | null>,
) => {
  frameCount = 0;
  if (container) {
    // 创建 labelRenderer
    const labelRenderer = new CSS2DRenderer();
    labelRendererRef.value = labelRenderer;
    const { clientWidth, clientHeight } = container;
    labelRenderer.setSize(clientWidth, clientHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.left = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    labelRenderer.domElement.style.zIndex = "10";
    container.appendChild(labelRenderer.domElement);
  }

  if (scene) {
    // 创建鼠标准星
    const reticleDiv = document.createElement("div");
    // 必须通过内联样式设置，因为这是动态创建的 DOM，Vue 的 scoped CSS 无法应用
    reticleDiv.style.width = "12px";
    reticleDiv.style.height = "12px";
    reticleDiv.style.border = "2px solid #ff3b32";
    reticleDiv.style.borderRadius = "50%";
    reticleDiv.style.boxSizing = "border-box";
    reticleDiv.style.pointerEvents = "none";
    reticleDiv.style.position = "absolute";
    reticleDiv.style.top = "-12px";
    reticleDiv.style.left = "-12px";
    const reticle = new CSS2DObject(reticleDiv);
    reticle.scale.set(0.2, 0.2, 0.2); // 控制大小
    reticleRef.value = reticle;
    scene?.add(reticle);
  }

  // 创建射线
  const raycaster = new Raycaster();
  raycasterRef.value = raycaster;
  raycaster.far = 50; // 超过 50 个单位不检测
};

export const resizeCrosshair = (
  container: HTMLDivElement | null,
  labelRenderer: CSS2DRenderer | null,
) => {
  if (container && labelRenderer) {
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
  }
};

export const crosshairRender = (
  scene: Scene,
  camera: PerspectiveCamera,
  labelRenderer: CSS2DRenderer | null,
  raycaster: Raycaster | null,
  reticle: CSS2DObject | null,
  viewModeRef: Ref<"overview" | "roaming">,
  mousePositionRef: Ref<Vector2>,
  mouseRaycasterIntersectObjectsRef: Ref<Object3D[]>,
  outlinePass: OutlinePass | null,
  mouseRaycasterIntersectedRef: ShallowRef<Object3D | null>,
) => {
  if (!reticle) return;
  const showCrosshair = viewModeRef.value === "overview"; // 是否显示3D准星
  // 控制3D准星的显示/隐藏, 在漫游模式下隐藏3D准星
  reticle.visible = showCrosshair;
  if (raycaster) {
    // 在漫游模式下，准星固定在屏幕中心(0, 0)；在整体模式下，跟随鼠标位置
    const crosshairPosition =
      viewModeRef.value === "roaming"
        ? new Vector2(0, 0) // 屏幕中心
        : mousePositionRef.value; // 鼠标位置
    raycaster.setFromCamera(crosshairPosition as Vector2, camera);

    // 每帧都更新准星位置（让视觉跟随流畅），默认沿射线到一个固定距离
    if (showCrosshair) {
      const defaultDistance = 10; // 默认距离
      const defaultPoint = new Vector3();
      raycaster.ray.at(defaultDistance, defaultPoint);
      reticle?.position.copy(defaultPoint);
    }

    // 射线检测节流（只节流物体检测，不节流视觉更新），提高性能
    frameCount++;
    if (frameCount % RAY_INTERVAL === 0) {
      const hits = raycaster.intersectObjects(
        mouseRaycasterIntersectObjectsRef.value,
        true,
      );
      if (hits.length > 0) {
        // 准星贴在命中点
        if (showCrosshair) {
          reticle.position.copy(hits[0].point);
        }

        if (outlinePass) {
          const firstHit = hits[0].object;
          // 处理高亮切换
          if (mouseRaycasterIntersectedRef.value !== firstHit) {
            // 设置新的高亮
            outlinePass.selectedObjects = [firstHit];
            mouseRaycasterIntersectedRef.value = firstHit;
          }
        }
      } else {
        // 没打到物体：沿鼠标射线飞到远处
        if (showCrosshair) {
          const t = camera.far * 0.95; // 接近远裁面
          const farPoint = new Vector3();
          raycaster.ray.at(t, farPoint);
          reticle.position.copy(farPoint);
        }
        if (outlinePass) {
          // 没有瞄准任何东西，清除高亮
          if (mouseRaycasterIntersectedRef.value) {
            outlinePass.selectedObjects = [];
          }
        }
        mouseRaycasterIntersectedRef.value = null;
      }
    }
  }
  labelRenderer.render(scene, camera);
};

export const createOutlinePass = (
  scene: Scene,
  camera: PerspectiveCamera,
  container: HTMLDivElement,
) => {
  const { clientWidth, clientHeight } = container;
  const outlinePass = new OutlinePass(
    new Vector2(clientWidth, clientHeight),
    scene,
    camera,
  );
  outlinePass.visibleEdgeColor.set("#1758ee"); // 高亮颜色
  outlinePass.hiddenEdgeColor.set("#1758ee");
  outlinePass.edgeThickness = 1.6; // 边缘厚度
  outlinePass.edgeStrength = 10; // 边缘强度
  outlinePass.edgeGlow = 1; // 发光
  outlinePass.downSampleRatio = 1; // 抗锯齿
  return outlinePass;
};
