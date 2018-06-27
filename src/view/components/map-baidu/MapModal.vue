<style>
</style>
<template>
  <Modal v-model="visible" title="地图查看" @on-ok="ok" @on-cancel="cancel" :mask-closable="false">
    <bInputLocation ref="inputLocaltion" v-model="locationValue" :lazyInit="true" :pickup="true" @on-change="locationOnChange" @on-pickup="locationPickup" mapStyle="height: 250px;" style="width:100%;" ></bInputLocation>
  </Modal>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
    }
  },
  computed: {
    visible: {
      set: function(val) {
        this.$emit("input", val);
      },
      get: function() {
        return this.value;
      }
    },
  },
  watch: {
    visible: function(newVal) {
      if (newVal) {
        this.initModal(this.params);
      }
    },
  },
  data() {
    return {
      longitude: "",
      latitude: "",
      locationValue: "",
    };
  },
  mounted() {

  },
  methods: {
    initModal(val) {
      this.initLocaltionMap();
    },
    initLocaltionMap() {
      // if (this.isCreate()) {
      //   this.$refs.inputLocaltion.clearSelect();
      // }
      this.$nextTick(() => {
        this.$refs.inputLocaltion.clearAll();
        this.$refs.inputLocaltion.initMap();
      });
    },
    ok() {
      visible = false;
    },
    cancel() {
      visible = false;
    },
    locationOnChange(val) {

    },
    locationPickup(val) {
      if(val) {
        this.$Message.info("选择的位置：" + val.lng + "," + val.lat);
      } else {
        this.$Message.info("选择的位置为空");
      }
    }
  }
};
</script>
