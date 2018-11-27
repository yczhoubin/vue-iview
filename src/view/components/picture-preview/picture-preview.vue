<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.picture-preview-container {
  .small-picture-list {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    .item {
      margin: 5px;
      background-color: #ccc;
      overflow: hidden;
      position: relative;
      transition: 0.1s;
      .picture {
        width: 100%;
        height: 100%;
      }
      .search-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 3;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: 0.2s;
        transform: scale(0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          opacity: 1;
          transform: scale(1);
        }
        &:after {
          content: "";
          display: block;
          width: 32px;
          height: 32px;
          background: url("./biger.png");
        }
      }
    }
  }
}
</style>
<template>
  <div class="picture-preview-container">
    <!--预览图片列表-->
    <div class="small-picture-list">
      <div class="item" :style="{'width':`${width}px`, 'height':`${height}px`, 'borderRadius':`${borderRadius}px`}" v-for="(item,index) in thumbnailList" @mouseover="showIconIndex=index" @mouseout="showIconIndex=-1" @click="showBigPicturePreview(index)">
        <div class="picture" :style="{background: `url(${item}) no-repeat center center / cover`}"></div>
        <div class="search-icon" :class="{'active': showIconIndex===index}"></div>
      </div>
      <img id="viewerjs" :src="thumbnailList[0]"></img>
    </div>
    <PictureViewer v-model="ifShowPicturePreview" :index="currentPicIndex" :pictureList="originalList"></PictureViewer>
  </div>
</template>

<script>
import PictureViewer from "./picture-viewer.vue";
import Viewer from 'viewerjs';
import '../../../../node_modules/viewerjs/dist/viewer.min.css'

export default {
  props: {
    // 图片
    pictureList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 数据配置
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 缩略图宽度
    width: {
      default: 100
    },
    // 缩略图高度
    height: {
      default: 100
    },
    // 缩略图圆角
    borderRadius: {
      default: 5
    }
  },
  data() {
    return {
      thumbnailList: [], // 缩略图
      originalList: [], // 原图
      showIconIndex: -1,
      currentPicIndex: -1,
      ifShowPicturePreview: false
    };
  },
  mounted() {
    this.pageInit();
    var viewer = new Viewer(document.getElementById('viewerjs'));
    console.log(this.props);
  },
  watch: {
    // 数据配置参数变化时候
    props: {
      handler: function() {
        this.pageInit();
        console.log(this.props);
      },
      deep: true
    }
  },
  methods: {
    // 数据初始化
    pageInit() {
      this.originalList = [];
      this.thumbnailList = [];
      this.pictureList.forEach(item => {
        const domain = this.props.domain ? this.props.domain : "";
        const originalUrl = `${
          this.props.originalKey ? item[this.props.originalKey] : item
        }`;
        this.originalList.push(`${domain}${originalUrl}`);
        const thumbnailUrl = `${
          this.props.thumbnailKey ? item[this.props.thumbnailKey] : originalUrl
        }`;
        this.thumbnailList.push(`${domain}${thumbnailUrl}`);
      });
    },
    // 打开大图
    showBigPicturePreview(index) {
      this.currentPicIndex = index;
      this.ifShowPicturePreview = true;
    }
  },
  components: {
    "PictureViewer": PictureViewer,
  }
};
</script>
