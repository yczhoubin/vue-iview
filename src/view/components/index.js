// import MapBaidu from './map-baidu/index.vue';
import InputLocation from './location/index.js';


const components = {
  // MapBaidu,
  InputLocation,
};

const install = function (Vue, opts = {}) {
  Object.keys(components).forEach((key) => {
      Vue.component('b' + key, components[key]);
  });

};


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default Object.assign(components, {install}); 