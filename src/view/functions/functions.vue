<style lang="less">
.functions-tree {
  width: 200px;
  height: 100%;
  float: left;
}

.functions-content {
  float: right;
  height: 100%;
  width: calc(~ "100% - 200px");
}
</style>
<template>
  <!-- 功能树组件 -->
  <div>
    <div class="functions-tree">
      <Menu mode="vertical" theme="dark" @on-select="itemOnSelect" :active-name="setActive" style="width: 200px; height: 100%;">
        <MenuItem v-for="item in definitions" :name="item.name">
        <Icon :type="item.icon ? item.icon : 'navicon'"></Icon>
        {{item.title}}
        </MenuItem>
      </Menu>
    </div>
    <div class="functions-content">
      <!-- 内容页 -->
      <component :is="currComponent"></component>
      <!-- <router-view style="height:100%"></router-view> -->
    </div>
  </div>
</template>

<script>
import config from "../config.js";

export default {
  props: {
    definitions: {
      type: Array,
      required: true
    },
    itemName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      definitionsMap: this.array2map(this.definitions),
      currComponent: null,
    };
  },
  computed: {
    setActive: {
      get: function() {
        let name = this.definitions[0].name;
        this.itemOnSelect(name)
        return name;
      }
    }
  },
  methods: {
    array2map(array) {
      let _map = {};
      if (array) {
        array.forEach(function(functionDefinition) {
          if (functionDefinition.group) {
            if (functionDefinition.children.length > 0) {
              functionDefinition.children.forEach(function(fd) {
                _map[fd.name] = fd;
                fd.parent = functionDefinition.name;
              });
            }
          } else {
            _map[functionDefinition.name] = functionDefinition;
          }
        });
      }
      return _map;
    },
    itemOnSelect(name) {
      let funcConfig = this.definitionsMap[name];
      if (!funcConfig) {
        return;
      }
      if ("string" === typeof funcConfig.view) {
        this.updateCurrViewWithConfig(
          config.getComponent(funcConfig.view),
          funcConfig
        );
      } else {
        this.updateCurrViewWithConfig(funcConfig.view, funcConfig);
      }
    },
    updateCurrViewWithConfig(view, config) {
      if(view) {
        this.currComponent = view;
      } else {
        this.currComponent = null;
      }
    }
  }
};
</script>

