import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'ResizeMixin',
})

export default class extends Vue {
  @Watch('$route')
  private onRouteChange() {
  }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler);
  }

  mounted() {}

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  private resizeHandler() {
  }
}
