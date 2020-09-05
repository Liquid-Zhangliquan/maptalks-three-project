<template>
  <div class="container">
    <div id="map" class="map-container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { MeshLineMaterial } from '@/utils/THREE.MeshLine';

import { MeshBasicMaterial } from 'three';
import rippleWall from '@/utils/rippleWall';
import ocean from '@/utils/ocean';
import arcLine from '@/utils/arcLine';
import RingEffect from '@/utils/ringEffect';
import RingTextureEffect from '@/utils/ringTextureEffect';
import ElectricShield from '@/utils/electricShield';
import { mapStyle } from '@/utils/baseMapStyle';
import {
  getRippleWall,
  getWallTextureMaterial,
  getRippleShieldMaterial,
  getElectricShieldMaterial,
  getBuildTextureShaderMaterial,
  getRingEffectMaterial,
  getRandarMetarial,
  FlabellumScanMaterial
} from '@/utils/shader';
import {
  ringCoord,
  halfBallCoord,
  halfBallCoord2,
  randarCoord1,
  randarCoord2,
  shangHaiData
} from '@/utils/config/shanghai';
export default {
  name: 'city-shanghai',
  props: {
    msg: String
  },
  data() {
    return {
      bearing: 0
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      window.map = new maptalks.Map('map', {
        // center: [114.3938, 30.50838],//武汉
        center: [121.50095457703048, 31.238960386861237], //上海
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
      this.changeView();
      let buildFeature = [],
        roadFeature = [],
        waterFeature = [];
      let buildSet = shangHaiData;
      buildSet.forEach(item => {
        item.buildings.features.forEach(b => {
          if (b.geometry.coordinates[0].length > 3)
            b.geometry.coordinates[0].map(coord => {
              let c = coordtransform.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });
          buildFeature.push(b);
        });
        item.water.features.forEach(b => {
          if (b.geometry.coordinates[0].length > 3)
            b.geometry.coordinates[0].map(coord => {
              let c = coordtransform.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });
          waterFeature.push(b);
        });
        item.roads.features.forEach(r => {
          if (r.geometry.coordinates.length > 3) {
            r.geometry.coordinates.map(coord => {
              let c = coordtransform.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });
            roadFeature.push(r);
          }
        });
      });
      this.initLayer(buildFeature, roadFeature, waterFeature);
    },

    changeView() {
      map.setBearing((this.bearing += 0.1));
      requestAnimationFrame(this.changeView);
    },
    initLayer(features, roadFeature, waterFeature) {
      let threeLayer = new ThreeLayer('t', {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        forceRenderOnZooming: true,
        animation: true
      });
      let meshs = [];
      threeLayer.prepareToDraw = (gl, scene, camera) => {
        // console.log(camera);
        // scene.fog = new THREE.FogExp2(0xff0000, 0.02);
        let light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(0, -10, 10);
        // light.castShadow = true
        scene.add(light);
        let pl = new THREE.PointLight(0xffffff, 2, 0);
        pl.position.set(0, -10, 10);
        camera.add(pl);
        //建筑材质
        let buildmaterial = this.getBuildMaterial();
        buildmaterial = this.canvasOne();
        // buildmaterial = this.getBuildTextureShaderMaterial(
        //   require("@/assets/texture/texture_004.png"),
        //   { opacity: 1 }
        // );
        //地面材质
        let basematerial = this.getBaseGeometryMaterial();
        //地面
        let baseMesh = this.getBaseMesh(basematerial, threeLayer);
        // meshs.push(baseMesh);
        //建筑
        let buildMesh = this.getBuildMesh(features, buildmaterial, threeLayer);
        //道路
        let roadMesh = this.getRoadMesh(roadFeature, threeLayer);
        //半球
        let ballMesh = this.getBallMesh(threeLayer);
        //动画环
        let ringMesh = this.getRingMesh(threeLayer);
        // 扩散圆柱
        let ringBuildMesh = this.getringBuildMesh(threeLayer);
        //雷达
        let randarMesh = this.getRandarMesh(threeLayer);
        //水面
        let waterMesh = this.getWaterMesh(waterFeature, threeLayer);

        this.addArcLine(threeLayer);
        var boxMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({
            // color: "#2C3135"
            color: '#00295a'
          })
        );
        boxMesh.renderOrder = 70;
        let v = threeLayer.coordinateToVector3(map.getCenter());
        boxMesh.add(pl);
        boxMesh.position.set(v.x, v.y, 2);
        // threeLayer.addMesh(boxMesh);
        threeLayer.addMesh(meshs.concat(buildMesh, roadMesh, ballMesh, ringMesh, randarMesh, ringBuildMesh, waterMesh));
        threeLayer.config('animation', true);
      };
      threeLayer.addTo(map);
    },

    getWaterMesh(waterFeature, threeLayer) {
      let waters = [];
      // debugger;
      waterFeature.forEach(g => {
        if (g.geometry.type == 'Polygon') {
          var mesh = new ocean(
            maptalks.GeoJSON.toGeometry(g),
            {
              speed: 1 / 500,
              // sunColor: "#f00",
              waterColor: '#3399FF',
              alpha: 1,
              waterNormals: require('@/assets/texture/waternormals.jpg')
            },
            threeLayer
          );
          waters.push(mesh);
        }
      });
      return waters;
    },
    getringBuildMesh(threeLayer) {
      let ringCircle = new maptalks.Circle(halfBallCoord2, 100);
      let material = getWallTextureMaterial({
        image: require('@/assets/texture/linear.png'),
        color: '#f00',
        opacity: 0.6
      });
      let mesh = new rippleWall(halfBallCoord2, { height: 250, isCircle: 1, radius: 100 }, material, threeLayer);
      // let mesh = threeLayer.toExtrudePolygon(
      //   ringCircle,
      //   {
      //     height: 150,
      //     // topColor: "#fff",
      //     addTopBottom: false
      //   },
      //   material
      // );
      animate();
      let num = 0;
      function animate() {
        num += 0.01;
        if (num > 4) num = 0;
        mesh.getObject3d().scale.set(num, num, 1);
        requestAnimationFrame(animate);
      }
      return [mesh];
    },
    addArcLine(threeLayer) {
      ringCoord.forEach(item => {
        let path = [
          [121.50696853557473, 31.24378441172011],
          [item.x, item.y]
        ];
        let linestring = new maptalks.LineString(path);
        const texture = new THREE.TextureLoader().load(require('@/assets/texture/lineTexture.png'));
        texture.anisotropy = 16;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const camera = threeLayer.getCamera();
        const material = new MeshLineMaterial({
          map: texture,
          useMap: true,
          lineWidth: 13,
          sizeAttenuation: false,
          transparent: true,
          near: camera.near,
          far: camera.far
        });
        let arcline = new arcLine(linestring, { altitude: 0, height: 400, speed: 1 / 5 }, material, threeLayer);
        threeLayer.addMesh(arcline);
      });
    },
    getRandarMesh(threeLayer) {
      let object = new RingEffect(
        halfBallCoord2,
        { radius: 260, speed: 0.01 },
        getRandarMetarial({ color: '#CC3366', type: 2 }),
        threeLayer
      );
      object.getObject3d().renderOrder = 5;
      // let object2 = new RingEffect(
      //   halfBallCoord2,
      //   { radius: 560, speed: 0.01 },
      //   this.FlabellumScanMaterial({ color: "#f00" }),
      //   threeLayer
      // );
      // object2.getObject3d().renderOrder = 5;
      // object2.getObject3d().position.z = 0.5;
      this.getScanRandarMesh(threeLayer);
      // let v = threeLayer.coordinateToVector3(halfBallCoord2);
      // //内部半径 外部半径 圆环的分段数(值越大，圆环就越圆) 最小值为1，默认值为8  起始角度(默认值为0) 圆心角，默认值为Math.PI * 2
      // let object = new THREE.Mesh(
      //   new THREE.RingBufferGeometry(0.0001, 1, 20, 5, 0, Math.PI * 2),
      //   this.getRandarMetarial("#CC3366", 2)
      // );
      // object.position.x = v.x;
      // object.position.y = v.y;
      // object.position.z = 0;
      return [object];
    },
    getScanRandarMesh(threeLayer) {
      let v = threeLayer.coordinateToVector3(halfBallCoord2);
      const r = threeLayer.distanceToVector3(500, 500).x;
      let object = new THREE.Mesh(new THREE.PlaneBufferGeometry(r, r, 2), FlabellumScanMaterial());
      object.position.x = v.x;
      object.position.y = v.y;
      object.position.z = 0.1;
      object.renderOrder = 3;
      threeLayer.addMesh(object);
    },
    getRingMesh(threeLayer) {
      let coords = ringCoord;
      let meshes = [];
      coords.forEach(c => {
        let object = new RingEffect(
          [c.x, c.y],
          { radius: 50, speed: 0.0025 },
          getRingEffectMaterial(c.color, c.type),
          threeLayer
        );
        // let v = threeLayer.coordinateToVector3([c.x, c.y]);
        // //内部半径 外部半径 圆环的分段数(值越大，圆环就越圆) 最小值为1，默认值为8  起始角度(默认值为0) 圆心角，默认值为Math.PI * 2
        // let object = new THREE.Mesh(
        //   new THREE.RingBufferGeometry(0.001, 0.1, 20, 5, 0, Math.PI * 2),
        //   this.getRingEffectMaterial(c.color, c.type)
        // );
        // object.position.x = v.x;
        // object.position.y = v.y;
        // object.position.z = 0.1;
        object.renderOrder = 4;
        meshes.push(object);
      });
      return meshes;
    },
    getBallMesh(threeLayer) {
      var ball1 = new ElectricShield(
        halfBallCoord,
        { radius: 250 },
        getElectricShieldMaterial({
          color: '#32CD32',
          // color: "#FFB860",
          opacity: 1
        }),
        threeLayer
      );
      // threeLayer.addMesh(ball1);
      ball1.getObject3d().renderOrder = 6;
      var ball2 = new ElectricShield(
        halfBallCoord2,
        { radius: 250, speed: 0.015 },
        getRippleShieldMaterial({
          color: '#9999FF',
          num: 3,
          opacity: 1
        }),
        threeLayer
      );
      ball2.getObject3d().renderOrder = 6;
      // threeLayer.addMesh(ball2);

      const texture = new THREE.TextureLoader().load(require('@/assets/texture/ring.png'));
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        color: '#fff',
        side: THREE.DoubleSide
      });
      let object = new RingTextureEffect(halfBallCoord2, { radius: 100, speed: 2 }, material, threeLayer);
      return [ball1, ball2, object];
    },
    getRandomColor() {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    },
    getRoadMesh(roadFeature, threeLayer) {
      let linemesh = [];
      let material = new THREE.MeshPhongMaterial({
        color: '#FDCD2C',
        transparent: true
        // blending: THREE.AdditiveBlending
      });
      roadFeature.forEach(g => {
        if (g.geometry && g.geometry.coordinates && g.geometry.type != 'MultiLineString') {
          // material = this.getRippleShieldMaterial({
          //   color: this.getRandomColor(),
          //   dura: Math.random() * 0.007,
          //   opacity: 1
          // });
          let mesh = threeLayer.toExtrudeLine(
            maptalks.GeoJSON.toGeometry(g),
            { altitude: 0, width: 3, height: 0.1 },
            // this.getSeperableBlurMaterial(10),
            material
          );
          let _mesh = mesh.getObject3d();
          _mesh.material.opacity = 0.6;
          linemesh.push(mesh);
        }
        // mesh.addTo(threeLayer)
      });
      return linemesh;
    },
    getBuildMesh(build, buildmaterial, threeLayer) {
      let buildmesh = [];
      let material = buildmaterial;
      let img = require('@/assets/texture/texture_03.png');
      // if(height < 100)
      //   img = require("@/assets/texture/texture_03.png");
      let texturematerial = getBuildTextureShaderMaterial(img, {
        opacity: 1
      });
      build.forEach(g => {
        let height = g.properties.height || 0 + 20;
        if (height > 400) {
          material = getRippleWall();
        } else material = buildmaterial;
        // else material = texturematerial;
        let addTopBottom = true;
        let mesh = threeLayer.toExtrudePolygon(
          maptalks.GeoJSON.toGeometry(g),
          {
            height: height,
            topColor: '#fff',
            // bottomColor: "#193976",
            addTopBottom: addTopBottom
          },
          material
        );
        // let extentmesh = this.getExtentBuild(g, height, threeLayer);
        // extentmesh.forEach(x => buildmesh.push(x));
        const topColor = new THREE.Color('#EDD464');
        const bufferGeometry = mesh.getObject3d().geometry;
        const geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
        const { vertices, faces, faceVertexUvs } = geometry;
        for (let i = 0, len = faces.length; i < len; i++) {
          const { a, b, c } = faces[i];
          const p1 = vertices[a],
            p2 = vertices[b],
            p3 = vertices[c];
          //top face
          if (p1.z > 0 && p2.z > 0 && p3.z > 0) {
            const vertexColors = faces[i].vertexColors;
            for (let j = 0, len1 = vertexColors.length; j < len1; j++) {
              vertexColors[j].r = topColor.r;
              vertexColors[j].g = topColor.g;
              vertexColors[j].b = topColor.b;
            }
            const uvs = faceVertexUvs[0][i];
            for (let j = 0, len1 = uvs.length; j < len1; j++) {
              uvs[j].x = 0;
              uvs[j].y = 0;
            }
          }
        }
        mesh.getObject3d().geometry = new THREE.BufferGeometry().fromGeometry(geometry);
        bufferGeometry.dispose();
        geometry.dispose();
        if (height < 600) buildmesh.push(mesh);
        // mesh.addTo(threeLayer)
      });
      return buildmesh;
    },
    // 地面
    getBaseMesh(basematerial, threeLayer) {
      let v = threeLayer.coordinateToVector3([121.48695046, 31.24427468]);
      //添加“底图”
      let base = new THREE.Mesh(new THREE.PlaneBufferGeometry(5000, 5000, 2), basematerial);
      base.position.x = v.x;
      base.position.y = v.y;
      base.position.z = v.z;
      return base;
    },
    //获取建筑材质
    getBuildMaterial() {
      // MeshBasicMaterial MeshPhongMaterial
      let material = new THREE.MeshPhongMaterial({
        // color: "#336699"
        color: '#001138'
      });
      material.vertexColors = THREE.VertexColors;
      return material;
      // let tmap = new THREE.TextureLoader().load(require("@/assets/texture/buildVert3.png"));
      // tmap.wrapS = tmap.wrapT = THREE.RepeatWrapping;
      // tmap.anisotropy = 10;
      // let material3 = new THREE.MeshPhongMaterial({
      //   map: THREE.ImageUtils.loadTexture(require('./buildVert3.png'))
      // })
    },
    getBuildTextureMaterial() {
      const texture = new THREE.TextureLoader().load(require('@/assets/texture/texture_03.png'));
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(1, 4);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        color: '#fff',
        side: THREE.DoubleSide
      });
      material.vertexColors = THREE.VertexColors;
      return material;
    },
    // 地面材质
    getBaseGeometryMaterial() {
      // MeshBasicMaterial MeshPhongMaterial
      return new THREE.MeshBasicMaterial({
        // color: "#2C3135"
        color: '#00295a'
      });
    },

    randomNum(Min, Max) {
      let Range = Max - Min;
      let Rand = Math.random();
      if (Math.round(Rand * Range) == 0) {
        return Min + 1;
      } else if (Math.round(Rand * Max) == Max) {
        return Max - 1;
      } else {
        let num = Min + Math.round(Rand * Range) - 1;
        return num;
      }
    },
    canvasOne() {
      const width = 512,
        height = 1024;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext('2d');

      context.clearRect(0, 0, width, height);

      context.fillStyle = '#16366f';
      context.fillRect(0, 0, 1024, 1024);
      let colors2 = ['#00CCFF', '#66FF66', '#fff'];
      let added = [true, false, false];
      for (let x = 10; x < width; x += 50) {
        for (let y = 10; y < height; y += 50) {
          let isLight = added[this.randomNum(0, 2)];
          let hsl = `hsl(183,${this.randomNum(10, 90)}%,${this.randomNum(10, 90)}%)`;
          let _color = colors2[this.randomNum(0, 3)];
          if (isLight) {
            context.fillStyle = _color;
            context.fillRect(x, y, 15, 15);
            context.globalAlpha = 1;
            // context.globalCompositeOperation = "lighter";
            context.shadowColor = _color;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
          } else {
            context.fillStyle = '#373839';
            context.fillRect(x, y, 15, 15);
            context.globalAlpha = 1;
            context.shadowColor = '#16366f';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
          }
        }
      }
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(1, 1);
      // const material = new THREE.MeshLambertMaterial({
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false
      });
      return material;
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
