export function px2rem(px) {
  const ratio = 375 / 10
  return px / ratio
}

// 给定设计像素 计算屏幕缩放后的真实像素
export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
