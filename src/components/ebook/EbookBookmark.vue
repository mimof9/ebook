<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmarktext">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapepr">
      <bookmark :color="color" :width="15" :height="35"
                :style="isFixed ? fixedStyle : {}"></bookmark>
    </div>
  </div>
</template>

<script>
  import { px2rem, realPx } from '../../utils/utils'
  import Bookmark from '../common/Bookmark'
  import { ebookMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    computed: {
      height() {
        return realPx(35)
      },
      threshould() {
        // 添加书签的高度
        return realPx(55)
      },
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${px2rem(15)}rem`
        }
      }
    },
    methods: {
      restore(v) {
        // 松手后书签相对移动的位置要还原 但是不能立刻还原 要等过渡动画完成再还原
        this.$refs.iconDown.style.transform = `` // 小图标立即归位
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${px2rem(-35)}rem`
        }, 200)
        if (this.isFixed) { // 添加书签
          this.setIsBookmark(true)
          // 添加书签到本地缓存
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      beforeHeight(v) {
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold(v) {
        this.$refs.bookmark.style.top = `${-v}px` // 超出书签高度后 书签向上移动 看起来就静止了
        this.beforeHeight(v)
        // 箭头旋转
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = ''
        }
      },
      afterThreshold(v) {
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      },
      addBookmark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        this.currentBook.getRange(cfirange).then(range => {
          const text = range.toString().replace(/\s\s/g, '')
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi)) // 删除书签
          this.setIsBookmark(false) // vuex中删除书签
        }
      }
    },
    watch: {
      offsetY(v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return // 书没加载完 菜单栏 设置栏在显示时 不监听
        }
        if (v === 0) {
          this.restore(v)
        } else if (v > 0 && v < this.height) {
          this.beforeHeight()
        } else if (v >= this.height && v < this.threshould) {
          this.beforeThreshold(v)
        } else if (v >= this.threshould) {
          this.afterThreshold(v)
        }
      },
      isBookmark(v) {
        if (v) {
          this.color = BLUE
          this.isFixed = true
        } else {
          this.color = WHITE
          this.isFixed = false
        }
      }
    },
    data() {
      return {
        text: '',
        color: WHITE,
        isFixed: false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmarktext {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapepr {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
