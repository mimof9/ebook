const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1, // 设置栏 -1：不显示 0：字体 1：主题 2：进度 3：目录
    defaultFontSize: 16,
    currentBook: null, // this.book
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    progress: 0, // 阅读进度
    bookAvailable: false, // 电子书是否加载完成
    section: 0, // 当前章节位置 传递给book.section可以获得章节信息 然后渲染sectionInfo.href
    cover: '', // 电子书封面
    metadata: null,
    navigation: null, // 一维目录
    offsetY: 0, // 书签下拉距离
    isBookmark: null, // 当前页是否为书签页
    pagelist: null, // 分页结果
    paginate: 0 // 当前页 比较粗略
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE': (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    'SET_SETTINGVISIBLE': (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    'SET_DEFAULTFONTSIZE': (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    },
    'SET_CURRENTBOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    'SET_DEFAULTFONTFAMILY': (state, defaultFontFamily) => {
      state.defaultFontFamily = defaultFontFamily
    },
    'SET_FONTFAMILYVISIBLE': (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    'SET_DEFAULTTHEME': (state, defaultTheme) => {
      state.defaultTheme = defaultTheme
    },
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    'SET_BOOKAVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    'SET_SECTION': (state, section) => {
      state.section = section
    },
    'SET_COVER': (state, cover) => {
      state.cover = cover
    },
    'SET_METADATA': (state, metadata) => {
      state.metadata = metadata
    },
    'SET_NAVIGATION': (state, navigation) => {
      state.navigation = navigation
    },
    'SET_OFFSETY': (state, offsetY) => {
      state.offsetY = offsetY
    },
    'SET_ISBOOKMARK': (state, isBookmark) => {
      state.isBookmark = isBookmark
    },
    'SET_PAGELIST': (state, pagelist) => {
      state.pagelist = pagelist
    },
    'SET_PAGINATE': (state, paginate) => {
      state.paginate = paginate
    }

  }
  // actions移动到 actionis.js进行独立的管理
  // actions: {
  //   setFileName: ({ commit }, fileName) => {
  //     return commit('SET_FILENAME', fileName)
  //   },
  //   setMenuVisible: ({ commit }, menuVisible) => {
  //     return commit('SET_MENUVISIBLE', menuVisible)
  //   }
  // }
}

export default book
