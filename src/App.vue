<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  // 标准的JS语法 涉及：事件监听 DOM操作 rem概念
  // DOMContentLoaded和onload querySelector和getElementBy系列
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>

<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
