import {
  Component, Vue, Inject, Prop,
} from 'vue-property-decorator';
import { ElLoadingComponent } from 'element-ui/types/loading';
import {
  ImageLayer,
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

  @Prop({ type: Array }) extent: number[] | undefined;

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
    }
  }

  private initialize() {
    if (this.$map && this.extent && this.extent.length > 0) {
      const bbox: number[] = this.extent;
      this.layer = new ImageLayer(this.layerId, [
        {
          url: this.url,
          extent: [
            bbox[0], bbox[3],
            bbox[2], bbox[1],
          ],
          opacity: 1,
        },
      ], {
        renderer: 'canvas',
        zIndex: 4,
      });
      this.$map.addLayer(this.layer);
    }
  }
}
