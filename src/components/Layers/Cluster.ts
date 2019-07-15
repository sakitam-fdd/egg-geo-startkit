import dayjs from 'dayjs';
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { ElLoadingComponent } from 'element-ui/types/loading';
import { Marker } from 'maptalks';
// @ts-ignore
import { ClusterLayer } from 'maptalks.markercluster';

@Component({
  name: 'AviationMapCluster',
  components: {},
  data() {
    return {};
  },
})

export default class extends Vue {
  @Prop({ required: true }) $map: any;

  @Prop({ required: true }) layerId: string | undefined;

  // @Inject('pmap')

  private layer: any;

  private loading: ElLoadingComponent | undefined;

  created() {
    console.log('cluster: create');
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
    }
  }

  private genGeoJSON(data: any[]) {
    const features = [];
    for (let l = 0; l < data.length; l++) {
      const item = data[l];
      const value = item.litCurrent >= 0 ? '+' : '-';
      features.push({
        type: 'Feature',
        properties: {
          id: `${item.lon + item.lat}_${l}`,
          value,
          ...item,
        },
        geometry: {
          type: 'Point',
          coordinates: [
            item.lon,
            item.lat,
          ],
        },
      });
    }
    return {
      type: 'FeatureCollection',
      features,
    };
  }

  private getLightPoints() {
    this.loading = this.$loading({
      text: '服务加载中',
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.6)',
    });
    const time = dayjs('201907120900');
    // @ts-ignore
    this.$http.getScatter('/light/scatter', {
      startTime: time.format('YYYYMMDDHHmm'),
      endTime: time.add(10, 'minute').format('YYYYMMDDHHmm'),
    }).then((res: any) => {
      const json = this.genGeoJSON(res.values);
      const features = [];

      for (let i = 0; i < json.features.length; i++) {
        const item = json.features[i];
        features.push(new Marker(item.geometry.coordinates, {
          id: item.properties.id,
          properties: item.properties,
          symbol: [
            {
              markerType: 'ellipse',
              markerFill: 'rgba(192, 0, 0, 1)',
              markerFillOpacity: 1,
              markerLineOpacity: 1,
              markerLineWidth: 0,
              markerLineColor: '#fff',
              markerWidth: 32,
              markerHeight: 32,
              markerHorizontalAlignment: 'middle', // left, middle(default), right
              markerVerticalAlignment: 'middle', // top, middle, bottom(default)
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
              textDx: -0.5,
              textDy: 2,
              textHorizontalAlignment: 'middle', // left | middle | right | auto
              textVerticalAlignment: 'middle', // top | middle | bottom | auto
              textAlign: 'center', // left | right | center | auto
            },
          ],
        }));
      }
      this.layer.clear();
      this.layer.addGeometry(features);
    }).finally(() => {
      this.loading && this.loading.close();
    });
  }

  private initialize() {
    if (this.$map) {
      this.layer = new ClusterLayer(this.layerId, null, {
        noClusterWithOneMarker: true,
        maxClusterZoom: 18,
        // "count" is an internal variable: marker count in the cluster.
        symbol: [
          {
            markerType: 'ellipse',
            // markerFill: {
            //   property: 'count',
            //   type: 'interval',
            //   stops: [
            //     [1, 'rgba(192, 0, 0, 0.5)'],
            //     [2, 'rgba(192, 0, 0, 1)'],
            //   ],
            // },
            markerFill: 'rgba(192, 0, 0, 1)',
            markerFillOpacity: 1,
            markerLineOpacity: 1,
            markerLineWidth: 0,
            markerLineColor: '#fff',
            markerWidth: 32,
            markerHeight: 32,
            // markerWidth: {
            //   property: 'count',
            //   type: 'interval',
            //   stops: [[0, 40], [9, 60], [99, 80]],
            // },
            // markerHeight: {
            //   property: 'count',
            //   type: 'interval',
            //   stops: [[0, 40], [9, 60], [99, 80]],
            // },
            markerHorizontalAlignment: 'middle', // left, middle(default), right
            markerVerticalAlignment: 'middle', // top, middle, bottom(default)
          },
          {
            textFaceName: 'sans-serif',
            // textName: '{value}', // value from name in geometry's properties
            textName: {
              property: 'count',
              type: 'interval',
              stops: [
                [0, '{value}'],
                [2, '⚡'],
              ],
            },
            textSize: 12,
            textFill: '#fff',
            textOpacity: 1,
            textHaloFill: '#fff',
            textHaloRadius: 0,
            textLineSpacing: 0,
            // textDx: item.properties.textOffset[0],
            textDy: 3,
            textHorizontalAlignment: 'middle', // left | middle | right | auto
            textVerticalAlignment: 'middle', // top | middle | bottom | auto
            textAlign: 'center', // left | right | center | auto
          },
        ],
        textSymbol: {
          textSize: 12,
          textFill: '#fff',
          textOpacity: 0,
        },
        drawClusterText: true,
        geometryEvents: true,
        single: true,
      });
      this.$map.addLayer(this.layer);
      this.getLightPoints();
    }
  }
}
