<template>
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible">
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
      showSetting(key) {
        console.log('showSetting' + key)
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
    z-index: 101;
    width: 100%;
    height: px2rem(48);
    background: white;
    font-size: px2rem(20);
    box-shadow: 0 -0.1rem 0.1rem rgba(0, 0, 0, .15);
    display: flex;
    .icon-wrapper {
      flex: 1;
      @include center;
    }
  }
</style>
