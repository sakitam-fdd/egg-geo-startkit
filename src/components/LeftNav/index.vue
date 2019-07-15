<template>
  <div class="aviation-nav">
    <el-scrollbar
      :native="false"
      ref="gustScrollbar"
      wrap-class="list"
      view-class="view-box"
      style="height: calc(100% - 180px); width: calc(100% + 2px);"
    >
      <el-menu
        default-active="1-4-1"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
        background-color="#373c4f"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        :collapse="isCollapse">
        <el-submenu
          v-for="child in menus"
          :key="child.id"
          :index="child.id">
          <template slot="title">
            <i :class="[child.icon]"></i>
            <span slot="title">{{child.label}}</span>
          </template>
          <template v-if="child.children && child.children.length > 0">
            <el-menu-item-group
              v-if="child.group"
            >
              <span slot="title">{{child.groupLabel}}</span>
              <el-menu-item
                v-for="items in child.children"
                :key="items.id"
                :index="items.id">
                <template slot="title">
                  <m-switch
                    v-model="items.checked"
                    :width="32"
                    size="mini"
                    @change="handleSelect(items)"
                  >
                  </m-switch>
                  <span slot="title">{{items.label}}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item
              v-else
              v-for="items in child.children"
              :key="items.id"
              :index="items.id">
              <template slot="title">
                <m-switch
                  v-model="items.checked"
                  :width="32"
                  @change="handleSelect(items)"
                  size="mini">
                </m-switch>
                <span slot="title">{{items.label}}</span>
              </template>
            </el-menu-item>
          </template>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
  // import find from 'lodash/find';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import MSwitch from '@/components/Switch/index.vue';

  @Component({
    name: 'LeftNav',
    components: {
      MSwitch,
    },
    data() {
      return {
        isCollapse: false,
        value2: false,
        menus: [
          {
            id: 'important-watcher',
            icon: '',
            label: '重要天气监测',
            expand: true,
            children: [
              {
                id: 'radar',
                icon: '',
                label: '雷达回波',
                checked: true,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'image-layer',
                showSlider: true,
                layerExtent: [],
                pId: 'important-watcher',
              },
              {
                id: 'cloud',
                icon: '',
                label: '卫星云图',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                showSlider: true,
                renderType: 'xyz-layer',
                pId: 'important-watcher',
              },
              {
                id: 'light',
                icon: '',
                label: '闪电定位',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'marker-cluster',
                pId: 'important-watcher',
              },
              {
                id: 'typhoon',
                icon: '',
                label: '台风',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'typhoon',
                pId: 'important-watcher',
              },
            ],
          },
          {
            id: 'forcast-weather',
            icon: '',
            label: '重要天气预报',
            expand: false,
            children: [
              {
                id: 'wind-10m',
                icon: '',
                label: '真高 10m 风',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'scatter',
                showSlider: true,
                layerExtent: [],
                pId: 'forcast-weather',
                elem: 'WIND',
                level: 'P0000',
              },
              {
                id: 'wind-100m',
                icon: '',
                label: '真高 100m 风',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'scatter',
                showSlider: true,
                layerExtent: [],
                pId: 'forcast-weather',
                elem: 'WIND100',
                level: 'P0000',
              },
            ],
          },
          {
            id: 'temp-wind',
            icon: '',
            label: '大气风温',
            expand: false,
            children: [
              {
                id: 'temp-wind-1000',
                icon: '',
                label: '1000Pa',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                elem: 'WINDTT',
                level: 'P1000',
                renderType: 'scatter',
                pId: 'temp-wind',
              },
              {
                id: 'temp-wind-850',
                icon: '',
                label: '850Pa',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'scatter',
                elem: 'WINDTT',
                level: 'P0850',
                pId: 'temp-wind',
              },
              {
                id: 'temp-wind-700',
                icon: '',
                label: '700Pa',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'scatter',
                pId: 'temp-wind',
                elem: 'WINDTT',
                level: 'P0700',
              },
              {
                id: 'temp-wind-500',
                icon: '',
                label: '500Pa',
                checked: false,
                group: false,
                groupLabel: '',
                children: false,
                serviceUrl: '',
                renderType: 'scatter',
                pId: 'temp-wind',
                elem: 'WINDTT',
                level: 'P0500',
              },
            ],
          },
        ],
      };
    },
  })

  export default class extends Vue {
    private isCollapse: boolean | undefined;

    private menus: any;

    @Watch('$route')

    created() {
    }

    private handleOpen(key: string, keyPath: string) {
      console.log(key, keyPath);
    }

    private handleClose(key: string, keyPath: string) {
      console.log(key, keyPath);
    }

    private handleSelect(value: any) {
      const configs = [];
      for (let i = 0; i < this.menus.length; i++) {
        const childs = this.menus[i];
        if (childs && childs.children.length > 0) {
          for (let j = 0; j < childs.children.length; j++) {
            const item = childs.children[j];
            if (item.id === value.id && item.checked) {
              configs.push(item);
            } else {
              this.$set(item, 'checked', false);
            }
          }
        }
      }
      this.$store.dispatch('actionLayerConfig', {
        layers: configs,
        emit: true,
      });
    }
  }
</script>

<style lang="less" scoped>
  .aviation-nav {
    float: left;
    width: 170px;
    height: calc(100% - 60px);

    background: #282a35;
    border-bottom: 1px solid #373c4f;

    .el-scrollbar {
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden!important;
        overflow-y: scroll;
      }

      /deep/ .el-scrollbar__bar.is-horizontal {
        display: none;
      }
    }

    .el-menu-vertical {
      /deep/ .el-submenu__title {
        padding: 0 15px 0 10px;
      }
    }
  }
</style>
