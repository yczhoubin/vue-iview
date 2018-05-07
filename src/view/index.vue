<style scoped lang="less">
.home-header {
  float: left;
  width: 100%;
  height: 50px;
}

.home-header .ivu-menu-horizontal {
    height: 50px;
    line-height: 50px;
}

.home-content {
  float: left;
  top: 50px;
  width: 100%;
  height: calc(~ "100% - 50px");
}
</style>
<template>
<!-- 首页 -->
  <div style="width:100%; height: 100%;">
    <div class="home-header">
      <div>
        <Menu mode="horizontal" theme="light" :active-name="setActive" @on-select="menuOnSelect">
          <MenuItem v-for="item in headerMenu" :name="item.name">
            <Icon :type="item.icon"></Icon>
            {{item.title}}
          </MenuItem>
        </Menu>
      </div>
    </div>
    <div class="home-content">
      <!-- <component :is="currFunctions" style="height: 100%;">
      </component> -->
      <router-view style="height:100%"></router-view>
    </div>
  </div>
</template>

<script>
import config from  './index-config.js'
import HomePage from './home-page.vue'
import ComponentFunction from './components/index.vue'

export default {
  data() {
    return {
      headerMenu: config.headerMenu,
      currFunctions: ComponentFunction
    };
  },
  computed: {
    setActive: {
      get: function() {
        return this.$route.path.replace('/','');
      }
    }
  },
  methods: {
    menuOnSelect(value) {
      this.$router.push(value);
    }
  },
  components: {
    'HomePage': HomePage,
    'Components': ComponentFunction
  }
};
</script>
