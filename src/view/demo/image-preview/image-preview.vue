<style>
.images-thumbnail {
  float: left;
  /* width: 160px;
  height: 90px; */
}

.image-thumbnail {
  /* width: 160px;
  height: 90px; */
}
</style>
<template>
  <div>
    <!-- <div class="images-thumbnail" v-for="item in images">
      <img :src="item" class="image-thumbnail"></div>
    </div> -->
    <PictureView
      :pictureList="pictureList"
      :props="defaultProps"
      @move="handleNext"
    ></PictureView>
    <button @click="changeToThumbnail">全部缩略图</button>
    <button @click="changeToOriginal">全部原图</button>
  </div>
</template>
<script>

import PictureView from '../../components/picture-preview/picture-preview.vue';
export default {
  data() {
    return {
      pictureList: [
       {
         thumbnail: '/20180525091245.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091245.jpg'
       },
       {
         thumbnail: '/20180525091249.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091249.jpg'
       },
       {
         thumbnail: '/20180525091252.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091252.jpg'
       },
       {
         thumbnail: '/20180525091253.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091253.jpg'
       }
     ],
     defaultProps: {
       originalKey: 'original',
       thumbnailKey: 'thumbnail',
       domain: 'http://p09vugqdu.bkt.clouddn.com'
     }
    }
  },
  methods: {
    handleNext(data) {
      console.log(data);
    },
    changeToThumbnail() {
      this.defaultProps.originalKey = 'thumbnail';
    },
    changeToOriginal() {
      this.defaultProps.originalKey = 'original';
    }
  },
  components: {
    "PictureView": PictureView,
  }
}
</script>
