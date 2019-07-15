<template>
  <span class="sf-slider">
    <vue-slider
      ref="slider"
      v-model="innerValue"
      :data="data"
      :marks="marks"
      v-bind="options"
      @change="handleChange"
    >
      <template v-slot:step="{ label, active }">
        <div :class="['sf-slider-custom-step', { active }]"></div>
      </template>
      <template v-slot:label="{ label, active }">
        <div :class="{
            'vue-slider-mark-label': true,
            'sf-slider-custom-label': true,
            'active': true,
            'sf-slider-custom-label__break-line': breakLine
          }">{{ label }}</div>
      </template>
    </vue-slider>
  </span>
</template>

<script lang="ts">
  import isNumber from 'lodash/isNumber';
  import 'vue-slider-component/theme/antd.css';
  import findIndex from 'lodash/findIndex';
  import vueSlider from 'vue-slider-component';

  import {
    Component, Vue, Prop, Mixins,
  } from 'vue-property-decorator';

  // import componentType from '@/mixins/component-type';

  const name = 'm-slider';

  @Component({
    name,
    components: {
      vueSlider,
    },
    data() {
      return {
        load: false,
        index: 0,
        innerValue: 0,
        options: {
          lazy: true, // 拖动结束后再更新值
          dotSize: 12,
          width: 'auto',
          height: '0.6em',
          contained: false,
          direction: 'ltr',
          railStyle: {
            backgroundColor: 'rgba(0,0,0,.333)',
          },
          tooltip: 'always', // focus
          tooltipPlacement: 'top',
          dotOptions: {
            style: {
              // border: 'none',
              transition: 'left 0.1s ease 0s',
            },
          },
          process: true,
          dotStyle: {
            border: 'none',
            // transition: 'left 0.1s ease 0s',
          },
          processStyle: {
            transitionDuration: '0.1s',
          },
          tooltipStyle: undefined,
          stepStyle: undefined,
          stepActiveStyle: undefined,
          labelStyle: undefined,
          labelActiveStyle: undefined,
        },
        nextIndex: 0, // 将要变化为的值
      };
    },
    computed: {
      // ...mapState({
      //   layerConfig: (state: INavLayersState) => state.layerConfig,
      // }),
    },
  })

  export default class extends Vue {
    @Prop({ type: [Array, Number, String], required: true, default: 0 }) value: any[] | number | string | undefined;

    @Prop({ type: Boolean, default: true }) breakLine: boolean | undefined;

    @Prop({ type: Boolean, default: false }) loop: boolean | undefined;

    @Prop({ type: Boolean, default: false }) lazy: boolean | undefined;

    @Prop({ type: Array, default: () => [] }) data: any[] | undefined;

    @Prop({
      type: [Array, Function, Object, Boolean],
      default: () => (val: any) => ({
        label: `${val}`,
        labelStyle: {
          opacity: 1,
        },
        labelActiveStyle: {
          color: '#3498db',
        },
      }),
    }) marks: any;

    @Prop({ type: Number, default: 12 }) dotSize: number | undefined;

    @Prop({ type: [Number, String], default: 'auto' }) width: number | undefined;

    @Prop({ type: [Number, String], default: '0.6em' }) height: number | undefined;

    @Prop({ type: Boolean, default: false }) contained: boolean | undefined;

    @Prop({ type: String, default: 'ltr' }) direction: string | undefined;

    @Prop({ type: Object, default: () => ({ backgroundColor: 'rgba(0,0,0,.333)' }) }) railStyle: any;

    @Prop({ type: String, default: 'always' }) tooltip: string | undefined;

    @Prop({ type: String, default: 'top' }) tooltipPlacement: string | undefined;

    @Prop({ type: Function, default: (v: any) => v }) tooltipFormatter: ((...args: any[]) => any | undefined) | undefined;

    @Prop({ type: Boolean, default: true }) process: boolean | undefined;

    load: boolean | undefined;

    innerValue: string | number | any[] | undefined;

    index: number | undefined;

    nextIndex: number | undefined;

    options: any;

    private componentName: string = name;

    $refs!: {
      slider: any
    };

    created() {}

    mounted() {
      this.innerValue = this.value;
      this.$watch('value', value => {
        this.innerValue = value;
      });
      this.options = Object.assign(this.options, {
        dotSize: this.dotSize,
        width: this.width,
        height: this.height,
        contained: this.contained,
        direction: this.direction,
        railStyle: this.railStyle,
        tooltip: this.tooltip, // focus
        tooltipPlacement: this.tooltipPlacement,
        tooltipFormatter: this.tooltipFormatter,
        process: this.process,
      });
      this.$nextTick(() => {
        if (this.$refs.slider) {
          // @ts-ignore
          const slider: {
            getValue: () => number;
            getIndex: () => number;
          } = this.$refs.slider;
          const value = slider.getValue();
          const index = slider.getIndex();
          this.innerValue = value;
          this.nextIndex = value;
          this.index = index;
        }
      });
    }

    prev() {
      if (this.$refs.slider && isNumber(this.index)) {
        const index = this.index - 1 > 0 ? this.index - 1 : 0;
        this.index = index;
        this.nextIndex = index;
        // @ts-ignore
        this.$refs.slider.setIndex(index);
      }
    }

    next() {
      if (this.$refs.slider && this.data && isNumber(this.index)) {
        const length = this.data.length - 1;
        // eslint-disable-next-line no-nested-ternary
        const index = this.index + 1 <= length ? this.index + 1 : (this.loop ? 0 : length);
        this.index = index;
        this.nextIndex = index;
        // @ts-ignore
        this.$refs.slider.setIndex(index);
      }
    }

    getValue() {
      return this.innerValue;
    }

    getNextIndex() {
      return this.nextIndex;
    }

    getMarkPosition(item: any, index: number) {
      const { length } = this.marks;
      return {
        left: `${index * (100 / length)}%`,
      };
    }

    handleChange() {
      this.index = findIndex(this.data, item => item === this.innerValue);
      this.$emit('input', this.innerValue);
      this.$emit('change', this.innerValue);
      this.$emit('update:value', this.innerValue);
    }

    public getComponentName(): string {
      return this.componentName;
    }
  }
</script>

<style lang="less">
  .sf-slider {
    position: relative;
    display: inline-block;
    margin: 0 20px;
    top: -6px;
    width: calc(100% - 200px);

    &-custom-label {
      width: 4em;
      margin-top: 0!important;
      padding-top: 1.5em;
      text-align: center;
      color: #fff;
      font-variant: small-caps;
      white-space: pre;
      &.sf-slider-custom-label__break-line {
        &:after {
          position: absolute;
          content: "";
          top: 0;
          height: 1.5em;
          background: rgba(0, 0, 0, .333);
          left: 50%;
          width: 2px;
          margin-left: -1px;
        }
      }
    }

    &-custom-step {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-shadow: 0 0 0 1px #e8e8e8;
      background-color: #fff;
      &.active {
        box-shadow: 0 0 0 2px #9cd5ff;
        background-color: #fff;
      }
    }

    &-line {
      position: absolute;
      cursor: pointer;
      width: 100%;

      &:before {
        position: absolute;
        content: "";
        background: rgba(0, 0, 0, .333);
        border-radius: 1em;
        left: -2em;
        height: .8em;
        right: -2em;
      }
    }

    &-handle {
      position: absolute;
      border-radius: 1em;
      transition: .5s;
      top: 0;
      height: 1.4em;
      width: 1.4em;
      margin: -.3em -.7em;
      background: #fff;
      z-index: 5;
      &:after {
        content: attr(time);
        bottom: 0;
        display: table-cell;
        opacity: 0;
        left: 50%;
        padding: .125em .75em;
        background: rgba(0, 0, 0, .333);
        color: #fff;
        text-align: center;
        line-height: 1.4em;
        transform: translateX(-50%);
        white-space: nowrap;
      }
    }

    &__mark {
      position: absolute;
      top: .8em;
      width: 4em;
      text-align: center;
      color: #fff;
      font-variant: small-caps;
      white-space: pre;
      &.break-line {
        &:after {
          position: absolute;
          content: "";
          top: 0;
          height: 1.5em;
          background: rgba(0, 0, 0, .333);
          left: 50%;
          width: 2px;
          margin-left: -1px;
        }
      }
    }
  }
</style>
