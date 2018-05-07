<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
html,body,#app{
  height: 100%;
}
</style>

<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <!-- <Login></Login> -->
    <!-- <Home style="height: 100%;"></Home> -->
    <router-view style="height:100%"></router-view>
  </div>
</template>

<script>
// import Login from './view/login/login.vue';
import Home from './view/index.vue'

export default {
  name: 'App',
  components: {
    // 'Login': Login
    'Home': Home
  }
}
</script>


