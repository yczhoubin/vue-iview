// import MapBaidu from "./components/map-baidu/index.js";

function Config() {
  let _map = {
    // "map_baidu": MapBaidu,
    "map_baidu": (resolve) => require(['./components/map-baidu/map-baidu.vue'], resolve),
    "function-input": (resolve) => require(['./demo/input/input-unit.vue'], resolve),
    "function-image-preview": (resolve) => require(['./demo/image-preview/image-preview.vue'], resolve),
    "function-map": (resolve) => require(['./demo/map/index.vue'], resolve),
  };

  this.getComponent = function(key) {
    return _map[key];
  }
}

const config = new Config();
export default config;