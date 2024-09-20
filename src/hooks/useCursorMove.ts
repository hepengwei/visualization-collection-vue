/**
 * 实现圆点延迟跟随鼠标移动效果
 */
import { ref, Ref, watch, onUnmounted } from 'vue';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';

interface MousePos {
  mouseX: number | null;
  mouseY: number | null;
}
type CursorSize = 'default' | 'big';

const useCursorMove = (
  containerRef: Ref<HTMLDivElement | null>,
  cursorRef: Ref<HTMLDivElement | null>,
  cursorDefaultRadius = 10,
  cursorBigRadius = 40,
  cursorMoveVCoefficient = 0.12
) => {
  const globalContext = useGlobalContext() as Ref<GlobalContext>;
  const showCursor = ref<boolean>(false);
  const cursorSize = ref<CursorSize>('default');
  const mousePos = ref<MousePos>({
    mouseX: null,
    mouseY: null,
  });
  const cursorFrameId = ref<number>(0);

  const onMouseEnter = (e: MouseEvent) => {
    const containerNode = containerRef.value;
    const cursorNode = cursorRef.value;
    if (!containerNode || !cursorNode) return;
    const { clientX, clientY } = e;
    showCursor.value = true;
    const { offsetLeft = 0, offsetTop = 0 } = containerNode;
    mousePos.value = {
      mouseX: clientX - offsetLeft,
      // @ts-ignore
      mouseY: clientY - (offsetTop - globalContext.value.scrollTop),
    };

    cursorNode.style.left = `${
      (mousePos.value.mouseX || 0) - cursorDefaultRadius
    }px`;
    cursorNode.style.top = `${
      (mousePos.value.mouseY || 0) - cursorDefaultRadius
    }px`;
  };

  const onMouseMove = (e: MouseEvent) => {
    const containerNode = containerRef.value;
    if (!containerNode) return;
    const { clientX, clientY } = e;
    const { offsetLeft = 0, offsetTop = 0 } = containerNode;
    mousePos.value = {
      mouseX: clientX - offsetLeft,
      // @ts-ignore
      mouseY: clientY - (offsetTop - globalContext.value.scrollTop),
    };
  };

  const onMouseLeave = (e: MouseEvent) => {
    const containerNode = containerRef.value;
    if (!containerNode) return;
    const { clientX, clientY } = e;
    showCursor.value = false;
    if (!containerNode) return;
    const { offsetLeft = 0, offsetTop = 0 } = containerNode;
    mousePos.value = {
      mouseX: clientX - offsetLeft,
      // @ts-ignore
      mouseY: clientY - (offsetTop - globalContext.value.scrollTop),
    };
  };

  const loop = () => {
    const { mouseX, mouseY } = mousePos.value;
    if (mouseX !== null && mouseY !== null) {
      let cursorRadius = cursorDefaultRadius;
      if (cursorSize.value === 'big') {
        cursorRadius = cursorBigRadius;
      }
      const cursorNode = cursorRef.value;
      if (!cursorNode) return;

      const left = cursorNode.style.left
        ? parseFloat(cursorNode.style.left)
        : null;
      const top = cursorNode.style.top
        ? parseFloat(cursorNode.style.top)
        : null;
      if (left !== null && top !== null) {
        const distX = mouseX - (left + cursorRadius);
        const distY = mouseY - (top + cursorRadius);
        const dist = Math.hypot(distX, distY);
        if (dist > 0) {
          if (dist <= 0.1) {
            cursorNode.style.left = `${left}px`;
            cursorNode.style.top = `${top}px`;
          } else {
            const cursorMoveVX = distX * cursorMoveVCoefficient;
            const cursorMoveVY = distY * cursorMoveVCoefficient;
            cursorNode.style.left = `${left + cursorMoveVX}px`;
            cursorNode.style.top = `${top + cursorMoveVY}px`;
          }
        }
      }
    }
    cursorFrameId.value = window.requestAnimationFrame(loop);
  };

  watch(
    cursorSize,
    () => {
      cursorFrameId.value && window.cancelAnimationFrame(cursorFrameId.value);
      cursorFrameId.value = window.requestAnimationFrame(loop);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    cursorFrameId.value && window.cancelAnimationFrame(cursorFrameId.value);
  })

  return {
    showCursor,
    cursorSize,
    cursorDefaultRadius,
    cursorBigRadius,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
  };
};

export default useCursorMove;
