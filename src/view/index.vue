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
  height: calc(~"100% - 50px");
}

.home-content-left-menu {
  
}
</style>

<template>
  <div>
    <div class="home-header">
      <div>
        <Menu mode="horizontal" :theme="theme1" :active-name="setActive">
          <MenuItem v-for="item in headerMenu" :name="item.name">
            <Icon :type="item.icon"></Icon>
            {{item.title}}
          </MenuItem>
        </Menu>
      </div>
    </div>
    <div class="home-content">
      首页
    </div>
  </div>
</template>

<script>
// var config = require("./index-config.js");

export default {
  data() {
    return {
      headerMenu: [
        { name: "home", title: "首页", icon: "ios-paper" },
        { name: "components", title: "组件", icon: "social-tux" }
      ]
    };
  },
  computed: {
    setActive: {
      get: function() {
        return "components";
      }
    }
  },
  methods: {
  }
};
</script>
