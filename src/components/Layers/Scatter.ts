import dayjs from 'dayjs';
import {
  Component, Vue, Inject, Prop,
} from 'vue-property-decorator';
import { ElLoadingComponent } from 'element-ui/types/loading';
import {
  Marker, VectorLayer,
} from 'maptalks';

import { proxyExtent } from '@/utils/geom';

@Component({
  name: 'AviationMapScatter',
  components: {},
  data() {
    return {};
  },
})

export default class extends Vue {
  @Prop({ required: true }) $map: any;

  @Prop({ required: true }) layerId: string | undefined;

  @Prop({ default: 'P1000', type: String }) level: string | undefined;

  // @Inject('pmap')

  private layer: any;

  private loading: ElLoadingComponent | undefined;

  created() {
    console.log('scatter: create');
  }

  mounted() {
    this.$nextTick(() => {
      this.initialize();
    });
  }

  render() {}

  beforeDestroy() {
    if (this.layer) {
      this.$map.removeLayer(this.layer);
      this.$map.off('resize', this.handleFetch, this);
      this.$map.off('viewchange', this.handleFetch, this);
    }
  }

  private handleFetch() {
    const zoom = this.$map.getZoom();
    const extent = proxyExtent(this.$map);
    // const extent = this.$map.getExtent();
    let n = 32;
    // TODO: nc 取值
    switch (true) {
      case zoom >= 1 && zoom <= 4:
        n = 32;
        break;
      case zoom > 4 && zoom <= 5:
        n = 16;
        break;
      case zoom > 5 && zoom <= 6:
        n = 8;
        break;
      case zoom > 6 && zoom <= 7:
        n = 4;
        break;
      case zoom > 7 && zoom <= 8:
        n = 2;
        break;
      case zoom > 8 && zoom <= 9:
        n = 1;
        break;
      case zoom > 9 || zoom < 1:
        n = 1;
        break;
      default:
        n = 32;
    }
    this.loading = this.$loading({
      text: '服务加载中',
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.6)',
    });
    // @ts-ignore
    this.$http.getScatter('/aviation/scatter', {
      elem: 'WINDTT',
      level: this.level,
      startX: extent.xmin,
      startY: extent.ymin,
      endX: extent.xmax,
      endY: extent.ymax,
      disc: n,
      dataTime: dayjs().format('YYYYMMDDHHmm'),
    }).then((res: any) => {
      const json = this.getGridPoints(res);
      // const features = GeoJSON.toGeometry(json);
      const features = [];

      for (let i = 0; i < json.features.length; i++) {
        const item = json.features[i];
        features.push(new Marker(item.geometry.coordinates, {
          id: item.properties.id,
          symbol: [
            {
              markerFile: item.properties.icon,
              markerWidth: 24 * 0.6,
              markerHeight: 50 * 0.6,
              // markerDx: (0.5 - 0.21) * 24 * 0.6,
              // markerDy: -(0.86 - 0.5) * 50 * 0.6,
              markerDx: 4,
              markerDy: 4,
              markerOpacity: 0.9,
              markerHorizontalAlignment: 'middle', // left, middle(default), right
              markerVerticalAlignment: 'top', // top, middle, bottom(default)
              markerRotation: item.properties.rotation,
            },
            {
              textFaceName: 'sans-serif',
              textName: '{value}', // value from name in geometry's properties
              textSize: 12,
              textFill: '#fff',
              textOpacity: 1,
              textHaloFill: '#fff',
              textHaloRadius: 0,
              textLineSpacing: 0,
              textDx: item.properties.textOffset[0],
              textDy: item.properties.textOffset[1],
              textHorizontalAlignment: 'middle', // left | middle | right | auto
              textVerticalAlignment: item.properties.textVerticalAlignment, // top | middle | bottom | auto
              textAlign: 'center', // left | right | center | auto
            },
          ],
          properties: item.properties,
        }));
      }
      this.layer.clear();
      this.layer.addGeometry(features);
    }).finally(() => {
      this.loading && this.loading.close();
    });
  }

  private getGridPoints(data: any) {
    const features = [];
    for (let l = 0; l < data.yNum; l++) {
      for (let s = 0; s < data.xNum; s++) {
        const point = [data.sLng + data.xDel * s, data.sLat + data.yDel * l];
        let icon = `http://127.0.0.1:8080/images/winds/w${2 * Math.ceil(data.values[l][s] / 2)}.png`;
        if (Math.ceil(data.values[l][s] / 2) * 2 > 56) {
          icon = 'http://127.0.0.1:8080/images/winds/w56.png';
        }
        features.push({
          type: 'Feature',
          properties: {
            id: `${l}_${s}_${data.values[l][s]}`,
            value: data.values[l][s],
            // rotation: Math.PI * data.values1[l][s] / 180,
            rotation: +data.values1[l][s],
            // 当旋转角度在90-270时调整文字位置
            textVerticalAlignment: data.values1[l][s] > 90 && data.values1[l][s] < 270 ? 'top' : 'bottom',
            textOffset: data.values1[l][s] > 90 && data.values1[l][s] < 270 ? [0, 0] : [0, 4],
            icon,
          },
          geometry: {
            type: 'Point',
            coordinates: point,
          },
        });
      }
    }
    return {
      type: 'FeatureCollection',
      features,
    };
  }

  private initialize() {
    if (this.$map) {
      this.layer = new VectorLayer(this.layerId, null, {
        enableSimplify: false,
      });
      this.$map.addLayer(this.layer);
      this.$map.on('resize', this.handleFetch, this);
      this.$map.on('viewchange', this.handleFetch, this);
      this.handleFetch();
    }
  }
}
