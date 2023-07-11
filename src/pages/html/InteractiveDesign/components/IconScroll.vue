<script setup lang="ts">
import {
  AndroidOutlined,
  AppleOutlined,
  WindowsOutlined,
  IeOutlined,
  ChromeOutlined,
  GithubOutlined,
  AliwangwangOutlined,
  DingdingOutlined,
  WeiboSquareOutlined,
  WeiboCircleOutlined,
  TaobaoCircleOutlined,
  Html5Outlined,
  WeiboOutlined,
  TwitterOutlined,
  WechatOutlined,
  YoutubeOutlined,
  AlipayCircleOutlined,
  TaobaoOutlined,
  SkypeOutlined,
  QqOutlined,
  GitlabOutlined,
  MediumOutlined,
  LinkedinOutlined,
  GooglePlusOutlined,
  DropboxOutlined,
  FacebookOutlined,
  CodepenOutlined,
  CodeSandboxOutlined,
  AmazonOutlined,
  GoogleOutlined,
  CodepenCircleOutlined,
  AlipayOutlined,
  AntDesignOutlined,
  AntCloudOutlined,
  AliyunOutlined,
  ZhihuOutlined,
  SlackOutlined,
  SlackSquareOutlined,
  BehanceOutlined,
  BehanceSquareOutlined,
  DribbbleOutlined,
  AccountBookOutlined,
  AimOutlined,
  AlertOutlined,
  ApartmentOutlined,
  ApiOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  AuditOutlined,
  BankOutlined,
  BarcodeOutlined,
  BarsOutlined,
  BellOutlined,
  BlockOutlined,
  BookOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CameraOutlined,
  CarOutlined,
  CarryOutOutlined,
  ClearOutlined,
  CloudDownloadOutlined,
  CloudSyncOutlined,
  CoffeeOutlined,
  CompassOutlined,
  ConsoleSqlOutlined,
  ContactsOutlined,
  ContainerOutlined,
  ControlOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  DingtalkOutlined,
  GiftOutlined,
  SettingOutlined,
  TrophyOutlined,
} from "@ant-design/icons-vue";

const list = new Array(40).fill(0);
const iconList = [AndroidOutlined,
  AppleOutlined,
  WindowsOutlined,
  IeOutlined,
  ChromeOutlined,
  GithubOutlined,
  AliwangwangOutlined,
  DingdingOutlined,
  WeiboSquareOutlined,
  WeiboCircleOutlined,
  TaobaoCircleOutlined,
  Html5Outlined,
  WeiboOutlined,
  TwitterOutlined,
  WechatOutlined,
  YoutubeOutlined,
  AlipayCircleOutlined,
  TaobaoOutlined,
  SkypeOutlined,
  QqOutlined,
  GitlabOutlined,
  MediumOutlined,
  LinkedinOutlined,
  GooglePlusOutlined,
  DropboxOutlined,
  FacebookOutlined,
  CodepenOutlined,
  CodeSandboxOutlined,
  AmazonOutlined,
  GoogleOutlined,
  CodepenCircleOutlined,
  AlipayOutlined,
  AntDesignOutlined,
  AntCloudOutlined,
  AliyunOutlined,
  ZhihuOutlined,
  SlackOutlined,
  SlackSquareOutlined,
  BehanceOutlined,
  BehanceSquareOutlined,
  DribbbleOutlined,
  AccountBookOutlined,
  AimOutlined,
  AlertOutlined,
  ApartmentOutlined,
  ApiOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  AuditOutlined,
  BankOutlined,
  BarcodeOutlined,
  BarsOutlined,
  BellOutlined,
  BlockOutlined,
  BookOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CameraOutlined,
  CarOutlined,
  CarryOutOutlined,
  ClearOutlined,
  CloudDownloadOutlined,
  CloudSyncOutlined,
  CoffeeOutlined,
  CompassOutlined,
  ConsoleSqlOutlined,
  ContactsOutlined,
  ContainerOutlined,
  ControlOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  DingtalkOutlined,
  GiftOutlined,
  SettingOutlined,
  TrophyOutlined];

const onMouseOver = (e: MouseEvent) => {
  if (e.target && (e.target as Element).tagName === "SPAN") {
    const svg = (e.target as HTMLSpanElement).children[0] as SVGAElement;
    svg.style.color = "#0f0";
    svg.style.transition = '0s';
    svg.style.filter = "drop-shadow(0 0 20px #0f0)";
  }
}

const onMouseLeave = (e: MouseEvent) => {
  if (e.target && (e.target as Element).tagName === "SPAN") {
    const svg = (e.target as HTMLSpanElement).children[0] as SVGAElement;
    svg.style.color = "rgba(0, 0, 0, 0.5)";
    svg.style.transition = '1.5s';
    svg.style.filter = "none";
  }
}
</script>

<template>
  <div style="width: 100%">
    <div class="iconScroll">
      <div v-for="(_, index) in list" :key="index" class="row">
        <div v-for="(_, index) in 2" :key="index">
          <template v-for="icon in iconList">
            <component :is="icon" style="color: rgba(0, 0, 0, 0.5);transition: 1.5s;filter: none;"
              @mouseenter="onMouseOver" @mouseleave="onMouseLeave"></component>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.iconScroll {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;

  .row {
    position: relative;
    width: 100%;
    display: flex;
    white-space: nowrap;
    font-size: 42px;
    transform: rotate(-30deg) translate(-560px, -560px);

    $duration: 150s;

    div {
      animation: animate1 $duration linear infinite;
      animation-delay: -$duration;

      &:nth-child(2) {
        animation: animate2 $duration linear infinite;
        animation-delay: calc($duration/ -2);
      }
    }

    &:nth-child(even) div {
      font-size: 1em;
      white-space: nowrap;
      animation: animate3 $duration linear infinite;
      animation-delay: -$duration;

      &:nth-child(2) {
        animation: animate4 $duration linear infinite;
        animation-delay: calc($duration/ -2);
      }
    }
  }

  @keyframes animate1 {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes animate2 {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(-200%);
    }
  }

  @keyframes animate3 {
    0% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(100%);
    }
  }

  @keyframes animate4 {
    0% {
      transform: translateX(-200%);
    }

    100% {
      transform: translateX(0);
    }
  }
}
</style>