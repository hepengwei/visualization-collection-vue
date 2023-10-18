/**
 * 缓动动画
 */
import { Ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";

type Direction = "toBottom" | "toTop" | "toLeft" | "toRight";

const useMoveTo = function (
  eleRef: Ref<HTMLDivElement | null>,
  direction: Direction,
  duration: number = 1,
  delay: number = 0,
  fixedTransform: string = ""
) {
  let tween: gsap.core.Tween | null = null;

  const restart = () => {
    if (tween) {
      tween.invalidate();
      tween.restart(true);
    }
  };

  const reverse = () => {
    tween?.reverse();
  };

  onMounted(() => {
    if (eleRef && eleRef.value) {
      const { clientWidth, clientHeight } = eleRef.value;
      let transformFrom = "";
      switch (direction) {
        case "toTop":
          transformFrom = `translate(0px, ${clientHeight}px)`;
          break;
        case "toBottom":
          transformFrom = `translate(0px, ${-clientHeight}px)`;
          break;
        case "toLeft":
          transformFrom = `translate(${clientWidth}px), 0px`;
          break;
        case "toRight":
          transformFrom = `translate(${-clientWidth}px), 0px`;
          break;
      }
      tween = gsap.fromTo(
        eleRef.value,
        {
          opacity: 0,
          transform: `${transformFrom} ${fixedTransform}`,
        },
        {
          opacity: 1,
          transform: `translate(0px, 0px) ${fixedTransform}`,
          duration,
          delay,
        }
      );
    }
  });

  onUnmounted(() => {
    tween?.kill();
  });

  return { tween, restart, reverse };
};

export default useMoveTo;
