<template>
  <div class="container">
    <div id="map" class="map-container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { mapStyle } from '@/utils/config/baseMapStyle';

export default {
  name: 'city-wuhan',
  data() {
    return {};
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      window.map = new maptalks.Map('map', {
        center: [114.3938, 30.50838], //武汉
        // center: [121.50095457703048, 31.238960386861237], //上海
        zoom: 17,
        pitch: 60,
        // attribution: false,
        view: {
          projection: 'baidu'
        },
        baseLayer: new maptalks.TileLayer('base', {
          fogColor: [25, 60, 114],
          urlTemplate: mapStyle,
          subdomains: ['a', 'b', 'c', 'd']
        })
      });
      map.on('click', e => {
        console.log(e.coordinate);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  .map-container {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(25, 60, 114, 1) 10%, rgba(25, 215, 246, 0));
  }
}
</style>
