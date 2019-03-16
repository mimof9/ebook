<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input type="text" class="slide-contents-search-input"
               :placeholder="$t('book.searchHint')"
               @click="showSearchPage()"
               v-model="searchText"
               @keyup.enter.exact="search()">
      </div>
      <div class="slide-contents-search-cancel"
           v-if="searchVisible"
           @click="hideSearchPage()">{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">{{metadata.title}}</div>
        <div class="slide-contents-book-author">{{metadata.creator}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + "%"}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list"
            :top="156"
            :bottom="48"
            v-show="!searchVisible">
      <div class="slide-contents-item"
           v-for="(item, index) in navigation" :key="index"
           :class="{'selected': section === index}"
           @click="display(item.href, hideTitleAndMenu())">
        <div class="slide-contents-item-label"
             :style="contentItemStyle(item)">{{item.label}}</div>
        <div class="slide-contents-item-page">{{item.page}}</div>
      </div>
    </scroll>
    <scroll class="slide-search-list"
            v-show="searchVisible"
            :top="66"
            :bottom="48">
      <div class="slide-search-item"
           v-for="(item, index) in searchList" :key="index"
           v-html="item.excerpt"
           @click="displayContent(item.cfi)"></div>
    </scroll>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Scroll from '../common/Scroll'
  import { px2rem } from '../../utils/utils'

  export default {
    mixins: [ebookMixin],
    components: {
      Scroll
    },
    data() {
      return {
        searchVisible: false,
        searchList: null,
        searchText: ''
      }
    },
    methods: {
      displayContent(target) {
        this.display(target, () => {
          this.hideTitleAndMenu()
          // 高亮渲染搜索文本 参数是cfi 不是搜索文本
          this.currentBook.rendition.annotations.highlight(target)
        })
      },
      showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
        this.searchText = ''
        this.searchList = null
      },
      contentItemStyle(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      },
      doSearch(q) {
        // epub.js wiki提供的全文搜索算法
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            section => section.load(this.currentBook.load.bind(this.currentBook))
              .then(section.find.bind(section, q))
              .finally(section.unload.bind(section)))
        ).then(results => Promise.resolve([].concat.apply([], results)))
      },
      search() {
        // 确认查找事件处理
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            // 高亮关键字
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText,
                `<span style="color: #804000; font-weight: bold;">${this.searchText}</span>`)
              return item
            })
          })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-slide-contents {
    width: 100%;
    font-size: 0; // span标签中的换行会导致空白 在顶层设置font-size: 0 这是个前端开发的小技巧
    .slide-contents-search-wrapper {
      width: 100%;
      height: px2rem(36);
      box-sizing: border-box;
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      display: flex;
      .slide-contents-search-input-wrapper {
        flex: 1;
        border: 1px solid #888;
        @include center;
        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input {
          flex: 1;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent; // 背景透明
          border: none; // 去掉边框
          &:focus {
            outline: none; // 获取焦点时 不显示边框
          }
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        color: brown;
        @include right;
      }
    }
    .slide-contents-book-wrapper {
      width: 100%;
      height: px2rem(90);
      box-sizing: border-box;
      padding: px2rem(10) px2rem(15) px2rem(20);
      display: flex;
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img{
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper {
        flex: 1;
        box-sizing: border-box;
        padding: 0 px2rem(10);
        .slide-contents-book-title {
          // 375*0.85=318.75-30=288.75-45=243.75-20=223.75-70=153.75
          // 173.75-20=153.75
          // iphone6屏幕宽度为375
          width: px2rem(153.75);
          font-size: px2rem(14);
          line-height: px2rem(16);
          //@include ellipsis; // 一行缩略太空洞 下面的写法实现两行缩略
          @include ellipsis2(2);
        }
        .slide-contents-book-author {
          width: px2rem(153.75);
          margin-top: px2rem(5);
          font-size: px2rem(12);
          @include ellipsis;
        }
      }
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }
          .progress-text {
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time {
          margin-top: px2rem(5);
          font-size: px2rem(12);
        }
      }
    }
    .slide-contents-list {
      box-sizing: border-box;
      padding: 0 px2rem(15);
      .slide-contents-item {
        box-sizing: border-box;
        padding: px2rem(20) 0;
        border-top: px2rem(1) solid #888;
        display: flex;
        &.selected {
          color: #804000;
          font-weight: bold;
        }
        .slide-contents-item-label {
          flex: 1;
          width: px2rem(273.917);
          font-size: px2rem(14);
          line-height: px2rem(16); // 英文虽然指定了字体大小 但是有些字体会超出字体大小显示不全 所以指定行高
          @include ellipsis;
        }
        .slide-contents-item-page {
          flex: 0 0 px2rem(30);
          font-size: px2rem(10);
          @include right;
        }
      }
    }
    .slide-search-list {
      width: 100%;
      box-sizing: border-box;
      padding: 0 px2rem(15);
      .slide-search-item {
        box-sizing: border-box;
        padding: px2rem(20) 0;
        border-top: px2rem(1) solid #888;
        font-size: px2rem(14);
        line-height: px2rem(16);
      }
    }
  }
</style>
