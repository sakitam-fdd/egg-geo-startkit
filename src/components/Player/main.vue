<template>
  <div class="sf-player">
    <span class="sf-player__menu">
      <span
        @click.stop="handlePlayState"
        :class="{ 'sf-player__menu-icon': true, 'playing': isPlaying }"></span>
      <span class="sf-player__menu-text">{{ isPlaying ? options.menuLabel.pause : options.menuLabel.play }}</span>
    </span>
    <span class="sf-player__back">
      <span
        @click.stop="handlePrev"
        class="sf-player__back-icon"></span>
      <span class="sf-player__back-text">{{options.backLabel}}</span>
    </span>
    <slot v-if="$slots.default"></slot>
    <span class="sf-player__next">
      <span
        @click.stop="handleNext"
        class="sf-player__next-icon"></span>
      <span class="sf-player__next-text">{{options.nextLabel}}</span>
    </span>
  </div>
</template>

<script lang="ts">
  import get from 'lodash/get';
  import filter from 'lodash/filter';
  import isFunction from 'lodash/isFunction';

  import {
    Component, Vue, Mixins, Prop,
  } from 'vue-property-decorator';

  @Component({
    name: 'm-player',
    components: {},
    data() {
      return {
        load: false,
        options: {
          menuLabel: {
            play: '播放',
            pause: '暂停',
          },
          backLabel: '上一张',
          nextLabel: '下一张',
        },
        isPlaying: false,
        timer: null,
      };
    },
    computed: {
      // ...mapState({
      //   layerConfig: (state: INavLayersState) => state.layerConfig,
      // }),
    },
  })

  export default class extends Vue {
    @Prop({
      type: Number,
      default: 3000,
      validator(value: number): boolean {
        return value >= 300;
      },
    }) interval: number | undefined;

    @Prop({ type: Boolean, default: false }) autoplay: boolean | undefined;

    @Prop({ type: Boolean, default: false }) immediate: boolean | undefined;

    @Prop({
      type: Function,
      default: (next: any) => {
        if (isFunction(next)) {
          // @ts-ignore
          next.call(this);
        }
      },
    }) prev: ((...args: any[]) => any | undefined) | undefined;

    @Prop({
      type: Function,
      default: (next: any) => {
        if (isFunction(next)) {
          // @ts-ignore
          next.call(this);
        }
      },
    }) next: ((...args: any[]) => any | undefined) | undefined;

    isPlaying: boolean | undefined;

    timer: any;

    created() {}

    mounted() {
      if (this.autoplay) {
        this.isPlaying = true;
        // eslint-disable-next-line no-unused-expressions
        this.immediate && this.handleAutoPlay();
        this.initPlayer();
      }
    }

    getSlider() {
      if (this.$refs.slider) {
        return this.$refs.slider;
      }
      const childrens = get(this, '$children', []);
      const child = filter(childrens, item => {
        // @ts-ignore
        if (item && isFunction(item.getComponentName)) {
          // @ts-ignore
          const name = item.getComponentName();
          return name === 'm-slider' || name.startWith('m-slider');
        }
        return false;
      });
      return get(child, '0', null);
    }

    getNextIndex() {
      const slider = this.getSlider();
      if (slider) {
        return slider.getNextIndex();
      }
      return null;
    }

    /**
     * 清空定时器
     */
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    /**
     * 初始化自动播放定时器
     */
    initPlayer() {
      if (this.isPlaying) {
        this.timer = setTimeout(() => {
          this.handleAutoPlay();
        }, this.interval);
      }
    }

    /**
     * 处理自动播放
     */
    handleAutoPlay() {
      this.next && this.next(this.autoPlayCallback);
    }

    /**
     * 自动播放 callback（所有的下一步的执行必须等待外部调用接口成功）
     */
    autoPlayCallback() {
      const slider = this.getSlider();
      if (slider) {
        slider.next();
        this.clearTimer();
        this.initPlayer();
      }
    }

    /**
     * 上一帧 callback（所有的下一步的执行必须等待外部调用接口成功）
     */
    prevCallback(cb: any) {
      const slider = this.getSlider();
      if (slider) {
        slider.prev();
        const value = slider.getValue();
        if (isFunction(cb)) {
          cb(value);
        }
      }
    }

    /**
     * 下一帧 callback（所有的下一步的执行必须等待外部调用接口成功）
     */
    nextCallback(cb: any) {
      const slider = this.getSlider();
      if (slider) {
        slider.next();
        const value = slider.getValue();
        if (isFunction(cb)) {
          cb(value);
        }
      }
    }

    /**
     * 上一帧处理函数
     */
    handlePrev() {
      this.prev && this.prev(this.prevCallback);
    }

    /**
     * 下一帧处理函数
     */
    handleNext() {
      this.next && this.next(this.nextCallback);
    }

    /**
     * 播放暂停控制
     */
    handlePlayState() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.initPlayer();
      } else { // 停止播放后立即清除定时器，避免延时情况的处理
        this.clearTimer();
      }
    }
  }
</script>

<style lang="less" scoped>
  .sf-player {
    &__menu {
      position: relative;
      color: #fff;
      display: inline-block;
      text-align: center;
      width: 36px;
      height: 36px;
      &-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1.5px 3px rgba(0, 0, 0, .25);
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          right: 50%;
          width: 16px;
          height: 16px;
          margin: -8px;
          background-image: url("../../../public/images/play.svg");
          background-size: 100% 100%;
        }
        &:hover {
          cursor: pointer;
        }
      }

      &-text {
        position: absolute;
        top: 42px;
        left: 0;
        width: 100%;
      }

      .playing {
        &:after {
          background-image: url("../../../public/images/pause.svg");
        }
      }
    }
    &__back {
      position: relative;
      color: #fff;
      display: inline-block;
      text-align: center;
      width: 36px;
      height: 36px;
      margin-left: 15px;
      &-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1.5px 3px rgba(0, 0, 0, .25);
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          right: 50%;
          width: 16px;
          height: 16px;
          margin: -8px;
          background-image: url("../../../public/images/back.svg");
          background-size: 100% 100%;
        }
        &:hover {
          cursor: pointer;
        }
      }

      &-text {
        position: absolute;
        top: 42px;
        left: 0;
        width: 100%;
      }
    }
    &__next {
      position: relative;
      color: #fff;
      display: inline-block;
      text-align: center;
      width: 36px;
      height: 36px;
      &-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1.5px 3px rgba(0, 0, 0, .25);
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          right: 50%;
          width: 16px;
          height: 16px;
          margin: -8px;
          /*background-image: url(require("../../../public/images/next.svg"));*/
          background-image: url("../../../public/images/next.svg");
          background-size: 100% 100%;
        }
        &:hover {
          cursor: pointer;
        }
      }

      &-text {
        position: absolute;
        top: 42px;
        left: 0;
        width: 100%;
      }
    }
  }
</style>
