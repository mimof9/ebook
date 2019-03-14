import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation } from './localStorage'
// 使用vue的mixin机制混入vuex 实现代码复用
// mapGetters简化 this.$store.book.xxx的写法为 this.xxx
// mapActions简化 this.$store.dispatch('methodName', val)的写法为 this.methodName(val)
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section',
      'cover',
      'metadata',
      'navigation'
    ]),
    themeList() {
      return themeList(this)
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation'
    ]),
    initGlobalTheme() {
      // addCss('http://localhost:8081/theme/theme_gold.css')
      removeAllCss()
      addCss(`http://localhost:8081/theme/theme_${this.defaultTheme.toLowerCase()}.css`)
    },
    // 获取电子书当前页信息(start开始 end结束)
    // 读取当前页起始位置start.cfi 通过cfi获取进度
    // 设置vuex中progress 设置章节序号 保存start.cfi
    refreshLocation() {
      const currentLocationInfo = this.currentBook.rendition.currentLocation()
      if (currentLocationInfo && currentLocationInfo.start) {
        const startCfi = currentLocationInfo.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocationInfo.start.index)
        saveLocation(this.fileName, startCfi)
      }
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    hideTitleAndMenu() {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1) // menu栏隐藏 setting栏要缩回去
      this.setFontFamilyVisible(false) // 字体弹出兰隐藏
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}
