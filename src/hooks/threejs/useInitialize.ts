import { ref, Ref, onMounted, onUnmounted } from "vue";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  BufferGeometry,
  Texture,
  Material,
} from "three";
import { disposeThreeJsScene } from "utils/threejsUtil";

export type AssetManager = {
  geometries: Map<string, BufferGeometry>;
  textures: Map<string, Texture>;
  materials: Map<string, Material>;
};

type Handle = (
  scene: Scene,
  cameraRef: PerspectiveCamera,
  renderer: WebGLRenderer,
) => void;

type InitializeHandle = (
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  assetManager: AssetManager,
) => boolean | void;

const useInitialize = (
  conatinerRef: Ref<HTMLDivElement | null>,
  initializeHandle?: InitializeHandle | null,
  resizeHandle?: Handle | null,
  renderHandle?: Handle | null,
) => {
  let scene: Scene | null = null;
  let camera: PerspectiveCamera | null = null;
  let renderer: WebGLRenderer | null = null;
  const assetManager: AssetManager = {
    geometries: new Map(),
    textures: new Map(),
    materials: new Map(),
  };
  let frameId = 0;
  const sceneRef = ref<Scene | null>(null);
  const cameraRef = ref<PerspectiveCamera | null>(null);
  const rendererRef = ref<WebGLRenderer | null>(null);

  const render = () => {
    if (scene && camera && renderer) {
      if (renderHandle) {
        const hasRender: boolean | void = renderHandle(scene, camera, renderer);
        // @ts-ignore
        if (!hasRender) {
          renderer.render(scene, camera);
        }
      } else {
        renderer.render(scene, camera);
      }
      frameId = window.requestAnimationFrame(render);
    }
  };

  const init = () => {
    if (conatinerRef.value) {
      const { clientWidth, clientHeight } = conatinerRef.value;

      // 创建场景
      scene = new Scene();
      sceneRef.value = scene;

      // 创建相机
      camera = new PerspectiveCamera(
        75,
        clientWidth / clientHeight,
        0.01,
        1000,
      );
      camera.position.set(0, 0, 10);
      cameraRef.value = camera;

      // 创建渲染器
      renderer = new WebGLRenderer({ antialias: true });
      rendererRef.value = renderer;
      renderer.setSize(clientWidth, clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio, 2); // 别超过 2
      renderer.setPixelRatio(pixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.outputColorSpace = SRGBColorSpace;

      // 将Canvas插入到页面
      conatinerRef.value.append(renderer.domElement);

      // 渲染
      render();

      initializeHandle?.(scene, camera, renderer, assetManager);
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
      const pixelRatio = Math.min(window.devicePixelRatio, 2); // 别超过 2
      renderer.setPixelRatio(pixelRatio);

      resizeHandle?.(scene, camera, renderer);
    }
  };

  onMounted(() => {
    init();
    window.addEventListener("resize", onResize);
  });

  onUnmounted(() => {
    frameId && window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    // 销毁three.js场景中的所有GPU资源对象，防止内存泄漏
    disposeThreeJsScene(scene, renderer);
  });

  const result: {
    sceneRef: Ref<Scene | null>;
    cameraRef: Ref<PerspectiveCamera | null>;
    rendererRef: Ref<WebGLRenderer | null>;
    resize: () => void;
  } = {
    sceneRef,
    cameraRef,
    rendererRef,
    resize: onResize,
  };

  return result;
};

export default useInitialize;
