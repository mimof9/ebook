import Storage from 'web-storage-cache'

// 为什么不直接用原生的localstorage？ 这个库在存储是把对象转成json 在获取时将json转成对象 更方便一些

const localStorage = new Storage()

export function setLocalStorage(key, val) {
  return localStorage.set(key, val)
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

// 每一本书 都应该有自己独立的设置
export function setBookObject(fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book) // 更新
}

export function getBookObject(fileName, key) {
  let book = getLocalStorage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}

// 获取指定书的字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily(fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}

// 获取指定书的字号
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

export function saveFontSize(fileName, size) {
  return setBookObject(fileName, 'fontSize', size)
}

// 获取国际化语言选择
export function getLocale() {
  return getLocalStorage('locale')
}

export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

// 获取主题
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
  return setBookObject(fileName, 'theme', theme)
}

// 保存电子书进度
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation(fileName, location) {
  return setBookObject(fileName, 'location', location)
}

// 获取电子书阅读事件
export function getReadTime(fileName) {
  return getBookObject(fileName, 'readTime')
}

export function saveReadTime(fileName, readTime) {
  return setBookObject(fileName, 'readTime', readTime)
}

// 电子书书签缓存
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
  return setBookObject(fileName, 'bookmark', bookmark)
}
