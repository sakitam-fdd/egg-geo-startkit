import '@/styles/zoom.less';
import {
  Component, Vue, Inject, Prop,
} from 'vue-property-decorator';

import { control } from 'maptalks';
import {
 create, on, off, preventDefault,
} from '@/utils/dom';

export class Zoom extends control.Control {
  public zoomIn: HTMLElement | null;

  public zoomOut: HTMLElement | null;

  constructor(options?: any) {
    super(options);

    this.zoomIn = null;

    this.zoomOut = null;
  }

  public buildOn(map: any) {
    const zoomContent = create('div', 'zoom-content');
    this.zoomIn = create('div', 'zoom-in', zoomContent);
    this.zoomOut = create('div', 'zoom-out', zoomContent);
    this.zoomIn.innerText = '+';
    this.zoomOut.innerText = '-';

    this._update();
    this._registerEvents();

    return zoomContent;
  }

  public onRemove() {
    this.getMap().off('_zoomend _zooming _zoomstart _spatialreferencechange', this._update, this);
    if (this.zoomOut) {
      off(this.zoomOut, 'click', this._handleZoomOutClick, this);
    }

    if (this.zoomIn) {
      off(this.zoomIn, 'click', this._handleZoomInClick, this);
    }
  }

  private _update() {
    // should update dom disable status
  }

  private _registerEvents() {
    this.getMap().on('_zoomend _zooming _zoomstart _spatialreferencechange', this._update, this);
    if (this.zoomOut) {
      on(this.zoomOut, 'click', this._handleZoomOutClick, this);
    }

    if (this.zoomIn) {
      on(this.zoomIn, 'click', this._handleZoomInClick, this);
    }
  }

  private _handleZoomOutClick(event: Event) {
    preventDefault(event);
    this.getMap().zoomOut();
  }

  private _handleZoomInClick(event: Event) {
    preventDefault(event);
    this.getMap().zoomIn();
  }
}

@Component({
  name: 'ZoomControl',
  components: {},
})

export default class ZoomControl extends Vue {
  @Prop({ required: true }) $map: any;

  @Inject('pmap')

  private id: string | number | undefined;

  private control: any;

  created() {
    console.log('zoom: create');
  }

  mounted() {
    this.$nextTick(() => {
      this.initialize();
    });
  }

  render() {}

  beforeDestroy() {
    if (this.control) {
      this.control.remove();
    }
  }

  private initialize() {
    if (this.$map) {
      this.control = new Zoom({
        position: {
          top: 20,
          right: 20,
        },
      });
      this.$map.addControl(this.control);
    }
  }
}
