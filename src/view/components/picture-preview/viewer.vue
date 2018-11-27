<style>

</style>
<template>
  <div id="image"></div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  mounted() {
    var viewer = new Viewer(document.getElementById('image'), {
      inline: true,
      viewed: function() {
        viewer.zoomTo(1);
      }
    });
  },
}
</script>
