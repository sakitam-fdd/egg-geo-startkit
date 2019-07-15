import { Vue } from 'vue-property-decorator';

export default (name: string) => (class extends Vue {
  private componentName: string = name;

  mounted() {}

  beforeDestroy() {}

  public getComponentName(): string {
    return this.componentName;
  }
});
