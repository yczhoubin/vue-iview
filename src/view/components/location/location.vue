<style>
.map {
  overflow: hidden;
  margin: 0;
  height: 120px;
  border: 1px solid #dddee1;
}
</style>
<template>
    <div>
        <Select ref="locationSelect" style="margin-bottom: 5px;" v-model="model" :label="modelLabel" filterable remote :remote-method="remoteMethod" :loading="loading" :clearable="clearable" v-bind="$attrs" v-on="$listeners">
            <Option v-for="opt in options" :value="opt.key" :key="opt.key">{{opt.title}}</Option>
        </Select>
        <br>
        <div :id="mapDivId" class="map" :style="mapStyle"></div>
    </div>
</template>
<script>

import MP from "../map-baidu/map-baidu.js";
import BMapLib from "../map-baidu/GeoUtils.js";

export default {
  data() {
    return {
      model: "",
      modelLabel: "",
      defaultValue: null,
      loading: false,
      clearable: true,
      options: [],
      pois: {},
      BMap: null,
      map: null,
      mapDivId: null,
      currPoint: null, //{"lng":116.274853,"lat":39.998547}
      mapInited: false,
      pickupOpen: false,  //是否拾取坐标
      pickupButton: null,
    };
  },
  mounted() {
    this.mapDivId = DEMO.Util.newId();
    if (!this.lazyInit) {
      //如果地图在模态对话框中，默认并不显示，此时需要lazyInit，即交给外面来决定什么时候初始化，一般当mapDiv显示后再初始化
      this.initMap();
    }
  },
  props: {
    value: {
      type: [String, Object],
      default: null
    },
    lazyInit: {
      type: Boolean,
      default: false
    },
    mapStyle: {
      type: String,
      default: ""
    },
    pickup: {
        type: Boolean,
        default: false,
    }
  },
  watch: {
    model(value) {
      //父组件可以通过v-model进行监听值
      this.currPoint = value;
      if (!value) {
        this.map.reset();
        this.$emit("input", null);
      }
    },
    value(_value) {
      console.log("定位控件value值改变：" + _value);
      if (_value !== this.model) {
        //控件外props主动设置了值，则根据该经纬度进行查询，并回填地址到input
        this.defaultValue = _value;
      } else {
        this.defaultValue = null;
      }
      this.currPoint = _value;
    },
    currPoint(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        if (this.mapInited) {
          let point = JSON.parse(newValue);
          point = new BMap.Point(point.lng, point.lat);
          this.locate(point);
        }
        this.$emit("input", newValue);
      } else {
        this.map.reset();
        this.$emit("input", newValue);
      }
    }
  },
  methods: {
    localSearch(query) {
      return new Promise((resolve, reject) => {
        try {
          var local = new this.BMap.LocalSearch(this.map, {
            onSearchComplete: function(results) {
              // 判断状态是否正确
              if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                resolve(results);
              } else {
                reject({
                  //reject传进去的error对象，必须包括message和stack属性，否则会警告
                  message: "百度地图初始化失败",
                  stack: null
                });
              }
            }
          });
          local.search(query);
        } catch (e) {
          reject(e);
        }
      });
    },
    remoteMethod(query, isPoint) {
      if (!isPoint) {
        if (query !== "") {
          this.loading = true;

          if (this.map) {
            // this.map.centerAndZoom(new this.BMap.Point(116.404, 39.915), 11);
            this.localSearch(query)
              .then(results => {
                let s = [];
                let m = {};
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                  let _key = JSON.stringify(results.getPoi(i).point);
                  s.push({
                    key: _key,
                    title:
                      results.getPoi(i).title + ", " + results.getPoi(i).address
                  });
                  m[_key] = results.getPoi(i);
                }
                this.options = s;
                this.pois = m;
                this.loading = false;
              })
              .catch(() => {
                this.options = [];
                this.loading = false;
              });
          } else {
            this.options = [];
            this.loading = false;
          }
        } else {
          this.options = [];
          this.loading = false;
        }
      } else {
        let point = query;
        let geocoder = new BMap.Geocoder();
        let self = this;
        geocoder.getLocation(point, function(rs) {
          if (
            rs != null &&
            rs.surroundingPois != null &&
            rs.surroundingPois.length > 0
          ) {
            let poi = rs.surroundingPois[0];
            let _key = JSON.stringify(point);
            let _title = poi.title + ", " + poi.address;
            self.options = [
              {
                key: _key,
                title: _title
              }
            ];
            self.pois = { _key, poi };
            self.model = _key;
            self.modelLabel = _title;
            self.loading = false;
            self.$refs.locationSelect.updateLabel();
          }
        });
      }
    },
    locate(point) {
      if (this.BMap != null && this.defaultValue != null) {
        let defaultPoint = JSON.parse(this.defaultValue);
        defaultPoint = new BMap.Point(defaultPoint.lng, defaultPoint.lat);
        this.remoteMethod(defaultPoint, true);
      }
      if (this.map) {
        this.map.clearOverlays();
        if (point != null) {
          this.map.centerAndZoom(point);
          let marker = new this.BMap.Marker(point);
          marker.setAnimation(BMAP_ANIMATION_BOUNCE);
          marker.addEventListener("click", () => {
            // alert(111);
          });
          this.map.addOverlay(marker);
          this.map.setViewport([point]);
          this.map.setCenter(point);
        } else {
          this.map.reset();
        }
      }
    },
    clearSelect() {
      this.$refs.locationSelect.clearSingleSelect();
    },
    clearAll() {
      if (this.map) {
        this.map.clearOverlays();
        this.map.reset();
        this.toMapDefault();
        if(this.pickupOpen && this.pickupButton) {
          this.pickupOnClick();
        }
      }
    },
    getCurrPoi() {
      return this.pois[this.currPoint];
    },
    initMap() {
      return new Promise((resolve, reject) => {
        try {
            let that = this;
          if (!this.mapInited) {
            MP().then(BMap => {
              this.BMap = BMap;
              // 百度地图API功能
              // 创建Map实例
              var map = new BMap.Map(this.mapDivId, { enableMapClick: true });
              this.map = map;
              // 初始化地图,设置中心点坐标和地图级别
              // this.map.centerAndZoom("中国", 12);
              this.map.enableScrollWheelZoom(true); //支持鼠标滚轮缩放
              this.map.addControl(
                new BMap.NavigationControl({
                  anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                  type: BMAP_NAVIGATION_CONTROL_SMALL
                })
              );
              //增加地图上的点击事件
              this.map.addEventListener("click", e => {
                if (that.pickupOpen) {
                    // let pickupPoint = e.point;
                    // if(pickupPoint) {
                    //     this.remoteMethod(pickupPoint, true);
                    // }
                  this.$emit("on-pickup", e.point);
                }
              });
              if(this.pickup) {
                  this.coordinatePickup(BMap, map);
              }
              
              if (this.currPoint != null) {
                let point = JSON.parse(this.currPoint);
                point = new BMap.Point(point.lng, point.lat);
                this.locate(point);

                this.mapInited = true;
                resolve();
              } else {
                let myCity = new BMap.LocalCity();
                let self = this;
                myCity.get(result => {
                  let cityName = null;
                  if (result == null || result.name == null) {
                    cityName = "中国";
                  } else {
                    cityName = result.name;
                  }
                  self.map.centerAndZoom(cityName, 12);
                  self.mapInited = true;
                  resolve();
                });
              }
            });
          } else {
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    toMapDefault() {
      if (this.BMap) {
        let myCity = new this.BMap.LocalCity();
        let self = this;
        myCity.get(result => {
          // 加载坐标点是个异步操作，在执行回调时坐标点可能已经赋值了
          if (self.currPoint && null != self.currPoint) {
            let point = JSON.parse(self.currPoint);
            point = new BMap.Point(point.lng, point.lat);
            self.locate(point);
            return;
          }
          let cityName = null;
          if (result == null || result.name == null) {
            cityName = "中国";
          } else {
            cityName = result.name;
          }
          self.map.centerAndZoom(cityName, 12);
        });
      }
    },
    refresh(locationValue) {
      if (locationValue) {
        if (this.mapInited) {
          let point = JSON.parse(locationValue);
          point = new BMap.Point(point.lng, point.lat);
          this.remoteMethod(point, true);
        }
      }
    },
    coordinatePickup: function(BMap, map) {
      let that = this;
      function CustomControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(15, 15);
      }
      CustomControl.prototype = new BMap.Control();
      CustomControl.prototype.initialize = function(map) {
        let div = document.createElement("div");
        // let button = document.createElement("input");
        div.setAttribute('id', 'pickupIcon');
        div.style.width = "18px";
        div.style.height = "18px";
        div.style.zIndex = '1200';
        div.style.color = '#000';
        div.style.backgroundColor = "#eee";
        div.style.border = "1px solid gray";
        let button = document.createElement('i');
        that.pickupButton = div;
        button.setAttribute('class', 'ivu-icon ivu-icon-pinpoint');
        button.style.fontSize = '18px';
        div.onclick = function(e) {
          that.pickupOnClick(e);
        };
        div.appendChild(button);
        map.getContainer().appendChild(div);
        return div;
      };

      // 创建控件
      var myZoomCtrl = new CustomControl();
      // 添加到地图当中
      map.addControl(myZoomCtrl);
    },
    pickupOnClick(e) {
          if (this.pickupOpen) {
            // 已经开启的点击按钮后关闭
            this.pickupOpen = false;
            this.pickupButton.style.color = '#000';
            this.pickupButton.style.backgroundColor = "#eee";
            this.map.setDefaultCursor(this.map.getDraggingCursor());
          } else {
            //开启点击拾取坐标
            this.pickupOpen = true;
            this.pickupButton.style.color = '#0000FF';
            this.pickupButton.style.backgroundColor = "#FF9797";
            this.map.setDefaultCursor("default");
          }
    }
  }
};
</script>
