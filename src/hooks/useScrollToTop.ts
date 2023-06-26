import { onMounted } from "vue";
import type { Ref } from "vue";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";

const useScrollToTop = () => {
  const globalContext = useGlobalContext() as Ref<GlobalContext>;

  onMounted(() => {
    globalContext.value?.setScrollTop(0);
  });
};

export default useScrollToTop;
