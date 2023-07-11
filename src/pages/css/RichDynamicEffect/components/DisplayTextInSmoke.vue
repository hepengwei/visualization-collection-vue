<script setup lang="ts">
import { ref } from 'vue';

const videoRef = ref<HTMLVideoElement | null>(null);
const pRef = ref<HTMLParagraphElement | null>(null);

const onceAgain = () => {
  if (pRef.value) {
    Array.prototype.forEach.call(
      pRef.value.children,
      (span: HTMLSpanElement) => {
        let className = "span1";
        if (span.className === "span1") {
          className = "span2";
        }
        span.className = className;
      }
    );
  }
  videoRef.value?.load();
};
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <video muted autoPlay preload="true" x5-video-player-fullscreen="true" x5-playsinline="true" playsInline
        webkit-playsinline="true" ref="videoRef">
        <source src="/smoke.mp4" />
      </video>
      <p ref="pRef">
        <span class="span1">H</span>
        <span class="span1">E</span>
        <span class="span1">L</span>
        <span class="span1">L</span>
        <span class="span1">O</span>
        <span class="span1">W</span>
        <span class="span1">O</span>
        <span class="span1">R</span>
        <span class="span1">L</span>
        <span class="span1">D</span>
      </p>
      <a-button type="primary" class="btn" @click="onceAgain">
        Once Again
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 500px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #000;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right,
        #f00,
        #f00,
        #0f0,
        #0ff,
        #ff0,
        #0ff);
    mix-blend-mode: color;
    pointer-events: none;
  }

  video {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  p {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    color: #ddd;
    font-size: 80px;
    font-weight: 500;
    letter-spacing: 0.2em;

    @mixin span {
      opacity: 0;
      display: inline-block;

      &:nth-child(1) {
        animation-delay: 1s;
      }

      &:nth-child(2) {
        animation-delay: 2s;
      }

      &:nth-child(3) {
        animation-delay: 2.5s;
      }

      &:nth-child(4) {
        animation-delay: 3s;
      }

      &:nth-child(5) {
        animation-delay: 3.5s;
      }

      &:nth-child(6) {
        animation-delay: 3.75s;
        margin-left: 50px;
      }

      &:nth-child(7) {
        animation-delay: 4s;
      }

      &:nth-child(8) {
        animation-delay: 4.5s;
      }

      &:nth-child(9) {
        animation-delay: 5s;
      }

      &:nth-child(10) {
        animation-delay: 5.5s;
      }
    }

    .span1 {
      @include span;
      animation: textAnimation1 1s linear forwards;
    }

    .span2 {
      @include span;
      animation: textAnimation2 1s linear forwards;
    }

    @keyframes textAnimation1 {
      0% {
        opacity: 0;
        transform: rotateY(90deg);
        filter: blur(10px);
      }

      100% {
        opacity: 1;
        transform: rotateY(0deg);
        filter: blur(0);
      }
    }

    @keyframes textAnimation2 {
      0% {
        opacity: 0;
        transform: rotateY(90deg);
        filter: blur(10px);
      }

      100% {
        opacity: 1;
        transform: rotateY(0deg);
        filter: blur(0);
      }
    }
  }

  .btn {
    position: absolute;
    width: 100px;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}
</style>