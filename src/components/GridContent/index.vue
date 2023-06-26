<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import classNames from "classnames";

interface Props {
    differentScreenCols: [number, number, number, number, number, number?]; // 设置窗口在大于2000px、1700-2000px、1400-1700px、1200-1400px、500-1200px、小于500px时每行所显示的列数，列数支持1-10的整数
    rowSpace?: number; // 每行间距
    colSpace?: number; // 每列间距
}

const { differentScreenCols, rowSpace = 0, colSpace = 0 } = defineProps<Props>();

const finalCols: ComputedRef<string[]> = computed(() => differentScreenCols.map(
    (item: number | undefined, index: number) => {
        if (!item) {
            if (index <= 4) {
                return "1";
            }
            return "";
        }
        return parseInt(item.toString()).toString();
    }
));

const containerClass: ComputedRef<string> = computed(() => {
    return classNames({
        "container": true,
        [`gt2000-${finalCols.value[0]}`]: true,
        [`eq1700_2000-${finalCols.value[1]}`]: true, [`eq1400_1700-${finalCols.value[2]}`]: true,
        [`eq1200_1400-${finalCols.value[3]}`]: true, [`eq500_1200-${finalCols.value[4]}`]: true,
        [`lt500-${finalCols.value[5]}`]: !!finalCols.value[5],
    })
})

const contentStyle = computed(() => {
    return `width: calc(100% + ${colSpace}px); margin-left: ${-(colSpace / 2)}px; margin-right:
            ${-(colSpace / 2)}px; display: flex`
})
</script>

<template>
    <div>
        <div :class="containerClass">
            <div class="content" :style="contentStyle">
                <slot :rowSpace="rowSpace" :colSpace="colSpace"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    box-sizing: border-box;
    width: 100%;
}

@mixin contentBase {
    box-sizing: border-box;
    display: inline-grid !important;
    grid-template-rows: auto !important;
}

/**
 * 窗口大于2000px时的样式
 */
.gt2000-10 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 10%);
        }
    }
}

.gt2000-9 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 11.11%);
        }
    }
}

.gt2000-8 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 12.5%);
        }
    }
}

.gt2000-7 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 14.28%);
        }
    }
}

.gt2000-6 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 16.66%);
        }
    }
}

.gt2000-5 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 20%);
        }
    }
}

.gt2000-4 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 25%);
        }
    }
}

.gt2000-3 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 33.33%);
        }
    }
}

.gt2000-2 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 50%);
        }
    }
}

.gt2000-1 {
    @media screen and (min-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}

/**
 * 窗口为1700px-2000px时的样式
 */
.eq1700_2000-10 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 10%);
        }
    }
}

.eq1700_2000-9 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 11.11%);
        }
    }
}

.eq1700_2000-8 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 12.5%);
        }
    }
}

.eq1700_2000-7 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 14.28%);
        }
    }
}

.eq1700_2000-6 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 16.66%);
        }
    }
}

.eq1700_2000-5 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 20%);
        }
    }
}

.eq1700_2000-4 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 25%);
        }
    }
}

.eq1700_2000-3 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 33.33%);
        }
    }
}

.eq1700_2000-2 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 50%);
        }
    }
}

.eq1700_2000-1 {
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}

/**
 * 窗口为1400px-1700px时的样式
 */
.eq1400_1700-10 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 10%);
        }
    }
}

.eq1400_1700-9 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 11.11%);
        }
    }
}

.eq1400_1700-8 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 12.5%);
        }
    }
}

.eq1400_1700-7 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 14.28%);
        }
    }
}

.eq1400_1700-6 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 16.66%);
        }
    }
}

.eq1400_1700-5 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 20%);
        }
    }
}

.eq1400_1700-4 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 25%);
        }
    }
}

.eq1400_1700-3 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 33.33%);
        }
    }
}

.eq1400_1700-2 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 50%);
        }
    }
}

.eq1400_1700-1 {
    @media screen and (min-width: 1400px) and (max-width: 1700px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}

/**
 * 窗口为1200px-1400px时的样式
 */
.eq1200_1400-10 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 10%);
        }
    }
}

.eq1200_1400-9 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 11.11%);
        }
    }
}

.eq1200_1400-8 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 12.5%);
        }
    }
}

.eq1200_1400-7 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 14.28%);
        }
    }
}

.eq1200_1400-6 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 16.6%);
        }
    }
}

.eq1200_1400-5 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 20%);
        }
    }
}

.eq1200_1400-4 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 25%);
        }
    }
}

.eq1200_1400-3 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 33.33%);
        }
    }
}

.eq1200_1400-2 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 50%);
        }
    }
}

.eq1200_1400-1 {
    @media screen and (min-width: 1200px) and (max-width: 1400px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}

/**
 * 窗口为500px-1200px时的样式
 */
.eq500_1200-10 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 10%);
        }
    }
}

.eq500_1200-9 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 11.11%);
        }
    }
}

.eq500_1200-8 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 12.5%);
        }
    }
}

.eq500_1200-7 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 14.28%);
        }
    }
}

.eq500_1200-6 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 16.66%);
        }
    }
}

.eq500_1200-5 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 20%);
        }
    }
}

.eq500_1200-4 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 25%);
        }
    }
}

.eq500_1200-3 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 33.33%);
        }
    }
}

.eq500_1200-2 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 50%);
        }
    }
}

.eq500_1200-1 {
    @media screen and (min-width: 500px) and (max-width: 1200px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}

/**
 * 窗口小于500px时的样式
 */
.lt500-10 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 10%);
        }
    }
}

.lt500-9 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 11.11%);
        }
    }
}

.lt500-8 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 12.5%);
        }
    }
}

.lt500-7 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 14.28%);
        }
    }
}

.lt500-6 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 16.66%);
        }
    }
}

.lt500-5 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 20%);
        }
    }
}

.lt500-4 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 25%);
        }
    }
}

.lt500-3 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 33.33%);
        }
    }
}

.lt500-2 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 50%);
        }
    }
}

.lt500-1 {
    @media screen and (max-width: 500px) {
        .content {
            @include contentBase;
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}
</style>