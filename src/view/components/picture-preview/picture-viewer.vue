<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.big-picture-preview {
  position: fixed;
  z-index: 9999999999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  .picture-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      cursor: move;
      opacity: 1;
      &.show {
        opacity: 1;
      }
    }
    .loading {
      width: 32px;
      height: 32px;
      background: url("./loading.png");
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -16px;
      margin-top: -16px;
      -webkit-animation: scale 2s infinite linear;
    }
    @-webkit-keyframes scale {
      0% {
        -webkit-transform: rotate(0deg);
      }
      50% {
        -webkit-transform: rotate(180deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
  }
  .menu-wrapper {
    position: absolute;
    height: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      &.prev {
        background: url("./left-arrow.png") no-repeat center center;
      }
      &.next {
        background: url("./right-arrow.png") no-repeat center center;
      }
      &.left-rotate {
        background: url("./left-rotate.png") no-repeat center center;
      }
      &.right-rotate {
        background: url("./right-rotate.png") no-repeat center center;
      }
      &.big {
        background: url("./big.png") no-repeat center center;
      }
      &.small {
        background: url("./small.png") no-repeat center center;
      }
      &.disabled {
        opacity: 0.2;
      }
    }
    .close-icon {
      position: absolute;
      width: 60px;
      height: 60px;
      right: 0;
      top: 0;
      background: url("./close.png") no-repeat center center #fff;
    }
  }
}
</style>
<template>
  <!--放大层-->
  <transition name="fade">
    <div class="big-picture-preview" v-if="visible">
      <div class="picture-wrapper" :style="{'bottom':isMenu?'60px':'100px'}" ref="imgWrapper" @click="singleClick">
        <img :class="{'show':isShowPic}" :src="currentPicSrc" alt="" :style="{'transition': `${imgTransition}s`, 'transform': `rotate(${rotateVal}deg) scale(${scaleVal})`, 'left': `${left}px`, 'top': `${top}px`}" ref="img" @load="imageLoaded" @mousedown="touchStart" @mousemove="touchMove" @mouseup="touchEnd" @mousewheel="mousewheel" @click="doubleClick">
        <!-- <div class="loading" v-show="!isShowPic"></div> -->
      </div>
      <div class="menu-wrapper" v-if="isMenu">
        <div class="item prev" :class="{'disabled':isFirst}" @click="moveIndex(-1)" v-if="isMove"></div>
        <div class="item left-rotate" @click="rotateImg(-1)" v-if="isRotate"></div>
        <div class="item right-rotate" @click="rotateImg(1)" v-if="isRotate"></div>
        <div class="item big" @click="ScaleImg(1)" v-if="isScale"></div>
        <div class="item small" @click="ScaleImg(-1)" v-if="isScale"></div>
        <div class="item next" :class="{'disabled':isLast}" @click="moveIndex(1)" v-if="isMove"></div>
        <div class="close-icon" @click="closeBigPicturePreview">
          <i></i>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    // 是否显示
    value: {
      type: Boolean,
      default: false
    },
    // 默认显示图片索引
    index: {
      type: Number,
      required: true
    },
    // 图片url列表
    pictureList: {
      type: Array,
      required: true
    },
    // 是否旋转
    isRotate: {
      default: true
    },
    // 是否前进后退
    isMove: {
      default: true
    },
    // 是否缩放
    isScale: {
      default: true
    },
    // 是否单机黑框关闭弹出层
    isSingleClickToClose: {
      default: true
    },
    // 是否显示底部按钮
    isMenu: {
      default: true
    },
    // 鼠标放大缩小
    isMousewheelScale: {
      default: true
    },
    // 双击恢复
    doubleRestore: {
      default: true
    }
  },
  watch: {
    visible: function(newVal) {
      if (newVal) {
        this.init();
      }
    },
    // 监听当前大图的url变化，变化了就先隐藏图片待图片加载完成之后再显示
    currentPicSrc(newVal, oldVal) {
      if (newVal != oldVal) {
        this.isShowPic = false;
      }
    }
  },
  computed: {
    visible: {
      set: function(val) {
        this.$emit("input", val);
      },
      get: function() {
        return this.value;
      }
    }
  },
  data() {
    return {
      isShowPic: false, // 图片加载完成之后再显示
      currentPicSrc: "",
      currentPicIndex: -1,
      isFirst: false,
      isLast: false,
      imgTransition: 0.3,
      rotateVal: 0,
      scaleVal: 1,
      removeClose: true, // 用于判断是点击还是拖动时候的第一次单击
      clickTime: 0, // 双击次数（用于单位事件判断是否双击）
      time: 1, // 节流计时器
      disX: 0, // 移动距离X
      disY: 0, // 移动距离Y
      lastDisX: 0, // 上一次移动距离X
      lastDisY: 0, // 上一次移动距离Y
      startX: 0, // 触摸位置X
      startY: 0, // 触摸位置Y
      imgWidth: 0, // 图片初始宽度
      imgHeight: 0, // 图片初始高度
      left: 0, // 图片left定位值
      top: 0, // 图片top定位值
      startMove: false
    };
  },
  methods: {
    init() {
      this.currentPicIndex = this.index;
      this.currentPicSrc = this.pictureList[this.currentPicIndex];
    },
    // 单层外层关闭图片
    singleClick(e) {
      e = e || event;
      e.stopPropagation();
      if (this.isSingleClickToClose) {
        this.closeBigPicturePreview();
      }
    },
    // 初始换图片状态
    imageLoaded() {
      this.isShowPic = true;
      // 在显示图片之后, 设置一个延迟时间重置图片位置，否则图片位置错乱
      setTimeout(() => {
        this.rotateVal = 0;
        this.scaleVal = 1;
        this.imgWidth = this.$refs.img.width;
        this.imgHeight = this.$refs.img.height;
        const imgWrapperWidth = this.$refs.imgWrapper.offsetWidth;
        const imgWrapperHeight = this.$refs.imgWrapper.offsetHeight;
        this.left = (imgWrapperWidth - this.imgWidth) / 2;
        this.top = (imgWrapperHeight - this.imgHeight) / 2;
      }, 50);
    },
    // 触摸开始
    touchStart(e) {
      e.preventDefault();
      e = e || event;
      this.imgTransition = 0;
      this.removeClose = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startMove = true;
    },
    // 滑动过程
    touchMove(e) {
      e = e || event;
      if (this.startMove) {
        this.disX = e.clientX - this.startX;
        this.disY = e.clientY - this.startY;
        this.left = this.left - this.lastDisX + this.disX;
        this.top = this.top - this.lastDisY + this.disY;
        this.lastDisX = this.disX;
        this.lastDisY = this.disY;
        this.removeClose = false;
      }
    },
    // 滑动结束
    touchEnd(e) {
      this.imgTransition = 0.3;
      this.startMove = false;
      this.lastDisX = 0;
      this.lastDisY = 0;
    },
    // 鼠标滚动
    mousewheel(e) {
      e = e || event;
      if (!this.isMousewheelScale) return false;
      e.preventDefault();
      if (e.deltaY > 0) {
        this.throttle(() => {
          this.ScaleImg(-1, 0.02);
        });
      } else {
        this.throttle(() => {
          this.ScaleImg(1, 0.02);
        });
      }
    },
    // 双击重置图片状态
    doubleClick(e) {
      e = e || event;
      e.stopPropagation();
      this.clickTime += 1;
      setTimeout(() => {
        if (this.clickTime == 2) {
          // 如果是双击重置图片
          this.removeClose = false;
          if (this.doubleRestore) this.imageLoaded();
        }
        this.clickTime = 0;
      }, 300);
    },
    // 前进后退
    moveIndex(way) {
      this.rotateVal = 0;
      const l = this.pictureList.length;
      way === -1 ? (this.currentPicIndex -= 1) : (this.currentPicIndex += 1);
      if (this.currentPicIndex <= 0) {
        this.currentPicIndex = 0;
      } else if (this.currentPicIndex >= l - 1) {
        this.currentPicIndex = l - 1;
      }
      this.chargeFirstOrLast(l);
      this.currentPicSrc = this.pictureList[this.currentPicIndex];
      const params = {
        direction: way,
        src: this.currentPicSrc,
        index: this.currentPicIndex,
        isFirst: this.isFirst,
        isLast: this.isLast
      };
      this.$emit("move", params);
    },
    // 旋转
    rotateImg(way) {
      way === -1 ? (this.rotateVal -= 90) : (this.rotateVal += 90);
    },
    // 缩放
    ScaleImg(way, scale) {
      const oldVal = this.scaleVal;
      scale = scale || 0.1;
      if (way === -1) {
        if (this.scaleVal <= 0.5) {
          this.scaleVal = oldVal;
        } else {
          this.scaleVal -= scale;
        }
      } else {
        if (this.scaleVal >= 2) {
          this.scaleVal = oldVal;
        } else {
          this.scaleVal += scale;
        }
      }
    },
    // 节流
    throttle(func) {
      if (this.time) {
        this.time = 0;
        func();
        setTimeout(() => {
          this.time = 1;
        }, 20);
      }
    },
    // 关闭大图
    closeBigPicturePreview() {
      this.visible = false;
      this.currentPicSrc = "";
      // this.currentPicIndex = -1;
    },
    // 判断是否最后一页和第一页
    chargeFirstOrLast(l) {
      if (
        (this.currentPicIndex === 0 || this.currentPicIndex === l - 1) &&
        l === 1
      ) {
        this.isFirst = true;
        this.isLast = true;
      } else if (this.currentPicIndex === 0) {
        this.isFirst = true;
        this.isLast = false;
      } else if (this.currentPicIndex === l - 1) {
        this.isFirst = false;
        this.isLast = true;
      } else {
        this.isFirst = false;
        this.isLast = false;
      }
    }
  }
};
</script>
