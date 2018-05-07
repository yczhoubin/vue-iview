<style>
.home-page {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <!-- 首页 -->
  <HelloWorld class="home-page"></HelloWorld>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'
export default {
  components: {
    'HelloWorld': HelloWorld
  }
}
</script>
