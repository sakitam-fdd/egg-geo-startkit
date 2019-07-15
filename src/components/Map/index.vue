<template>
  <div class="aviation-map">
    <div ref="map" class="map-container"></div>
    <span
      v-for="config in layerConfig"
      :key="config.id"
    >
      <scatter
        v-if="load && config.renderType === 'scatter'"
        :$map="map"
        :layer-id="config.id"
        :level="config.level"
      >
      </scatter>
      <cluster
        v-else-if="load && config.renderType === 'marker-cluster'"
        :$map="map"
        :layer-id="config.id"
      ></cluster>
      <tiled
        v-else-if="load && config.renderType === 'xyz-layer' && config.serviceUrl"
        :$map="map"
        :layer-id="config.id"
        :url="config.serviceUrl"
      ></tiled>
      <image-layer
        v-else-if="load && config.renderType === 'image-layer' && config.serviceUrl"
        :$map="map"
        :layer-id="config.id"
        :url="config.serviceUrl"
        :extent="config.layerExtent"
      ></image-layer>
    </span>
    <div class="map-player" v-if="showSlider">
      <player
        :autoplay="false"
        :interval="1000"
        :prev="handlePrev"
        :next="handleNext"
      >
        <slider
          ref="slider"
          v-model="value"
          :data="data"
          :loop="true"
          :break-line="true"
          @update:value="handleChange"
        ></slider>
      </player>
    </div>
    <zoom-control v-if="load" :$map="map"></zoom-control>
  </div>
</template>

<script lang="ts">
  import get from 'lodash/get';
  import dayjs from 'dayjs';
  import { Route } from 'vue-router';
  import {
    Component, Vue, Watch, Provide,
  } from 'vue-property-decorator';
  import { Map, TileLayer } from 'maptalks';

  import Tiled from '../Layers/Tiled';
  import ImageLayer from '../Layers/Image';
  import Scatter from '../Layers/Scatter';
  import Cluster from '../Layers/Cluster';
  import ZoomControl from '@/components/Controls/Zoom';
  import { player, slider } from '@/components/Player';

  import { LayerConfigModule } from '@/store/modules/nav-layers';

  const mark = [
    {
      time: '00:00',
      // showBreakLine: true,
      fullTime: '201905090000',
    },
  ];

  @Component({
    name: 'AviationMap',
    components: {
      Scatter,
      Cluster,
      ZoomControl,
      player,
      slider,
      Tiled,
      ImageLayer,
    },
    data() {
      return {
        map: null,
        load: false,
        layers: [],
        value: '00:00',
        showSlider: false,
        data: mark.map((item: { time: string }) => item.time),
      };
    },
    computed: {
      // ...mapState({
      //   layerConfig: (state: INavLayersState) => state.layerConfig,
      // }),
    },
  })

  export default class extends Vue {
    map: any;

    load: boolean | undefined;

    showSlider: boolean | undefined;

    @Provide() pmap = () => this.map;

    @Watch('layerConfig', { immediate: true })
    private onLayerConfig(config: any) {
      if (config.length > 0 && LayerConfigModule.layerConfig && LayerConfigModule.layerConfig.emit) {
        this.showSlider = config.some((item: any) => item.showSlider);
        if (this.showSlider && ['cloud', 'radar'].includes(config[0].id)) {
          this.fetchLayers(config[0]);
        }
      }
    }

    @Watch('$route', { immediate: true })
    private onRouteChange(route: Route) {
      console.log(route);
    }

    get layerConfig() {
      return LayerConfigModule.layerConfig.layers;
    }

    created() {}

    mounted() {
      this.$nextTick(() => {
        this.initMap();
      });
    }

    private fetchLayers(config: any) {
      const now = dayjs();
      const _startTime = now.subtract(3, 'h').format('YYYYMMDDHHmm');
      const _endTime = now.format('YYYYMMDDHHmm');
      if (config.id === 'radar') {
        // @ts-ignore
        this.$http.queryRadarStatic({
          startTime: '201907121200',
          endTime: '201907121600',
          dataType: 'base',
        })
          .then((res: any) => {
            console.log(res);
            if (this.layerConfig && this.layerConfig.length > 0) {
              const configs = this.layerConfig.map((item: any) => {
                if (item.id === config.id) {
                  item.serviceUrl = get(res, '0.url', '');
                  item.layerExtent = get(res, '0.bbox', false);
                }
                return item;
              });
              this.$store.dispatch('actionLayerConfig', {
                layers: configs,
                emit: false,
              });
            }
          });
      } else if (config.id === 'cloud') {
        // @ts-ignore
        this.$http.queryCloudTiles({
          startTime: _startTime,
          endTime: _endTime,
          dataType: 'himawari',
          channel: 3,
        })
          .then((res: any) => {
            console.log(res);
            if (this.layerConfig && this.layerConfig.length > 0) {
              const configs = this.layerConfig.map((item: any) => {
                if (item.id === config.id) {
                  item.serviceUrl = get(res, '0.url', '');
                }
                return item;
              });
              this.$store.dispatch('actionLayerConfig', {
                layers: configs,
                emit: false,
              });
            }
          });
      }
    }

    private initMap() {
      const map = new Map(this.$refs.map, {
        center: [108.18095703125005, 34.34141675361363],
        zoom: 5,
        dragPitch: false,
        minZoom: 4,
        baseLayer: new TileLayer('google-image', {
          urlTemplate: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
          repeatWorld: false,
        }),
        dragRotate: false,
        attribution: false,
        fixCenterOnResize: true,
      });

      // const zoom = new control.Zoom({
      //   position: { bottom: '20', right: '20' },
      //   slider: true,
      //   zoomLevel: true,
      // });
      //
      // map.addControl(zoom);

      this.map = map;
      this.load = true;
    }

    private handleChange(value: any) {
      console.log(value);
    }

    public handlePrev(next: (val: any) => void) {
      next((value: any) => {
        console.log(value);
      });
    }

    public handleNext(next: (val: any) => void) {
      // @ts-ignore
      const index = this.$refs.slider.getNextIndex();
      next((value: any) => {
        console.log(value, index);
      });
    }
  }
</script>

<style lang="less" scoped>
  .aviation-map {
    position: relative;
    float: right;
    width: calc(100% - 170px);
    height: calc(100% - 60px);

    background: #282a35;
    border-bottom: 1px solid #373c4f;

    .map-container {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    .map-player {
      position: absolute;
      bottom: 40px;
      width: auto;
      left: 40px;
      right: 40px;
    }
  }
</style>
