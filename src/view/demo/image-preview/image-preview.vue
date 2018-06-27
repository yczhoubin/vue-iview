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
    <div class="images-thumbnail" v-for="item in images">
      <img :src="item" class="image-thumbnail"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      images: [
        '/Users/zhoubin/work/front-end/vue-iview/src/view/image/3a5ce76ba75fad4552eacc7cf5d30c00.jpg',
        '/Users/zhoubin/work/front-end/vue-iview/src/view/image/3de78160ecd86a268655d4463e79dc79.jpg',
        '/Users/zhoubin/work/front-end/vue-iview/src/view/image/90242e65325fbd4b80e30f945a56b39f.jpg'
      ]
    }
  }
}
</script>
