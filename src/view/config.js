function Config() {
  let _map = {
    "function-input": (resolve) => require(['./components/input/input-unit.vue'], resolve),
    "function-image-preview": (resolve) => require(['./components/image-preview/image-preview.vue'], resolve),
  };

  this.getComponent = function(key) {
    return _map[key];
  }
}

const config = new Config();
export default config;