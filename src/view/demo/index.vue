<style>

</style>
<template>
  <FunctionsComponent :definitions="definitions" itemName="components"></FunctionsComponent>
</template>

<script>
import FunctionsComponent from '../functions/functions.vue';
import config from './config.js';
export default {
  data() {
    return {
      definitions: config.definitions
    }
  },
  components: {
    'FunctionsComponent': FunctionsComponent
  }
}
</script>
