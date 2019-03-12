import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'

Vue.use(VueI18n) // 加载国际化插件

const messages = {
  en, cn
}

// let locale = 'en'
// 保存locale
let locale = getLocale()
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
}

const i18n = new VueI18n({
  locale, // 当前语言
  messages // 语言对应的文本所有 存在en.js cn.js中 就是前面创建的messages对象
})

// 引用 模板中{{$t('')}} js中 vue.$t('')

export default i18n
