<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-more"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'menuVisible'
      ])
    },
    methods: {
      back() {
        console.log('back')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    width: 100%;  /*绝对定位后 不再充满父元素 需要手动设置100%*/
    height: px2rem(48);
    background: white;
    font-size: px2rem(20);
    /*box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);*/ /*使用px2rem函数指定阴影没有效果*/
    box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, .15);
    display: flex;
    .left {
      flex: 0 0 px2rem(60);
      @include center;
    }
    .right {
      flex: 1;
      justify-content: flex-end;
      display: flex;
      .icon-wrapper {
        flex: 0 0 px2rem(40);
        @include center();
      }
    }
  }
</style>
