<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div class="setting-theme-item"
          v-for="(item, index) in themeList" :key="index"
          @click="setTheme(index)">
          <div class="preview" :style="{background: item.style.body.background}"
               :class="{'selected': item.name === defaultTheme}"></div>
          <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { saveTheme } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    methods: {
      setTheme(index) {
        const theme = this.themeList[index]
        // 这里vuex实现异步的是一个promise对象 成功设置视觉后再实际改变主题
        this.setDefaultTheme(theme.name).then(() => {
          this.currentBook.rendition.themes.select(this.defaultTheme)
          this.initGlobalTheme() // 改变全局主题
        })
        saveTheme(this.fileName, theme.name)
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
    .setting-theme {
      height: 100%;
      display: flex;
      .setting-theme-item {
        flex: 1;
        box-sizing: border-box;
        padding: px2rem(5);
        display: flex;
        flex-direction: column;
        .preview {
          flex: 1;
          box-sizing: border-box;
          border: px2rem(1) solid #ccc;
          &.selected {
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .1)
          }
        }
        .text {
          flex: 0 0 px2rem(20);
          font-size: px2rem(14);
          color: #ccc;
          @include center;
          &.selected {
            color: #333;
          }
        }
      }
    }
  }
</style>
