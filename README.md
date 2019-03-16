# vue-ebook

## 阅读器功能基本完成，还遗留下一些问题
- chrome不能调试 原因是chrome不支持Rendition.on添加事件监听的方式
- 手机不能访问 不是因为 nginx静态服务器跨域问题
- 省略显示需要指定宽度 chrome可以用flex自动计算宽度 而ff不行
- 在进度条页面点击 滑动 或者直接切换页面 chrome都不能 navigationInfo都为null
- 多行省略在中文上不起作用
- 在相邻两页添加书签 定位不准确 会偏一点 中文书有这个问题 英文书概率小
- 用得都是chrome的hack 没有兼容firefox
- getSectionName mixin中定义的这个方法 在两个浏览器中都有问题 undefined 对英文书支持倒是没问题

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
