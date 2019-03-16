<template>
  <div><!-- vue的组件需要一个统一的父元素 用这个空的div包裹起来 -->
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible"
        :class="{'hide-box-shadow': menuVisible && settingVisible >= 0}">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import EbookSettingFont from './EbookSettingFont'
  import EbookSettingFontPopup from './EbookSettingFontPopup'
  import EbookSettingTheme from './EbookSettingTheme'
  import EbookSettingProgress from './EbookSettingProgress'
  import EbookSlide from './EbookSlide'

  export default {
    mixins: [ebookMixin],
    components: {
      EbookSettingFont,
      EbookSettingFontPopup,
      EbookSettingTheme,
      EbookSettingProgress,
      EbookSlide
    },
    methods: {
      showSetting(key) {
        this.setSettingVisible(key)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .menu-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 202; /*setting栏是201 过度时更自然 但是也需要解决box-shadow问题*/
    width: 100%;
    height: px2rem(48);
    background: white;
    font-size: px2rem(20);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    display: flex;
    &.hide-box-shadow { /*setting栏显示时 menu栏隐藏阴影*/
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
    }
  }
</style>
