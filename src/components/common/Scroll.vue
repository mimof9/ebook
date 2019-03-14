<template>
  <div class="scroll-wrapper"
       :class="{'no-scroll': ifNoScroll}"
       @scroll.passive="handleScroll"
       ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
  import { realPx } from '../../utils/utils'

  export default {
    props: {
      top: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      ifNoScroll: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleScroll(e) {
        const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        // console.log(offsetY) // e.target.scrollTop表示向上滚动的距离
        // this.$emit('onScroll', offsetY) // 调用父组件的onScroll方法
      },
      scrollTo(x, y) {
        // this.$refs.scrollWrapper.scrollTo(x, y) // 滚动到指定坐标
      },
      refresh() {
        if (this.$refs.scrollWrapper) {
          this.$refs.scrollWrapper.style.height = window.innerHeight -
            realPx(this.top) - realPx(this.bottom) + 'px'
          // this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
        }
      }
    },
    mounted() {
      this.refresh()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .scroll-wrapper {
    position: relative;
    z-index: 100;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; // 移动端滑动更流畅
    &::-webkit-scrollbar {
      display: none; // 隐藏chrome滑动时的滑块
    }
    &.no-scroll {
      overflow: hidden;
    }
  }
</style>
