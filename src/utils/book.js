// 管理静态变量
import { getReadTime } from './localStorage'

export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

// 主题列表：主题设置栏下面的文字 主题的名字 主题具体的内容(文字颜色，背景颜色)
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000'
        }
      }
    }
  ]
}

// 全局设置主题 原理是动态css：js操作link标签
export function addCss(href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

// 删除href指定的link标签
export function removeCss(href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i]
    if (link && link.hasAttribute('href') &&
      link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}

export function removeAllCss() {
  removeCss('http://localhost:8081/theme/theme_default.css')
  removeCss('http://localhost:8081/theme/theme_gold.css')
  removeCss('http://localhost:8081/theme/theme_eye.css')
  removeCss('http://localhost:8081/theme/theme_night.css')
}

export function getReadTimeByMinute(fileName) {
  let readTime = getReadTime(fileName)
  if (!readTime) {
    return 0
  } else {
    return Math.ceil(readTime / 60)
  }
}

export function flatten(arr) {
  return [].concat(...arr.map(item => {
    return [].concat(item, ...flatten(item.subitems))
  }))
}
