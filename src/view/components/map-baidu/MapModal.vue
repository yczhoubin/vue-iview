<style>
</style>
<template>
  <Modal v-model="visible" title="地图查看" @on-ok="ok" @on-cancel="cancel" :mask-closable="false" :width="600">
    <Form :model="formValue" :labelWidth="80">
      <FormItem prop="longitude" label="经度">
        <Input v-model="formValue.longitude"></Input>
      </FormItem>
      <FormItem prop="latitude" label="纬度">
        <Input v-model="formValue.latitude"></Input>
      </FormItem>
      <FormItem prop="location" label="定位">
        <bInputLocation ref="inputLocaltion" v-model="formValue.locationValue" :lazyInit="true" :pickup="true" @on-change="locationOnChange" @on-pickup="locationPickup" mapStyle="height: 250px;" style="width:100%;"></bInputLocation>
      </FormItem>
    </Form>
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
      type: Object
    },
    isCreate: {
      type: Boolean,
      default: true,
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
    }
  },
  watch: {
    visible: function(newVal) {
      if (newVal) {
        this.initModal(this.params);
      }
    }
  },
  data() {
    return {
      longitude: "",
      latitude: "",
      locationValue: "",
      longitude: "",
      latitude: "",
      formValue: {}
    };
  },
  mounted() {},
  methods: {
    initModal(val) {
      this.initLocaltionMap();
    },
    initLocaltionMap() {
      if (this.params) {
        this.initPoint(this.params);
      }
      if(this.isCreate) {
        this.$refs.inputLocaltion.clearSelect();
      }
      this.$nextTick(() => {
        this.$refs.inputLocaltion.clearAll();
        this.$refs.inputLocaltion.initMap();
      });
    },
    initPoint(val) {
      this.formValue.longitude = val.lng;
      this.formValue.latitude = val.lat;
      if (this.formValue.longitude && this.formValue.latitude) {
        let point = {};
        point.lng = this.formValue.lng;
        point.lat = this.formValue.lat;
        this.formValue.locationValue = JSON.stringify(point);
      }
    },
    ok() {
      this.$emit("ok", this.formValue);
      this.visible = false;
    },
    cancel() {
      this.visible = false;
    },
    locationOnChange(val) {
      if (!val) {
        return;
      }
      let point = JSON.parse(val);
      this.initPoint(point);
      this.$forceUpdate();
    },
    locationPickup(val) {
      if (val) {
        this.initPoint(val);
        this.$forceUpdate();
        this.$Message.info("选择的位置：" + val.lng + "," + val.lat);
      } else {
        this.$Message.info("选择的位置为空");
      }
    }
  }
};
</script>
