import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import {
  TileLayer,
} from 'maptalks';

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

  @Prop({ type: String }) url: string | undefined;

  private layer: any;

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
    }
  }

  private initialize() {
    if (this.$map) {
      this.layer = new TileLayer(this.layerId, {
        urlTemplate: this.url,
        repeatWorld: false,
        renderer: 'canvas',
        spatialReference: {
          projection: 'EPSG:3857',
        },
        maxCacheSize: 0,
        maxAvailableZoom: 7,
      });
      this.$map.addLayer(this.layer);
    }
  }
}
