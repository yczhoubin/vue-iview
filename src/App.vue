<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>

<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <!-- <Login></Login> -->
    <Home></Home>
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


