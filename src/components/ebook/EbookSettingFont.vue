<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <div class="setting-font-size">
        <div class="preview" :style="{fontSize: fontSizeList[0].fontSize+'px'}">A</div>
        <div class="select">
          <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index"
            @click="setFontSize(item.fontSize)">
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length-1].fontSize+'px'}">A</div>
      </div>
      <div class="setting-font-family" @click="showFontFamilyPopup">
        <div class="setting-font-family-text-wrapper">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { FONT_SIZE_LIST } from '../../utils/book'
  import { saveFontSize } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    data() {
      return {
        fontSizeList: FONT_SIZE_LIST
      }
    },
    methods: {
      setFontSize(fontSize) {
        this.setDefaultFontSize(fontSize) // 视觉上改变按钮的显示
        this.currentBook.rendition.themes.fontSize(fontSize) // 真实改变电子书字号
        saveFontSize(this.fileName, fontSize) // 保存字号
      },
      showFontFamilyPopup() {
        this.setFontFamilyVisible(true)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .setting-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(48);
    z-index: 101;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    display: flex;
    flex-direction: column;
    .setting-font-size {
      flex: 2;
      /*height: 100%; !*充满setting-wrapper 定位和大小 === setting-wrapper*!*/
      display: flex;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        flex: 1;
        display: flex;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            position: relative; /*子元素定位*/
            flex: 0 0 0;
            width: 0; /*不占横向空间*/
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              top: px2rem(-8);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border: px2rem(1) solid #ccc;
              background: white;
              border-radius: 50%;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);
              @include center;
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
    .setting-font-family {
      flex: 1;
      font-size: px2rem(14);
      @include center;
      .setting-font-family-text-wrapper {
        //@include center;
      }
      .setting-font-family-icon-wrapper {
        //@include center;
      }
    }
  }
</style>
