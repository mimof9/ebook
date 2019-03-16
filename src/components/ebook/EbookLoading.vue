<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subitem, index) in item" :key="index">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
  import { px2rem } from '../../utils/utils'

  export default {
    data() {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        lineWidth: [
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 }
        ],
        maskWidth: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ],
        add: false // line是否增长
      }
    },
    mounted() {
      this.task = setInterval(() => {
        this.$refs.mask.forEach((item, index) => {
          const line = this.$refs.line[index]
          const mask = this.$refs.mask[index]
          let lineWidth = this.lineWidth[index]
          let maskWidth = this.maskWidth[index]

          if (index === 0) {
            if (this.add && lineWidth.value < 16) {
              lineWidth.value++
              maskWidth.value--
            } else if (!this.add && maskWidth.value < 16) {
              lineWidth.value--
              maskWidth.value++
            }
          } else {
            let preLineWidth = this.lineWidth[index - 1]
            if (this.add && lineWidth.value < 16) {
              if (preLineWidth.value >= 8) {
                lineWidth.value++
                maskWidth.value--
              }
            } else if (!this.add && maskWidth.value < 16) {
              if (preLineWidth.value <= 8) {
                lineWidth.value--
                maskWidth.value++
              }
            }
          }

          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`

          if (index === this.$refs.mask.length - 1) {
            this.add = this.add ? lineWidth.value !== 16 : lineWidth.value === 0
            // 下面这段代码可以精简成上面一句
            // if (this.add) {
            //   if (lineWidth.value === 16) {
            //     this.add = false
            //   }
            // } else {
            //   if (lineWidth.value === 0) {
            //     this.add = true
            //   }
            // }
          }
        })
      }, 10)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      .ebook-loading-item {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        padding: px2rem(7) 0;
        display: flex;
        flex-direction: column;
        .ebook-loading-line-wrapper {
          flex: 1;
          box-sizing: border-box;
          padding: 0 px2rem(7);
          @include left;
          .ebook-loading-line {
            flex: 0 0 px2rem(16);
            height: px2rem(2);
            background: #7d7d7d;
          }
          .ebook-loading-mask {
            // line有颜色 mask没有颜色 两者平凡宽度 动态改变占比形成动画
            flex: 0 0 0;
            height: px2rem(2);
          }
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      top: 0;
      height: 100%;
      width: px2rem(1.5);
      background: #d7d7d7;
    }
  }
</style>
