<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <div class="ebook-popup-title-text">{{$t('book.selectFont')}}</div>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item, index) in fontFamily" :key="index"
          @click="setFontFamily(item.font)">
          <div class="ebook-popup-item-text"
               :class="{'selected': isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check"
               v-show="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { FONT_FAMILY } from '../../utils/book'
  import { saveFontFamily } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    data() {
      return {
        fontFamily: FONT_FAMILY
      }
    },
    methods: {
      hide() {
        this.setFontFamilyVisible(false)
      },
      isSelected(item) {
        return this.defaultFontFamily === item.font
      },
      setFontFamily(font) {
        this.setDefaultFontFamily(font) // 视觉效果改变
        saveFontFamily(this.fileName, font) // 保存字体
        // 设置字体本身和设置字号一样，很简单。
        // 但是epubjs创建的book是在一个iframe中的，是一个独立的DOM。
        // 所以引入的字体文件在Book对象中使用不了。
        // 解决方法是 使用epubjs提供的钩子函数content+contents.addStylesheet(url)
        // addStylesheet参数为url 所以直接给地址没有用，要把字体文件放到nginx服务器上
        if (font === 'Default') { // 真实改变电子书字体
          this.currentBook.rendition.themes.font('Times New Roman')
        } else {
          this.currentBook.rendition.themes.font(font)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .ebook-popup-list {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 103;
    width: 100%;  /*不设置height 高度自适应*/
    background: white;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    .ebook-popup-title{
      position: relative; /*箭头 相对标题栏进行定位*/
      box-sizing: border-box;
      padding: px2rem(15);
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center; /*文字居中*/
      .ebook-popup-title-icon{
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        font-size: px2rem(16);
        font-weight: bold;
        @include center;  /*箭头垂直居中*/
      }
      .ebook-popup-title-text{
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper{
      .ebook-popup-item{
        display: flex;
        padding: px2rem(15);
        .ebook-popup-item-text{
          flex: 1;
          text-align: left;
          font-size: px2rem(14);
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check{
          flex: 1;
          text-align: right;
          font-size: px2rem(14);
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
