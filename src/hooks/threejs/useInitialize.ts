import { ref, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import * as THREE from "three";

type Handle = (
  scene: THREE.Scene,
  cameraRef: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => void;

const useInitialize = (
  conatinerRef: Ref<HTMLDivElement | null>,
  initializeHandle?: Handle | null,
  resizeHandle?: Handle | null,
  renderHandle?: Handle | null
) => {
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let frameId = 0;
  const sceneRef = ref<THREE.Scene | null>(null);
  const cameraRef = ref<THREE.PerspectiveCamera | null>(null);
  const rendererRef = ref<THREE.WebGLRenderer | null>(null);

  const render = () => {
    if (scene && camera && renderer) {
      renderer.render(scene, camera);
      renderHandle && renderHandle(scene, camera, renderer);
      frameId = window.requestAnimationFrame(render);
    }
  };

  const init = () => {
    if (conatinerRef.value) {
      const { clientWidth, clientHeight } = conatinerRef.value;

      // 创建场景
      scene = new THREE.Scene();
      sceneRef.value = scene;

      // 创建相机
      camera = new THREE.PerspectiveCamera(
        75,
        clientWidth / clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 10);
      cameraRef.value = camera;

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(clientWidth, clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      rendererRef.value = renderer;

      // 将Canvas插入到页面
      conatinerRef.value.append(renderer.domElement);

      // 渲染
      render();

      initializeHandle && initializeHandle(scene, camera, renderer);
    }
  };

  const onResize = () => {
    if (conatinerRef.value && scene && camera && renderer) {
      const { clientWidth, clientHeight } = conatinerRef.value;

      // 更新相机
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();

      // 更新渲染器
      renderer.setSize(clientWidth, clientHeight);

      // 设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio);

      resizeHandle && resizeHandle(scene, camera, renderer);
    }
  };

  onMounted(() => {
    init();
    window.addEventListener("resize", onResize);
  });

  onUnmounted(() => {
    frameId && window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
  });

  const result: {
    sceneRef: Ref<THREE.Scene | null>;
    cameraRef: Ref<THREE.PerspectiveCamera | null>;
    rendererRef: Ref<THREE.WebGLRenderer | null>;
  } = {
    sceneRef,
    cameraRef,
    rendererRef,
  };

  return result;
};

export default useInitialize;
