<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="onMouseDown"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseUp"></div>
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'
  // import { mapActions } from 'vuex'
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  import { getFontFamily, saveFontFamily,
    getFontSize, saveFontSize,
    getTheme, saveTheme,
    getLocation } from '../../utils/localStorage'
  import { flatten } from '../../utils/book'

  global.ePub = Epub
  export default {
    mixins: [ebookMixin],
    mounted() {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.$store.dispatch('setFileName', fileName).then(() => {
        this.initEpub()
      })
    },
    methods: {
      // PC端适配手势书签
      // 1 鼠标down
      // 2 鼠标down+move
      // 3 鼠标move+up
      // 4 鼠标down+up
      onMouseUp(e) {
        if (this.mousestate === 2) { // 点击鼠标移动后
          this.mousestate = 3
          this.firstTouch = 0
          this.setOffsetY(0)
        } else { // 点击鼠标没有移动
          this.mousestate = 4
        }
        // 防止点击时轻微的移动造成的点击事件不响应
        const time = e.timeStamp - this.startClickTime
        if (time < 100) {
          this.mousestate = 4
        }
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseMove(e) {
        if (this.mousestate === 1) {
          this.mousestate = 2
        } else if (this.mousestate === 2) {
          let offsetY = this.offsetY
          if (this.firstTouch) {
            offsetY = e.clientY - this.firstTouch
            this.setOffsetY(offsetY)
          } else {
            this.firstTouch = e.clientY
          }
          e.preventDefault()
          e.stopPropagation()
        }
      },
      onMouseDown(e) {
        this.mousestate = 1
        this.startClickTime = e.timeStamp
        e.preventDefault()
        e.stopPropagation()
      },
      move(e) {
        let offsetY = this.offsetY
        if (this.firstTouch) {
          offsetY = e.changedTouches[0].clientY - this.firstTouch
          this.setOffsetY(offsetY)
        } else {
          this.firstTouch = e.changedTouches[0].clientY
        }
        e.preventDefault() // 阻止默认行为 否者下拉的时候 会看到微信的背板 这里禁止冒泡
        e.stopPropagation()
      },
      moveEnd(e) {
        this.firstTouch = 0
        this.setOffsetY(0)
      },
      onMaskClick(e) {
        if (this.mousestate && (this.mousestate === 2 || this.mousestate === 3)) {
          return
        }
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0) {
          if (offsetX < width * 0.3) {
            this.prevPage()
          } else if (offsetX > width * 0.7) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
        }
      },
      initTheme() {
        // 初始化主题
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme) // 将缓存中的主题设置到vuex
        // 注册主题 epubjs修改主题要先注册
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme) // 因为vuex是异步方法 所以不使用this.defaultTheme
      },
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.setDefaultFontSize(fontSize)
          this.rendition.themes.fontSize(fontSize)
        }
      },
      initFontFamily() {
        let font = getFontFamily(this.fileName)
        if (!font) { // 电子书没有保存字体，将默认字体保存
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.setDefaultFontFamily(font)
          this.rendition.themes.font(font)
        }
      },
      initRendition() {
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          method: 'default'
          // flow: 'scrolled' // 滚动阅读模式 微信不支持
        })
        // 电子书渲染完成后 调用then display是this.rendition.display的封装 添加了进度刷新和保存
        const location = getLocation(this.fileName) // 获取保存的进度
        this.display(location, () => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalTheme()
        })
        // epubjs钩子函数 当内容加载完毕后 注入nginx服务器上的字体
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet('http://localhost:8081/fonts/cabin.css'),
            contents.addStylesheet('http://localhost:8081/fonts/daysOne.css'),
            contents.addStylesheet('http://localhost:8081/fonts/montserrat.css'),
            contents.addStylesheet('http://localhost:8081/fonts/tangerine.css')
          ]).then(function() {
            console.log('字体文件载入完成...')
          })
        })
      },
      // initGesture() {
      //   // 监听滑动手势 根据滑动方向和时间
      //   this.rendition.on('touchstart', event => {
      //     this.touchStartX = event.changedTouches[0].clientX
      //     this.touchStartTime = event.timeStamp
      //   })
      //   this.rendition.on('touchend', event => {
      //     const offsetX = event.changedTouches[0].clientX - this.touchStartX
      //     const time = event.timeStamp - this.touchStartTime
      //     if (time < 500 && offsetX > 40) {
      //       this.prevPage()
      //     } else if (time < 500 && offsetX < -40) {
      //       this.nextPage()
      //     } else {
      //       this.toggleTitleAndMenu()
      //     }
      //     event.preventDefault()
      //     event.stopPropagation()
      //   })
      // },
      parseBook() {
        // 解析电子书 获取电子书的一些内容 封面 书名 作者等
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        this.book.loaded.navigation.then(nav => {
          const navItem = flatten(nav.toc)
          // 扁平化之后带来的问题是不清楚目录原来的层级 下面来求目录的层级
          function findLevel(item, level = 0) {
            if (!item.parent) {
              return level // 如果没有parent 返回
            } else {
              let parentItem = navItem.filter(parentItem => item.parent === parentItem.id)[0]
              return findLevel(parentItem, ++level)
            }
          }
          // 给一维目录添加层级属性
          navItem.forEach(item => {
            item.level = findLevel(item)
          })
          // 添加到vuex
          this.setNavigation(navItem)
        })
      },
      initEpub() {
        const url = 'http://localhost:8081/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book) // 将电子书对象传入vuex 这样就不需要在子组件中调父组件方法了
        this.initRendition()
        // this.initGesture()
        this.parseBook()
        // 电子书加载完毕的钩子函数
        this.book.ready.then(() => {
          // 设置一页显示的字数 屏幕越大字数越多 字体越大字数越少 这个分页算法很粗糙
          return this.book.locations.generate(750 * (window.innerWidth / 375) *
            (getFontSize(this.fileName) / 16))
        }).then(locations => {
          console.log(`电子书载入完成...`) // locations保存的是分页后的电子书
          this.navigation.forEach(nav => {
            nav.pagelist = []
          })
          // 确定每个章节的页数
          locations.forEach(item => {
            const loc = item.match(/\[(.*)\]!/)[1]
            this.navigation.forEach(nav => {
              if (nav.href) {
                const href = nav.href.match(/^(.*)\.x?html$/)[1]
                if (href === loc) {
                  nav.pagelist.push(item)
                }
              }
            })
          })
          // 前缀和求每章的起始页数
          let presum = 1
          this.navigation.forEach((nav, index) => {
            if (index === 0) {
              nav.page = 1
            } else {
              nav.page = presum
            }
            presum += nav.pagelist.length + 1
          })
          this.setPagelist(locations) // 在vuex中将分页结果保存在下来
          this.setBookAvailable(true)
          this.refreshLocation() // 电子书初次渲染的时候 locations分页还没建好 所以progress===null 进度条0
        })
      },
      prevPage() {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu() {
        // this.$store.dispatch('setMenuVisible', !this.menuVisible)
        this.setMenuVisible(!this.menuVisible)
        this.setSettingVisible(-1) // menu栏显示，隐藏 setting栏都要缩回去
        this.setFontFamilyVisible(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 150; // 蒙板 提供手势操作
      width: 100%;
      height: 100%;
      background: transparent;
    }
  }
</style>
