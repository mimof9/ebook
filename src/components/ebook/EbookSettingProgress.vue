<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-back"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="preSection()">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 :value="progress"
                 :disabled="!bookAvailable"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 ref="progress">
          <!-- ref是为了让vue获取DOM -->
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    updated() {
      // vue的钩子函数 刷新时 重设进度条
      this.updateProgressBg()
    },
    methods: {
      updateProgressBg() {
        // 设置进度条背景 左深右浅
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      },
      displayProgress() {
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        this.display(cfi)
      },
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          this.displayProgress()
        })
      },
      onProgressInput(progress) {
        this.setProgress(progress)
      },
      displaySection() {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          this.display(sectionInfo.href)
        }
      },
      preSection() {
        if (this.bookAvailable && this.section > 0) {
          this.setSection(this.section - 1).then(() => {
            this.displaySection()
          })
        }
      },
      nextSection() {
        if (this.bookAvailable && this.section < this.currentBook.spine.length - 1) {
          this.setSection(this.section + 1).then(() => {
              this.displaySection()
          })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 201;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center;
      }
      .progress-wrapper {
        box-sizing: border-box;
        padding: 0 px2rem(15);
        width: 100%;
        height: 100%;
        @include center;
        .progress-icon-wrapper {
          font-size: px2rem(20);
        }
        .progress {
          -webkit-appearance: none; /*清除range浏览器样式*/
          width: 100%;
          height: px2rem(2);
          margin: 0 px2rem(10);
          background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
          background-size: 0 100%;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border: px2rem(1) solid #ddd;
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        box-sizing: border-box;
        padding: 0 px2rem(15);
        // text-align: center;
        @include center;
        .progress-section-text {
          // 这是一行显示文本的标准写法
          @include ellipsis;
        }
      }
    }
  }
</style>
